import {execute as streamExecute} from './grok46-long-stream-once.mjs';
import {nativeRequest} from './native-transport.mjs';
import {prompt,focusedEvidence} from './ceping-seo-evidence.mjs';
export const TARGETS=focusedEvidence.slice(0,3).map(e=>e.url);
export function body(){if(Buffer.byteLength(prompt)>10000)throw Error('PUBLIC_PROMPT_TOO_LARGE');return {model:'grok-4.6',input:prompt,reasoning:{effort:'low'},max_output_tokens:3072,tools:[],tool_choice:'none',stream:true,store:false};}
export async function executeSeoNoTools(key,transport=nativeRequest){
  let calls=0;const request=(url,options)=>{if(++calls>1)throw Error('ONE_REQUEST_ONLY');return transport(url,{...options,body:JSON.stringify(body())});};
  const report=await streamExecute(key,request),raw=report.result;
  const result=Object.fromEntries(['httpStatus','status','requestedModel','returnedModel','completionStatus','deltaMatchesCompleted','usage','deltaCount','eventCount','events','diagnostic','codes','text'].filter(k=>raw[k]!==undefined).map(k=>[k,raw[k]]));
  if(result.completionStatus==='completed'&&result.deltaMatchesCompleted===true)result.status='seo_stream_received';
  const text=result.text??'',count=(text.match(/[\u3400-\u9fff]/g)??[]).length;
  const pagesPresent=TARGETS.every(url=>text.includes(url)||text.includes(new URL(url).pathname));
  const completed=result.completionStatus==='completed'&&result.deltaMatchesCompleted===true;
  const success=completed&&pagesPresent&&count>=600&&count<=2200;
  const u=result.usage,reference=u?{publicRelayTokenReferenceUsd:(u.inputTokens*.6+(u.outputTokens+u.reasoningTokens)*1.8)/1e6,conservativeFullHighRegionalReferenceUsd:(u.inputTokens*4.4+(u.outputTokens+u.reasoningTokens)*13.2)/1e6,reasoningDoubleCounted:true,cacheDiscountApplied:false,isInvoice:false}:null;
  return {status:success?'completed':'needs_review',callsUsed:calls,reservedCalls:1,toolsEnabled:false,automaticRetries:0,automaticSupplementation:0,chineseCharacters:count,pagesPresent,text,results:[result],costReference:reference,costBasis:'conservative_reservation_not_invoice',upstreamIdentityVerified:false};
}
