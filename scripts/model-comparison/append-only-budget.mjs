import {beijingDay} from './grok-daily-budget-gate.mjs';
export const LIMIT_MICROS=100000000,CALL_RESERVE_MICROS=25000000;
export const INITIAL_DAY='2026-10-04';
const knownUsage=[{input:207,output:153,reasoning:142,source:'https://github.com/CordHerald39/nekobox.com.cn/actions/runs/37191342991'},{input:560,output:1653,reasoning:511,source:'https://github.com/CordHerald39/nekobox.com.cn/actions/runs/37192248708'}];
const knownTextReserveMicros=Math.ceil(knownUsage.reduce((sum,u)=>sum+u.input*4.4+(u.output+u.reasoning)*13.2,0));
const baseline={type:'reconcile_initialization',day:INITIAL_DAY,knownTextReserveMicros,unknownReserveMicros:50000000,olderSmallReserveMicros:360298,costBasis:'conservative_public_reference_not_invoice',referenceInputPerMillion:4.4,referenceOutputPerMillion:13.2,reasoningDoubleCounted:true,cacheDiscountApplied:false,knownUsage,sources:['https://booltoken.com/','https://booltoken.com/recharge-info','https://docs.x.ai/developers/pricing']};
export function reconcileLegacy(previous){
  if(previous?.version!==1||previous.request!==null||JSON.stringify(previous.days)!==JSON.stringify([{day:INITIAL_DAY,slots:4,operations:[]}]))throw Error('UNEXPECTED_INITIALIZATION');
  return {version:2,legacy:structuredClone(previous),events:[structuredClone(baseline)],request:null};
}
function validate(ledger){
  if(ledger?.version!==2||!Array.isArray(ledger.events)||JSON.stringify(ledger.events[0])!==JSON.stringify(baseline)||JSON.stringify(reconcileLegacy(ledger.legacy).legacy)!==JSON.stringify(ledger.legacy))throw Error('INVALID_RECONCILED_LEDGER');
  const ids=new Set();for(const e of ledger.events.slice(1)){
    if(e.type!=='reserve'||!/^\d{4}-\d{2}-\d{2}$/.test(e.day)||!/^[a-f0-9]{32}$/.test(e.operationId)||ids.has(e.operationId)||!['seo','long','web'].includes(e.kind)||e.reservedCalls!==(e.kind==='long'?2:1)||e.reservedMicros!==e.reservedCalls*CALL_RESERVE_MICROS)throw Error('INVALID_RESERVATION_EVENT');ids.add(e.operationId);
  }
  for(const day of new Set(ledger.events.map(e=>e.day)))if(occupiedMicrosUnchecked(ledger,day)>LIMIT_MICROS)throw Error('GLOBAL_DAILY_BUDGET_EXCEEDED');
}
function occupiedMicrosUnchecked(ledger,day){return ledger.events.reduce((sum,e)=>sum+(e.day!==day?0:e.type==='reconcile_initialization'?e.knownTextReserveMicros+e.unknownReserveMicros+e.olderSmallReserveMicros:e.reservedMicros),0);}
export function occupiedMicros(ledger,day){validate(ledger);return occupiedMicrosUnchecked(ledger,day);}
export function reserveReconciled(previous,{operationId,kind,publicInput,now=new Date()}){
  validate(previous);if(!/^[a-f0-9]{32}$/.test(operationId)||!['seo','long','web'].includes(kind))throw Error('INVALID_PUBLIC_REQUEST');
  if(kind==='seo'&&publicInput!==undefined)throw Error('SEO_USES_FIXED_PUBLIC_EVIDENCE');
  if(previous.events.some(e=>e.operationId===operationId))throw Error('DUPLICATE_OPERATION');
  const day=beijingDay(now),reservedCalls=kind==='long'?2:1,reservedMicros=reservedCalls*CALL_RESERVE_MICROS;
  if(occupiedMicrosUnchecked(previous,day)+reservedMicros>LIMIT_MICROS)throw Error('GLOBAL_DAILY_BUDGET_EXCEEDED');
  const request={operationId,kind,day,reservedCalls,...(publicInput===undefined?{}:{publicInput})};
  const next={version:2,legacy:structuredClone(previous.legacy),events:[...structuredClone(previous.events),{type:'reserve',operationId,kind,day,reservedCalls,reservedMicros}],request};validate(next);return next;
}
export function verifyReconciledTransition(previous,current,now=new Date()){
  if(current.request===null){const expected=previous.version===1?reconcileLegacy(previous):{...previous,request:null};if(JSON.stringify(current)!==JSON.stringify(expected))throw Error('INVALID_RECONCILIATION_TRANSITION');validate(current);return null;}
  if(previous?.version!==2)throw Error('SEPARATE_ZERO_CALL_RECONCILIATION_REQUIRED');
  const req=current.request;if(req.day!==beijingDay(now))throw Error('STALE_REQUEST');
  const expected=reserveReconciled(previous,{operationId:req.operationId,kind:req.kind,publicInput:req.publicInput,now});
  if(JSON.stringify(current)!==JSON.stringify(expected))throw Error('INVALID_APPEND_ONLY_TRANSITION');return req;
}
