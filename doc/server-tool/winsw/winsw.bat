@echo off

cd /d %~dp0

set batFileName=%~n0

set filename=
set filenamealert=
for  %%i in ( *.jar ) do (
    set filename=%%~ni
    goto findJar
)
set filenamealert=%filename%.jar FILE NOT FOUND!
goto menu
:findJar
echo %filename%.jar EXIST. RENAME ".exe" and ".xml".
for %%n in (*.exe) do (
    if %%n NEQ %filename%.exe (ren %%n %filename%.exe)
)
for %%n in (*.xml) do (
    if %%n NEQ %filename%.xml (ren %%n %filename%.xml)
)

:menu
echo %filenamealert%
echo Project Name : %filename%
echo ----------------------
echo [I]  Install    Service
echo [U]  Uninstall  Service
echo [1]  Start      Service
echo [2]  Stop       Service
echo [3]  Restart    Service
echo. 
echo [S1] Search By Port
echo [S2] Search By Pid
echo [K1]  Kill By Port
echo [K2]  Kill By Pid
echo. 
echo [C]  Clear Screen
echo [E]  Exit
echo ----------------------

:select
set yn=
set /p yn=PLEASE INPUT :
if /i "%yn%"=="i" goto server-install
if /i "%yn%"=="u" goto server-uninstall
if /i "%yn%"=="1" goto server-start
if /i "%yn%"=="2" goto server-stop
if /i "%yn%"=="3" goto server-restart
if /i "%yn%"=="s1" goto search-by-port
if /i "%yn%"=="s2" goto search-by-pid
if /i "%yn%"=="k1" goto kill-by-port
if /i "%yn%"=="k2" goto kill-by-pid
if /i "%yn%"=="c" goto clear-screen
if /i "%yn%"=="e" exit
echo Wrong Value!!&ping 0 -n "2">nul&cls&goto menu
:server-install
%filename%.exe install
%filename%.exe start
echo TASK FINISHED
goto select
:server-uninstall
%filename%.exe stop
%filename%.exe uninstall
echo TASK FINISHED
goto select
:server-start
%filename%.exe start
echo TASK FINISHED
goto select
:server-stop
%filename%.exe stop
echo TASK FINISHED
goto select
:server-restart
%filename%.exe restart
echo TASK FINISHED
goto select
:search-by-port
set /p port=INPUT PORT:
echo.
netstat -aon | findstr ":%port%"
echo.
echo TASK FINISHED
goto select
:search-by-pid
set /p pid=INPUT PID:
echo.
tasklist | findstr "%pid%"
echo.
echo TASK FINISHED
goto select
:kill-by-port
set /p port=INPUT PORT: 
echo.
for /f "tokens=5" %%i in ('netstat -aon ^| findstr ":%port%"') do (
    set n=%%i
)
taskkill /f /pid %n%
echo.
echo TASK FINISHED
goto select
:kill-by-pid
set /p pid=INPUT PID:
echo.
taskkill -pid "%pid%"
echo.
echo TASK FINISHED
goto select
:clear-screen
cls
goto menu