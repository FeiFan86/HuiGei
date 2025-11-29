import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 中间件
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 用户认证路由
app.post('/api/auth/login', (req, res) => {
  // 模拟登录逻辑
  res.json({ 
    success: true, 
    message: '登录成功',
    token: 'mock-jwt-token',
    user: { id: 1, username: 'testuser' }
  });
});

app.post('/api/auth/register', (req, res) => {
  // 模拟注册逻辑
  res.json({ 
    success: true, 
    message: '注册成功',
    token: 'mock-jwt-token',
    user: { id: 2, username: req.body.username || 'newuser' }
  });
});

// 省钱社区相关路由
app.get('/api/money-saving/posts', (req, res) => {
  // 模拟获取帖子列表
  const posts = [
    {
      id: 1,
      title: '如何在家省钱',
      content: '一些实用的省钱技巧...',
      author: '省钱达人',
      likes: 15,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: '购物优惠分享',
      content: '发现一个不错的优惠...',
      author: '购物专家',
      likes: 8,
      createdAt: '2024-01-14'
    }
  ];
  res.json({ success: true, data: posts });
});

// 省钱工具相关路由
app.post('/api/tools/budget-calculation', (req, res) => {
  try {
    const { monthlyIncome, fixedExpenses, savingGoal, category, priority } = req.body;
    
    // 计算可支配收入
    const availableIncome = Math.max(0, monthlyIncome - fixedExpenses - savingGoal);
    
    // 根据优先级调整预算比例
    const basePercentage = 0.3;
    const priorityFactor = priority / 5;
    const adjustedPercentage = basePercentage * priorityFactor;
    const recommendedBudget = Math.round(availableIncome * adjustedPercentage);
    const budgetPercentage = availableIncome > 0 ? Math.round((recommendedBudget / availableIncome) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        availableIncome,
        recommendedBudget,
        budgetPercentage,
        timestamp: new Date().toISOString(),
        analysis: getBudgetAnalysis(budgetPercentage)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '计算失败',
      error: error.message
    });
  }
});

// 复利计算器
app.post('/api/tools/compound-interest', (req, res) => {
  try {
    const { principal, rate, years, compoundFrequency } = req.body;
    
    // 计算复利频率因子
    let n = 1;
    switch (compoundFrequency) {
      case 'quarterly': n = 4; break;
      case 'monthly': n = 12; break;
    }
    
    // 复利公式: A = P(1 + r/n)^(nt)
    const r = rate / 100;
    const futureValue = principal * Math.pow(1 + r/n, n * years);
    const totalInterest = futureValue - principal;
    const annualizedReturn = (Math.pow(futureValue / principal, 1/years) - 1) * 100;
    
    res.json({
      success: true,
      data: {
        futureValue: Math.round(futureValue),
        totalInterest: Math.round(totalInterest),
        annualizedReturn: annualizedReturn.toFixed(2),
        principal,
        years,
        rate,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '复利计算失败',
      error: error.message
    });
  }
});

// 储蓄目标计算
app.post('/api/tools/saving-goals', (req, res) => {
  try {
    const { targetAmount, currentAmount, monthlySaving, targetDate, rate } = req.body;
    
    const today = new Date();
    const targetDateObj = new Date(targetDate);
    const monthsToTarget = Math.max(1, (targetDateObj.getFullYear() - today.getFullYear()) * 12 + (targetDateObj.getMonth() - today.getMonth()));
    
    // 计算所需每月储蓄
    const monthlyRate = (rate || 0) / 100 / 12;
    let requiredMonthlySaving;
    
    if (monthlyRate > 0) {
      // 考虑利息的复杂计算
      requiredMonthlySaving = (targetAmount - currentAmount * Math.pow(1 + monthlyRate, monthsToTarget)) * 
        (monthlyRate / (Math.pow(1 + monthlyRate, monthsToTarget) - 1));
    } else {
      // 简单计算
      requiredMonthlySaving = Math.ceil((targetAmount - currentAmount) / monthsToTarget);
    }
    
    const completionRate = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
    const remainingAmount = Math.max(0, targetAmount - currentAmount);
    
    res.json({
      success: true,
      data: {
        requiredMonthlySaving: Math.max(0, Math.round(requiredMonthlySaving)),
        completionRate,
        remainingAmount,
        monthsToTarget,
        currentAmount,
        targetAmount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '储蓄目标计算失败',
      error: error.message
    });
  }
});

// 优惠券优化计算
app.post('/api/tools/coupon-optimization', (req, res) => {
  try {
    const { items, coupons, budget } = req.body;
    
    // 简单的优惠券优化算法
    const optimized = optimizeCoupons(items, coupons, budget);
    
    res.json({
      success: true,
      data: {
        originalTotal: optimized.originalTotal,
        finalTotal: optimized.finalTotal,
        totalSavings: optimized.totalSavings,
        couponsUsed: optimized.couponsUsed,
        items: optimized.items,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '优惠券优化失败',
      error: error.message
    });
  }
});

// 优惠券优化算法
function optimizeCoupons(items, coupons, budget) {
  // 计算原始总价
  const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // 简单的贪心算法：优先使用折扣力度大的优惠券
  const sortedCoupons = coupons.sort((a, b) => b.discount - a.discount);
  let finalTotal = originalTotal;
  const couponsUsed = [];
  
  for (const coupon of sortedCoupons) {
    if (finalTotal > budget && finalTotal > coupon.minimumAmount) {
      const discount = coupon.type === 'percentage' ? 
        finalTotal * (coupon.discount / 100) : 
        coupon.discount;
      
      finalTotal -= discount;
      couponsUsed.push(coupon);
    }
  }
  
  return {
    originalTotal,
    finalTotal: Math.max(0, finalTotal),
    totalSavings: originalTotal - Math.max(0, finalTotal),
    couponsUsed,
    items
  };
}

function getBudgetAnalysis(percentage) {
  if (percentage > 50) {
    return {
      type: 'warning',
      title: '预算过高',
      text: '建议降低购物预算，避免影响其他必要支出和储蓄目标'
    };
  } else if (percentage < 20) {
    return {
      type: 'info',
      title: '预算合理',
      text: '预算分配合理，可以适当增加购物预算或提高储蓄'
    };
  } else {
    return {
      type: 'success',
      title: '预算适中',
      text: '预算分配适中，既能满足购物需求，又不会影响财务健康'
    };
  }
}

// 文件上传路由
app.post('/api/upload', async (req, res) => {
  try {
    // 这里可以集成阿里云/腾讯云存储服务
    // 暂时返回模拟数据
    res.json({
      success: true,
      data: {
        url: 'https://example.com/uploaded-file.jpg',
        fileName: 'uploaded-file.jpg',
        size: 1024
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上传失败',
      error: error.message
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '路由不存在' 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API服务器运行在端口 ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;