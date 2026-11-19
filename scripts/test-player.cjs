const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium,devices}=require('playwright');
const tracks=require('../audioplayer/lib/tracks.json');
const server=require('./serve.cjs')(path.resolve(__dirname,'..'));
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://**/*',r=>r.abort());
  await page.addInitScript(()=>{
    const Original=window.AudioContext;
    window.__analysers=[];
    window.AudioContext=class extends Original {createAnalyser(){const a=super.createAnalyser();window.__analysers.push(a);return a;}};
  });
  await page.goto(url,{waitUntil:'networkidle'});
  const iframe=page.locator('#likes');await iframe.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#likes').contentDocument?.querySelector('#canvas')?.style.display==='block');
  const frame=await iframe.elementHandle().then(el=>el.contentFrame());
  await frame.waitForFunction(()=>document.querySelector('.intro-2').style.display==='block');
  const box=await iframe.boundingBox();
  await page.mouse.move(box.x+200,Math.max(150,box.y+200));await page.waitForTimeout(600);
  let rect=await page.locator('.cursor').boundingBox();
  assert.ok(Math.abs(rect.x+rect.width/2-(box.x+200))<2,'Cursor follows inside the music iframe');
  await page.mouse.move(box.x+420,Math.max(220,box.y+320));await page.waitForTimeout(600);
  rect=await page.locator('.cursor').boundingBox();
  assert.ok(Math.abs(rect.x+rect.width/2-(box.x+420))<2,'Cursor keeps following across the player');
  await page.mouse.click(box.x+420,Math.max(220,box.y+320));
  for(let i=0;i<tracks.length;i++) {
    await page.keyboard.down('Space');await page.waitForTimeout(120);await page.keyboard.up('Space');
    await frame.waitForFunction(file=>{const a=document.querySelector('audio[data-track="'+file+'"]');return a&&!a.paused&&!a.seeking&&a.readyState>=3;},tracks[i].file,{timeout:30000});
    await page.waitForTimeout(500);
    let state=await frame.locator('audio').evaluateAll(list=>list.map(a=>({time:a.currentTime,paused:a.paused,track:a.dataset.track})));
    assert.equal(state.length,1,'Old track elements are released');
    assert.equal(state[0].track,tracks[i].file);
    assert.ok(state[0].time>=tracks[i].start && state[0].time<tracks[i].start+4,JSON.stringify(state));
    if(i===1 || i===2) {
      await frame.locator('audio').evaluate((a,end)=>{a.currentTime=end-0.03;},tracks[i].end);
      await frame.waitForFunction(start=>{const a=document.querySelector('audio');return !a.seeking&&!a.paused&&a.currentTime>=start&&a.currentTime<start+2;},tracks[i].start);
      console.log(tracks[i].file+': starts and loops at '+tracks[i].start+'s, before noise after '+tracks[i].end+'s.');
    }
  }
  await frame.waitForFunction(()=>{const a=window.__analysers[0],f=new Float32Array(a.frequencyBinCount);a.getFloatFrequencyData(f);return f.some(v=>v>-70);});
  // A failed request must not leave queueing stuck, and cancelled play promises are expected.
  await page.route('**/*01_-_Waste_of_Time*',r=>r.abort());
  await page.keyboard.down('Space');await page.waitForTimeout(150);await page.keyboard.up('Space');
  await frame.waitForFunction(()=>document.querySelector('.track-number').textContent==='Could not play this track');
  await page.unroute('**/*01_-_Waste_of_Time*');
  await page.keyboard.down('Space');await page.keyboard.up('Space');
  await frame.waitForFunction(()=>{const a=document.querySelector('audio[data-track^="02_"]');return a&&!a.paused&&!a.seeking&&a.currentTime>=9.9;});
  for(let i=0;i<3;i++){await page.keyboard.down('Space');await page.keyboard.up('Space');}
  await frame.waitForFunction(()=>{const a=document.querySelector('audio[data-track^="05_"]');return a&&!a.paused&&!a.seeking&&a.currentTime>=2.8;});
  await page.waitForTimeout(300);
  assert.equal(await frame.locator('audio').count(),1,'Rapid switching releases superseded tracks');
  assert.equal(await frame.locator('.track-aligner').evaluate(el=>getComputedStyle(el).display),'none','Cancelled playback does not show a false error');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);});
  await page.mouse.move(500,250);await page.waitForTimeout(600);
  rect=await page.locator('.cursor').boundingBox();assert.ok(Math.abs(rect.x+rect.width/2-500)<2,'Cursor returns to the main page');
  await page.close();
  const phone=await browser.newPage({...devices['iPhone 13']});
  await phone.route('https://**/*',r=>r.abort());
  await phone.goto(url+'/audioplayer/',{waitUntil:'networkidle'});
  await phone.locator('.mobileButton').waitFor();
  await phone.locator('.mobileButton').dispatchEvent('touchstart');await phone.waitForTimeout(120);await phone.locator('.mobileButton').dispatchEvent('touchend');
  await phone.waitForFunction(()=>{const a=document.querySelector('audio');return a&&!a.paused&&a.currentTime>0.8;});
  await phone.locator('.mobileButton').dispatchEvent('touchstart');await phone.locator('.mobileButton').dispatchEvent('touchcancel');
  await phone.waitForFunction(()=>{const a=document.querySelector('audio[data-track^="02_"]');return a&&!a.paused&&a.currentTime>=9.9;});
  await phone.close();
  console.log('All 9 tracks play; cue loops, real analyser output, iframe cursor entry/exit, and mobile controls passed.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
