# Stock Portfolio Tracker - Launch Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sajid Stock Portfolio Tracker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
    Write-Host ""
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        Write-Host "Please make sure Node.js is installed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "The app will open in your browser automatically." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev

Read-Host "Press Enter to exit"

