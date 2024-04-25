<template>
  <div class="store_info_page">
    <p v-for="(item,index) in storeInfo" :key="index">
      <span>{{ item.name }}:</span>
      <span>{{ item.value }}</span>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeInfo: [
        { name: '店铺名称', value: '江山的店铺', field: '' },
        { name: '合同有效期', value: '2020-06-30──2022-07-23', field: '' },
        { name: '负责人', value: '江山', field: '' },
        { name: '联系电话', value: '0755-56894556', field: '' },
        { name: '联系地址', value: '广东省深圳市南山区科技园', field: '' }
      ]
    }
  }
}
</script>

<style lang='less' scoped>
.store_info_page {
  padding: 20px 10%;
  overflow: hidden;
  p {
    width: 50%;
    float: left;
    span {
      font-size: 16px;
      color: #333333;
      display: inline-block;
       &:nth-of-type(1) {
        width:130px;
      }
      &:nth-of-type(2) {
        color:#666666;
      }
    }
  }
}
</style>
