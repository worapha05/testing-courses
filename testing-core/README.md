# Advanced Testing Strategies — Zero to Expert

bootcamp เรียนรู้ **กลยุทธ์การทดสอบซอฟต์แวร์ขั้นสูงและ QA Automation Engineering** แบบครบวงจร
จาก Testing Philosophy / Unit Mastery → Integration / Mocking / BDD → Enterprise E2E / Flakiness / Non-Functional / Continuous Testing

---

## เป้าหมายของหลักสูตร

เมื่อจบหลักสูตรนี้ คุณจะสามารถ:

- อธิบาย **STLC**, ต้นทุนของบั๊ก และออกแบบการกระจายเทสตาม **Testing Pyramid** ได้จริง
- เขียน **Unit Test** ที่ isolated / deterministic ด้วย AAA Pattern และแยก Code Coverage กับ Test Coverage ได้ชัดเจน
- ปฏิบัติ **TDD (Red-Green-Refactor)** เพื่อออกแบบโค้ดที่ทดสอบได้และหลีกเลี่ยง anti-patterns
- ใช้ **Mocks / Stubs / Spies / Fakes** และวางกลยุทธ์ Integration / Component / DB testing
- เขียนสเปกแบบมนุษย์อ่านได้ด้วย **BDD + Gherkin** และเชื่อมกับ automation runner
- สร้าง E2E ระดับองค์กรด้วย **Page Object Model**, จัดการ test data / teardown และลด **flaky tests**
- วางแผน **Performance / Security / Contract Testing** และผูกทั้ง pipeline เข้า **CI/CD Quality Gates**

---

## โครงสร้างหลักสูตร

| Level            | folder                                   | หัวข้อหลัก                                    | เวลาแนะนำ   |
| ---------------- | ---------------------------------------- | --------------------------------------------- | ----------- |
| 1 — Beginner     | [`01-beginner/`](./01-beginner/)         | STLC, Testing Pyramid, Unit AAA, TDD          | 1–2 สัปดาห์ |
| 2 — Intermediate | [`02-intermediate/`](./02-intermediate/) | Mocking, Integration boundaries, BDD/Gherkin  | 2–3 สัปดาห์ |
| 3 — Expert       | [`03-expert/`](./03-expert/)             | E2E POM, Flakiness, K6/Pact, CI Quality Gates | 2–4 สัปดาห์ |

แต่ละระดับประกอบด้วย:

1. **`README.md`** — ทฤษฎี ปรัชญาการทดสอบ และกลยุทธ์คุณภาพซอฟต์แวร์ (ภาษาไทย) + Best Practices
2. **`examples/`** — โค้ดตัวอย่าง TypeScript/JavaScript (และ script K6) ที่แสดงโครงสร้าง Test Suite ที่ดี
3. **`LAB.md`** — โจทย์ปฏิบัติพร้อมเฉลยวิธีคิด โครงสร้างไฟล์ และโค้ดครบใน `lab/solution/`

---

## ข้อกำหนดเบื้องต้น

- ความรู้พื้นฐาน programming (ตัวแปร, function, async)
- เคยเขียน JavaScript หรือ TypeScript มาบ้าง
- ติดตั้ง [Node.js 20 LTS+](https://nodejs.org/)
- (ระดับ Intermediate+) แนะนำให้มี Docker สำหรับแนวคิด Testcontainers
- (ระดับ Expert) รู้จักพื้นฐาน HTTP API และ CI อย่างคร่าว ๆ

```bash
node -v # ควรเป็น v20.x ขึ้นไป
npm -v
```

---

## วิธีใช้ Bootcamp

1. อ่าน `README.md` ของระดับนั้นให้จบ — โฟกัสที่ **ทำไมทดสอบแบบนี้** ไม่ใช่แค่เครื่องมือ
2. เปิด `examples/` แล้วอ่าน/รันทีละ folder
3. ทำ Lab ใน `LAB.md` **ด้วยตัวเองก่อน** แล้วค่อยดูเฉลยใน `lab/solution/`
4. ไประดับถัดไปเมื่ออธิบาย trade-off ของกลยุทธ์เทสได้โดยไม่พึ่ง script ลอกตาม

```bash
cd advanced-testing-strategies

# Beginner — Unit + TDD examples
cd 01-beginner/examples/02-unit-aaa && npm install && npm test

# Intermediate — Mocking
cd ../../examples/01-mocking-isolation && npm install && npm test

# Expert — ดูตัวอย่าง POM / K6 / CI YAML ตาม README ของระดับนั้น
```

---

## Learning Path (แนะนำ)

```text
[Beginner]
 STLC & Cost of Bugs
 ↓
 Testing Pyramid metrics
 ↓
 Unit AAA + Coverage mindset
 ↓
 TDD Red-Green-Refactor
 ↓
[Intermediate]
 Mocks / Stubs / Spies / Fakes
 ↓
 Integration & DB boundaries
 ↓
 BDD Gherkin → automation steps
 ↓
[Expert]
 E2E POM + test data lifecycle
 ↓
 Flakiness mitigation & parallelization
 ↓
 Perf (K6) + Contract (Pact) + SAST/DAST overview
 ↓
 Continuous Testing & Quality Gates
```

---

## แผนที่เครื่องมือที่ใช้ในหลักสูตร

| ชั้นเทส     | เครื่องมือหลักในตัวอย่าง                       |
| ----------- | ---------------------------------------------- |
| Unit        | Vitest / Node assert patterns                  |
| Integration | Vitest + in-memory / boundary fakes            |
| BDD         | Gherkin + custom step runner (แนว Cucumber)    |
| E2E         | Playwright-style Page Object Model (โครงสร้าง) |
| Performance | k6 scripts                                     |
| Contract    | Pact-style consumer/provider specs             |
| CI          | GitHub Actions quality gates                   |

> หมายเหตุ: หลักสูตรนี้เน้น **กลยุทธ์และโครงสร้าง** มากกว่าผูกติด vendor เดียว คุณสามารถย้ายแนวคิดไป Jest, Pytest, Cypress, Locust ได้โดยตรง

---

## Checklist ก่อนจบหลักสูตร

- [ ] วาด Testing Pyramid ของ project จริง พร้อมสัดส่วนและเหตุผล
- [ ] เขียน Unit suite ด้วย AAA และอธิบายว่า coverage อะไรยังไม่พอ
- [ ] ทำ TDD อย่างน้อย 1 feature จนถึง Refactor
- [ ] Mock external API/DB โดยไม่ให้เทสมี side effects
- [ ] เขียน Gherkin scenario และ map เป็น automation steps
- [ ] ออกแบบ POM + fixture สำหรับ E2E และระบุจุดที่เสี่ยง flaky
- [ ] เพิ่ม quality gate ใน CI (unit + coverage + smoke E2E)

---

## ต่อไปนี้

เริ่มที่ [`01-beginner/README.md`](./01-beginner/README.md)
