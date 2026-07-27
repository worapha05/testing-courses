# Contract Testing (Pact-style)

ตัวอย่างนี้สอน **แนวคิด Consumer-Driven Contract** โดยไม่บังคับติดตั้ง Pact CLI/Broker

## ลำดับจริงในองค์กร

1. Consumer เขียนเทส → ได้ pact file
2. upload ไป Pact Broker / artifact store
3. Provider pipeline ดึง contract มา verify กับ API จริง
4. ถ้าพัง → บล็อก deploy provider (หรือ consumer ตามนโยบาย)

```bash
npm test
```
