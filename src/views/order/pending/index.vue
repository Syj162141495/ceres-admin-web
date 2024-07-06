<!--  -->
<template>
  <div class="pending">
    <div class="tab_show">
      <el-tabs v-model="formInline.state" @tab-click="handleClick">
        <el-tab-pane label="全部" :name="''" />
        <el-tab-pane label="待支付" name="1" />
        <el-tab-pane label="待接单" name="2" />
        <el-tab-pane label="服务中" name="3" />
        <el-tab-pane label="服务完成" name="4" />
        <el-tab-pane label="服务关闭" name="5" />
      </el-tabs>
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <!-- <el-form-item>
            <div>
              <el-input v-model="formInline.search" placeholder="请输入内容">
                <el-select slot="prepend" v-model="formInline.searchType" style="width: 130px" placeholder="请选择">
                  <el-option label="订单id" value="1" />
                  <el-option label="买家账户" value="2" />
                  <el-option label="联系方式" value="3" />
                  <el-option label="客户手机" value="4" />
                </el-select>
              </el-input>
            </div>
          </el-form-item> -->
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="formInline.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="服务名称">
            <el-input v-model="formInline.productName" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="服务商名称">
            <el-input v-model="formInline.shopName" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item label="服务类型">
            <el-select
              v-model="formInline.firstClassifyID"
              placeholder="请选择服务类型"
              style="width: 150px;"
              clearable
              @change="changeFirstClass"
              @clear="changeFirstClass"
            >
              <el-option
                v-for="(item, index) in firstClasses"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="服务大类">
            <el-select
              v-model="formInline.secondClassifyID"
              placeholder="请选择服务大类"
              style="width: 150px;"
              clearable
              @change="changeSecondClass"
              @clear="changeSecondClass"
            >
              <el-option
                v-for="(item, index) in secondClasses"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务小类">
            <el-select
              v-model="formInline.thirdClassifyID"
              placeholder="请选择服务小类"
              :disabled="!formInline.secondClassifyID || formInline.secondClassifyID === ''"
              style="width: 180px;"
              clearable
            >
              <el-option
                v-for="(item, index) in thirdClasses"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ background: '#EEF3FF', color: '#333333', 'text-align': 'center' }"
          tooltip-effect="dark"
          style="width: 100%;"
          size="mini"
        >
          <!-- <el-table-column label="订单id" show-overflow-tooltip><template slot-scope="scope">{{ scope.row.orderId }}</template></el-table-column>-->
          <!-- <el-table-column prop="number" label="服务数量" width="100px" /> -->
          <!-- <el-table-column prop="customerName" label="下单账户" show-overflow-tooltip /> -->
          <!-- <el-table-column prop="receiveName" label="收件人" show-overflow-tooltip /> -->
          <el-table-column prop="productName" label="服务名称" min-width="200" />
          <el-table-column prop="firstClass" label="服务类型" min-width="100" />
          <el-table-column prop="secondClass" label="服务大类" min-width="150" />
          <el-table-column prop="thirdClass" label="服务小类" min-width="200" show-overflow-tooltip />
          <el-table-column prop="price" width="100" label="金额" />
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1">待支付</span>
              <span v-if="scope.row.state == 2">待接单</span>
              <span v-if="scope.row.state == 3">服务中</span>
              <span v-if="scope.row.state == 4">服务完成</span>
              <span v-if="scope.row.state == 5">服务关闭</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="预约时间" width="180" />
          <el-table-column prop="receiveName" label="客户名称" width="180" />
          <el-table-column prop="receivePhone" label="客户手机" width="180" show-overflow-tooltip />
          <el-table-column prop="shopName" label="服务商名称" min-width="250" show-overflow-tooltip />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="del(scope.row)">查看</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  orderGetAll
} from '@/api/order'
import {
  getClassify
} from '@/api/commodity'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      activeName: 'first',
      formInline: {
        searchType: '1',
        search: '', // 搜索字段
        productName: '', // 服务名称
        firstClassifyID: '',
        secondClassifyID: '', // 服务大类
        thirdClassifyID: '', // 服务小类
        state: '',
        afterState: '', // 售后状态 0-无售后 1-售后中 2-售后成功 3-售后关闭
        dates: [], // 下单时间数组
        page: 1,
        shopName: '',
        pageSize: 10,
        queryType: 'medical'// 订单种类
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      classifyList: [],
      firstClasses: [],
      secondClasses: [],
      thirdClasses: []
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.formInline.queryType = this.$route.params.queryType
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    await this.queryAllCategory()
    await this.getAll(this.formInline)
    this.handleClick({ name: '' })
  },
  // 方法集合
  methods: {
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    handleClick(tab, event) {
      console.log(tab)
      this.formInline.state = tab.name
      this.getAll(this.formInline)
    },
    //  查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    del(row) {
      this.$router.push({
        name: 'pendDetails',
        params: { orderId: row.orderId }
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      console.log(formInline, 'formInline')
      const res = await orderGetAll(formInline)
      this.total = res.data.total
      for (const item of res.data.list) {
        const arr = item.classifyHierarchy.split('-')
        item.firstClass = arr[1]
        item.secondClass = arr[2]
        item.thirdClass = arr[3]
      }
      this.tableData = res.data.list
      console.info(this.tableData)
    },
    // 根据类型初始化不同的订单分类
    matchFirstClass(categoryName) {
      const state = this.$route.params.queryType
      if (state === 'medical') {
        return categoryName === '医疗服务'
      } else if (state === 'elderlycare') {
        return categoryName === '养老服务'
      } else {
        return categoryName !== '医疗服务' && categoryName !== '养老服务'
      }
    },
    // 初始化查询所有分类
    async queryAllCategory() {
      const res = await getClassify()
      this.categoryList = res.data
      console.error(this.categoryList)
      this.firstClasses = this.categoryList.filter(item => this.matchFirstClass(item.categoryName))
      this.secondClasses = this.firstClasses.flatMap(item => item.childs)
      this.thirdClasses = this.secondClasses.find(item => item.id === this.formInline.secondClassifyID) && this.secondClasses.find(item => item.id === this.formInline.secondClassifyID)['childs']
    },
    changeFirstClass() {
      if (!this.formInline.firstClassifyID) {
        this.thirdClasses = []
        this.formInline.thirdClassifyID = undefined
        return
      }
    },
    changeSecondClass() {
      if (!this.formInline.secondClassifyID) {
        this.thirdClasses = []
        this.formInline.thirdClassifyID = undefined
        return
      }
      this.thirdClasses = this.secondClasses.find(item => item.id === this.formInline.secondClassifyID) && this.secondClasses.find(item => item.id === this.formInline.secondClassifyID)['childs']
      this.formInline.thirdClassifyID = this.thirdClasses[0].id
    },
    clear() {
      this.formInline.shelveState = ''
      this.formInline.productName = ''
      this.formInline.productId = ''
      this.formInline.shopName = ''
      this.formInline.page = 1
      this.formInline.pageSize = 10
      this.formInline.isRecommended = ''
      this.formInline.secondClassifyID = ''
      this.formInline.thirdClassifyID = ''
      this.getAll(this.formInline)
    }
  }
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.tab_show {
  padding-left: 30px;
}
.tableBox {
  padding-right: 30px;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
