<template>
  <div class="custom_page">
    <div class="content">
      <!-- 顶部搜索 -->
      <div class="toolbar">
        <!-- 顶部搜索 -->
        <el-form :inline="true" :model="formInline">
          <el-form-item label="用户名称">
            <el-input v-model="formInline.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formInline.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="提现状态">
            <el-select v-model="formInline.state" placeholder="请选择">
              <el-option label="全部" :value="null" />
              <el-option label="待审核" value="0" />
              <el-option label="通过" value="1" />
              <el-option label="拒绝" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--  表格 -->
      <div class="content_table">
        <div class="table">
          <el-table
            :data="tableData"
            border
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            style="width: 100%"
          >
            >
            <el-table-column prop="name" label="用户名称" />
            <el-table-column prop="phone" label="手机号码" />
            <el-table-column prop="withdrawalMoney" label="提现金额" />
            <el-table-column label="处理状态">
              <template slot-scope="scope">
                <span v-if="scope.row.state == 0">审核中</span>
                <span v-if="scope.row.state == 1">通过</span>
                <span v-if="scope.row.state == 2">拒绝</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="btnList">
                  <el-button
                    v-if="scope.row.state !== 0 "
                    type="text"
                    @click="seeMore(scope.row)"
                  >查看</el-button>
                  <el-button v-else type="text" @click="del(scope.row)">处理</el-button>
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
    <!-- *****************弹框开始***************** -->
    <!-- 详情弹框 -->
    <el-dialog
      :visible.sync="dioObj.show"
      :title="dioObj.title"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div class="box">
        <div class="dioBox">
          <div
            v-for="(item,index) in infoList"
            :key="index"
            class="inner"
          >{{ item.name }}:{{ item.value }}</div>
        </div>
        <div v-if="dioObj.type === 2" class="botTitle">*请确认您已转账成功，再点击确认</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dioObj.type === 2" type="primary" @click="agreeEn(1)">确认打款</el-button>
        <el-button v-if="dioObj.type === 2" type="danger" @click="agreeEn(2)">拒绝打款</el-button>
        <el-button v-if="dioObj.type === 1" @click="dioObj.show = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getShopId } from '@/utils/auth'
import {
  applicationGetAll,
  applicationGetById,
  applicationHandle
} from '@/api/application'
export default {
  data() {
    return {
      formInline: {
        name: '', // 用户名称
        phone: '', // 手机号码
        state: null, // 提现状态 空-全部 0-待审核 1-通过 2-拒绝
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      infoList: [
        { name: '手机号码', value: '', fields: 'phone' },
        { name: '银行名称', value: '', fields: 'bankName' },
        { name: '银行卡号', value: '', fields: 'bankCard' },
        { name: '收款人姓名', value: '', fields: 'name' },
        { name: '提现金额', value: '', fields: 'withdrawalMoney' },
        { name: '申请时间', value: '', fields: 'applyTime' },
        { name: '处理时间', value: '', fields: 'handleTime' }
      ],
      currentPage: 1,
      multipleSelection: [],
      dioObj: {}
    }
  },
  created() {
    this.getAll(this.formInline)
  },
  methods: {
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
        name: '', // 用户名称
        phone: '', // 手机号码
        state: null, // 提现状态 空-全部 0-待审核 1-通过 2-拒绝
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    getTopList(o) {
      this.infoList.map(item => {
        item.value = o[item.fields]
      })
    },
    // 查看
    seeMore(row) {
      this.dioObj = {
        title: '查看',
        show: true,
        arr: row,
        type: 1
      }
      this.getDetails(row.withdrawalId)
    },
    // 处理
    del(row) {
      this.dioObj = {
        title: '处理',
        show: true,
        arr: row,
        type: 2
      }
      this.getDetails(row.withdrawalId)
    },
    // 确认
    async agreeEn(index) {
      if (index === 1) {
        const res = await applicationHandle({
          withdrawalId: this.dioObj.arr.withdrawalId,
          state: 1
        })
        if (res.code === '') {
          this.$message.success('成功确认打款')
          this.dioObj.show = false
          this.getAll(this.formInline)
        }
      } else if (index === 2) {
        const res = await applicationHandle({
          withdrawalId: this.dioObj.arr.withdrawalId,
          state: 2
        })
        if (res.code === '') {
          this.$message.success('成功拒绝打款')
          this.dioObj.show = false
          this.getAll(this.formInline)
        }
      }
    },
    // 查询详情
    async getDetails(withdrawalId) {
      const res = await applicationGetById({ withdrawalId })
      if (res.code === '') {
        this.details = res.data
        this.getTopList(res.data)
      }
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await applicationGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../../styles/elDialog.scss");
.custom_page {
  padding: 20px;
}
.box {
  .dioBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .inner {
      width: 50%;
      padding: 20px;
    }
  }
  .botTitle {
    color: red;
    text-align: center;
  }
}
</style>

