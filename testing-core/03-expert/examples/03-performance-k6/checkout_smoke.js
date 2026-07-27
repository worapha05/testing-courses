/**
 * k6 load script — รันด้วย: k6 run checkout_smoke.js
 * (ต้องติดตั้ง k6 แยกจาก Node)
 *
 * เป้าหมาย: smoke load เล็ก ๆ พร้อม SLO thresholds
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://httpbin.org';

export default function () {
  const res = http.get(`${BASE_URL}/get`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
