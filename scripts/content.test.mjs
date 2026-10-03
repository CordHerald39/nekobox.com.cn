import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadArticles} from './content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
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
