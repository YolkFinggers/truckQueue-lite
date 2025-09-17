@echo off
set "chrome=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "appdir=%~dp0"
set "assign=file:///%appdir%index.html"
set "display=file:///%appdir%display.html"

start "" "%chrome%" --start-fullscreen --profile-directory="Profile 1" "%assign%"
start "" "%chrome%" --start-fullscreen --profile-directory="Profile 2" "%display%"

set "startup=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "lnk=%startup%\TruckQueue.lnk"

if not exist "%lnk%" (
    powershell -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%lnk%'); $s.TargetPath='cmd.exe'; $s.Arguments='/c \"%~f0\"'; $s.WorkingDirectory='%~dp0'; $s.IconLocation='%chrome%,0'; $s.Save()"
)
