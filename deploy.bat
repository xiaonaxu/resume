@echo off
chcp 65001 >nul
echo ========================================
echo   许晓娜个人网站 - 一键部署到 GitHub Pages
echo ========================================
echo.

:: Check git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未找到 Git，请先安装：https://git-scm.com
    pause
    exit /b 1
)

:: Ask for GitHub username
set /p GITHUB_USER="请输入你的 GitHub 用户名: "
if "%GITHUB_USER%"=="" (
    echo [错误] 用户名不能为空
    pause
    exit /b 1
)

:: Create repo on GitHub (opens browser)
echo.
echo 正在打开 GitHub 创建仓库页面...
echo 请手动点击 "Create repository" 按钮（其他选项保持默认即可）
start https://github.com/new
echo.
echo 创建完成后按任意键继续...
pause >nul

:: Configure remote
echo.
echo 正在配置 Git 远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/resume.git

:: Push
echo.
echo 正在推送到 GitHub...
git push -u origin master

if %errorlevel% neq 0 (
    echo.
    echo [提示] 如果推送失败，可能需要配置 GitHub 认证：
    echo   方法1: 在 https://github.com/settings/tokens 创建 Personal Access Token
    echo   方法2: 使用 GitHub Desktop 客户端推送
    echo.
    pause
    exit /b 1
)

:: Enable GitHub Pages
echo.
echo 正在打开 GitHub Pages 设置页面...
echo 请在 Source 下拉菜单中选择 "master branch" 然后点 Save
start https://github.com/%GITHUB_USER%/resume/settings/pages

echo.
echo ========================================
echo   部署完成！
echo   你的网站地址将在 1-2 分钟后生效：
echo   https://%GITHUB_USER%.github.io/resume/
echo ========================================
echo.
pause
