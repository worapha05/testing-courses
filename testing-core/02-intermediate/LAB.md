# Lab — Intermediate: Mocking, Integration และ BDD

## โจทย์สถานการณ์

ทีมกำลังสร้าง **Ticket Reservation System** สำหรับคอนเสิร์ต

### Requirement

1. จองตั๋วได้เมื่อที่นั่งว่าง
2. ถ้า payment ล้มเหลว ต้อง **ปล่อยที่นั่งกลับ** (compensating action)
3. ผู้ใช้ไม่จองเกิน `maxPerUser` ต่ออีเวนต์
4. ธุรกิจอยากได้สเปกภาษา Gherkin สำหรับ happy path และ payment failure

### สิ่งที่ต้องส่ง

1. **Unit/Service tests** ที่ใช้ Stub/Mock/Spy/Fake อย่างเหมาะสม
2. **Integration-style tests** ของ reservation repository boundary (in-memory ยอมรับได้)
3. **BDD feature + steps** อย่างน้อย 2 scenarios
4. อธิบายสั้น ๆ ว่าคอขวดของ automation ที่อาจเกิดถ้า mock ผิดชั้นคืออะไร

### ข้อจำกัด

- ไม่เรียก HTTP/DB จริง
- เทสต้องรันซ้ำได้โดยไม่พึ่งลำดับ

---

## วิธีคิด (เฉลยแนวทาง)

1. แยก `ReservationService` จาก `SeatInventory` และ `PaymentGateway`
2. เคส payment fail → ต้อง spy ว่า `releaseSeat` ถูกเรียก
3. เคส maxPerUser → ใช้ Fake inventory/repo ที่เก็บ state จริงในหน่วยความจำ
4. BDD เขียนระดับธุรกิจ: “ลูกค้าจองที่นั่ง A1 สำเร็จ” ไม่ใช่ “click css #btn”

---

## โครงสร้างไฟล์เฉลย

```text
lab/solution/
 package.json
 src/
 reservationService.js
 seatRepository.js
 tests/
 reservationService.test.js
 seatRepository.integration.test.js
 features/
 reservation.feature
 steps/
 reservation.steps.js
 run-bdd.js
 NOTES.md
```

### รันเฉลย

```bash
cd lab/solution
npm install
npm test
npm run bdd
```

---

## เกณฑ์ผ่าน Lab

- [ ] มีอย่างน้อย 1 เทสที่ใช้ mock interaction และ 1 เทสที่ใช้ fake state
- [ ] integration boundary ครอบคลุม persist/release
- [ ] Gherkin 2 scenarios รันผ่าน
- [ ] อธิบายคอขวด automation ได้ใน NOTES
