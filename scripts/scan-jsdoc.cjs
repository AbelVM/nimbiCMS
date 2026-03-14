const fs=require('fs');
const paths=[
'./src/markdown.js','./src/ui.js','./src/hookManager.js','./src/version.js','./src/seoManager.js','./src/htmlBuilder.js','./src/gen-dts-sample.js','./src/lib/index.js','./src/nimbi-cms.js','./src/router.js','./src/worker-manager.js','./src/l10nManager.js','./src/init.js','./src/imagePreview.js','./src/nav.js','./src/codeblocksManager.js','./src/indexManager.js','./src/worker/slugWorker.js','./src/worker/renderer.js','./src/worker/anchorWorker.js','./src/utils/frontmatter.js','./src/utils/helpers.js','./src/utils/l10n-defaults.js','./src/slugManager.js','./src/bulmaManager.js'
];
let report=[];
for(const p of paths){
  if(!fs.existsSync(p)) continue;
  const s=fs.readFileSync(p,'utf8').split('\n');
  for(let i=0;i<s.length;i++){
    const line=s[i];
    const m=line.match(/^\s*export function\s+([a-zA-Z0-9_]+)/);
    if(m){
      let found=false;
      for(let k=1;k<=6;k++){
        const idx=i-k; if(idx<0) break; if(/\/\*\*/.test(s[idx])){ found=true; break }
      }
      if(!found){
        let j=i-1; while(j>=0 && s[j].trim()==='') j--;
        const prev=s[j]||'';
        report.push({file:p,fn:m[1],line:i+1,prev:prev.trim()});
      }
    }
  }
}
if(report.length===0) console.log('No detached JSDoc found'); else console.log(JSON.stringify(report,null,2));
