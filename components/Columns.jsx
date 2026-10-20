'use client'
import { useState } from 'react'
export function sqlType(c) {
  if (/^(n?varchar|n?char|varbinary|binary)$/.test(c.data_type)) return `${c.data_type}(${c.max_length===-1?'max':c.data_type.startsWith('n')?c.max_length/2:c.max_length})`
  if (/^(decimal|numeric)$/.test(c.data_type)) return `${c.data_type}(${c.precision},${c.scale})`
  if (/^(datetime2|datetimeoffset|time)$/.test(c.data_type)) return `${c.data_type}(${c.scale})`
  return c.data_type
}
export default function Columns({ columns, pk }) {
  const [q,setQ]=useState('')
  return <><label className="column-search"><span className="sr-only">ค้นหาคอลัมน์</span><input placeholder="ค้นหาคอลัมน์หรือคำอธิบาย…" value={q} onChange={e=>setQ(e.target.value)} /></label><div className="table-scroll"><table><thead><tr><th>คอลัมน์</th><th>ชนิดข้อมูล</th><th>NULL</th><th>ความหมาย / ค่าเริ่มต้น</th></tr></thead><tbody>{columns.filter(c=>`${c.name} ${c.description||''}`.toLowerCase().includes(q.toLowerCase())).map(c=><tr key={c.column_id}><td><code>{c.name}</code>{pk.includes(c.name)&&<span className="tag">PK</span>}{c.is_identity&&<span className="tag">IDENTITY</span>}</td><td><code>{sqlType(c)}</code></td><td>{c.is_nullable?'ได้':'ไม่ได้'}</td><td>{c.description||<span className="muted">ไม่มีคำอธิบายใน schema</span>}{c.default_definition&&<small className="default-value">Default: {c.default_definition}</small>}{c.computed_definition&&<small className="default-value">Computed: {c.computed_definition}</small>}</td></tr>)}</tbody></table></div></>
}
