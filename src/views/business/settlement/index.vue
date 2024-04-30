<!--  -->
<template>
  <div class="pdl">
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="0" />
      <el-tab-pane label="已通过" name="1" />
      <el-tab-pane label="已拒绝" name="2" />
    </el-tabs>
    <!-- 搜索 -->
    <div class="formSearch">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="服务商名称">
          <el-input
            v-model="formInline.shopName"
            placeholder="请输入服务商名称"
          />
        </el-form-item>
        <el-form-item label="注册手机号">
          <el-input
            v-model="formInline.shopPhone"
            placeholder="请输入注册手机号"
          />
        </el-form-item>
        <el-form-item label="服务商类型">
          <el-select
            v-model="formInline.authenType"
            clearable
            placeholder="请选择"
          >
            <el-option label="个人" value="1" />
            <el-option label="个体工商户" value="2" />
            <el-option label="企业" value="3" />
            <el-option label="其他组织" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="formInline.dates"
            type="datetimerange"
            value-format="yyyy-MM-dd"
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
        <el-table-column label="服务商名称" width="220">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column>
        <el-table-column label="服务商类型">
          <template slot-scope="scope">
            <span v-if="scope.row.authenType == 1">个人</span>
            <span v-if="scope.row.authenType == 2">个体工商户</span>
            <span v-if="scope.row.authenType == 3">企业</span>
            <span v-if="scope.row.authenType == 4">其他组织</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopPhone" label="注册手机号" />
        <el-table-column prop="createTime" label="申请时间" />
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button
                v-if="activeName == 0"
                type="text"
                @click="handleDel(scope.row)"
              >处理</el-button>
              <el-button
                v-if="activeName == 1 || activeName == 2"
                type="text"
                @click="handleDel(scope.row)"
              >查看</el-button>
              <el-button
                v-if="activeName == 1 || activeName == 2"
                type="text"
                @click="delet(scope.row)"
              >删除</el-button>
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
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { settlementGetAll, settlementDelete } from '@/api/business'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      activeName: '0',
      formInline: {
        shopName: '', // 服务商名称
        shopPhone: '', // 注册手机号
        authenType: '', // 服务商类型 1-个人 2-个体工商户 3-企业 4-其他组织
        dates: [], // 时间数组
        checkState: '0', // 入驻处理状态 0-未处理 1-通过 2-拒绝
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
      console.log(tab.index)
      this.formInline.checkState = tab.index
      this.getAll(this.formInline)
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 处理
    handleDel(row) {
      console.log(row)
      this.$router.push({
        name: 'addSettlement',
        params: { shopId: row.shopId }
      })
    },
    // 删除
    async delet(row) {
      const res = await settlementDelete({ checkId: row.checkId })
      if (res.code === '') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getAll(this.formInline)
      }
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await settlementGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.pdl {
  padding-left: 20px;
}
</style>
