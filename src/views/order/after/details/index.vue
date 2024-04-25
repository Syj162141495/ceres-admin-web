<template>
  <div class="detail_page">
    <div class="content">
      <div class="head_box">
        售后详情
        <div v-if="query.info.type != 2" class="btn_list">
          <el-button @click="refuse">拒绝售后</el-button>
          <el-button type="primary" @click="handle">同意售后</el-button>
        </div>
        <div v-else class="btn_list">
          <el-button @click="back">返回</el-button>
        </div>
      </div>
      <div class="detail">
        <div class="order_info">
          <p class="detail_title">订单信息</p>
          <ul class="order_list">
            <li v-for="(item,index) in orderInfo" :key="index">
              <p>{{ item.name }}:</p>
              <p :class="[{active: item.type ===1 || item.type ===2 || item.type ===4}]">
                <span @click="getInfo(item)">{{ item.value }}</span>
                <span v-if="item.type ===3" class="active" @click="getInfo(item)">查看物流</span>
              </p>
            </li>
          </ul>
        </div>

        <div class="after_sale_shop">
          <p class="detail_title">售后商品</p>
          <div v-for="(item,index) in shopList" :key="index" class="goods_list">
            <div class="good_details">
              <ul>
                <li>
                  <img :src="item.image">
                </li>
                <li>
                  <p>{{ item.productName }}</p>
                  <p>{{ item.skuValue }}</p>
                  <p>SKU: {{ item.sku }}</p>
                </li>
                <li>
                  <p>¥{{ item.productPrice*item.number }}</p>
                  <p>¥{{ `${item.productPrice}*${item.number}` }}</p>
                </li>
                <li>¥{{ item.total }}</li>
              </ul>
            </div>
          </div>
          <div class="total">
            <ul>
              <li />
              <li />
              <li>退款总金额</li>
              <li>¥{{ total }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="after_sales_record">
        <p class="detail_title">协商历史</p>
        <div v-for="(item,index) in recordList" :key="index" class="record_list">
          <div class="record_list_title">
            <p>{{ item.title }}</p>
            <p>{{ item.name }}</p>
            <p>{{ item.time }}</p>
          </div>
          <div class="record_list_content">
            <p>
              <!-- <span>{{ item.type }}:</span> -->
              <span> 留言：{{ item.reason }}</span>
            </p>
            <p v-if="item.image !=''">
              <span>举证图片:</span>
              <img :src="item.image" alt>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :fullscreen="!true"
      :before-close="close"
      width="55%"
    >
      <orderInfo v-if="dialog.type===1" />
      <storeInfo v-if="dialog.type===2" />
      <logistics v-if="dialog.type===3" :logistics-list="dialog" />
      <buyer v-if="dialog.type===4" :dialog="dialog.arr" />
      <afterSale v-if="dialog.type===5" :dialog="dialog" @close="close" @dialogs="dialogs" />
      <!-- <goods v-if="dialog.type===1" :info="info" />
      <audit-log v-if="dialog.type===2" :info="info" />-->
    </Dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import afterSale from './component/after-sales'
import buyer from './component/buyer'
import logistics from './component/logistics'
import orderInfo from './component/order-info'
import storeInfo from './component/store-info'
import { afterGetById, getDilevery, getBuyer, handles } from '@/api/after'
export default {
  components: {
    Dialog,
    afterSale,
    buyer,
    logistics,
    orderInfo,
    storeInfo
  },
  data() {
    return {
      orderInfo: [
        { name: '订单ID', value: '', type: 1, field: 'orderFormid' },
        { name: '售后订单ID', value: '', type: '', field: 'afterFormid' },
        { name: '支付时间', value: '', type: '', field: 'paymentTime' },
        { name: '支付方式', value: '', type: '', field: 'paymentMode' },
        { name: '订单总金额', value: '', type: '', field: 'orderPrice' },
        { name: '店铺名称', value: '', type: 2, field: 'shopName' },
        { name: '物流单号', value: '', type: 3, field: 'deliverFormid' },
        { name: '售后类型', value: '', type: '', field: 'afterType' },
        { name: '买家账户', value: '', type: 4, field: 'customerName' }
      ],
      shopList: [
        {
          image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=137628589,3436980029&fm=26&gp=0.jpg',
          productName: 'DAD 气垫霜',
          skuValue: '粉色, 中瓶',
          skuId: '2525',
          productPrice: '60',
          number: '2',
          salePrice: '50'
        },
        {
          image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=137628589,3436980029&fm=26&gp=0.jpg',
          productName: 'DAD 气垫霜',
          skuValue: '粉色, 中瓶',
          skuId: '2525',
          productPrice: '60',
          number: '2',
          salePrice: '50'
        }
      ],
      recordList: [],
      total: 0,
      dialog: {},
      afterDetails: ''
    }
  },
  computed: {
    query() {
      return this.$route.query
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      console.log(this.query)
      const res = await afterGetById({ afterId: this.query.info.afterId })
      if (res.code === '') {
        this.afterDetails = res.data
        const o = res.data
        this.getOrderInfo(o)
        this.shopList = o.products
        this.total = o.refundPrice
        this.recordList = o.afterHistory
      }
    },
    getOrderInfo(o) {
      const payChannel = {
        1: '微信支付',
        2: '支付宝支付',
        3: '余额支付'
      }
      const returnType = {
        1: '无售后',
        2: '退款',
        3: '退货'
      }
      this.orderInfo.map(item => {
        item.value = o[item.field] || ''
        if (item.field === 'payChannel') {
          item.value = payChannel[item.value]
        }
        if (item.field === 'returnType') {
          item.value = returnType[item.value]
        }
      })
    },
    handle() {
      this.dialog = {
        title: '同意售后',
        visible: true,
        type: 5,
        btnName: '同意售后',
        allow: true,
        orderId: this.afterDetails.orderId,
        afterId: this.afterDetails.afterId
      }
    },
    refuse() {
      this.dialog = {
        title: '拒绝售后',
        visible: true,
        type: 5,
        btnName: '拒绝售后',
        orderId: this.afterDetails.orderId,
        afterId: this.afterDetails.afterId
      }
    },
    async getInfo(item) {
      if (item.type === 1) {
        this.dialog = {
          title: '订单信息',
          visible: true,
          type: item.type
        }
      }

      if (item.type === 2) {
        this.dialog = {
          title: '店铺信息',
          visible: true,
          type: item.type
        }
      }

      if (item.type === 3) {
        console.log(this.afterDetails)
        const res = await getDilevery({
          express: this.afterDetails.express,
          deliverFormid: this.afterDetails.deliverFormid
        })
        if (res.code === '') {
          this.dialog = {
            title: '物流信息',
            visible: true,
            type: item.type,
            arr: res.data,
            detail: this.afterDetails
          }
          console.log(this.dialog)
        }
      }

      if (item.type === 4) {
        const res = await getBuyer({
          buyerUserId: this.afterDetails.buyerUserId
        })
        console.log(res)
        if (res.code === '') {
          this.dialog = {
            title: '买家信息',
            visible: true,
            type: item.type,
            arr: res.data
          }
        }
      }
    },
    async dialogs(arr) {
      console.log(arr)
      if (arr.btnName === '拒绝售后') {
        const res = await handles({
          orderId: arr.orderId,
          afterId: arr.afterId,
          state: '2',
          remark: arr.remark
        })
        if (res.code === '') {
          this.$message.success('成功拒绝售后')
          this.dialog.visible = false
          this.$router.go(-1)
        }
      } else if (arr.btnName === '同意售后') {
        console.log(111)
        const res = await handles({
          orderId: arr.orderId,
          afterId: arr.afterId,
          state: '1',
          remark: arr.remark
        })
        if (res.code === '') {
          this.$message.success('成功同意售后')
          this.dialog.visible = false
          this.$router.go(-1)
        }
      }
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    close() {
      this.dialog = {}
    }
  }
}
</script>
<style lang="scss">
@import url("../../../../styles/elDialog.scss");
</style>
<style lang='less' scoped>
.detail_page {
  margin-top: 10px;
  background-color: #fff;
  height: calc(100% - 10px);
  .content {
    padding: 20px;
    .head_box {
      overflow: hidden;
      height: 80px;
      line-height: 80px;
      font-size: 24px;
      border-bottom: 1px solid #e0e5eb;
      .btn_list {
        display: inline-block;
        float: right;
      }
    }
    .detail,
    .after_sales_record {
      min-height: 500px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(51, 51, 51, 0.15);
      border-radius: 4px;
      padding: 1px 10% 20px;
      margin-top: 15px;

      .detail_title {
        font-size: 24px;
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
    }

    .order_info {
      .order_list {
        padding-left: 20px;
        overflow: hidden;
        list-style: none;
        li {
          float: left;
          width: calc(100% / 3);
          margin-bottom: 30px;
          p {
            margin: 0;
            padding: 0;
            display: inline-block;
            font-size: 16px;
            color: #333333;
            &:nth-child(1) {
              width: 23%;
            }
            &:nth-child(2) {
              color: #666666;
            }
          }
        }
        .active {
          color: #3a68f2 !important;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .after_sale_shop {
      .goods_list {
        padding-left: 20px;
        .good_details {
          border-bottom: 1px #e0e5eb solid;
          ul {
            overflow: hidden;
            display: flex;
            margin: 0;
            padding: 30px 0;
            font-size: 16px;
            li {
              flex: 3;
              display: flex;
              // justify-content: center;
              // align-items: center;
              text-align: left;
              img {
                width: 90px;
                height: 90px;
                border-radius: 4px;
                font-size: 16px;
                color: #333333;
              }
              &:nth-child(2),
              &:nth-child(3) {
                display: block;
              }
              &:nth-child(3) {
                p {
                }
              }
              &:nth-child(4) {
              }
              p {
                margin: 0;
                padding: 0;
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
      .total {
        padding-left: 20px;
        ul {
          margin: 0;
          padding: 30px 0;
          display: flex;
          justify-content: flex-end;

          li {
            // height: 40px;
            font-size: 16px;
            color: #333333;
            display: flex;
            width: 90px;
            // justify-content: center;
            // align-items: center;
            &:nth-child(4) {
              margin-right: 140px;
            }
          }
        }
      }
    }

    .after_sales_record {
      p {
        margin: 0;
        padding: 0;
        font-size: 16px;
      }
      .record_list {
        padding-left: 20px;
        .record_list_title {
          background: #f7f7f7;
          overflow: hidden;
          margin-bottom: 30px;
          p {
            float: left;
            text-indent: 10px;
            width: calc(100% / 3);
            height: 36px;
            line-height: 36px;
          }
        }
        .record_list_content {
          p {
            overflow: hidden;
            margin-bottom: 30px;
            span {
              display: block;
              float: left;
              // width: 100px;
              &:nth-of-type(2) {
                text-indent: 10px;
              }
              &:nth-of-type(2) {
                color: #666666;
                width: calc(100% - 100px);
              }
            }
            img {
              width: 90px;
              height: 90px;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}

::v-deep .el-dialog__wrapper {
  .el-dialog__header {
    height: 70px;
    background-color: #3a68f2;
    .el-dialog__title {
      font-size: 24px;
      color: #fff;
    }
  }
}
</style>
