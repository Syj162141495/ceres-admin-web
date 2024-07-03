<template>
  <div style="margin-left: 3%; margin-right: 3%; margin-bottom: 3%">
    <div style="margin-top: 20px;">
      <el-form :inline="true" :v-model="searchForm">
        <el-form-item label="服务推荐名称">
          <el-input v-model="searchForm.searchName" placeholder="请输入服务推荐名称" />
        </el-form-item>
        <el-form-item label="推荐客户">
          <el-input v-model="searchForm.searchBuyerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="推荐类型">
          <el-input v-model="searchForm.searchType" placeholder="请输入推荐类型" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="searchTable">查询</el-button>
          <el-button type="success" plain @click="showAddDialogForm">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--新增或编辑弹窗-->
    <el-dialog :title="dialogFormName" :visible.sync="dialogFormVisible" width="60%" class="addOrEditDialog">
      <div slot="footer" class="dialog-footer scrollable-container">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="推荐名称"
                :rules="{
                  required: true, message: '推荐名称不能为空', trigger: 'blur'
                }"
                prop="serviceRecommendationName"
              >
                <el-input v-model="dynamicValidateForm.serviceRecommendationName" label="推荐名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="推荐客户">
                <el-select
                  v-model="dynamicValidateForm.serviceRecommendationBuyerId"
                  placeholder="请选择或搜索客户"
                  style="width: 100%"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  @visible-change="visibleVirtualOptions"
                >
                  <virtual-list
                    style="max-height: 245px; overflow-y: auto;"
                    :data-key="'buyerUserId'"
                    :data-sources="filterList"
                    :data-component="itemComponent"
                    :keeps="20"
                    :extra-props="{
                      label: 'name',
                      value: 'name'
                    }"
                  />
                </el-select>
                <!--                <el-select-->
                <!--                  v-model="dynamicValidateForm.serviceRecommendationBuyerId"-->
                <!--                  :placeholder="dynamicValidateForm.serviceRecommendationBuyerId === null ? '请选择客户' : ''"-->
                <!--                  style="width: 100%"-->
                <!--                >-->
                <!--                  <el-option-->
                <!--                    v-for="(item, index) in serviceRecommendationBuyerList"-->
                <!--                    :key="index"-->
                <!--                    :label="item.name"-->
                <!--                    :value="item.buyerUserId"-->
                <!--                  />-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="2" />
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="是否采纳">
                <el-select v-model="dynamicValidateForm.serviceRecommendationAdoption" placeholder="选项" style="width: 100%">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="服务产品">
                <el-cascader
                  v-model="selectedProduct"
                  placeholder="搜索服务产品"
                  :options="serviceRecommendationProductList"
                  filterable
                  style="width: 140%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button plain type="success" @click="addRow">新增</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="产品列表">
                <el-table :data="productTableData" :header-cell-style="{ background: '#EEF3FF', color: '#333333', height: '5px' }" border style="width: 100%" :row-style="{ height: '10px' }">
                  <el-table-column prop="shopName" label="服务商" />
                  <el-table-column prop="productName" label="服务产品" />
                  <el-table-column prop="price" label="售价" />
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button plain type="text" @click="removeRow(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item>
                <el-button plain type="primary" @click="submitForm('dynamicValidateForm', dynamicValidateForm)">提交</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
          </el-row>
        </el-form>
      </div>
    </el-dialog>
    <el-table :data="serviceRecommendationList" style="width: 100%" class="el-table" :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" border>
      <el-table-column label="序号" prop="serviceRecommendationId" width="80%" />
      <el-table-column label="推荐名称" prop="serviceRecommendationName" width="100%" />
      <!--      <el-table-column label="推荐客户" prop="recommendationCustomer" />-->
      <el-table-column label="推荐客户" prop="serviceRecommendationBuyerName" width="80%" />
      <el-table-column label="推荐类型" prop="serviceRecommendationType" width="80%" />
      <el-table-column label="推荐数量" prop="serviceRecommendationServicesCount" width="80%" />
      <el-table-column label="服务商" prop="serviceRecommendationShopInfo" />
      <el-table-column label="服务产品" prop="serviceRecommendationProductInfo" />
      <el-table-column label="推荐时间" prop="serviceRecommendationTime" width="160%" />
      <el-table-column label="是否采纳" prop="serviceRecommendationAdoption" width="80%" />
      <el-table-column label="操作" width="200%">
        <template slot-scope="scope">
          <el-button plain type="text" @click="showView(scope.$index, scope.row)">查看客户信息</el-button>
          <el-button plain type="text" @click="showEditDialogForm(scope.$index, scope.row)">编辑</el-button>
          <el-button plain type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="客户信息" :visible.sync="userDialogFormVisible" style="width: 80%; margin-left: 10%">
      <el-form :model="userInfo">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="userInfo.name" :disabled="true" style="width: fit-content" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话">
              <el-input v-model="userInfo.phone" :disabled="true" style="width: fit-content" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户性别">
              <el-input v-model="userInfo.sex" :disabled="true" style="width: fit-content" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户年龄">
              <el-input v-model="userInfo.age" :disabled="true" style="width: fit-content" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-pagination
      :current-page="pageInfo.pageNumber"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { insertServiceRecommendation, updateServiceRecommendation,
  deleteServiceRecommendation, recommendationBuyerList,
  recommendationProductList, getServiceRecommendationList } from '@/api/serviceRecommendation'
