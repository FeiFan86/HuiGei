<template>
  <div class="tools">
    <el-container>
      <el-header>
        <h1>省钱工具</h1>
        <el-menu mode="horizontal" :default-active="$route.path" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/money-saving-community">省钱社区</el-menu-item>
          <el-menu-item index="/money-saving-tools">省钱工具</el-menu-item>
        </el-menu>
      </el-header>
      
      <el-main>
        <!-- 工具列表页面 -->
        <div v-if="!currentTool" class="tools-content">
          <h2>选择您需要的省钱工具</h2>
          <el-row :gutter="20">
            <el-col :span="8" v-for="tool in tools" :key="tool.id">
              <el-card class="tool-card" shadow="hover">
                <div class="tool-icon">
                  <i :class="tool.icon" class="icon"></i>
                </div>
                <h3>{{ tool.title }}</h3>
                <p>{{ tool.description }}</p>
                <el-button type="primary" @click="openTool(tool)">
                  开始使用
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 具体工具页面 -->
        <div v-else class="tool-detail">
          <div class="tool-header">
            <el-button @click="backToList" icon="el-icon-arrow-left">
              返回工具列表
            </el-button>
            <h2>{{ currentTool.title }}</h2>
          </div>
          
          <!-- 动态加载工具组件 -->
          <component :is="currentTool.component" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import BudgetCalculator from '@/components/tools/BudgetCalculator.vue'
import CouponPlanner from '@/components/tools/CouponPlanner.vue'
import SpendingAnalysis from '@/components/tools/SpendingAnalysis.vue'
import PriceComparison from '@/components/tools/PriceComparison.vue'
import SavingGoals from '@/components/tools/SavingGoals.vue'
import FinanceCalculator from '@/components/tools/FinanceCalculator.vue'

export default {
  name: 'MoneySavingTools',
  components: {
    BudgetCalculator,
    CouponPlanner,
    SpendingAnalysis,
    PriceComparison,
    SavingGoals,
    FinanceCalculator
  },
  data() {
    return {
      currentTool: null,
      tools: [
        {
          id: 1,
          title: '购物预算计算器',
          description: '帮助您合理规划购物预算，避免超支',
          icon: 'el-icon-shopping-cart-full',
          component: 'BudgetCalculator'
        },
        {
          id: 2,
          title: '优惠券使用规划',
          description: '优化优惠券使用策略，最大化节省金额',
          icon: 'el-icon-discount',
          component: 'CouponPlanner'
        },
        {
          id: 3,
          title: '消费习惯分析',
          description: '分析您的消费习惯，找出省钱机会',
          icon: 'el-icon-data-analysis',
          component: 'SpendingAnalysis'
        },
        {
          id: 4,
          title: '比价工具',
          description: '快速比较不同平台的价格，找到最优惠的',
          icon: 'el-icon-price-tag',
          component: 'PriceComparison'
        },
        {
          id: 5,
          title: '省钱目标设定',
          description: '设定省钱目标，跟踪完成进度',
          icon: 'el-icon-aim',
          component: 'SavingGoals'
        },
        {
          id: 6,
          title: '理财计算器',
          description: '计算投资收益，规划理财方案',
          icon: 'el-icon-money',
          component: 'FinanceCalculator'
        }
      ]
    }
  },
  methods: {
    openTool(tool) {
      const availableComponents = ['BudgetCalculator', 'CouponPlanner', 'SpendingAnalysis', 'PriceComparison', 'SavingGoals', 'FinanceCalculator']
      
      if (availableComponents.includes(tool.component)) {
        this.currentTool = tool
      } else {
        this.$message.info(`正在开发 ${tool.title} 功能...`)
      }
    },
    backToList() {
      this.currentTool = null
    }
  }
}
</script>

<style scoped>
.tools-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tool-card {
  text-align: center;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tool-icon {
  font-size: 3.5em;
  color: #409EFF;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.tool-card:hover .tool-icon {
  transform: scale(1.1);
}

.tool-card h3 {
  margin: 10px 0;
  color: #333;
  font-size: 1.2em;
  font-weight: 600;
}

.tool-card p {
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
  font-size: 0.95em;
}

.tool-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.tool-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8em;
}

.el-header h1 {
  text-align: center;
  margin: 0;
  padding: 0;
  font-size: 2.2em;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tools-content h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  font-size: 1.8em;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-content {
    padding: 0 15px;
  }
  
  .tool-card {
    height: auto;
    min-height: 220px;
    margin-bottom: 20px;
  }
  
  .tool-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .el-header h1 {
    font-size: 1.8em;
  }
  
  .tools-content h2 {
    font-size: 1.5em;
    margin-bottom: 25px;
  }
}

@media (max-width: 480px) {
  .tool-icon {
    font-size: 2.5em;
  }
  
  .tool-card h3 {
    font-size: 1.1em;
  }
  
  .tool-card p {
    font-size: 0.9em;
  }
}
</style>