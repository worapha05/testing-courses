# Level 1 — Beginner: Build Tools Foundations & Unit Testing Basics

เป้าหมายระดับนี้: ให้คุณเข้าใจ **ทำไมต้องมี Module Bundler** ตั้งค่า **Webpack / Vite** ได้จากศูนย์
และเขียน **Unit Test ด้วย Jest** ได้อย่างมั่นใจ — ไม่ใช่แค่คัดลอก config

---

## สารบัญ

1. [Evolution of Tooling — Module Bundler คืออะไร](#1-evolution-of-tooling--module-bundler-คืออะไร)
2. [Webpack: Dependency Graph และ Pipeline](#2-webpack-dependency-graph-และ-pipeline)
3. [Vite: Native ESM Dev Server และ Production Build](#3-vite-native-esm-dev-server-และ-production-build)
4. [เปรียบเทียบ Webpack vs Vite](#4-เปรียบเทียบ-webpack-vs-vite)
5. [Assets, CSS Preprocessors และ Environment Variables](#5-assets-css-preprocessors-และ-environment-variables)
6. [Unit Testing ด้วย Jest](#6-unit-testing-ด้วย-jest)
7. [Assertions, Mocks และ Async Testing](#7-assertions-mocks-และ-async-testing)
8. [กลยุทธ์ออกแบบ Test Suite ระดับ Beginner](#8-กลยุทธ์ออกแบบ-test-suite-ระดับ-beginner)
9. [Best Practices สรุป](#9-best-practices-สรุป)

---

## 1. Evolution of Tooling — Module Bundler คืออะไร

ในยุคแรกของเว็บ เราใส่ `<script>` หลายไฟล์ตามลำดับ — พอ project โตขึ้นเกิดปัญหา:

- **Dependency order** ผิดลำดับ → `undefined is not a function`
- **Global namespace pollution** — ตัวแปรชนกัน
- **ไม่มี tree shaking / code splitting** — ส่ง JS ทั้งก้อนให้ผู้ใช้
- **ไม่รองรับ npm ecosystem** โดยตรงใน browser เก่า

**Module Bundler** คือเครื่องมือที่:

1. อ่าน **entry point** ของแอป
2. เดินตาม `import` / `require` สร้าง **Dependency Graph**
3. แปลง (transpile / load) ไฟล์ตามชนิด (JS, CSS, images, fonts)
4. รวม/แยกเป็น **bundles** พร้อม optimize สำหรับ production

```
Entry: src/index.js
 │
 ├─► utils/math.js
 ├─► components/App.js ──► styles.css
 └─► api/client.js ──► node_modules/axios/...

   ▼
  Dependency Graph
   ▼
  Loaders / Plugins / Transforms
   ▼
 dist/main.js + dist/vendor.js + assets
```

ดูแนวคิดแบบจำลอง: [`examples/01-bundler-concepts/`](./examples/01-bundler-concepts/)

### ประวัติสั้น ๆ ที่ควรรู้

| ยุค       | เครื่องมือ                | จุดเด่น                                           |
| --------- | ------------------------- | ------------------------------------------------- |
| ก่อน 2012 | Concat + Grunt/Gulp       | Task runner ไม่ใช่ module graph จริง              |
| 2012+     | Browserify, RequireJS     | นำ CommonJS/AMD มาใช้ใน browser                   |
| 2014+     | **Webpack**               | Loader/Plugin ecosystem ขนาดใหญ่                  |
| 2015+     | Rollup                    | Library bundling / ESM-first                      |
| 2020+     | **Vite**, esbuild, Parcel | Dev server เร็วด้วย native ESM / Go-based bundler |

---

## 2. Webpack: Dependency Graph และ Pipeline

Webpack ทำงานแบบ **build-time graph analysis**:

1. เริ่มจาก `entry`
2. ใช้ **resolver** หาไฟล์จาก path / `node_modules`
3. ส่งผ่าน **loaders** (แปลงไฟล์ทีละชนิด)
4. ใช้ **plugins** แทรกที่ lifecycle ของ compilation (inject HTML, define env, mini-css, etc.)
5. เขียนผลลัพธ์ตาม `output`

### แนวคิดสำคัญ

| คำศัพท์    | ความหมาย                                                            |
| ---------- | ------------------------------------------------------------------- |
| **Entry**  | จุดเริ่มต้นของ graph                                                |
| **Loader** | แปลงไฟล์ก่อนเข้า module system (เช่น `sass-loader`, `babel-loader`) |
| **Plugin** | ขยายทั้ง compilation (เช่น `HtmlWebpackPlugin`)                     |
| **Chunk**  | กลุ่ม module ที่ถูกแยกออกมา (code splitting)                        |
| **HMR**    | Hot Module Replacement — updatemodule โดยไม่รีโหลดทั้งหน้า          |

ตัวอย่าง config: [`examples/02-webpack-basics/webpack.config.cjs`](./examples/02-webpack-basics/webpack.config.cjs)

```js
// โครง webpack.config แบบย่อ
module.exports = {
  entry: './src/index.js',
  output: { filename: '[name].[contenthash].js', path: dist },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader' },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
};
```

### ทำไม Webpack ถึง “ช้าตอน dev” ใน project ใหญ่?

เพราะ dev server ของ Webpack แบบดั้งเดิมมัก **bundle ทั้ง graph** ก่อนเสิร์ฟ
แม้จะมี cache / HMR ช่วยแล้ว project ใหญ่ยังรู้สึกหน่วงเมื่อ cold start — นี่คือจุดที่ Vite เข้ามาแก้ด้วยแนวคนละแบบ

---

## 3. Vite: Native ESM Dev Server และ Production Build

Vite แยกโลก **development** กับ **production** ชัดเจน:

### Development

- เสิร์ฟซอร์สเป็น **native ES modules** ให้ browser
- แปลงเฉพาะไฟล์ที่ถูก request (on-demand)
- พึ่ง **esbuild** สำหรับ transpile TS/JSX เร็วมาก
- HMR ระดับ module — update เฉพาะไฟล์ที่เปลี่ยน

```
Browser ──import──▶ Vite Dev Server ──▶ src/App.tsx (แปลงเฉพาะไฟล์นี้)
    │
    └──▶ pre-bundle deps ด้วย esbuild (node_modules)
```

### Production

- ใช้ **Rollup** bundle เพื่อ optimize (tree shaking, code splitting, asset hashing)
- ได้ผลลัพธ์ใกล้เคียง bundler แบบดั้งเดิม แต่ DX ตอนพัฒนาดีกว่ามาก

ตัวอย่าง config: [`examples/03-vite-basics/vite.config.ts`](./examples/03-vite-basics/vite.config.ts)

```ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE ?? 'Bootcamp'),
    },
  };
});
```

> **หมายเหตุ:** ตัวแปร env ที่จะเปิดให้ client เห็นใน Vite ต้องขึ้นต้นด้วย `VITE_`

---

## 4. เปรียบเทียบ Webpack vs Vite

| มิติ                | Webpack                                                  | Vite                                            |
| ------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Dev model           | Bundle แล้วเสิร์ฟ (หรือ lazy compile ตาม version/config) | Native ESM + on-demand transform                |
| Cold start          | ช้าลงเมื่อ graph ใหญ่                                    | เร็ว — ไม่ต้อง bundle ทั้งแอปก่อน               |
| Production bundler  | Webpack เอง                                              | Rollup                                          |
| Config mental model | Loader + Plugin ละเอียด                                  | Plugin เรียบง่ายกว่า มัก convention-over-config |
| Ecosystem           | ใหญ่มาก / mature สำหรับ legacy                           | เติบโตเร็ว เหมาะ project ใหม่                   |
| เมื่อไหร่เลือก      | Legacy, custom pipeline ซับซ้อน                          | SPA ใหม่, DX สำคัญ                              |

```
Webpack mindset: "ฉันควบคุมทุกขั้นของ graph และ emit"
Vite mindset: "Dev ให้ browser โหลด ESM; Build ค่อย optimize ด้วย Rollup"
```

---

## 5. Assets, CSS Preprocessors และ Environment Variables

### Assets

| ชนิด          | Webpack                                    | Vite                                          |
| ------------- | ------------------------------------------ | --------------------------------------------- |
| รูปภาพ        | `asset/resource` หรือ file-loader          | `import url from './logo.svg'` ได้เลย         |
| CSS/SCSS      | `css-loader` + `sass-loader`               | ใส่ `.scss` แล้ว Vite จัดการ (ติดตั้ง `sass`) |
| Static public | `public/` ผ่าน CopyPlugin หรือ Html plugin | folder `public/` copy ตามเดิม                 |

### Environment Variables — Best Practices

1. **อย่า commit secret** ลง git — ใช้ `.env.local` / secret store ใน CI
2. แยกไฟล์ตามโหมด: `.env`, `.env.development`, `.env.production`, `.env.test`
3. Client bundle เห็นได้เฉพาะค่าที่ตั้งใจ expose (Webpack: `DefinePlugin` / `Dotenv`; Vite: `VITE_*`)
4. ในเทส ตั้ง env ใน `jest.setup` หรือ `setupFiles` ให้ deterministic

ตัวอย่างใน lab จะให้คุณแก้เคสที่ **env ไม่โหลด** และ **SCSS พังตอน build**

---

## 6. Unit Testing ด้วย Jest

**Unit test** ทดสอบหน่วยเล็กสุดที่แยกได้ (function, class, util) โดยตัด dependency ภายนอกออก

Jest ให้ครบในที่เดียว:

- Test runner
- Assertion library (`expect`)
- Mocking (`jest.fn`, `jest.mock`)
- Snapshot (ใช้อย่างระวัง)
- Coverage (Istanbul/V8)

ตัวอย่าง: [`examples/04-jest-unit-testing/`](./examples/04-jest-unit-testing/)

### โครงสร้างเทสที่ดี

```js
describe('calculateDiscount', () => {
  it('returns 0 when price is 0', () => {
    expect(calculateDiscount(0, 10)).toBe(0);
  });

  it('caps discount at 50%', () => {
    expect(calculateDiscount(100, 80)).toBe(50);
  });
});
```

แนวทางตั้งชื่อ:

- `describe` = หน่วยที่ทดสอบ (function/module)
- `it` / `test` = พฤติกรรมที่สังเกตได้จากมุมผู้ใช้ของ API นั้น
- หลีกเลี่ยงชื่อแบบ `works correctly`

---

## 7. Assertions, Mocks และ Async Testing

### Assertions ที่ใช้บ่อย

```js
expect(value).toBe(1); // ===
expect(obj).toEqual({ a: 1 }); // deep equal
expect(list).toContain('x');
expect(fn).toThrow(/invalid/i);
expect(received).toMatchObject({ id: '1' });
```

### Mocking Functions

```js
const sendEmail = jest.fn().mockResolvedValue({ ok: true });

await notifyUser({ email: 'a@b.com' }, { sendEmail });

expect(sendEmail).toHaveBeenCalledTimes(1);
expect(sendEmail).toHaveBeenCalledWith('a@b.com', expect.any(String));
```

ทำไมต้อง mock?

- ตัด I/O จริง (network, filesystem, clock)
- ทำให้เทส **เร็ว / deterministic / ไม่พึ่งบริการภายนอก**
- ตรวจว่าหน่วยเรียก collaborator ถูกต้อง

### Asynchronous Utilities

```js
// Promise
await expect(fetchUser('1')).resolves.toMatchObject({ id: '1' });
await expect(fetchUser('missing')).rejects.toThrow('Not found');

// Callback-style (หายากลงแล้ว)
function run(cb) {
  setTimeout(() => cb(null, 'ok'), 10);
}
await new Promise((resolve, reject) => {
  run((err, data) => (err ? reject(err) : resolve(data)));
});
```

ใช้ `fake timers` เมื่อทดสอบ logic ที่พึ่งเวลา:

```js
jest.useFakeTimers();
const spy = jest.fn();
schedule(spy, 1000);
jest.advanceTimersByTime(1000);
expect(spy).toHaveBeenCalled();
jest.useRealTimers();
```

---

## 8. กลยุทธ์ออกแบบ Test Suite ระดับ Beginner

1. **เรียงจาก pure function ก่อน** — ไม่มี side effect ทดสอบง่ายที่สุด
2. **หนึ่งพฤติกรรมต่อหนึ่งเทส** — fail แล้วรู้ทันทีว่าอะไรพัง
3. **Arrange → Act → Assert** ให้ชัดในทุกเคส
4. **อย่าทดสอบ implementation detail** ของ bundler ใน unit test — ทดสอบ logic ของคุณ
5. **ตั้ง CI ให้รัน unit ทุก PR** ตั้งแต่วันแรก แม้ยังไม่มี E2E

```
แนะนำสัดส่วนตอนเริ่ม project:
 Unit ........ 70–80%
 Integration . 15–25% (ระดับ Intermediate)
 E2E ......... 5–10% (ระดับ Expert)
```

---

## 9. Best Practices สรุป

1. **เข้าใจ graph ก่อนจูน config** — รู้ entry, loader, plugin แล้วค่อย optimize
2. **Vite สำหรับ project ใหม่เป็นค่าเริ่มต้นที่สมเหตุสมผล** — Webpack เมื่อมี constraint ชัด
3. **Env แยกโหมด + ไม่ commit secret**
4. **Jest: mock ที่ขอบ, assert ที่พฤติกรรม**
5. **เทสต้องเร็วและเสถียร** — ถ้าเทสกระพริบ (flaky) ให้แก้ก่อนเพิ่มเคสใหม่
6. **ตั้งชื่อเทสเป็นสเปก** — อ่าน `it(...)` แล้วรู้ requirement

---

## ไฟล์ตัวอย่างในระดับนี้

| folder                                                               | สิ่งที่เรียนรู้                |
| -------------------------------------------------------------------- | ------------------------------ |
| [`examples/01-bundler-concepts/`](./examples/01-bundler-concepts/)   | Dependency graph จำลอง         |
| [`examples/02-webpack-basics/`](./examples/02-webpack-basics/)       | `webpack.config`, SCSS, env    |
| [`examples/03-vite-basics/`](./examples/03-vite-basics/)             | `vite.config.ts`, env `VITE_*` |
| [`examples/04-jest-unit-testing/`](./examples/04-jest-unit-testing/) | expect, jest.fn, async         |

เมื่อพร้อมแล้วไปที่ [`LAB.md`](./LAB.md) — โจทย์สถานการณ์จริงพร้อมเฉลย
