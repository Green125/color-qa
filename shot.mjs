import { chromium } from 'playwright';
import fs from 'fs';
const lines = fs.readFileSync('referees/referees.txt','utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
for (const line of lines) {
  const [name, url] = line.split('|');
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `referees/${name}.png`, fullPage: true });
    fs.writeFileSync(`referees/${name}.txt`, await page.evaluate(() => document.body.innerText));
    console.log('ok:', name);
  } catch (e) { console.log('failed:', name, String(e)); }
}
await browser.close();
