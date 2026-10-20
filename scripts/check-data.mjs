import fs from 'node:fs'
import assert from 'node:assert/strict'
const i = JSON.parse(fs.readFileSync('data/generated/index.json', 'utf8'))
const ids = new Set(i.tables.map(x => x.id))
assert.equal(ids.size, i.counts.tables)
assert.equal(i.tables.reduce((n,x) => n+x.columnCount,0),i.counts.columns)
for (const t of i.tables) {
  const full = JSON.parse(fs.readFileSync(`data/generated/tables/${t.id}.json`, 'utf8'))
  assert.equal(full.columns.length, t.columnCount)
  for (const f of full.foreignKeys) assert(ids.has(`${f.referenced_schema}.${f.referenced_table}`))
}
for (const m of i.modules) assert(fs.existsSync(`data/generated/modules/${m.id}.json`))
console.log(`Validated ${i.tables.length} tables, ${i.counts.columns} columns and ${i.modules.length} modules`)
const moduleIds = new Set(i.modules.map(m=>m.id));
for (const file of fs.readdirSync('app', {recursive:true}).filter(x=>x.endsWith('.mdx'))) {
  const text=fs.readFileSync(`app/${file}`,'utf8');
  for(const match of text.matchAll(/\/(tables|modules)\/([^/"\s)]+)\//g)) {
    const target=decodeURIComponent(match[2]);
    assert((match[1]==='tables'?ids:moduleIds).has(target),`${file}: missing ${target}`);
  }
}
console.log('Guide reference links validated');
