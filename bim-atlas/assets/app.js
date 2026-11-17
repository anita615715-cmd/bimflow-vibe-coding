(() => {
  "use strict";

  const dataUrl = "./data/articles.json";

  function node(tag, cls, content) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined && content !== null) el.textContent = String(content);
    return el;
  }

  async function getDatabase() {
    const response = await fetch(dataUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("文章資料載入失敗（HTTP " + response.status + "）");
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.articles)) {
      throw new Error("文章資料格式錯誤");
    }
    return data;
  }

  function makeCard(article, index) {
    const link = node("a", "article-card");
    link.href = "./article.html?id=" + encodeURIComponent(article.id);
    link.setAttribute("aria-label", "閱讀文章：" + article.title);

    const top = node("div", "card-top");
    top.append(
      node("span", "card-category", article.category),
      node("span", "card-num", String(index + 1).padStart(2, "0"))
    );

    const heading = node("h3", "", article.title);
    const intro = node("p", "", article.summary);

    const end = node("div", "card-end");
    end.append(
      node("span", "", "探索主題 / " + article.category),
      node("span", "read-arrow", "↗")
    );
    link.append(top, heading, intro, end);
    return link;
  }

  function showError(target, message) {
    target.replaceChildren();
    const p = node("p", "empty-state", message + "。請確認資料檔案與網站部署狀態。");
    target.append(p);
  }

  async function initHome() {
    const cards = document.getElementById("cards");
    const counter = document.getElementById("result-count");
    const search = document.getElementById("search");
    const categoryBox = document.getElementById("categories");
    const total = document.getElementById("article-total");
    try {
      const data = await getDatabase();
      const articles = data.articles.filter(a => a && typeof a.id === "string" && typeof a.title === "string");
      total.textContent = String(articles.length).padStart(2, "0");

      let category = "全部";
      const categories = ["全部", ...new Set(articles.map(a => a.category))];
      categoryBox.replaceChildren();

      for (const choice of categories) {
        const button = node("button", "chip" + (choice === category ? " active" : ""), choice);
        button.type = "button";
        button.dataset.category = choice;
        button.setAttribute("aria-pressed", String(choice === category));
        button.addEventListener("click", () => {
          category = choice;
          for (const chip of categoryBox.querySelectorAll("button")) {
            const selected = chip.dataset.category === choice;
            chip.classList.toggle("active", selected);
            chip.setAttribute("aria-pressed", String(selected));
          }
          render();
        });
        categoryBox.append(button);
      }

      function render() {
        const term = search.value.trim().toLocaleLowerCase("zh-Hant");
        const results = articles.filter(a => {
          if (category !== "全部" && a.category !== category) return false;
          const bag = [a.title, a.summary, a.scenario, a.category]
            .concat(a.takeaways || [], a.checklist || [])
            .join(" ")
            .toLocaleLowerCase("zh-Hant");
          return !term || bag.includes(term);
        });

        counter.textContent = "顯示 " + results.length + " / " + articles.length + " 篇筆記";
        cards.replaceChildren();
        if (!results.length) {
          const empty = node("div", "empty-state");
          empty.append(node("strong", "", "找不到相關筆記"), node("p", "", "試試其他關鍵字，或點選「全部」分類。"));
          cards.append(empty);
          return;
        }
        results.forEach((article, index) => cards.append(makeCard(article, index)));
      }

      search.addEventListener("input", render);
      document.addEventListener("keydown", (event) => {
        const active = document.activeElement;
        const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
        if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          search.focus();
        }
      });
      render();
    } catch (error) {
      counter.textContent = "載入失敗";
      showError(cards, error.message);
    }
  }

  function numberedList(items) {
    const list = node("ol", "section-list");
    items.forEach((line, index) => {
      const li = node("li");
      li.append(node("span", "list-index", String(index + 1).padStart(2, "0")), node("span", "", line));
      list.append(li);
    });
    return list;
  }

  function section(title, bodyElement) {
    const block = node("section", "detail-section");
    block.append(node("h2", "", title), bodyElement);
    return block;
  }

  function makeArticle(article) {
    const body = node("div", "article-body");

    const head = node("header", "article-head");
    head.append(
      node("div", "section-kicker", article.category + " / FIELD NOTES"),
      node("h1", "", article.title),
      node("p", "article-lead", article.summary)
    );
    body.append(head, node("div", "article-divider"));

    body.append(section("情境與背景", node("div", "scenario-box", article.scenario)));
    body.append(section("核心判斷原則", numberedList(article.takeaways || [])));
    body.append(section("建模前檢核清單", numberedList(article.checklist || [])));
    body.append(section("限制與注意事項", node("div", "warning-box", article.note)));

    const sources = node("div", "source-list");
    const knownSources = Array.isArray(article.sources) ? article.sources : [];
    const allowed = knownSources.filter(s => s && typeof s.url === "string" && s.url.startsWith("https://") && typeof s.label === "string");
    if (allowed.length) {
      for (const s of allowed) {
        const a = node("a", "", s.label + " ↗");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        sources.append(a);
      }
    } else {
      sources.append(node("span", "", "本篇為原創教學示例；未提供可驗證的外部參考來源。"));
    }
    body.append(section("參考資料", sources));

    const back = node("a", "btn btn-primary", "← 返回所有文章");
    back.href = "./";
    body.append(back);
    return body;
  }

  async function initArticle() {
    const target = document.getElementById("article-content");
    const id = new URLSearchParams(window.location.search).get("id");
    try {
      const data = await getDatabase();
      const item = data.articles.find(a => a.id === id);
      target.replaceChildren();
      if (!item) {
        const fallback = node("div", "article-loading");
        fallback.append(node("h1", "", "找不到這篇文章"), node("p", "", "這個文章代碼不存在，請回到知識庫選擇其他主題。"));
        const link = node("a", "btn btn-primary", "返回知識庫");
        link.href = "./";
        fallback.append(link);
        target.append(fallback);
        return;
      }
      document.title = item.title + "｜BIM Atlas";
      target.append(makeArticle(item));
    } catch (error) {
      showError(target, error.message);
    }
  }

  if (document.body.dataset.page === "home") initHome();
  if (document.body.dataset.page === "article") initArticle();
})();
