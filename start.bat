@echo off
chcp 65001 >nul
title AgroLens — локальний сервер
cd /d "%~dp0"
echo.
echo   AgroLens · ПР5
echo   Запускаю локальний сервер на http://localhost:8080
echo   Зупинити — Ctrl+C
echo.
start "" "http://localhost:8080/index.html"
python -m http.server 8080
if errorlevel 1 (
  echo Python не знайдено. Відкриваю index.html напряму...
  start "" "%~dp0index.html"
  pause
)
