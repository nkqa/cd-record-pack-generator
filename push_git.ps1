$gitPath = "C:\Program Files\Git\bin\git.exe"
& $gitPath add .
& $gitPath commit -m "Update: 确保所有更改都已提交"
& $gitPath push origin master
