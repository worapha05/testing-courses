# Continuous Testing — Quality Gates (GitHub Actions)

ไฟล์ [`quality-gates.yml`](./quality-gates.yml) เป็นแม่แบบ pipeline ที่:

1. รัน unit/integration
2. ตรวจ coverage ขั้นต่ำ (แนวทาง)
3. รัน contract verification
4. รัน smoke E2E
5. (optional) k6 smoke บน staging
6. บล็อกเมื่อ gate ไม่ผ่าน

## หลักการออกแบบ

- **PR feedback เร็ว:** unit + lint + contract
- **ก่อน merge/deploy:** smoke E2E
- **Nightly:** full E2E matrix + DAST/perf ลึกขึ้น

## SAST/DAST ในภาพรวม

| Job        | เครื่องมือตัวอย่าง            |
| ---------- | ----------------------------- |
| SAST       | CodeQL, Semgrep, SonarQube    |
| Dependency | npm audit, Snyk, Trivy fs     |
| DAST       | OWASP ZAP baseline บน staging |
| Secrets    | gitleaks                      |

อย่าใส่ทุกอย่างในทุก PR — จัดตามความเสี่ยงและเวลา
