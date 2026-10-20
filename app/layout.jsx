import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './styles.css'
export const metadata = { title: { default: 'DB_TCGDCS · Database Docs', template: '%s · DB_TCGDCS' }, description: 'คู่มือโครงสร้างและกระบวนการของฐานข้อมูล DB_TCGDCS', robots: { index: false, follow: false } }
export default async function RootLayout({ children }) {
  const pageMap=await getPageMap()
  return <html lang="th" dir="ltr" suppressHydrationWarning><Head /><body><Layout
    navbar={<Navbar logo={<span className="brand"><span className="brand-icon">D</span><strong>TCGDCS</strong><span className="brand-sub">/ DATABASE DOCS</span></span>} />}
    pageMap={pageMap}
    footer={<Footer><span>DB_TCGDCS · UAT schema snapshot · 20 ตุลาคม 2026</span></Footer>}
    editLink={null} feedback={{ content: null }} sidebar={{ defaultMenuCollapseLevel: 1 }} toc={{ title: 'ในหน้านี้' }}
  >{children}</Layout></body></html>
}
