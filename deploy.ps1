# Deployment script for Vercel
Write-Host "🚀 Starting deployment to Vercel..." -ForegroundColor Cyan

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .\client\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\client\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\server\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.vercel -ErrorAction SilentlyContinue

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location .\client
npm install --force
Set-Location ..\server
npm install --force
Set-Location ..

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
