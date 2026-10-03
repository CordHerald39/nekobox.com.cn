import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadArticles} from './content.mjs';
import {selectRelatedArticles,relatedArticleSlugs} from './article-related.mjs';
import {createTemplates} from './site-template.mjs';
import {enhancePage} from './enrichment.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('相关文章按具体主题选择，排除自身与已删除页面',async()=>{
 const config=JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));
 const articles=await loadArticles(path.join(root,'content/articles'),config.categories.map(c=>c[0]));
 const curated=articles.filter(a=>relatedArticleSlugs[a.slug]);
 for(const current of curated){
  const related=selectRelatedArticles(current,articles);
  assert.equal(related.length,3,current.slug);
  assert.deepEqual(related.map(a=>a.slug),relatedArticleSlugs[current.slug]);
  assert.ok(related.every(a=>a.slug!==current.slug));
 }
 const current=articles.find(a=>a.slug==='import-subscription');
 assert.equal(selectRelatedArticles(current,articles.filter(a=>a.slug!=='nekobox-formats')).length,2);
 assert.deepEqual(selectRelatedArticles(current,[current]),[]);
 assert.deepEqual(selectRelatedArticles({slug:'new-unrelated-guide'},articles),[]);
 assert.equal(new Set(curated.map(a=>selectRelatedArticles(a,articles).map(r=>r.slug).join(','))).size,curated.length);
});

test('文章仅有一条面包屑且结构化数据与实际路径一致',async()=>{
 const config=JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));
 const articles=await loadArticles(path.join(root,'content/articles'),config.categories.map(c=>c[0]));
 const templates=createTemplates(config,articles,[],{});
 for(const current of articles){
  const route='/articles/'+current.slug+'/';
  const html=enhancePage(templates.shell(current.title,current.description,route,templates.article(current)),{route,config,articles,faq:[]});
  assert.equal((html.match(/aria-label="文章路径"/g)||[]).length,1);
  assert.doesNotMatch(html,/class="breadcrumb"/);
  assert.match(html,/aria-current="page"/);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const crumbs=schemas.filter(s=>s['@type']==='BreadcrumbList');
  assert.equal(crumbs.length,1);
  assert.deepEqual(crumbs[0].itemListElement.map(x=>[x.position,x.name,x.item]),[
   [1,'首页','https://'+config.domain+'/'],
   [2,config.categories.find(c=>c[0]===current.category)[1],'https://'+config.domain+'/'+current.category+'/'],
   [3,current.title,'https://'+config.domain+route]
  ]);
 }
});

