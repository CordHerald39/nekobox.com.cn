// Inject an existing authorized durable backend. No network, credentials or timer.
// read() -> { version, entries }; compareAndSwap(version, entries) -> boolean.
// The backend must make CAS atomic and durably commit before returning true.
export function persistentAtomicStore(backend,{maximumConflicts=4}={}) {
  if(typeof backend?.read!=='function'||typeof backend?.compareAndSwap!=='function')throw Error('DURABLE_CAS_BACKEND_REQUIRED');
  if(!Number.isInteger(maximumConflicts)||maximumConflicts<1||maximumConflicts>8)throw Error('INVALID_CONFLICT_LIMIT');
  return {async transaction(work){
    for(let attempt=0;attempt<maximumConflicts;attempt++){
      const snapshot=await backend.read();
      if(!snapshot||typeof snapshot.version!=='string'||!snapshot.entries||typeof snapshot.entries!=='object'||Array.isArray(snapshot.entries))throw Error('INVALID_DURABLE_SNAPSHOT');
      const entries=structuredClone(snapshot.entries);
      const result=await work({get:async key=>structuredClone(entries[key]),put:async(key,value)=>{entries[key]=structuredClone(value);}});
      if(await backend.compareAndSwap(snapshot.version,entries)===true)return result;
    }
    throw Error('LEDGER_CONFLICT_LIMIT_REACHED');
  }};
}
