<template>
  <div class="home-page">
    <!-- <div class="total-data">
      <ul>
        <li v-for="(item, index) in dataList" :key="index">
          <p>{{ item.name }}</p>
          <p style="color:blue;font-size: 30px; text-align: left; margin-left:40px;line-height: 50px;">{{ item.value }}</p>
          <hr style="margin-top: 10px">
          <p style="text-align:left;margin-left:20px">本月新增 <span style="color:blue">{{ }}</span> 家，待审核 <span style="color:blue">{{ }}</span> 家</p>
        </li>
      </ul>
    </div> -->
    <div class="total-data">
      <ul>
        <li>
          <p style="color:#111;text-align: center;padding:0">医康养服务商</p>
          <p style="color:green;font-size: 30px; text-align: center;line-height: 50px;font-size: 30px;font-weight: 600;">{{ info.shopNum }} <span style="font-size: 20px;color:#111;font-weight:normal;">家</span></p>
          <hr style="margin-top: 5px">
          <p style="text-align:center;font-size:15px">本月新增 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.newShopNum }}</span> 家，待审核 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.unCheckShopNum }}</span> 家</p>
        </li>
        <li>
          <p style="color:#111;text-align: center;padding:0">医康养服务项目</p>
          <p style="color:green;font-size: 30px; text-align: center;line-height: 50px;font-size: 30px;font-weight: 600;">{{ info.productNum }} <span style="font-size: 20px;color:#111;font-weight:normal;">项</span></p>
          <hr style="margin-top: 5px">
          <p style="text-align:center;font-size:15px">已发布 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.publishProductNum }}</span> 项，未发布 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.unPublishProductNum }}</span> 项</p>
        </li>
        <li>
          <p style="color:#111;text-align: center;padding:0">医康养服务订单</p>
          <p style="color:green;font-size: 30px; text-align: center;line-height: 50px;font-size: 30px;font-weight: 600;">{{ info.orderNum }} <span style="font-size: 20px;color:#111;font-weight:normal;">笔</span></p>
          <hr style="margin-top: 5px">
          <p style="text-align:center;font-size:15px">本月新增订单 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.newOrderNum }}</span> 笔</p>
        </li>
        <li>
          <p style="color:#111;text-align: center;padding:0">客户总数</p>
          <p style="color:green;font-size: 30px; text-align: center;line-height: 50px;font-size: 30px;font-weight: 600;">{{ info.personNum }} <span style="font-size: 20px;color:#111;font-weight:normal;">人</span></p>
          <hr style="margin-top: 5px">
          <p style="text-align:center;font-size:15px">本月新增 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.newPersonNum }}</span> 人，活跃 <span style="color:green;font-size:18px;font-weight: 600;">{{ info.activityPersonNum }}</span> 人</p>
        </li>
        <li>
          <p style="color:#111;text-align: center;padding:0">开放接口</p>
          <p style="color:green;font-size: 30px; text-align: center;line-height: 50px;font-size: 30px;font-weight: 600;">178 <span style="font-size: 20px;color:#111;font-weight:normal;">个</span></p>
          <hr style="margin-top: 5px">
          <p style="text-align:center;font-size:15px">对接平台 <span style="color:green;font-size:18px;font-weight: 600;">6</span> 家</p>
        </li>
      </ul>
    </div>
    <div class="sketch_map">
      <div class="tab_list">
        <div class="echart_list">
          <div class="echart_item">
            <p class="title">用户增长</p>
            <p class="title">过去半年用户增长总数{{ info.newPersonNum }} 人</p>
            <div ref="myEchart" class="full-size" />
          </div>
          <div class="echart_item">
            <p class="title">成交额</p>
            <p class="title">过去半年成交额{{ info.moneyNum }} 元</p>
            <div ref="myEcharts" class="full-size" />
          </div>
          <div class="echart_item" style="height:400px">
            <p class="title">热点页面</p>
            <div class="hotPage">
              <p>1</p>
              <p>2</p>
              <p>3</p>
              <p>4</p>
              <p>5</p>
              <p>6</p>
              <p>7</p>
              <p>8</p>
              <p>9</p>
              <p>10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 0 20px;">
      <div style="padding: 20px 0;">
        <!-- <p class="title" style="font-size:20px;text-align: center;">最新订单</p> -->
        <el-table :data="orderTable" style="width:100%; padding: 0 20px; border: 2px solid #ddd">
          <el-table-column label="订单号" prop="orderId" style="text-align: center;" />
          <el-table-column label="服务名称" prop="productName" style="text-align: center;" />
          <el-table-column label="订单金额" prop="price" style="text-align:center;" />
          <el-table-column label="订单状态" prop="state" style="text-align:center;" />
          <el-table-column label="下单时间" prop="createTime" style="text-align: center;" />
        </el-table>
      </div>
      <el-table :data="tableData" style="width: 100%;border:2px solid #ddd">
        <!-- 纵向表头 -->
        <el-table-column label="" width="200">
          <template slot-scope="scope">
            {{ scope.row.verticalHeader }}
          </template>
        </el-table-column>
        <!-- 横向表头和数据列 -->
        <el-table-column prop="value1" label="医康养服务商" />
        <el-table-column prop="value2" label="服务分类" />
        <el-table-column prop="value3" label="服务项目" />
        <el-table-column prop="value4" label="客户数量" />
        <el-table-column prop="value5" label="成交订单" />
        <el-table-column prop="value6" label="总成交额" />
      </el-table>
    </div>
  </div></template>

