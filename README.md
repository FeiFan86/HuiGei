# 惠给网 (Huigei)

优惠直接给到你 - 专注于优惠线报分享的开放平台

## 项目介绍

惠给网是一个专注于优惠线报分享的开放平台，通过自动化采集和用户贡献相结合，为用户提供最新、最实用的省钱信息。

## 技术架构

### 前端
- **框架**: Vue 3 + Element Plus
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router

### 后端
- **框架**: Node.js + Express
- **数据库**: MySQL / PostgreSQL
- **缓存**: Redis
- **认证**: JWT

### 部署方式
- **方式一**: GitHub + Vercel (推荐快速启动)
- **方式二**: 独立服务器部署 (推荐生产环境)
- **采集系统**: 独立Python部署

## 项目结构

```
huigei/
├── frontend/          # 前端项目
├── backend/           # 后端项目
├── docs/              # 项目文档
├── scripts/           # 部署脚本
├── package.json       # 根项目配置
└── README.md          # 项目说明
```

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+ 或 PostgreSQL 14+
- Redis 7.0+

### 安装依赖
```bash
# 安装所有依赖
npm run install:all
```

### 开发环境启动
```bash
# 同时启动前端和后端
npm run dev:frontend & npm run dev:backend

# 或使用concurrently同时启动
npx concurrently "npm run dev:frontend" "npm run dev:backend"
```

### 生产环境构建
```bash
# 构建前端
npm run build:frontend

# 构建后端
npm run build:backend
```

## 功能模块

### 核心功能
- ✅ 线报发布和管理
- ✅ 用户等级和积分系统
- ✅ 审核机制
- ✅ 省钱社区
- ✅ 省钱工具包

### 扩展功能
- 🔄 采集系统 (Python独立部署)
- 🔄 广告位管理
- 🔄 移动端适配

## 部署说明

### Vercel部署 (推荐)
1. 将代码推送到GitHub
2. 连接Vercel，自动构建部署
3. 配置环境变量
4. 配置自定义域名

### 独立服务器部署
1. 准备服务器环境
2. 安装数据库和Redis
3. 部署应用
4. 配置Nginx和SSL

## 开发计划

- [x] 项目架构设计
- [ ] 前端基础框架搭建
- [ ] 后端基础框架搭建
- [ ] 用户认证系统
- [ ] 线报管理功能
- [ ] 用户等级系统
- [ ] 省钱功能模块
- [ ] 采集系统开发
- [ ] 测试和优化
- [ ] 部署上线

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证

MIT License