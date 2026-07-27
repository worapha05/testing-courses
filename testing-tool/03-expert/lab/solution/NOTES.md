# NOTES

## 1. เมื่อไหร่ไม่ควร stub ด้วย cy.intercept?

เมื่อต้องการยืนยันสัญญาจริงกับ staging/backend (contract/smoke หลัง deploy)
หรือเมื่อบั๊กอยู่ที่ serialization/CORS จริงที่ mock จะปิดบัง

## 2. Code splitting vs Tree shaking

- **Tree shaking** — ตัดโค้ดที่ไม่ได้ถูกอ้างอิงออกจาก bundle
- **Code splitting** — แยก bundle เป็นหลายไฟล์โหลดตาม route/เวลา เพื่อลด initial load

## 3. ทำไม upload screenshot เมื่อ fail?

E2E บน CI ดีบักยากโดยไม่มี UI — screenshot/video เป็นหลักฐานว่าหน้าจอตอนพังเป็นอย่างไร ช่วยแยก flaky ออกจาก regression จริง
