# NOTES

## 1. เมื่อไหร่ใช้ `queryBy`?

เมื่อต้องการ **assert ว่าองค์ประกอบไม่มีอยู่** — `getBy` จะ throw แต่ `queryBy` คืน `null`

## 2. ทำไม `userEvent` ดีกว่า `fireEvent` สำหรับ form?

`userEvent` จำลองลำดับเหตุการณ์ใกล้เคียงผู้ใช้จริง (focus, key events, input)
ลดเทสที่ผ่านแต่ UI จริงพังจาก validation / controlled input

## 3. ข้อดีของ MSW

สกัดกั้นที่ชั้น network — โค้ด production ยังเรียก `fetch` เหมือนเดิม
จำลอง status/delay ได้ และแชร์ handlers กับ dev tools ได้
