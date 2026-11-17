# 第十週｜從圖說到 BIM 模型：設備建模前的五道檢查

這是一份以 **LLM Wiki** 作為知識來源的教學型 HTML 簡報，設計給第一次接觸 BIM／Revit 的學生。

## 成果入口
- [教學 HTML 簡報](./index.html)：14 張投影片，支援左右鍵、投影片總覽、來源連結、互動問題
- [Wiki 線上閱讀版](./wiki.html)：7 個章節，附來源與檢查清單
- [Wiki Markdown 目錄](./wiki/index.md)
- [來源清單](./data/manifest.json)
- [loop / graph 說明](./WORKFLOW.md)
- [實際執行與測試紀錄](./CHECK_LOG.md)

## 來源規模
- **9 份獨立 ingest 原始筆記**：`raw/S01.md` ～ `raw/S09.md`
- **7 章 LLM Wiki**：`wiki/W01.md` ～ `wiki/W07.md`
- **14 張教學投影片**：`data/slides.json`
- **2 種學習介面**：簡報與 Wiki 閱讀器

原始資料以 Autodesk 官方說明為主，搭配先前課堂專案 BIM Atlas 的兩個**明確標示為模擬**的教學案例。沒有下載或重製 Autodesk 原文全文；raw 是查閱後的短篇中文轉述與來源註記。

## 檔案結構
```
bim-wiki-lesson/
├── AGENTS.md
├── README.md
├── WORKFLOW.md
├── CHECK_LOG.md
├── index.html             # 教學型 HTML 簡報
├── wiki.html              # Wiki 閱讀器
├── assets/
│   ├── site.css
│   ├── slides.js
│   └── wiki.js
├── data/
│   ├── manifest.json      # 來源列表
│   ├── wiki.json          # 結構化 Wiki
│   └── slides.json        # 來源綁定的投影片
├── raw/                   # S01~S09：9 篇查閱後的來源筆記
├── wiki/                  # index + W01~W07：7 章教學知識庫
└── tools/
    └── validate.js        # 可重跑的來源引用檢查
```

## 實作方式
1. **先討論**主題、教學對象、教學範圍：初學者、五道檢查、不能憑空填補工程規格。
2. **Ingest** 九份來源，保留 URL、來源版本與限制；每份獨立寫在 `raw/`。
3. **LLM 協助產生**七個教學主題，每個重點都記錄對應來源 ID。
4. **先做引用校驗**，再產生有教學次序的 slides.json。
5. HTML 共用模板呈現 Wiki 與簡報。每張投影片有來源連結。
6. 檢查失敗則返回原始資料或 Wiki 修正，不能直接發布。

## 如何驗證
GitHub clone 後於專案資料夾執行：
```bash
node tools/validate.js
node tools/validate.js --selftest
python -m http.server 8000
```
本機瀏覽 `http://localhost:8000`，檢查簡報頁、Wiki 頁、互動題目、上一頁／下一頁與來源連結。

## 重要限制
網站是教學型專案，**不會直接操作 Revit**；無法保證文件中的概念可直接套用所有版本。S06 是 **Revit 2024** 官方連接器概念資料，若在 **Revit 2023** 操作，需另行核對版次。模擬案例中的設備尺寸不得作為真實專案規格。
