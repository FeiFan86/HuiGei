<template>
  <div class="price-comparison">
    <el-card header="商品比价工具">
      <div class="comparison-container">
        <!-- 搜索区域 -->
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="输入商品名称搜索"
            size="large"
            clearable
            @keyup.enter="searchProducts"
          >
            <template #append>
              <el-button @click="searchProducts" type="primary">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </template>
          </el-input>
          
          <div class="search-filters" style="margin-top: 15px">
            <el-select v-model="selectedPlatforms" multiple placeholder="选择平台">
              <el-option
                v-for="platform in platforms"
                :key="platform.value"
                :label="platform.label"
                :value="platform.value"
              />
            </el-select>
            
            <el-select v-model="sortBy" placeholder="排序方式" style="margin-left: 10px">
              <el-option label="价格从低到高" value="price_asc" />
              <el-option label="价格从高到低" value="price_desc" />
              <el-option label="评分从高到低" value="rating_desc" />
              <el-option label="销量从高到低" value="sales_desc" />
            </el-select>
          </div>
        </div>
        
        <!-- 搜索结果 -->
        <div v-if="searchResults.length > 0" class="results-section">
          <el-divider>搜索结果</el-divider>
          
          <div class="product-grid">
            <el-card
              v-for="product in sortedResults"
              :key="product.id"
              class="product-card"
              shadow="hover"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <el-tag
                  v-if="product.isBestPrice"
                  class="best-price-tag"
                  type="success"
                  effect="dark"
                >
                  最低价
                </el-tag>
              </div>
              
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <div class="platform-info">
                  <el-tag :type="getPlatformTagType(product.platform)">
                    {{ getPlatformLabel(product.platform) }}
                  </el-tag>
                </div>
                
                <div class="price-section">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice > product.price" class="original-price">
                    ¥{{ product.originalPrice }}
                  </span>
                  <span v-if="product.discount" class="discount">
                    {{ product.discount }}折
                  </span>
                </div>
                
                <div class="product-details">
                  <div class="detail-item">
                    <el-rate
                      v-model="product.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                  <div class="detail-item">
                    <span>销量：{{ product.sales }}</span>
                  </div>
                  <div class="detail-item">
                    <span>评价：{{ product.reviews }}</span>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <el-button @click="viewDetails(product)" type="primary" size="small">
                    查看详情
                  </el-button>
                  <el-button @click="addToComparison(product)" type="success" size="small">
                    加入对比
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 对比表格 -->
        <div v-if="comparisonProducts.length > 0" class="comparison-section">
          <el-divider>商品对比</el-divider>
          
          <el-table :data="comparisonTable" style="width: 100%" border>
            <el-table-column prop="property" label="对比项" width="120" fixed />
            <el-table-column
              v-for="product in comparisonProducts"
              :key="product.id"
              :label="getPlatformLabel(product.platform)"
              align="center"
            >
              <template #default="{ row }">
                <div v-if="row.property === '图片'">
                  <img :src="product.image" :alt="product.name" style="width: 60px; height: 60px; object-fit: cover;" />
                </div>
                <div v-else-if="row.property === '价格'">
                  <span class="price-cell" :class="{ 'best-price': product.isBestPrice }">
                    ¥{{ product.price }}
                  </span>
                  <div v-if="product.originalPrice > product.price" class="original-price">
                    ¥{{ product.originalPrice }}
                  </div>
                </div>
                <div v-else-if="row.property === '评分'">
                  <el-rate v-model="product.rating" disabled size="small" />
                  <span>({{ product.rating }})</span>
                </div>
                <div v-else-if="row.property === '操作'">
                  <el-button @click="removeFromComparison(product)" type="danger" size="small">
                    移除
                  </el-button>
                </div>
                <div v-else>
                  {{ product[row.propertyKey] }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="comparison-summary" style="margin-top: 20px">
            <h4>对比总结</h4>
            <el-alert
              v-if="bestProduct"
              :title="`推荐购买：${bestProduct.name}（${getPlatformLabel(bestProduct.platform)}）`"
              :description="`当前价格最低，性价比最高，评分${bestProduct.rating}分`"
              type="success"
              show-icon
            />
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 商品详情对话框 -->
    <el-dialog v-model="showProductDetail" :title="selectedProduct?.name" width="600px">
      <div v-if="selectedProduct" class="product-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" style="width: 100%;" />
          </el-col>
          <el-col :span="12">
            <h3>{{ selectedProduct.name }}</h3>
            <p class="platform">平台：{{ getPlatformLabel(selectedProduct.platform) }}</p>
            <p class="price">价格：¥{{ selectedProduct.price }}</p>
            <p class="rating">评分：{{ selectedProduct.rating }}分</p>
            <p class="sales">销量：{{ selectedProduct.sales }}</p>
            <el-button type="primary" @click="openProductLink(selectedProduct)">
              前往购买
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'PriceComparison',
  components: {
    Search
  },
  data() {
    return {
      searchKeyword: '',
      selectedPlatforms: [],
      sortBy: 'price_asc',
      searchResults: [],
      comparisonProducts: [],
      selectedProduct: null,
      showProductDetail: false,
      platforms: [
        { label: '淘宝', value: 'taobao' },
        { label: '京东', value: 'jd' },
        { label: '拼多多', value: 'pdd' },
        { label: '天猫', value: 'tmall' },
        { label: '苏宁', value: 'suning' }
      ]
    }
  },
  computed: {
    sortedResults() {
      let results = [...this.searchResults]
      
      // 平台筛选
      if (this.selectedPlatforms.length > 0) {
        results = results.filter(product => 
          this.selectedPlatforms.includes(product.platform)
        )
      }
      
      // 排序
      switch (this.sortBy) {
        case 'price_asc':
          return results.sort((a, b) => a.price - b.price)
        case 'price_desc':
          return results.sort((a, b) => b.price - a.price)
        case 'rating_desc':
          return results.sort((a, b) => b.rating - a.rating)
        case 'sales_desc':
          return results.sort((a, b) => b.sales - a.sales)
        default:
          return results
      }
    },
    
    comparisonTable() {
      const properties = [
        { property: '图片', propertyKey: 'image' },
        { property: '商品名称', propertyKey: 'name' },
        { property: '价格', propertyKey: 'price' },
        { property: '原价', propertyKey: 'originalPrice' },
        { property: '折扣', propertyKey: 'discount' },
        { property: '评分', propertyKey: 'rating' },
        { property: '销量', propertyKey: 'sales' },
        { property: '评价数', propertyKey: 'reviews' },
        { property: '操作', propertyKey: 'action' }
      ]
      
      return properties
    },
    
    bestProduct() {
      if (this.comparisonProducts.length === 0) return null
      
      // 综合考虑价格、评分、销量等因素
      return this.comparisonProducts.reduce((best, current) => {
        const bestScore = (best.price / best.rating) * (best.sales / 1000)
        const currentScore = (current.price / current.rating) * (current.sales / 1000)
        return currentScore < bestScore ? current : best
      })
    }
  },
  methods: {
    searchProducts() {
      if (!this.searchKeyword.trim()) {
        this.$message.warning('请输入搜索关键词')
        return
      }
      
      // 模拟搜索API调用
      this.$message.info('正在搜索商品...')
      
      setTimeout(() => {
        // 模拟搜索结果
        this.searchResults = [
          {
            id: 1,
            name: `${this.searchKeyword} 商品A`,
            platform: 'taobao',
            price: 299,
            originalPrice: 399,
            discount: '7.5',
            rating: 4.8,
            sales: 1500,
            reviews: 320,
            image: 'https://via.placeholder.com/200x200?text=商品A',
            link: 'https://taobao.com/product/1'
          },
          {
            id: 2,
            name: `${this.searchKeyword} 商品B`,
            platform: 'jd',
            price: 289,
            originalPrice: 369,
            discount: '7.8',
            rating: 4.9,
            sales: 2800,
            reviews: 450,
            image: 'https://via.placeholder.com/200x200?text=商品B',
            link: 'https://jd.com/product/2'
          },
          {
            id: 3,
            name: `${this.searchKeyword} 商品C`,
            platform: 'pdd',
            price: 269,
            originalPrice: 329,
            discount: '8.2',
            rating: 4.7,
            sales: 3800,
            reviews: 520,
            image: 'https://via.placeholder.com/200x200?text=商品C',
            link: 'https://pdd.com/product/3'
          }
        ]
        
        // 标记最低价商品
        const minPrice = Math.min(...this.searchResults.map(p => p.price))
        this.searchResults.forEach(product => {
          product.isBestPrice = product.price === minPrice
        })
        
        this.$message.success(`找到 ${this.searchResults.length} 个相关商品`)
      }, 1000)
    },
    
    getPlatformTagType(platform) {
      const types = {
        taobao: 'primary',
        jd: 'success',
        pdd: 'warning',
        tmall: 'danger',
        suning: 'info'
      }
      return types[platform] || 'default'
    },
    
    getPlatformLabel(platform) {
      const platformMap = {
        taobao: '淘宝',
        jd: '京东',
        pdd: '拼多多',
        tmall: '天猫',
        suning: '苏宁'
      }
      return platformMap[platform] || platform
    },
    
    viewDetails(product) {
      this.selectedProduct = product
      this.showProductDetail = true
    },
    
    addToComparison(product) {
      if (this.comparisonProducts.some(p => p.id === product.id)) {
        this.$message.warning('该商品已在对比列表中')
        return
      }
      
      if (this.comparisonProducts.length >= 5) {
        this.$message.warning('最多只能对比5个商品')
        return
      }
      
      this.comparisonProducts.push({ ...product })
      this.$message.success('已添加到对比列表')
    },
    
    removeFromComparison(product) {
      const index = this.comparisonProducts.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.comparisonProducts.splice(index, 1)
        this.$message.success('已从对比列表中移除')
      }
    },
    
    openProductLink(product) {
      // 模拟打开商品链接
      window.open(product.link, '_blank')
      this.showProductDetail = false
      this.$message.info('正在跳转到商品页面...')
    }
  }
}
</script>

<style scoped>
.price-comparison {
  max-width: 1400px;
  margin: 0 auto;
}

.comparison-container {
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-filters {
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.best-price-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.platform-info {
  margin-bottom: 10px;
}

.price-section {
  margin-bottom: 10px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  margin-left: 10px;
}

.discount {
  background: #f56c6c;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 10px;
}

.product-details {
  margin-bottom: 15px;
}

.detail-item {
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.price-cell.best-price {
  color: #67c23a;
  font-weight: bold;
}

.comparison-summary {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.product-detail .platform,
.product-detail .price,
.product-detail .rating,
.product-detail .sales {
  margin: 10px 0;
  font-size: 14px;
}
</style>