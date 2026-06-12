# Credica 官網部署設定（2026-06-12 起生效）

> 2026-06-12 官網從舊 VM（43.166.141.134，傳統 Docker）遷移到 **Zeabur Tokyo（K3s）**。
> 舊的 `./deploy.sh` SSH 部署流程**已作廢**。

---

## 1. 現行架構

```
瀏覽者 → Cloudflare（Proxy/CDN/SSL）→ Zeabur Tokyo K3s → credica-landing（nginx:alpine 容器）
```

| 項目 | 值 |
|---|---|
| Zeabur 專案 | `Credica`（region: Tencent Tokyo 2C 8GB） |
| projectId | `6a243a242fe98e0879e0f3d5` |
| environmentId | `6a243a2495b39806d284aac8`（production） |
| 服務名稱 | `credica-landing` |
| serviceId | `6a2b69ea8ae399a34fad9d67` |
| 容器 | `nginx:alpine` + repo 根目錄 `Dockerfile`（COPY 全部靜態檔 + `nginx.conf`） |
| Zeabur 產生網域 | `credica-landing.zeabur.app` |

跟後端 21 個微服務（gateway / concierge-svc / event-svc …）同一個 Zeabur 專案。

## 2. Cloudflare DNS 設定（zone: credica.app）

| 記錄 | 類型 | 指向 | Proxy |
|---|---|---|---|
| `credica.app` | CNAME | `credica-landing.zeabur.app` | ✅ 橘雲 |
| `www.credica.app` | CNAME | `credica-landing.zeabur.app` | ✅ 橘雲 |

- SSL/TLS 模式：**Full**
- `migratrack.credica.app`：**2026-06-12 已刪除下線**（William 拍板不再維護 MigraTrack）
- `api.credica.app` → Zeabur 後端（43.153.153.72，6/07 cutover）；`dashboard/ci/bot/console/llm` → Mac mini Cloudflare Tunnel，皆與官網無關
- DNS 變更可用 `~/.credica-migration.env` 的 `CLOUDFLARE_DNS_TOKEN` 走 API（zone id `a218d6d7c8efc6368939764d3106b029`）

## 3. 如何部署更新

1. 改檔案 → commit → `git push origin master`
2. 在 Zeabur 對 `credica-landing` 服務 **Redeploy**（dashboard 按鈕，或請 Claude 用 Zeabur MCP `deploy-from-specification` 重建）
3. 部署完成後驗證（見下）

> ⚠️ 新增靜態檔案（html/圖片）時，必須同步在 `Dockerfile` 加對應 `COPY` 行，否則新檔不會進容器（404）。

## 4. 部署後驗證清單

```bash
# 全頁 200 + Last-Modified 應為新 build 時間
for p in / /tutorial.html /pricing.html /business.html /enterprise.html /join-code.html; do
  curl -sI "https://credica.app$p" | grep -E 'HTTP|Last-Modified'; done

# App 深連結（必須是 application/json）
curl -sI https://credica.app/.well-known/apple-app-site-association | grep -i content-type

# 忘記密碼頁（App PKCE 修復依賴此頁）
curl -s -o /dev/null -w '%{http_code}\n' https://credica.app/auth/reset-password.html
```

判斷 origin 是否真的是 Zeabur：`Last-Modified` 應等於 Zeabur 該次 build 的時間（nginx 用容器內檔案 mtime）。

## 5. 已知注意事項

- **本機網路（Zscaler / Cisco Umbrella）會擋 `*.zeabur.app` 直連（403）** — 驗證一律走 `credica.app`，或用 Zeabur MCP 查服務狀態，別被 403 誤導以為服務掛了。
- 舊 VM `43.166.141.134` 到期不續（2026-06 拍板，方案 B），上面已無任何依賴；`deploy.sh` / `.deploy-secrets` 僅留作歷史參考。
- `wip/green-rebrand-20260609` 分支存有 6/9 綠色大地色 rebrand WIP，待 William 拍板是否採用。

## 6. 回滾

- 內容問題：git revert 後重新 Redeploy。
- Zeabur 整體故障：Cloudflare 把兩筆 CNAME 改回任何可用 origin 即可（DNS proxied，全球生效約 1 分鐘）。舊 VM 到期後不再是選項。
