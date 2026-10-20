import fs from 'node:fs'
import path from 'node:path'
import { createIndex, close } from 'pagefind'
const staticBuild = process.env.DOCS_OUTPUT === 'export'
const target = staticBuild ? 'out/_pagefind' : 'public/_pagefind'
const { index } = await createIndex({ forceLanguage: 'th' })
const result = await index.addDirectory({ path: staticBuild ? 'out' : '.next/server/app' })
if (result.errors.length) throw new Error(result.errors.join('\n'))
if (!result.page_count) throw new Error('No HTML pages were indexed')
const written = await index.getFiles()
if (written.errors.length) throw new Error(written.errors.join('\n'))
for (const file of written.files) {
  const destination = path.join(target, file.path)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, file.content)
}
await index.deleteIndex()
await close()
if (!staticBuild) {
  const standalone = '.next/standalone'
  fs.cpSync('data/generated', path.join(standalone, 'data/generated'), { recursive: true })
  fs.cpSync('public', path.join(standalone, 'public'), { recursive: true })
  fs.cpSync('.next/static', path.join(standalone, '.next/static'), { recursive: true })
}
console.log(`Search indexed ${result.page_count} pages; output ready`)
