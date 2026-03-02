@echo off

rem 导航到项目目录
cd "D:\cdpack\web\web"

rem 检查git状态
git status

rem 添加所有修改
git add .

rem 提交修改
git commit -m "Remove background music functionality"

rem 推送修改到GitHub
git push

rem 显示结果
echo Git push completed!
pause
