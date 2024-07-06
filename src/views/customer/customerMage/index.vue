<template>
  <div class="custom_page">
    <div class="content">
      <!-- 顶部搜索 -->
      <div class="toolbar">
        <!-- 顶部搜索 -->
        <el-form :inline="true" :model="formParams">
          <el-form-item label="客户昵称">
            <el-input v-model="formParams.name" placeholder="请输入客户昵称" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formParams.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="formParams.labelId" placeholder="请选择">
              <el-option
                v-for="(item, index) in tipsList"
                :key="index"
                :label="item.labelName"
                :value="item.buyerLabelId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最近消费时间">
            <el-date-picker
              v-model="formParams.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-form-item label="累计消费金额">
              <el-input v-model="formParams.minMoney" placeholder="请输入最小值" />
            </el-form-item>
            <el-form-item label="-">
              <el-input v-model="formParams.maxMoney" placeholder="请输入最大值" />
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-form-item label="购买次数">
              <el-input v-model="formParams.minBuyers" type="number" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入最小值" />
            </el-form-item>
            <el-form-item label="-">
              <el-input v-model="formParams.maxBuyers" type="number" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入最大值" />
            </el-form-item>
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
            :cell-style="cellStyle"
            style="width: 100%"
            size="mini"
          >
            <!-- <el-table-column prop="name" label="客户昵称" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="total" label="消费总额" />
            <el-table-column prop="buyers" label="购买次数" />
            <el-table-column prop="time" label="最近消费时间" />
            <el-table-column prop="createTime" label="注册时间" /> -->
            <!--<el-table-column prop="memberLevelName" label="客户等级" />-->
            <el-table-column prop="name" label="客户昵称" min-width="100" />
            <el-table-column prop="sex" label="性别" min-width="80" align="center" />
            <el-table-column prop="phone" label="手机号" min-width="100" align="center" /> <!--中间四位-->
            <el-table-column prop="age" label="年龄" min-width="80" align="center" />
            <el-table-column prop="cid" label="身份证" min-width="200" align="center" /> <!--中间6位-->
            <el-table-column prop="address" label="地址" min-width="150" show-overflow-tooltip />
            <el-table-column prop="total" label="消费总额" min-width="80" align="center" />
            <el-table-column prop="buyers" label="服务次数" min-width="80" align="center" />
            <el-table-column prop="time" label="最近消费时间" min-width="150" />
            <el-table-column prop="createTime" label="注册时间" min-width="150" />
            <el-table-column prop="sourcePlatform" label="平台来源" min-width="150" />
            <el-table-column label="操作" fixed="right" width="220px" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click.native.prevent="details(scope.row)">详情</el-button>
                <el-button type="text" @click.native.prevent="makeTag(scope.row.buyerUserId)">打标签</el-button>
                <el-button type="text" @click.native.prevent="addBlackList(scope.row)">
                  {{
                    scope.row.ifBlack ? "取消黑名单" : "加入黑名单"
                  }}
                </el-button>
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
    <!-- *************对话框开始************* -->
    <!-- 打标签 -->
    <el-dialog
      title="选择标签"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div>
        <!-- 表单搜索 -->
        <el-form :inline="true" :model="tipsForm" class="demo-form-inline">
          <el-form-item label="标签名称">
            <el-input v-model="tipsForm.labelName" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item>
            <el-button @click="searchTips">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="runTips">管理标签</el-button>
          </el-form-item>
        </el-form>
        <!-- 多选 -->
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(item,index) in tipsList"
            :key="index"
            class="checkBoxStyle"
            :label="item.buyerLabelId"
          >{{ item.labelName }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveTips">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  customerMageGetAll,
  getLabels,
  customerSaveUserLabel,
  customerBlacklist
} from '@/api/customerMage'
// import { getSelect } from '../../../api/renovation'
export default {
  data() {
    return {
      showMore: false,
      formParams: {
        name: '', // 用户昵称
        // sex: '', //性别
        // age: '', //年龄
        // cid: '', //身份证
        // address: '', //地址
        phone: '', // 手机号
        labelId: '', // 标签id
        dates: [], // 最近消费时间日期数组
        minMoney: '', // 累计消费金额最小值
        maxMoney: '', // 累计消费金额最大值
        minBuyers: '', // 购买次数最小值
        maxBuyers: '', // 购买次数最大值
        startTime: '', // 申请开始时间
        endTime: '', // 申请结束时间
        page: 1,
        pageSize: 10
      },
      tipsForm: {
        labelName: ''
      },
      date: [],
      total: 1,
      tableData: [],
      currentPage: 1,
      dialog: {},
      tipsList: [],
      checkList: [],
      addFormDialog: false,
      buyerUserId: '',
      truephone: ''
    }
  },
  created() {
    this.getAll(this.formParams)
    this.getSelect({ labelName: '' })
  },
  methods: {
    handleSizeChange(val) {
      this.formParams.pageSize = val
      this.getAll(this.formParams)
    },
    handleCurrentChange(val) {
      this.formParams.page = val
      this.getAll(this.formParams)
    },
    // 查询
    search() {
      this.total = 1
      this.formParams.page = 1
      this.getAll(this.formParams)
    },
    // 查询标签
    searchTips() {
      console.log(this.tipsForm)
      this.getSelect({ labelName: this.tipsForm.labelName })
    },
    // 打标签
    async saveTips(row) {
      console.log(this.checkList)
      const res = await customerSaveUserLabel({
        buyerUserId: this.buyerUserId,
        buyerLabelIds: this.checkList
      })
      if (res.code === '') {
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.checkList = []
        this.addFormDialog = false
      }
    },
    // 加入黑名单
    addBlackList(row) {
      //  "ifBlack": "是否加入黑名单 1-是 0-否"
      console.log(row.ifBlack)
      this.$confirm(
        `${row.ifBlack
          ? '确认是否取消黑名单'
          : '加入黑名单后，对方将无法登录商城'
        }`,
        `${row.ifBlack ? '取消黑名单' : '加入黑名单'}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          if (!row.ifBlack) {
            customerBlacklist({
              buyerUserId: row.buyerUserId,
              ifBlack: 1
            }).then(res => {
              if (res.code === '') {
                this.$message({
                  type: 'success',
                  message: '成功!'
                })
                this.getAll(this.formParams)
              }
            })
          } else {
            customerBlacklist({
              buyerUserId: row.buyerUserId,
              ifBlack: 0
            }).then(res => {
              if (res.code === '') {
                this.$message({
                  type: 'success',
                  message: '成功!'
                })
                this.getAll(this.formParams)
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 跳转标签页面
    runTips() {
      this.$router.push({
        name: 'tips'
      })
    },
    // 清除
    clear() {
      this.formParams = {
        name: '', // 用户昵称
        phone: '', // 手机号
        labelId: '', // 标签id
        dates: [], // 最近消费时间日期数组
        minMoney: '', // 累计消费金额最小值
        maxMoney: '', // 累计消费金额最大值
        minBuyers: '', // 购买次数最小值
        maxBuyers: '', // 购买次数最大值
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formParams)
    },
    // 打标签
    makeTag(buyerUserId) {
      this.addFormDialog = true
      this.buyerUserId = buyerUserId
    },
    details(row) {
      // this.$router.push({
      //   name: 'customerDetails',
      //   params: { buyerUserId: row.buyerUserId, orderFormid: row.orderFormid }
      // })
      const url = 'http://172.16.16.98:90/baseinfo?phone=' + this.truephone
      window.open(url, '_blank')
    },
    hidePhone(phone) {
      this.truephone = phone
      if (phone && phone.length === 11) {
        return phone.substring(0, 3) + '****' + phone.substring(7)
      }
      return phone
    },
    hideIdCard(cid) {
      if (cid && cid.length === 18) {
        return cid.substring(0, 6) + '******' + cid.substring(12)
      }
      return cid
    },
    // 初始化查询所有数据
    async getAll(formParams) {
      const res = await customerMageGetAll(formParams)
      this.tableData = res.data.list.map(item => ({
        ...item,
        cid: this.hideIdCard(item.cid),
        phone: this.hidePhone(item.phone)
      }))
      this.total = res.data.total
    },
    // 初始化查询所有标签
    async getSelect(name) {
      const res = await getLabels(name)
      this.tipsList = res.data
    },
    // 调整具体单元格的样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'sourcePlatform') {
        return 'background:pink;color:green !important;font-size:16px;'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../../styles/elDialog.scss");
.custom_page {
  padding: 20px;
}
.checkBoxStyle {
  margin-bottom: 20px;
}
</style>

