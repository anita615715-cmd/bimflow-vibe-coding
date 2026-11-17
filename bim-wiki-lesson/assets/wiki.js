(() => {
  "use strict";
  const $ = id=>document.getElementById(id);
  const node=(tag,cls,text)=>{
    const x=document.createElement(tag);
    if(cls)x.className=cls;
    if(text!==undefined)x.textContent=String(text);
    return x;
  };
  const isSafeUrl=url=>typeof url==="string"&&url.startsWith("https://");
  let data=null;
  function draw(id) {
    const chapter=data.chapters.find(ch=>ch.id===id)||data.chapters[0];
    if(!chapter)return;
    const target=$("wiki-content");
    target.replaceChildren();
    target.append(node("div","wiki-kicker",chapter.id+" / SOURCE-LINKED WIKI"),node("h1","",chapter.title),node("p","wiki-lead",chapter.lead));
    const h=(txt)=>node("h2","",txt);
    target.append(h("核心整理"));
    const points=node("ol");
    for(const txt of chapter.points) points.append(node("li","",txt));
    target.append(points,h("教學情境"),node("div","wiki-example",chapter.example),h("動手檢查"));
    const checks=node("div","wiki-checklist");
    chapter.check.forEach((txt,i)=>{
      const line=node("label");const input=document.createElement("input");input.type="checkbox";input.setAttribute("aria-label","完成檢核："+txt);
      line.append(input,node("span","",txt));checks.append(line);
    });
    target.append(checks,h("這章參考的來源"));
    const sources=node("div","wiki-source");
    for(const sid of chapter.sourceIds){
      const s=data.sources.find(x=>x.id===sid);
      if(!s||!isSafeUrl(s.url))continue;
      const a=node("a","",sid+"｜"+s.title+"（"+s.version+"）↗");
      a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";sources.append(a);
    }
    target.append(sources);
    const notice=node("p","wiki-lead","內容經教學整理；請核對來源適用版本、實際圖說與專案需求，不可視為核定設備規格。");
    notice.style.fontSize="12px";notice.style.marginTop="30px";target.append(notice);
    const back=node("a","back-deck","觀看 HTML 教學簡報 ↗");back.href="./";target.append(back);
    document.title=chapter.title+"｜BIM 前置檢核 Wiki";
    for(const a of $("chapter-list").querySelectorAll("a")){
      a.classList.toggle("active",a.dataset.chapter===chapter.id);
      if(a.dataset.chapter===chapter.id)a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    }
    if(location.hash!=="#"+chapter.id)history.replaceState(null,"","#"+chapter.id);
  }
  async function boot(){
    try{
      const r=await fetch("./data/wiki.json");
      if(!r.ok)throw new Error("資料未部署");
      data=await r.json();
      if(!Array.isArray(data.chapters)||!Array.isArray(data.sources))throw new Error("資料格式有誤");
      const nav=$("chapter-list");
      data.chapters.forEach(c=>{
        const a=node("a");a.href="#"+c.id;a.dataset.chapter=c.id;
        a.append(node("small","",c.id),node("span","",c.title));
        a.addEventListener("click",e=>{e.preventDefault();draw(c.id);});
        nav.append(a);
      });
      const current=decodeURIComponent(location.hash.replace("#",""));
      draw(current);
      window.addEventListener("hashchange",()=>draw(decodeURIComponent(location.hash.replace("#",""))));
    }catch(e){$("wiki-content").replaceChildren(node("p","loading-card","Wiki 載入失敗："+e.message));}
  }
  boot();
})();
