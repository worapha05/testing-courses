# Level 3 — Expert: Enterprise Automation, Flakiness & Non-Functional Testing

ระดับนี้โฟกัสการทำให้ชุดทดสอบ **ทนทานในองค์กรจริง**: E2E ที่ดูแลได้, ลด flaky, ขยายไป non-functional และผูกเข้า Continuous Testing / Quality Gates

---

## สารบัญ

1. [Advanced E2E Engineering & Page Object Model](#1-advanced-e2e-engineering--page-object-model)
2. [Dealing with Test Flakiness](#2-dealing-with-test-flakiness)
3. [Beyond Functional Testing](#3-beyond-functional-testing)
4. [Continuous Testing & CI/CD Quality Gates](#4-continuous-testing--cicd-quality-gates)
5. [Best Practices](#5-best-practices)
6. [โครงสร้าง examples](#6-โครงสร้าง-examples)
7. [Lab](#7-lab)

---

## 1. Advanced E2E Engineering & Page Object Model

### 1.1 เมื่อไรควรมี E2E

E2E มีไว้พิสูจน์ **critical user journeys** ที่ตัดข้ามหลายระบบ เช่น:

- สมัคร → ยืนยันอีเมล → login ครั้งแรก
- ใส่ตะกร้า → checkout → payment → order confirmation

ไม่ควรใช้ E2E ไล่ทุก permutation ของ business rule (ย้ายไป unit/integration)

### 1.2 Page Object Model (POM)

POM แยก **หน้าจอ/คอมโพเนนต์** ออกจาก **scenario เทส**

```text
tests/checkout.spec.ts
 │
 ▼
pages/CartPage.ts → actions + queries ของหน้า
pages/CheckoutPage.ts
 │
 ▼
fixtures/testData.ts → ผู้ใช้ / สินค้า / cleanup hooks
```

ประโยชน์:

- แก้ selector ที่เดียว
- เทสอ่านเป็นภาษาธุรกิจขึ้น
- ลด duplication

สิ่งที่ต้องระวัง:

- Page Object อ้วนเกินไปจนกลายเป็น god object
- ใส่ assertions มากเกินใน page (assertion หลักควรอยู่ที่เทส/workflow)

### 1.3 Test Data & State Teardown ที่สเกล

| กลยุทธ์           | รายละเอียด                                 |
| ----------------- | ------------------------------------------ |
| API seeding       | สร้าง user/order ผ่าน API ก่อน UI          |
| Unique data       | email/id สุ่มต่อรัน เพื่อขนานได้           |
| Scoped cleanup    | `afterEach` ลบข้อมูลที่สร้างเอง            |
| Environment reset | ephemeral env / DB snapshot สำหรับ nightly |
| Idempotent setup  | รันซ้ำไม่พัง                               |

หลักการ: **ทุกเทสสร้างของตัวเอง และเก็บกวาดของตัวเอง** เท่าที่ทำได้

---

## 2. Dealing with Test Flakiness

### 2.1 Flaky คืออะไร

เทสที่ได้ผลไม่คงที่โดยโค้ดภายใต้เทสไม่ได้เปลี่ยนอย่างมีนัย — สุ่มเขียว/แดง
เป็นพิษต่อวัฒนธรรมคุณภาพ เพราะทีมเริ่ม “re-run จนผ่าน”

### 2.2 สาเหตุยอดฮิต

- Race: assert ก่อน UI/network เสร็จ
- Hardcoded `sleep(3000)` ไม่พอใน CI ช้า / ช้าเกินในเครื่องเร็ว
- พึ่งข้อมูล shared ที่ถูกเทสอื่นแก้
- นาฬิกา / timezone / locale
- Animation / third-party widget
- Parallel conflicts (port, file, account)

### 2.3 กลยุทธ์แก้

1. **Dynamic waits** รอ condition ไม่ใช่เวลาตายตัว
   `await expect(page.getByText('Order confirmed')).toBeVisible()`
2. **Retry เฉพาะชั้นที่สมเหตุสมผล** (network seed) — อย่า retry ซ่อนบั๊ก logic
3. **Isolate data** ต่อเทส/ต่อ worker
4. **Quarantine** เทส flaky ออกจาก gating ชั่วคราว พร้อม ticket บังคับแก้
5. **Telemetry** เก็บ screenshot, trace, timeline, flake rate ต่อเทส
6. **ลด E2E surface** — ย้ายเคสลงชั้นล่าง

### 2.4 Parallelization & เวลารัน

```text
CI wall clock ≈ max(shard durations) + overhead
```

เทคนิค:

- shard เทสตามไฟล์/แท็ก
- แยก smoke (ทุก PR) กับ full regression (nightly)
- ทำ unit+integration ให้หนา เพื่อให้ E2E บางลง

---

## 3. Beyond Functional Testing

### 3.1 Performance / Load Testing (k6 / Locust)

เป้าหมายไม่ใช่ “รันเทสให้ผ่าน” แต่ตอบคำถาม:

- ระบบรองรับ N concurrent users ได้ไหม
- p95 latency เกิน SLO หรือไม่
- error rate ภายใต้โหลดเป็นอย่างไร

แนว k6:

```js
export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};
```

วางใน pipeline อย่างไร:

- smoke load เล็ก ๆ ทุก PR (optional)
- soak / stress ใน staging ตามตาราง

### 3.2 Security Testing Overview (SAST / DAST)

| ประเภท          | ทำอะไร                               | จุดวาง            |
| --------------- | ------------------------------------ | ----------------- |
| **SAST**        | วิเคราะห์ซอร์สโค้ดหา pattern อันตราย | ตอน PR / build    |
| **DAST**        | ยิงแอปที่รันอยู่หาช่องโหว่จากภายนอก  | staging / nightly |
| Dependency scan | CVE ของ libraries                    | ทุก build         |
| Secrets scan    | กัน credential หลุด                  | pre-commit + CI   |

Expert QA ไม่ต้องเป็น pentester แต่ต้อง **ออกแบบ quality gate** ให้ช่องโหว่วิกฤตบล็อก deploy ได้

### 3.3 Contract Testing (Pact)

ใน microservices การรอ E2E เต็มวงเป็นคอขวด
Contract testing พิสูจน์ว่า **Consumer คาดหวังอะไร** และ **Provider ยังทำตามนั้น**

```text
Consumer test → สร้าง contract (Pact file)
   ↓
  Pact Broker / artifact
   ↓
Provider verification เทียบ contract กับ implementation จริง
```

ประโยชน์: จับ breaking API เร็ว โดยไม่ต้องยกทั้งระบบ

---

## 4. Continuous Testing & CI/CD Quality Gates

### 4.1 Continuous Testing คืออะไร

การฝังการทดสอบตลอด pipeline ไม่ใช่เฟสท้ายน้ำ:

```text
commit → unit → integration → contract → build → smoke E2E → deploy staging → DAST/perf sample → prod gate
```

### 4.2 Quality Gates ตัวอย่าง

| Gate        | เงื่อนไขบล็อก merge/deploy                      |
| ----------- | ----------------------------------------------- |
| Unit        | ต้องผ่าน 100% ของ suite ที่เกี่ยวข้อง           |
| Coverage    | branch ≥ เกณฑ์ทีม (เช่น 80% บน module critical) |
| Lint/SAST   | high severity = 0                               |
| Contract    | provider verification ผ่าน                      |
| Smoke E2E   | critical journeys ผ่านบน preview/staging        |
| Perf budget | p95 ไม่ถดถอยเกิน threshold                      |

### 4.3 Multi-browser / Cross-platform grids

- Matrix: Chromium / Firefox / WebKit
- Mobile viewports สำคัญต่อ journey
- ใช้ grid (Playwright shards, BrowserStack, etc.) อย่างมีงบ — ไม่ต้องทุก browser ทุกเคสทุก PR

### 4.4 Test Reporting

- JUnit XML / HTML report
- Allure / Playwright report
- Publish artifacts: traces, videos ของเคสที่ fail
- แนวโน้ม flake rate เป็นเมตริกรายสัปดาห์

---

## 5. Best Practices

1. E2E น้อย แต่คม — map กับ business risk
2. POM + fixtures + cleanup เป็นชุดเดียวกัน
3. ห้าม `sleep` เป็นค่าเริ่มต้นของทีม
4. Flaky = defect ของระบบเทส ต้องมี owner
5. Perf/Security/Contract เป็นส่วนของ Definition of Done ไม่ใช่ของเล่นท้ายปี
6. Quality gate ต้อง fail ชัดและแก้ได้ — อย่าตั้งเกณฑ์ที่ไม่มีใครเชื่อ
7. แยก fast feedback (PR) กับ deep signal (nightly)

---

## 6. โครงสร้าง examples

| folder                                                                    | เนื้อหา                           |
| ------------------------------------------------------------------------- | --------------------------------- |
| [`examples/01-e2e-pom`](./examples/01-e2e-pom/)                           | โครง POM + fixtures + teardown    |
| [`examples/02-flakiness-mitigation`](./examples/02-flakiness-mitigation/) | sleep ผิด vs wait ตามเงื่อนไข     |
| [`examples/03-performance-k6`](./examples/03-performance-k6/)             | script k6 พร้อม thresholds        |
| [`examples/04-contract-pact`](./examples/04-contract-pact/)               | Consumer/Provider contract แบบย่อ |
| [`examples/05-cicd-quality-gates`](./examples/05-cicd-quality-gates/)     | GitHub Actions pipeline + gates   |

---

## 7. Lab

โจทย์รวมใน [`LAB.md`](./LAB.md): สร้าง E2E architecture, แก้ flaky, เพิ่ม k6 smoke, contract และ CI gate
เฉลย: [`lab/solution/`](./lab/solution/)

---

## Definition of Done — Expert

- [ ] ออกแบบ POM สำหรับ 2–3 pages พร้อม data lifecycle
- [ ] วินิจฉัยและแก้ flaky จาก race/sleep ได้
- [ ] เขียน k6 script มี thresholds ผูก SLO
- [ ] อธิบาย/สาธิต contract consumer → provider verification
- [ ] ตั้ง CI job ที่เป็น quality gate จริง (fail แล้วบล็อก)
