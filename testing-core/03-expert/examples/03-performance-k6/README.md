# Performance smoke with k6

## ติดตั้ง

ดู [https://k6.io/docs/get-started/installation/](https://k6.io/docs/get-started/installation/)

## รัน

```bash
k6 run checkout_smoke.js
BASE_URL=https://staging.example.com k6 run checkout_smoke.js
```

## ตีความ

- `http_req_failed` rate เกินเกณฑ์ → fail (เหมาะเป็น quality gate)
- `p(95)` latency เกินงบ → สัญญาณถดถอยสมรรถนะ

สำหรับ Locust (Python) แนวคิดเดียวกัน: users + spawn rate + assert ใน listener/เกณฑ์ภายนอก
