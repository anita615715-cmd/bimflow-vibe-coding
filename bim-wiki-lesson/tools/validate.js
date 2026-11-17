// BIM Wiki 第十週作業：來源、Wiki 與簡報的可重跑檢查
// 使用方式：node tools/validate.js [--selftest]
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = p => JSON.parse(fs.readFileSync(path.join(root,p), "utf8"));
const exists = p => fs.existsSync(path.join(root,p));
const manifest = read("data/manifest.json");
const wiki = read("data/wiki.json");
const slides = read("data/slides.json");

function validate(m,w,s) {
  const errs = [];
  const ids = new Set(m.sources.map(x=>x.id));
  const wikiIds = new Set(w.chapters.map(x=>x.id));
  if(m.sources.length < 5) errs.push("必須至少 ingest 五份來源");
  if(ids.size !== m.sources.length) errs.push("來源 ID 重複");
  if(wikiIds.size !== w.chapters.length) errs.push("Wiki 章節 ID 重複");
  for(const source of m.sources) {
    if(typeof source.url !== "string" || !source.url.startsWith("https://")) errs.push("來源 URL 無效："+source.id);
    if(!exists(source.rawPath)) errs.push("缺少原始筆記："+source.rawPath);
  }
  if(!exists("wiki/index.md")) errs.push("缺少 Wiki 索引");
  for(const ch of w.chapters) {
    if(!exists("wiki/"+ch.id+".md")) errs.push("缺少 Wiki 章節："+ch.id);
    if(!Array.isArray(ch.sourceIds) || !ch.sourceIds.length) errs.push("Wiki 沒有引用："+ch.id);
    for(const id of ch.sourceIds || []) if(!ids.has(id)) errs.push("Wiki 引用不存在來源："+id);
  }
  if(!Array.isArray(s.slides) || s.slides.length < 6) errs.push("簡報頁數不足");
  for(const slide of s.slides || []) {
    if(!wikiIds.has(slide.chapter)) errs.push("簡報對應不存在章節："+slide.chapter);
    if(!Array.isArray(slide.sourceIds) || !slide.sourceIds.length) errs.push("投影片沒有引用："+slide.id);
    for(const id of slide.sourceIds || []) if(!ids.has(id)) errs.push("投影片引用不存在來源："+id);
  }
  ["index.html","wiki.html","assets/site.css","assets/slides.js","assets/wiki.js"].forEach(p=>{
    if(!exists(p)) errs.push("網頁必要檔案缺少："+p);
  });
  return errs;
}
const result=validate(manifest,wiki,slides);
console.log("來源筆記：",manifest.sources.length,"章 Wiki：",wiki.chapters.length,"張投影片：",slides.slides.length);
console.log(result.length ? "FAIL\n"+result.join("\n") : "PASS：來源、Wiki、簡報結構與必要檔案檢查通過");
if(process.argv.includes("--selftest")) {
  const a=JSON.parse(JSON.stringify(slides));
  a.slides[0].sourceIds.push("S999");
  const b=JSON.parse(JSON.stringify(slides));
  b.slides[0].chapter="W99";
  const negativeA=validate(manifest,wiki,a);
  const negativeB=validate(manifest,wiki,b);
  if(!negativeA.some(x=>x.includes("S999")) || !negativeB.some(x=>x.includes("W99"))) {
    console.error("FAIL：故障注入測試沒有攔截錯誤");process.exitCode=1;
  } else {
    console.log("PASS：故障注入 S999 與 W99 均被攔截（刻意注入，不是自然錯誤）");
  }
}
if(result.length) process.exitCode=1;
