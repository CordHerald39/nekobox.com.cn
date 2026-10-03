import { lookup } from 'node:dns/promises';

// No credentials, inference requests, response bodies, or resolved IP addresses.
const allowed = new Set(['ENOTFOUND','EAI_AGAIN','ECONNREFUSED','ECONNRESET','ETIMEDOUT','ENETUNREACH','EHOSTUNREACH','UND_ERR_CONNECT_TIMEOUT','UND_ERR_HEADERS_TIMEOUT','CERT_HAS_EXPIRED','UNABLE_TO_VERIFY_LEAF_SIGNATURE','DEPTH_ZERO_SELF_SIGNED_CERT','ERR_TLS_CERT_ALTNAME_INVALID']);
function codes(error) {
  const values = [error?.code, error?.cause?.code, ...(error?.cause?.errors ?? []).map(e => e.code)];
  return [...new Set(values.filter(code => allowed.has(code)))];
}
const report = {};
try { await lookup('booltoken.com'); report.dns = 'resolved'; } catch (error) { report.dns = { status: 'failed', codes: codes(error) }; }
for (const [label,url] of [['publicHomepage','https://booltoken.com/'],['unauthenticatedMetadata','https://booltoken.com/v1/models']]) {
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(15000) });
    report[label] = { httpStatus: response.status, contentType: response.headers.get('content-type')?.split(';')[0] ?? null };
    await response.body?.cancel();
  } catch (error) { report[label] = { status: 'transport_failed', type: ['TypeError','TimeoutError','AbortError'].includes(error.name) ? error.name : 'Error', codes: codes(error) }; }
}
console.log(JSON.stringify(report));
