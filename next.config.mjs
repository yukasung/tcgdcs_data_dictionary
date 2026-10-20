import nextra from 'nextra'
const withNextra = nextra({ search: { codeblocks: false } })
export default withNextra({
  output: process.env.DOCS_OUTPUT === 'export' ? 'export' : 'standalone',
  distDir: process.env.DOCS_DIST || '.next',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { cpus: 2 }
})
