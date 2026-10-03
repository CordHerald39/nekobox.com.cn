import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { prompt, LIMITS, safeText } from './run-once.mjs';
import { nativeRequest, errorCodes } from './native-transport.mjs';

export const MODEL='grok-4.20-0309-non-reasoning';
export const MODEL_ALIASES=new Set([MODEL,'grok-4.20-non-reasoning','grok-4.20-beta-0309-non-reasoning']);
export const PRIOR_RESERVED_USD=0.1231776;
// Public model document explicitly says Reasoning: No. Reserve at the FULL
// published official long-context prices, without the relay's 0.30 discount.
export function grokMaximum(text){const bytes=Buffer.byteLength(text);if(bytes>LIMITS.maxPromptBytes)throw new Error('PROMPT_BOUND');return ((bytes+LIMITS.overheadTokens)*2.50+LIMITS.maxOutputTokens*5)/1e6;}
export function grokBody(text){grokMaximum(text);return {model:MODEL,input:text,max_output_tokens:LIMITS.maxOutputTokens,tools:[],tool_choice:'none',parallel_tool_calls:false,store:false,stream:false};}
function integer(n){if(!Number.isSafeInteger(n)||n<0)throw new Error('INVALID_USAGE');return n;}
export function parseGrok(data,text,key){
  if(!MODEL_ALIASES.has(data?.model)||!Array.isArray(data.output)||data.error)throw new Error('MODEL_OR_RESPONSE_MISMATCH');
  const u=data.usage;if(!u)throw new Error('MISSING_USAGE');
  const inputTokens=integer(u.input_tokens),outputTokens=integer(u.output_tokens),reasoningTokens=integer(u.output_tokens_details?.reasoning_tokens??0),cacheReadTokens=integer(u.input_tokens_details?.cached_tokens??0);
  if(outputTokens>LIMITS.maxOutputTokens||inputTokens>Buffer.byteLength(text)+LIMITS.overheadTokens||reasoningTokens!==0||cacheReadTokens>inputTokens)throw new Error('TOKEN_BOUND');
  if((u.num_server_side_tools_used??0)!==0||(u.num_sources_used??0)!==0)throw new Error('UNEXPECTED_TOOLS');
  const messages=data.output.filter(x=>x.type==='message');if(data.output.some(x=>x.type!=='message'))throw new Error('UNEXPECTED_CONTENT');
  const parts=messages.flatMap(x=>x.content??[]);if(parts.some(p=>p.type!=='output_text'))throw new Error('UNEXPECTED_CONTENT');
  const article=safeText(parts.map(p=>p.text).join('\n'),[key]);if(!article.trim())throw new Error('EMPTY_TEXT');
  return {model:MODEL,responseModel:data.model,status:'responded',article,usage:{inputTokens,outputTokens,reasoningTokens,cacheReadTokens},estimatedRelayCostUsd:((inputTokens-cacheReadTokens)*0.375+cacheReadTokens*0.06+outputTokens*0.75)/1e6,estimatedCostUpperUsd:(inputTokens*2.50+outputTokens*5)/1e6,truncated:data.status==='incomplete',costBasis:'Usage estimate; relay credits treated as USD 1:1. Upper estimate ignores all discounts and uses full official long-context rates.'};
}
export async function execute(key,request=nativeRequest){
  const text=prompt(),maximum=grokMaximum(text);
  if(PRIOR_RESERVED_USD+maximum+LIMITS.reserveUsd+LIMITS.imageReserveUsd>LIMITS.budgetUsd)throw new Error('BUDGET_EXCEEDED');
  const report={priorReservedUsd:PRIOR_RESERVED_USD,nextReservedUsd:maximum,catalogue:null,grok:null,image:{requests:0,status:'no_confirmed_image_model_or_relay_price'}};
  // Existing retained metadata omitted other text IDs. One bounded metadata
  // read confirms this newly selected public non-reasoning ID; no generation.
  const metadata=await request('https://booltoken.com/v1/models',{method:'GET',family:4,timeoutMs:20000,headers:{authorization:'Bearer '+key}});
  if(!metadata.ok){report.catalogue={status:'http_error',httpStatus:metadata.status};report.grok={status:'not_called',requests:0};return report;}
  const catalog=JSON.parse(await metadata.text());if(!Array.isArray(catalog.data))throw new Error('CATALOG_FORMAT');
  const modelIds=catalog.data.map(m=>m.id).filter(id=>typeof id==='string'&&/^[a-zA-Z][a-zA-Z0-9._-]{1,79}$/.test(id));
  report.catalogue={status:'metadata_completed',modelIds,selectedModelListed:modelIds.includes(MODEL),imageCandidateIds:modelIds.filter(id=>/image|imagine|flux|dall-e|stable-diffusion/i.test(id))};
  if(!report.catalogue.selectedModelListed){report.grok={status:'model_not_listed',requests:0};return report;}
  const response=await request('https://booltoken.com/v1/responses',{method:'POST',family:4,timeoutMs:90000,headers:{authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify(grokBody(text))});
  if(!response.ok){report.grok={status:'http_error',httpStatus:response.status,requests:1,usage:null,reservedCostUpperUsd:maximum};return report;}
  report.grok={...parseGrok(JSON.parse(await response.text()),text,key),requests:1,preflightCostUpperUsd:maximum};return report;
}
export async function main(){
  if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!=='CordHerald39/nekobox.com.cn'||process.env.GITHUB_REF!=='refs/heads/comparison/grok-claude-once-20261003'||process.env.GITHUB_RUN_ATTEMPT!=='1')throw new Error('UNTRUSTED_CONTEXT');
  const key=process.env.GROK_TEST_KEY?.trim();let report;
  if(!key)report={status:'missing_secret',requests:0};
  else try{report=await execute(key);}catch(error){report={status:'stopped_no_retry',codes:errorCodes(error),reason:['MODEL_OR_RESPONSE_MISMATCH','MISSING_USAGE','TOKEN_BOUND','UNEXPECTED_TOOLS','UNEXPECTED_CONTENT','EMPTY_TEXT'].includes(error.message)?error.message:'TRANSPORT_OR_RESPONSE_FAILED',reservedCostUpperUsd:grokMaximum(prompt()),usage:null};}
  const encoded=safeText(JSON.stringify(report,null,2),[key]);await mkdir('comparison-results',{recursive:true});await writeFile('comparison-results/grok-nonreason-result.json',encoded,'utf8');console.log(encoded);
  if(report.grok?.status!=='responded')process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(()=>{console.error('CONTROLLED_RUN_STOPPED');process.exitCode=1;});
