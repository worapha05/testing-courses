# Lab ระดับ Intermediate — แดชบอร์ด “PulseBoard”

## เป้าหมาย

สร้างและทดสอบคอมโพเนนต์แดชบอร์ดสมาชิก **PulseBoard**:

1. `MemberCard` — UI component ด้วย RTL
2. `InviteForm` — queries + userEvent + loading/error
3. `MemberDirectory` — integration กับ MSW

ทำด้วยตัวเองก่อน แล้วค่อยเทียบกับ [`lab/solution/`](./lab/solution/)

---

## กรณีศึกษา

ทีม HR ของ **PulseBoard** มีหน้าสมาชิกที่เคยเทสด้วย Enzyme + snapshot
เทสผ่านแต่ production พังเพราะ snapshot ไม่จับพฤติกรรมผู้ใช้

QA Lead ต้องการ:

- เทสที่ query ด้วย **accessible role/label**
- จำลอง API ด้วย **MSW** ทั้ง success / 401 / empty
- ครอบคลุม form เชิญสมาชิกใหม่

---

## โจทย์

### ส่วนที่ 1 — MemberCard

สร้าง `MemberCard` ที่รับ props:

```ts
{
  name: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited';
}
```

ข้อกำหนด UI:

- แสดงชื่อเป็น heading
- แสดง role และ status เป็นข้อความ
- ถ้า `status === 'invited'` แสดงปุ่ม `Resend invite`
- เรียก `onResend` เมื่อคลิกปุ่ม

เขียนเทสอย่างน้อย 2 เคสด้วย RTL + userEvent

### ส่วนที่ 2 — InviteForm

form มีฟิลด์ Email + ปุ่ม `Send invite`

- ถ้า email ว่าง → `role="alert"` ข้อความ `Email is required`
- ระหว่างรอ `onInvite` → ปุ่มขึ้น `Sending…` และ disabled
- สำเร็จ → `role="status"` ข้อความ `Invite sent`
- `onInvite` reject → แสดง error message จาก Error

### ส่วนที่ 3 — MemberDirectory + MSW

คอมโพเนนต์โหลด `GET /api/members` แล้วแสดงรายการ

Handlers เริ่มต้นคืน:

```json
[
  { "id": "1", "name": "Ada", "role": "admin", "status": "active" },
  { "id": "2", "name": "Grace", "role": "member", "status": "invited" }
]
```

เทสที่ต้องมี:

1. เห็น loading แล้วเห็นรายชื่อ
2. override เป็น 401 → เห็น alert
3. override เป็น `[]` → เห็น empty state

### ส่วนที่ 4 — คำถามคิด (`NOTES.md`)

1. เมื่อไหร่ใช้ `queryBy` แทน `getBy`?
2. ทำไม `userEvent` ดีกว่า `fireEvent` สำหรับ form?
3. ข้อดีของ MSW เทียบกับ `jest.spyOn(global, 'fetch')`?

---

## เกณฑ์ผ่าน

- [ ] เทส MemberCard / InviteForm / MemberDirectory ผ่าน
- [ ] ไม่ใช้ `container.querySelector('.css-class')` เป็นหลัก
- [ ] มี `NOTES.md`

```bash
npm run test:lab:intermediate
```

---

## เฉลย

ดู [`lab/solution/`](./lab/solution/)
