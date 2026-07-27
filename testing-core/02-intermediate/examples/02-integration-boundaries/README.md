# Integration at Repository Boundary

ตัวอย่างนี้ทดสอบ **CouponService ↔ CouponRepository** ด้วย in-memory fake ที่ mimic persistence

## ทำไมยังไม่ใช้ Testcontainers ในไฟล์นี้

- รันได้ทันทีโดยไม่ต้อง Docker
- สอนโครงสร้าง arrange/act/assert ของ integration ให้ชัดก่อน

## ต่อยอดสู่ Testcontainers (แนวทาง)

```js
// แนวคิด (ไม่บังคับรันใน lab นี้)
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer('postgres:16').start();
const connectionString = container.getConnectionUri();
// migrate schema → run CouponRepositoryPostgres tests → container.stop()
```

เมื่อไหร่ควรยกระดับ:

- SQL/query ซับซ้อน, trigger, isolation level สำคัญ
- พฤติกรรม DB vendor-specific
- migration ต้องถูกพิสูจน์จริง
