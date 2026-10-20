import { spawn } from 'node:child_process';
import fs from 'node:fs';
const server=spawn(process.execPath,['scripts/start-standalone.mjs'],{env:{...process.env,PORT:'3100'},stdio:['ignore','pipe','pipe']});
let log='';server.stdout.on('data',d=>{log+=d});server.stderr.on('data',d=>{log+=d});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
try {
  let ready=false;
  for(let n=0;n<60;n++){try{const res=await fetch('http://127.0.0.1:3100/');if(res.ok){ready=true;break}}catch{}await delay(500)}
  if(!ready)throw new Error('Server not ready: '+log);
  const routes=['/','/architecture/','/workflows/','/tables/','/tables/dbo.DataDebtor/','/tables/dbo.DataDebtorCard/','/tables/eod.DataEndOfDay/','/modules/','/modules/dbo.SP_ACC_003_eStatementReceipt/','/_pagefind/pagefind.js','/tables/does-not-exist/'];
  const results=[];
  for(const route of routes){const r=await fetch('http://127.0.0.1:3100'+route);const text=await r.text();const expected=route.includes('does-not-exist')?404:200;if(r.status!==expected)throw new Error(`${route}: ${r.status}, expected ${expected}`);if(route==='/tables/dbo.DataDebtor/'&&!text.includes('DebtorId'))throw new Error('Column content missing');if(route==='/modules/dbo.SP_ACC_003_eStatementReceipt/'&&!text.includes('Output_eStatementReceipt'))throw new Error('SQL content missing');results.push({route,status:r.status})}
  fs.writeFileSync('verification.json',JSON.stringify({standalone:results},null,2));console.log(JSON.stringify(results));
}finally{server.kill()}