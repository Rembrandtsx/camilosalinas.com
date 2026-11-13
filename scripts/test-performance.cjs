// Run with npm test. Use CHROME_PATH for an existing Chrome, or npx playwright install chromium.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.gif':'image/gif', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.mp3':'audio/mpeg' };
const server = http.createServer((req,res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const stat = fs.statSync(file);
    res.writeHead(200, { 'Content-Type':types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length':stat.size });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end(); }
});
(async () => {
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url = 'http://127.0.0.1:' + server.address().port;
 const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,headless:true,args:['--enable-unsafe-swiftshader']});
 try {
  for (const mobile of [false,true]) {
   const page = await browser.newPage({ viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1 });
   const errors=[], missing=[], requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith(url) && r.status()>=400)missing.push(r.url());});
   page.on('request',r=>requests.push(r.url()));
   // Block external fonts and analytics: the site must remain usable when those services fail.
   await page.route('https://**/*',route=>route.abort());
   await page.goto(url,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>typeof grid !== 'undefined');
   assert.deepEqual(missing,[],'No missing initial assets');
   assert.equal(await page.locator('body.loading').count(),0,'No page-wide loading gate');
   assert.equal(await page.locator('.content__title .char').count()>0,true,'Text animation initialized');
   assert.equal(requests.some(u=>u.includes('/audioplayer/')||u.endsWith('.mp4')||u.endsWith('.mp3')),false,'No initial video, audio, or WebGL requests');
   assert.equal(await page.locator('iframe#likes').getAttribute('src'),null,'Player remains deferred');
   assert.equal(await page.locator('.content__article img[src], .slide img[src]').count(),0,'Hidden images remain deferred');
   await page.waitForTimeout(1200);
   assert.equal(await page.evaluate(()=>grid.frame),null,'Hero animation settles instead of looping forever');
   if(mobile)assert.equal(await page.evaluate(()=>cursor),null,'Touch devices skip custom cursor');
   const output=process.env.PERFORMANCE_SCREENSHOTS;
   if(output){fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,mobile?'after-mobile-fallback.png':'after-desktop-fallback.png')});}
   // Exercise all project overlays and their close controls, including offscreen content images.
   const links=page.locator('.item__excerpt-link');
   for(let i=0;i<await links.count();i++) {
    await links.nth(i).evaluate(el=>el.click());
    const article=page.locator('.content__article--open');
    assert.equal(await article.count(),1,'Exactly one project is open');
    assert.equal(await article.locator('img[data-src]').count(),0,'Opened project gets image sources');
    await page.waitForTimeout(1700);
    const first=article.locator('img').first();
    await first.scrollIntoViewIfNeeded();
    await first.evaluate(img=>img.decode());
    assert.equal(await first.evaluate(img=>img.naturalWidth>0),true,'Project image decodes');
    await page.locator('.content__back').evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));
    await page.waitForFunction(()=>!document.querySelector('.content__article--open'));
   }
   // Navigate through every gallery slide so deferred URLs, image ratios, and videos are exercised.
   const shows=page.locator('.slides');
   for(let i=0;i<await shows.count();i++) {
    const show=shows.nth(i);
    await show.scrollIntoViewIfNeeded();
    const count=await show.locator('.slide').count();
    for(let j=0;j<count;j++) {
     await page.waitForTimeout(1100);
     await page.waitForFunction(i=>document.querySelectorAll(".slides")[i].querySelectorAll(".slide--current").length===1,i);
     const active=show.locator('.slide--current');
     assert.equal(await active.count(),1,'Gallery has one active slide');
     const imgs=active.locator('img');
     for(let k=0;k<await imgs.count();k++) {
      await imgs.nth(k).evaluate(async img=>{img.loading='eager';await img.decode();});
      assert.equal(await imgs.nth(k).evaluate(img=>img.naturalWidth>0),true,'Gallery image decodes');
     }
     if(output && j===1)await page.screenshot({path:path.join(output,`after-${mobile?'mobile':'desktop'}-gallery-${i}.png`)});
     await show.locator('.slides__nav--next').evaluate(el=>el.click());
    }
   }
   // The WebGL app loads only once its section is approached, and can queue/play a track.
   const iframe=page.locator('#likes');
   await iframe.scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.querySelector('#likes').getAttribute('src'));
   const frame=await iframe.contentFrame();
   await frame.locator('#canvas').waitFor();
   await frame.locator('#hero-card').click({force:true});
   const trackRequested = page.waitForResponse(r=>r.url().includes('/audio/music/') && r.status() === 200,{timeout:20000});
   await page.keyboard.down('Space');
   await trackRequested;
   await page.waitForTimeout(1000);
   await page.keyboard.up('Space');
   await page.waitForTimeout(1000);
   assert.equal(requests.some(u=>u.includes('/audio/music/')&&u.includes('.mp3')),true,'Music interaction requests a track');
   assert.equal(await frame.locator('canvas').evaluate(el=>el.width>0&&el.height>0),true,'WebGL canvas initialized');
   assert.deepEqual(missing,[],'No local 404s');
   assert.deepEqual(errors,[],'No uncaught browser errors');
   console.log((mobile?'Mobile':'Desktop')+': deferred media, all projects and gallery slides, and audio interaction passed.');
   await page.close();
  }
  const reduced=await browser.newPage({reducedMotion:'reduce'});
  await reduced.route('https://**/*',route=>route.abort());
  await reduced.goto(url,{waitUntil:'networkidle'});
  assert.equal(await reduced.evaluate(()=>grid.frame),null,'Reduced motion stops hero loop');
  assert.equal(await reduced.evaluate(()=>cursor),null,'Reduced motion skips custom cursor');
  await reduced.close();
  console.log('Reduced-motion checks passed.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
