import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const fallbackNpmCli = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
const npmCli = process.env.npm_execpath || (existsSync(fallbackNpmCli) ? fallbackNpmCli : require.resolve('npm/bin/npm-cli.js'));
const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key, value]) => key && !key.startsWith('=') && value != null)
);
let isShuttingDown = false;

function run(label, args) {
  const child = spawn(process.execPath, [npmCli, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: safeEnv,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${label}] exited via signal ${signal}`);
      return;
    }
    if (code !== 0) {
      console.log(`[${label}] exited with code ${code}`);
    }
  });

  return child;
}

const web = run('web', ['run', 'dev:frontend']);
const api = run('api', ['run', 'api:dev']);

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  for (const proc of [api, web]) {
    if (!proc.killed) {
      proc.kill('SIGTERM');
    }
  }
}

web.on('exit', () => shutdown());
api.on('exit', (code, signal) => {
  if (signal || code === 0 || isShuttingDown) return;
  console.warn('[api] backend failed to start. Frontend will keep running.');
  console.warn('[api] run `npm install` (or install backend deps) and retry.');
});

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});
