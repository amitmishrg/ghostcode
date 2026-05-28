import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

export function getConfigDir() {
  return process.env.GHOSTCODE_CONFIG_DIR ?? join(homedir(), '.ghostcode');
}

export function encodeProjectPath(cwd: string) {
  return resolve(cwd).replace(/[/\\:]/g, '-').replace(/^-/, '');
}

export function getProjectSessionsDir(cwd: string) {
  return join(getConfigDir(), 'projects', encodeProjectPath(cwd));
}
