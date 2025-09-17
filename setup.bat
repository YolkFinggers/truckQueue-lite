@echo off
set "chrome=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "appdir=%~dp0"
set "assign=file:///%appdir:\=/%index.html"
set "display=file:///%appdir:\=/%display.html"

start "" "%chrome%" --start-fullscreen --profile-directory="Default" "%assign%"
timeout /t 2 /nobreak >nul
start "" "%chrome%" --kiosk --profile-directory="Default" --new-window "%display%"

powershell -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Windows.Forms; $screen=[System.Windows.Forms.Screen]::AllScreens[1]; for($i=0; $i -lt 3; $i++){Start-Sleep 3; $processes=Get-Process chrome -ErrorAction SilentlyContinue | Where {$_.MainWindowHandle -ne 0}; if($processes.Count -gt 1){$p=$processes[1]} else{$p=$processes | Select -Last 1}; if($p -and $p.MainWindowHandle -ne 0){Add-Type -Type 'using System; using System.Runtime.InteropServices; public class W{[DllImport(\"user32.dll\")] public static extern bool MoveWindow(IntPtr h,int x,int y,int w,int h2,bool r);}'; try{[W]::MoveWindow($p.MainWindowHandle,$screen.Bounds.X,$screen.Bounds.Y,$screen.Bounds.Width,$screen.Bounds.Height,$true); break} catch{if($i -eq 2){Write-Host 'Failed after 3 attempts'}}}}"

set "startup=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
powershell -ExecutionPolicy Bypass -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%startup%\TruckQueue.lnk'); $s.TargetPath='cmd.exe'; $s.Arguments='/c \"%~f0\"'; $s.WorkingDirectory='%~dp0'; $s.Save()"