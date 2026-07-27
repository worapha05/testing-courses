# Lab — Beginner: แผนเทส + TDD Pricing Engine

## โจทย์

คุณได้รับ feature ใหม่: **Loyalty Pricing Engine** สำหรับร้านค้าออนไลน์

### Requirement

1. คำนวณราคาสุทธิจากรายการสินค้า
2. สมาชิก level `SILVER` ได้ส่วนลด 5%, `GOLD` ได้ 10%, `NONE` ไม่ได้ส่วนลด
3. ถ้า `subtotal` ≥ 1000 ให้ส่วนลดพิเศษเพิ่มอีก 50 (flat) แต่ต้องเป็นสมาชิกเท่านั้น (`SILVER`/`GOLD`)
4. ภาษีหลังส่วนลด: `TH` = 7%
5. ห้ามราคาสุดท้ายติดลบ (ต่ำสุดคือ 0)

### สิ่งที่ต้องส่ง

1. **แผนการเทส (Test Plan ย่อ)** — ระบุชั้น Unit / Integration / E2E / Manual และเหตุผล
2. **TDD** — เขียนเทสก่อน แล้วค่อย implement `loyaltyPricing.js`
3. **Refactor** — แยก pure functions ให้ชัด หลีกเลี่ยง anti-pattern (เช่น `new Date()` ฝังโดยไม่จำเป็น)

### ข้อจำกัด

- ใช้ Vitest
- Unit tests ต้อง deterministic และใช้ AAA
- ห้ามพึ่ง network/DB

---

## วิธีคิด (เฉลยแนวทาง)

1. **แยกความเสี่ยง:** การคำนวณผิด = Unit เป็นหลัก; การอ่าน membership จาก DB = Integration ภายหลัง; checkout UI = E2E น้อยชิ้น
2. **TDD slice เล็ก:** เริ่มจาก `subtotal` → member discount → threshold bonus → tax → clamp at 0
3. **ชื่อเทสเป็นพฤติกรรม:** `applies gold discount then VAT` ดีกว่า `test1`
4. **Coverage ไม่ใช่เป้าหมายเดียว:** ต้องมี assert ทุกเคส และมีเคส edge (subtotal พอดี 1000, ไม่ใช่สมาชิกแต่ยอดสูง)

---

## โครงสร้างไฟล์เฉลย

```text
lab/solution/
 package.json
 src/loyaltyPricing.js
 tests/loyaltyPricing.test.js
 TEST_PLAN.md
```

ดูโค้ดเต็มใน [`lab/solution/`](./lab/solution/)

### รันเฉลย

```bash
cd lab/solution
npm install
npm test
```

---

## เกณฑ์ผ่าน Lab

- [ ] มี Test Plan ที่ map ไป Testing Pyramid
- [ ] มีเทสอย่างน้อย 8 เคส ครอบคลุม member tiers + edge cases
- [ ] Implementation ผ่านทุกเทส
- [ ] อธิบายได้ว่าจุดไหนเป็น Red/Green/Refactor
