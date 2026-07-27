# NOTES — คอขวดของ Automation เมื่อ Mock ผิดชั้น

## ปัญหาที่พบบ่อย

1. **Mock ลึกเกินไปใน domain**
   เทสเขียวแต่ production พัง เพราะ collaboration จริงระหว่าง repo/payment ไม่เคยถูกพิสูจน์

2. **ใช้ E2E แทน integration ของ compensating action**
   การพิสูจน์ “payment fail แล้ว release ที่นั่ง” ผ่าน UI ทำให้ช้าและ flaky — ควรอยู่ที่ service/integration

3. **Shared mutable fake โดยไม่ reset**
   เทสรันขนานแล้วแย่ง state → false negative/positive

4. **BDD ที่เป็น script UI**
   Scenario ยาว แก้ selector ทีใดพังทั้งชุด — สเปกควรอยู่ระดับพฤติกรรมธุรกิจ

## แนวทางแก้

- กำหนด pyramid ของ feature นี้: unit service + repo integration + BDD บาง scenarios + E2E smoke น้อยชิ้น
- Reset fixture ทุก scenario
- Document ว่า payment เป็น stub ที่ไหน และจะมี contract test ที่ไหนในระดับ Expert
