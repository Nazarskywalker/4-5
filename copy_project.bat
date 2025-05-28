@echo off
echo Copying project to C:\projects\vote-app-main
mkdir C:\projects
xcopy /E /I /H /Y "c:\руби бекап\vote-app-main" "C:\projects\vote-app-main"
echo Copy complete! You can now run the application from C:\projects\vote-app-main
