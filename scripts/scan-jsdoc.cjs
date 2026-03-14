const fs=require('fs');
const paths=[
'./src/markdown.js','./src/ui.js','./src/hookManager.js','./src/version.js','./src/seoManager.js','./src/htmlBuilder.js','./src/gen-dts-sample.js','./src/lib/index.js','./src/nimbi-cms.js','./src/router.js','./src/worker-manager.js','./src/l10nManager.js','./src/init.js','./src/imagePreview.js','./src/nav.js','./src/codeblocksManager.js','./src/indexManager.js','./src/worker/slugWorker.js','./src/worker/renderer.js','./src/worker/anchorWorker.js','./src/utils/frontmatter.js','./src/utils/helpers.js','./src/utils/l10n-defaults.js','./src/slugManager.js','./src/bulmaManager.js'
];
let report=[];

function hasJSDocAbove(lines, idx){
  const maxLook = 40; // how many lines to scan upward
  let inspected = 0;
  let j = idx - 1;
  while(j >= 0 && inspected < maxLook){
    const l = lines[j];
    if(l.trim() === ''){ j--; inspected++; continue; }
    if(/\/\*\*/.test(l)) return true; // found start of JSDoc
    if(/\*\/\s*$/.test(l)){
      // found end of comment immediately above; scan upward to find '/**'
      let k = j - 1;
      while(k >= 0 && inspected < maxLook){
        const ll = lines[k];
        if(/\/\*\*/.test(ll)) return true;
        if(ll.trim() === ''){ k--; inspected++; continue; }
        k--; inspected++;
      }
      return false;
    }
    // previous non-empty line isn't a comment
    return false;
  }
  return false;

}

for(const p of paths){
  if(!fs.existsSync(p)) continue;
  const s=fs.readFileSync(p,'utf8').split('\n');
  for(let i=0;i<s.length;i++){
    const line=s[i];
    const m=line.match(/^\s*export function\s+([a-zA-Z0-9_]+)/);
    if(m){
      if(!hasJSDocAbove(s,i)){
        let j=i-1; while(j>=0 && s[j].trim()==='') j--;
        const prev=s[j]||'';
        report.push({file:p,fn:m[1],line:i+1,prev:prev.trim()});
      }
    }
  }
}
if(report.length===0) console.log('No detached JSDoc found'); else console.log(JSON.stringify(report,null,2));
