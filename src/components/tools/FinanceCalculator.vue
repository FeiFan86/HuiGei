<template>
  <div class="finance-calculator">
    <el-card header="理财计算器">
      <div class="calculator-container">
        <!-- 计算器选项 -->
        <div class="calculator-options">
          <el-radio-group v-model="calculatorType" @change="resetResults">
            <el-radio-button label="compound">复利计算器</el-radio-button>
            <el-radio-button label="annuity">年金计算器</el-radio-button>
            <el-radio-button label="investment">投资回报计算</el-radio-button>
            <el-radio-button label="saving">储蓄计算器</el-radio-button>
          </el-radio-group>
        </div>
        
        <!-- 输入区域 -->
        <div class="input-section">
          <!-- 复利计算器 -->
          <div v-if="calculatorType === 'compound'" class="compound-calculator">
            <el-form :model="compoundForm" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="本金金额">
                    <el-input-number
                      v-model="compoundForm.principal"
                      :min="0"
                      :step="1000"
                      controls-position="right"
                      placeholder="初始投资金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="年化收益率">
                    <el-input-number
                      v-model="compoundForm.rate"
                      :min="0.1"
                      :max="100"
                      :step="0.1"
                      controls-position="right"
                      placeholder="年化收益率"
                    >
                      <template #append>%</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="投资年限">
                    <el-input-number
                      v-model="compoundForm.years"
                      :min="1"
                      :max="100"
                      :step="1"
                      controls-position="right"
                      placeholder="投资年限"
                    >
                      <template #append>年</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="复利周期">
                    <el-radio-group v-model="compoundForm.compoundFrequency">
                      <el-radio label="yearly">年复利</el-radio>
                      <el-radio label="quarterly">季度复利</el-radio>
                      <el-radio label="monthly">月复利</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 年金计算器 -->
          <div v-if="calculatorType === 'annuity'" class="annuity-calculator">
            <el-form :model="annuityForm" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="每期投资额">
                    <el-input-number
                      v-model="annuityForm.payment"
                      :min="0"
                      :step="100"
                      controls-position="right"
                      placeholder="每期投资金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="年化收益率">
                    <el-input-number
                      v-model="annuityForm.rate"
                      :min="0.1"
                      :max="100"
                      :step="0.1"
                      controls-position="right"
                      placeholder="年化收益率"
                    >
                      <template #append>%</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="投资期数">
                    <el-input-number
                      v-model="annuityForm.periods"
                      :min="1"
                      :max="600"
                      :step="1"
                      controls-position="right"
                      placeholder="投资期数"
                    >
                      <template #append>期</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="投资频率">
                    <el-radio-group v-model="annuityForm.frequency">
                      <el-radio label="monthly">每月</el-radio>
                      <el-radio label="quarterly">每季度</el-radio>
                      <el-radio label="yearly">每年</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 投资回报计算 -->
          <div v-if="calculatorType === 'investment'" class="investment-calculator">
            <el-form :model="investmentForm" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="初始投资">
                    <el-input-number
                      v-model="investmentForm.initialInvestment"
                      :min="0"
                      :step="1000"
                      controls-position="right"
                      placeholder="初始投资金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="年化收益率">
                    <el-input-number
                      v-model="investmentForm.rate"
                      :min="-100"
                      :max="100"
                      :step="0.1"
                      controls-position="right"
                      placeholder="年化收益率"
                    >
                      <template #append>%</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="投资年限">
                    <el-input-number
                      v-model="investmentForm.years"
                      :min="1"
                      :max="100"
                      :step="1"
                      controls-position="right"
                      placeholder="投资年限"
                    >
                      <template #append>年</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="风险评估">
                    <el-rate
                      v-model="investmentForm.riskLevel"
                      :max="5"
                      show-text
                      :texts="['保守', '稳健', '平衡', '成长', '积极']"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 储蓄计算器 -->
          <div v-if="calculatorType === 'saving'" class="saving-calculator">
            <el-form :model="savingForm" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="目标金额">
                    <el-input-number
                      v-model="savingForm.targetAmount"
                      :min="0"
                      :step="1000"
                      controls-position="right"
                      placeholder="目标金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="年化收益率">
                    <el-input-number
                      v-model="savingForm.rate"
                      :min="0.1"
                      :max="100"
                      :step="0.1"
                      controls-position="right"
                      placeholder="年化收益率"
                    >
                      <template #append>%</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="每月储蓄">
                    <el-input-number
                      v-model="savingForm.monthlySaving"
                      :min="0"
                      :step="100"
                      controls-position="right"
                      placeholder="每月储蓄金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                  
                  <el-form-item label="当前金额">
                    <el-input-number
                      v-model="savingForm.currentAmount"
                      :min="0"
                      :step="100"
                      controls-position="right"
                      placeholder="当前金额"
                    >
                      <template #append>元</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        
        <!-- 计算结果 -->
        <div v-if="calculationResult" class="result-section">
          <el-divider>计算结果</el-divider>
          
          <div class="result-overview">
            <el-row :gutter="20">
              <el-col :span="6" v-for="stat in calculationResult.stats" :key="stat.title">
                <el-statistic
                  :title="stat.title"
                  :value="stat.value"
                  :suffix="stat.suffix"
                  :value-style="stat.style"
                />
              </el-col>
            </el-row>
          </div>
          
          <!-- 详细分析 -->
          <div class="detailed-analysis" v-if="calculationResult.details">
            <h4>详细分析</h4>
            <el-table :data="calculationResult.details" style="width: 100%" border>
              <el-table-column
                v-for="column in calculationResult.columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
              />
            </el-table>
          </div>
          
          <!-- 投资建议 -->
          <div class="investment-suggestions" v-if="calculationResult.suggestions">
            <h4>投资建议</h4>
            <el-alert
              v-for="suggestion in calculationResult.suggestions"
              :key="suggestion.id"
              :title="suggestion.title"
              :description="suggestion.description"
              :type="suggestion.type"
              :closable="false"
              style="margin-bottom: 10px"
            />
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons" style="text-align: center; margin-top: 30px;">
          <el-button @click="calculate" type="primary" size="large">
            开始计算
          </el-button>
          <el-button @click="saveCalculation" type="success" size="large">
            保存结果
          </el-button>
          <el-button @click="resetForm" size="large">
            重置
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FinanceCalculator',
  data() {
    return {
      calculatorType: 'compound',
      
      // 复利计算器表单
      compoundForm: {
        principal: 10000,
        rate: 5,
        years: 10,
        compoundFrequency: 'yearly'
      },
      
      // 年金计算器表单
      annuityForm: {
        payment: 1000,
        rate: 5,
        periods: 120,
        frequency: 'monthly'
      },
      
      // 投资回报计算表单
      investmentForm: {
        initialInvestment: 10000,
        rate: 8,
        years: 5,
        riskLevel: 3
      },
      
      // 储蓄计算器表单
      savingForm: {
        targetAmount: 100000,
        rate: 3,
        monthlySaving: 2000,
        currentAmount: 0
      },
      
      calculationResult: null
    }
  },
  methods: {
    calculate() {
      switch (this.calculatorType) {
        case 'compound':
          this.calculateCompound()
          break
        case 'annuity':
          this.calculateAnnuity()
          break
        case 'investment':
          this.calculateInvestment()
          break
        case 'saving':
          this.calculateSaving()
          break
      }
    },
    
    calculateCompound() {
      const { principal, rate, years, compoundFrequency } = this.compoundForm
      
      // 计算复利频率因子
      let n = 1
      switch (compoundFrequency) {
        case 'quarterly': n = 4; break
        case 'monthly': n = 12; break
      }
      
      // 复利公式: A = P(1 + r/n)^(nt)
      const r = rate / 100
      const futureValue = principal * Math.pow(1 + r/n, n * years)
      const totalInterest = futureValue - principal
      
      // 生成年化数据
      const details = []
      for (let i = 1; i <= years; i++) {
        const yearValue = principal * Math.pow(1 + r/n, n * i)
        details.push({
          year: i,
          value: Math.round(yearValue),
          interest: Math.round(yearValue - principal)
        })
      }
      
      this.calculationResult = {
        stats: [
          { title: '最终金额', value: Math.round(futureValue), suffix: '元', style: 'color: #67c23a' },
          { title: '总收益', value: Math.round(totalInterest), suffix: '元', style: 'color: #409EFF' },
          { title: '本金', value: principal, suffix: '元', style: 'color: #909399' },
          { title: '年化收益率', value: rate, suffix: '%', style: 'color: #E6A23C' }
        ],
        details: details,
        columns: [
          { prop: 'year', label: '年份', width: '80' },
          { prop: 'value', label: '账户价值', width: '120' },
          { prop: 'interest', label: '累计收益', width: '120' }
        ],
        suggestions: this.generateCompoundSuggestions(rate, years)
      }
    },
    
    calculateAnnuity() {
      const { payment, rate, periods, frequency } = this.annuityForm
      
      // 计算期数对应的年化利率
      let n = 1
      let effectiveRate = rate / 100
      
      switch (frequency) {
        case 'monthly':
          n = 12
          effectiveRate = Math.pow(1 + rate/100, 1/12) - 1
          break
        case 'quarterly':
          n = 4
          effectiveRate = Math.pow(1 + rate/100, 1/4) - 1
          break
      }
      
      // 年金终值公式: FV = P * [(1+r)^n - 1] / r
      const futureValue = payment * (Math.pow(1 + effectiveRate, periods) - 1) / effectiveRate
      const totalInvestment = payment * periods
      const totalInterest = futureValue - totalInvestment
      
      this.calculationResult = {
        stats: [
          { title: '最终金额', value: Math.round(futureValue), suffix: '元', style: 'color: #67c23a' },
          { title: '总收益', value: Math.round(totalInterest), suffix: '元', style: 'color: #409EFF' },
          { title: '总投入', value: totalInvestment, suffix: '元', style: 'color: #909399' },
          { title: '投资期数', value: periods, suffix: '期', style: 'color: #E6A23C' }
        ],
        suggestions: this.generateAnnuitySuggestions(rate, periods)
      }
    },
    
    calculateInvestment() {
      const { initialInvestment, rate, years, riskLevel } = this.investmentForm
      
      const r = rate / 100
      const futureValue = initialInvestment * Math.pow(1 + r, years)
      const totalReturn = futureValue - initialInvestment
      const annualizedReturn = (Math.pow(futureValue / initialInvestment, 1/years) - 1) * 100
      
      this.calculationResult = {
        stats: [
          { title: '最终金额', value: Math.round(futureValue), suffix: '元', style: 'color: #67c23a' },
          { title: '总回报', value: Math.round(totalReturn), suffix: '元', style: 'color: #409EFF' },
          { title: '年化回报率', value: annualizedReturn.toFixed(2), suffix: '%', style: 'color: #E6A23C' },
          { title: '风险评估', value: riskLevel, suffix: '级', style: 'color: #F56C6C' }
        ],
        suggestions: this.generateInvestmentSuggestions(rate, riskLevel)
      }
    },
    
    calculateSaving() {
      const { targetAmount, rate, monthlySaving, currentAmount } = this.savingForm
      
      const r = rate / 100 / 12 // 月利率
      const monthsNeeded = Math.ceil(
        Math.log((targetAmount * r / monthlySaving) + 1) / Math.log(1 + r)
      )
      const yearsNeeded = Math.ceil(monthsNeeded / 12)
      
      this.calculationResult = {
        stats: [
          { title: '目标金额', value: targetAmount, suffix: '元', style: 'color: #67c23a' },
          { title: '需要时间', value: yearsNeeded, suffix: '年', style: 'color: #409EFF' },
          { title: '每月储蓄', value: monthlySaving, suffix: '元', style: 'color: #E6A23C' },
          { title: '当前金额', value: currentAmount, suffix: '元', style: 'color: #909399' }
        ],
        suggestions: this.generateSavingSuggestions(monthsNeeded, monthlySaving)
      }
    },
    
    generateCompoundSuggestions(rate, years) {
      const suggestions = []
      
      if (rate > 10) {
        suggestions.push({
          id: 'high-rate',
          title: '高收益投资',
          description: '当前收益率较高，建议关注投资风险，适当分散投资',
          type: 'warning'
        })
      }
      
      if (years > 20) {
        suggestions.push({
          id: 'long-term',
          title: '长期投资',
          description: '长期投资效果显著，建议坚持投资计划',
          type: 'success'
        })
      }
      
      return suggestions
    },
    
    generateAnnuitySuggestions(rate, periods) {
      const suggestions = []
      
      if (periods > 240) {
        suggestions.push({
          id: 'long-term-annuity',
          title: '长期定投',
          description: '长期定投可以有效摊平成本，建议坚持投资',
          type: 'success'
        })
      }
      
      return suggestions
    },
    
    generateInvestmentSuggestions(rate, riskLevel) {
      const suggestions = []
      
      if (rate < 0) {
        suggestions.push({
          id: 'negative-return',
          title: '负收益风险',
          description: '当前预计收益为负，建议重新评估投资策略',
          type: 'error'
        })
      }
      
      if (riskLevel >= 4) {
        suggestions.push({
          id: 'high-risk',
          title: '高风险投资',
          description: '当前投资风险较高，建议控制投资比例',
          type: 'warning'
        })
      }
      
      return suggestions
    },
    
    generateSavingSuggestions(monthsNeeded, monthlySaving) {
      const suggestions = []
      
      if (monthsNeeded > 120) {
        suggestions.push({
          id: 'long-term-saving',
          title: '长期储蓄计划',
          description: '储蓄时间较长，建议考虑增加每月储蓄金额或寻找更高收益的投资方式',
          type: 'info'
        })
      }
      
      if (monthlySaving < 500) {
        suggestions.push({
          id: 'low-saving',
          title: '储蓄金额较低',
          description: '当前每月储蓄金额较低，建议适当增加储蓄额度',
          type: 'warning'
        })
      }
      
      return suggestions
    },
    
    saveCalculation() {
      if (!this.calculationResult) {
        this.$message.warning('请先进行计算')
        return
      }
      
      this.$message.success('计算结果已保存')
    },
    
    resetForm() {
      this.calculationResult = null
    },
    
    resetResults() {
      this.calculationResult = null
    }
  }
}
</script>

<style scoped>
.finance-calculator {
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-container {
  padding: 20px;
}

.calculator-options {
  text-align: center;
  margin-bottom: 30px;
}

.input-section {
  margin-bottom: 30px;
}

.result-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.result-overview {
  margin-bottom: 30px;
}

.detailed-analysis,
.investment-suggestions {
  margin-top: 30px;
}

.el-statistic {
  text-align: center;
}

.action-buttons {
  text-align: center;
}
</style>