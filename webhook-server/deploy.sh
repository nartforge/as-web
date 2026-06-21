#!/bin/bash
set -e

# NartForge auto-deploy script
# Usage: ./deploy.sh [branch]

BRANCH=${1:-main}
DEPLOY_PATH="/var/www/nartforge"
PM2_NAME="nartforge"

echo "🚀 Deploying NartForge ($BRANCH)..."

cd "$DEPLOY_PATH"

echo "📥 Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

echo "📦 Installing dependencies..."
npm install --prefix frontend

echo "🏗️ Building frontend..."
npm run build --prefix frontend

echo "📦 Installing webhook server dependencies..."
npm install --prefix webhook-server

echo "🔄 Restarting services..."
pm2 restart "$PM2_NAME" --update-env || pm2 start npm --name "$PM2_NAME" --prefix frontend -- run preview -- --port 3000
pm2 restart "nartforge-webhook" --update-env || pm2 start npm --name "nartforge-webhook" --prefix webhook-server -- run start

echo "✅ Deploy complete!"
