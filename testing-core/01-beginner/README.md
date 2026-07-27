# Level 1 — Beginner: Testing Philosophy & Unit Level Mastery

ระดับนี้สร้าง **รากฐานทางปรัชญาและวินัยการทดสอบ** ไม่ใช่แค่การเขียน `expect(...)`
เมื่อจบระดับนี้ คุณจะออกแบบ Unit Test ที่เชื่อถือได้ และใช้ TDD เป็นเครื่องมือออกแบบโค้ด

---

## สารบัญ

1. [Software Testing Lifecycle (STLC) และต้นทุนของบั๊ก](#1-software-testing-lifecycle-stlc-และต้นทุนของบั๊ก)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Unit Testing Principles และ AAA Pattern](#3-unit-testing-principles-และ-aaa-pattern)
4. [Code Coverage vs Test Coverage](#4-code-coverage-vs-test-coverage)
5. [Test-Driven Development (TDD)](#5-test-driven-development-tdd)
6. [Best Practices](#6-best-practices)
7. [โครงสร้าง examples](#7-โครงสร้าง-examples)
8. [Lab](#8-lab)

---

## 1. Software Testing Lifecycle (STLC) และต้นทุนของบั๊ก

### 1.1 STLC คืออะไร

**STLC (Software Testing Lifecycle)** คือกระบวนการเป็นระบบในการวางแผน ออกแบบ ดำเนินการ และปิดงานทดสอบ
ต่างจาก SDLC ที่โฟกัสการสร้างซอฟต์แวร์ — STLC โฟกัสการ **พิสูจน์คุณภาพและความเสี่ยง**

| เฟส                            | คำถามหลัก                                    | ผลลัพธ์ที่คาดหวัง                |
| ------------------------------ | -------------------------------------------- | -------------------------------- |
| Requirement Analysis           | ต้องพิสูจน์อะไร? ความเสี่ยงอยู่ตรงไหน?       | Testable requirements, risk list |
| Test Planning                  | จะทดสอบด้วยกลยุทธ์อะไร? ใช้คน/เครื่องเท่าไร? | Test plan, entry/exit criteria   |
| Test Design / Case Development | สร้างเคสและข้อมูลทดสอบอย่างไร?               | Test cases, test data, matrices  |
| Environment Setup              | รันบนสภาพแวดล้อมที่ควบคุมได้หรือยัง?         | Env checklist, seed data         |
| Test Execution                 | ผลจริงตรงสเปกไหม?                            | Defects, evidence, pass/fail     |
| Test Closure                   | เรียนรู้และส่งมอบคุณภาพอะไร?                 | Report, metrics, lessons learned |

### 1.2 ต้นทุนของบั๊ก (Cost of Bugs)

หลักการ classic: **ยิ่งพบบั๊กช้า ต้นทุนยิ่งพุ่งสูงแบบไม่เชิงเส้น**

```text
Requirement → Design → Coding → Unit → Integration → System/UAT → Production
 $1  $5 $10 $20 $50  $100+ $$$$+
```

ทำไมแพงขึ้น?

- ต้องย้อนแก้หลายชั้น (code + contract + data + docs)
- กระทบลูกค้า ความน่าเชื่อถือ และ compliance
- ต้อง rollback / hotfix / war room

**ปรัชญาสำคัญ:** คุณภาพไม่ใช่ “ตรวจตอนท้าย” แต่คือ **การออกแบบ feedback loop ที่สั้นที่สุด**
Unit test คือ feedback ที่ถูกและเร็วที่สุดในพีระมิด

### 1.3 Entry / Exit Criteria (ตัวอย่าง)

- **Entry:** requirement ชัดพอ, build รันได้, test data พร้อม
- **Exit:** critical defects = 0, coverage ตามเกณฑ์, smoke ผ่าน, residual risk ถูกยอมรับ

---

## 2. Testing Pyramid

### 2.1 โครงสร้างพีระมิด

```text
   /\
  / \ Manual / Exploratory (น้อย แต่มีค่าสูง)
  /----\
  / E2E \ ช้า แพง เปราะ — ใช้พิสูจน์ critical journeys
  /--------\
  /Integration\ ตรวจขอบเขต module / DB / API จริงบางส่วน
  /------------\
  / Unit \ เร็ว ถูก เสถียร — ฐานใหญ่สุด
  /----------------\
```

| ชั้น                 | เป้าหมาย                  | ความเร็ว | ความเสถียร | สัดส่วนแนะนำ (แนวทาง) |
| -------------------- | ------------------------- | -------- | ---------- | --------------------- |
| Unit                 | logic ย่อยถูกต้อง         | เร็วมาก  | สูง        | ~70%                  |
| Integration          | modules ทำงานร่วมกัน      | ปานกลาง  | ปานกลาง    | ~20%                  |
| E2E                  | user journey จริง         | ช้า      | ต่ำกว่า    | ~10%                  |
| Manual / Exploratory | สิ่งที่ automation จับยาก | ช้า      | ขึ้นกับคน  | ตามความเสี่ยง         |

> สัดส่วนไม่ใช่ศาสนา — แต่ถ้า E2E เป็นฐานใหญ่ คุณจะได้ suite ที่ช้า แพง และ flaky

### 2.2 Metrics ที่ควรติดตามแยกชั้น

- **Unit:** pass rate, duration, mutation score (ถ้ามี), flake rate ≈ 0
- **Integration:** contract mismatches, DB migration failures
- **E2E:** journey coverage ของ critical path, flake rate, p95 duration
- **Manual:** bugs found / session, severity, areas ที่ยังไม่ automate

### 2.3 Anti-pattern: Ice Cream Cone

```text
 Manual / E2E ← ใหญ่เกิน
 Integration
 Unit  ← น้อยเกินไป
```

อาการ: ทีมกลัวแก้โค้ด, CI ช้า, บั๊กโผล่ตอน UI แม้ logic พังมานานแล้ว

---

## 3. Unit Testing Principles และ AAA Pattern

### 3.1 คุณสมบัติของ Unit Test ที่ดี (FIRST + เพิ่มเติม)

| คุณสมบัติ       | ความหมาย                                   |
| --------------- | ------------------------------------------ |
| Fast            | รันเป็นพันเคสได้ในวินาที                   |
| Isolated        | ไม่พึ่ง network / DB / clock จริง          |
| Repeatable      | ผลเดิมทุกครั้ง (deterministic)             |
| Self-validating | pass/fail ชัด ไม่ต้องตาคนอ่าน log          |
| Timely          | เขียนใกล้เวลาที่เขียนโค้ด (หรือก่อน — TDD) |
| Readable        | อ่านแล้วรู้ intent ของพฤติกรรม             |

### 3.2 AAA Pattern (Arrange–Act–Assert)

```ts
// Arrange — เตรียมข้อมูลและ dependency
const cart = new Cart();
cart.add({ id: 'sku-1', price: 100 }, 2);

// Act — ทำ action เดียวที่สนใจ
const total = cart.total();

// Assert — ตรวจผลลัพธ์ที่สังเกตได้
expect(total).toBe(200);
```

กฎทอง:

1. **หนึ่ง Act ต่อหนึ่งเทส** (หรือหนึ่งพฤติกรรมชัดเจน)
2. Assert สิ่งที่ผู้ใช้/ผู้เรียกสนใจ ไม่ assert implementation detail ทุกตัว
3. ชื่อเทสควรเป็นประโยคพฤติกรรม: `calculates total with tax for domestic order`

### 3.3 Isolation = ควบคุมขอบเขต

Unit ที่ดีควร:

- ไม่เรียก HTTP จริง
- ไม่เขียนไฟล์จริง (หรือใช้ temp ที่ควบคุมได้)
- ไม่พึ่งเวลาจริงแบบสุ่ม — inject `Clock`
- ไม่แชร์ mutable global state ระหว่างเทส

---

## 4. Code Coverage vs Test Coverage

คนมักสับสนสองคำนี้:

| คำ                                        | ความหมาย                                                      | ข้อจำกัด                         |
| ----------------------------------------- | ------------------------------------------------------------- | -------------------------------- |
| **Code Coverage**                         | สัดส่วนโค้ดที่ถูก “เดินผ่าน” ขณะรันเทส (line/branch/function) | สูงก็ยังพลาด logic ผิดได้        |
| **Test Coverage** (เชิงคุณภาพ/ความเสี่ยง) | ความครอบคลุมของสถานการณ์ ความต้องการ และความเสี่ยงที่สำคัญ    | วัดยากกว่า ต้องอาศัย test design |

ตัวอย่างอันตราย:

```ts
function discount(price: number, vip: boolean) {
  if (vip) return price * 0.9;
  return price;
}

// เทสที่ coverage สูงแต่ไร้ค่า
test('runs', () => {
  discount(100, true);
  discount(100, false);
  // ไม่มี assert!
});
```

**Best practice:** ใช้ coverage เป็น **สัญญาณช่องว่าง** ไม่ใช่ KPI ศักดิ์สิทธิ์
เกณฑ์องค์กรที่ดีมักเป็น: branch coverage พอประมาณ + critical paths มี assertion ที่มีความหมาย + mutation testing (ถ้าทีมพร้อม)

---

## 5. Test-Driven Development (TDD)

### 5.1 Red → Green → Refactor

```text
 ┌─────────┐
 │ RED │ เขียนเทสที่ล้ม — กำหนดพฤติกรรมที่ต้องการ
 └────┬────┘
 ▼
 ┌─────────┐
 │ GREEN │ เขียนโค้ดน้อยที่สุดให้เทสผ่าน
 └────┬────┘
 ▼
 ┌─────────┐
 │REFACTOR │ ปรับปรุงดีไซน์โดยเทสคอยกันพัง
 └────┬────┘
 └──────────► วนซ้ำ
```

ประโยชน์ที่แท้จริงของ TDD ไม่ใช่ “เทสมากขึ้น” แต่คือ:

- บังคับคิด API ของ module ก่อน implementation
- ลด coupling (เพราะโค้ดที่ยากเทสจะโผล่เร็ว)
- ได้ documentation มีชีวิตในรูปเทส

### 5.2 ออกแบบให้ทดสอบได้ (Design for Testability)

| แนวทาง                       | ตัวอย่าง                                   |
| ---------------------------- | ------------------------------------------ |
| Dependency Injection         | ส่ง `paymentGateway` เข้า constructor      |
| Pure functions               | คำนวณเงินแยกจาก I/O                        |
| Hexagonal / Ports & Adapters | business logic ไม่รู้จัก Express/DB โดยตรง |
| Seams                        | จุดแทรก fake ได้โดยไม่แก้ production มาก   |

### 5.3 Untestable Anti-patterns

- `new Date()` / `Math.random()` ฝังใน logic โดยไม่ inject
- Singleton mutable ที่แชร์ข้ามเทส
- static deep call ไป network
- God class ที่ทำทุกอย่าง
- ทดสอบผ่าน UI ทั้งที่ควรเป็น unit ของ domain

---

## 6. Best Practices

1. **ชื่อเทสบอกพฤติกรรม** ไม่ใช่ชื่อ method: `rejects expired coupon` ดีกว่า `testCoupon2`
2. **Arrange ให้สั้น** — ใช้ factory / builder สำหรับ fixture ที่ซับซ้อน
3. **อย่าทดสอบ framework** — ทดสอบธุรกิจของคุณ
4. **Fail fast ชัดเจน** — assertion message / structured expect
5. **เก็บเทสใกล้โค้ด** หรือตาม convention ทีม แต่ต้องค้นหาง่าย
6. **แยก fast unit ออกจาก slow suite** ใน CI
7. **ทุก defect ที่เคยพลาด ควรกลายเป็นเทส regression**
8. **Refactor เทสได้** — เทสก็เป็นโค้ดที่ต้องดูแล ไม่ใช่ศาลเจ้า

---

## 7. โครงสร้าง examples

| folder                                                                        | เนื้อหา                        |
| ----------------------------------------------------------------------------- | ------------------------------ |
| [`examples/01-stlc-pyramid`](./examples/01-stlc-pyramid/)                     | แผนคุณภาพย่อ + mapping ชั้นเทส |
| [`examples/02-unit-aaa`](./examples/02-unit-aaa/)                             | Unit suite ด้วย AAA (Vitest)   |
| [`examples/03-tdd-red-green-refactor`](./examples/03-tdd-red-green-refactor/) | ตัวอย่างวัฏจักร TDD ทีละขั้น   |

รันตัวอย่าง:

```bash
cd examples/02-unit-aaa && npm install && npm test
cd ../03-tdd-red-green-refactor && npm install && npm test
```

---

## 8. Lab

ทำโจทย์ใน [`LAB.md`](./LAB.md) — วางแผนเทส, TDD refactor, และสร้าง suite สำหรับ pricing engine
เฉลยอยู่ที่ [`lab/solution/`](./lab/solution/)

---

## Definition of Done — Beginner

- [ ] อธิบาย STLC และ cost of bugs ให้ทีม dev ได้
- [ ] วาด Testing Pyramid ของระบบที่คุณรู้จัก พร้อมเหตุผลสัดส่วน
- [ ] เขียน unit อย่างน้อย 8 เคสด้วย AAA ที่ deterministic
- [ ] แยกได้ว่า coverage สูงแต่เทสอ่อนหมายความว่าอะไร
- [ ] ทำ Red-Green-Refactor จบ 1 kata ด้วยตัวเอง
