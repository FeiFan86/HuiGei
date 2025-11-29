# 汇给项目部署指南

## 部署方案

项目采用**全栈Vercel部署**方案：
- **前端**：Vercel静态部署
- **后端**：Vercel Serverless Functions (API路由)

## 部署步骤

### 1. 准备GitHub仓库

1. 在GitHub创建新的仓库
2. 将项目代码推送到仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/huigei.git
git push -u origin main
```

### 2. Vercel部署配置

#### 前端部署 (frontend文件夹)
- 在Vercel中导入GitHub仓库
- 设置构建目录为`frontend`
- 配置环境变量：
  - `VITE_API_BASE_URL`: 设置为前端部署后的域名

#### 后端API部署 (api文件夹)
- 在Vercel中创建新的项目，选择`api`目录
- API将作为Serverless Functions运行
- 配置环境变量：
  - `FRONTEND_URL`: 前端部署的域名
  - `JWT_SECRET`: 用于JWT签名的密钥
  - `NODE_ENV`: `production`

### 3. 环境变量配置

#### 前端环境变量 (.env.production)
```env
VITE_API_BASE_URL=https://your-frontend-domain.vercel.app
```

#### 后端环境变量
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

## 部署后的URL结构

- **前端地址**: https://huigei-frontend.vercel.app
- **API地址**: https://huigei-api.vercel.app

## 替代部署方案

如果您不想使用Vercel，也可以考虑：

### 方案A: Netlify + Heroku
- 前端: Netlify静态部署
- 后端: Heroku Node.js应用

### 方案B: 腾讯云/阿里云
- 前端: 对象存储 + CDN
- 后端: 云函数或容器服务

## 本地开发

```bash
# 启动前端开发服务器
cd frontend
npm run dev

# 启动后端API服务器
cd api
npm run dev
```

## 注意事项

1. **跨域问题**: 生产环境需要正确配置CORS
2. **数据库**: 当前使用模拟数据，生产环境需要配置真实数据库
3. **文件上传**: 需要配置对象存储服务
4. **HTTPS**: 确保所有服务都使用HTTPS

## 故障排除

如果部署遇到问题：
1. 检查Vercel部署日志
2. 验证环境变量配置
3. 确认API端点可达性
4. 检查浏览器控制台错误信息