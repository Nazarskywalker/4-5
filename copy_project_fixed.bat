@echo off
echo Creating directory C:\projects\vote-app-main
mkdir "C:\projects\vote-app-main"

echo Copying files...
xcopy "c:\руби бекап\vote-app-main\*.*" "C:\projects\vote-app-main\" /E /I /H /Y

echo Copy complete! You can now run the application from C:\projects\vote-app-main
