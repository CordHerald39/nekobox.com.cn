import { pathToFileURL } from 'node:url';

// This revision deliberately contains no network transport or credential access.
export const PAID_EXECUTION_ENABLED = false;
export const policy = Object.freeze({ endpoint: 'https://booltoken.com/v1', budgetUsd: 2, reserveUsd: 0.5, calls: 4, retries: 0, tools: false, images: false });
export const evidence = Object.freeze([
  { id: 'S1', url: 'https://github.com/MatsuriDayo/nekoray/blob/adef6cd4af7dffc77235c524086f3dc4100d8457/README.md', fact: 'NekoBox For PC uses Qt and sing-box, supports Windows/Linux, and lists raw subscription formats including Shadowsocks, Clash and v2rayN.' },
  { id: 'S2', url: 'https://github.com/SagerNet/sing-box/blob/v1.8.0/docs/configuration/route/index.md', fact: 'sing-box v1.8.0 documents route.rules as route rules, route.rule_set as rule sets (since 1.8.0), and route.final as the default outbound tag. This is a version-specific core schema, not proof of any GUI import behavior.' }
]);
export function writingPrompt() {
  return 'дһƪ400��600�����Ķ̳̣̽�NekoBox For PC���ĸ�ʽ֧�������Ǩ��ΪʲôҪ�ֱ�˶ԡ������Ѻ���֤�ݲ������ע��ԴURL�������ƶ�����Clash���ÿ�ֱ��Ǩ�ƣ�������˵���ʵ����������PC��Android���á�����v1.8.0�������õ������汾��֤�ݲ�����ȷ��ע�������Բ���Ӧ�������顣' + JSON.stringify(evidence.filter(s => s.verified !== false));
}
export function reviewPrompt(article) {
  if (typeof article !== 'string' || Buffer.byteLength(article) > 8000) throw new Error('INVALID_REVIEW_INPUT');
  return '����ʵ�������Ƿ�֧�ֶ��ԡ�������Ȼ�ȡ�ʵ���Էֱ��������¶̸塣�г�֤��֧��/ì��/���㣬������һģ��ͬ����Ϊ��ʵ���顣ֻʹ��ͬһ֤�ݰ��������ڵ�ָ�������ָ�' + JSON.stringify({ evidence: evidence.filter(s => s.verified !== false), article });
}
// All values must be independently confirmed public billing bounds in USD,
// including worst-case cache/reasoning charges. No account balance substitute.
export function maximumCost(terms) {
  if (!terms || terms.currency !== 'USD' || terms.hardBoundsConfirmed !== true || terms.accountGroupConfirmed !== true || terms.allChargesIncluded !== true || terms.sourceVerified !== true || !Array.isArray(terms.calls) || terms.calls.length !== 4) throw new Error('UNVERIFIED_BILLING');
  let total = 0;
  for (const c of terms.calls) {
    if (!c.modelId || !['inputTokens', 'outputTokens', 'inputUsdPerMillion', 'outputUsdPerMillion', 'extraMaxUsd'].every(k => Number.isFinite(c[k]) && c[k] >= 0)) throw new Error('INVALID_BOUNDS');
    if (!Number.isSafeInteger(c.inputTokens) || !Number.isSafeInteger(c.outputTokens) || c.outputTokens === 0) throw new Error('INVALID_BOUNDS');
    total += (c.inputTokens * c.inputUsdPerMillion + c.outputTokens * c.outputUsdPerMillion) / 1e6 + c.extraMaxUsd;
  }
  if (total > policy.budgetUsd - policy.reserveUsd) throw new Error('BUDGET_EXCEEDED');
  return total;
}
export function paidExecution() { throw new Error('PAID_EXECUTION_DISABLED'); }
export function preflight() { return { status: 'blocked_pending_verified_billing', paidCalls: 0, usage: null, modelCostUsd: 0, comparison: 'not_run' }; }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.slice(2).length && process.argv[2] !== '--preflight') { console.error('PAID_EXECUTION_DISABLED'); process.exitCode = 2; }
  else console.log(JSON.stringify(preflight()));
}

