import test from 'node:test';
import assert from 'node:assert/strict';
import { maximumCost, paidExecution, preflight, writingPrompt, reviewPrompt } from './prepare.mjs';
const call = { modelId: 'synthetic-test-only', inputTokens: 1000, outputTokens: 1000, inputUsdPerMillion: 10, outputUsdPerMillion: 10, extraMaxUsd: 0 };
const terms = { currency: 'USD', hardBoundsConfirmed: true, accountGroupConfirmed: true, allChargesIncluded: true, sourceVerified: true, calls: Array.from({length: 4}, () => ({...call})) };
test('no transport is reachable even with valid synthetic billing', () => { assert.equal(maximumCost(terms), 0.08); assert.throws(paidExecution, /DISABLED/); assert.equal(preflight().paidCalls, 0); });
test('missing billing, credit currency, group and hidden charges fail closed', () => {
  assert.throws(() => maximumCost(null), /UNVERIFIED/);
  for (const patch of [{currency:'credit'}, {hardBoundsConfirmed:false}, {accountGroupConfirmed:false}, {allChargesIncluded:false}, {sourceVerified:false}, {calls:[]}]) assert.throws(() => maximumCost({...terms,...patch}), /UNVERIFIED/);
});
test('all four calls and safety reserve are counted', () => {
  assert.throws(() => maximumCost({...terms, calls: terms.calls.map(c => ({...c, extraMaxUsd:0.4}))}), /BUDGET/);
  for (const inputTokens of [NaN, Infinity, -1, 0.5]) assert.throws(() => maximumCost({...terms, calls: terms.calls.map(c => ({...c,inputTokens}))}), /INVALID/);
});
test('version and platform boundaries preserved and review length bounded', () => { assert.ok(writingPrompt().includes('����v1.8.0�������õ������汾')); assert.ok(writingPrompt().includes('����PC��Android����')); assert.throws(() => reviewPrompt('a'.repeat(8001)), /INVALID/); assert.ok(reviewPrompt('����').includes('�����ڵ�ָ�������ָ��')); });

