# NOTES — NovaShop Expert Lab Solution

## 1) แผนเทส Checkout (Pyramid + Non-functional)

| ชั้น        | ขอบเขต                                               | จำนวนแนวทาง                 |
| ----------- | ---------------------------------------------------- | --------------------------- |
| Unit        | pricing, coupon, tax, validation                     | มาก                         |
| Integration | order service ↔ inventory/payment fakes หรือ test DB | ปานกลาง                     |
| Contract    | checkout-web ↔ order-api                             | ทุก breaking surface        |
| E2E smoke   | login → add to cart → pay → confirmation             | 2–5 journeys                |
| Perf (k6)   | POST /orders under light load + thresholds           | PR optional / main required |
| Security    | SAST on PR, DAST nightly on staging                  | ตามความเสี่ยง               |
| Manual      | exploratory เรื่อง UX ข้อความ error                  | สั้น ๆ ต่อ release          |

## 2) คอขวด Automation ที่พบและวิธีลด

- **Flaky confirmation:** เคย `sleep(3000)` → เปลี่ยนเป็น `waitForText('Order confirmed')`
- **CI ช้า:** แยก unit (ทุก PR) กับ full E2E (nightly) + shard smoke
- **Shared user:** ใช้ `uniqueEmail` + API seed/teardown
- **API break ช้า:** เพิ่ม contract verification เป็น gate

## 3) Parallel & Teardown

- แต่ละ worker สร้าง user/order คนละชุด
- `withUser` รับประกัน `finally deleteUser`
- ห้ามพึ่งข้อมูล seed คงที่ชื่อ `demo@shop.com`
