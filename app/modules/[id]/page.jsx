import Link from 'next/link'
import {notFound} from 'next/navigation'
import {readIndex,readObject,tableUrl,moduleUrl} from '../../../lib/schema'
import DocPage from '../../../components/ReferencePage'
export const dynamicParams=false
export function generateStaticParams(){return readIndex().modules.map(m=>({id:m.id}))}
export async function generateMetadata({params}){return {title:(await params).id}}
export default async function Page({params}){
 const m=readObject('modules',(await params).id);if(!m)notFound();const i=readIndex(),tables=new Set(i.tables.map(t=>t.id)),modules=new Set(i.modules.map(t=>t.id))
 return <DocPage eyebrow={`${m.schema.toUpperCase()} / ${m.type.replaceAll('_',' ')}`} title={m.name} intro="โค้ด SQL ต้นฉบับจาก snapshot ใช้เพื่ออ่านและทำความเข้าใจกระบวนการ"><Link className="back-link" href="/modules/">← SQL Modules ทั้งหมด</Link><h2>อ้างอิงไปยัง</h2><div className="table-scroll"><table><thead><tr><th>Object</th><th>ขอบเขต</th></tr></thead><tbody>{m.dependencies.map((d,n)=>{const id=`${d.referenced_schema_name||'dbo'}.${d.referenced_entity_name}`,external=d.referenced_database_name||d.referenced_server_name;return <tr key={n}><td>{!external&&(tables.has(id)||modules.has(id))?<Link href={tables.has(id)?tableUrl(id):moduleUrl(id)}>{id}</Link>:<code>{id}</code>}</td><td>{[d.referenced_server_name,d.referenced_database_name].filter(Boolean).join('.')||'ฐานข้อมูลนี้'}{d.is_ambiguous?' · ambiguous':''}</td></tr>})}</tbody></table></div>{!m.dependencies.length&&<p className="muted">ไม่มีรายการ dependency ที่บันทึกไว้</p>}<h2>SQL Definition</h2><details className="sql-definition" open><summary>อ่านโค้ดต้นฉบับ · {m.definition?.length.toLocaleString()} characters</summary><pre data-pagefind-ignore><code>{m.definition||'ไม่พบ definition'}</code></pre></details></DocPage>
}
