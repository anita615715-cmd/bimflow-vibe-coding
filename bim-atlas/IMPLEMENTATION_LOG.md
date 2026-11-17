# 第九週作業｜AGENTS.md 可重複擴充實驗

## 作品說明
BIM Atlas 是以 AGENTS.md 控制頁面與內容一致性的 BIM 知識網站。公開頁面放在 `bim-atlas/`，不更動原有第五週 BIMFlow 網頁。

## 實作過程
1. 建立全域 AGENTS.md，規定技術、目錄、文章資料欄位、介面、資料品質和檢查方式。
2. 建立共用首頁 `index.html`、詳情模板 `article.html` 和唯一來源 `data/articles.json`。
3. 初版資料包含 6 篇不同類型的 BIM 學習筆記。
4. 第二次修改時，按照 AGENTS.md 規則新增 `unit-consistency`（設備圖說單位不一致），**只修改 `data/articles.json`**；既有 HTML、CSS、JavaScript 不需要逐頁修改。

## 驗證範圍
- 已讀回 GitHub 7 個檔案，確定檔案確實上傳。
- 已以 JavaScript 語法檢查驗證 `assets/app.js` 可解析。
- 已驗證 JSON 格式、必填欄位及全部 7 個文章 ID 不重複。
- 尚須從 GitHub Pages 公開網址實際開啟，確認首頁搜尋、分類篩選及第七篇文章頁面顯示正常；未完成前不能宣稱前端功能已實測。

## 擴充實驗的對照
- 原始規則：[AGENTS.md](../AGENTS.md)
- 資料來源：[articles.json](data/articles.json)
- 第七篇文章：`article.html?id=unit-consistency`

## 安全與界線
所有案例均為匿名模擬教材，不含真實公司圖說或原廠核定設備數值。內容不是正式施工依據。
