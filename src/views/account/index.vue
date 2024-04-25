<template>
  <div class="accont_Page">
    <!-- 卡片栏 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>绑定账户</span>
      </div>
      <div class="text_item">
        <!--银行卡图片 -->
        <div class="leftImg">
          <img src="" alt="">
        </div>
        <!-- 银行图片 -->
        <div class="bankName">
          <div class="bankNumber">
            <div class="bankNumber_1" v-html="err" />
            <div class="bankNumber_2">622229**********5432</div>
          </div>
          <div class="bankNumber">
            <div class="bankNumber_1">持卡人：</div>
            <div class="bankNumber_1">刘**</div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="btnList">
          <div class="cutBank">解绑</div>
          <div class="changeBank">更换</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      err: '账&#12288;号：'
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang='scss'>
.text_item {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .leftImg {
    width: 260px;
    height: 68px;
    border: 1px solid skyblue;
    img {
      width: 260px;
      height: 68px;
    }
  }
  .bankName {
    font-size: 18px;
    color: #333333;
    .bankNumber {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .bankNumber_1 {
        font-size: 18px;
      }
      .bankNumber_2 {
        font-size: 22px;
      }
    }
    .bankPeople {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .btnList {
    display: flex;
    align-items: center;
    justify-content: center;
    .cutBank {
      background: rgba(58, 104, 242, 0.2);
      border: 1px solid #3A68F2;
      opacity: 0.5;
      border-radius: 4px;
      font-size: 16px;
      color: #3A68F2;
      width: 100px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 30px;
    }
    .changeBank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 48px;
      background: #3A68F2;
      border-radius: 4px;
      color: #FFFFFF;
    }
  }
}
</style>
