# Level 3 — Expert: End-to-End Automation & CI/CD Testing Pipeline

เป้าหมายระดับนี้: เขียน **E2E ด้วย Cypress** สำหรับ user journey จริง
ใช้ advanced patterns (`cy.intercept`, custom commands) และผูก **coverage + bundle optimization + CI** ให้ครบคุณภาพ production

---

## สารบัญ

1. [E2E ใน Test Pyramid](#1-e2e-ใน-test-pyramid)
2. [ติดตั้งและเขียน Cypress เบื้องต้น](#2-ติดตั้งและเขียน-cypress-เบื้องต้น)
3. [User Journey: Form, UI, Route Guards](#3-user-journey-form-ui-route-guards)
4. [Advanced: cy.intercept และ Network Stubbing](#4-advanced-cyintercept-และ-network-stubbing)
5. [Custom Commands และ Multi-user Simulation](#5-custom-commands-และ-multi-user-simulation)
6. [Code Coverage (Istanbul / V8)](#6-code-coverage-istanbul--v8)
7. [Production Optimization: Code Splitting & Tree Shaking](#7-production-optimization-code-splitting--tree-shaking)
8. [CI/CD: Lint → Unit → Integration → E2E](#8-cicd-lint--unit--integration--e2e)
9. [Best Practices สรุป](#9-best-practices-สรุป)

---

## 1. E2E ใน Test Pyramid

E2E รันแอปจริงใน browser (หรือ headless) แล้วจำลองผู้ใช้ครบเส้นทาง

| ข้อดี                                                     | ข้อควรระวัง                       |
| --------------------------------------------------------- | --------------------------------- |
| ความมั่นใจสูงสุดต่อ critical path                         | ช้า, เปราะ (timing, network, env) |
| จับบั๊กที่ unit/integration พลาด (routing, CSRF, cookies) | ดูแลรักษายากถ้าเขียนมากเกิน       |
| สื่อสารกับ stakeholder ง่าย (scenario ภาษาคน)             | อย่าใช้แทน unit ทั้งก้อน          |

```
เลือกเคส E2E เมื่อ:
 ✓ เป็นเงิน / auth / checkout / permission
 ✓ ข้ามหลายหน้า + state จริงใน browser
 ✗ ไม่ใช่ทุก permutation ของ validation ข้อความ
```

---

## 2. ติดตั้งและเขียน Cypress เบื้องต้น

```bash
npm install -D cypress
npx cypress open
```

โครงสร้างมาตรฐาน:

```
cypress/
 e2e/  # *.cy.ts — เทส
 fixtures/ # JSON ข้อมูลจำลอง
 support/
 e2e.ts # import commands
 commands.ts # custom commands
cypress.config.ts
```

ตัวอย่าง config: [`examples/01-cypress-e2e/cypress.config.ts`](./examples/01-cypress-e2e/cypress.config.ts)

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
});
```

แนวเขียนเทส:

```ts
describe('Login journey', () => {
  it('signs in and lands on dashboard', () => {
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('ada@example.com'); // หรือ cy.get
    cy.get('[data-cy="password"]').type('secret');
    cy.contains('button', /sign in/i).click();
    cy.location('pathname').should('eq', '/dashboard');
  });
});
```

> แนะนำใส่ `data-cy` เฉพาะจุดที่ role/label ไม่เสถียรพอ — อย่าติดทุกองค์ประกอบ

---

## 3. User Journey: Form, UI, Route Guards

เคส classic ที่ควรมี E2E:

1. **Happy path form** — กรอก → submit → เห็น success / redirect
2. **Validation** — ว่าง/ผิดรูปแบบ (เลือกเฉพาะสำคัญ)
3. **Route guard** — เข้า `/admin` โดยไม่ login → ถูกเด้งไป `/login?next=/admin`
4. **หลัง login** — กลับไปหน้าที่ตั้งใจ (`next` param)

```
Visit /admin (ไม่มี session)
 → Guard ตรวจ auth
 → Redirect /login?next=/admin
 → Login สำเร็จ
 → Navigate กลับ /admin
```

ดูตัวอย่าง: [`examples/01-cypress-e2e/`](./examples/01-cypress-e2e/)

---

## 4. Advanced: cy.intercept และ Network Stubbing

`cy.intercept` ดัก HTTP ของแอประหว่าง E2E:

```ts
cy.intercept('GET', '/api/me', {
  statusCode: 200,
  body: { id: '1', name: 'Ada', role: 'admin' },
}).as('getMe');

cy.visit('/dashboard');
cy.wait('@getMe');
cy.contains('Ada');
```

ใช้เมื่อไหร่?

| ใช้ stub                    | ไม่ stub (ยิงของจริง/staging)                 |
| --------------------------- | --------------------------------------------- |
| จำลอง 500 / timeout / empty | สัญญา API เปลี่ยนบ่อยและต้องการ contract จริง |
| ทำให้ E2E เร็วและเสถียร     | smoke test หลัง deploy                        |
| ยังไม่มี backend            | critical money path บน staging ที่ควบคุมได้   |

```ts
cy.intercept('POST', '/api/login', (req) => {
  if (req.body.password !== 'secret') {
    req.reply({ statusCode: 401, body: { message: 'Invalid' } });
  } else {
    req.reply({ statusCode: 200, body: { token: 'fake' } });
  }
}).as('login');
```

ดูตัวอย่าง: [`examples/02-cypress-advanced/`](./examples/02-cypress-advanced/)

---

## 5. Custom Commands และ Multi-user Simulation

### Custom Commands

ห่อขั้นตอนซ้ำให้เทสอ่านเป็นภาษา domain:

```ts
// cypress/support/commands.ts
Cypress.Commands.add('loginAs', (role: 'admin' | 'member') => {
  const user =
    role === 'admin'
      ? { email: 'admin@corp.test', password: 'admin-secret' }
      : { email: 'member@corp.test', password: 'member-secret' };

  cy.intercept('POST', '/api/login', { token: 't', role }).as('login');
  cy.visit('/login');
  cy.get('[data-cy="email"]').type(user.email);
  cy.get('[data-cy="password"]').type(user.password);
  cy.get('[data-cy="submit"]').click();
  cy.wait('@login');
});
```

### Multi-user

แนวทางที่พบบ่อย:

1. **คนละ spec / คนละ `cy.session`** — แยก session ตาม role
2. **สลับ token ใน localStorage/cookie** ระหว่างขั้น
3. **สอง context** (advanced) — Cypress component/e2e ปกติโฟกัสแท็บเดียว; ถ้าต้องสองผู้ใช้พร้อมกันพิจารณา Playwright multi-context

```ts
cy.session('admin', () => {
  cy.loginAs('admin');
});
```

---

## 6. Code Coverage (Istanbul)

Coverage บอกว่าโค้ดถูก “แตะ” ตอนรันเทสเท่าไร — **ไม่ใช่ตัวแทนคุณภาพเทสโดยตรง**

### Unit/Integration (Jest)

```js
// jest.config.cjs
collectCoverage: true,
coverageProvider: 'v8', // หรือ babel/istanbul
coverageThreshold: {
 global: { lines: 70, statements: 70, functions: 70, branches: 60 },
},
```

### E2E + Istanbul (แนวทาง)

1. Instrument แอปตอน build/dev ด้วย `babel-plugin-istanbul` หรือ Vite plugin
2. Cypress เก็บ `__coverage__` จาก `window`
3. รวมรายงานด้วย `nyc` / `monocart-coverage-reports`

ใน lab จะตั้ง Jest coverage threshold และอธิบายจุดเชื่อม E2E coverage

> **กับดัก:** ไล่ % ให้ถึง 100 โดยเทสไม่มี assert มีประโยชน์น้อยกว่าเทส critical path ที่ assert พฤติกรรมชัด

---

## 7. Production Optimization: Code Splitting & Tree Shaking

### Tree Shaking

ตัดโค้ดที่ไม่ได้ใช้จาก ESM static import
เงื่อนไขสำคัญ: เขียนเป็น ESM, หลีกเลี่ยง side-effect มั่ว, ตั้ง `sideEffects` ใน `package.json` ให้ถูก

### Code Splitting

แยก chunk ตาม route / heavy feature:

**Vite / Rollup**

```ts
build: {
 rollupOptions: {
 output: {
 manualChunks: {
 react: ['react', 'react-dom'],
 },
 },
 },
},
// ในแอป
const Admin = lazy(() => import('./pages/Admin'));
```

**Webpack**

```js
optimization: {
 splitChunks: { chunks: 'all' },
},
// dynamic import() สร้าง async chunk อัตโนมัติ
```

ดูตัวอย่าง: [`examples/03-coverage-optimization/`](./examples/03-coverage-optimization/)

---

## 8. CI/CD: Lint → Unit → Integration → E2E

Pipeline ที่แนะนำ:

```
PR opened
 → install (cache node_modules / npm cache)
 → lint
 → unit + integration (Jest) + coverage gate
 → build
 → start preview server
 → cypress run (headless)
 → upload artifacts (screenshots/videos on failure)
```

ตัวอย่าง GitHub Actions: [`examples/04-ci-pipeline/.github/workflows/ci.yml`](./examples/04-ci-pipeline/.github/workflows/ci.yml)

สำหรับ Jenkins แนวเดียวกันด้วย stages:

```groovy
stage('Unit') { sh 'npm run test:beginner && npm run test:intermediate' }
stage('Build') { sh 'npm run build:vite' }
stage('E2E') {
 sh 'npx vite preview --port 5173 & npx wait-on http://localhost:5173'
 sh 'npm run cypress:run'
}
```

หลักการทำให้ CI มีคุณค่า:

1. **Fail fast** — lint/unit ก่อน E2E
2. **Deterministic** — lockfile, ตรึง Node version
3. **Artifacts เมื่อพัง** — screenshot/video ช่วย debug
4. **แยก flaky** — quarantine แล้วแก้ ไม่ ignore เงียบ ๆ

---

## 9. Best Practices สรุป

1. **E2E น้อยแต่คม** — critical journeys เท่านั้น
2. **`cy.intercept` เพื่อเสถียรภาพ** — ไม่ใช่เพื่อเลี่ยงการออกแบบ API ที่ดี
3. **Custom commands = ภาษา domain** — `cy.loginAs('admin')` ไม่ใช่ `cy.doStuff2()`
4. **Coverage เป็นไฟฉาย ไม่ใช่คะแนนสอบ**
5. **Optimize bundle ด้วยวัดจริง** (rollup-plugin-visualizer / webpack-bundle-analyzer)
6. **CI ต้อง reproducible** และเก็บหลักฐานตอน fail

---

## ไฟล์ตัวอย่างในระดับนี้

| folder                                                                       | สิ่งที่เรียนรู้             |
| ---------------------------------------------------------------------------- | --------------------------- |
| [`examples/01-cypress-e2e/`](./examples/01-cypress-e2e/)                     | journey + route guard       |
| [`examples/02-cypress-advanced/`](./examples/02-cypress-advanced/)           | intercept + custom commands |
| [`examples/03-coverage-optimization/`](./examples/03-coverage-optimization/) | coverage + splitting        |
| [`examples/04-ci-pipeline/`](./examples/04-ci-pipeline/)                     | GitHub Actions workflow     |

เมื่อพร้อมแล้วไปที่ [`LAB.md`](./LAB.md)
