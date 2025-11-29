@echo off
echo 启动惠给网开发环境...

REM 检查是否已安装依赖
echo 检查项目依赖...
if not exist "node_modules" (
    echo 请先运行 npm install 安装依赖
    pause
    exit /b 1
)

echo 启动Vite开发服务器...
start cmd /k "npm run dev"

echo 启动API服务器...
start cmd /k "npm run api"

echo 开发环境已启动！
echo - 前端地址: http://localhost:5173
echo - API地址: http://localhost:3001
echo.
echo 按任意键退出...
pause >nul