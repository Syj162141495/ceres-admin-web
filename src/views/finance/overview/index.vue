<template>
  <div class="custom_page">
    <div class="content">
      <div class="cardLIst">
        <div v-for="(item, index) in cardList" :key="index" class="cardItem">
          <div class="cardDetal">
            <div class="cardMoney">{{ item.money }}</div>
            <div class="cardText">
              <span>{{ item.name }}</span>
              <img src="../../../assets/images/shuoming.png">
            </div>
          </div>
        </div>
      </div>
      <!-- 顶部搜索 -->
      <div class="toolbar">
        <!-- 顶部搜索 -->
        <el-form :inline="true" :model="formInline">
          <el-form-item label="商家名称">
            <el-input v-model="formInline.shopName" placeholder="请输入商家名称" />
          </el-form-item>
          <el-form-item label="商家编码">
            <el-input v-model="formInline.shopCode" placeholder="请输入商家编码" />
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
            <el-table-column prop="shopName" label="商家名称" />
            <el-table-column prop="shopCode" label="商家编码" />
            <el-table-column prop="revenue" label="营收总额" />
            <el-table-column prop="frozen" label="冻结金额" />
            <el-table-column prop="haveWithdrawable" label="已提现金额" />
            <el-table-column prop="refund" label="已退款金额" />
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
  </div>
</template>

<script>
// import { getShopId } from '@/utils/auth'
import { overviewGetall } from '@/api/overview'
export default {
  data() {
    return {
      cardList: [
        {
          name: '营收总额',
          money: '0.00',
          field: 'revenue'
        },
        {
          name: '冻结总金额',
          money: '0.00',
          field: 'frozen'
        },
        {
          name: '可提现金额',
          money: '0.00',
          field: 'withdrawable'
        },
        {
          name: '已提金额',
          money: '0.00',
          field: 'haveWithdrawable'
        },
        {
          name: '已退款金额',
          money: '0.00',
          field: 'refund'
        }
      ],
      formInline: {
        shopName: '', // 商家名称
        shopCode: '', // 商家编码
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      currentPage: 1
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
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        shopName: '', // 商家名称
        shopCode: '', // 商家编码
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    getTopList(o) {
      this.cardList.map(item => {
        item.money = o[item.field]
      })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await overviewGetall(formInline)
      this.tableData = res.data.page.list
      this.total = res.data.page.total
      this.getTopList(res.data)
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../../styles/elDialog.scss");
.custom_page {
  padding: 20px;
}

.cardLIst {
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .cardItem {
    padding: 20px;
  }
  .cardDetal {
    .cardMoney {
      font-size: 40px;
      font-weight: bold;
      color: #ffae11;
      margin-bottom: 20px;
      text-align: center;
    }
    .cardText {
      font-size: 18px;
      display: flex;
      color: #333333;
      img {
        width: 20px;
        height: 20px;
        margin-left: 5px;
      }
    }
  }
}
</style>

