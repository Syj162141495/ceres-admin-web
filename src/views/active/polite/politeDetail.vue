<!--  -->
<template>
  <div>
    <div class="pending">
      <el-tabs v-model="activeName">
        <el-tab-pane label="活动信息" name="first">
          <div class="shop_info">
            <h3 class="detail_title">店铺信息</h3>
            <div class="shopInfo_left">
              <p class="detail_text">
                <span>活动名称：</span>
                <span class="text">{{ form.politeName }}</span>
              </p>
              <p class="detail_text">
                <span>活动备注：</span>
                <span class="text">{{ form.remark }}</span>
              </p>
              <p class="detail_text">
                <span>起止时间：</span>
                <span
                  class="text"
                >{{ form.startTime }}-{{ form.endTime }}</span>
              </p>
            </div>
            <div class="shopInfo_right">
              <img :src="form.image" alt="">
            </div>
          </div>
          <div class="shop_info">
            <h3 class="detail_title">优惠规则</h3>
            <p class="detail_text">
              <span>优惠方式：</span>
              <span v-if="form.buyerMode === 1" class="text">
                按结算金额优惠
              </span>
              <span v-if="form.buyerMode === 2" class="text">
                按结算数量优惠
              </span>
            </p>
            <p class="detail_text">
              <span>优惠门槛：</span>
              <span v-if="form.buyerMode === 1" class="text">
                满{{ form.buyer }}元
              </span>
              <span v-if="form.buyerMode === 2" class="text">
                满{{ form.buyer }}件
              </span>
            </p>
            <p class="detail_text">
              <span>优惠内容：</span>
              <span class="text">
                <el-table
                  ref="multipleTable"
                  :data="couponList"
                  border
                  :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
                  tooltip-effect="dark"
                  style="width: 700px"
                >
                  <el-table-column prop="activityName" label="优惠券名称" />
                  <el-table-column label="优惠类型" width="220">
                    <template slot-scope="scope">
                      <span v-if=" scope.row.activityType === 1">满减</span>
                      <span v-if=" scope.row.activityType === 2">折扣</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="优惠券内容">
                    <template slot-scope="scope">
                      <span v-if="scope.row.activityType === 1">
                        满{{ scope.row.threshold }} 减 {{ scope.row.couponContent }}
                      </span>
                      <span v-if="scope.row.activityType === 2">
                        满{{ scope.row.threshold }} 打 {{ scope.row.couponContent }}折
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="endTime" label="到期时间" />
                </el-table>
              </span>
            </p>
            <p class="detail_text">
              <span>优惠内容：</span>
              <span class="text">
                {{ form.growth }}点成长值
              </span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="活动数据" name="third">
          <!-- <List :list-id="info" /> -->
          <DetailComponent
            :list="activityTable"
            :info-list="infoList"
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
                  <el-table-column prop="name" label="用户名称" />
                  <el-table-column prop="phone" label="用户手机号" />
                  <el-table-column prop="number" label="获取优惠券数量" />
                  <el-table-column prop="growth" label="获取成长值" />
                </el-table>
                <div class="fenye">
                  <el-pagination
                    :current-page="chartQuery.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="chartQuery.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="chartTotal"
                    @size-change="chartSizeChanges"
                    @current-change="chartCurrentChanges"
                  />
                </div>
              </div>
            </template>
          </DetailComponent>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import {
//   activeGetExamines,
//   activeLiquidation,
//   activExamine
// } from '@/api/active'
import {
  getPoliteDetail,
  getChartData
} from '@/api/active/active_polite.js'
import DetailComponent from '@/views/active/component/detail.vue'
export default {
  components: {
    DetailComponent
  },
  data() {
    // 这里存放数据
    return {
      activeName: 'first',
      radio: '1',
      formInline: {
        politeId: 0,
        shopName: '', // 店铺名称
        shopCode: '', // 店铺编码
        state: '', // 审核状态 0-待审核 1-报名成功 2-报名失败
        page: 1,
        pageSize: 10
      },
      // addform: {
      //   signId: '', // 报名id
      //   state: '1', // 审核状态 1-报名成功 2-报名失败
      //   remark: '' // 备注
      // },
      form: {},
      tableData: [],
      couponList: [],
      total: 1,
      signId: '',
      activityTable: [], // 参与活动商家数据
      infoList: [
        { name: '成交总额(元)', value: '0', fields: 'money' }
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
    politeId() {
      return this.$route.query.id || 0
    }
  },
  created() {
    this.getDetails()
    this.getChart()
  },
  methods: {
    // 活动信息查询
    async getDetails() {
      const res = await getPoliteDetail({ politeId: this.politeId })
      this.form = res.data
      this.couponList = res.data.details
    },
    async getChart() {
      const data = Object.assign(
        {},
        { politeId: this.politeId },
        this.chartQuery
      )
      const res = await getChartData(data)
      this.activityTable = this.formateTableList(res.data.shopDataDetails.list)
      this.chartTotal = res.data.shopDataDetails.total
      this.infoList = this.formateInfoList(res)
    },
    // 格式化卡片统计渲染
    formateInfoList(res) {
      return [
        {
          name: '发放优惠券数量',
          value: res.data.number || 0
        },
        {
          name: '领取礼品笔数',
          value: res.data.receives || 0
        },
        {
          name: '	领取礼品人数',
          value: res.data.users || 0
        },
        {
          name: '成长值发放',
          value: res.data.growth || 0
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
    chartCurrentChanges(val) {
      this.chartQuery.page = val
      this.getChartData()
    },
    chartSizeChanges(val) {
      this.chartQuery.pageSize = val
      this.getChartData()
    },
    changePage(val) {
      const data = {
        page: val,
        pageSize: 0
      }
      console.log(data)
    },
    changePageSize(val) {
      console.log(val)
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
  .shopInfo_left,.shopInfo_right{
    float: left;
  }
  .shopInfo_right{
    margin-left: 160px;
    width: 200px;
     height: 200px;
    img{
      width: 100%;

    }
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
