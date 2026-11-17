(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const node = (tag, cls, text) => {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text !== undefined) x.textContent = String(text);
    return x;
  };
  let slides = [], sourceMap = new Map(), active = 0;
  const state = { dialog: null };

  function artFor(slide) {
    const wrapper = node("div", "slide-art");
    const card = node("div", "art-card");
    const top = node("span", "label-over", slide.tag || "BIM / WIKI");
    card.append(top);

    if (slide.style === "case" || slide.style === "quiz") {
      const values = node("div", "case-values");
      const a = node("div"), b = node("div");
      a.append(node("small", "", "CATALOGUE / 型錄"), node("strong", "", "2630 mm"));
      b.append(node("small", "", "LAYOUT / 配置圖"), node("strong", "", "2680 mm"));
      values.append(a, b);
      card.append(values);
      card.append(node("div", "case-delta", "Δ " + "50 mm" + "　｜　尚未核定"));
      if (slide.style === "quiz") {
        const options = node("div", "quiz-options"), feedback = node("div", "quiz-feedback");
        feedback.hidden = true;
        for (const choice of slide.choices || []) {
          const button = node("button", "quiz-choice", choice.label);
          button.type = "button";
          button.addEventListener("click", () => {
            feedback.textContent = (choice.correct ? "✓ " : "✕ ") + choice.feedback;
            feedback.classList.toggle("wrong", !choice.correct);
            feedback.hidden = false;
          });
          options.append(button);
        }
        card.append(options, feedback);
      }
    } else if (slide.style === "workflow") {
      const graph = node("div");
      ["取得 9 篇來源", "建立 raw 筆記", "整理 7 章 Wiki", "核對來源及數據", "產生 HTML 簡報"].forEach((txt, i) => {
        graph.append(node("div", "workflow-node", txt));
        if (i < 4) graph.append(node("div", "workflow-arrow", "↓"));
      });
      graph.append(node("div", "workflow-return", "檢查失敗 ↰ 回到來源 / Wiki 整理階段"));
      card.append(graph);
    } else if (slide.style === "compare") {
      const pair = node("div", "art-pair");
      const a = node("div"), b = node("div");
      a.append(node("span", "", "TYPE PARAMETER"), node("strong", "", "類型參數"), node("small", "", "一個類型共用同一設定"));
      b.append(node("span", "", "INSTANCE PARAMETER"), node("strong", "", "實體參數"), node("small", "", "可依每個放置實例調整"));
      pair.append(a, b);
      card.append(pair, node("p", "", "先決定資料由誰共用、何時要改，再決定參數型態。"));
    } else if (slide.style === "references") {
      const list = node("div", "references-list");
      Array.from(sourceMap.values()).forEach(s => {
        const anchor = node("a");
        anchor.href = s.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.append(node("b", "", s.id), node("span", "", s.title));
        list.append(anchor);
      });
      card.append(list);
    } else {
      const visual = node("div", "mini-diagram");
      visual.setAttribute("aria-hidden", "true");
      const number = node("div", "art-minor");
      number.append(node("span", "", "SOURCE-CHECKED LEARNING"), node("span", "", slide.chapter));
      card.append(visual, number);
      if (slide.style === "cover") {
        card.append(node("strong", "", "MODEL ≠ JUST GEOMETRY"), node("p", "", "SOURCE → CHECK → MODEL"));
      } else {
        card.append(node("strong", "", slide.subtitle), node("p", "", "每個判斷都應能回溯至來源，不能自行補上未經核對的規格。"));
      }
    }
    wrapper.append(card);
    return wrapper;
  }

  function renderSlide() {
    const slide = slides[active];
    const stage = $("slide-stage");
    stage.replaceChildren();

    const sec = node("section", "slide style-" + slide.style);
    sec.id = "lesson-slide";
    sec.setAttribute("aria-label", "第 " + (active+1) + " 張：" + slide.title);

    const grid = node("div", "slide-grid");
    const left = node("div", "slide-copy");
    left.append(
      node("div", "slide-kicker", slide.kicker),
      node("h1", "", slide.title),
      node("div", "slide-subtitle", slide.subtitle),
      node("p", "slide-lead", slide.lead)
    );
    const list = node("ul", "slide-list");
    for (const bullet of slide.bullets || []) list.append(node("li", "", bullet));
    left.append(list, node("div", "slide-note", "BIM LEARNING WIKI · " + slide.tag));
    grid.append(left, artFor(slide));
    sec.append(grid);
    stage.append(sec);

    $("slide-label").textContent = slide.kicker;
    $("counter").textContent = String(active+1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    $("progress-title").textContent = slide.tag;
    $("top-progress").firstElementChild.style.width = ((active+1) / slides.length * 100) + "%";
    $("prev").disabled = active === 0;
    $("next").disabled = active === slides.length-1;
    $("next").querySelector("span").textContent = active === slides.length-1 ? "最後一張" : "下一張";

    const sources = $("source-chips");
    sources.replaceChildren();
    for (const id of slide.sourceIds || []) {
      const data = sourceMap.get(id);
      if (!data) continue;
      const link = node("a", "", id);
      link.href = data.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = data.title;
      sources.append(link);
    }
    $("chapter-link").href = "./wiki.html#" + encodeURIComponent(slide.chapter);
    const dots = $("dots");
    dots.replaceChildren();
    slides.forEach((item, i) => {
      const dot = node("button", "progress-dot" + (active===i ? " active" : ""));
      dot.type = "button";
      dot.title = "第 " + (i+1) + " 張：" + item.title;
      dot.setAttribute("aria-label", dot.title);
      dot.setAttribute("aria-current", active===i ? "true" : "false");
      dot.addEventListener("click", () => goto(i));
      dots.append(dot);
    });
    document.title = slide.title + "｜BIM Wiki 教學簡報";
    const hash = "#" + slide.id;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function goto(index) {
    active = Math.max(0, Math.min(slides.length-1, index));
    renderSlide();
    $("slide-stage").scrollTo({top:0,behavior:"instant"});
  }

  function readHash() {
    const requested = decodeURIComponent(location.hash.replace(/^#/, ""));
    const index = slides.findIndex(s => s.id === requested);
    if (index >= 0 && active !== index) goto(index);
  }

  function buildOverview() {
    const list = $("overview-list");
    list.replaceChildren();
    slides.forEach((slide,i) => {
      const btn = node("button","overview-item");
      btn.type="button";
      btn.append(node("b","",String(i+1).padStart(2,"0")+" / "+slide.tag),node("span","",slide.title));
      btn.addEventListener("click", () => {
        $("overview-dialog").close();
        goto(i);
      });
      list.append(btn);
    });
  }

  async function boot() {
    try {
      const [slidesResponse,wikiResponse] = await Promise.all([fetch("./data/slides.json"),fetch("./data/wiki.json")]);
      if (!slidesResponse.ok || !wikiResponse.ok) throw new Error("無法取得簡報與 Wiki 資料");
      const slidesData = await slidesResponse.json();
      const wikiData = await wikiResponse.json();
      if (!Array.isArray(slidesData.slides) || !Array.isArray(wikiData.sources)) throw new Error("資料格式不正確");
      slides = slidesData.slides;
      sourceMap = new Map(wikiData.sources.map(s => [s.id,s]));
      for (const s of slides) {
        if (!Array.isArray(s.sourceIds) || s.sourceIds.some(id=>!sourceMap.has(id))) {
          throw new Error("投影片引用的來源 ID 無法對應知識庫");
        }
      }
      if (!slides.length) throw new Error("沒有投影片");
      buildOverview();
      const initial = slides.findIndex(s=>s.id===decodeURIComponent(location.hash.replace(/^#/,"")));
      goto(initial >= 0 ? initial : 0);
      $("prev").addEventListener("click",()=>goto(active-1));
      $("next").addEventListener("click",()=>goto(active+1));
      $("overview-open").addEventListener("click",()=> $("overview-dialog").showModal());
      $("overview-close").addEventListener("click",()=> $("overview-dialog").close());
      $("fullscreen").addEventListener("click",async()=>{
        if(document.fullscreenElement) await document.exitFullscreen();
        else if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      });
      window.addEventListener("hashchange",readHash);
      document.addEventListener("keydown",e=>{
        if ($("overview-dialog").open || e.ctrlKey || e.altKey || e.metaKey) return;
        if (["INPUT","TEXTAREA","BUTTON"].includes(document.activeElement?.tagName)) return;
        if(e.key==="ArrowRight" || e.key==="PageDown"){e.preventDefault();goto(active+1);}
        if(e.key==="ArrowLeft" || e.key==="PageUp"){e.preventDefault();goto(active-1);}
        if(e.key==="Home"){e.preventDefault();goto(0);}
        if(e.key==="End"){e.preventDefault();goto(slides.length-1);}
        if(e.key.toLowerCase()==="f"&&e.key.length===1){$("fullscreen").click();}
      });
    } catch(error) {
      $("slide-stage").replaceChildren(node("div","loading-card","簡報載入失敗："+error.message+"。請到 GitHub 確認 JSON 檔及部署。"));
    }
  }
  boot();
})();
