// Revisa la presentación sin abrir el navegador: una captura por cada → y pruebas de navegación.
// Uso (desde la carpeta de tu presentación, con `npm i puppeteer-core` hecho ahí):
//   node <ruta-del-skill>/scripts/capturas.mjs "http://localhost:8000/#1" [veces que se presiona →] [espera en ms] [prefijo] [carpeta]
// Si no das las veces, las cuenta solo: (láminas − 1) + la suma de todos los data-steps.
// Requiere Google Chrome; si está en otra ruta, ponla en la variable CHROME.
import { createRequire } from 'module';
import fs from 'fs';

const puppeteer = createRequire(process.cwd() + '/')('puppeteer-core');
const CHROME = process.env.CHROME || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');
const [, , url, pressesArg, waitMs = '4500', prefix = 'lam', dir = './capturas'] = process.argv;
if (!url) { console.error('Falta la URL. Ejemplo: node capturas.mjs "http://localhost:8000/#1"'); process.exit(1); }
fs.mkdirSync(dir, { recursive: true });

const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
const espera = (ms = +waitMs) => new Promise((r) => setTimeout(r, ms));
const base = url.split('#')[0];
const lamina = () => p.evaluate(() => [...document.querySelectorAll('.slide')].findIndex((s) => s.classList.contains('is-on')) + 1);

await p.goto(url, { waitUntil: 'networkidle0' });
await espera();
const presses = pressesArg !== undefined && pressesArg !== '' ? +pressesArg : await p.evaluate(() => {
  const s = [...document.querySelectorAll('.slide')];
  return s.length - 1 + s.reduce((a, x) => a + +(x.dataset.steps || 0), 0);
});

// 1) recorrido hacia adelante, una captura por paso
let n = 0;
const foto = async () => {
  await p.screenshot({ path: `${dir}/${prefix}-${String(n++).padStart(2, '0')}-lamina${await lamina()}.jpg`, type: 'jpeg', quality: 75 });
};
await foto();
for (let i = 0; i < presses; i++) { await p.keyboard.press('ArrowRight'); await espera(); await foto(); }

// 2) ← regresa un paso o una lámina
await p.keyboard.press('ArrowLeft'); await espera(1200);
await p.screenshot({ path: `${dir}/${prefix}-regreso.jpg`, type: 'jpeg', quality: 75 });

// 3) cinco → rápidos: debe quedar una sola lámina en pantalla
await p.goto(`${base}#1`, { waitUntil: 'networkidle0' }); await espera(800);
for (let i = 0; i < 5; i++) { await p.keyboard.press('ArrowRight'); await espera(60); }
await espera(1500);
const visibles = await p.evaluate(() => document.querySelectorAll('.slide.is-on, .slide.leave-fwd, .slide.leave-back').length);

// 4) abrir con #3
await p.evaluate(() => { location.hash = '#3'; }); await espera(1200);
const conHash = await lamina();

console.log(`Capturas: ${n} en ${dir}`);
console.log(`Teclas rápidas: ${visibles === 1 ? 'bien (1 lámina en pantalla)' : `MAL (${visibles} láminas en pantalla)`}`);
console.log(`#3 abre la lámina ${conHash}${conHash === 3 ? ' (bien)' : ' (MAL)'}`);
console.log(errores.length ? `Errores en consola:\n${errores.join('\n')}` : 'Sin errores en consola.');
await b.close();
