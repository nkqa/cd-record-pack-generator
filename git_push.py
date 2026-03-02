import os
import subprocess

# 导航到项目目录
os.chdir("D:\cdpack\web\web")

# 执行git命令
try:
    # 检查git状态
    print("Checking git status...")
    subprocess.run(["git", "status"], check=True)
    
    # 添加所有修改
    print("Adding all changes...")
    subprocess.run(["git", "add", "."], check=True)
    
    # 提交修改
    print("Committing changes...")
    subprocess.run(["git", "commit", "-m", "Remove background music functionality"], check=True)
    
    # 推送修改到GitHub
    print("Pushing changes to GitHub...")
    subprocess.run(["git", "push"], check=True)
    
    print("Git push completed successfully!")
except subprocess.CalledProcessError as e:
    print(f"Error executing git command: {e}")
