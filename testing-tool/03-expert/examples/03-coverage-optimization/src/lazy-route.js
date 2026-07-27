// Dynamic import example (Vite/Webpack both support this)

export async function loadAdminPanel() {
  const mod = await import('./admin-panel.js');
  return mod.renderAdmin();
}
