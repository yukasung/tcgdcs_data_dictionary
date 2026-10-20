import assert from 'node:assert/strict'
import { validCredentials } from '../lib/docs-access.mjs'

const header = value => `Basic ${Buffer.from(value).toString('base64')}`
assert.equal(await validCredentials(header('docs:test-password'), 'test-password'), true)
for (const value of [null, '', 'Bearer abc', 'Basic !!!', header('admin:test-password'), header('docs:wrong')]) {
  assert.equal(await validCredentials(value, 'test-password'), false)
}
assert.equal(await validCredentials(header('docs:test-password'), ''), false)
assert.equal(await validCredentials(header('docs:pass:with:colons'), 'pass:with:colons'), true)
console.log('Credential checks passed')
