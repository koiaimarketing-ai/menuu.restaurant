@echo off
REM ============================================================
REM  Launch Warung Jakarta locally.
REM  - Double-click this file.
REM  - Then open the URL it prints (http://localhost:3000 by default).
REM  - If port 3000 is busy (e.g. another app like KOI is running),
REM    Next.js will automatically use the next free port and print it.
REM  Leave this window OPEN while you browse. Press Ctrl+C to stop.
REM ============================================================
cd /d "%~dp0"
echo Starting Warung Jakarta...
echo Watch below for the "Local: http://localhost:XXXX" line, then open it in Chrome.
echo.
call npx next dev -p 3000
pause
