import {createHash} from 'node:crypto';
import {beijingDay} from './grok-daily-budget-gate.mjs';
import {reserveReconciled} from './append-only-budget.mjs';
export const RESERVE_USD=25,MAX_DAILY_CALLS=4,MAX_BATCH_CALLS=2;
export const REQUEST_PATH='scripts/model-comparison/daily-request.json';
export function prepareDailyRequest(previous,{operationId,kind,publicInput,now=new Date()}) {
  if(previous?.version===2)return reserveReconciled(previous,{operationId,kind,publicInput,now});
  if(!/^[a-f0-9]{32}$/.test(operationId)||!['long','web'].includes(kind))throw Error('INVALID_PUBLIC_REQUEST');
  const day=beijingDay(now);
  if(previous?.version!==1||!Array.isArray(previous?.days))throw Error('INVALID_LEDGER');
  const days=structuredClone(previous.days),entry=days.find(x=>x.day===day)??{day,slots:0,operations:[]};
  if(days.some(x=>x.operations?.includes(operationId)))throw Error('DUPLICATE_OPERATION');
  if(!days.some(x=>x.day===day))days.push(entry);
  const calls=kind==='long'?2:1;
  if(!Number.isInteger(entry.slots)||entry.slots<0||entry.slots+calls>MAX_DAILY_CALLS)throw Error('GLOBAL_DAILY_BUDGET_EXCEEDED');
  entry.slots+=calls;entry.operations.push(operationId);
  if(publicInput!==undefined&&(typeof publicInput?.topic!=='string'||!Array.isArray(publicInput.evidence)||Buffer.byteLength(JSON.stringify(publicInput))>12000))throw Error('INVALID_PUBLIC_INPUT');
  return {version:1,days,request:{operationId,kind,day,reservedCalls:calls,...(publicInput===undefined?{}:{publicInput})}};
}
export function operationId(unifiedRunId,siteKey){return createHash('sha256').update(String(unifiedRunId)+'\0'+String(siteKey)).digest('hex').slice(0,32);}
// Backend uses the existing connected GitHub app: read ref+file, create blob/tree/commit,
// then update_ref(force:false) whose parent is the read SHA. Never rebase a failed CAS
// without re-reading and re-reserving. No API key enters this controller.
export async function submitDailyRequest(backend,args){
  if(!backend?.read||!backend?.commitIfHead)throw Error('GITHUB_CAS_BACKEND_REQUIRED');
  const snapshot=await backend.read();
  const next=prepareDailyRequest(snapshot.ledger,args);
  const committed=await backend.commitIfHead(snapshot.sha,REQUEST_PATH,JSON.stringify(next,null,2)+'\n');
  if(committed!==true)throw Error('CAS_CONFLICT_NO_REQUEST_SUBMITTED');
  return {operationId:next.request.operationId,day:next.request.day,reservedUsd:next.request.reservedCalls*RESERVE_USD};
}
export function validateRunnerLedger(ledger,{day,operationId:expected}){
  const req=ledger?.request,entry=ledger?.days?.find(x=>x.day===day);
  if(ledger?.version!==1||!req||req.day!==day||req.operationId!==expected||!entry?.operations?.includes(expected)||!Number.isInteger(entry.slots)||entry.slots>MAX_DAILY_CALLS||entry.slots<req.reservedCalls||req.reservedCalls!==(req.kind==='long'?2:1)||!['long','web'].includes(req.kind))throw Error('UNRESERVED_OR_STALE_REQUEST');
  return req;
}
