@echo off
setlocal
cd /d "%~dp0"
title Horeca - Chiudi tutto
color 0C
echo ========================================
echo          HORECA - CHIUSURA
echo ========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0PANNELLO.ps1" -Azione CHIUDI_TUTTO
endlocal
