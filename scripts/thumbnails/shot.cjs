const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:+process.argv[2]||1});
await p.goto('file://'+__dirname+'/alis.html');await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
await p.screenshot({path:__dirname+'/'+(process.argv[3]||'preview.png')});await b.close();})();
