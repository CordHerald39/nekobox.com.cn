import https from 'node:https';

export const allowedCodes = new Set(['ENOTFOUND','EAI_AGAIN','ECONNREFUSED','ECONNRESET','ETIMEDOUT','ENETUNREACH','EHOSTUNREACH','UND_ERR_CONNECT_TIMEOUT','CERT_HAS_EXPIRED','UNABLE_TO_VERIFY_LEAF_SIGNATURE','DEPTH_ZERO_SELF_SIGNED_CERT','ERR_TLS_CERT_ALTNAME_INVALID']);
export function errorCodes(error) { return [...new Set([error?.code,error?.cause?.code,...(error?.cause?.errors??[]).map(e=>e.code)].filter(c=>allowedCodes.has(c)))]; }
export function nativeRequest(url, options = {}) {
  const target = new URL(url), method = options.method ?? 'GET';
  if (target.origin !== 'https://booltoken.com' || !['/','/v1/models','/v1/messages'].includes(target.pathname) || target.search || target.username || target.password || !['GET','POST'].includes(method) || (method === 'POST' && target.pathname !== '/v1/messages')) throw new Error('DISALLOWED_TARGET');
  const family = options.family ?? 4;
  if (![4,6].includes(family)) throw new Error('DISALLOWED_FAMILY');
  // Per-request address-family selection only; default certificate validation
  // stays enabled. No system DNS, network, proxy, or TLS configuration changes.
  return new Promise((resolve,reject)=> {
    let completed = false;
    const timer = setTimeout(()=> { const error = new Error('REQUEST_TIMEOUT'); error.code='ETIMEDOUT'; request.destroy(error); },options.timeoutMs??90000);
    const request = https.request(target,{method,family,headers:options.headers??{},signal:options.signal},response=> {
      const status = response.statusCode;
      if (options.headersOnly) { clearTimeout(timer); completed=true; resolve({status,contentType:typeof response.headers['content-type']==='string'?response.headers['content-type'].split(';')[0]:null}); response.destroy(); return; }
      let bytes=0; const chunks=[];
      response.on('data',chunk=>{bytes+=chunk.length;if(bytes>100000){response.destroy(new Error('RESPONSE_TOO_LARGE'));return;}chunks.push(chunk);});
      response.on('error',error=>{clearTimeout(timer);if(!completed){completed=true;reject(error);}});
      response.on('end',()=>{clearTimeout(timer);if(!completed){completed=true;const body=Buffer.concat(chunks).toString('utf8');resolve({ok:status>=200&&status<300,status,text:async()=>body});}});
    });
    request.on('error',error=>{clearTimeout(timer);if(!completed){completed=true;reject(error);}});
    if(options.body)request.write(options.body);
    request.end();
  });
}
