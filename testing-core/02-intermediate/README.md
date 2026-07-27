# Level 2 — Intermediate: Integration, Mocking & Behavior-Driven Design

ระดับนี้ยกระดับจาก unit โดด ๆ ไปสู่การ **ควบคุม dependency**, ทดสอบ **ขอบเขตระหว่าง module** และเขียนสเปกที่ธุรกิจอ่านรู้เรื่องด้วย **BDD**

---

## สารบัญ

1. [Mocking & Isolation Techniques](#1-mocking--isolation-techniques)
2. [Integration Testing Strategies](#2-integration-testing-strategies)
3. [Behavior-Driven Development (BDD)](#3-behavior-driven-development-bdd)
4. [Best Practices](#4-best-practices)
5. [โครงสร้าง examples](#5-โครงสร้าง-examples)
6. [Lab](#6-lab)

---

## 1. Mocking & Isolation Techniques

### 1.1 ศัพท์ที่ต้องแยกให้ขาด

| Test Double | บทบาท                                                  | ใช้เมื่อ                                       |
| ----------- | ------------------------------------------------------ | ---------------------------------------------- |
| **Stub**    | คืนค่าที่กำหนดไว้                                      | ต้องการควบคุม input จาก dependency             |
| **Mock**    | ตรวจสอบว่าถูกเรียกอย่างไร (interaction)                | พฤติกรรมการเรียกสำคัญต่อความถูกต้อง            |
| **Spy**     | ห่อของจริง/function แล้วบันทึกการเรียก                 | อยากยืนยัน side-effect โดยยังใช้ logic บางส่วน |
| **Fake**    | implementation เบา ๆ ที่ใช้ได้จริง (เช่น in-memory DB) | integration ชั้นในโดยไม่พึ่ง infra หนัก        |

> หลายคนเรียกทุกอย่างว่า “mock” — ในงานจริงควรเลือกชนิดให้ตรงเจตนา ไม่งั้นเทสจะเปราะและอ่านยาก

### 1.2 ชั้นที่มักต้องแยกออกจาก unit

```text
[Domain Service]
 │
 ├── PaymentGateway (HTTP) → stub/mock/fake
 ├── UserRepository (DB) → fake in-memory / testcontainer
 ├── Mailer (3rd party) → stub
 └── Clock / UUID  → injectable fake
```

### 1.3 หลักการ Mock อย่างมีวินัย

1. **Mock ที่ขอบเขต (boundary)** ไม่ mock ทุก class ภายใน domain
2. ยืนยัน interaction เฉพาะเมื่อเป็นสัญญาสำคัญ (เช่น “ต้องเรียก refund ครั้งเดียว”)
3. อย่า over-specify: assert arguments ทั้งก้อนเมื่อมี field ไม่เกี่ยวจะทำให้เทสพังบ่อย
4. เทสที่พังเมื่อ rename private method = คุณกำลังเทส implementation ไม่ใช่ behavior

### 1.4 ตัวอย่างแนวคิด

```ts
// Stub: คืนค่า
paymentGateway.charge = async () => ({ status: 'ok', txnId: 't-1' });

// Mock/Spy: ตรวจว่าถูกเรียก
expect(paymentGateway.charge).toHaveBeenCalledWith({
  amount: 100,
  currency: 'THB',
});
```

---

## 2. Integration Testing Strategies

### 2.1 Integration ทดสอบอะไร

Integration โฟกัส **รอยต่อ** ไม่ใช่ logic ทุกบรรทัดซ้ำกับ unit:

- Service ↔ Repository
- API handler ↔ Service
- Module A contract ↔ Module B
- App ↔ Database schema / migrations
- App ↔ message queue (publish/consume)

### 2.2 Component Testing

ทดสอบชิ้นใหญ่กว่า unit แต่ยังแคบกว่า E2E ทั้งระบบ เช่น:

- React component + MSW (API fake)
- NestJS module testing พร้อม providers แทนของจริงบางตัว

เป้าหมาย: ได้ความมั่นใจระดับ “ประกอบกันแล้วทำงาน” โดยยังเร็วกว่า E2E

### 2.3 Database Integration และ Testcontainers

ปัญหาของ shared Dev DB:

- ข้อมูลปนกันระหว่างเทส
- flake จาก state ค้าง
- ช้าและแย่งกันใช้

แนวทางที่ดีขึ้นตามระดับความเข้ม:

| แนวทาง                                                  | ข้อดี                     | ข้อเสีย                       |
| ------------------------------------------------------- | ------------------------- | ----------------------------- |
| In-memory fake repo                                     | เร็วมาก                   | อาจไม่จับ SQL dialect จริง    |
| SQLite / embedded                                       | เร็ว                      | พฤติกรรมต่างจาก production DB |
| **Testcontainers** (ephemeral Postgres/MySQL ใน Docker) | ใกล้ของจริง สะอาดทุกครั้ง | ต้องมี Docker, ช้ากว่า unit   |

แนวคิด Testcontainers:

```text
beforeAll → start Postgres container → migrate schema → run tests → stop container
แต่ละ suite ได้ DB สะอาด หรือใช้ transaction rollback ต่อเทส
```

ใน examples ของระดับนี้จะใช้ **in-memory repository + boundary integration** เพื่อให้รันได้ทันทีโดยไม่บังคับ Docker
และอธิบายจุดต่อยอดไป Testcontainers อย่างชัดเจน

### 2.4 กลยุทธ์ข้อมูลทดสอบ

- Arrange เฉพาะข้อมูลที่เคสต้องการ (minimal fixture)
- ทำความสะอาดด้วย teardown หรือ transaction
- หลีกเลี่ยงพึ่งลำดับการรันเทส

---

## 3. Behavior-Driven Development (BDD)

### 3.1 BDD คืออะไร (และไม่ใช่อะไร)

BDD คือการ **จับคู่ภาษาธุรกิจกับตัวอย่างพฤติกรรม** เพื่อลดช่องว่างระหว่าง PO / QA / Dev
ไม่ใช่แค่ “เขียน Gherkin แล้วมี automation” โดยไร้การสนทนา

### 3.2 Gherkin — Given / When / Then

```gherkin
Feature: Apply loyalty pricing
 Scenario: Gold member gets discount and VAT
 Given a cart with a line item priced 2000 THB
 And the customer membership tier is GOLD
 When the system calculates the final price
 Then the final price should be 1872.50
```

| คีย์เวิร์ด | ความหมาย              |
| ---------- | --------------------- |
| Given      | บริบทเริ่มต้น (state) |
| When       | การกระทำ              |
| Then       | ผลลัพธ์ที่สังเกตได้   |
| And / But  | ต่อประโยคให้อ่านลื่น  |

### 3.3 จากสเปกสู่ Automation

```text
Feature file (.feature)
 ↓
Step definitions (map ประโยค → โค้ด)
 ↓
Domain API / Page objects / HTTP client
```

เครื่องมือที่พบบ่อย: Cucumber, Playwright BDD, SpecFlow, Behave
ใน examples เราใช้ **lightweight Gherkin runner** เพื่อสอนโครงสร้างโดยไม่ล็อก vendor

### 3.4 Anti-patterns ของ BDD

- สเปกยาวเป็น script UI ทีละคลิก (fragile + อ่านยาก)
- ใช้ BDD กับทุก unit เล็ก ๆ (noise)
- Step definitions ที่ซ้ำและไม่มี abstraction
- Scenario ที่ไม่มี business value (“Given database is connected”)

---

## 4. Best Practices

1. **เลือก test double ให้ตรงชั้น** — unit ใช้ stub/fake, contract ใช้ pact, E2E ใช้น้อยที่สุด
2. **เทส integration ที่รอยต่อจริง** ไม่ duplicate unit assertions ทั้งก้อน
3. **ทำให้เทสสร้าง state เองได้** — ห้ามพึ่ง “ข้อมูลใน staging ที่ใครบางคนสร้างไว้”
4. **แยก slow integration ออกจาก unit ใน CI** เพื่อ feedback เร็ว
5. **เขียน Gherkin ให้ธุรกิจอ่านได้** — หลีกเลี่ยงศัพท์ selector/CSS
6. **หนึ่ง scenario หนึ่งพฤติกรรมธุรกิจ**
7. **Document ว่าอะไร mock อะไรของจริง** ใน README ของ suite

---

## 5. โครงสร้าง examples

| folder                                                                        | เนื้อหา                                             |
| ----------------------------------------------------------------------------- | --------------------------------------------------- |
| [`examples/01-mocking-isolation`](./examples/01-mocking-isolation/)           | Stub/Mock/Spy/Fake กับ OrderService                 |
| [`examples/02-integration-boundaries`](./examples/02-integration-boundaries/) | Service ↔ in-memory repo (แนวทางสู่ Testcontainers) |
| [`examples/03-bdd-gherkin`](./examples/03-bdd-gherkin/)                       | Feature + steps + runner                            |

```bash
cd examples/01-mocking-isolation && npm install && npm test
cd ../02-integration-boundaries && npm install && npm test
cd ../03-bdd-gherkin && npm install && npm test
```

---

## 6. Lab

โจทย์ใน [`LAB.md`](./LAB.md): Mock payment gateway, integration ของ inventory reservation และเขียน BDD scenarios พร้อม automation
เฉลย: [`lab/solution/`](./lab/solution/)

---

## Definition of Done — Intermediate

- [ ] อธิบายความต่าง Stub/Mock/Spy/Fake ด้วยตัวอย่างของทีมตัวเองได้
- [ ] เขียนเทสที่ mock HTTP/DB โดยไม่มี side effects ภายนอก
- [ ] มี integration test อย่างน้อยที่ครอบคลุม repository boundary
- [ ] เขียน Gherkin 2–3 scenarios และ map เป็น steps ที่รันผ่าน
- [ ] อธิบายได้ว่าเมื่อไรควรยกระดับจาก fake ไป Testcontainers
