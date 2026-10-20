import {readIndex} from '../../lib/schema'
import DocPage from '../../components/ReferencePage'
import Explorer from '../../components/Explorer'
export const metadata={title:'SQL Modules'}
export default function Page(){const i=readIndex();return <DocPage eyebrow="LOGIC & PROCESSING" title="SQL Modules" intro="สำรวจ Stored Procedures, Functions และ Views พร้อมโค้ดต้นฉบับและรายการ dependency"><div className="stat-grid"><div><strong>{i.counts.procedures}</strong>Stored Procedures</div><div><strong>{i.counts.functions}</strong>Functions</div><div><strong>{i.counts.views}</strong>Views</div></div><Explorer rows={i.modules} kind="modules"/></DocPage>}
