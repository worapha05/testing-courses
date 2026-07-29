import { greet } from './greet';
import './style.css';

declare const __APP_TITLE__: string;

const app = document.querySelector<HTMLDivElement>('#app')!;
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

app.innerHTML = `
  <main class="hero">
    <p class="eyebrow">${__APP_TITLE__}</p>
    <h1>${greet('Vite')}</h1>
    <p>VITE_API_URL = <code>${apiUrl}</code></p>
    <p class="hint">Dev = native ESM · Prod = Rollup bundle</p>
  </main>
`;
