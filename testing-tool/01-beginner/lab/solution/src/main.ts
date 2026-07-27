declare const __APP_TITLE__: string;

const app = document.querySelector('#app')!;
app.innerHTML = `
  <h1>${__APP_TITLE__}</h1>
  <p>VITE_API_URL = <code>${import.meta.env.VITE_API_URL}</code></p>
`;
