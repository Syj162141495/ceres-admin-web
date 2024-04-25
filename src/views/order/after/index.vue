<!--  -->
<template>
  <div>
    <div class="pending">
      <div class="acTab">
        <el-tabs v-model="formInline.state" @tab-click="handleClick">
          <el-tab-pane label="待处理" name="0" />
          <el-tab-pane label="已处理" name="1" />
        </el-tabs>
      </div>
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="店铺名称/编号">
            <el-input v-model="formInline.shopName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="订单id">
            <el-input v-model="formInline.orderFormid" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="formInline.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="订单id" width="220">
            <template slot-scope="scope">{{ scope.row.orderFormid }}</template>
          </el-table-column>
          <el-table-column prop="shopName" label="店铺名称" width="220" />
          <el-table-column prop="shopCode" label="店铺编码" width="220" />
          <el-table-column prop="number" label="退款商品数量" width="220" />
          <el-table-column prop="refundMoney" label="退款金额（元）" width="220" />
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btnList">
                <el-button
                  v-if="formInline.state ==='0'"
                  type="text"
                  @click="seeMore(scope.row,1)"
                >处理</el-button>
                <el-button v-else type="text" @click="seeMore(scope.row,2)">查看</el-button>
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
import { afterGetAll } from '@/api/after'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      formInline: {
        state: '0', // 处理状态 0-待处理 1-已处理
        shopName: '', // 店铺名称或编号
        orderFormid: '', // 订单编号
        dates: [], // 申请时间数组
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      currentPage: 1
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getAll(this.formInline)
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
      console.log(tab, event)
      this.formInline.state = tab.name
      this.getAll(this.formInline)
    },
    //  查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 查看
    seeMore(row, index) {
      row.type = index
      this.$router.push({
        name: 'afterDetails',
        query: { info: row }
      })
    },
    // 编辑
    edit() {},
    // 删除
    del() {},
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await afterGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.pending {
  padding: 30px;
}
.fenye {
  margin-top: 20px;
}
</style>
