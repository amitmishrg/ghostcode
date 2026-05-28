import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { getProjectSessionsDir } from './paths';

export type SessionMeta = {
  id: string;
  title: string;
  cwd: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionRecord = SessionMeta & {
  messages: unknown[];
};

type SessionHeaderLine = {
  type: 'session';
  id: string;
  title: string;
  cwd: string;
  createdAt: string;
};

type SessionSnapshotLine = {
  type: 'snapshot';
  messages: unknown[];
  updatedAt: string;
};

function ensureSessionsDir(cwd: string) {
  const dir = getProjectSessionsDir(cwd);
  if (!existsSync(dir)) {
    mkdirSync(dir, { mode: 0o700, recursive: true });
  }
  return dir;
}

function sessionFilePath(cwd: string, sessionId: string) {
  return join(ensureSessionsDir(cwd), `${sessionId}.jsonl`);
}

function createSessionId() {
  return crypto.randomUUID();
}

function readSessionFile(path: string): SessionRecord | null {
  if (!existsSync(path)) return null;

  const lines = readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) return null;

  const header = JSON.parse(lines[0]!) as SessionHeaderLine;
  let messages: unknown[] = [];
  let updatedAt = header.createdAt;

  for (const line of lines.slice(1)) {
    const snapshot = JSON.parse(line) as SessionSnapshotLine;
    if (snapshot.type === 'snapshot') {
      messages = snapshot.messages;
      updatedAt = snapshot.updatedAt;
    }
  }

  return {
    id: header.id,
    title: header.title,
    cwd: header.cwd,
    createdAt: header.createdAt,
    updatedAt,
    messages,
  };
}

export function createSession(cwd: string, title: string): SessionRecord {
  const id = createSessionId();
  const now = new Date().toISOString();
  const resolvedCwd = resolve(cwd);
  const path = sessionFilePath(resolvedCwd, id);

  const header: SessionHeaderLine = {
    type: 'session',
    id,
    title,
    cwd: resolvedCwd,
    createdAt: now,
  };

  writeFileSync(path, `${JSON.stringify(header)}\n`, { mode: 0o600 });

  return {
    id,
    title,
    cwd: resolvedCwd,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function listSessions(cwd: string): SessionMeta[] {
  const dir = getProjectSessionsDir(resolve(cwd));
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith('.jsonl'))
    .map((name) => readSessionFile(join(dir, name)))
    .filter((session): session is SessionRecord => session != null)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .map(({ id, title, cwd: sessionCwd, createdAt, updatedAt }) => ({
      id,
      title,
      cwd: sessionCwd,
      createdAt,
      updatedAt,
    }));
}

export function loadSession(
  cwd: string,
  sessionId: string,
): SessionRecord | null {
  return readSessionFile(sessionFilePath(resolve(cwd), sessionId));
}

export function saveSessionMessages(
  cwd: string,
  sessionId: string,
  messages: unknown[],
) {
  const path = sessionFilePath(resolve(cwd), sessionId);
  const snapshot: SessionSnapshotLine = {
    type: 'snapshot',
    messages,
    updatedAt: new Date().toISOString(),
  };

  appendFileSync(path, `${JSON.stringify(snapshot)}\n`, { mode: 0o600 });
}

export function getSessionMtime(cwd: string, sessionId: string) {
  const path = sessionFilePath(resolve(cwd), sessionId);
  if (!existsSync(path)) return 0;
  return statSync(path).mtimeMs;
}
