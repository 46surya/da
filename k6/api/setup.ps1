# PowerShell setup script for k6 Performance Testing API
# Run this script to set up the API server

Write-Host "🚀 Setting up k6 Performance Testing API..." -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
Write-Host "`n⚙️  Setting up environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Created .env file from env.example" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env and update your MySQL credentials!" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  env.example not found. Creating basic .env file..." -ForegroundColor Yellow
        @"
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=k6_performance_db
PORT=3000
NODE_ENV=development
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Created .env file" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env and update your MySQL credentials!" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and update MySQL credentials" -ForegroundColor White
Write-Host "2. Make sure MySQL database is set up (run database_schema.sql)" -ForegroundColor White
Write-Host "3. Start the server: npm start" -ForegroundColor White
Write-Host "4. Run k6 tests: k6 run ../load_test.js" -ForegroundColor White

