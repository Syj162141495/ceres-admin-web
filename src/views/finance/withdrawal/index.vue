<!--  -->
<template>
  <div class="pdl">
    <!-- 搜索 -->
    <div class="formSearch">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="店铺名称">
          <el-input v-model="formInline.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="店铺编码">
          <el-input v-model="formInline.shopCode" placeholder="请输入店铺编码" />
        </el-form-item>

        <el-form-item label="提现日期">
          <el-date-picker
            v-model="formInline.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="formInline.state" placeholder="请选择">
            <el-option label="已处理" value="1" />
            <el-option label="未处理" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="success" plain @click="clear">重置</el-button>
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
        <el-table-column label="店铺名称" width="220">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column>
        <el-table-column prop="shopCode" label="店铺编码" />
        <el-table-column prop="withdrawalMoney" label="提现金额" />
        <el-table-column prop="state" label="处理状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">已处理</span>
            <span v-if="scope.row.state == 0">未处理</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button type="text" @click="seeMore(scope.row)">查看</el-button>
              <el-button v-if="scope.row.state == 0" type="text" @click="desh(scope.row)">处理</el-button>
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
    <!-- *************对话框开始************* -->
    <!-- 提现申请查询 -->
    <el-dialog
      :title="useState ? '查看' : '提现'"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div class="seeModel">
        <div class="leftBox">
          <div class="line">店铺名称：{{ withDetails.shopName }}</div>
          <div class="line">银行名称：{{ withDetails.bankName }}</div>
          <div class="line">收款人姓名：{{ withDetails.collectionName }}</div>
          <div class="line">申请时间：{{ withDetails.applyTime }}</div>
        </div>
        <div class="rightBox">
          <div class="line">店铺编码：{{ withDetails.shopCode }}</div>
          <div class="line">银行卡号：{{ withDetails.bankCard }}</div>
          <div class="line">体现金额：{{ withDetails.withdrawalMoney }}</div>
          <div class="line" v-if="withDetails.handleTime">处理时间：{{ withDetails.handleTime }}</div>
        </div>
      </div>
      <div v-if="!useState" class="titleLIne">* 请确认您已转账成功，再点击确认</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button v-if="!useState" type="primary" @click="handle_save">确认打款</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导
// 入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  withdrawalGetAll,
  withdrawalGetById,
  withdrawalHandle
} from '@/api/withdrawal'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      formInline: {
        shopName: '', // 店铺名称
        shopCode: '', // 店铺编号
        startTime: '', // 申请时间数组
        state: '', // 处理状态 1-已处理 0-未处理
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      addFormDialog: false,
      useState: 1,
      withDetails: ''
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
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        shopName: '', // 店铺名称
        shopCode: '', // 店铺编号
        dates: [], // 申请时间数组
        state: '', // 处理状态 1-已处理 0-未处理
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    // 查看
    async seeMore(row) {
      this.useState = 1
      this.addFormDialog = true
      const res = await withdrawalGetById({ withdrawalId: row.withdrawalId })
      this.withDetails = res.data
    },
    // 处理
    async desh(row) {
      this.useState = 0
      this.addFormDialog = true
      const res = await withdrawalGetById({ withdrawalId: row.withdrawalId })
      this.withDetails = res.data
    },
    async handle_save() {
      const res = await withdrawalHandle({
        withdrawalId: this.withDetails.withdrawalId
      })
      if (res.code === '') {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.addFormDialog = false
        this.getAll(this.formInline)
      }
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await withdrawalGetAll(formInline)
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
  padding: 20px;
}
.seeModel {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: 16px;
  .leftBox {
    padding: 20px;
  }
  .rightBox {
    padding: 20px;
  }
  .line {
    padding: 10px;
  }
}
.titleLIne {
  color: red;
  font-size: 16px;
  text-align: center;
}
</style>
