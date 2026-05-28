import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import dotenv from 'dotenv';
import {
  DEFAULT_CHAT_MODEL_ID,
  findSupportedChatModel,
  type SupportedChatModelId,
} from '@ghostcode/shared';
import { getConfigDir } from './paths';

export type GhostcodeSettings = {
  env?: Record<string, string>;
  defaultModel?: string;
  themeName?: string;
};

function readJsonFile(path: string): GhostcodeSettings {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as GhostcodeSettings;
  } catch {
    return {};
  }
}

function readTextFile(path: string) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

export function loadMergedSettings(cwd: string): GhostcodeSettings {
  const user = readJsonFile(join(getConfigDir(), 'settings.json'));
  const project = readJsonFile(join(cwd, '.ghostcode', 'settings.json'));
  const local = readJsonFile(join(cwd, '.ghostcode', 'settings.local.json'));

  return {
    ...user,
    ...project,
    ...local,
    env: {
      ...user.env,
      ...project.env,
      ...local.env,
    },
  };
}

function readPreferencesFile(
  path: string,
): Pick<GhostcodeSettings, 'themeName'> {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Pick<
      GhostcodeSettings,
      'themeName'
    >;
  } catch {
    return {};
  }
}

/** Theme precedence: local settings → project preferences → project settings → user preferences → user settings */
export function getMergedThemeName(cwd: string): string | undefined {
  const userSettings = readJsonFile(join(getConfigDir(), 'settings.json'));
  const projectSettings = readJsonFile(
    join(cwd, '.ghostcode', 'settings.json'),
  );
  const localSettings = readJsonFile(
    join(cwd, '.ghostcode', 'settings.local.json'),
  );
  const userPreferences = readPreferencesFile(
    join(getConfigDir(), 'preferences.json'),
  );
  const projectPreferences = readPreferencesFile(
    join(cwd, '.ghostcode', 'preferences.json'),
  );

  return (
    localSettings.themeName ??
    projectPreferences.themeName ??
    projectSettings.themeName ??
    userPreferences.themeName ??
    userSettings.themeName
  );
}

let runtimeCwd: string | null = null;
let runtimeSettings: GhostcodeSettings | null = null;

export function getRuntimeSettings(cwd = process.cwd()): GhostcodeSettings {
  if (runtimeSettings && runtimeCwd === cwd) {
    return runtimeSettings;
  }

  return loadMergedSettings(cwd);
}

export function applySettingsEnv(settings: GhostcodeSettings) {
  for (const [key, value] of Object.entries(settings.env ?? {})) {
    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = value;
    }
  }
}

export function getRuntimeCwd() {
  return runtimeCwd ?? process.cwd();
}

export function getLoadedMemorySources(cwd: string) {
  const projectRoot = resolve(cwd);
  const sources: string[] = [];
  const candidates = [
    { path: join(getConfigDir(), 'Ghost.md'), label: '~/.ghostcode/Ghost.md' },
    { path: join(projectRoot, 'Ghost.md'), label: 'Ghost.md' },
    {
      path: join(projectRoot, '.ghostcode', 'Ghost.md'),
      label: '.ghostcode/Ghost.md',
    },
    { path: join(projectRoot, 'Ghost.local.md'), label: 'Ghost.local.md' },
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate.path)) continue;
    const content = readTextFile(candidate.path).trim();
    if (content) sources.push(candidate.label);
  }

  return sources;
}

export function loadProjectMemory(cwd: string) {
  const projectRoot = resolve(cwd);
  const sections: string[] = [];
  const candidates = [
    join(getConfigDir(), 'Ghost.md'),
    join(projectRoot, 'Ghost.md'),
    join(projectRoot, '.ghostcode', 'Ghost.md'),
    join(projectRoot, 'Ghost.local.md'),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const content = readTextFile(path).trim();
    if (content) sections.push(content);
  }

  return sections.join('\n\n');
}

export function loadProjectDotEnv(cwd: string) {
  const dotenvPath = join(resolve(cwd), '.env');
  if (!existsSync(dotenvPath)) return;

  dotenv.config({ path: dotenvPath, quiet: true });
}

export function getDefaultModel(
  settings: GhostcodeSettings,
): SupportedChatModelId {
  const candidate = settings.defaultModel;
  if (candidate && findSupportedChatModel(candidate)) {
    return candidate as SupportedChatModelId;
  }

  return DEFAULT_CHAT_MODEL_ID;
}

export function validateApiKeyForModel(modelId: string) {
  const model = findSupportedChatModel(modelId);
  if (!model) {
    throw new Error(`Unsupported model: ${modelId}`);
  }

  if (model.provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Export it or add it to ~/.ghostcode/settings.json env block.',
    );
  }

  if (model.provider === 'openai' && !process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Export it or add it to ~/.ghostcode/settings.json env block.',
    );
  }
}

export function bootstrapRuntime(cwd: string) {
  runtimeCwd = cwd;
  runtimeSettings = loadMergedSettings(cwd);
  loadProjectDotEnv(cwd);
  applySettingsEnv(runtimeSettings);
  return runtimeSettings;
}
