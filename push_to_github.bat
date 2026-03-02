@echo off
cd "%~dp0"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/nkqa/cd-record-pack-generator.git
git push -u origin master -f
echo Done!
pause