# 设置git路径
$gitPath = "C:\Program Files\Git\bin\git.exe"

# 导航到项目目录
Set-Location "D:\cdpack\web\web"

# 检查git状态
Write-Host "Checking git status..."
& $gitPath status

# 添加所有修改
Write-Host "\nAdding all changes..."
& $gitPath add .

# 提交修改
Write-Host "\nCommitting changes..."
& $gitPath commit -m "Remove background music functionality"

# 推送修改到GitHub
Write-Host "\nPushing changes to GitHub..."
& $gitPath push

# 显示结果
Write-Host "\nGit push completed!"
