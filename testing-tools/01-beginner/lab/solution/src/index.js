import './styles.scss';

const app = document.getElementById('app');
app.innerHTML = `
  <h1>ToolShop (Webpack)</h1>
  <p>API_URL = <code>${process.env.API_URL}</code></p>
`;
