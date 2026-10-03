import test from 'node:test';
import assert from 'node:assert/strict';
import { nativeRequest, errorCodes } from './native-transport.mjs';
test('redirected hosts, duplicate prefix, auth in URL and unrelated operations rejected',()=>{for(const url of ['https://example.com/v1/messages','https://booltoken.com/v1/v1/messages','https://user:pass@booltoken.com/v1/messages','http://booltoken.com/v1/messages','https://booltoken.com/v1/messages?key=private'])assert.throws(()=>nativeRequest(url),/DISALLOWED/);assert.throws(()=>nativeRequest('https://booltoken.com/v1/models',{method:'POST'}),/DISALLOWED/);});
test('safe diagnostic codes exclude addresses and error text',()=>{const r=errorCodes({message:'private',address:'1.2.3.4',cause:{code:'UND_ERR_CONNECT_TIMEOUT',errors:[{code:'ENETUNREACH',address:'private'}]}});assert.deepEqual(r,['UND_ERR_CONNECT_TIMEOUT','ENETUNREACH']);assert.deepEqual(errorCodes({code:'PRIVATE_ACCOUNT_DATA'}),[]);});
