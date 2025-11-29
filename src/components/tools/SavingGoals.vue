<template>
  <div class="saving-goals">
    <el-card header="省钱目标设定">
      <div class="goals-container">
        <!-- 目标设定区域 -->
        <div class="goal-setting">
          <el-form :model="goalForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="目标名称">
                  <el-input v-model="goalForm.name" placeholder="例如：购买新手机" />
                </el-form-item>
                
                <el-form-item label="目标金额">
                  <el-input-number
                    v-model="goalForm.targetAmount"
                    :min="1"
                    :step="100"
                    controls-position="right"
                    placeholder="目标金额"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
                
                <el-form-item label="目标日期">
                  <el-date-picker
                    v-model="goalForm.targetDate"
                    type="date"
                    placeholder="选择目标完成日期"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="当前金额">
                  <el-input-number
                    v-model="goalForm.currentAmount"
                    :min="0"
                    :step="10"
                    controls-position="right"
                    placeholder="当前已存金额"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
                
                <el-form-item label="每月储蓄">
                  <el-input-number
                    v-model="goalForm.monthlySaving"
                    :min="1"
                    :step="100"
                    controls-position="right"
                    placeholder="每月储蓄金额"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
                
                <el-form-item label="优先级">
                  <el-rate
                    v-model="goalForm.priority"
                    :max="5"
                    show-text
                    :texts="['低', '较低', '中', '较高', '高']"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="目标描述">
              <el-input
                v-model="goalForm.description"
                type="textarea"
                :rows="3"
                placeholder="详细描述您的省钱目标"
              />
            </el-form-item>
          </el-form>
          
          <div class="goal-actions" style="text-align: center; margin-top: 20px;">
            <el-button @click="calculateGoal" type="primary" size="large">
              计算目标进度
            </el-button>
            <el-button @click="saveGoal" type="success" size="large">
              保存目标
            </el-button>
            <el-button @click="resetForm" size="large">
              重置
            </el-button>
          </div>
        </div>
        
        <!-- 目标进度展示 -->
        <div v-if="goalProgress" class="progress-section">
          <el-divider>目标进度</el-divider>
          
          <div class="progress-overview">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-statistic
                  title="目标完成度"
                  :value="goalProgress.completionRate"
                  suffix="%"
                  value-style="color: #67c23a"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="剩余金额"
                  :value="goalProgress.remainingAmount"
                  suffix="元"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="预计完成时间"
                  :value="goalProgress.estimatedCompletionDate"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="每月需存"
                  :value="goalProgress.requiredMonthlySaving"
                  suffix="元"
                />
              </el-col>
            </el-row>
          </div>
          
          <!-- 进度条 -->
          <div class="progress-bar-container" style="margin: 30px 0;">
            <div class="progress-info">
              <span>当前进度：{{ goalProgress.currentAmount }} / {{ goalProgress.targetAmount }} 元</span>
              <span>{{ goalProgress.completionRate }}%</span>
            </div>
            <el-progress
              :percentage="goalProgress.completionRate"
              :status="getProgressStatus(goalProgress.completionRate)"
              :stroke-width="12"
            />
          </div>
          
          <!-- 时间线 -->
          <div class="timeline-section">
            <h4>时间线分析</h4>
            <el-timeline>
              <el-timeline-item
                v-for="milestone in goalProgress.milestones"
                :key="milestone.date"
                :timestamp="milestone.date"
                :type="milestone.type"
              >
                {{ milestone.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
          
          <!-- 储蓄建议 -->
          <div class="suggestions">
            <h4>储蓄建议</h4>
            <el-alert
              v-for="suggestion in goalProgress.suggestions"
              :key="suggestion.id"
              :title="suggestion.title"
              :description="suggestion.description"
              :type="suggestion.type"
              :closable="false"
              style="margin-bottom: 10px"
            />
          </div>
        </div>
        
        <!-- 目标列表 -->
        <div v-if="savedGoals.length > 0" class="goals-list">
          <el-divider>已保存的目标</el-divider>
          
          <el-table :data="savedGoals" style="width: 100%">
            <el-table-column prop="name" label="目标名称" />
            <el-table-column prop="currentAmount" label="当前金额" />
            <el-table-column prop="targetAmount" label="目标金额" />
            <el-table-column label="完成度">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.round((row.currentAmount / row.targetAmount) * 100)"
                  :show-text="false"
                  :stroke-width="6"
                />
                <span>{{ Math.round((row.currentAmount / row.targetAmount) * 100) }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="targetDate" label="目标日期" />
            <el-table-column label="操作">
              <template #default="{ row, $index }">
                <el-button @click="editGoal(row, $index)" type="primary" size="small">
                  编辑
                </el-button>
                <el-button @click="deleteGoal($index)" type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SavingGoals',
  data() {
    return {
      goalForm: {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        monthlySaving: 0,
        targetDate: '',
        priority: 3,
        description: ''
      },
      savedGoals: [],
      goalProgress: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    calculateGoal() {
      if (!this.validateForm()) {
        return
      }
      
      const targetAmount = this.goalForm.targetAmount
      const currentAmount = this.goalForm.currentAmount
      const monthlySaving = this.goalForm.monthlySaving
      const targetDate = new Date(this.goalForm.targetDate)
      
      // 计算进度
      const completionRate = Math.min(100, Math.round((currentAmount / targetAmount) * 100))
      const remainingAmount = Math.max(0, targetAmount - currentAmount)
      
      // 计算预计完成时间
      const monthsNeeded = Math.ceil(remainingAmount / monthlySaving)
      const today = new Date()
      const estimatedCompletionDate = new Date(today.getFullYear(), today.getMonth() + monthsNeeded, today.getDate())
      
      // 计算每月需存金额（按目标日期计算）
      const monthsToTarget = this.getMonthsBetween(today, targetDate)
      const requiredMonthlySaving = monthsToTarget > 0 ? Math.ceil(remainingAmount / monthsToTarget) : remainingAmount
      
      // 生成里程碑
      const milestones = this.generateMilestones(targetAmount, currentAmount, monthlySaving, targetDate)
      
      // 生成建议
      const suggestions = this.generateSuggestions(completionRate, monthlySaving, requiredMonthlySaving)
      
      this.goalProgress = {
        completionRate,
        remainingAmount,
        estimatedCompletionDate: estimatedCompletionDate.toISOString().split('T')[0],
        requiredMonthlySaving,
        currentAmount,
        targetAmount,
        milestones,
        suggestions
      }
      
      this.$message.success('目标进度计算完成！')
    },
    
    validateForm() {
      if (!this.goalForm.name) {
        this.$message.warning('请输入目标名称')
        return false
      }
      
      if (this.goalForm.targetAmount <= 0) {
        this.$message.warning('请输入有效的目标金额')
        return false
      }
      
      if (!this.goalForm.targetDate) {
        this.$message.warning('请选择目标日期')
        return false
      }
      
      if (this.goalForm.currentAmount > this.goalForm.targetAmount) {
        this.$message.warning('当前金额不能超过目标金额')
        return false
      }
      
      return true
    },
    
    getMonthsBetween(date1, date2) {
      const months = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth())
      return Math.max(0, months)
    },
    
    generateMilestones(targetAmount, currentAmount, monthlySaving, targetDate) {
      const milestones = []
      const today = new Date()
      
      // 25%里程碑
      const quarterAmount = targetAmount * 0.25
      if (currentAmount < quarterAmount) {
        const monthsToQuarter = Math.ceil((quarterAmount - currentAmount) / monthlySaving)
        const quarterDate = new Date(today.getFullYear(), today.getMonth() + monthsToQuarter, today.getDate())
        milestones.push({
          date: quarterDate.toISOString().split('T')[0],
          content: '完成25%的目标（' + quarterAmount + '元）',
          type: 'primary'
        })
      }
      
      // 50%里程碑
      const halfAmount = targetAmount * 0.5
      if (currentAmount < halfAmount) {
        const monthsToHalf = Math.ceil((halfAmount - currentAmount) / monthlySaving)
        const halfDate = new Date(today.getFullYear(), today.getMonth() + monthsToHalf, today.getDate())
        milestones.push({
          date: halfDate.toISOString().split('T')[0],
          content: '完成50%的目标（' + halfAmount + '元）',
          type: 'warning'
        })
      }
      
      // 75%里程碑
      const threeQuarterAmount = targetAmount * 0.75
      if (currentAmount < threeQuarterAmount) {
        const monthsToThreeQuarter = Math.ceil((threeQuarterAmount - currentAmount) / monthlySaving)
        const threeQuarterDate = new Date(today.getFullYear(), today.getMonth() + monthsToThreeQuarter, today.getDate())
        milestones.push({
          date: threeQuarterDate.toISOString().split('T')[0],
          content: '完成75%的目标（' + threeQuarterAmount + '元）',
          type: 'info'
        })
      }
      
      // 100%里程碑
      milestones.push({
        date: targetDate.toISOString().split('T')[0],
        content: '完成100%的目标（' + targetAmount + '元）',
        type: 'success'
      })
      
      return milestones
    },
    
    generateSuggestions(completionRate, monthlySaving, requiredMonthlySaving) {
      const suggestions = []
      
      if (completionRate >= 100) {
        suggestions.push({
          id: 'completed',
          title: '目标已完成！',
          description: '恭喜您成功达成省钱目标！',
          type: 'success'
        })
      } else if (monthlySaving < requiredMonthlySaving) {
        suggestions.push({
          id: 'increase-saving',
          title: '建议增加每月储蓄',
          description: `当前每月储蓄${monthlySaving}元，建议增加到${requiredMonthlySaving}元以按时达成目标`,
          type: 'warning'
        })
      } else {
        suggestions.push({
          id: 'on-track',
          title: '进度良好',
          description: '按照当前储蓄计划，您将按时达成目标',
          type: 'success'
        })
      }
      
      if (completionRate < 25) {
        suggestions.push({
          id: 'start-early',
          title: '建议尽早开始',
          description: '目标刚刚开始，建议坚持每月储蓄习惯',
          type: 'info'
        })
      }
      
      return suggestions
    },
    
    getProgressStatus(percentage) {
      if (percentage >= 100) return 'success'
      if (percentage >= 75) return 'warning'
      if (percentage >= 50) return ''
      return 'exception'
    },
    
    saveGoal() {
      if (!this.validateForm()) {
        return
      }
      
      const goal = {
        id: Date.now(),
        ...this.goalForm,
        targetDate: new Date(this.goalForm.targetDate).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }
      
      this.savedGoals.push(goal)
      this.$message.success('目标保存成功！')
      this.resetForm()
    },
    
    editGoal(goal, index) {
      this.goalForm = { ...goal }
      this.goalForm.targetDate = goal.targetDate
      this.savedGoals.splice(index, 1)
      this.$message.info('目标已加载到编辑区')
    },
    
    deleteGoal(index) {
      this.savedGoals.splice(index, 1)
      this.$message.success('目标删除成功')
    },
    
    resetForm() {
      this.goalForm = {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        monthlySaving: 0,
        targetDate: '',
        priority: 3,
        description: ''
      }
      this.goalProgress = null
    }
  }
}
</script>

<style scoped>
.saving-goals {
  max-width: 1200px;
  margin: 0 auto;
}

.goals-container {
  padding: 20px;
}

.goal-setting {
  margin-bottom: 30px;
}

.progress-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.progress-overview {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.timeline-section,
.suggestions {
  margin-top: 30px;
}

.goals-list {
  margin-top: 30px;
}

.el-statistic {
  text-align: center;
}
</style>