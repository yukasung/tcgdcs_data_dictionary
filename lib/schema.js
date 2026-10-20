import fs from 'node:fs'
import path from 'node:path'
const base = path.join(process.cwd(), 'data', 'generated')
let snapshot;
export function readIndex() { return snapshot ||= JSON.parse(fs.readFileSync(path.join(base, 'index.json'), 'utf8')) }
export function readObject(kind, id) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(id)) return null
  const file = path.join(base, kind, `${id}.json`)
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null
}
export function tableUrl(id) { return `/tables/${encodeURIComponent(id)}/` }
export function moduleUrl(id) { return `/modules/${encodeURIComponent(id)}/` }
