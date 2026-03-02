# 设置git路径
$gitPath = "C:\Program Files\Git\bin\git.exe"

# 导航到项目目录
Set-Location "D:\cdpack\web\web"

# 检查git状态
Write-Host "Checking git status..."
Start-Process -FilePath $gitPath -ArgumentList "status" -Wait -NoNewWindow

# 添加所有修改
Write-Host "\nAdding all changes..."
Start-Process -FilePath $gitPath -ArgumentList "add", "." -Wait -NoNewWindow

# 提交修改
Write-Host "\nCommitting changes..."
Start-Process -FilePath $gitPath -ArgumentList "commit", "-m", "Remove background music functionality" -Wait -NoNewWindow

# 推送修改到GitHub
Write-Host "\nPushing changes to GitHub..."
Start-Process -FilePath $gitPath -ArgumentList "push" -Wait -NoNewWindow

# 显示结果
Write-Host "\nGit push completed!"
