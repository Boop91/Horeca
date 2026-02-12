@echo off
setlocal
cd /d "%~dp0"
title Horeca - Condividi online
color 0B
echo ========================================
echo      HORECA - CONDIVISIONE ONLINE
echo ========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0PANNELLO.ps1" -Azione CONDIVIDI_ONLINE
endlocal
