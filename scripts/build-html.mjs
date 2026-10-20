import { spawnSync } from 'node:child_process'
for (const [script, args] of [['scripts/prepare-data.mjs', []], ['node_modules/next/dist/bin/next', ['build']], ['scripts/postbuild.mjs', []]]) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit', env: { ...process.env, DOCS_OUTPUT: 'export' } })
  if (result.status !== 0) process.exit(result.status || 1)
}
