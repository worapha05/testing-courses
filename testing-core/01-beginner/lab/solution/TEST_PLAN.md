# Test Plan — Loyalty Pricing Engine (ย่อ)

## ขอบเขต

พิสูจน์ว่าการคำนวณราคาหลังส่วนลดสมาชิก + โบนัสยอด + VAT ถูกต้องตาม requirement

## การกระจายตาม Testing Pyramid

| ชั้น                  | เคสที่ครอบคลุม                                            | เหตุผล                          |
| --------------------- | --------------------------------------------------------- | ------------------------------- |
| Unit                  | member tiers, threshold bonus, tax, clamp ≥ 0, empty cart | logic บริสุทธิ์ เร็ว ถูก เสถียร |
| Integration (นอก lab) | อ่าน membership จาก DB / cache                            | ขอบเขต I/O จริง                 |
| E2E (นอก lab)         | ผู้ใช้ GOLD ซื้อครบ 1000 แล้วเห็นยอดสุดท้าย               | critical journey ชิ้นเดียว      |
| Manual                | ข้อความใน UI / ความเข้าใจเงื่อนไข                         | exploratory                     |

## Entry Criteria

- Requirement ยืนยันแล้ว
- สูตรส่วนลดไม่คลุมเครือ (ลำดับ: member % → flat bonus → tax)

## Exit Criteria

- Unit ผ่านทั้งหมดใน CI
- ไม่มี Sev-1 เปิดเรื่องราคาผิด
- มี regression tests สำหรับบั๊กที่เคยเจอ

## ความเสี่ยงค้าง

- การปัดเศษทศนิยมข้ามสกุลเงินหลายประเทศยังไม่อยู่ใน scope
