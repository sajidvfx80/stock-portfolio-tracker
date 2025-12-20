@echo off
echo Testing Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Testing npm installation...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo.
echo Checking project files...
if not exist "package.json" (
    echo ERROR: package.json not found!
    pause
    exit /b 1
)

if not exist "src\main.jsx" (
    echo ERROR: src\main.jsx not found!
    pause
    exit /b 1
)

echo.
echo All checks passed!
echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting development server...
echo.
echo If the browser doesn't open automatically, go to: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

