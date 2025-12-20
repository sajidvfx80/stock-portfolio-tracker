@echo off
echo ========================================
echo   Deploy Portfolio Tracker
echo ========================================
echo.

echo Building for production...
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo The 'dist' folder contains your production files.
echo.
echo Next steps:
echo 1. Go to https://vercel.com or https://netlify.com
echo 2. Sign up (free)
echo 3. Drag and drop the 'dist' folder
echo 4. Or connect GitHub for automatic deployment
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions.
echo.

pause

