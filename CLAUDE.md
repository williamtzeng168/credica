# Credica Landing Page — Claude Code 開發指南

> **版本**: v1.0.0
> **更新**: 2026-03-10

---

## 1. 專案概述

本專案是 **Credica App 的介紹網站**（Landing Page），用於向終端使用者與潛在合作夥伴展示 Credica 的核心價值與功能亮點。

**目標受眾：**
- 一般使用者 — 了解 Credica 能為他們做什麼
- 企業/招商合作方 — 了解 Credica 的差異化優勢與合作機會

**Credica App 核心價值（對外展示）：**
- 隱私優先 — 個人資料完全留在使用者裝置，伺服器不存任何個資
- AI 智慧分類 — 自動整理人脈，減少手動操作
- 一鍵交換 — QR Code、群組雷達、NFC 多種方式交換數位名片
- 人脈圖譜 — 視覺化追蹤人脈關係與互動狀態
- 身份驗證 — 國際標準數位身分驗證，確認對方真實身份

**內容原則：**
1. 面向終端使用者與合作方，使用商業語言而非技術術語
2. 強調使用體驗與價值主張，而非技術實作細節
3. 避免揭露關鍵架構設計（如加密方式、資料庫結構、AI 分類邏輯等）
4. 保持簡潔有力的訊息傳達

---

## 2. 技術棧

| 類別 | 技術 |
|------|------|
| 語言 | HTML5 + CSS3 + Vanilla JavaScript |
| 字型 | Google Fonts (Outfit) |
| 設計風格 | 淺色 Navy 系統（tokens.css）、CSS 3D Transforms |
| 動畫 | CSS Animations + Intersection Observer |
| 建構工具 | 無 — 純靜態網頁，直接開啟 index.html |
| 部署 | **Zeabur Tokyo**（2026-06-12 起，見 [DEPLOY.md](DEPLOY.md)）；`deploy.sh` 舊 VM 流程已作廢 |

> 🚀 **部署/DNS/驗證 SOP 一律看 [DEPLOY.md](DEPLOY.md)**。新增靜態檔要同步加 `Dockerfile` 的 `COPY` 行。

---

## 3. 檔案結構

```
credica/
├── index.html              ← 個人版首頁（Landing Page）
├── business.html           ← 中小組織方案
├── enterprise.html         ← 企業方案
├── pricing.html            ← 組織價格
├── enterprise-pricing.html ← 企業價格
├── tutorial.html           ← 互動教學（27 課）
├── about.html              ← 關於
├── privacy.html            ← 隱私權政策
├── terms.html              ← 服務條款
├── card.html               ← 名片分享 deep-link fallback
├── join-code.html          ← 加入碼/邀請頁
├── auth/                   ← Email 驗證 / 密碼重設狀態頁
├── tokens.css              ← 設計 token（全站共用基底）
├── page.css                ← 法務子頁樣式（隱私/條款）
├── i18n.js / i18n-data.js  ← 多語系（目前僅 index 掛載）
├── script.js               ← 滾動動畫 + 3D 名片互動
├── scripts/check-before-deliver.sh ← 交付前結構健檢
├── Dockerfile / nginx.conf ← Zeabur 部署（見 DEPLOY.md）
└── CLAUDE.md / AGENTS.md   ← 開發指南（Claude / Codex 各一份，內容同步）
```

---

## 4. 設計系統

> **2026-07 更新**：全站已從舊深色主題（`#030014` Indigo/Cyan/Pink glassmorphism，deprecated）
> 搬遷為**淺色 Navy 系統**，token 集中於 [tokens.css](tokens.css)。舊 `style.css`（深色）已於
> 2026-07-14 移除。撰改任何頁面一律以 `tokens.css` 為準，勿再引入舊變數。

### 配色（現行，來源 tokens.css）

| 用途 | 變數 | 色值 |
|------|------|------|
| 全站背景 | `--bg` | `#F4F5F7`（冷灰淺色） |
| 卡片表面 | `--surface` | `#FFFFFF` |
| 主品牌色 | `--navy` | `#1E2951`（深藍） |
| 品牌漸層深 | `--navy-deep` | `#141B3B` |
| 主文字 | `--text` | `#0F1220` |
| 次要文字 | `--text-sub` | `rgba(15,18,32,0.55)` |
| 成功/驗證 | `--ok-text` | `#0E8050`（綠） |

完整 token（status / pastel / radii / shadow）見 [tokens.css](tokens.css)。

### CSS 架構（重要）

- **共用基底**：`tokens.css`（設計 token）＋ `page.css`（法務子頁樣式）。
- **各頁樣式**：目前 index/business/enterprise/pricing/about 等頁的樣式**仍以頁內
  `<style>` 內聯為主**（歷史搬遷結果，收斂為共用 `base.css` 的工作進行中）。
  新增共用元件（按鈕/卡片/nav）**請優先抽到共用檔，勿再複製到各頁**。
- **禁止**再引入舊 `--accent-primary`／`--bg-color`／`.glass`／`.blob` 等深色殘留。
- 交付前跑 `bash scripts/check-before-deliver.sh` 做結構健檢。

### 視覺元素（現行）

