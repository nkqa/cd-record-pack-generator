@echo off

rem 导航到项目目录
cd "D:\cdpack\web\web"

rem 设置git路径
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

rem 检查git状态
%GIT_PATH% status

rem 添加所有修改
%GIT_PATH% add .

rem 提交修改
%GIT_PATH% commit -m "Remove background music functionality"

rem 推送修改到GitHub
%GIT_PATH% push

rem 显示结果
echo Git push completed!
pause
