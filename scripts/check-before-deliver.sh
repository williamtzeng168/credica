#!/usr/bin/env bash
# ============================================================
# check-before-deliver.sh — 交付前結構健檢
# 目的:防止「設計系統搬遷債」長回來(死碼 / 未引用 CSS /
#       nav 手抄份數 / 文件與現況脫節)。
# 用法:  bash scripts/check-before-deliver.sh
# 退出碼:有任何 FAIL 回傳 1,全綠回傳 0(可接 CI)。
# 建立:2026-07-14(雙 review 流程沉澱)
# ============================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

fail=0
pass() { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
bad()  { printf "  \033[31m✗ FAIL\033[0m %s\n" "$1"; fail=1; }

pages() { ls *.html 2>/dev/null; }

echo "== 1. 未引用的 CSS(死碼)=="
for css in *.css; do
  [ "$css" = "tokens.css" ] && continue   # tokens 是共用基底,允許被部分頁引用
  if grep -rql "$css" --include='*.html' . ; then
    pass "$css 有被引用"
  else
    bad "$css 沒有任何 HTML 引用 → 疑似死碼,請刪除或接上"
  fi
done

echo "== 2. 文件是否還在描述已淘汰的深色主題 =="
# 允許「明確標記為舊/禁止/已移除」的行提到這些字(那是在警告,不是把舊主題當現行)
if grep -rniE '#030014|--accent-primary|--bg-color|indigo.*cyan|glassmorphism' CLAUDE.md AGENTS.md 2>/dev/null | grep -vqiE '汰換|已淘汰|deprecated|舊|禁止|移除|殘留|勿再|prohibit'; then
  bad "CLAUDE.md/AGENTS.md 仍描述舊深色主題(#030014 / accent-primary / glassmorphism)—與現行淺色 Navy 系統不符"
else
  pass "文件未殘留舊深色主題敘述"
fi

echo "== 3. 導覽列是否手抄多份(應收斂成單一來源)=="
nav_inline=$(grep -rl '<nav' --include='*.html' . | grep -v '_backup' | wc -l | tr -d ' ')
if grep -rql 'data-credica-nav\|nav-mount\|partials/nav' --include='*.html' . ; then
  pass "偵測到共用 nav 掛載點(單一來源)"
elif [ "$nav_inline" -gt 2 ]; then
  warn "$nav_inline 個頁面各自手寫 <nav>(尚未收斂成共用元件)"
else
  pass "nav 份數在可接受範圍"
fi

echo "== 4. RWD 提醒(需人工/Playwright 驗)=="
warn "交付前請於 390px + 1440px 雙視窗驗證:0 水平溢出、0 JS 錯誤(見 CLAUDE.md)"

echo ""
if [ "$fail" -eq 0 ]; then
  printf "\033[32m全部結構檢查通過。\033[0m\n"
else
  printf "\033[31m有結構檢查未過,請先修正再交付。\033[0m\n"
fi
exit $fail
