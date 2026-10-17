const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({viewport:{width:2000,height:1600}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.argv[2]+'/render3d.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.fonts.check('30px "Bodoni Moda"')));
for (const id of ['s1','s2','s3']) await p.locator('#'+id).screenshot({path:`${process.argv[2]}/${id}.png`});
await b.close(); })();
