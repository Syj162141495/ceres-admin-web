<!--  -->
<template>
  <div class="">
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span
          v-if="shopDetails.checkState === 2"
          class="leftTitle"
        >已拒绝</span>
        <span
          v-if="shopDetails.checkState === 1"
          class="leftTitle"
        >已通过</span>
        <span
          v-if="shopDetails.checkState === 0"
          class="leftTitle"
        >未处理</span>
        <div class="girhtBtn">
          <el-button class="" @click="back">取消</el-button>
          <el-button
            v-if="shopDetails.checkState === 0"
            type="primary"
            @click="handle"
          >处理</el-button>
        </div>
      </div>
      <!--  卡片内容-->
      <div>
        <div class="msgDetail">
          <div class="detail">
            <div class="shop_info">
              <p class="detail_title">服务商信息</p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  服务商名称：
                </span>
                <span>{{ shopDetails.shopName }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  服务商类型：
                </span>
                <span v-if="shopDetails.authenType == 1">个人</span>
                <span v-if="shopDetails.authenType == 2">个体工商户</span>
                <span v-if="shopDetails.authenType == 3">企业</span>
                <span v-if="shopDetails.authenType == 4">其他组织</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  客服电话：
                </span>
                <span>{{ shopDetails.shopPhone }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  服务商负责人：
                </span>
                <span>{{ shopDetails.chargePersonName }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  负责人电话：
                </span>
                <span>{{ shopDetails.chargePersonPhone }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  服务商地址：
                </span>
                <span>{{ shopDetails.shopAdress }}</span>
              </p>
            </div>
            <div class="person_info">
              <p class="detail_title">个人信息</p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  名称：
                </span>
                <span>{{ shopDetails.name }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  证件信息：
                </span>
                <span>{{ shopDetails.cardTypeName }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  身份证号码：
                </span>
                <span>{{ shopDetails.idCard }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  身份证有效期：
                </span>
                <span>{{ shopDetails.cardTime }}</span>
              </p>
              <p class="detail_img">
                <span>
                  <font>*</font>
                  证件照片:
                </span>
                <img
                  v-for="(src, index) in idCardCopyFilePath"
                  :key="'id' + index"
                  :src="src"
                  :preview="2"
                  alt=""
                >
              </p>
              <p v-if="shopDetails && shopDetails.authenType === 1" class="detail_img">
                <span>
                  <font>*</font>
                  手持证件照:
                </span>
                <img :src="shopDetails.cardHand" alt="">
              </p>
            </div>
<!--            主体信息-->
            <div class="person_info" v-if="shopDetails.authenType !== 1">
              <p class="detail_title">主体信息</p>
              <p class="detail_text">
                <span v-if="shopDetails.authenType == 2"><font>*</font> 商户名称：</span>
                <span v-if="shopDetails.authenType == 3"><font>*</font> 企业名称：</span>
                <span v-if="shopDetails.authenType == 4"><font>*</font> 组织名称：</span>
                <span>{{ shopDetails.subjectName }}</span>
              </p>
              <p class="detail_text">
                <span><font>*</font> {{ shopDetails.authenType == 4 ? '组织机构代码' : '社会信用代码'}}：</span>
                <span>{{ shopDetails.subjectCode }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  注册地址
                </span>
                <span>{{ shopDetails.subjectAdress }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  营业期限
                </span>
                <span>{{ shopDetails.subjectStartTime }} - {{ shopDetails.subjectEndTime }}</span>
              </p>
              <p class="detail_img">
                <span>
                  <font>*</font>
                  {{ shopDetails.authenType == 4 ? '机构证明材料' : '营业执照'}}：
                </span>
                <img
                  v-for="(src, index) in shopDetails.subjectLicense"
                  :key="'id' + index"
                  :src="src"
                  :preview="2"
                  alt=""
                >
              </p>
            </div>
            <div class="person_info">
              <p class="detail_title">授权信息</p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  生效日期：
                </span>
                <span>{{ shopDetails.effectiveDate }}</span>
              </p>
              <p class="detail_text">
                <span>
                  <font>*</font>
                  生效时限：
                </span>
                <span>{{ shopDetails.effectiveYear }}</span>
                <span v-if="shopDetails.effectiveYear">年</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- *************对话框开始************* -->
    <el-dialog
      title="处理申请"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="ruleForm" :model="addForm" label-width="80px">
          <el-form-item label="入驻处理">
            <el-radio-group
              v-model="addForm.checkHandle"
              @change="selectChoose"
            >
              <el-radio label="1">同意入驻</el-radio>
              <el-radio label="0">拒绝入驻</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="addForm.checkHandle == 0" label="拒绝原因">
            <el-input v-model="addForm.reason" type="textarea" />
          </el-form-item>
          <el-form-item v-if="addForm.checkHandle == 1" label="生效日期">
            <el-radio-group v-model="addForm.effectiveDate">
              <el-radio label="null">即时生效</el-radio>
              <el-radio label="0">指定日期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="addForm.effectiveDate == 0 && addForm.checkHandle == 1"
          >
            <el-date-picker
              v-model="chooseDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item v-if="addForm.checkHandle == 1" label="生效时间">
            <el-input v-model="addForm.effectiveYear" type="number" oninput="value=value.replace(/[^\d]/g,'')" class="spanIpt" /><span class="riSpan">年</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handle_save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { settlementGetById, settlementHandle } from '@/api/business'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      shopId: '',
      shopDetails: {},
      addFormDialog: false,
      idCardCopyFilePath: [],
      chooseDate: '',
      addForm: {
        shopId: '', // 服务商id
        checkHandle: '', // 1-同意入驻 0-拒绝入驻
        effectiveDate: '', // 生效日期  null-即时生效 有值-指定日期生效
        effectiveYear: '', // 生效时限（年）
        reason: '' // 处理原因
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},

  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // console.log(this.$route.params)
    this.shopId = this.$route.params.shopId || ''
    this.getAll(this.shopId)
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 处理
    handle() {
      this.addFormDialog = true
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    // selectChoose
    selectChoose(index) {
      // console.log(index)
      if (index !== 1) {
        // console.log(11)
        this.addForm.effectiveDate = ''
        this.addForm.effectiveYear = ''
        this.chooseDate = ''
      }
    },
    // 查询服务商详情
    async getAll(shopId) {
      const res = await settlementGetById({ shopId })
      this.shopDetails = res.data
      this.idCardCopyFilePath.push(res.data.cardPositive)
      this.idCardCopyFilePath.push(res.data.cardSide)
    },
    // 处理申请确定
    async handle_save() {
      if (this.addForm.checkHandle === '') {
        this.$message.error('请选择入驻处理')
        return
      }
      if (this.addForm.effectiveDate === '' && this.addForm.checkHandle === 1) {
        this.$message.error('请选择生效日期')
        return
      }
      if (this.addForm.effectiveYear === '' && this.addForm.checkHandle === 1) {
        this.$message.error('请输入生效时间')
        return
      }
      if (this.addForm.effectiveDate !== 'null') {
        this.addForm.effectiveDate = this.chooseDate
      } else {
        this.addForm.effectiveDate = 'null'
      }
      this.addForm.shopId = this.shopId
      const loading = this.$loading({
        lock: true,
        text: '处理中请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(loading.close(),2000)
      const res = await settlementHandle(this.addForm)
      this.addFormDialog = false
      if (res.code === '') {
        this.shopDetails = {}
        this.idCardCopyFilePath = []
        this.$message({
          message: '处理成功',
          type: 'success'
        })
        this.getAll(this.shopId)
      }else{
        console.log('11111111')
      }
      // console.log(this.chooseDate)
      // console.log(this.addForm)
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.clearfix {
  .leftTitle {
    font-size: 24px;
    color: #333333;
  }
  .girhtBtn {
    float: right;
  }
}
.detail {
  min-height: 500px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(51, 51, 51, 0.15);
  border-radius: 4px;
  padding: 1px 100px 20px;
  margin-top: 15px;

  .detail_title {
    font-size: 24px;
    color: #333333;
    position: relative;
    margin: 50px 20px 20px;
    font {
      color: #ff7911;
    }
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
    line-height: 40px;
    span {
      display: inline-block;
      color: #333333;
      font-size: 16px;
      &:nth-child(1) {
        width: 150px;
        text-indent: 20px;
        font {
          color: red;
        }
      }
      &:nth-child(2) {
        color: #666666;
      }
    }
  }
  .detail_img {
    position: relative;
    line-height: 40px;
    margin-bottom: 30px;
    overflow: hidden;
    span {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      color: #333333;
      font-size: 16px;
      width: 150px;
      text-indent: 20px;
      font {
        color: #ff7911;
      }
    }
    img {
      width: 265px;
      height: 170px;
      border-radius: 4px;
      float: left;
      &:nth-of-type(1) {
        margin: 0 30px 0 150px;
      }
    }
  }
}
.spanIpt {
  width: 60%;
}
.riSpan {
  margin-left: 10px;
}
</style>
