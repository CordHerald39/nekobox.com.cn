import { nativeRequest, errorCodes } from './native-transport.mjs';
import { safeText } from './run-once.mjs';

if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!=='CordHerald39/nekobox.com.cn'||process.env.GITHUB_REF!=='refs/heads/comparison/grok-claude-once-20261003'||process.env.GITHUB_RUN_ATTEMPT!=='1')throw new Error('UNTRUSTED_CONTEXT');
const key=process.env.GROK_TEST_KEY?.trim();
let report;
if(!key)report={status:'missing_secret',inferenceRequests:0};
else try {
  const r=await nativeRequest('https://booltoken.com/v1/models',{method:'GET',family:4,timeoutMs:20000,headers:{authorization:'Bearer '+key}});
  if(!r.ok)report={status:'metadata_http_error',httpStatus:r.status,inferenceRequests:0};
  else {
    const data=JSON.parse(await r.text());
    if(!Array.isArray(data.data))throw new Error('CATALOG_FORMAT');
    const publicModels=data.data.filter(m=>typeof m.id==='string'&&/^(?:grok|claude|gpt)[a-zA-Z0-9._-]{1,70}$/.test(m.id)).map(m=>{
      const safe={id:m.id};
      for(const field of ['image_price','context_length','max_output_tokens','max_completion_tokens','max_reasoning_tokens','max_total_tokens'])if(Number.isFinite(m[field])&&m[field]>=0)safe[field]=m[field];
      if(Array.isArray(m.output_modalities))safe.output_modalities=m.output_modalities.filter(s=>['text','image','audio','video'].includes(s));
      return safe;
    });
    const images=publicModels.filter(m=>/imagine|image/.test(m.id)||m.output_modalities?.includes('image'));
    report={status:'metadata_completed',inferenceRequests:0,grok46:publicModels.find(m=>m.id==='grok-4.6')??null,imageModels:images,imageGeneration:'not_called',billing:'No account or balance endpoint accessed; catalogue price fields require relay-unit confirmation before generation.'};
  }
}catch(error){report={status:'metadata_failed',codes:errorCodes(error),inferenceRequests:0};}
console.log(safeText(JSON.stringify(report),[key]));
