import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { evidence } from './prepare.mjs';

export const LIMITS = Object.freeze({ budgetUsd: 2, reserveUsd: 0.5, imageReserveUsd: 0.5, maxOutputTokens: 1200, maxPromptBytes: 6000, overheadTokens: 8192, attempts: 1 });
export const CLAUDE_RATES = Object.freeze({ input: 4.20, output: 21, cacheWrite: 8.40 });
export function prompt() {
  return 'Write a 400-600 Chinese-character tutorial in natural simplified Chinese on NekoBox For PC: subscription node import versus routing-rule migration. Use ONLY the verified public evidence below and cite its full URLs beside supported claims. Do not invent menu labels, test results, Android behavior, automatic full-Clash-config import, or compatibility with other core versions. Clearly distinguish documented facts from practical recommendations. Give a short usable checklist: identify format and client/core version, import nodes, separately check routing rules and final outbound, test before replacement. Mark unknown GUI behavior as unverified. No tool calls or external browsing.\nPUBLIC_EVIDENCE=' + JSON.stringify(evidence);
}
export function worstCost(text, maxTokens = LIMITS.maxOutputTokens) {
  const bytes = Buffer.byteLength(text, 'utf8');
  if (bytes > LIMITS.maxPromptBytes || !Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > LIMITS.maxOutputTokens) throw new Error('INPUT_OR_OUTPUT_BOUND');
  // UTF-8 byte count exceeds text token count. Include large protocol overhead;
  // charge ALL input at the highest published (1h cache-write) input rate.
  return ((bytes + LIMITS.overheadTokens) * CLAUDE_RATES.cacheWrite + maxTokens * CLAUDE_RATES.output) / 1e6;
}
export function requestBody(text) { worstCost(text); return { model: 'claude-sonnet-5', max_tokens: LIMITS.maxOutputTokens, messages: [{ role: 'user', content: text }], stream: false, thinking: { type: 'disabled' }, tools: [] }; }
export function safeText(text, credentials = []) {
  if (typeof text !== 'string' || Buffer.byteLength(text) > 20000 || credentials.some(k => k && text.includes(k)) || /sk-[a-zA-Z0-9_-]{12,}|authorization\s*:|x-api-key\s*:|\b(?:\d{1,3}\.){3}\d{1,3}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) throw new Error('UNSAFE_OUTPUT');
  return text;
}
function count(value) { if (!Number.isSafeInteger(value) || value < 0) throw new Error('INVALID_USAGE'); return value; }
export function parseClaude(data, text, credentials = []) {
  if (data?.type !== 'message' || data.model !== 'claude-sonnet-5' || !Array.isArray(data.content)) throw new Error('MODEL_OR_RESPONSE_MISMATCH');
  if (data.content.some(c => c.type !== 'text')) throw new Error('UNEXPECTED_CONTENT_TYPE');
  const u = data.usage;
  if (!u || count(u.output_tokens) > LIMITS.maxOutputTokens) throw new Error('OUTPUT_LIMIT_OR_USAGE');
  const inputTokens = count(u.input_tokens), cacheRead = count(u.cache_read_input_tokens ?? 0), cacheWrite = count(u.cache_creation_input_tokens ?? 0);
  if (inputTokens + cacheRead + cacheWrite > Buffer.byteLength(text) + LIMITS.overheadTokens) throw new Error('INPUT_LIMIT');
  if (u.server_tool_use && Object.values(u.server_tool_use).some(v => v !== 0)) throw new Error('UNEXPECTED_SERVER_TOOL');
  const output = safeText(data.content.map(c => c.text).join('\n'), credentials);
  if (!output.trim()) throw new Error('EMPTY_TEXT');
  const estimatedCostUpperUsd = ((inputTokens + cacheRead + cacheWrite) * CLAUDE_RATES.cacheWrite + u.output_tokens * CLAUDE_RATES.output) / 1e6;
  const estimatedCostAtMaxGroupUsd = (inputTokens * CLAUDE_RATES.input + cacheRead * 0.42 + cacheWrite * CLAUDE_RATES.cacheWrite + u.output_tokens * CLAUDE_RATES.output) / 1e6;
  return { model: 'claude-sonnet-5', status: 'responded', article: output, usage: { inputTokens, outputTokens: u.output_tokens, cacheReadTokens: cacheRead, cacheWriteTokens: cacheWrite }, estimatedCostAtMaxGroupUsd, estimatedCostUpperUsd, costBasis: 'usage-derived estimate in account credits, conservatively treated as USD 1:1; no private billing queried', truncated: data.stop_reason === 'max_tokens' };
}
export async function claudeOnce(key, fetcher = fetch, allCredentials = []) {
  const text = prompt(), maximum = worstCost(text);
  if (maximum + LIMITS.reserveUsd + LIMITS.imageReserveUsd > LIMITS.budgetUsd) throw new Error('BUDGET_EXCEEDED');
  const response = await fetcher('https://booltoken.com/v1/messages', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(90000), headers: { 'content-type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': key }, body: JSON.stringify(requestBody(text)) });
  if (!response.ok) return { model: 'claude-sonnet-5', status: 'http_error', httpStatus: response.status, requests: 1, usage: null, reservedCostUpperUsd: maximum, cost: 'unknown; no retry' };
  const raw = await response.text();
  if (Buffer.byteLength(raw) > 100000) throw new Error('RESPONSE_TOO_LARGE');
  return { ...parseClaude(JSON.parse(raw), text, [key, ...allCredentials]), requests: 1, preflightCostUpperUsd: maximum };
}
export async function catalogueOnce(key, fetcher = fetch) {
  // GET /models is a metadata-only standard compatible operation, not inference.
  const response = await fetcher('https://booltoken.com/v1/models', { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(20000), headers: { authorization: 'Bearer ' + key } });
  if (!response.ok) return { status: 'http_error', httpStatus: response.status };
  const raw = await response.text(); if (Buffer.byteLength(raw) > 1000000) throw new Error('CATALOG_TOO_LARGE');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.data)) throw new Error('CATALOG_FORMAT');
  const ids = data.data.map(m => m.id).filter(id => typeof id === 'string' && /^(?:grok|claude|gpt)[a-zA-Z0-9._-]{1,70}$/.test(id));
  // No user/account fields, ownership, headers, or full response retained.
  return { status: 'read_only_completed', grok46Listed: ids.includes('grok-4.6'), claudeSonnet5Listed: ids.includes('claude-sonnet-5'), imageModelIds: ids.filter(id => /image|imagine/i.test(id)), availableTextModelIds: ids.filter(id => /^(grok-4\.6|claude-sonnet-[45])/.test(id)) };
}
export async function main() {
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== 'CordHerald39/nekobox.com.cn' || process.env.GITHUB_REF !== 'refs/heads/comparison/grok-claude-once-20261003' || process.env.GITHUB_RUN_ATTEMPT !== '1') throw new Error('UNTRUSTED_EXECUTION_CONTEXT');
  const claudeKey = process.env.CLAUDE_TEST_KEY, grokKey = process.env.GROK_TEST_KEY;
  const report = { budgetUsd: 2, sources: evidence.map(s => s.url), grok: { status: 'blocked_reasoning_bound', reason: 'xAI max_output_tokens and max_completion_tokens exclude reasoning, and grok-4.6 reasoning cannot be disabled. Context-window size is not treated as a proven generation/billing limit.', source: 'https://docs.x.ai/developers/rest-api-reference/inference/responses.md' }, image: { status: 'blocked_pending_relay_model_and_price', requests: 0 }, catalogue: null, claude: null };
  if (grokKey) { try { report.catalogue = await catalogueOnce(grokKey); } catch { report.catalogue = { status: 'metadata_read_failed_no_retry' }; } }
  if (!claudeKey) report.claude = { status: 'missing_secret', requests: 0 };
  else { try { report.claude = await claudeOnce(claudeKey, fetch, [grokKey]); } catch (error) { report.claude = { status: 'stopped_no_retry', requests: 1, reason: ['MODEL_OR_RESPONSE_MISMATCH','UNEXPECTED_CONTENT_TYPE','OUTPUT_LIMIT_OR_USAGE','INPUT_LIMIT','UNEXPECTED_SERVER_TOOL','UNSAFE_OUTPUT','EMPTY_TEXT'].includes(error.message) ? error.message : 'TRANSPORT_OR_RESPONSE_FAILED', reservedCostUpperUsd: worstCost(prompt()), usage: null }; } }
  const encoded = safeText(JSON.stringify(report, null, 2), [claudeKey, grokKey]);
  await mkdir('comparison-results', { recursive: true });
  await writeFile('comparison-results/results.json', encoded, 'utf8');
  console.log(encoded);
  if (report.claude.status !== 'responded') process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(() => { console.error('CONTROLLED_RUN_STOPPED'); process.exitCode = 1; });
