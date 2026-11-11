#!/usr/bin/env bash
# 部署 fastify-tools 到生产服务器（delldiagi.top）
#
# 流程：git bundle 打包当前 HEAD → scp → 服务器 fetch+reset → docker compose 重建 → 健康检查
# 服务器通过 bundle 离线取代码，不依赖 GitHub 外网访问。
#
# 用法:
#   ./scripts/deploy.sh              # 部署 fastify 服务（默认）
#   ./scripts/deploy.sh shadcn-next  # 部署前端
#   DEPLOY_FORCE=1 ./scripts/deploy.sh   # 服务器工作区有未提交改动时强制覆盖
#
# 环境变量覆盖:
#   DEPLOY_SSH_HOST   SSH 别名（默认 delldiagi，见 ~/.ssh/config）
#   DEPLOY_REPO_DIR   服务器仓库路径（默认 /opt/fastify-tools）
#   DEPLOY_CONTAINER  健康检查的容器名（默认 fastify-service）

set -euo pipefail

SSH_HOST="${DEPLOY_SSH_HOST:-delldiagi}"
REPO_DIR="${DEPLOY_REPO_DIR:-/opt/fastify-tools}"
SERVICE="${1:-fastify}"
CONTAINER="${DEPLOY_CONTAINER:-${SERVICE}-service}"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHA=$(git rev-parse --short HEAD)
BUNDLE="/tmp/ft-${SHA}.bundle"

if [[ -n $(git status --porcelain --untracked-files=no) ]]; then
  echo "✗ 本地有未提交的已跟踪文件改动，先提交再部署（bundle 只含已提交内容）" >&2
  git status --short --untracked-files=no >&2
  exit 1
fi

echo "▶ [1/4] 打包 ${BRANCH}@${SHA} → ${BUNDLE}"
git bundle create "$BUNDLE" "$BRANCH"
scp -o BatchMode=yes "$BUNDLE" "$SSH_HOST:/tmp/"

echo "▶ [2/4] 服务器同步代码"
ssh -o BatchMode=yes "$SSH_HOST" bash -s <<EOF
set -euo pipefail
cd "$REPO_DIR"
git remote set-url origin "$BUNDLE" 2>/dev/null || git remote add origin "$BUNDLE"
git fetch "$BUNDLE" "$BRANCH:refs/remotes/deploy/$BRANCH"
if [[ -z "${DEPLOY_FORCE:-}" && -n \$(git status --porcelain --untracked-files=no) ]]; then
  echo "✗ 服务器工作区有未提交改动，重置会覆盖。先人工确认以下内容：" >&2
  git status --short --untracked-files=no >&2
  echo "  确认可覆盖后重跑：DEPLOY_FORCE=1 $0" >&2
  exit 1
fi
git reset --hard "refs/remotes/deploy/$BRANCH"
echo "  HEAD → \$(git log --oneline -1)"
EOF

echo "▶ [3/4] 重建并重启 ${SERVICE}"
ssh -o BatchMode=yes "$SSH_HOST" "cd '$REPO_DIR' && docker compose up -d --build '$SERVICE'"

echo "▶ [4/4] 等待服务就绪（最长 5 分钟）"
ssh -o BatchMode=yes "$SSH_HOST" CONTAINER="$CONTAINER" bash -s <<'EOF'
set -euo pipefail
for i in $(seq 1 60); do
  if docker logs "$CONTAINER" --since 10m 2>&1 | grep -q "Server listening"; then
    echo "✓ ${CONTAINER} 已就绪"
    docker ps --format '{{.Names}}  {{.Status}}' | grep -E 'fastify|shadcn' || true
    exit 0
  fi
  sleep 5
done
echo "✗ 等待超时，排查：ssh delldiagi 'docker logs ${CONTAINER} --tail 50'" >&2
exit 1
EOF

echo "✓ 部署完成：${BRANCH}@${SHA} → ${SSH_HOST}:${REPO_DIR} (${SERVICE})"
