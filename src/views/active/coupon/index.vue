<template>
  <div class="couponPage">
    <!-- 搜索 -->
    <div class="formSearch">
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="query.discountName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="query.state" placeholder="请选择活动状态">
            <el-option
              v-for="item in activityStatusSelect"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button plain @click="clear">重置</el-button>
          <el-button type="primary" plain @click="addActivity">新建活动</el-button>
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
        <el-table-column label="活动名称" width="220">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0">报名未开始</span>
            <span v-if="scope.row.state == 1">报名进行中</span>
            <span v-if="scope.row.state == 2">活动待开始</span>
            <span v-if="scope.row.state == 3">活动进行中</span>
            <span v-if="scope.row.state == 4">活动已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="discountMode" label="营销方式">
          <template slot-scope="scope">
            <span v-if="scope.row.discountMode == 1">满减</span>
            <span v-if="scope.row.discountMode == 2">优惠券</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopNumber" label="商家数" />
        <el-table-column prop="productNumber" label="商品数量" />
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="btnList">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
              <el-button v-if="scope.row.state != 4" type="text" @click="editActivity(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.state != 4" type="text" @click="endActivity(scope.row)">结束</el-button>
              <el-button v-if="scope.row.state == 4" type="text" @click="delActivity(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination
          :current-page="query.page"
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
import {
  getCouponData,
  endCoupon,
  delCoupon
} from '@/api/active/active_coupon.js'
export default {
  data() {
    return {
      query: {
        discountName: '', // 活动名称
        // 活动状态 0-报名未开始 1-报名进行中 2-活动待开始 3-活动进行中 4-活动已结束
        state: '',
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      activityStatusSelect: [
        {
          index: 0,
          label: '报名未开始',
          value: 0
        },
        {
          index: 1,
          label: '报名进行中',
          value: 1
        },
        {
          index: 2,
          label: '活动待开始',
          value: 2
        },
        {
          index: 3,
          label: '活动进行中',
          value: 3
        },
        {
          index: 4,
          label: '活动已结束',
          value: 4
        }
      ],
      currentPage: 1
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    async getAll() {
      const res = await getCouponData(this.query)
      this.tableData = res.data.list
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.getAll()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.getAll()
    },
    search() {
      this.total = 1
      this.query.page = 1
      this.getAll()
    },
    // 重置
    clear() {
      this.query = {
        discountName: '',
        state: '',
        page: 1,
        pageSize: 10
      }
      this.getAll()
    },
    // 添加活动
    details(row) {
      this.$router.push({
        path: '/active/couponlist/couponDetail',
        query: { id: row.activityId }
      })
    },
    // 添加活动
    addActivity() {
      this.$router.push({
        path: '/active/couponlist/add'
      })
    },
    editActivity(row) {
      this.$router.push({
        path: '/active/couponlist/add',
        query: { info: row }
      })
    },
    async endActivity(row) {
      const res = await endCoupon({ activityId: row.activityId })
      if (res.code === '') {
        this.$message({
          message: '结束成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.getAll()
    },
    async delActivity(row) {
      const res = await delCoupon({ activityId: row.activityId })
      if (res.code === '') {
        this.$message({
          message: '结束成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      this.getAll()
    }
  }
}
</script>

<style lang="scss" scoped>
.couponPage{
  padding: 30px;
  .tableBox{
    .fenye{
      margin: 20px;
    }
  }
}
</style>
