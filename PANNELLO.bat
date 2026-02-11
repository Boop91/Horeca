@echo off
setlocal
cd /d "%~dp0"
title Horeca - Pannello di controllo
color 0B
echo ========================================
echo        HORECA - PANNELLO CONTROLLO
echo ========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0PANNELLO.ps1"
endlocal