- **淺色卡片**：白底 + `--border` 細框 + `--card-shadow` 極淡陰影（iOS 風）。
- **Navy 漸層**：主要 CTA／標題用 `--navy → --navy-deep`。
- **3D 名片 / 手機 mockup**：CSS perspective + transform（index Hero）。

### 響應式斷點

- `≤ 968px`：改為直式排版，隱藏桌面導航連結

---

## 5. 頁面結構

> **2026-07 更新**：以下為 `index.html`（個人版首頁）**現行**區塊，已對齊 2026-07 改版
> （名片／人脈／活動／卡證新定位）。舊版「八大特色卡片／How It Works 四步驟／四大使用情境」
> 已不存在。business/enterprise 等其他頁結構另見各頁。

1. **導覽列** — 由 `nav.js` 注入（全站單一來源）：Logo + 分眾連結（個人版/中小組織/企業方案/互動教學/關於）+ 登入 + 分眾主 CTA + 手機漢堡選單
2. **Hero** — 主標「名片、人脈、活動與卡證，一個 App 串起來」+ 副標 + 綠色隱私 chip + 主 CTA「免費下載 Credica」+「看看 90 秒怎麼運作」+ 信任標籤（免費使用/不用信用卡/iOS 已上架）+ 個人名片 App mockup（頭像/四動作/最近活動/已驗證卡證/底部 tab）
3. **特色三欄** — 一秒交換 / 資料留在你的裝置 / 卡證可驗證
4. **流程（#story）** — 「一次相遇，往後都接得起來」3 步無框：相遇 → 同行 → 留下可信記錄（桌機橫向、窄螢幕直式堆疊）
5. **五種場景（#scenes）** — 「五種場景，讓合作不再費力」（垂直 tab 切換 + App 示意畫面）
6. **三支柱（#pillars）** — 「人、事、證，三件事一起串」
7. **隱私（#privacy）** — 「你的關係，你決定誰看得到」
8. **FAQ（#faq）** — 「你可能想知道的事」
9. **Final CTA（#cta）** — 「共同創造的開始，就在今天」
10. **Footer** — 品牌 / 產品 / 資源 / 聯繫 + 版權聲明

### 外部連結

- 官網 / 下載：`https://zymai.com.tw`
- 支援服務：`https://zymai.com.tw/support`
- 隱私政策：`https://zymai.com.tw/privacy`
- 使用條款：`https://zymai.com.tw/terms`
- 合作聯繫：`mailto:william.tzeng@gmail.com`

---

## 6. 開發指引

### 啟動方式

```bash
# 直接在瀏覽器開啟
open index.html
```

### 修改守則

- **保持純靜態**：不引入任何建構工具或前端框架
- **單頁式設計**：所有內容在 `index.html` 中，除非需要新增獨立頁面
- **樣式集中管理**：所有 CSS 在 `style.css`，不使用 inline style（已有的除外）
- **動畫克制**：動畫用於增強體驗，不可干擾內容閱讀
- **行動優先**：任何新增內容必須確認手機版顯示正常

### 新增區塊（Section）

1. 在 `index.html` 的 `<main>` 內新增 section
2. 加上 `scroll-animate` class 啟用滾動動畫
3. 在 `style.css` 新增對應樣式
4. 確認 `≤ 968px` 的響應式表現

---

## 官網畫面製作守則（2026-06-12 William 指示沉澱）

- **Flex 卡片呈現**：任何示意 / 行銷 / 教學畫面中的 Credica 助理對話，一律用 Flex 卡片模式（來源 chip「🏢 來自 X（透過 Credica 代發）」＋ 結構化卡片〔日期 tile / 資訊列 / 複製鈕 / 按鈕列〕＋ 訊息下方「複製 / 追問」＋ 輸入列上方「常見問題 · 組織預設」＋「輸入訊息給 X…＋送出」），**不用純文字氣泡、不用 LINE Bot 外觀**。
- **畫面真實性**：官網上出現的 App 畫面 / 教學流程，必須先到 credica-v2 程式碼查核功能與入口文案真實存在（William 會抽查「我們有這個畫面嗎」）。畫面一律假資料、不可出現真實個資。
- **RWD 必驗**：交付前 390px ＋ 1440px 雙視窗驗證 **0 水平溢出、0 JS 錯誤**（Playwright element screenshot ＋ reducedMotion:'reduce'；`min-height:100vh` 頁面不可用超高視窗截全頁，會被撐爆）。
- **日期對真實曆法**：示意內容的日期必須查實際星期幾（pm-reviewer 會抓「6/3（二）」這種錯）。
- **教學 marker 不蓋字**：脈動圈不可覆蓋目標元素的文字 — 按鈕移右端、subtab 移下緣、列表 row 移右側、右上小字（儲存）移下緣。

---

## 7. 內容安全提醒

本網站面向公眾，撰寫或修改內容時：

- **不要**揭露具體的加密演算法、資料庫結構或 API 架構
- **不要**提及具體的第三方服務名稱（如 Supabase）
- **不要**描述 AI 分類的具體邏輯或模型
- **不要**暴露 DID/VC 的具體實作方式
- **可以**用高階語言描述功能效果（如「端對端加密」「裝置端 AI」「國際標準身分驗證」）
- **可以**強調使用者體驗與隱私保護的結果，而非技術手段
