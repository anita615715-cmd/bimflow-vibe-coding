# 第十一週重做｜第九週 AGENTS.md 知識網站

**原作業**：第九週－建立自己的 AGENTS.md 或 CLAUDE.md。  
**專案**：BIM Atlas 建模知識網站。  
**重做目的**：不是另外做一個網頁，而是把「AI 按既定規則新增文章」從文字要求升級成可以重複執行的程式驗收。

## 保留的原作業成果
- 根目錄 [AGENTS.md](../AGENTS.md) 說明目的、目錄、格式、風格、來源及修改限制。
- `bim-atlas/index.html`：知識卡片、搜尋、分類。
- `bim-atlas/article.html`：共用文章詳情模板。
- `bim-atlas/data/articles.json`：單一文章來源。
- 7 篇 BIM 模擬教學文章，包含一篇依規範新增的「設備圖說單位不一致」。
- [第九週新增第 7 篇示範](./IMPLEMENTATION_LOG.md)。

## 這次新增／修改
1. **新增** `bim-atlas/tools/validate.mjs`，以 Node.js 內建模組讀取 JSON，不需其他套件或付費 API。
2. **補強** 根目錄 `AGENTS.md`，要求 AI 每次增修後執行程式驗證，失敗時不得直接發布。
3. **更新** `bim-atlas/README.md`，提供可重複執行的檢查指令。
4. **記錄** 正常測試、負向測試及未驗證項目，方便助教驗收。

## 實際驗證紀錄
已透過 GitHub 讀回 `tools/validate.mjs` 與 `articles.json`，擷取實際上傳程式的檢查函數進行測試：
- 正常資料：**7 篇文章、0 筆結構錯誤**。
- 刻意複製一筆已存在 ID 且將標題改成空字串：**成功攔截重複 ID 與空白標題，共 2 項錯誤**。
- 以上負向測試是刻意注入，不是網站使用者實際造成的故障。
- 驗證包含命名、分類、必填欄位、清單數量、來源網址格式；**不等同**於逐字審核工程事實。
- 尚未在公開 GitHub Pages 真實瀏覽器驗收搜尋、文章切換、手機排版；需在提交前手動檢查。不可宣稱已完成這些操作。

## 讓 AI 以後繼續擴充的實際範例
> 請先讀取 AGENTS.md，確認沒有重複文章。新增一篇〈MEP 管口定位待確認事項〉到 bim-atlas/data/articles.json，符合現有 category、id 與來源規定。不得編造設備尺寸；完成後執行 node bim-atlas/tools/validate.mjs。若檢查不通過，先修改到通過；不得動根目錄 BIMFlow 或其他作業專案。

此流程可重複使用。未來新增文章不需要複製一份 HTML，且 JSON 在發布前可通過固定的結構驗收。
