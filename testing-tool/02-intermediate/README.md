# Level 2 — Intermediate: Component Testing & Integration Workflows

เป้าหมายระดับนี้: ทดสอบ UI แบบ **user-centric** ด้วย **React Testing Library (RTL)**
เข้าใจ queries / interactions และเขียน **integration test** ที่ mock network ด้วย **MSW**

---

## สารบัญ

1. [จาก Unit สู่ Component Testing](#1-จาก-unit-สู่-component-testing)
2. [ปรัชญาของ React Testing Library](#2-ปรัชญาของ-react-testing-library)
3. [Queries: getBy / findBy / queryBy](#3-queries-getby--findby--queryby)
4. [Interactions: fireEvent vs userEvent](#4-interactions-fireevent-vs-userevent)
5. [Conditional Rendering และ Loading States](#5-conditional-rendering-และ-loading-states)
6. [Integration Testing กับ MSW](#6-integration-testing-กับ-msw)
7. [Jest fetch mocks vs MSW](#7-jest-fetch-mocks-vs-msw)
8. [กลยุทธ์ออกแบบ Test Suite ระดับ Intermediate](#8-กลยุทธ์ออกแบบ-test-suite-ระดับ-intermediate)
9. [Best Practices สรุป](#9-best-practices-สรุป)

---

## 1. จาก Unit สู่ Component Testing

Unit test ดีกับ pure logic แต่ UI มี:

- การเรนเดอร์ตาม state
- การตอบสนองต่อคลิก / พิมพ์ / submit
- การพูดคุยกับ API แล้วแสดงผล

**Component / Integration tests** ปิดช่องว่างนี้โดยเรนเดอร์คอมโพเนนต์จริงใน jsdom แล้วโต้ตอบเหมือนผู้ใช้

```
Unit:  calculateCartTotal(items) → number
Component: <Cart /> แสดงยอดรวมหลังผู้ใช้เพิ่มสินค้า
Integration: <UserList /> โหลดจาก API (mock) แล้วแสดงรายชื่อ
```

ดูตัวอย่าง: [`examples/01-rtl-basics/`](./examples/01-rtl-basics/)

---

## 2. ปรัชญาของ React Testing Library

คติประจำ library:

> The more your tests resemble the way your software is used, the more confidence they can give you.

แปลเป็นการปฏิบัติ:

| ทำ                                         | หลีกเลี่ยง                                          |
| ------------------------------------------ | --------------------------------------------------- |
| Query ด้วย role, label, text ที่ผู้ใช้เห็น | Query ด้วย className / test id ภายใน (ยกเว้นจำเป็น) |
| Assert สิ่งที่ปรากฏบนหน้าจอ                | Assert state ภายใน / private methods                |
| ใช้ `userEvent` จำลองพฤติกรรมจริง          | เรียก props callback โดยตรงเพื่อ “ให้เทสผ่าน”       |

```tsx
// ดี — มุมผู้ใช้
render(<LoginForm onSubmit={onSubmit} />);
await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
await user.click(screen.getByRole('button', { name: /sign in/i }));

// แย่ — มุม implementation
expect(wrapper.find('LoginForm').state('email')).toBe('...');
```

---

## 3. Queries: getBy / findBy / queryBy

RTL มี 3 ตระกูลหลัก:

| ตระกูล           | พฤติกรรมเมื่อไม่เจอ         | เมื่อไหร่ใช้                    |
| ---------------- | --------------------------- | ------------------------------- |
| **`getBy...`**   | throw ทันที                 | องค์ประกอบควรมีอยู่แล้ว (sync)  |
| **`queryBy...`** | return `null`               | assert ว่า **ไม่มี** องค์ประกอบ |
| **`findBy...`**  | return Promise (รอ + retry) | องค์ประกอบปรากฏหลัง async       |

และมีรูปแบบจำนวน:

- `*By` — หนึ่งองค์ประกอบ (ถ้าเจอหลายตัวจะ throw)
- `*AllBy` — array

### ลำดับความสำคัญของ Query (Guiding Principles)

1. `getByRole` (เข้าถึงได้ที่สุด — ใกล้ a11y)
2. `getByLabelText` / `getByPlaceholderText` / `getByText`
3. `getByDisplayValue`
4. `getByAltText` / `getByTitle`
5. `getByTestId` — ทางเลือกสุดท้าย

```tsx
// รอรายการหลัง fetch
expect(await screen.findByRole('heading', { name: /users/i })).toBeInTheDocument();

// ยืนยันว่า error หายไป
expect(screen.queryByRole('alert')).not.toBeInTheDocument();
```

ดูตัวอย่างลึก: [`examples/02-queries-interactions/`](./examples/02-queries-interactions/)

---

## 4. Interactions: fireEvent vs userEvent

### `fireEvent`

- ยิง DOM event ตรง ๆ
- เร็ว แต่ **ไม่จำลองลำดับเหตุการณ์จริงของ browser**

### `userEvent` (แนะนำเป็นค่าเริ่มต้น)

- จำลองพฤติกรรมผู้ใช้สูงกว่า (focus, keydown, input, click ครบชุด)
- รองรับ pointer / keyboard ทันสมัยกว่า

```tsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(screen.getByRole('button', { name: /save/i }));
await user.keyboard('{Enter}');
```

| สถานการณ์                         | แนะนำ           |
| --------------------------------- | --------------- |
| พิมพ์ใน input / tab ระหว่างฟิลด์  | `userEvent`     |
| คลิก checkbox / select option     | `userEvent`     |
| ต้องการยิง event ดิบ ๆ ในเคสเฉพาะ | `fireEvent` ได้ |

---

## 5. Conditional Rendering และ Loading States

คอมโพเนนต์จริงมักมีสถานะ:

```
idle → loading → success
  ↘ error
```

กลยุทธ์เทส:

1. **เริ่มต้น** — เห็น loading หรือ empty state
2. **สำเร็จ** — ใช้ `findBy` รอข้อมูล
3. **ล้มเหลว** — แสดง alert /ข้อความ error
4. **สลับเงื่อนไข** — ปุ่มถูก disable ระหว่าง submit

```tsx
render(<UserProfile id="1" />);
expect(screen.getByText(/loading/i)).toBeInTheDocument();
expect(await screen.findByText(/ada lovelace/i)).toBeInTheDocument();
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
```

หลีกเลี่ยง `act` แบบกระจัดกระจาย — RTL จัดการให้ส่วนใหญ่เมื่อใช้ `findBy` / `userEvent` ถูกวิธี

---

## 6. Integration Testing กับ MSW

**Mock Service Worker (MSW)** สกัดกั้น network ระดับ request
คอมโพเนนต์ยังเรียก `fetch` / `axios` เหมือน production — แค่ response ถูก mock

ข้อดี:

- ไม่ต้องเปลี่ยนโค้ด production เพื่อเทส
- ใช้ handlers ชุดเดียวได้ทั้ง unit/integration และ dev browser
- จำลองสถานะ HTTP จริง (200, 404, 500, delay)

```
Component ──fetch /api/users──▶ MSW worker/server ──▶ handlers ──▶ mock JSON
```

โครงมาตรฐานใน Jest:

```ts
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json([{ id: '1', name: 'Ada' }])),
  ),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

> **หมายเหตุ:** ตัวอย่างใน bootcamp ใช้ **MSW v1 (`rest`)** เพื่อเข้ากับ Jest/CJS ได้ลื่น
> ใน project ใหม่สามารถใช้ MSW v2 (`http` + `HttpResponse`) ได้ — แนวคิด intercept ที่ชั้น network เหมือนกัน

ใน `jest.setup`:

```ts
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

ดูตัวอย่างเต็ม: [`examples/03-msw-integration/`](./examples/03-msw-integration/)

---

## 7. Jest fetch mocks vs MSW

| มิติ                    | `jest.fn` บน fetch | MSW                                               |
| ----------------------- | ------------------ | ------------------------------------------------- |
| ความสมจริง              | ต่ำ–กลาง           | สูง — ผ่าน networking stack ของ app               |
| Setup                   | เร็วสำหรับเคสเดียว | คุ้มเมื่อมีหลาย endpoint                          |
| ใช้ซ้ำใน dev/browser    | ยาก                | ใช้ handlers ร่วมได้                              |
| Error/status simulation | ทำเอง              | สะดวกด้วย `ctx.status` (v1) / `HttpResponse` (v2) |

แนวทางเลือก:

- **function เดียวที่รับ `httpGet` เป็น dependency** → inject mock (ระดับ Beginner) เพียงพอ
- **คอมโพเนนต์เรียก fetch ตรง ๆ / มีหลาย endpoint** → **MSW**

---

## 8. กลยุทธ์ออกแบบ Test Suite ระดับ Intermediate

1. **จัดกลุ่มเทสตาม user flow** ไม่ใช่ตามชื่อไฟล์ implementation
2. **หนึ่ง assertion หลักที่สื่อ intent** ต่อเคส (เสริมด้วย assertion ประกอบได้)
3. **แชร์ render helper** เมื่อ Provider ซ้ำ (Router, QueryClient, Theme)
4. **override MSW handler ต่อเคส** สำหรับ error path — อย่าสร้าง server ใหม่ทุกไฟล์
5. **หลีกเลี่ยง snapshot ใหญ่ของทั้งหน้า** — เปราะและรีวิวยาก

```
ตัวอย่างแผนเทส LoginForm:
 ✓ แสดงฟิลด์ email/password และปุ่ม submit
 ✓ validate แล้วแสดงข้อความเมื่อ email ว่าง
 ✓ เรียก onSubmit ด้วยค่าที่ผู้ใช้กรอก
 ✓ แสดง error จาก server เมื่อ login ล้ม
 ✓ ปิดปุ่มระหว่างกำลัง submit
```

---

## 9. Best Practices สรุป

1. **Query เหมือนผู้ใช้ + screen reader** — `getByRole` ก่อน `getByTestId`
2. **prefer `userEvent.setup()`** ในทุกไฟล์เทสใหม่
3. **ใช้ `findBy` สำหรับ UI หลัง async** — เลิก `setTimeout` ในเทส
4. **MSW สำหรับขอบเขต network** — ไม่ mock ทั้ง module UI ยกแผง
5. **ทดสอบ loading / empty / error / success** ให้ครบ critical components
6. **อย่าเล็กลงไป assert CSS class** เว้นแต่ class นั้นมีความหมายต่อผู้ใช้ (เช่น `aria-*`)

---

## ไฟล์ตัวอย่างในระดับนี้

| folder                                                                     | สิ่งที่เรียนรู้                        |
| -------------------------------------------------------------------------- | -------------------------------------- |
| [`examples/01-rtl-basics/`](./examples/01-rtl-basics/)                     | render, role queries, click            |
| [`examples/02-queries-interactions/`](./examples/02-queries-interactions/) | get/find/query + userEvent + loading   |
| [`examples/03-msw-integration/`](./examples/03-msw-integration/)           | MSW handlers + data-fetching component |

เมื่อพร้อมแล้วไปที่ [`LAB.md`](./LAB.md)
