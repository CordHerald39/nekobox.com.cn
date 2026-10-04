import test from 'node:test';import assert from 'node:assert/strict';
import {evidence,prompt} from './ceping-seo-evidence.mjs';
import {boundedPublicInput} from './daily-runner.mjs';
test('minimal public SEO evidence fits existing input and domain bounds',()=>{const input=boundedPublicInput({topic:'测评机场公开页面 SEO',evidence});assert.equal(input.evidence.length,8);assert.equal(new Set(evidence.map(x=>new URL(x.url).hostname)).size,2);assert.ok(Buffer.byteLength(prompt)<12000);assert.match(prompt,/Never invent traffic/);});
