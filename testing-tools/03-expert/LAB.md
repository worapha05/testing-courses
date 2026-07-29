# Lab ระดับ Expert — platform “ForgeGate”

## เป้าหมาย

สร้างระบบทดสอบอัตโนมัติระดับ production สำหรับ **ForgeGate** (login + route guard + billing stub):

1. เขียน Cypress E2E ครบ journey
2. ใช้ `cy.intercept` + custom command `cy.loginAs`
3. ตั้ง coverage threshold และ optimize Vite chunks
4. เขียน GitHub Actions workflow ให้รัน headless E2E

สถานการณ์จำลองที่ระบบพัง:

| อาการ                               | สาเหตุ                                            |
| ----------------------------------- | ------------------------------------------------- |
| E2E แดงเป็นช่วง ๆ                   | ยิง API จริงที่ช้า/ล่ม — ต้อง stub ด้วย intercept |
| Guard พาไป login แต่ไม่กลับหน้าเดิม | ไม่ส่ง/ไม่อ่าน `next` query                       |
| CI เขียวทั้งที่ bundle บวม          | ไม่มี build step / ไม่แยก manualChunks            |
| Coverage 0% ใน CI                   | ไม่เปิด collectCoverage                           |

ทำด้วยตัวเองก่อน แล้วเทียบ [`lab/solution/`](./lab/solution/)

---

## กรณีศึกษา

ForgeGate เป็น admin portal
QA พบว่าเทส E2E พังทุกครั้งที่ staging API ช้า และไม่มีใครรัน Cypress ใน PR

คุณต้องส่งมอบ:

- แอป demo ที่ login ได้ (localStorage session) + กัน `/billing` ด้วย auth
- Suite Cypress ที่เสถียรด้วย network stub
- Workflow CI ที่ fail ถ้า unit หรือ E2E พัง

---

## โจทย์

### ส่วนที่ 1 — แอปและ Route Guard

สร้างแอป (Vite + React Router ก็ได้) ที่มี:

- `/login` — form email/password (`data-cy` ตามเฉลยหรือเทียบเท่า accessible)
- `/dashboard` — ต้อง login
- `/billing` — ต้อง login และเรียก `GET /api/billing`

เมื่อยังไม่ login แล้วเข้า `/billing` → ไป `/login?next=/billing`
หลัง login สำเร็จ → กลับ `/billing`

### ส่วนที่ 2 — Cypress journeys

เขียนอย่างน้อย 3 สเปก:

1. Login สำเร็จถึง dashboard
2. Login ผิดแสดง alert
3. Guard redirect + กลับ next หลัง login

### ส่วนที่ 3 — Advanced patterns

1. Custom command `cy.loginAs('admin' | 'member')`
2. `cy.intercept('GET', '/api/billing', ...)` จำลอง 200 และ 500
3. เคส member ได้ 403 แล้วเห็น alert

### ส่วนที่ 4 — Coverage + Optimization + CI

1. Jest coverageThreshold อย่างน้อย lines 70 สำหรับ util เล็ก ๆ
2. `vite.config` มี `manualChunks` แยก `react-vendor`
3. GitHub Actions: install → unit → build → `cypress run`

### ส่วนที่ 5 — คำถามคิด (`NOTES.md`)

1. เมื่อไหร่ไม่ควร stub ด้วย `cy.intercept`?
2. ข้อต่างของ code splitting กับ tree shaking?
3. ทำไมต้อง upload screenshot เมื่อ Cypress fail ใน CI?

---

## เกณฑ์ผ่าน

- [ ] E2E 3+ เคสผ่านบนเครื่องคุณ (headless หรือ open)
- [ ] มี custom command + intercept
- [ ] มี workflow YAML และ NOTES.md

---

## เฉลย

ดู [`lab/solution/`](./lab/solution/) — รวมแอป, Cypress, coverage config และ `ci.yml`
