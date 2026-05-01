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

# ─── Step 2: VM git pull ────────────────────────────────
say "Step 2/4 — VM 拉新版本"
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" \
  "cd $VM_PATH && git pull origin master && git log -1 --oneline"

# ─── Step 3: Docker rebuild + recreate ──────────────────
say "Step 3/4 — Docker rebuild + recreate"
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" \
  "cd $VM_PATH && docker compose up -d --build $CONTAINER 2>&1 | tail -8 && docker ps --filter name=$CONTAINER --format '{{.Names}} {{.Status}}'"

# ─── Step 4: 驗證 ───────────────────────────────────────
say "Step 4/4 — 驗證部署"
sleep 2
LOCAL_HASH=$(git rev-parse --short HEAD)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PUBLIC_URL/about.html")
if [[ "$HTTP_CODE" == "200" ]]; then
  echo -e "${GREEN}✓ 部署成功${NC} — commit ${LOCAL_HASH} 已生效於 ${PUBLIC_URL}"
else
  die "公開網址回 HTTP $HTTP_CODE,請檢查 nginx/容器狀態"
fi
