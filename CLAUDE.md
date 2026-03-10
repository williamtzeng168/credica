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
| 設計風格 | Glassmorphism、CSS 3D Transforms |
| 動畫 | CSS Animations + Intersection Observer |
| 建構工具 | 無 — 純靜態網頁，直接開啟 index.html |

---

## 3. 檔案結構

```
credica/
├── index.html          ← 主頁面（Landing Page）
├── privacy.html        ← 隱私權政策
├── terms.html          ← 服務條款
├── support.html        ← 支援服務（FAQ）
├── style.css           ← 主頁樣式（含響應式設計）
├── page.css            ← 子頁面共用樣式（隱私/條款/支援）
├── script.js           ← 滾動動畫 + 3D 名片互動 + 留言表單
├── credica_logo.png    ← Logo 圖標（純圖標版）
├── credica_full.png    ← Logo 完整版（含文字）
├── README.md           ← 專案基本說明
└── CLAUDE.md           ← 本檔案
```

---

## 4. 設計系統

### 配色

| 用途 | 變數 | 色值 |
|------|------|------|
| 背景 | `--bg-color` | `#030014`（深色） |
| 主文字 | `--text-primary` | `#FFFFFF` |
| 次要文字 | `--text-secondary` | `#94A3B8` |
| 主色調 | `--accent-primary` | `#4F46E5`（Indigo） |
| 副色調 | `--accent-secondary` | `#06B6D4`（Cyan） |
| 點綴色 | `--accent-tertiary` | `#EC4899`（Pink） |

### 視覺元素

- **Glassmorphism**：`.glass` class — 半透明背景 + 模糊 + 邊框
- **漸層文字**：`.text-gradient` — Indigo → Cyan 漸層
- **背景光暈**：`.blob` — 三組模糊漸層球營造氛圍
- **3D 名片**：CSS perspective + transform，支援滑鼠互動旋轉

### 響應式斷點

- `≤ 968px`：改為直式排版，隱藏桌面導航連結

---

## 5. 頁面結構

1. **導航列** — Logo + 功能連結 + 漢堡選單（手機）+ 下載按鈕（固定於頂部）
2. **Hero Section** — 主標語 + CTA 按鈕 + 數據亮點（零伺服器/1秒交換/國際標準）+ 3D 名片視覺
3. **Features Section** — 八大特色卡片（本地儲存、AI 分類、多元交換、人脈圖譜、可驗證身分、名片回收、OCR 掃描、加密備份）
4. **How It Works** — 四步驟引導（下載→建立名片→交換→AI 整理）
5. **Security Section** — 四大隱私要點（零知識、端對端加密、可驗證、可撤回）+ CSS 盾牌動畫
6. **Use Cases** — 四大使用情境（商務人士、業務銷售、活動展會、人資企管）
7. **Partners / B2B** — 三大核心價值 + 六大商業應用（活動管理、臨時工作證、會員資格、培訓證明、展覽通行、場地授權）+ 飛輪效應 + 三層合作模式（全託管 SaaS / 混合整合 / API 深度整合）+ CTA
8. **Final CTA** — 下載呼籲
9. **Footer** — 四欄式（品牌/產品/資源/聯繫）+ 版權聲明

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

## 7. 內容安全提醒

本網站面向公眾，撰寫或修改內容時：

- **不要**揭露具體的加密演算法、資料庫結構或 API 架構
- **不要**提及具體的第三方服務名稱（如 Supabase）
- **不要**描述 AI 分類的具體邏輯或模型
- **不要**暴露 DID/VC 的具體實作方式
- **可以**用高階語言描述功能效果（如「端對端加密」「裝置端 AI」「國際標準身分驗證」）
- **可以**強調使用者體驗與隱私保護的結果，而非技術手段