<script>
import echarts from 'echarts'
import empty from '@/assets/images/empty.png'
import { dashIndex } from '@/api/indexboard'
export default {
  data() {
    return {
      empty: empty,
      form: {
        condition: 1
      },
      orderTable: [],
      dataList: [
        { name: '医康养服务商(家)', value: '', field: 'shopNum' },
        { name: '服务分类(种)', value: '', field: 'classifyNum' },
        { name: '服务项数(项)', value: '', field: 'productNum' },
        { name: '客户数量(人)', value: '', field: 'personNum' },
        { name: '订单成交数(笔)', value: '', field: 'orderNum' }
      ],
      tableData: [
        {
          verticalHeader: '京津冀地区',
          value1: 'A1',
          value2: 'B1',
          value3: 'C1',
          value4: 'D1',
          value5: 'E1',
          value6: 'F1'
        },
        {
          verticalHeader: '东北地区',
          value1: 'A2',
          value2: 'B2',
          value3: 'C2',
          value4: 'D2',
          value5: 'E2',
          value6: 'F2'
        },
        {
          verticalHeader: '中原地区',
          value1: 'A3',
          value2: 'B3',
          value3: 'C3',
          value4: 'D3',
          value5: 'E3',
          value6: 'F3'
        },
        {
          verticalHeader: '大湾区',
          value1: 'A4',
          value2: 'B4',
          value3: 'C4',
          value4: 'D4',
          value5: 'E4',
          value6: 'F4'
        },
        {
          verticalHeader: '海南自贸区',
          value1: 'A5',
          value2: 'B5',
          value3: 'C5',
          value4: 'D5',
          value5: 'E5',
          value6: 'F5'
        }
        // 添加更多数据项
      ],
      info: {},
      date: '0',
      orderData: {}
    }
  },
  mounted() {
    this.getTotalData()
  },
  methods: {
    async getTotalData() {
      const res = await dashIndex(this.form)
      // console.log(res)
      this.orderTable = res.data.orderList
      this.info = res.data
      if (res.code === '') {
        const d = res.data
        this.dataList.map(item => {
          item.value = d[item.field]
        })
        // echart图数据
        this.draw(res.data.personTotal)
        this.draws(res.data.moneyTotal)
      }
    },

    turnTime(v) {
      const t = v.split('-')
      return `${Number(t[1])}/${Number(t[2])}`
    },
    draw(arr) {
      const myEchart = echarts.init(this.$refs.myEchart, 'light')
      const option = {
        xAxis: {
          type: 'category',
          data: arr.monthList
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            data: arr.personList,
            type: 'line'
          }
        ]
      }

      myEchart.setOption(option)
    },
    draws(arr) {
      const myEchart = echarts.init(this.$refs.myEcharts, 'light')
      const option = {
        xAxis: {
          type: 'category',
          data: arr.month
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            data: arr.data,
            type: 'bar'
          }
        ]
      }
      myEchart.setOption(option)
    },
    // 将钱数保留两位小数
    MoneyUnit(v) {
      if (!v) return 0
      if (v < 10000) {
        return v.toFixed(2)
      } else {
        return (v / 10000).toFixed(2)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
ul {
  list-style: none;
}
.home-page {
  height: 100%;
  .total-data {
    .p-title {
      padding-left: 20px;
      font-size: 24px;
      color: rgba(51, 51, 51, 1);
      line-height: 50px;
      height: 50px;
      margin: 0;
    }
    ul {
      overflow: hidden;
      display: flex;
      padding: 0;
      li {
        padding: 0;
        box-sizing: border-box;
        flex: 4;
        width: 400px;
        height: 140px;
        // background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(224, 229, 235, 1);
        border-radius: 10px;
        margin: 20px;
        p {
          margin: 0;
          // height: 70px;
          // line-height: 70px;
          text-align: center;
          &:nth-child(1) {
            font-size: 20px;
            text-align: left;
            padding-left: 20px;
            line-height: 45px
          }
          &:nth-child(2) {
            font-size: 18px;
          }
          &:nth-child(3) {
            font-size: 20px
          }
        }
        &:nth-child(1) {
          p:nth-child(1) {
            color: green;
          }
        }
        &:nth-child(2) {
          p:nth-child(1) {
            color: #ffae11;
          }
        }
        &:nth-child(3) {
          p:nth-child(1) {
            color: #ff7911;
          }
        }
        &:nth-child(4) {
          p:nth-child(1) {
            color: #3a68f2;
          }
        }
      }
    }
  }

  .sketch_map {
    height: calc(100% - 360px);
    box-sizing: border-box;
    padding: 0 20px;
    .tab_list {
      overflow: hidden;
      ul {
        overflow: hidden;
        float: right;
        width: 60%;
        padding: 0;
        margin: 0;
        li {
          padding: 0 20px;
          margin: 0;
          float: right;
          height: 60px;
          line-height: 60px;
          color: #999999;
          font-size: 18px;
          &:hover {
            cursor: pointer;
          }
          &:nth-child(1) {
            padding-right: 0;
          }
        }
        .active {
          color: #3a68f2;
          border-bottom: 3px solid #3a68f2;
        }
      }
    }
    .echart_list {
      height: calc(100% - 400px);
      .echart_item {
        padding-left: 20px;
        box-sizing: border-box;
        height: calc(100% - 200px);
        width: calc((100% - 40px) / 3);
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(224, 229, 235, 1);
        // box-shadow: 0px 5px 10px 0px rgba(51, 51, 51, 0.15);
        border-radius: 4px;
        float: left;
        .echart {
          height: calc(100% - 300px);
        }
        &:nth-child(-n + 2) {
          margin-right: 20px;
        }
        .title {
          margin: 0;
          height: 50px;
          line-height: 40px;
          font-size: 18px;
          color: #333333;
          &:nth-child(2) {
            text-align: center;
            color: #3a68f2;
            font-size: 14px;
          }
        }
        ul {
          height: calc(100% - 50px);
          margin: 0;
          padding: 0;
          li {
            height: 10%;
            display: flex;
            margin-bottom: 20px;
            p {
              float: left;
              // text-align: center;
              text-indent: 2em;
              padding: 0;
              margin: 0;
              color: #333333;
              font-size: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:nth-child(1) {
                flex: 2;
              }
              &:nth-child(2) {
                flex: 6;
              }
              &:nth-child(3) {
                flex: 4;
              }
            }
          }
        }
      }
    }
  }
}
.empty {
  height: 450px;
  img {
    width: 80px;
    height: 80px;
    margin: 100px auto 10px;
    display: block;
  }
  p {
    text-align: center;
    color: #333333;
  }
}
.full-size {
  height: 300px;
}
/* 自定义样式，使纵向表头固定在左侧 */
.el-table th.el-table-column--selection,
.el-table th.el-table-column--expand,
.el-table th:first-child {
  position: sticky;
  left: 0;
  background-color: #f5f7fa;
  z-index: 1;
}

.el-table th.el-table-column--selection,
.el-table th.el-table-column--expand,
.el-table th:first-child::after {
  content: "纵向表头";
  transform: rotate(-90deg);
  position: absolute;
  left: 25px;
  top: 20px;
  white-space: nowrap;
  width: 80px;
}

.hotPage {
  p{
    line-height: 20px;
    font-size: 16px;
    padding: 7px 0;
  }
}

</style>
