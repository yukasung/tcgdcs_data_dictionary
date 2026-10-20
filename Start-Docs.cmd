@echo off
setlocal
cd /d "%~dp0"
set "HOSTNAME=127.0.0.1"
set "PORT=3000"
if not exist ".next\standalone\server.js" (
  echo Build required: pnpm install ^&^& pnpm build
  pause
  exit /b 1
)
where node >nul 2>nul
if not errorlevel 1 (
  node scripts\start-standalone.mjs
) else (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" scripts\start-standalone.mjs
  ) else (
    echo Please install Node.js 22 or newer.
    pause
    exit /b 1
  )
)