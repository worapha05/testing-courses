# Example 01 — STLC & Testing Pyramid Mapping

ตัวอย่างนี้เป็น **เอกสารปฏิบัติการย่อ** แสดงวิธีแตกงานคุณภาพตามชั้นเทส
ใช้เป็นแม่แบบตอน kickoff feature ใหม่

## Feature ตัวอย่าง: Checkout Coupon

### ความเสี่ยงหลัก

| ความเสี่ยง                     | Severity | ชั้นเทสที่เหมาะสม              |
| ------------------------------ | -------- | ------------------------------ |
| คิดส่วนลดผิด                   | Critical | Unit (domain)                  |
| Coupon หมดอายุแล้วยังใช้ได้    | High     | Unit + Integration (time/DB)   |
| จ่ายเงินซ้ำเมื่อ retry         | Critical | Integration (payment boundary) |
| UI ไม่แสดงยอดสุทธิ             | Medium   | Component / E2E smoke          |
| ผู้ใช้สับสนเรื่องเงื่อนไขคูปอง | Medium   | Manual exploratory             |

### แผนการกระจายเทส (Pyramid-aligned)

```text
Unit (70%)
 - calculateDiscount(price, coupon)
 - validateCoupon(coupon, now)
 - applyTax(subtotal, region)

Integration (20%)
 - OrderService + CouponRepository (fake/in-memory หรือ test DB)
 - PaymentClient boundary (contract of request/response)

E2E (10%)
 - Happy path: login → cart → apply coupon → pay → order confirmed

Manual
 - สำรวจข้อความ error ที่เข้าใจยาก / edge UX
```

### Entry / Exit Criteria

- **Entry:** acceptance criteria ชัด, API contract draft พร้อม, fixture คูปองพร้อม
- **Exit:** unit ผ่านทั้งหมด, ไม่มี Sev-1/2 เปิด, smoke E2E ผ่านบน staging

ดูโค้ด domain ที่สอดคล้องใน `../02-unit-aaa`
