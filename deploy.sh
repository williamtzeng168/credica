#!/usr/bin/env bash
# Credica Landing Page → VM 部署腳本
# 用法: ./deploy.sh "commit message"
#       ./deploy.sh                    # 用預設 commit 訊息
#       ./deploy.sh --skip-commit      # 跳過本機 commit/push,只在 VM 重建

set -euo pipefail

# ─── 設定 ───────────────────────────────────────────────
VM_USER="ubuntu"
VM_HOST="43.166.141.134"
VM_PATH="/home/ubuntu/credica"
PUBLIC_URL="https://credica.app"
CONTAINER="credica-landing"
SECRETS_FILE="$(dirname "$0")/.deploy-secrets"

# ─── 顏色 ───────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[0;33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${GREEN}▸${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
die()  { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

# ─── 載入密碼 ───────────────────────────────────────────
if [[ -f "$SECRETS_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$SECRETS_FILE"
fi
if [[ -z "${SSH_PASS:-}" ]]; then
  die "缺少 SSH_PASS。請建立 .deploy-secrets 並寫入: SSH_PASS='<password>'"
fi

# ─── 檢查工具 ───────────────────────────────────────────
command -v sshpass >/dev/null || die "缺少 sshpass — brew install sshpass"
command -v git     >/dev/null || die "缺少 git"

# ─── 解析參數 ───────────────────────────────────────────
SKIP_COMMIT=0
COMMIT_MSG=""
case "${1:-}" in
  --skip-commit) SKIP_COMMIT=1 ;;
  "")            COMMIT_MSG="chore: deploy update $(date +%F-%H%M)" ;;
  *)             COMMIT_MSG="$1" ;;
esac

cd "$(dirname "$0")"

# ─── Step 1: 本機 commit + push ─────────────────────────
if [[ $SKIP_COMMIT -eq 0 ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    say "Step 1/4 — git add + commit + push"
    git add -A
    git commit -m "$COMMIT_MSG"
    git push origin master
  else
    warn "Step 1/4 — 工作區乾淨,無變更可 commit (將直接觸發 VM rebuild)"
    git push origin master 2>/dev/null || true
  fi
else
  warn "Step 1/4 — 跳過本機 commit/push (--skip-commit)"
fi

# ─── 預檢: SSH 連線 ─────────────────────────────────────
# VM 的 22 埠偶發不通(本 session 踩過)。先探一次,給清楚訊息,
# 而非讓後面的 step 中途以難懂的方式中斷。
say "預檢 — SSH 連線 $VM_HOST"
if ! sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 \
     "$VM_USER@$VM_HOST" 'echo ok' >/dev/null 2>&1; then
  die "SSH 連不上 $VM_USER@$VM_HOST — VM 的 22 埠可能不通。改用 VPS 主控台手動 rebuild,或稍後再試。"
fi

# ─── Step 2: VM git pull ────────────────────────────────
say "Step 2/4 — VM 拉新版本"
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" \
  "cd $VM_PATH && git pull origin master && git log -1 --oneline"

# ─── Step 3: Docker rebuild + recreate ──────────────────
say "Step 3/4 — Docker rebuild + recreate"
# 關鍵:遠端命令必須用 bash 並開 `set -o pipefail`。否則
# `docker compose up -d --build | tail` 的退出碼會是 tail 的 0,
# build 失敗也被蓋成功 → ssh 回 0 → 本機 set -e 不觸發 → 誤報「部署成功」。
# (commit 5690ef0 事故:enterprise.html 漏 COPY、docker build 失敗卻報成功。)
if ! sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" \
     "bash -c 'set -eo pipefail; cd $VM_PATH && docker compose up -d --build $CONTAINER 2>&1 | tail -15'"; then
  die "Docker build / recreate 失敗 —— 線上仍是舊版本,未更新。請看上方 build log 的錯誤訊息。"
fi

# build 成功不代表容器有起來:確認容器確實在 Up 狀態(啟動即崩潰也要抓到)。
CONTAINER_STATUS=$(sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" \
  "docker ps --filter name=$CONTAINER --format '{{.Status}}'" 2>/dev/null || true)
say "容器狀態: ${CONTAINER_STATUS:-（docker ps 找不到 $CONTAINER）}"
case "$CONTAINER_STATUS" in
  Up*) : ;;
  *)   die "容器 $CONTAINER 未在執行(狀態:${CONTAINER_STATUS:-不存在})—— build 成功但容器沒起來,線上服務異常。" ;;
esac

# ─── Step 4: 驗證公開網址 ───────────────────────────────
# 走到這裡 build + 容器都已確認成功 → 容器就是新版本,curl 200 才是真驗證
# (舊版 bug:Step 3 假成功時這個 curl 會打到沒被汰換的舊容器、照樣回 200)。
say "Step 4/4 — 驗證公開網址"
sleep 2
LOCAL_HASH=$(git rev-parse --short HEAD)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$PUBLIC_URL/about.html" || true)
if [[ "$HTTP_CODE" == "200" ]]; then
  echo -e "${GREEN}✓ 部署成功${NC} — commit ${LOCAL_HASH} 已生效於 ${PUBLIC_URL}"
else
  die "公開網址回 HTTP $HTTP_CODE —— build 與容器都正常,但對外服務異常,請檢查 nginx / Cloudflare。"
fi
