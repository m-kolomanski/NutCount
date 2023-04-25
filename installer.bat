@ECHO OFF

:: check if admin
net session >nul 2>&1
IF %errorLevel% == 2 (
    ECHO Required privilages not detected, please run file as administrator. Exiting...
    PAUSE
    EXIT /b 0
)

:: set global constants
SET INSTALL_PATH="C:\Program Files (x86)\NutCount"
SET APP_PATH=%INSTALL_PATH%"\NutCount-win32-x64\"

ECHO Installing NutCount into %INSTALL_PATH%

:: check if previously installed
IF EXIST %APP_PATH% (
    ECHO Previous version detected, checking database...

    :: if database exists, copy to temp
    IF EXIST %APP_PATH%"resources\app\db\" (
        ECHO Database detected, copying...
        xcopy /s /q %APP_PATH%"resources\app\db\" %INSTALL_PATH%"\temp\db\"
        SET "copy_database=1"

    ) ELSE (
        ECHO No database detected, updating...
    )

    :: if old version backup exists, remove
    IF EXIST %INSTALL_PATH%"\NutCount-win32-x64_oldversion\" (
        RMDIR /S /Q %INSTALL_PATH%"\NutCount-win32-x64_oldversion\"
    )

    :: create backup of previous version
    RENAME %APP_PATH% "NutCount-win32-x64_oldversion"

) ELSE (
    :: if not installed previously, just copy files
    ECHO Copying files...
)

:: copy all files
xcopy /s /q %~dp0"NutCount-win32-x64\" %APP_PATH%

:: if database existed, copy from temp to new version
IF DEFINED copy_database (
    ECHO Updating databse...
    xcopy /s /q %INSTALL_PATH%"\temp\" %APP_PATH%"resources\app\"
    RMDIR /S /Q %INSTALL_PATH%"\temp\"
)

:: set privilages
ECHO Setting priviliges...
icacls %INSTALL_PATH% /t /grant "%UserName%:F" /q

:: create shortcut
IF NOT EXIST "%USERPROFILE%\Desktop\NutCount" (
    mklink "%USERPROFILE%\Desktop\NutCount" %APP_PATH%"\NutCount.exe"
)


ECHO Installation successfull, you might exit.
PAUSE