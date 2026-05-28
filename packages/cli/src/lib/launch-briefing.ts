import { existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import {
  findSupportedChatModel,
  getToolContracts,
  Mode,
  type ModeType,
  type SupportedChatModelId,
} from '@ghostcode/shared';
import {
  getLoadedMemorySources,
  getRuntimeCwd,
  getRuntimeSettings,
} from './config-loader';
import { getConfigDir } from './paths';
import { listSessions } from './session-store';

export type BriefingRowStatus = 'ok' | 'warn' | 'active' | 'idle';

export type BriefingRow = {
  id: string;
  status: BriefingRowStatus;
  label: string;
  value: string;
};

export type LaunchBriefing = {
  projectPath: string;
  projectName: string;
  rows: BriefingRow[];
  commandHints: string[];
};

function formatProjectPath(cwd: string) {
  const resolved = resolve(cwd);
  const home = homedir();
  if (resolved.startsWith(home)) {
    return `~${resolved.slice(home.length)}`;
  }
  return resolved;
}

function getMemoryLabel(cwd: string) {
  const sources = getLoadedMemorySources(cwd);

  if (sources.length === 0) {
    return { status: 'idle' as const, value: 'none loaded' };
  }

  if (sources.length === 1) {
    return { status: 'ok' as const, value: sources[0]! };
  }

  return {
    status: 'ok' as const,
    value: `${sources.length} files (${sources[0]!})`,
  };
}

function getSettingsLabel(cwd: string) {
  const parts: string[] = [];
  if (existsSync(join(getConfigDir(), 'settings.json'))) {
    parts.push('~/.ghostcode');
  }
  if (existsSync(join(cwd, '.ghostcode', 'settings.json'))) {
    parts.push('.ghostcode');
  }
  if (existsSync(join(cwd, '.ghostcode', 'settings.local.json'))) {
    parts.push('.ghostcode/local');
  }

  if (parts.length === 0) {
    return { status: 'idle' as const, value: 'defaults only' };
  }

  return { status: 'ok' as const, value: parts.join(' + ') };
}

function getProviderKeyStatus(modelId: SupportedChatModelId) {
  const model = findSupportedChatModel(modelId);
  if (!model) {
    return { status: 'warn' as const, value: 'unknown model' };
  }

  const configured =
    model.provider === 'anthropic'
      ? Boolean(process.env.ANTHROPIC_API_KEY)
      : Boolean(process.env.OPENAI_API_KEY);

  if (!configured) {
    return {
      status: 'warn' as const,
      value: `${model.provider} key missing`,
    };
  }

  return {
    status: 'ok' as const,
    value: `${model.provider} configured`,
  };
}

function formatToolList(mode: ModeType) {
  const tools = Object.keys(getToolContracts(mode));
  if (tools.length <= 4) {
    return tools.join(' · ');
  }

  return `${tools.slice(0, 4).join(' · ')} · +${tools.length - 4}`;
}

export function getLaunchBriefing(
  cwd = getRuntimeCwd(),
  mode: ModeType = Mode.BUILD,
  model: SupportedChatModelId,
): LaunchBriefing {
  const projectPath = formatProjectPath(cwd);
  const memory = getMemoryLabel(cwd);
  const settings = getSettingsLabel(cwd);
  const provider = getProviderKeyStatus(model);
  const sessions = listSessions(cwd);

  const rows: BriefingRow[] = [
    {
      id: 'project',
      status: 'active',
      label: 'PROJECT',
      value: projectPath,
    },
    {
      id: 'memory',
      status: memory.status,
      label: 'MEMORY',
      value: memory.value,
    },
    {
      id: 'settings',
      status: settings.status,
      label: 'CONFIG',
      value: settings.value,
    },
    {
      id: 'model',
      status: 'ok',
      label: 'MODEL',
      value: model,
    },
    {
      id: 'mode',
      status: 'ok',
      label: 'MODE',
      value: `${mode} · ${Object.keys(getToolContracts(mode)).length} tools`,
    },
    {
      id: 'tools',
      status: 'ok',
      label: 'TOOLS',
      value: formatToolList(mode),
    },
    {
      id: 'keys',
      status: provider.status,
      label: 'KEYS',
      value: provider.value,
    },
    {
      id: 'sessions',
      status: sessions.length > 0 ? 'ok' : 'idle',
      label: 'SESSIONS',
      value:
        sessions.length === 0
          ? 'none yet — start typing below'
          : `${sessions.length} saved in this project`,
    },
  ];

  return {
    projectPath,
    projectName: basename(resolve(cwd)),
    rows,
    commandHints: ['/sessions', '/models', '/theme', '/agents', '/new'],
  };
}
