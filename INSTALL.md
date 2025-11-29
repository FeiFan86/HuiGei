# 惠给网安装指南

## 环境要求

### 基础环境
- Node.js 18.0+
- MySQL 8.0+
- Redis 7.0+

### 推荐开发环境
- VS Code
- Git
- Docker（可选）

## 安装步骤

### 1. 克隆项目
```bash
git clone <项目地址>
cd huigei
```

### 2. 安装依赖
```bash
# 安装根项目依赖
npm install

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install

# 返回根目录
cd ..
```

### 3. 数据库配置

#### 创建数据库
```sql
-- 创建开发环境数据库
CREATE DATABASE huigei_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建测试环境数据库（可选）
CREATE DATABASE huigei_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建生产环境数据库（可选）
CREATE DATABASE huigei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 配置环境变量
```bash
# 复制后端环境配置
cp backend/.env.example backend/.env

# 复制前端环境配置（可选）
cp frontend/.env.example frontend/.env

# 编辑后端环境变量
# 修改数据库连接信息、JWT密钥等
```

### 4. Redis配置
确保Redis服务器正在运行，默认端口6379

### 5. 初始化数据库
```bash
# 进入后端目录
cd backend

# 运行数据库初始化脚本
npm run db:init

# 或手动执行SQL文件
# mysql -u root -p huigei_dev < database/schema.sql
```

### 6. 启动应用

#### 方式一：分别启动前后端
```bash
# 启动后端（新终端）
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
```

#### 方式二：使用concurrently同时启动
```bash
# 在项目根目录
npm run dev:all
```

### 7. 验证安装

1. **后端服务**：访问 http://localhost:3001/health 应该返回成功状态
2. **前端应用**：访问 http://localhost:3000 应该看到惠给网首页
3. **数据库连接**：检查数据库是否创建了必要的表结构

## 开发环境配置

### VS Code推荐扩展
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- MySQL
- REST Client

### 开发调试

#### 前端调试
```bash
cd frontend
npm run dev  # 开发服务器，支持热重载
npm run build  # 生产构建
npm run preview  # 预览生产构建
```

#### 后端调试
```bash
cd backend
npm run dev  # 开发模式，支持文件监听
npm start  # 生产模式
npm run test  # 运行测试
```

## 生产部署

### Vercel部署（推荐）
1. 将代码推送到GitHub
2. 连接Vercel，配置环境变量
3. 自动构建和部署

### 独立服务器部署
1. 准备服务器环境
2. 配置Nginx反向代理
3. 配置SSL证书
4. 设置进程管理（PM2）

## 常见问题

### 数据库连接失败
- 检查MySQL服务是否启动
- 验证数据库用户名密码
- 确认数据库权限

### Redis连接失败
- 检查Redis服务是否启动
- 验证Redis配置

### 端口冲突
- 修改前后端端口配置
- 检查是否有其他应用占用端口

### 依赖安装失败
- 清理node_modules重新安装
- 使用npm cache clean --force
- 检查网络连接

## 下一步

完成安装后，您可以：
1. 注册新用户测试认证系统
2. 发布线报测试核心功能
3. 查看数据库中的数据
4. 开始开发新功能