import puppeteer from 'puppeteer';

async function run() {
  const url = process.argv[2] || 'http://localhost:5546/nimbiCMS_pre/';
  console.log('Opening', url);
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG>', msg.text()));
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(1500);
    const logs = await page.evaluate(() => {
      try { return window.__nimbiFetchDebug && window.__nimbiFetchDebug.logs || []; } catch (e) { return { error: String(e) }; }
    });
    console.log('FETCH_DEBUG_LOGS_START');
    console.log(JSON.stringify(logs, null, 2));
    console.log('FETCH_DEBUG_LOGS_END');
  } catch (e) {
    console.error('ERROR loading page:', e);
    try {
      const html = await page.content();
      console.log('PAGE_HTML_START');
      console.log(html.slice(0, 2000));
      console.log('PAGE_HTML_END');
    } catch (_) {}
  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
