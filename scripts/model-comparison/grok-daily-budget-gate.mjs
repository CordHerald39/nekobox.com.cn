// Importable gate only. No scheduler, network transport, credentials or publisher.
export const GLOBAL_LEDGER='booltoken-grok-all-sites-v1',DAILY_LIMIT_MICROS=100000000;
export function beijingDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
function micros(usd){if(!Number.isFinite(usd)||usd<0||usd>100)throw Error('INVALID_COST_BOUND');return Math.ceil(usd*1000000);}
function identity(value){if(typeof value!=='string'||!/^[a-zA-Z0-9._:-]{1,120}$/.test(value))throw Error('INVALID_OPERATION_ID');return value;}
export async function reserve(config,{operationId,siteId,hardMaximumUsd,allChargesBounded,now=new Date()}){
  if(config?.ledgerNamespace!==GLOBAL_LEDGER||typeof config?.atomicStore?.transaction!=='function')throw Error('SHARED_ATOMIC_LEDGER_UNCONFIGURED');
  if(allChargesBounded!==true||config.billingBoundsVerified!==true)throw Error('FULL_REQUEST_PRICE_BOUND_UNVERIFIED');
  const amount=micros(hardMaximumUsd);if(amount===0)throw Error('ZERO_RESERVE_REJECTED');identity(operationId);identity(siteId);const day=beijingDay(now),key='day:'+day;
  return config.atomicStore.transaction(async tx=>{const state=await tx.get(key)??{reservedMicros:0,settledMicros:0,operations:{}};if(state.operations[operationId])throw Error('DUPLICATE_OPERATION');if(state.reservedMicros+state.settledMicros+amount>DAILY_LIMIT_MICROS)throw Error('GLOBAL_DAILY_BUDGET_EXCEEDED');state.reservedMicros+=amount;state.operations[operationId]={siteId,reservedMicros:amount,status:'reserved'};await tx.put(key,state);return {key,operationId,reservedMicros:amount,day};});
}
export async function settle(config,reservation,{verifiedTotalUsd,invoiceOrUsagePricingVerified}){
  // Unknown cost, a failed request, or model-authored "cost" never releases reserve.
  if(invoiceOrUsagePricingVerified!==true||!Number.isFinite(verifiedTotalUsd))return {status:'reserve_retained'};
  const amount=micros(verifiedTotalUsd);return config.atomicStore.transaction(async tx=>{const state=await tx.get(reservation.key),op=state?.operations[reservation.operationId];if(!op||op.status!=='reserved')throw Error('INVALID_SETTLEMENT');if(amount>op.reservedMicros)throw Error('PROVIDER_BOUND_VIOLATED');state.reservedMicros-=op.reservedMicros;state.settledMicros+=amount;op.status='settled';op.chargedMicros=amount;await tx.put(reservation.key,state);return {status:'settled',chargedMicros:amount};});
}
export async function guardedCall(config,attempt,call){const reservation=await reserve(config,attempt);try{return {reservation,response:await call()};}catch(error){throw Object.assign(Error('REQUEST_FAILED_RESERVE_RETAINED'),{reservation,cause:error});}}
