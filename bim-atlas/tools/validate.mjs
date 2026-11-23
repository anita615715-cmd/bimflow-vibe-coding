// 第十一週重做第九週：以 AGENTS.md 約定檢查文章資料
// 執行：node bim-atlas/tools/validate.mjs
// 負向測試：node bim-atlas/tools/validate.mjs --selftest
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonFile = path.join(root, "data", "articles.json");
const db = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

const validCategories = new Set([
  "建模基礎", "圖說查核", "MEP 檢核",
  "工作流程", "參數管理", "4D BIM"
]);

function validate(data) {
  const issues = [];
  if (!data || !Array.isArray(data.articles)) {
    return ["articles 應為陣列"];
  }

  const ids = new Set();
  data.articles.forEach((article, index) => {
    const where = "articles[" + index + "]";
    if (!article || typeof article !== "object") {
      issues.push(where + " 不是文章物件");
      return;
    }
    if (typeof article.id !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.id)) {
      issues.push(where + " id 必須為小寫 kebab-case");
    } else if (ids.has(article.id)) {
      issues.push(where + " id 重複：" + article.id);
    } else {
      ids.add(article.id);
    }

    if (!validCategories.has(article.category)) {
      issues.push(where + " category 不屬於允許分類");
    }

    for (const field of ["title", "summary", "scenario", "note"]) {
      if (typeof article[field] !== "string" ||
          article[field].trim().length === 0) {
        issues.push(where + " " + field + " 不可空白");
      }
    }

    for (const [field, min, max] of [
      ["takeaways", 2, 4],
      ["checklist", 2, 5]
    ]) {
      if (!Array.isArray(article[field]) ||
          article[field].length < min ||
          article[field].length > max ||
          !article[field].every(x => typeof x === "string" && x.trim())) {
        issues.push(where + " " + field + " 格式或數量不符");
      }
    }

    if (!Array.isArray(article.sources)) {
      issues.push(where + " sources 必須是陣列");
    } else {
      article.sources.forEach((source, sourceIndex) => {
        if (!source || typeof source.label !== "string" ||
            !source.label.trim() || typeof source.url !== "string" ||
            !source.url.startsWith("https://")) {
          issues.push(where + " sources[" + sourceIndex + "] 格式不符");
        }
      });
    }
  });
  return issues;
}

const errors = validate(db);
console.log("BIM Atlas 文章數：", db.articles.length);
console.log(errors.length === 0
  ? "PASS：全部文章符合 AGENTS.md 的欄位與命名規範"
  : "FAIL：\n" + errors.join("\n")
);

if (process.argv.includes("--selftest")) {
  const broken = JSON.parse(JSON.stringify(db));
  broken.articles.push({
    ...broken.articles[0],
    title: ""
  });
  const detected = validate(broken);
  if (detected.some(x => x.includes("id 重複")) &&
      detected.some(x => x.includes("title 不可空白"))) {
    console.log("PASS：故障注入測試，成功攔截重複 ID 與空標題");
  } else {
    console.error("FAIL：故障注入測試未能偵測預期錯誤");
    process.exitCode = 1;
  }
}
if (errors.length) process.exitCode = 1;
