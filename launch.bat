@echo off
echo ========================================
echo   Sajid Stock Portfolio Tracker
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes on first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Please make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Starting development server...
echo.
echo The app will open in your browser automatically.
echo If it doesn't open, go to: http://localhost:5173
echo Press Ctrl+C to stop the server.
echo.
echo ========================================
echo.

call npm run dev

REM If browser didn't open automatically, try to open it manually
timeout /t 3 /nobreak >nul
start http://localhost:5173

pause

