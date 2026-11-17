# AGENTS.md — BIM Atlas 開發與內容規範

## 1. 專案定位
本儲存庫原有的根目錄 index.html 是第五週 BIMFlow 作業，**不可因為本專案而修改、覆蓋或刪除**。
本次第九週專案為獨立子目錄 `bim-atlas/`，是一個可持續擴充的 BIM／Revit 建模知識網站。
目標：讓 AI 閱讀本文件後，可以一致地新增文章、調整版面，並且不破壞既有內容。
受眾：初學 BIM 的學生與設備建模人員。語言：繁體中文、台灣用語。

## 2. 固定技術與部署原則
- 使用 GitHub Pages 靜態網站；不需要後端、付費 API、登入或資料庫伺服器。
- 允許 HTML / CSS / 原生 JavaScript / JSON。未經明確需求，不引入 React、打包工具或第三方 CDN。
- 網站入口：`bim-atlas/index.html`；文章詳情頁共用 `bim-atlas/article.html?id=slug`。
- 所有內容只從 `bim-atlas/data/articles.json` 讀取。新增文章不複製 HTML 模板。
- 請保留相對路徑（如 `./assets/site.css`、`./article.html?id=...`），讓網站能在 GitHub Pages 專案子路徑下運作。
- 任何修改都不能破壞儲存庫根目錄既有 BIMFlow 網站。

## 3. 目錄結構
```text
/
├── index.html                    # 舊 BIMFlow 作業，禁止動到
├── AGENTS.md                     # 本規範
└── bim-atlas/
    ├── README.md                 # 專案介紹與新增流程
    ├── index.html                # 知識卡片、搜尋與分類篩選
    ├── article.html              # 共用文章詳情模板
    ├── assets/
    │   ├── site.css              # 全站唯一樣式表
    │   └── app.js                # 資料載入、搜尋、路由與渲染
    └── data/
        └── articles.json         # 所有文章的唯一資料來源
```

## 4. 內容欄位契約（新增文章必須遵守）
編輯 `bim-atlas/data/articles.json` 的 `articles` 陣列，新增一筆物件。必填：
- `id`：唯一，英文小寫 kebab-case（例如 `pipe-size-check`），不可更改既有 ID；ID 即文章網址。
- `category`：從「建模基礎、圖說查核、MEP 檢核、工作流程、參數管理、4D BIM」選一個。
- `title`：清楚提出讀者要解決的問題，最好 15–32 個字以內。
- `summary`：一至兩句摘要，不誇大能力。
- `scenario`：一段具體而匿名的教學案例；真實專案資料不得照搬。
- `takeaways`：2–4 個字串，說明判斷原則。
- `checklist`：2–5 個字串，說明可執行的核對行動。
- `note`：限制、適用範圍或待確認資訊。
- `sources`：來源物件陣列，格式為 `{"label":"...","url":"https://..."}`；沒有可追溯來源時填空陣列，**不能編造連結**。

範例物件：
```json
{
  "id": "sample-article",
  "category": "圖說查核",
  "title": "遇到尺寸矛盾，應該先確認什麼？",
  "summary": "先核對兩份文件版本與量測基準。",
  "scenario": "模擬案例：兩張圖示出不同長度。",
  "takeaways": ["不擅自選定最終尺寸", "確認各文件版次"],
  "checklist": ["整理差異", "送請權責人員確認"],
  "note": "本頁為教學案例，非核定施工依據。",
  "sources": []
}
```

## 5. 內容品質與安全規則
- 不可虛構設備尺寸、管口、管徑、原廠資料、法規條文或引用來源。
- 教學示例必須明確標示「模擬案例」；不能讓讀者誤以為真實核定尺寸。
- 工程建議要區分「已知」「推論／建議」「待確認」。不宣稱已執行 Revit、已讀 DWG 或完成現場驗收。
- 不公開公司圖面、NAS 路徑、客戶名稱、聯絡資訊、學號、API Keys 或私人資料。
- 技術說明優先連結官方來源；無法確認時標記待驗證。
- 用繁體中文與台灣工程習慣語，避免生硬翻譯。

## 6. 視覺設計規範
- 主要風格：深墨藍背景區塊、米白內容底色、青綠互動強調、低對比輔助文字。
- 字型使用系統字體與 Microsoft JhengHei；無須額外下載字型。
- 桌面版卡片三欄，平板兩欄，手機單欄。保留適當留白。
- 所有頁面共用 `assets/site.css`、網站標誌、導覽列與頁尾。
- 不新增裝飾性空按鈕。互動控制必須有真正對應的功能。
- 文字與背景保持可閱讀對比；提供鍵盤焦點樣式與語意化標籤。

## 7. AI 新增文章的標準工作流程（必須照順序）
1. 先讀本 AGENTS.md 和現有 `articles.json`。
2. 確認新主題沒有重複，選擇 category 與唯一 slug。
3. 先草擬 title、summary、scenario、takeaways、checklist、note、sources。
4. 核對事實、標示資料缺口，移除未經證實的尺寸、來源與細節。
5. **只在 articles.json 新增一個物件**；除非要修改功能，否則不要改 index.html 或 article.html。
6. 執行下面的檢查；檢查主頁搜尋、分類、文章詳情與返回連結。
7. 在變更說明中列出新 ID、內容來源、測試結果與尚未確認的事項。

## 8. 具體驗收
- `python -m json.tool bim-atlas/data/articles.json` 可解析。
- 每個文章 `id` 不重複，且符合 `^[a-z0-9]+(-[a-z0-9]+)*$`。
- 編輯 `articles.json` 新增文章後，主頁自動多一張卡片，搜尋和分類正確，點進 `article.html?id=...` 能讀到完整內容。
- 主頁無查詢結果時顯示空狀態；文章 id 不存在時顯示友善訊息。
- 於 GitHub Pages 網址測試，至少含手機寬度與桌面寬度。
- 外部來源連結使用 `https://`，避免可執行連結內容。
- 任何修正不能改動根目錄第五週 BIMFlow 頁面。

## 9. 禁止與例外
- 不得在網頁中放 API 金鑰或私有資料。
- 不得把舊文章直接覆寫；要先比對、保留意圖，必要時調整。
- 不得宣稱「測試成功」除非實際執行且觀察結果。
- 若被要求新增照片、PDF 解析、登入或後端，先確認需求與技術資源，不能擅自擴充。

## 10. 可重複使用的指令示例
「請先閱讀 AGENTS.md，然後替 BIM Atlas 新增一篇〈管口尺寸確認〉。只修改 bim-atlas/data/articles.json；資料不足請標示待確認。完成後檢查 JSON 格式、文章 ID、首頁卡片和詳情頁，不要動到第五週 BIMFlow。」
