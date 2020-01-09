set port=8093

title MyTitleHere port:%port%
@echo off
for /f "tokens=5" %%i in ('netstat -aon ^| findstr ":%port%"') do (
    set n=%%i
)
taskkill /f /pid %n%