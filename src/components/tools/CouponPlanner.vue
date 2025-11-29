<template>
  <div class="coupon-planner">
    <el-card header="优惠券使用规划">
      <div class="planner-container">
        <!-- 输入区域 -->
        <div class="input-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form :model="form" label-width="120px">
                <el-form-item label="商品总价">
                  <el-input-number
                    v-model="form.totalPrice"
                    :min="0"
                    :step="10"
                    controls-position="right"
                    placeholder="请输入商品总价"
                  >
                    <template #append>元</template>
                  </el-input-number>
                </el-form-item>
                
                <el-form-item label="可用优惠券">
                  <el-table :data="form.availableCoupons" style="width: 100%">
                    <el-table-column prop="name" label="优惠券名称" width="120" />
                    <el-table-column prop="type" label="类型" width="80">
                      <template #default="{ row }">
                        <el-tag :type="row.type === '满减' ? 'success' : 'primary'">
                          {{ row.type }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="condition" label="使用条件" width="100">
                      <template #default="{ row }">
                        {{ row.condition }}元
                      </template>
                    </el-table-column>
                    <el-table-column prop="discount" label="优惠金额" width="100">
                      <template #default="{ row }">
                        {{ row.discount }}元
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                      <template #default="{ $index }">
                        <el-button
                          type="danger"
                          size="small"
                          @click="removeCoupon($index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  
                  <div style="margin-top: 10px">
                    <el-button @click="addCouponDialog = true" type="primary">
                      添加优惠券
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="规划策略">
                <el-radio-group v-model="form.strategy">
                  <el-radio label="maxSave">最大节省</el-radio>
                  <el-radio label="minPay">最少支付</el-radio>
                  <el-radio label="custom">自定义组合</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <div v-if="form.strategy === 'custom'" class="custom-strategy">
                <el-checkbox-group v-model="form.selectedCoupons">
                  <el-checkbox
                    v-for="coupon in form.availableCoupons"
                    :key="coupon.id"
                    :label="coupon.id"
                  >
                    {{ coupon.name }} ({{ coupon.discount }}元)
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 计算结果 -->
        <div v-if="result.optimizedPlan" class="result-section">
          <el-divider>规划结果</el-divider>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-statistic
                title="原价"
                :value="form.totalPrice"
                suffix="元"
              />
            </el-col>
            <el-col :span="8">
              <el-statistic
                title="最终支付"
                :value="result.finalPrice"
                suffix="元"
                value-style="color: #f56c6c"
              />
            </el-col>
            <el-col :span="8">
              <el-statistic
                title="节省金额"
                :value="result.totalSave"
                suffix="元"
                value-style="color: #67c23a"
              />
            </el-col>
          </el-row>
          
          <div class="plan-details" style="margin-top: 20px">
            <h4>推荐使用方案：</h4>
            <el-table :data="result.optimizedPlan" style="width: 100%">
              <el-table-column prop="name" label="优惠券" />
              <el-table-column prop="discount" label="节省金额" />
              <el-table-column prop="condition" label="使用条件" />
              <el-table-column label="节省比例">
                <template #default="{ row }">
                  {{ (row.discount / form.totalPrice * 100).toFixed(1) }}%
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      
      <div class="action-buttons" style="margin-top: 20px">
        <el-button @click="calculate" type="primary" size="large">
          开始规划
        </el-button>
        <el-button @click="savePlan" type="success" size="large">
          保存方案
        </el-button>
        <el-button @click="reset" size="large">
          重置
        </el-button>
      </div>
    </el-card>
    
    <!-- 添加优惠券对话框 -->
    <el-dialog v-model="addCouponDialog" title="添加优惠券" width="400px">
      <el-form :model="newCoupon" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="newCoupon.name" placeholder="优惠券名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="newCoupon.type">
            <el-radio label="满减">满减券</el-radio>
            <el-radio label="折扣">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用条件">
          <el-input-number
            v-model="newCoupon.condition"
            :min="0"
            placeholder="满多少元可用"
          />
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input-number
            v-model="newCoupon.discount"
            :min="0"
            placeholder="优惠金额"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="addCouponDialog = false">取消</el-button>
        <el-button type="primary" @click="addCoupon">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CouponPlanner',
  data() {
    return {
      form: {
        totalPrice: 0,
        availableCoupons: [
          {
            id: 1,
            name: '满100减10',
            type: '满减',
            condition: 100,
            discount: 10
          },
          {
            id: 2,
            name: '满200减30',
            type: '满减',
            condition: 200,
            discount: 30
          },
          {
            id: 3,
            name: '9折优惠券',
            type: '折扣',
            condition: 0,
            discount: 0
          }
        ],
        strategy: 'maxSave',
        selectedCoupons: []
      },
      newCoupon: {
        name: '',
        type: '满减',
        condition: 0,
        discount: 0
      },
      addCouponDialog: false,
      result: {
        optimizedPlan: null,
        finalPrice: 0,
        totalSave: 0
      }
    }
  },
  methods: {
    calculate() {
      if (this.form.totalPrice <= 0) {
        this.$message.warning('请输入有效的商品总价')
        return
      }
      
      // 优化算法实现
      const availableCoupons = this.form.availableCoupons.filter(coupon => 
        this.form.totalPrice >= coupon.condition
      )
      
      if (availableCoupons.length === 0) {
        this.$message.warning('当前没有可用的优惠券')
        return
      }
      
      // 根据策略选择优惠券组合
      let selectedCoupons = []
      
      if (this.form.strategy === 'maxSave') {
        // 最大节省策略：选择节省金额最大的优惠券
        selectedCoupons = [availableCoupons.reduce((max, coupon) => 
          coupon.discount > max.discount ? coupon : max
        )]
      } else if (this.form.strategy === 'minPay') {
        // 最少支付策略：选择能使用的最优惠组合
        selectedCoupons = this.findOptimalCombination(availableCoupons, this.form.totalPrice)
      } else {
        // 自定义组合
        selectedCoupons = this.form.availableCoupons.filter(coupon => 
          this.form.selectedCoupons.includes(coupon.id) && 
          this.form.totalPrice >= coupon.condition
        )
      }
      
      const totalSave = selectedCoupons.reduce((sum, coupon) => sum + coupon.discount, 0)
      const finalPrice = Math.max(0, this.form.totalPrice - totalSave)
      
      this.result = {
        optimizedPlan: selectedCoupons,
        finalPrice,
        totalSave
      }
      
      this.$message.success('规划完成！')
    },
    
    findOptimalCombination(coupons, totalPrice) {
      // 简化的组合优化算法
      let bestCombination = []
      let bestPrice = totalPrice
      
      // 遍历所有可能的组合
      for (let i = 0; i < coupons.length; i++) {
        const combination = [coupons[i]]
        let currentPrice = totalPrice - coupons[i].discount
        
        // 尝试添加其他优惠券
        for (let j = 0; j < coupons.length; j++) {
          if (i !== j && currentPrice >= coupons[j].condition) {
            combination.push(coupons[j])
            currentPrice -= coupons[j].discount
          }
        }
        
        if (currentPrice < bestPrice) {
          bestCombination = combination
          bestPrice = currentPrice
        }
      }
      
      return bestCombination
    },
    
    addCoupon() {
      if (!this.newCoupon.name || this.newCoupon.discount <= 0) {
        this.$message.warning('请填写完整的优惠券信息')
        return
      }
      
      const newCoupon = {
        id: Date.now(),
        ...this.newCoupon
      }
      
      this.form.availableCoupons.push(newCoupon)
      this.addCouponDialog = false
      this.resetNewCoupon()
      this.$message.success('优惠券添加成功')
    },
    
    removeCoupon(index) {
      this.form.availableCoupons.splice(index, 1)
      this.$message.success('优惠券删除成功')
    },
    
    resetNewCoupon() {
      this.newCoupon = {
        name: '',
        type: '满减',
        condition: 0,
        discount: 0
      }
    },
    
    async savePlan() {
      if (!this.result.optimizedPlan) {
        this.$message.warning('请先进行规划计算')
        return
      }
      
      try {
        // 调用API保存规划结果
        const planData = {
          totalPrice: this.form.totalPrice,
          strategy: this.form.strategy,
          selectedCoupons: this.result.optimizedPlan,
          finalPrice: this.result.finalPrice,
          totalSave: this.result.totalSave
        }
        
        // 这里可以调用后端API保存数据
        this.$message.success('规划方案已保存')
      } catch (error) {
        this.$message.error('保存失败：' + error.message)
      }
    },
    
    reset() {
      this.form.totalPrice = 0
      this.form.selectedCoupons = []
      this.result = {
        optimizedPlan: null,
        finalPrice: 0,
        totalSave: 0
      }
      this.$message.info('已重置')
    }
  }
}
</script>

<style scoped>
.coupon-planner {
  max-width: 1000px;
  margin: 0 auto;
}

.planner-container {
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

.custom-strategy {
  margin-top: 10px;
}

.action-buttons {
  text-align: center;
}

.el-statistic {
  text-align: center;
}
</style>