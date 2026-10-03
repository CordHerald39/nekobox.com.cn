import { mkdir, writeFile } from 'node:fs/promises';
import { claudeOnce, worstCost, prompt, LIMITS, safeText } from './run-once.mjs';
import { nativeRequest, errorCodes } from './native-transport.mjs';

if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!=='CordHerald39/nekobox.com.cn'||process.env.GITHUB_REF!=='refs/heads/comparison/grok-claude-once-20261003'||process.env.GITHUB_RUN_ATTEMPT!=='1'||process.env.PUBLIC_HTTPS_READY!=='true')throw new Error('CONTEXT_NOT_APPROVED');
const priorReservedUsd=0.1048992, nextReservedUsd=worstCost(prompt());
if(priorReservedUsd+nextReservedUsd+LIMITS.imageReserveUsd+LIMITS.reserveUsd>LIMITS.budgetUsd)throw new Error('BUDGET_EXCEEDED');
const key=process.env.CLAUDE_TEST_KEY?.trim();
const report={priorReservedUsd,nextReservedUsd,automaticRetries:0,claude:null};
if(!key)report.claude={status:'missing_secret',requests:0};
else try {report.claude=await claudeOnce(key,(url,options)=>nativeRequest(url,{...options,family:4,timeoutMs:90000}));}
catch(error){report.claude={status:'stopped_no_retry',requests:1,codes:errorCodes(error),reason:['MODEL_OR_RESPONSE_MISMATCH','UNEXPECTED_CONTENT_TYPE','OUTPUT_LIMIT_OR_USAGE','INPUT_LIMIT','UNEXPECTED_SERVER_TOOL','UNSAFE_OUTPUT','EMPTY_TEXT'].includes(error.message)?error.message:'TRANSPORT_OR_RESPONSE_FAILED',usage:null};}
const encoded=safeText(JSON.stringify(report,null,2),[key]);
await mkdir('comparison-results',{recursive:true});await writeFile('comparison-results/claude-native-result.json',encoded,'utf8');console.log(encoded);
if(report.claude.status!=='responded')process.exitCode=1;
