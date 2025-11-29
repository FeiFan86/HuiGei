<template>
  <div class="spending-analysis">
    <el-card header="消费习惯分析">
      <div class="analysis-container">
        <!-- 数据输入区域 -->
        <div class="input-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form :model="form" label-width="100px">
                <el-form-item label="分析周期">
                  <el-radio-group v-model="form.period">
                    <el-radio label="week">本周</el-radio>
                    <el-radio label="month">本月</el-radio>
                    <el-radio label="quarter">本季度</el-radio>
                    <el-radio label="year">本年</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="消费数据">
                  <el-button @click="showImportDialog = true" type="primary">
                    导入消费记录
                  </el-button>
                  <el-button @click="addManualRecord" type="success">
                    手动添加
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="分析维度">
                <el-checkbox-group v-model="form.dimensions">
                  <el-checkbox label="category">消费类别</el-checkbox>
                  <el-checkbox label="time">时间分布</el-checkbox>
                  <el-checkbox label="trend">趋势分析</el-checkbox>
                  <el-checkbox label="comparison">同比环比</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 分析结果展示 -->
        <div v-if="analysisResult" class="result-section">
          <el-divider>分析结果</el-divider>
          
          <!-- 统计概览 -->
          <div class="overview">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-statistic
                  title="总消费金额"
                  :value="analysisResult.totalAmount"
                  suffix="元"
                  value-style="color: #f56c6c"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="平均每日消费"
                  :value="analysisResult.dailyAverage"
                  suffix="元"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="消费天数"
                  :value="analysisResult.spendingDays"
                />
              </el-col>
              <el-col :span="6">
                <el-statistic
                  title="最大单笔消费"
                  :value="analysisResult.maxSingleAmount"
                  suffix="元"
                />
              </el-col>
            </el-row>
          </div>
          
          <!-- 消费类别分析 -->
          <div v-if="form.dimensions.includes('category')" class="category-analysis">
            <h4>消费类别分布</h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <div ref="categoryChart" style="height: 300px;"></div>
              </el-col>
              <el-col :span="12">
                <el-table :data="analysisResult.categoryDistribution" style="width: 100%">
                  <el-table-column prop="category" label="类别" />
                  <el-table-column prop="amount" label="金额" />
                  <el-table-column prop="percentage" label="占比" />
                  <el-table-column label="建议">
                    <template #default="{ row }">
                      <el-tag :type="getAdviceType(row.percentage)">
                        {{ getCategoryAdvice(row.percentage) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          
          <!-- 时间分布分析 -->
          <div v-if="form.dimensions.includes('time')" class="time-analysis">
            <h4>时间分布分析</h4>
            <div ref="timeChart" style="height: 300px;"></div>
          </div>
          
          <!-- 省钱建议 -->
          <div class="suggestions">
            <h4>省钱建议</h4>
            <el-alert
              v-for="suggestion in analysisResult.suggestions"
              :key="suggestion.id"
              :title="suggestion.title"
              :description="suggestion.description"
              :type="suggestion.type"
              :closable="false"
              style="margin-bottom: 10px"
            />
          </div>
        </div>
      </div>
      
      <div class="action-buttons" style="margin-top: 20px">
        <el-button @click="analyze" type="primary" size="large">
          开始分析
        </el-button>
        <el-button @click="exportReport" type="success" size="large">
          导出报告
        </el-button>
        <el-button @click="reset" size="large">
          重置
        </el-button>
      </div>
    </el-card>
    
    <!-- 导入消费记录对话框 -->
    <el-dialog v-model="showImportDialog" title="导入消费记录" width="500px">
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        accept=".csv,.xlsx,.json"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 CSV、Excel、JSON 格式文件
          </div>
        </template>
      </el-upload>
    </el-dialog>
    
    <!-- 手动添加记录对话框 -->
    <el-dialog v-model="showManualDialog" title="手动添加消费记录" width="400px">
      <el-form :model="newRecord" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="newRecord.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number
            v-model="newRecord.amount"
            :min="0"
            placeholder="消费金额"
          />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="newRecord.category" placeholder="选择类别">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newRecord.description"
            placeholder="消费描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showManualDialog = false">取消</el-button>
        <el-button type="primary" @click="addRecord">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { UploadFilled } from '@element-plus/icons-vue'

export default {
  name: 'SpendingAnalysis',
  components: {
    UploadFilled
  },
  data() {
    return {
      form: {
        period: 'month',
        dimensions: ['category', 'time', 'trend', 'comparison']
      },
      spendingData: [
        { date: '2024-01-01', amount: 150, category: '餐饮', description: '午餐' },
        { date: '2024-01-02', amount: 80, category: '交通', description: '地铁卡充值' },
        { date: '2024-01-03', amount: 200, category: '购物', description: '衣服' },
        { date: '2024-01-04', amount: 50, category: '娱乐', description: '电影票' },
        { date: '2024-01-05', amount: 300, category: '餐饮', description: '聚餐' },
        { date: '2024-01-06', amount: 120, category: '购物', description: '日用品' },
        { date: '2024-01-07', amount: 60, category: '交通', description: '打车' }
      ],
      newRecord: {
        date: '',
        amount: 0,
        category: '',
        description: ''
      },
      categories: ['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '其他'],
      showImportDialog: false,
      showManualDialog: false,
      analysisResult: null
    }
  },
  methods: {
    analyze() {
      if (this.spendingData.length === 0) {
        this.$message.warning('请先添加消费数据')
        return
      }
      
      // 分析算法实现
      const totalAmount = this.spendingData.reduce((sum, record) => sum + record.amount, 0)
      const spendingDays = new Set(this.spendingData.map(r => r.date)).size
      const dailyAverage = Math.round(totalAmount / spendingDays)
      const maxSingleAmount = Math.max(...this.spendingData.map(r => r.amount))
      
      // 类别分析
      const categoryMap = {}
      this.spendingData.forEach(record => {
        if (!categoryMap[record.category]) {
          categoryMap[record.category] = 0
        }
        categoryMap[record.category] += record.amount
      })
      
      const categoryDistribution = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalAmount) * 100)
      })).sort((a, b) => b.amount - a.amount)
      
      // 生成省钱建议
      const suggestions = this.generateSuggestions(categoryDistribution, totalAmount)
      
      this.analysisResult = {
        totalAmount,
        spendingDays,
        dailyAverage,
        maxSingleAmount,
        categoryDistribution,
        suggestions
      }
      
      this.$message.success('分析完成！')
    },
    
    generateSuggestions(categoryDistribution, totalAmount) {
      const suggestions = []
      
      // 分析各类别消费情况
      categoryDistribution.forEach(item => {
        if (item.percentage > 40) {
          suggestions.push({
            id: `category-${item.category}`,
            title: `注意：${item.category}支出过高`,
            description: `您在此类别的支出占比达到${item.percentage}%，建议适当控制`,
            type: 'warning'
          })
        } else if (item.percentage < 10 && ['餐饮', '交通'].includes(item.category)) {
          suggestions.push({
            id: `category-low-${item.category}`,
            title: `${item.category}支出合理`,
            description: '当前支出比例适中，继续保持良好消费习惯',
            type: 'success'
          })
        }
      })
      
      // 总体建议
      if (totalAmount > 5000) {
        suggestions.push({
          id: 'total-high',
          title: '总消费金额较高',
          description: '本月总消费超过5000元，建议关注非必要支出',
          type: 'warning'
        })
      }
      
      if (suggestions.length === 0) {
        suggestions.push({
          id: 'good',
          title: '消费习惯良好',
          description: '您的消费习惯比较合理，继续保持！',
          type: 'success'
        })
      }
      
      return suggestions
    },
    
    getAdviceType(percentage) {
      if (percentage > 40) return 'warning'
      if (percentage > 20) return 'info'
      return 'success'
    },
    
    getCategoryAdvice(percentage) {
      if (percentage > 40) return '支出过高'
      if (percentage > 20) return '支出适中'
      return '支出合理'
    },
    
    beforeUpload(file) {
      // 模拟文件处理
      this.$message.success('文件上传成功，正在解析数据...')
      setTimeout(() => {
        this.showImportDialog = false
        this.$message.success('数据导入完成')
      }, 2000)
      return false // 阻止默认上传
    },
    
    handleUploadSuccess() {
      // 处理上传成功
    },
    
    addManualRecord() {
      this.showManualDialog = true
    },
    
    addRecord() {
      if (!this.newRecord.date || this.newRecord.amount <= 0 || !this.newRecord.category) {
        this.$message.warning('请填写完整的消费记录信息')
        return
      }
      
      const record = {
        ...this.newRecord,
        date: new Date(this.newRecord.date).toISOString().split('T')[0],
        id: Date.now()
      }
      
      this.spendingData.push(record)
      this.showManualDialog = false
      this.resetNewRecord()
      this.$message.success('消费记录添加成功')
    },
    
    resetNewRecord() {
      this.newRecord = {
        date: '',
        amount: 0,
        category: '',
        description: ''
      }
    },
    
    exportReport() {
      if (!this.analysisResult) {
        this.$message.warning('请先进行消费分析')
        return
      }
      
      // 模拟导出功能
      this.$message.success('分析报告导出成功')
    },
    
    reset() {
      this.spendingData = []
      this.analysisResult = null
      this.$message.info('已重置')
    }
  }
}
</script>

<style scoped>
.spending-analysis {
  max-width: 1200px;
  margin: 0 auto;
}

.analysis-container {
  padding: 20px;
}

.input-section {
  margin-bottom: 30px;
}

.result-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.overview {
  margin-bottom: 30px;
}

.category-analysis,
.time-analysis {
  margin-bottom: 30px;
}

.suggestions {
  margin-top: 30px;
}

.action-buttons {
  text-align: center;
}

.el-statistic {
  text-align: center;
}

.upload-demo {
  text-align: center;
}
</style>