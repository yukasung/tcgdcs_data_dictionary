# DB_TCGDCS Docs

เว็บเอกสารภาษาไทยแบบ standalone Next.js + Nextra สำหรับ schema snapshot ของ DB_TCGDCS วันที่ 20 ตุลาคม 2026

## เริ่มใช้งาน

ต้องมี Node.js 22 ขึ้นไป และ pnpm 10 ขึ้นไป

```sh
pnpm install
pnpm dev
```

เปิด http://127.0.0.1:3000 เอกสารใช้ไฟล์ snapshot ในโปรเจกต์ จึงไม่ต้องเชื่อม VPN หรือกรอกรหัสผ่านฐานข้อมูลตอนเปิดอ่าน

## Production แบบ standalone

```sh
pnpm build
pnpm start:standalone
```

หลัง build โฟลเดอร์ `.next/standalone` มี server และ assets พร้อมใช้งาน สามารถคัดลอกทั้งโฟลเดอร์ไปยังเครื่องที่มี Node.js แล้วรัน:

```sh
node server.js
```

บน Windows หากเริ่มจากโฟลเดอร์ standalone โดยตรง ใช้ `$env:HOSTNAME='127.0.0.1'` และ `$env:PORT='3000'` ก่อนเริ่ม server เพื่อให้ฟังเฉพาะเครื่องนี้

## HTML static

```sh
pnpm build:html
```

ผลลัพธ์อยู่ใน `out/` มี HTML แยกทุกตารางและ SQL module รวม JavaScript, CSS และดัชนีค้นหา ต้องเปิดผ่าน HTTP server เพื่อให้ routing และ search ทำงาน เช่น `python -m http.server 3000 --directory out` แล้วเปิด http://127.0.0.1:3000

`build:html` และ `build` ใช้ `.next` ร่วมกัน หากต้องการ standalone หลังทำ static ให้รัน `pnpm build` อีกครั้ง ผลลัพธ์ HTML ใน `out/` จะยังอยู่

## สิ่งที่มี

- คู่มือเริ่มอ่าน โครงสร้าง ความสัมพันธ์ และ workflows ภาษาไทย
- ตารางครบ 437 ตาราง คอลัมน์ 9,355 รายการ ค้นหาชื่อและคำอธิบายได้
- หน้า reference ของแต่ละตาราง พร้อม PK, FK เข้า/ออก, Indexes, Defaults, Computed columns และ Checks
- Stored Procedures 543, Functions 104 และ Views 4 พร้อมโค้ดและ dependency links
- Nextra sidebar, light/dark mode และ full-text search ผ่าน Pagefind หลัง production build
- หน้าคู่มือแบ่งสิ่งที่ยืนยันได้จาก metadata ออกจากส่วนที่ยังต้องตรวจข้อมูลจริง

การค้นหาชื่อและตัวกรองในหน้ารวมใช้ได้ทั้ง dev และ production ส่วนช่องค้นหาทั้งเว็บต้องผ่าน build เพื่อสร้าง Pagefind index

## อัปเดต snapshot

แทนที่ `data/schema.json` (รูปแบบเดียวกับไฟล์ส่งออกเดิม) แล้วรัน:

```sh
pnpm prepare:data
pnpm check
pnpm build
```

ตรวจบทอธิบายและตัวเลขใน `app/*.mdx` และหน้าคู่มือย่อยเมื่อ snapshot เปลี่ยน โค้ด reference สร้างจาก snapshot อัตโนมัติ

## โครงโปรเจกต์

- `app/`: คู่มือ MDX และหน้า reference ที่สร้างเป็น static pages
- `components/`: ตารางคอลัมน์ ตัวค้นหาและตัวกรอง
- `lib/schema.js`: อ่านเฉพาะข้อมูลของ object ที่ต้องใช้ฝั่ง server/build
- `data/schema.json`: snapshot ต้นฉบับ ไม่รวมแถวข้อมูลธุรกิจ
- `scripts/prepare-data.mjs`: แบ่งข้อมูลเป็นรายตาราง/module
- `scripts/postbuild.mjs`: สร้าง search index และรวม assets สำหรับ standalone

ไม่ต้องใช้ฐานข้อมูลจริงในการ build หรืออ่านเอกสาร โปรเจกต์นี้ไม่มีรหัสผ่าน ไม่มี API แก้ไขข้อมูล และไม่ได้เผยแพร่ไป hosting ภายนอก

## แหล่งอ้างอิง framework

- https://nextra.site/docs/docs-theme/start
- https://nextra.site/docs/guide/search
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output
## ชุดเวอร์ชันที่ตรวจสอบ

ใช้ Next.js 15.5.28 และ Nextra 4.6.1 พร้อม pin Zod 4.1.12 ผ่าน `pnpm-workspace.yaml` เนื่องจาก Zod รุ่นใหม่เปลี่ยนการตรวจ optional fields ของ theme configuration ควรติดตั้งจาก lockfile ก่อนอัปเดต dependencies

เมื่อ build แล้ว บน Windows สามารถเปิด `Start-Docs.cmd` แล้วไปที่ http://127.0.0.1:3000 ได้ ตัว launcher จะใช้ Node.js บน PATH หรือ bundled runtime ของ Codex ถ้ามีอยู่

## Frontend

รูปแบบหน้าจอใช้แนวทางเดียวกับ `yukasung/mattersolv_docs`: Nextra 4.6.1 พร้อม navbar ตัวอักษรเรียบ, typography และ sidebar มาตรฐาน, สารบัญหน้า, ธีมน้ำเงิน, หน้าคู่มือแบบเอกสาร และแผงตัวกรองรายการ รองรับ light/dark mode โดยรายละเอียดที่มาอยู่ใน `THIRD_PARTY_NOTICES.md`
