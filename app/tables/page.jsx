import { readIndex } from '../../lib/schema'
import DocPage from '../../components/ReferencePage'
import Explorer from '../../components/Explorer'
export const metadata={title:'พจนานุกรมตาราง'}
export default function Page(){const i=readIndex();return <DocPage eyebrow="DATA DICTIONARY" title="พจนานุกรมตาราง" intro="เริ่มจากหมวดงานหรือค้นหาชื่อตาราง เปิดแต่ละหน้าเพื่อดูคอลัมน์ คีย์ ความสัมพันธ์ และ SQL ที่อ้างถึง"><div className="note">ครบ {i.counts.tables} ตาราง · หมวดงานจัดตามชื่อเพื่อช่วยค้นหา ส่วนคำอธิบายคอลัมน์มาจากฐานข้อมูลจริง</div><Explorer rows={i.tables} domains={i.domains}/></DocPage>}
