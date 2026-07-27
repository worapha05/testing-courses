import { greet } from './greet.js';
import './styles.scss';

const app = document.getElementById('app');
const apiUrl = process.env.API_URL || 'http://localhost:3000';

app.innerHTML = `
  <main class="hero">
    <h1>${greet('Webpack')}</h1>
    <p>API_URL = <code>${apiUrl}</code></p>
  </main>
`;
