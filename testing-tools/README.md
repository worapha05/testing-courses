📍 **Nav:** [`🏠 Dev Learning Courses Hub`](https://github.com/worapha05/dev-learning-courses-hub/blob/main/README.md) | [`📂 Testing Courses Index`](../README.md) | 📝 [`Prompt File`](https://github.com/worapha05/ai-learning-prompts-hub/blob/main/course-generation/testing-courses/testing-tools-prompt.md)

---

# Tooling & Testing Bootcamp — Zero to Expert

bootcamp เรียนรู้ **Modern Tooling และ Testing Ecosystems** แบบครบวงจร
เน้น **Webpack, Vite, Jest, React Testing Library และ Cypress**
จาก Build Tools Foundations → Component / Integration Testing → E2E Automation และ CI/CD Pipeline

---

## เป้าหมายของหลักสูตร

เมื่อจบหลักสูตรนี้ คุณจะสามารถ:

- อธิบายกลไก **Module Bundler** และเปรียบเทียบ **Webpack (Dependency Graph)** กับ **Vite (Native ESM)** ได้ชัดเจน
- ตั้งค่า project จากศูนย์ด้วย Webpack หรือ Vite รวมถึง assets, CSS preprocessor และ environment variables
- เขียน **Unit Test** ด้วย Jest: assertions, mocks และ async utilities
- ทดสอบ UI แบบ user-centric ด้วย **React Testing Library** (queries, events, loading states)
- Mock API ใน integration test ด้วย **MSW** หรือ Jest fetch mocks
- เขียน **E2E** ด้วย Cypress (journey, `cy.intercept`, custom commands)
- ตั้งค่า **Code Coverage**, optimize bundle (code splitting / tree shaking) และผูก Lint → Unit → E2E เข้า **GitHub Actions**

---

## โครงสร้างหลักสูตร

| Level            | folder                                   | หัวข้อหลัก                                      | เวลาแนะนำ   |
| ---------------- | ---------------------------------------- | ----------------------------------------------- | ----------- |
| 1 — Beginner     | [`01-beginner/`](./01-beginner/)         | Bundlers, Webpack/Vite setup, Jest unit testing | 1–2 สัปดาห์ |
| 2 — Intermediate | [`02-intermediate/`](./02-intermediate/) | RTL, queries/interactions, MSW integration      | 2–3 สัปดาห์ |
| 3 — Expert       | [`03-expert/`](./03-expert/)             | Cypress E2E, coverage, bundle optimization, CI  | 2–4 สัปดาห์ |

แต่ละระดับประกอบด้วย:

1. **`README.md`** — ทฤษฎีเชิงลึกภาษาไทย เน้นกลไก bundling และกลยุทธ์ออกแบบ Test Suite
2. **`examples/`** — ไฟล์ config และ script เทสที่รัน/อ่านตามได้จริง
3. **`LAB.md`** — โจทย์สถานการณ์จริงพร้อมเฉลยเต็มใน `lab/solution/`

---

## ข้อกำหนดเบื้องต้น

- ความรู้พื้นฐาน **JavaScript/TypeScript** (ES modules, async/await)
- ความเข้าใจ React ระดับพื้นฐาน (components, props, hooks)
- ติดตั้ง [Node.js 20+](https://nodejs.org/)

```bash
node -v # ควรเป็น v20.x ขึ้นไป
npm -v
```

---

## วิธีใช้ Bootcamp

1. ติดตั้ง dependencies จาก root ของ bootcamp
2. อ่าน `README.md` ของระดับนั้นให้จบ — โฟกัสที่ **ทำไมเลือกเครื่องมือ/กลยุทธ์เทสแบบนี้**
3. เปิดและรันตัวอย่างใน `examples/` ตามลำดับ
4. ทำ Lab ใน `LAB.md` **ด้วยตัวเองก่อน** แล้วค่อยดูเฉลย
5. ไประดับถัดไปเมื่ออธิบาย trade-off ของ bundler และ test pyramid ได้

```bash
cd tooling-testing-bootcamp
npm install

# Beginner — Jest unit tests
npm run test:beginner

# Intermediate — RTL + MSW
npm run test:intermediate

# Expert — Cypress (ต้องมี app รันอยู่ — ดู README ระดับ Expert)
npm run cypress:open
```

---

## Learning Path ที่แนะนำ

```
Beginner: Module Bundler + Webpack/Vite + Jest assertions/mocks/async
 ↓
Intermediate: React Testing Library + Queries/userEvent + MSW Integration
 ↓
Expert: Cypress E2E + intercept/custom commands + Coverage/CI Pipeline
 ↓
project จริงของคุณเอง (SPA + Test Pyramid + GitHub Actions)
```

---

## Test Pyramid ในหลักสูตรนี้

```
 /\
 / \ E2E (Cypress) — น้อย แต่ครอบคลุม user journey
 /----\
 / Inte \ Integration (RTL + MSW) — โฟลว์คอมโพเนนต์ + API mock
 /--------\
 / Unit \ Unit (Jest) — function / util / logic เร็วและเยอะ
 /------------\
```

| ชั้น        | เครื่องมือ | ความเร็ว | เสถียรภาพ | จำนวนที่แนะนำ |
| ----------- | ---------- | -------- | --------- | ------------- |
| Unit        | Jest       | เร็วมาก  | สูง       | มากที่สุด     |
| Integration | RTL + MSW  | เร็ว     | สูง       | ปานกลาง       |
| E2E         | Cypress    | ช้ากว่า  | เปราะกว่า | น้อย แต่สำคัญ |

> **กฎทอง:** อย่าแทนที่ unit ด้วย E2E ทั้งก้อน — ใช้ E2E ยืนยัน critical path และใช้ unit/integration จับ regression ให้เร็ว

---

## เมื่อไหร่ใช้ Webpack vs Vite?

| คำถาม                                                               | แนวทาง                                     |
| ------------------------------------------------------------------- | ------------------------------------------ |
| project ใหม่ SPA/React/Vue/Svelte ทั่วไป?                           | **Vite** เป็นค่าเริ่มต้นที่ดี              |
| ต้องการ custom loader/plugin ซับซ้อน หรือ legacy webpack ecosystem? | **Webpack**                                |
| Dev server ต้อง hot update เร็วมาก?                                 | Vite (native ESM)                          |
| ต้องควบคุม chunk graph / legacy polyfill แบบละเอียด?                | Webpack มักยืดหยุ่นกว่า                    |
| Library ที่ต้อง UMD + ESM + CJS พร้อมกัน?                           | ดู Rollup/tsup ด้วย — Vite/Webpack ก็ทำได้ |

> **กฎทอง:** เลือกตาม **constraint ของ project** ไม่ใช่ตามกระแส — ทั้งสองเป็นเครื่องมือ production-ready

---

## Best Practices ข้ามระดับ (สรุปเร็ว)

1. **Test behavior ไม่ใช่ implementation** — query ด้วย role/label ไม่ใช่ class name ภายใน
2. **แยก env ชัด** — `.env.development` / `.env.production` / `.env.test` อย่า hardcode secret
3. **Mock ที่ขอบเขตที่เหมาะสม** — unit mock function; integration mock network (MSW); E2E stub เฉพาะที่จำเป็น
4. **วัด coverage อย่างมีสติ** — เป้า % ไม่สำคัญเท่า critical paths ถูกครอบคลุม
5. **CI ต้อง fail เร็ว** — lint → unit → integration ก่อน E2E headless

---

## Troubleshooting

### Cypress ติดตั้ง/รันไม่ขึ้นบน Linux

1. ติดตั้ง binary: `npx cypress install`
2. ต้องมี system libraries (เช่น `libgtk-3-0`, `libnss3`, `xvfb` บน Debian/Ubuntu)
3. ใน CI ใช้ image ที่ Cypress รองรับ หรือ `cypress/included` Docker image

ถ้าเครื่องไม่มี GUI libs — โค้ดและสเปกยังอ่าน/เรียนได้; รัน E2E บนเครื่องที่มี deps ครบหรือใน GitHub Actions

### Webpack example optimization พัง

รันด้วย path ของ config โดยตรง (มี `context: __dirname` แล้ว):

```bash
npx webpack --config 03-expert/examples/03-coverage-optimization/webpack.config.cjs
```
