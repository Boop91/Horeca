@echo off
setlocal
cd /d "%~dp0"
title Horeca - Avvia tutto
color 0A
echo ========================================
echo          HORECA - AVVIO LOCALE
echo ========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0PANNELLO.ps1" -Azione AVVIA_LOCALE
endlocal
