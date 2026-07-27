# Lab ระดับ Beginner — ระบบร้านค้า “ToolShop Build Desk”

## เป้าหมาย

ตั้งค่าเครื่องมือ build + unit test ให้ทีม ToolShop ที่ระบบพังจาก config ผิด:

1. แก้ **Webpack** ที่ build SCSS / env ไม่ผ่าน
2. ตั้ง **Vite** ให้ expose ตัวแปร `VITE_*` ถูกต้อง
3. เขียน **Jest** ครอบคลุม pricing util + notifier พร้อม mock

ทำด้วยตัวเองก่อน แล้วค่อยเทียบกับ [`lab/solution/`](./lab/solution/)
Starter ที่ตั้งใจทำให้พังอยู่ที่ [`lab/starter/`](./lab/starter/)

---

## กรณีศึกษา

startup **ToolShop** มีหน้า marketing เล็ก ๆ
Junior ตั้ง Webpack/Vite แบบคัดลอกจากบล็อกเก่า — อาการที่เจอ:

| อาการ                                            | สาเหตุที่สงสัย                              |
| ------------------------------------------------ | ------------------------------------------- |
| `Module parse failed: Unexpected character '#'`  | ไม่มี `sass-loader` ใน rule                 |
| `process.env.API_URL` เป็น `undefined` ใน bundle | ไม่ได้ใส่ Dotenv / DefinePlugin             |
| Vite อ่าน `API_URL` ไม่ได้                       | ลืม prefix `VITE_`                          |
| เทส pricing ล้มเป็นช่วง ๆ                        | ไม่ได้ mock dependency / ไม่จัด fake timers |

CTO ต้องการ desk ที่:

- Build ด้วย Webpack **หรือ** Vite ก็ได้ผลลัพธ์เทียบเคียงกัน
- มี unit test ของ `pricing.js` และ `notifier.js` รันผ่านใน CI

---

## โจทย์

### ส่วนที่ 1 — ซ่อม Webpack config

จาก `lab/starter/webpack.config.broken.cjs` ให้สร้าง `webpack.config.cjs` ที่:

1. มี rule สำหรับ `.scss` ด้วย `style-loader` → `css-loader` → `sass-loader`
2. ใช้ `HtmlWebpackPlugin` ชี้ template `public/index.html`
3. โหลด `.env` ด้วย `dotenv-webpack` ให้ `process.env.API_URL` ใช้ได้ใน `src/index.js`
4. `output.clean = true` และมี `contenthash` เมื่อ `mode === 'production'`

ตรวจด้วย (หลังมี dependencies ที่ root):

```bash
npx webpack --config 01-beginner/lab/solution/webpack.config.cjs --mode production
```

### ส่วนที่ 2 — ตั้ง Vite ให้ถูก convention

สร้าง `vite.config.ts` และ `.env` ที่:

1. `VITE_API_URL` และ `VITE_APP_TITLE` ถูกอ่านใน `src/main.ts` ผ่าน `import.meta.env`
2. `define.__APP_TITLE__` มาจาก env
3. `server.port = 5174` (กันชนกับตัวอย่างอื่น)

### ส่วนที่ 3 — Unit tests สำหรับ Pricing & Notifier

Implement และทดสอบ:

#### `src/pricing.js`

```js
calculateCartTotal(items, couponPercent);
// items: [{ price, qty }]
// - รวม price * qty
// - ลดตาม couponPercent (cap ที่ 40%)
// - ถ้า items ว่าง ให้ return 0
// - ถ้า price/qty ติดลบ ให้ throw
```

#### `src/notifier.js`

```js
createCheckoutNotifier({ sendEmail });
// notify(order) ส่งอีเมลไปที่ order.email หัวข้อ `Order ${order.id}`
// ถ้าไม่มี email ให้ throw
```

ข้อกำหนดเทส:

1. อย่างน้อย 4 เคสสำหรับ `calculateCartTotal`
2. mock `sendEmail` ด้วย `jest.fn` และ assert arguments
3. มีอย่างน้อย 1 เคส async ที่ `sendEmail` reject แล้ว notifier propagate error

### ส่วนที่ 4 — คำถามคิด (ตอบใน `NOTES.md`)

1. ทำไม Vite บังคับ prefix `VITE_` สำหรับ client env?
2. Loader กับ Plugin ใน Webpack ต่างกันอย่างไร?
3. เมื่อไหร่ควรใช้ `toBe` vs `toEqual`?

---

## เกณฑ์ผ่าน

- [ ] Webpack production build สำเร็จและมีไฟล์ใน `dist/`
- [ ] Vite อ่าน `VITE_API_URL` ได้
- [ ] `npm run test:lab:beginner` ผ่านทั้งหมด
- [ ] มี `NOTES.md` ตอบคำถามคิด

---

## เฉลย

ดูโค้ดครบใน [`lab/solution/`](./lab/solution/) — พยายามทำให้ผ่านด้วยตัวเองก่อนเปิดเฉลย