import virtualList from 'vue-virtual-scroll-list'
import ElOptionNode from './el-option-node'
export default {
  components: { 'virtual-list': virtualList },
  data() {
    return {
      searchForm: {
        searchName: '',
        searchBuyerName: '',
        searchType: ''
      },
      isAddOrEdit: 0,
      dynamicValidateForm: {
        serviceRecommendationId: 0,
        serviceRecommendationName: '',
        serviceRecommendationBuyerId: 0,
        serviceRecommendationServicesCount: 0,
        serviceRecommendationType: '',
        serviceRecommendationProductIds: [],
        serviceRecommendationTime: '',
        serviceRecommendationAdoption: '',
        pageNumber: 1,
        pageSize: 5
      },
      selectedProduct: [],
      dialogFormName: '',
      dialogFormVisible: false,
      userDialogFormVisible: false,
      serviceRecommendationList: [],
      serviceRecommendationBuyerList: [],
      itemComponent: ElOptionNode,
      searchBuyer: '',
      filterList: [],
      serviceRecommendationProductList: [],
      productList: [],
      pageInfo: {
        serviceRecommendationId: 0,
        serviceRecommendationName: '',
        serviceRecommendationBuyerId: 0,
        serviceRecommendationServicesCount: 0,
        serviceRecommendationType: '',
        serviceRecommendationProductIds: [],
        serviceRecommendationTime: '',
        serviceRecommendationAdoption: '',
        pageNumber: 1,
        pageSize: 5
      },
      total: 0,
      userInfo: {
        name: '',
        phone: '',
        sex: '',
        age: ''
      },
      productTableData: [],
      productIdList: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 数据加载
    load() {
      const recommendationProductListData = {
        shelveState: '',
        productName: '',
        productId: '',
        shopName: '',
        page: 1,
        pageSize: 5
      }
      recommendationProductList(recommendationProductListData).then(res => {
        const productList = res.data.reduce((acc, currentItem) => {
          // 初始化或获取productType层
          let productTypeNode = acc.find(node => node.value === currentItem.productType)
          if (!productTypeNode) {
            productTypeNode = { value: currentItem.productType, label: currentItem.productType, children: [] }
            acc.push(productTypeNode)
          }
          // 初始化或获取shopName层
          let shopNameNode = productTypeNode.children.find(node => node.value === currentItem.shopName)
          if (!shopNameNode) {
            shopNameNode = { value: currentItem.shopName, label: currentItem.shopName, children: [] }
            productTypeNode.children.push(shopNameNode)
          }
          // 添加productName到shopName的children
          shopNameNode.children.push({ value: currentItem.productId, label: currentItem.productName + ' 售价：' + currentItem.price })
          return acc
        }, [])
        this.serviceRecommendationProductList = productList
        this.productList = res.data
      })
      recommendationBuyerList().then(res => {
        this.serviceRecommendationBuyerList = res.data
        getServiceRecommendationList(this.pageInfo).then(res => {
          this.serviceRecommendationList = res.data.list
          this.total = res.data.total
          for (let i = 0; i < this.serviceRecommendationList.length; i++) {
            this.serviceRecommendationList[i].serviceRecommendationServicesCount = this.serviceRecommendationList[i].serviceRecommendationProductIds.length
            this.serviceRecommendationList[i].serviceRecommendationType = this.serviceRecommendationList[i].serviceRecommendationProductIds.length === 1 ? '单项' : '套餐'
            if (typeof this.serviceRecommendationBuyerList !== 'undefined' && this.serviceRecommendationBuyerList.length !== 0) {
              const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.buyerUserId === this.serviceRecommendationList[i].serviceRecommendationBuyerId)
              if (typeof buyer !== 'undefined') {
                this.serviceRecommendationList[i].serviceRecommendationBuyerName = buyer.name
              } else {
                this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
              }
            } else {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
            }
            this.serviceRecommendationList[i].serviceRecommendationShopInfo = ''
            this.serviceRecommendationList[i].serviceRecommendationProductInfo = ''
            const productInfo = []
            for (let j = 0; j < this.serviceRecommendationList[i].serviceRecommendationProductIds.length; j++) {
              const product = this.productList.find(product => product.productId === this.serviceRecommendationList[i].serviceRecommendationProductIds[j])
              productInfo.push({ shopName: product.shopName, productName: product.productName })
            }
            // 初始化用于存放唯一值的数组
            let uniqueShopNames = []
            let uniqueProductNames = []
            // 提取并去重 shopName
            // eslint-disable-next-line no-const-assign
            uniqueShopNames = [...new Set(productInfo.map(item => item.shopName))]
            // 提取并去重 productName
            uniqueProductNames = [...new Set(productInfo.map(item => item.productName))]
            this.serviceRecommendationList[i].serviceRecommendationShopInfo = uniqueShopNames.join(', ')
            this.serviceRecommendationList[i].serviceRecommendationProductInfo = uniqueProductNames.join(', ')
          }
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.filterList = this.serviceRecommendationBuyerList.filter(item => {
          return item.name.toLowerCase().includes(query.toLowerCase())
        })
      } else {
        this.filterList = this.serviceRecommendationBuyerList
      }
    },
    visibleVirtualOptions(bool) {
      if (bool && this.dynamicValidateForm.serviceRecommendationBuyerId !== 0) {
        this.filterList = this.serviceRecommendationBuyerList
      }
    },
    searchTable() {
      this.pageInfo.serviceRecommendationName = this.searchForm.searchName
      const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.name === this.searchForm.searchBuyerName)
      if (typeof buyer === 'undefined') {
        this.pageInfo.serviceRecommendationBuyerId = 0
      } else {
        this.pageInfo.serviceRecommendationBuyerId = buyer.buyerUserId
      }
      this.pageInfo.serviceRecommendationType = this.searchForm.searchType
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
        for (let i = 0; i < this.serviceRecommendationList.length; i++) {
          this.serviceRecommendationList[i].serviceRecommendationServicesCount = this.serviceRecommendationList[i].serviceRecommendationProductIds.length
          this.serviceRecommendationList[i].serviceRecommendationType = this.serviceRecommendationList[i].serviceRecommendationProductIds.length === 1 ? '单项' : '套餐'
          if (typeof this.serviceRecommendationBuyerList !== 'undefined' && this.serviceRecommendationBuyerList.length !== 0) {
            const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.buyerUserId === this.serviceRecommendationList[i].serviceRecommendationBuyerId)
            if (typeof buyer !== 'undefined') {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = buyer.name
            } else {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
            }
          } else {
            this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
          }
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = ''
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = ''
          const productInfo = []
          for (let j = 0; j < this.serviceRecommendationList[i].serviceRecommendationProductIds.length; j++) {
            const product = this.productList.find(product => product.productId === this.serviceRecommendationList[i].serviceRecommendationProductIds[j])
            productInfo.push({ shopName: product.shopName, productName: product.productName })
          }
          // 初始化用于存放唯一值的数组
          let uniqueShopNames = []
          let uniqueProductNames = []
          // 提取并去重 shopName
          // eslint-disable-next-line no-const-assign
          uniqueShopNames = [...new Set(productInfo.map(item => item.shopName))]
          // 提取并去重 productName
          uniqueProductNames = [...new Set(productInfo.map(item => item.productName))]
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = uniqueShopNames.join(', ')
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = uniqueProductNames.join(', ')
        }
      })
    },
    // 展示新增表单
    showAddDialogForm() {
      this.dialogFormVisible = true
      this.dialogFormName = '新增'
      this.isAddOrEdit = 0
      this.dynamicValidateForm = {
        serviceRecommendationId: 0,
        serviceRecommendationName: '',
        serviceRecommendationBuyerId: null,
        serviceRecommendationServicesCount: 0,
        serviceRecommendationType: '',
        serviceRecommendationProductIds: [],
        serviceRecommendationTime: '',
        serviceRecommendationAdoption: ''
      }
      this.productTableData = []
      this.selectedProduct = []
      this.productIdList = []
    },
    showView(index, row) {
      this.userDialogFormVisible = true
      const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.buyerUserId === row.serviceRecommendationBuyerId)
      this.userInfo = {
        name: buyer.name,
        phone: buyer.phone,
        sex: buyer.sex,
        age: buyer.age
      }
    },
    // 展示修改表单
    showEditDialogForm(index, row) {
      this.productIdList = []
      this.dialogFormVisible = true
      this.dialogFormName = '编辑'
      this.isAddOrEdit = 1
      this.dynamicValidateForm = row
      this.productTableData = []
      this.selectedProduct = []
      for (let i = 0; i < row.serviceRecommendationProductIds.length; i++) {
        const product = this.productList.find(product => product.productId === row.serviceRecommendationProductIds[i])
        this.productTableData.push({ shopName: product.shopName, productName: product.productName, price: product.price })
      }
    },
    // 服务推荐数据删除
    handleDelete(index, row) {
      this.$confirm('您确定要执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          deleteServiceRecommendation(row).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功执行!'
            })
            this.load()
          })
            .catch(() => {
              this.$message({
                message: '操作取消执行'
              })
            })
        })
    },
    submitForm(formName, dynamicValidateForm) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAddOrEdit === 0) {
            for (let i = 0; i < this.productIdList.length; i++) {
              dynamicValidateForm.serviceRecommendationProductIds.push(this.productIdList[i])
            }
            insertServiceRecommendation(dynamicValidateForm).then(res => {
              this.dialogFormVisible = false
              this.load()
            })
          } else {
            for (let i = 0; i < this.productIdList.length; i++) {
              dynamicValidateForm.serviceRecommendationProductIds.push(this.productIdList[i])
            }
            updateServiceRecommendation(dynamicValidateForm).then(res => {
              this.dialogFormVisible = false
              this.load()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeServiceRecommendationProduct(item) {
      const index = this.dynamicValidateForm.serviceRecommendationProductIds.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.serviceRecommendationProductIds.splice(index, 1)
      }
    },
    addServiceRecommendationProduct() {
      this.dynamicValidateForm.serviceRecommendationProductIds.push(0)
    },
    addRow() {
      if (this.selectedProduct) {
        if (!this.dynamicValidateForm.serviceRecommendationProductIds.includes(this.selectedProduct[2])) {
          this.productIdList.push(this.selectedProduct[2])
          const product = this.productList.find(product => product.productId === this.selectedProduct[2])
          this.productTableData.push({
            shopName: product.shopName,
            productName: product.productName,
            price: product.price
          })
        }
      }
    },
    removeRow(index) {
      this.productTableData.splice(index, 1)
      this.productIdList.splice(index, 1)
    },
    addProductIds(index) {
      console.log('new', this.dynamicValidateForm.serviceRecommendationProductIds[index])
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
        for (let i = 0; i < this.serviceRecommendationList.length; i++) {
          this.serviceRecommendationList[i].serviceRecommendationServicesCount = this.serviceRecommendationList[i].serviceRecommendationProductIds.length
          this.serviceRecommendationList[i].serviceRecommendationType = this.serviceRecommendationList[i].serviceRecommendationProductIds.length === 1 ? '单项' : '套餐'
          if (typeof this.serviceRecommendationBuyerList !== 'undefined' && this.serviceRecommendationBuyerList.length !== 0) {
            const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.buyerUserId === this.serviceRecommendationList[i].serviceRecommendationBuyerId)
            if (typeof buyer !== 'undefined') {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = buyer.name
            } else {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
            }
          } else {
            this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
          }
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = ''
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = ''
          const productInfo = []
          for (let j = 0; j < this.serviceRecommendationList[i].serviceRecommendationProductIds.length; j++) {
            const product = this.productList.find(product => product.productId === this.serviceRecommendationList[i].serviceRecommendationProductIds[j])
            productInfo.push({ shopName: product.shopName, productName: product.productName })
          }
          // 初始化用于存放唯一值的数组
          let uniqueShopNames = []
          let uniqueProductNames = []
          // 提取并去重 shopName
          // eslint-disable-next-line no-const-assign
          uniqueShopNames = [...new Set(productInfo.map(item => item.shopName))]
          // 提取并去重 productName
          uniqueProductNames = [...new Set(productInfo.map(item => item.productName))]
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = uniqueShopNames.join(', ')
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = uniqueProductNames.join(', ')
        }
      })
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNumber = val
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
        for (let i = 0; i < this.serviceRecommendationList.length; i++) {
          this.serviceRecommendationList[i].serviceRecommendationServicesCount = this.serviceRecommendationList[i].serviceRecommendationProductIds.length
          this.serviceRecommendationList[i].serviceRecommendationType = this.serviceRecommendationList[i].serviceRecommendationProductIds.length === 1 ? '单项' : '套餐'
          if (typeof this.serviceRecommendationBuyerList !== 'undefined' && this.serviceRecommendationBuyerList.length !== 0) {
            const buyer = this.serviceRecommendationBuyerList.find(buyer => buyer.buyerUserId === this.serviceRecommendationList[i].serviceRecommendationBuyerId)
            if (typeof buyer !== 'undefined') {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = buyer.name
            } else {
              this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
            }
          } else {
            this.serviceRecommendationList[i].serviceRecommendationBuyerName = ''
          }
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = ''
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = ''
          const productInfo = []
          for (let j = 0; j < this.serviceRecommendationList[i].serviceRecommendationProductIds.length; j++) {
            const product = this.productList.find(product => product.productId === this.serviceRecommendationList[i].serviceRecommendationProductIds[j])
            productInfo.push({ shopName: product.shopName, productName: product.productName })
          }
          // 初始化用于存放唯一值的数组
          let uniqueShopNames = []
          let uniqueProductNames = []
          // 提取并去重 shopName
          // eslint-disable-next-line no-const-assign
          uniqueShopNames = [...new Set(productInfo.map(item => item.shopName))]
          // 提取并去重 productName
          uniqueProductNames = [...new Set(productInfo.map(item => item.productName))]
          this.serviceRecommendationList[i].serviceRecommendationShopInfo = uniqueShopNames.join(', ')
          this.serviceRecommendationList[i].serviceRecommendationProductInfo = uniqueProductNames.join(', ')
        }
      })
    }
  }
}
</script>

<style>
/**{*/
/*  border: black 1px solid;*/
/*}*/
.item-pair{
  display: flex;
}
.el-dialog__header {
  padding: 20px 24px;
}
.el-dialog__body {
  padding: 20px;
}
.el-button {
  border: none;
}
.el-pager li.active {
  background-color: #007bff;
  color: #fff;
}
.el-pagination button {
  border-radius: 4px;
}
.scrollable-container {
  max-height: 500px; /* 限制容器的最大高度 */
  overflow-y: auto; /* 当内容溢出时，垂直方向显示滚动条 */
  /* 可选：自定义滚动条样式，这里提供一个基本的例子 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f0f0f0;
}
.user-dialog {
  justify-content: center;
}
::v-deep .form-item .el-form-item__label {
  width: 100%;
  /* 设置标签的宽度 */
  display: inline-block;
  text-align: left;
}
.addOrEditDialog {
  margin-top: -50px;
}
</style>
