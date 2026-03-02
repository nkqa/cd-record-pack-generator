import os
import subprocess

# 导航到项目目录
os.chdir("D:\cdpack\web\web")

# 执行git命令
try:
    # 检查git状态
    print("Checking git status...")
    result = subprocess.run(["git", "status"], capture_output=True, text=True)
    print(result.stdout)
    
    # 检查git日志
    print("\nChecking git log...")
    result = subprocess.run(["git", "log", "-1"], capture_output=True, text=True)
    print(result.stdout)
    
    # 检查远程分支
    print("\nChecking remote branches...")
    result = subprocess.run(["git", "branch", "-a"], capture_output=True, text=True)
    print(result.stdout)
    
except subprocess.CalledProcessError as e:
    print(f"Error executing git command: {e}")
