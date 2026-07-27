# Lab — Expert: Enterprise Suite + ลด Flaky + Quality Gates

## โจทย์สถานการณ์

คุณเป็น Lead QA ของผลิตภัณฑ์ **NovaShop**
CI ใช้เวลา 45 นาที, E2E flaky ~12%, และทีมไม่วาง quality gate ที่ชัด → production เคยพังจาก breaking API

### สิ่งที่ต้องออกแบบและส่ง

1. **แผนเทสระดับองค์กร** สำหรับ feature Checkout (Pyramid + non-functional)
2. **E2E POM** สำหรับ Login + Checkout (โครง pages/fixtures/tests)
3. **แก้คอขวด flaky** จากเคสที่ใช้ `sleep` รอ confirmation
4. **k6 smoke** พร้อม thresholds ตาม SLO: error rate < 1%, p95 < 500ms
5. **Contract** ระหว่าง `checkout-web` และ `order-api`
6. **CI quality gates** ที่บล็อก merge เมื่อ unit/contract/smoke ไม่ผ่าน

### ข้อจำกัด

- โค้ด E2E ใช้ POM pattern (browser จริงหรือ fake port ก็ได้ถ้าโครงสร้างครบ)
- อธิบายวิธีคิดเรื่อง parallel และ test data teardown

---

## วิธีคิด (เฉลยแนวทาง)

1. **ลด E2E surface** — ย้าย pricing rules ลง unit, API mapping ลง contract/integration
2. **POM + unique fixtures** — เลิกพึ่ง shared demo user
3. **แทน sleep ด้วย waitForText / expect**
4. **แยก jobs ใน CI** — unit เร็วก่อน, E2E ตามหลัง, perf เฉพาะ main/nightly
5. **Contract gate** จับ breaking change ก่อนขึ้น staging ใหญ่

---

## โครงสร้างไฟล์เฉลย

```text
lab/solution/
 NOTES.md
 pages/
 LoginPage.js
 CheckoutPage.js
 fixtures/
 users.js
 tests/
 checkout.journey.test.js
 wait.strategy.test.js
 k6/
 checkout_smoke.js
 pact/
 contract.js
 consumer.test.js
 provider.verify.test.js
 .github/workflows/
 novashop-quality-gates.yml
 package.json
```

### รันส่วนที่รันด้วย Node ได้

```bash
cd lab/solution
npm test
```

---

## เกณฑ์ผ่าน Lab

- [ ] มีแผนเทสที่รวม functional + perf + contract + CI gates
- [ ] POM + fixture teardown ชัด
- [ ] แสดงก่อน/หลังการแก้ flaky wait
- [ ] มี k6 thresholds และ workflow ที่ fail ได้จริงตามเงื่อนไข
