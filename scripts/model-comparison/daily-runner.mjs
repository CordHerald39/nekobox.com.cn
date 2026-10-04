import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {prepareDailyRequest,validateRunnerLedger,REQUEST_PATH} from './daily-controller.mjs';
import {beijingDay} from './grok-daily-budget-gate.mjs';
import {execute as longExecute,PROMPT} from './grok46-long-stream-once.mjs';
import {execute as webExecute} from './grok46-web-once.mjs';
import {nativeRequest} from './native-transport.mjs';
import {evidence} from './prepare.mjs';
import {safeText} from './run-once.mjs';
import {verifyReconciledTransition} from './append-only-budget.mjs';
import {executeSeoNoTools} from './ceping-seo-once.mjs';
export function context(env){if(env.GITHUB_ACTIONS!=='true'||env.GITHUB_REPOSITORY!=='CordHerald39/nekobox.com.cn'||env.GITHUB_REF!=='refs/heads/comparison/grok-claude-once-20261003'||env.GITHUB_RUN_ATTEMPT!=='1')throw Error('UNTRUSTED_CONTEXT');}
export function verifyTransition(previous,current,now=new Date()){
  if(current.version===2)return verifyReconciledTransition(previous,current,now);
  if(previous?.version===2)throw Error('LEGACY_DOWNGRADE_REJECTED');
  if(current.request===null)return null;
  const request=validateRunnerLedger(current,{day:beijingDay(now),operationId:current.request?.operationId});
  const expected=prepareDailyRequest(previous,{operationId:request.operationId,kind:request.kind,publicInput:request.publicInput,now});
  if(JSON.stringify(expected)!==JSON.stringify(current))throw Error('INVALID_RESERVATION_TRANSITION');
  return request;
}
export function boundedPublicInput(input){
  if(input===undefined)return undefined;
  if(typeof input?.topic!=='string'||input.topic.length>200||!Array.isArray(input.evidence)||input.evidence.length<1||input.evidence.length>8)throw Error('INVALID_PUBLIC_EVIDENCE');
  for(const item of input.evidence){const url=new URL(item.url);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!/[a-z]/i.test(url.hostname)||url.hostname==='localhost'||!Array.isArray(item.facts)||item.facts.some(x=>typeof x!=='string'))throw Error('INVALID_PUBLIC_EVIDENCE');}
  if(new Set(input.evidence.map(x=>new URL(x.url).hostname)).size>5)throw Error('TOO_MANY_SOURCE_DOMAINS');
  const encoded=safeText(JSON.stringify(input),[]);if(Buffer.byteLength(encoded)>12000)throw Error('PUBLIC_INPUT_TOO_LARGE');return JSON.parse(encoded);
}
const chinese=text=>(text.match(/[\u3400-\u9fff]/g)??[]).length;
const sound=r=>r?.completionStatus==='completed'&&r.deltaMatchesCompleted===true&&typeof r.text==='string';
export async function runReserved(request,key,{transport=nativeRequest,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
  if(request.kind==='seo'){if(request.reservedCalls!==1)throw Error('INVALID_SEO_RESERVATION');return executeSeoNoTools(key,transport);}
  let used=0;const reports=[];const input=boundedPublicInput(request.publicInput);
  const prompt=input?'Write a complete Chinese tutorial of 1200 to 1600 Chinese characters about '+input.topic+'. Use ONLY this verified public evidence. Cite each source next to supported claims; distinguish suggested checks from documented facts. Do not invent interfaces or browse. EVIDENCE='+JSON.stringify(input.evidence):PROMPT;
  async function call(customPrompt){if(++used>request.reservedCalls)throw Error('RESERVED_CALL_LIMIT');const adapter=(url,options)=>{if(request.kind==='web'&&input){const b=JSON.parse(options.body);b.input='Use web_search to verify the following public topic against ONLY the listed official URLs, give a short Chinese evidence summary with exact source citations. No images or other tools. TOPIC='+input.topic+' SOURCES='+JSON.stringify(input.evidence.map(x=>x.url));b.tools[0].filters.allowed_domains=[...new Set(input.evidence.map(x=>new URL(x.url).hostname))];options={...options,body:JSON.stringify(b)};}if(customPrompt){const b=JSON.parse(options.body);b.input=customPrompt;b.max_output_tokens=4096;options={...options,body:JSON.stringify(b)};}return transport(url,options);};const report=request.kind==='web'?await webExecute(key,adapter,input?.evidence.map(x=>x.url)):await longExecute(key,adapter);reports.push(report.result);return report.result;}
  let result=await call(request.kind==='long'?prompt:null);
  const transient=result.status==='transport_error'||(result.status==='http_error'&&[429,502,503,504].includes(result.httpStatus));
  if(transient&&used<request.reservedCalls){await wait(20000);result=await call(prompt);}
  let text=result.text??'',supplemented=false;
  if(request.kind==='long'&&sound(result)&&chinese(text)<1200&&used<request.reservedCalls){
    const extra=await call('Append 350 to 450 Chinese characters of practical checks and limitations to the following public tutorial, without repeating it. Use only the same evidence. Cite factual claims. Return only the additional paragraphs. Do not use tools. EVIDENCE='+JSON.stringify(input?.evidence??evidence)+'\nPUBLIC_DRAFT='+text);
    if(sound(extra)){text+='\n\n'+extra.text;supplemented=true;}
  }
  const count=chinese(text),urls=(input?.evidence??evidence).map(x=>x.url);
  const success=request.kind==='web'?result.status==='web_search_verified':sound(result)&&count>=1200&&count<=2000&&urls.every(url=>text.includes(url));
  return {status:success?'completed':'needs_review',callsUsed:used,reservedCalls:request.reservedCalls,supplemented,chineseCharacters:count,text,results:reports,costBasis:'conservative_reservation_not_invoice',upstreamIdentityVerified:false};
}
export async function main(){context(process.env);const current=JSON.parse((await readFile(REQUEST_PATH,'utf8')).replace(/^\uFEFF/,''));let previous;
  try{previous=JSON.parse(execFileSync('git',['show','HEAD^:'+REQUEST_PATH],{encoding:'utf8',maxBuffer:100000}).replace(/^\uFEFF/,''));}catch{if(current.request===null){previous={version:1,days:[],request:null};}else throw Error('PREVIOUS_LEDGER_REQUIRED');}
  const request=verifyTransition(previous,current);
  if(process.argv.includes('--preflight')){if(process.env.GITHUB_OUTPUT)await writeFile(process.env.GITHUB_OUTPUT,'ready='+Boolean(request)+'\n',{flag:'a'});console.log(request?'RESERVATION_VALID':'NO_PAID_REQUEST');return;}
  if(!request)throw Error('NO_RESERVED_REQUEST');const key=process.env.GROK_TEST_KEY?.trim();if(!key)throw Error('MISSING_SECRET');
  const report={operationId:request.operationId,...await runReserved(request,key)},encoded=safeText(JSON.stringify(report,null,2),[key]);await mkdir('comparison-results',{recursive:true});await writeFile('comparison-results/daily-public-result.json',encoded);console.log('DAILY_PUBLIC_RESULT='+safeText(JSON.stringify(report),[key]));if(report.status!=='completed')process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(()=>{console.error('CONTROLLED_DAILY_REQUEST_STOPPED');process.exitCode=1;});
