# BIM Atlas｜BIM 建模知識網站

第九週作業：用 AGENTS.md 建立可重複延伸的靜態網站。

本網站的重點不是產生一次性的漂亮網頁，而是讓 AI 依照根目錄的 [AGENTS.md](../AGENTS.md) 固定規範，新增一筆 `articles.json` 內容，就能自動出現在首頁與共用文章頁。

## 組成
- `index.html`：搜尋、篩選、知識卡片
- `article.html`：共用文章模板，網址以 `?id=...` 辨識
- `data/articles.json`：唯一知識資料來源
- `assets/site.css`：一致的視覺風格
- `assets/app.js`：渲染、查詢與導覽邏輯

## 如何延伸
1. 開啟 `AGENTS.md`，確認新增內容的格式和品質要求。
2. 在 `data/articles.json` 的 `articles` 陣列新增一筆文章。
3. 執行 `python -m json.tool bim-atlas/data/articles.json` 驗證 JSON。
4. 更新 GitHub 後，主頁會自動出現新文章；不必新建 HTML 檔案。

## 提醒
案例採匿名教學模擬方式撰寫。內容不可當作原廠尺寸、核定施工圖或工程專業簽證。

本專案使用 GitHub Pages；在本機預覽時請用 `python -m http.server 8000`，不要直接以 `file://` 開啟（瀏覽器可能禁止讀取 JSON）。
