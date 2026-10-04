import {REQUEST_PATH} from './daily-controller.mjs';
const REPO='CordHerald39/nekobox.com.cn',BRANCH='comparison/grok-claude-once-20261003';
function unwrap(result){if(result?.isError)throw Error('GITHUB_OPERATION_REJECTED');const value=result?.structuredContent;if(typeof value?.content==='string'){try{return JSON.parse(value.content);}catch{}}if(value?.sha)return value;for(const c of result?.content??[])if(c.type==='text'){try{return JSON.parse(c.text);}catch{}}throw Error('UNRECOGNIZED_GITHUB_RESULT');}
// Parent supplies its already-connected GitHub tools; this module handles no token.
export function githubLedgerBackend(api){let commit;
  return {async read(){
    const ref=unwrap(await api.fetch({url:'https://api.github.com/repos/'+REPO+'/git/ref/heads/'+BRANCH}));
    commit=unwrap(await api.fetch({url:'https://api.github.com/repos/'+REPO+'/git/commits/'+ref.object.sha}));
    const file=unwrap(await api.fetch({url:'https://api.github.com/repos/'+REPO+'/contents/'+REQUEST_PATH+'?ref='+ref.object.sha}));
    const ledger=file.version===1&&Array.isArray(file.days)?file:JSON.parse(Buffer.from(file.content.replace(/\s/g,''),'base64').toString('utf8').replace(/^\uFEFF/,''));
    return {sha:ref.object.sha,ledger};
  },async commitIfHead(expected,path,content){
    if(!commit||commit.sha!==expected||path!==REQUEST_PATH)throw Error('INVALID_CAS_BASE');
    const blob=unwrap(await api.createBlob({repository_full_name:REPO,content:Buffer.from(content).toString('base64'),encoding:'base64'}));
    const tree=unwrap(await api.createTree({repository_full_name:REPO,base_tree_sha:commit.tree.sha,tree_elements:[{path,mode:'100644',type:'blob',sha:blob.sha}]}));
    const next=unwrap(await api.createCommit({repository_full_name:REPO,parent_sha:expected,tree_sha:tree.sha,message:'Reserve centrally budgeted public generation'}));
    const result=await api.updateRef({repository_full_name:REPO,branch_name:BRANCH,sha:next.sha,force:false});
    if(result?.isError)return false;
    // Unknown result is never blindly retried: the push might already have run.
    const ref=unwrap(await api.fetch({url:'https://api.github.com/repos/'+REPO+'/git/ref/heads/'+BRANCH}));
    if(ref.object.sha!==next.sha)throw Error('SUBMISSION_STATE_UNKNOWN_DO_NOT_RETRY');
    return true;
  }};
}
