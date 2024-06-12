<template>
  <div style="margin-left: 1%; margin-right: 1%">
    <el-input v-model="search" placeholder="search" style="width: 300px; margin-bottom: 10px;" />
    <el-button type="primary" class="green-button" @click="showAddDialogForm">新增</el-button>
    <!--新增或编辑弹窗-->
    <el-dialog :title="dialogFormName" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer scrollable-container">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px">
          <el-form-item
            label="推荐名称"
            style="width: 630px;"
            :rules="{
              required: true, message: '推荐名称不能为空', trigger: 'blur'
            }"
            prop="serviceRecommendationName"
          >
            <el-input v-model="dynamicValidateForm.serviceRecommendationName" label="推荐名称" />
          </el-form-item>
          <div class="item-pair">
            <el-form-item label="推荐客户">
              <el-select
                v-model="dynamicValidateForm.serviceRecommendationBuyerId"
                :placeholder="dynamicValidateForm.serviceRecommendationBuyerId === null ? '请选择客户' : ''"
              >
                <el-option
                  v-for="item in serviceRecommendationBuyerList"
                  :key="item.buyerUserId"
                  :label="item.name"
                  :value="item.buyerUserId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否采纳">
              <el-radio v-model="dynamicValidateForm.serviceRecommendationAdoption" label="是" />
              <el-radio v-model="dynamicValidateForm.serviceRecommendationAdoption" label="否" />
            </el-form-item>
          </div>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.serviceRecommendationProductIds"
            :key="index"
            style="display: flex"
            :label="index === 0 ? '服务产品' : ''"
          >
            <el-cascader
              v-model="dynamicValidateForm.serviceRecommendationProductIds[index]"
              :style="{ 'margin-left': index === 0 ? '-100px' : 'auto', width: '450px' }"
              placeholder="搜索服务产品"
              :options="serviceRecommendationProductList"
              filterable
              @change="addProductIds(index)"
            />
            <el-button style="margin-left: 10px" @click.prevent="removeServiceRecommendationProduct(domain)">删除</el-button>
          </el-form-item>
          <el-form-item style="display: flex">
            <el-button style="margin-left: 404px" @click="addServiceRecommendationProduct">新增服务产品</el-button>
            <el-button type="primary" @click="submitForm('dynamicValidateForm', dynamicValidateForm)">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-table :data="serviceRecommendationList.filter(data => !search || data.serviceRecommendationName.toLowerCase().includes(search.toLowerCase()))" style="width: 100%" class="el-table">
      <el-table-column label="序号" prop="serviceRecommendationId" />
      <el-table-column label="推荐名称" prop="serviceRecommendationName" />
      <!--      <el-table-column label="推荐客户" prop="recommendationCustomer" />-->
      <el-table-column label="推荐客户" prop="serviceRecommendationBuyerId" />
      <el-table-column label="推荐类型" prop="serviceRecommendationType" />
      <el-table-column label="推荐数量" prop="serviceRecommendationServicesCount" />
      <el-table-column label="推荐时间" prop="serviceRecommendationTime" />
      <el-table-column label="是否采纳" prop="serviceRecommendationAdoption" />
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showView(scope.$index, scope.row)">查看客户信息</el-button>
          <el-button size="mini" @click="showEditDialogForm(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="客户信息" :visible.sync="userDialogFormVisible" style="width: 60%; margin-left: 20%">
      <el-form :model="userInfo">
        <el-form-item label="客户名称">
          <el-input v-model="userInfo.name" :disabled="true" style="width: fit-content" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="userInfo.phone" :disabled="true" style="width: fit-content" />
        </el-form-item>
        <el-form-item label="客户性别">
          <el-input v-model="userInfo.sex" :disabled="true" style="width: fit-content" />
        </el-form-item>
        <el-form-item label="客户年龄">
          <el-input v-model="userInfo.age" :disabled="true" style="width: fit-content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      :current-page="pageInfo.pageNumber"
      :page-sizes="[5, 10, 20, 50, 100]"
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
export default {
  data() {
    return {
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
      dialogFormName: '',
      dialogFormVisible: false,
      userDialogFormVisible: false,
      search: '',
      serviceRecommendationList: [],
      serviceRecommendationBuyerList: [],
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
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 数据加载
    load() {
      const recommendationBuyerListData = {
        name: '',
        phone: '',
        labelId: '',
        dates: [],
        minMoney: '',
        maxMoney: '',
        minBuyers: '',
        maxBuyers: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      }
      recommendationBuyerList(recommendationBuyerListData).then(res => {
        this.serviceRecommendationBuyerList = res.data.list
      })
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
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
        for (let i = 0; i < this.serviceRecommendationList.length; i++) {
          this.serviceRecommendationList[i].serviceRecommendationServicesCount = this.serviceRecommendationList[i].serviceRecommendationProductIds.length
          this.serviceRecommendationList[i].serviceRecommendationType = this.serviceRecommendationList[i].serviceRecommendationProductIds.length === 1 ? '单项' : '套餐'
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
        serviceRecommendationProductIds: [0],
        serviceRecommendationTime: '',
        serviceRecommendationAdoption: ''
      }
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
      this.dialogFormVisible = true
      this.dialogFormName = '编辑'
      this.isAddOrEdit = 1
      this.dynamicValidateForm = row
      for (let i = 0; i < row.serviceRecommendationProductIds.length; i++) {
        const product = this.productList.find(product => product.productId === row.serviceRecommendationProductIds[i])
        this.dynamicValidateForm.serviceRecommendationProductIds[i] = [product.productType, product.shopName, product.productId]
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
          const productIds = []
          for (let i = 0; i < dynamicValidateForm.serviceRecommendationProductIds.length; i++) {
            if (!(typeof dynamicValidateForm.serviceRecommendationProductIds[i][2] === 'undefined')) {
              productIds.push(dynamicValidateForm.serviceRecommendationProductIds[i][2])
            }
          }
          dynamicValidateForm.serviceRecommendationProductIds = productIds
          if (this.isAddOrEdit === 0) {
            insertServiceRecommendation(dynamicValidateForm).then(res => {
              this.dialogFormVisible = false
              this.load()
            })
          } else {
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
    addProductIds(index) {
      console.log('new', this.dynamicValidateForm.serviceRecommendationProductIds[index])
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNumber = val
      getServiceRecommendationList(this.pageInfo).then(res => {
        this.serviceRecommendationList = res.data.list
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
/**{*/
/*  border: black 1px solid;*/
/*}*/
.item-pair{
  display: flex;
}

.green-button {
  background-color: #4CAF50;
  color: white;
  margin-top: 10px;
  margin-left: 10px;
}
.el-table tr td,
.el-table tr th {
  padding: 12px 0;
  vertical-align: middle;
}
.el-table {
  border-top: 1px solid #dfe6ec;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.el-button--primary {
  background-color: #007bff;
  border-color: #007bff;
  border-radius: 4px;
}
.el-button {
  font-weight: 500;
  border-radius: 4px;
}
.el-dialog__header {
  padding: 20px 24px;
}
.el-dialog__body {
  padding: 20px;
}
.el-pager li.active {
  background-color: #007bff;
  color: #fff;
}
.el-pagination button {
  border-radius: 4px;
}
.scrollable-container {
  max-height: 400px; /* 限制容器的最大高度 */
  overflow-y: auto; /* 当内容溢出时，垂直方向显示滚动条 */
  /* 可选：自定义滚动条样式，这里提供一个基本的例子 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f0f0f0;
}
.user-dialog {
  justify-content: center;
}
</style>
