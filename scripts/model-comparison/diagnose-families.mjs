import { appendFile } from 'node:fs/promises';
import { lookup } from 'node:dns/promises';
import { nativeRequest, errorCodes } from './native-transport.mjs';

const report = { dns: null, checks: [], ready: false };
try { const records = await lookup('booltoken.com',{all:true}); report.dns={status:'resolved',hasIPv4:records.some(r=>r.family===4),hasIPv6:records.some(r=>r.family===6)}; } catch(error) {report.dns={status:'failed',codes:errorCodes(error)};}
report.checks = await Promise.all([
  ['nativeIPv4Homepage','https://booltoken.com/',4],
  ['nativeIPv6Homepage','https://booltoken.com/',6],
  ['nativeIPv4Metadata','https://booltoken.com/v1/models',4]
].map(async([name,url,family])=>{try { const r=await nativeRequest(url,{method:'GET',family,headersOnly:true,timeoutMs:10000});return {name,httpStatus:r.status,contentType:r.contentType}; }catch(error){return {name,status:'connection_failed',codes:errorCodes(error)};}}));
try { const r=await fetch('https://booltoken.com/',{redirect:'error',signal:AbortSignal.timeout(10000)});report.checks.push({name:'nodeFetchHomepage',httpStatus:r.status});await r.body?.cancel(); } catch(error){report.checks.push({name:'nodeFetchHomepage',status:'connection_failed',codes:errorCodes(error)});}
// 403/redirect/TLS refusal must not enable authentication or paid traffic.
report.ready = report.checks.some(c=>c.name==='nativeIPv4Homepage'&&c.httpStatus===200) && report.checks.some(c=>c.name==='nativeIPv4Metadata'&&[200,401].includes(c.httpStatus));
console.log(JSON.stringify(report));
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,'ready='+report.ready+'\n','utf8');
