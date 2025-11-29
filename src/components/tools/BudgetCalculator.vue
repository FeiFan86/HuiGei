<template>
  <div class="budget-calculator">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h3>购物预算计算器</h3>
          <el-button type="primary" @click="saveCalculation" :disabled="!isValid">
            保存计算结果
          </el-button>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="月收入">
          <el-input-number
            v-model="form.monthlyIncome"
            :min="0"
            :step="100"
            placeholder="请输入月收入"
          />
          <span class="unit">元</span>
        </el-form-item>
        
        <el-form-item label="固定支出">
          <el-input-number
            v-model="form.fixedExpenses"
            :min="0"
            :step="100"
            placeholder="房租、水电等固定支出"
          />
          <span class="unit">元</span>
        </el-form-item>
        
        <el-form-item label="储蓄目标">
          <el-input-number
            v-model="form.savingGoal"
            :min="0"
            :step="100"
            placeholder="每月储蓄目标"
          />
          <span class="unit">元</span>
        </el-form-item>
        
        <el-form-item label="购物类别">
          <el-select v-model="form.category" placeholder="选择购物类别">
            <el-option label="服装鞋包" value="clothing" />
            <el-option label="数码家电" value="electronics" />
            <el-option label="食品生鲜" value="food" />
            <el-option label="美妆个护" value="beauty" />
            <el-option label="家居日用" value="home" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="购物优先级">
          <el-slider
            v-model="form.priority"
            :min="1"
            :max="5"
            :marks="priorityMarks"
            show-stops
          />
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <div v-if="isValid" class="result-section">
        <h4>预算分析结果</h4>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-statistic title="可支配收入" :value="availableIncome" suffix="元" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="推荐购物预算" :value="recommendedBudget" suffix="元" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="预算占比" :value="budgetPercentage" suffix="%" />
          </el-col>
        </el-row>
        
        <div class="recommendation">
          <el-alert
            :title="recommendationTitle"
            :type="recommendationType"
            :description="recommendationText"
            show-icon
            :closable="false"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BudgetCalculator',
  data() {
    return {
      form: {
        monthlyIncome: 0,
        fixedExpenses: 0,
        savingGoal: 0,
        category: '',
        priority: 3
      },
      priorityMarks: {
        1: '低',
        3: '中',
        5: '高'
      }
    }
  },
  computed: {
    isValid() {
      return this.form.monthlyIncome > 0 && this.form.fixedExpenses >= 0 && this.form.savingGoal >= 0
    },
    availableIncome() {
      return Math.max(0, this.form.monthlyIncome - this.form.fixedExpenses - this.form.savingGoal)
    },
    recommendedBudget() {
      if (this.availableIncome <= 0) return 0
      
      // 根据优先级调整预算比例
      const basePercentage = 0.3 // 基础30%
      const priorityFactor = this.form.priority / 5
      const adjustedPercentage = basePercentage * priorityFactor
      
      return Math.round(this.availableIncome * adjustedPercentage)
    },
    budgetPercentage() {
      if (this.availableIncome <= 0) return 0
      return Math.round((this.recommendedBudget / this.availableIncome) * 100)
    },
    recommendationType() {
      if (this.budgetPercentage > 50) return 'warning'
      if (this.budgetPercentage < 20) return 'info'
      return 'success'
    },
    recommendationTitle() {
      if (this.budgetPercentage > 50) return '预算过高'
      if (this.budgetPercentage < 20) return '预算合理'
      return '预算适中'
    },
    recommendationText() {
      if (this.budgetPercentage > 50) {
        return '建议降低购物预算，避免影响其他必要支出和储蓄目标'
      } else if (this.budgetPercentage < 20) {
        return '预算分配合理，可以适当增加购物预算或提高储蓄'
      } else {
        return '预算分配适中，既能满足购物需求，又不会影响财务健康'
      }
    }
  },
  methods: {
    async saveCalculation() {
      try {
        const calculationData = {
          ...this.form,
          availableIncome: this.availableIncome,
          recommendedBudget: this.recommendedBudget,
          budgetPercentage: this.budgetPercentage,
          timestamp: new Date().toISOString()
        }
        
        // 调用后端API计算预算
        const response = await this.$api.calculateBudget(this.form)
        
        if (response.success) {
          this.$message.success('计算结果已保存')
          
          // 可以在这里处理服务器返回的数据
          console.log('服务器返回数据:', response.data)
        } else {
          this.$message.error('保存失败：' + response.message)
        }
      } catch (error) {
        console.error('API调用错误:', error)
        this.$message.error('保存失败：' + (error.message || '网络错误'))
      }
    }
  }
}
</script>

<style scoped>
.budget-calculator {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  margin-left: 10px;
  color: #666;
}

.result-section {
  margin-top: 20px;
}

.recommendation {
  margin-top: 20px;
}

.el-statistic {
  text-align: center;
}
</style>