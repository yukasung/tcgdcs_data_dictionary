import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './styles.css'
export const metadata = { title: { default: 'TCGDCS Docs', template: '%s | TCGDCS Docs' }, description: 'คู่มือโครงสร้างและกระบวนการของฐานข้อมูล DB_TCGDCS', robots: { index: false, follow: false } }
export default async function RootLayout({ children }) {
  const pageMap=await getPageMap()
  return <html lang="th" dir="ltr" suppressHydrationWarning><Head /><body><Layout
    navbar={<Navbar logo={<span className="x:text-sm x:font-semibold x:tracking-normal x:sm:text-base">TCGDCS Docs</span>} />}
    pageMap={pageMap}
    footer={<Footer><p className="docs-footer">TCGDCS Docs · DB_TCGDCS · Snapshot 20 ตุลาคม 2026</p></Footer>}
    docsRepositoryBase="https://github.com/yukasung/tcgdcs_data_dictionary/tree/main"
    editLink={null} feedback={{ content: <span hidden /> }} sidebar={{ defaultMenuCollapseLevel: 1 }} toc={{ title: 'ในหน้านี้' }}
  >{children}</Layout></body></html>
}
