# NOTES — คำตอบคำถามคิด

## 1. ทำไม Vite บังคับ prefix `VITE_`?

เพื่อกันเผลอส่ง secret จาก server env เข้า client bundle
มีแค่ตัวแปรที่ตั้งใจ expose (ขึ้นต้น `VITE_`) ถึงจะเข้าถึงผ่าน `import.meta.env` ได้

## 2. Loader vs Plugin ใน Webpack

- **Loader** แปลงไฟล์ทีละ module ตอนถูก resolve (เช่น SCSS → CSS → JS string)
- **Plugin** ทำงานกับทั้ง compilation lifecycle (inject HTML, นิยาม env, emit ไฟล์เพิ่ม)

## 3. `toBe` vs `toEqual`

- `toBe` ใช้ `Object.is` / reference — เหมาะ primitive
- `toEqual` เทียบโครงสร้างลึก — เหมาะ object/array
