import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { steps } from './steps/reservation.steps.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const featurePath = path.join(__dirname, 'features', 'reservation.feature');
const lines = fs
  .readFileSync(featurePath, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && !l.startsWith('Feature:'));

let passed = 0;
let failed = 0;

async function runStep(line) {
  for (const step of steps) {
    const match = line.match(step.pattern);
    if (match) {
      await step.fn(match);
      return;
    }
  }
  throw new Error(`No step definition for: ${line}`);
}

for (const line of lines) {
  if (line.startsWith('Scenario:')) {
    console.log(`\n${line}`);
    continue;
  }
  try {
    await runStep(line);
    passed += 1;
    console.log(` ✓ ${line}`);
  } catch (error) {
    failed += 1;
    console.error(` ✗ ${line}`);
    console.error(` ${error.message}`);
  }
}

console.log(`\nBDD summary: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
