import fs from 'node:fs'
import path from 'node:path'
const data = JSON.parse(fs.readFileSync('data/schema.json', 'utf8').replace(/^\uFEFF/, ''))
const output = 'data/generated'
for (const kind of ['tables', 'modules']) fs.mkdirSync(path.join(output, kind), { recursive: true })
export function domain(name) {
  if (/^(TEMP|tmp|tem_|tmm_)/i.test(name)) return 'staging'
  if (/^(System|Syatem)/i.test(name)) return 'master'
  if (/^(ACC|ADDData)/i.test(name)) return 'accounting'
  if (/^DEB/.test(name)) return 'collection'
  if (/^TDR/.test(name)) return 'restructuring'
  if (/^LT/.test(name)) return 'legal'
  if (/^NCB/.test(name)) return 'ncb'
  if (/^Data(Users|Roles|UserRoles|RoleMenu)/.test(name)) return 'access'
  if (/^(History|TableGrowth|DCSCard002)/.test(name)) return 'operations'
  return 'core'
}
const domains = {
  core: ['ลูกหนี้และการ์ดหนี้', 'ข้อมูลหลักของลูกหนี้ LG การ์ดหนี้ และรายการเคลื่อนไหว'],
  accounting: ['บัญชีและรับชำระ', 'ใบเสร็จ การปรับปรุงรายการ หนี้สูญ และการปิดบัญชี'],
  collection: ['ติดตามหนี้', 'มอบหมายงาน ผู้ติดตามหนี้ OA คำขอชำระและ Bill Payment'],
  restructuring: ['ปรับโครงสร้างหนี้', 'สัญญา TDR แผนผ่อนชำระ การอนุมัติและการคำนวณใหม่'],
  legal: ['งานคดีและกฎหมาย', 'คดี ลูกหนี้ในคดี สำนักงานกฎหมาย กิจกรรมและค่าใช้จ่าย'],
  ncb: ['รายงานข้อมูลเครดิต', 'ข้อมูลรายงาน NCB กฎสถานะ DPD และการตรวจสอบผลรายงาน'],
  master: ['ข้อมูลอ้างอิงและตั้งค่า', 'สถานะ เงื่อนไข ธนาคาร หน่วยงาน มาตรการ และกฎรับชำระ'],
  access: ['ผู้ใช้และสิทธิ์ในระบบ', 'ผู้ใช้ บทบาท และเมนูที่แอปพลิเคชันกำหนด'],
  operations: ['งานระบบและประวัติ', 'คิวงาน ประวัติการประมวลผลและการติดตาม'],
  staging: ['พักข้อมูลและสำเนา', 'ตาราง TEMP / tmp และสำเนาต่าง ๆ ต้องตรวจการใช้งานจริงเพิ่มเติม']
}
const key = (s, n) => `${s}.${n}`
const group = (rows, fn) => {
  const map = new Map()
  for (const row of rows) { const k = fn(row); if (!map.has(k)) map.set(k, []); map.get(k).push(row) }
  return map
}
const cols = group(data.columns, x => key(x.schema_name, x.table_name))
const indexes = group(data.indexes, x => key(x.schema_name, x.table_name))
const outgoing = group(data.foreign_keys, x => key(x.parent_schema, x.parent_table))
const incoming = group(data.foreign_keys, x => key(x.referenced_schema, x.referenced_table))
const checks = group(data.checks, x => key(x.schema_name, x.table_name))
const referenced = group(data.dependencies.filter(x => !x.referenced_database_name && !x.referenced_server_name), x => key(x.referenced_schema_name || 'dbo', x.referenced_entity_name))
const tables = data.tables.map(t => {
  const id = key(t.schema_name, t.name)
  const ix = indexes.get(id) || []
  const pk = ix.filter(x => x.is_primary_key).sort((a,b) => a.key_ordinal-b.key_ordinal).map(x => x.column_name)
  const short = { id, name: t.name, schema: t.schema_name, domain: domain(t.name), description: t.description || '', columnCount: (cols.get(id) || []).length, pk, incoming: (incoming.get(id) || []).length, outgoing: (outgoing.get(id) || []).length }
  const full = { ...short, temporal: t.temporal_type_desc, memoryOptimized: t.is_memory_optimized, columns: cols.get(id) || [], indexes: ix, foreignKeys: outgoing.get(id) || [], referencedBy: incoming.get(id) || [], checks: checks.get(id) || [], dependencies: referenced.get(id) || [] }
  fs.writeFileSync(path.join(output, 'tables', `${id}.json`), JSON.stringify(full))
  return short
})
const modules = data.modules.map(m => {
  const id = key(m.schema_name, m.name)
  const short = { id, name: m.name, schema: m.schema_name, type: m.type_desc }
  fs.writeFileSync(path.join(output, 'modules', `${id}.json`), JSON.stringify({ ...short, definition: m.definition, dependencies: data.dependencies.filter(x => x.referencing_schema === m.schema_name && x.referencing_name === m.name) }))
  return short
})
const index = { database: data.database[0], snapshotDate: '2026-10-20', tables, modules, domains, counts: { tables: tables.length, columns: data.columns.length, foreignKeys: data.foreign_keys.length, checks: data.checks.length, procedures: modules.filter(m => m.type === 'SQL_STORED_PROCEDURE').length, functions: modules.filter(m => m.type.includes('FUNCTION')).length, views: modules.filter(m => m.type === 'VIEW').length, indexes: new Set(data.indexes.map(x => `${x.schema_name}.${x.table_name}.${x.index_name}`)).size } }
fs.writeFileSync(path.join(output, 'index.json'), JSON.stringify(index))
console.log(`Generated ${tables.length} tables and ${modules.length} SQL modules`)
