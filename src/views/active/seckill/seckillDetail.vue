<!--  -->
<template>
  <div>
    <div class="pending">
      <el-tabs v-model="activeName">
        <el-tab-pane label="活动信息" name="first">
          <div class="shop_info">
            <h3 class="detail_title">活动信息</h3>
            <div class="shopInfo_left">
              <p class="detail_text">
                <span>活动名称：</span>
                <span class="text">{{ form.seckillName }}</span>
              </p>
              <p class="detail_text">
                <span>活动介绍：</span>
                <span class="text">{{ form.remark }}</span>
              </p>
              <p class="detail_text">
                <span>报名时间：</span>
                <span
                  class="text"
                >{{ form.signStartTime }}-{{ form.signEndTime }}</span>
              </p>
              <p class="detail_text">
                <span>起止时间：</span>
                <span
                  class="text"
                >{{ form.startTime }}-{{ form.endTime }}</span>
              </p>
              <p class="detail_text">
                <span>活动保证金：</span>
                <span class="text textColor ">
                  <el-radio-group v-model="form.ifBond">
                    <el-radio :label="1" disabled>需要</el-radio>
                    <el-radio :label="0" disabled>不需要</el-radio>
                  </el-radio-group>
                </span>
              </p>
              <p v-if="form.ifBond" class="detail_text">
                <span>保证金金额：</span>
                <span class="text">{{ form.bondMoney }}</span>
              </p>
              <p class="detail_text">
                <span>活动状态：</span>
                <span v-if="form.state === 0" class="text">报名未开始</span>
                <span v-if="form.state === 1" class="text">报名进行中</span>
                <span v-if="form.state === 2" class="text">活动待开始</span>
                <span v-if="form.state === 3" class="text">活动进行中</span>
                <span v-if="form.state === 4" class="text">活动已结束</span>
              </p>
            </div>
          </div>
          <div class="shop_info">
            <h3 class="detail_title">优惠规则</h3>
            <p class="detail_text">
              <span>优惠方案：</span>
              <span class="text">直降{{ form.seckillMoney }}元</span>
            </p>
            <p class="detail_text">
              <span>是否限购：</span>
              <span class="text textColor ">
                <el-radio-group v-model="form.ifLimit">
                  <el-radio :label="2" disabled>限购</el-radio>
                  <el-radio :label="1" disabled>不限购</el-radio>
                </el-radio-group>
              </span>
            </p>
            <p v-if="form.ifLimit == 2" class="detail_text">
              <span>商品限购：</span>
              <span class="text">限购{{ form.limitNumber || 0 }}人</span>
            </p>
            <p class="detail_text">
              <span>优惠券叠加：</span>
              <span class="text textColor ">
                <el-radio-group v-model="form.ifAdd">
                  <el-radio :label="1" disabled>叠加</el-radio>
                  <el-radio :label="0" disabled>不叠加</el-radio>
                </el-radio-group>
              </span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="参与店铺" name="second">
          <!-- 搜索 -->
          <div class="formSearch">
            <el-form
              :inline="true"
              :model="shopQuery"
              class="demo-form-inline"
            >
              <el-form-item label="店铺名称">
                <el-input
                  v-model="shopQuery.shopName"
                  placeholder="请输入店铺名称"
                />
              </el-form-item>
              <el-form-item label="店铺编码">
                <el-input
                  v-model="shopQuery.shopCode"
                  placeholder="请输入店铺编码"
                />
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select
                  v-model="shopQuery.state"
                  clearable
                  placeholder="请选择审核状态"
                >
                  <el-option label="待审核" value="0" />
                  <el-option label="报名成功" value="1" />
                  <el-option label="报名失败" value="2" />
                  <el-option label="报名进行中" value="3" />
                </el-select>
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
              <el-table-column label="店铺名称" width="220">
                <template slot-scope="scope">{{ scope.row.shopName }}</template>
              </el-table-column>
              <el-table-column prop="shopCode" label="店铺编码" />
              <el-table-column prop="products" label="参与商品数" />
              <el-table-column prop="examines" label="审核次数" />
              <el-table-column label="审核状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.state == 0">待审核</span>
                  <span v-if="scope.row.state == 1">报名成功</span>
                  <span v-if="scope.row.state == 2">报名失败</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="btnList">
                    <el-button
                      type="text"
                      @click="seeMore(scope.row)"
                    >查看商品</el-button>
                    <el-button
                      type="text"
                      @click="checkList(scope.row)"
                    >审核记录</el-button>
                    <el-button
                      v-if="scope.row.state === 0"
                      type="text"
                      @click="examine(scope.row)"
                    >审核</el-button>

                    <el-button
                      v-if="scope.row.state === 1"
                      type="text"
                      @click="liquidation(scope.row)"
                    >清退</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="活动数据" name="third">
          <!-- <List :listdata="chartData" /> -->
          <DetailComponent
            :info-list="infoList"
            @export="exportData"
          >
            <template v-slot:table>
              <div class="table">
                <el-table
                  :data="activityTable"
                  border
                  :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
                  style="width: 100%"
                >
                  >
                  <el-table-column prop="shopName" label="店铺名称" />
                  <el-table-column prop="shopCode" label="店铺编码" />
                  <el-table-column prop="products" label="参与商品数(件)" />
                  <el-table-column prop="persons" label="访客数" />
                  <el-table-column prop="orders" label="提交订单数" />
                  <el-table-column prop="finish" label="成交比数" />
                  <!-- <el-table-column prop="price" label="客单价(元)" /> -->
                  <el-table-column prop="total" label="成交总额" />
                </el-table>
                <div class="fenye">
                  <el-pagination
                    :current-page="chartQuery.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="chartQuery.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="chartTotal"
                    @size-change="changePageChartSize"
                    @current-change="changeChartPage"
                  />
                </div>
              </div>
            </template>
          </DetailComponent>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- ******************************************************弹框开始***************************************************************** -->
    <!-- 审核记录弹框 -->
    <el-dialog
      title="审核记录"
      :visible.sync="checkDIa"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="diaddStyle">
        <el-table
          ref="multipleTable"
          :data="checkLists"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="动态" width="220">
            <template slot-scope="scope">{{
              scope.row.operationDescribtion
            }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" />
          <el-table-column prop="name" label="操作人" />
          <el-table-column prop="remark" label="其他信息" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkDIa = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 活动商品记录弹框 -->
    <el-dialog
      title="活动商品"
      :visible.sync="foodsDia"
      center
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="diaddStyle">
        <el-table
          ref="multipleTable"
          :data="tableDatas"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="产品主图" width="220">
            <template slot-scope="scope">
              <img :src="scope.row.image" width="50" height="50" alt srcset>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="productId" label="产品id" />
          <el-table-column prop="price" label="售价(元)" />
          <el-table-column prop="originalPrice" label="原价(元)" />
          <el-table-column prop="stockNumber" label="库存(件)" />
          <el-table-column prop="volume" label="累计销量(件)" />
          <el-table-column label="上架状态">
            <template slot-scope="scope">
              <span v-if="scope.row.shelveState == 1">上架</span>
              <span v-if="scope.row.shelveState == 0">下架</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="currentPages"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totals"
            @size-change="handleSizeChanges"
            @current-change="handleCurrentChanges"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="foodsDia = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 审核清退 -->
    <el-dialog
      :title="checkObj.title"
      :visible.sync="checkObj.show"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <div v-if="checkObj.type === 1" class="diaddStyle">
        <el-form ref="form" :model="addform" label-width="80px">
          <el-form-item label="审核状态">
            <el-radio-group v-model="addform.state">
              <el-radio label="1">报名成功</el-radio>
              <el-radio label="2">报名失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addform.remark" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="diaddStyle">
        <div class="text">确认要清退本商家吗？</div>
        <div class="text">清退后商家的所有商品将退出本次活动</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enter">确定</el-button>
        <el-button @click="checkDIa = checkObj.show = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  activeGetExamines,
  activeGetProducts,
  activeLiquidation,
  activExamine
} from '@/api/active'
import {
  getSeckillDetail,
  getSeckillShop,
  getSeckillChart,
  exportSeckillData
} from '@/api/active/active_seckill.js'
// import List from '../component'
import DetailComponent from '@/views/active/component/detail.vue'
export default {
  components: {
    // List,
    DetailComponent
  },
  data() {
    // 这里存放数据
    return {
      activeName: 'first',
      radio: '1',
      query: {
        seckillName: '', // 活动名称
        // 活动状态 0-报名未开始 1-报名进行中 2-活动待开始 3-活动进行中 4-活动已结束
        state: '',
        page: 1,
        pageSize: 10
      },
      addform: {
        signId: '', // 报名id
        state: '1', // 审核状态 1-报名成功 2-报名失败
        remark: '' // 备注
      },
      checkObj: {},
      form: {},
      shopQuery: {
        'page': 1,
        'pageSize': 10,
        'seckillId': 0, // 平台秒杀活动id
        'shopCode': '', // 店铺编码
        'shopName': '', // 店铺名称
        'state': '', // 审核状态 0-待审核 1-报名成功 2-报名失败 3-报名进行中(未支付)
        'signType': 2 // 1-平台优惠券 2-平台秒杀 3-平台限时折扣
      },
      tableData: [],
      tableDatas: [],
      checkLists: [],
      total: 1,
      totals: 1,
      currentPage: 1,
      currentPages: 1,
      checkDIa: false,
      foodsDia: false,
      signId: '',
      activityTable: [],
      infoList: [
        { name: '', value: '', fields: 'money' }
      ],
      chartTotal: 1,
      chartQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {
    seckillId() {
      return this.$route.query.info.seckillId || 0
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDetails()
    this.getChartData()
    this.shopQuery.seckillId = this.seckillId
    this.getShopsData()
  },
  methods: {
    handleSizeChange(val) {
      this.shopQuery.pageSize = val
      this.getShopsData()
    },
    handleCurrentChange(val) {
      this.shopQuery.page = val
      this.getShopsData()
    },
    // 查询
    search() {
      this.total = 1
      this.shopQuery.page = 1
      this.getShopsData()
    },
    // 审核记录
    async checkList(row) {
      this.checkDIa = true
      const res = await activeGetExamines({
        only: `${row.shopId}-${row.activityId}-${row.signId}`
      })
      this.checkLists = res.data
    },
    // 查看活动商品
    seeMore(row) {
      this.foodsDia = true
      this.signId = row.signId
      this.getProducts({
        signId: this.signId,
        page: 1,
        pageSize: 10
      })
    },
    // 活动商品分页
    handleSizeChanges(val) {
      this.getProducts({
        signId: this.signId,
        page: 1,
        pageSize: val
      })
    },
    // 活动商品分页
    handleCurrentChanges(val) {
      this.getProducts({
        signId: this.signId,
        page: val,
        pageSize: 10
      })
    },
    // 处理
    async examine(row) {
      this.addform.signId = row.signId
      this.checkObj = {
        title: '审核',
        show: true,
        arr: row,
        type: 1
      }
    },
    // 清退
    async liquidation(row) {
      this.checkObj = {
        title: '清退',
        show: true,
        arr: row,
        type: 2
      }
    },
    // 确定
    async enter() {
      if (this.checkObj.type === 1) {
        const res = await activExamine(this.addform)
        if (res.code === '') {
          this.$message({
            message: '处理成功',
            type: 'success'
          })
          this.checkObj.show = false
          this.getShopsData()
        }
      } else {
        const res = await activeLiquidation({
          signId: this.checkObj.arr.signId
        })
        if (res.code === '') {
          this.$message({
            message: '清退成功',
            type: 'success'
          })
          this.checkObj.show = false
          this.getShopsData()
        }
      }
    },
    // 活动信息查询
    async getDetails() {
      const res = await getSeckillDetail({ seckillId: this.seckillId })
      this.form = res.data
    },
    // 查询参数店铺
    async getShopsData() {
      const res = await getSeckillShop(this.shopQuery)
      this.tableData = res.data.list
      this.total = res.data.total
    },
    // 初始化查询所有活动商品
    async getProducts(formInline) {
      const res = await activeGetProducts(formInline)
      this.tableDatas = res.data.list
      this.totals = res.data.total
    },
    async getChartData() {
      const data = Object.assign(
        {},
        { seckillId: this.seckillId },
        this.chartQuery
      )
      const res = await getSeckillChart(data)
      this.activityTable = this.formateTableList(res.data.shopDataDetails.list)
      this.chartTotal = res.data.shopDataDetails.total
      this.infoList = this.formateInfoList(res)
    },
    changeChartPage(val) {
      this.chartQuery.page = val
      this.getChartData()
    },
    changePageChartSize(val) {
      this.chartQuery.pageSize = val
      this.getChartData()
    },
    // 格式化卡片统计渲染
    formateInfoList(res) {
      return [
        {
          name: '浏览量',
          value: res.data.visit || 0
        },
        {
          name: '支付订单数',
          value: res.data.orders || 0
        },
        {
          name: '	支付买家数',
          value: res.data.pays || 0
        },
        {
          name: '支付转化率',
          value: res.data.conversion || 0
        },
        {
          name: '参与商家数',
          value: res.data.shops || 0
        },
        {
          name: '参与商品数',
          value: res.data.products || 0
        },
        {
          name: '活动成交金额',
          value: res.data.total || 0
        }
      ]
    },
    formateTableList(res) {
      if (!Array.isArray(res)) {
        return res
      }
      return res.map(item => {
        return {
          shopName: item.shopName,
          shopCode: item.shopCode,
          products: item.products,
          persons: item.persons,
          orders: item.orders,
          finish: item.finish,
          total: item.total
        }
      })
    },
    async exportData() {
      const res = await exportSeckillData({ seckillId: this.seckillId })
      if (!res) {
        return
      }
      const blob = new Blob([res])
      const fileName = '商家数据明细表.xlsx'
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.pending {
  padding: 30px;
}
.fenye {
  margin-top: 20px;
}
.diaddStyle {
  .text {
    text-align: center;
  }
}
.detail_title {
  font-size: 22px;
  color: #333333;
  position: relative;
  margin: 50px 20px 20px;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 5px;
    left: -20px;
    width: 4px;
    height: 24px;
    background-color: #3a68f2;
  }
}
.detail_text {
  padding: 0 120px;
  //  font-size: 16px;
  .text {
    color: #666666;
    line-height: 40px;
    margin-left: 20px;
  }
  .Margin{
    margin-left: 90px;
  }
}
.shop_info{
  overflow: hidden;
  .shopInfo_left{
    float: left;
  }
}
.mf {
  margin-left: 20px;
  .el-tag{
    margin-bottom: 20px;
  }
}
// radio默认选中修改颜色
.el-radio__input.is-disabled+span.el-radio__label {
    color: #409EFF !important;
}

</style>
