# ============================================================
# Start tất cả services: blogmanager backend + content-intel backend + frontend
# Chạy từ project root: C:\Users\vusu3\OneDrive\Desktop\blogpost
# ============================================================

$root = $PSScriptRoot

Write-Host "Starting blogmanager backend (port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit', '-Command',
  "Set-Location '$root'; python -m uvicorn backend.main:app --reload --port 8000"

Start-Sleep -Milliseconds 500

Write-Host "Starting content-intel backend (port 8100)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit', '-Command',
  "Set-Location '$root\content-intel\backend'; python -m uvicorn main:app --reload --port 8100"

Start-Sleep -Milliseconds 500

Write-Host "Starting frontend dev server (port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit', '-Command',
  "Set-Location '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "All services starting..." -ForegroundColor Green
Write-Host "  Blogmanager  : http://localhost:5173" -ForegroundColor White
Write-Host "  CI Backend   : http://localhost:8100/docs" -ForegroundColor White
Write-Host "  CI via proxy : http://localhost:5173/ci/health" -ForegroundColor White
