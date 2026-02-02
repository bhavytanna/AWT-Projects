@echo off
REM This script starts MongoDB with the correct Windows path
REM It will run MongoDB on port 27017

echo Creating MongoDB data directory if it doesn't exist...
if not exist "C:\data\db" (
    mkdir C:\data\db
    echo Directory created at C:\data\db
)

echo.
echo Starting MongoDB...
echo MongoDB will be running at: mongodb://localhost:27017
echo.
echo Keep this window open while using the application.
echo To stop MongoDB, press Ctrl+C
echo.
pause

mongod --dbpath "C:\data\db"

pause
