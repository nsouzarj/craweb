@echo off
echo =====================================
echo CRA Frontend - Angular 18 Application
echo =====================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Checking if npm is available...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm version:
npm --version

echo.
echo Checking if Angular CLI is installed...
ng version >nul 2>&1
if %errorlevel% neq 0 (
    echo Angular CLI not found. Installing globally...
    npm install -g @angular/cli@18
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Angular CLI
        pause
        exit /b 1
    )
)

echo.
echo Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo =====================================
echo Starting CRA Frontend Application...
echo =====================================
echo.
echo The application will be available at:
echo http://localhost:4200
echo.
echo Make sure the CRA Backend is running at:
echo http://localhost:8080
echo.
echo Press Ctrl+C to stop the application
echo.

npm start