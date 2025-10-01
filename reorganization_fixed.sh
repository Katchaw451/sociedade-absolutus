#!/bin/bash
# reorganization_fixed.sh

echo "Iniciando reorganização com base nos arquivos reais..."

# Criar estrutura (se já não existir)
mkdir -p frontend/public
mkdir -p backend/{app,blockchain/{token_operations,verification,data_management},auth,utils,config,scripts}
mkdir -p docs

echo "1. Movendo arquivos frontend..."
# Mover arquivos HTML existentes
[ -f "index.html" ] && mv index.html frontend/public/
[ -f "index-backup.html" ] && mv index-backup.html frontend/public/
[ -f "quick-fix.html" ] && mv quick-fix.html frontend/public/
[ -f "github-login-section.html" ] && mv github-login-section.html frontend/public/
[ -f "social-login-section.html" ] && mv social-login-section.html frontend/public/
[ -f "simple-creator.html" ] && mv simple-creator.html frontend/public/
[ -f "token-creator.html" ] && mv token-creator.html frontend/public/
[ -f "token-creator-fixed.html" ] && mv token-creator-fixed.html frontend/public/
[ -f "working-token-creator.html" ] && mv working-token-creator.html frontend/public/

# Mover configurações
[ -f "netlify.toml" ] && mv netlify.toml frontend/
[ -f "vercel.json" ] && mv vercel.json frontend/

echo "2. Movendo backend Python..."
# Já movemos app.py e simple_app.py anteriormente, verificar se precisam de ajustes
[ -f "requirements.txt" ] && mv requirements.txt backend/app/

echo "3. Organizando operações blockchain..."
# Token creation - arquivos reais
mv create-real-token.js create-real-token.mjs create-sa-token-direct.mjs create-sa-token.mjs create-token-now.mjs create-with-funds.mjs create-with-solfaucet.mjs final-token-create.mjs backend/blockchain/token_operations/ 2>/dev/null || true

# Verification scripts - arquivos reais
mv check-balance.mjs check-balance-fixed.mjs check-connection.mjs check-content.mjs check-token.mjs check-token-fixed.mjs backend/blockchain/verification/ 2>/dev/null || true

# Data management - arquivos reais
mv fix-connection.mjs fix-ses-issue.mjs restore-complete.mjs restore-with-data.mjs update-with-real-token.mjs simple-token-test.mjs backend/blockchain/data_management/ 2>/dev/null || true

echo "4. Movendo autenticação e utilitários..."
# Auth
mv auth-server.js github-auth.js backend/auth/ 2>/dev/null || true

# Utils
mv get_sol_help.js node-token-create.mjs backend/utils/ 2>/dev/null || true

# Config
mv sa-deployer-wallet.json sa-token-info.json temp-wallet.json backend/config/ 2>/dev/null || true

# Scripts
mv deploy.sh backend/scripts/ 2>/dev/null || true

echo "5. Movendo documentação..."
mv token-creation-guide.txt use-working-sites.txt docs/ 2>/dev/null || true

echo "Reorganização completa!"
echo ""
echo "Estrutura resultante:"
find . -type d -not -path "./node_modules" -not -path "./venv" -not -path "./.git" | head -20