test('没有相关内容时省略继续阅读模块，保留返回分类入口',()=>{
 const current={slug:'new-unrelated-guide',category:'tutorials',title:'独立主题 & 标题',description:'说明',author:'编辑',date:'2026-10-03',updated:'2026-10-03',reading:'1 分钟',html:'<p>正文</p>',toc:[]};
 const config={domain:'nekobox.com.cn',name:'NekoBox',categories:[['tutorials','NekoBox 教程']]};
 const templates=createTemplates(config,[current],[],{});
 const route='/articles/'+current.slug+'/';
 const html=enhancePage(templates.shell(current.title,current.description,route,templates.article(current)),{route,config,articles:[current],faq:[]});
 assert.doesNotMatch(html,/继续阅读|related-section|knowledge-grid/);
 assert.match(html,/href="\/tutorials\/">返回NekoBox 教程/);
 assert.match(html,/<p>正文<\/p>/);
});
const fixture=`---
title: "自动发布验证 & 标题"
category: tutorials
description: "验证新增文章、分类和地图同步。"
date: "2026-09-19"
updated: "2026-09-20"
draft: false
---

## 验证步骤

一篇包含 **重点** 和 [下载入口](/downloads/) 的文章。

- 第一步
- 第二步

<script>alert('test')</script>
`;
test('文章图片仅允许站内图片且过滤事件和危险网址',async()=>{
 const sandbox=await mkdtemp(path.join(root,'.test-'));
 try{
  await writeFile(path.join(sandbox,'image-check.md'),fixture+'\n<figure><img src="/images/example.svg" alt="流程示意图" width="1200" height="630" onerror="alert(1)"><figcaption>说明图</figcaption></figure>\n<img src="https://external.invalid/x.png" alt="外部"><img src="javascript:alert(1)" alt="危险"><img src="/images/../../private.png" alt="越界">');
  const [article]=await loadArticles(sandbox,['tutorials']);
  assert.match(article.html,/<img src="\/images\/example.svg" alt="流程示意图" width="1200" height="630" loading="lazy" decoding="async"/);
  assert.match(article.html,/<figcaption>说明图<\/figcaption>/);
  assert.doesNotMatch(article.html,/onerror|external\.invalid|javascript:|private\.png/);
 }finally{await rm(sandbox,{recursive:true,force:true});}
});
test('新增、修改、删除、草稿、错误保护与站内链接校验',async()=>{
 const sandbox=await mkdtemp(path.join(root,'.test-'));
 try{
  for(const name of ['scripts','src','content','site.config.json'])await cp(path.join(root,name),path.join(sandbox,name),{recursive:true});
  const build=()=>spawnSync(process.execPath,[path.join(sandbox,'scripts/build.mjs')],{cwd:sandbox,encoding:'utf8'});
  const ok=()=>{const result=build();assert.equal(result.status,0,result.stderr);};
  const articleFile=path.join(sandbox,'content/articles/test-publish.md');
  const output=path.join(sandbox,'dist');
  await writeFile(articleFile,fixture);ok();
  assert.match(await readFile(path.join(output,'404.html'),'utf8'),/noindex/);
  assert.doesNotMatch(await readFile(path.join(output,'sitemap.xml'),'utf8'),/404.html/);
  assert.match(await readFile(path.join(output,'index.html'),'utf8'),/<details>/);
  const article=await readFile(path.join(output,'articles/test-publish/index.html'),'utf8');
  assert.match(article,/BreadcrumbList/);
  assert.match(article,/返回/);
  assert.match(article,/<strong>重点<\/strong>/);assert.doesNotMatch(article,/<script>alert/);
  assert.match(article,/自动发布验证 &amp; 标题/);
  assert.match(await readFile(path.join(output,'tutorials/index.html'),'utf8'),/test-publish/);
  assert.match(await readFile(path.join(output,'sitemap.xml'),'utf8'),/articles\/test-publish\/.*?<lastmod>2026-09-20<\/lastmod>/);
  const before=await readFile(path.join(output,'sitemap.xml'),'utf8');
  await writeFile(articleFile,fixture.replace('category: tutorials','category: typo'));assert.notEqual(build().status,0);
  assert.equal(await readFile(path.join(output,'sitemap.xml'),'utf8'),before);
  await writeFile(articleFile,fixture.replace('/downloads/','/missing-link/'));assert.notEqual(build().status,0);
  assert.equal(await readFile(path.join(output,'sitemap.xml'),'utf8'),before);
  await writeFile(articleFile,fixture.replace('draft: false','draft: true'));ok();
  assert.doesNotMatch(await readFile(path.join(output,'sitemap.xml'),'utf8'),/test-publish/);
  await assert.rejects(stat(path.join(output,'articles/test-publish/index.html')));
  await writeFile(articleFile,fixture.replace('category: tutorials','category: reviews').replace('自动发布验证 & 标题','修改后的测评文章'));ok();
  assert.match(await readFile(path.join(output,'reviews/index.html'),'utf8'),/修改后的测评文章/);
  assert.doesNotMatch(await readFile(path.join(output,'tutorials/index.html'),'utf8'),/test-publish/);
  await rm(articleFile);ok();
  assert.doesNotMatch(await readFile(path.join(output,'sitemap.xml'),'utf8'),/test-publish/);
  await assert.rejects(stat(path.join(output,'articles/test-publish/index.html')));
  // Deleting the old featured article must not leave hardcoded links behind.
  await rm(path.join(sandbox,'content/articles/choose-client.md'),{force:true});ok();
  assert.doesNotMatch(await readFile(path.join(output,'index.html'),'utf8'),/href="\/articles\/choose-client\//);
  await assert.rejects(stat(path.join(output,'content')));
 }finally{
  if(!sandbox.startsWith(path.resolve(root)+path.sep+'.test-'))throw Error('Unsafe test cleanup');
  await rm(sandbox,{recursive:true,force:true});
 }
});
