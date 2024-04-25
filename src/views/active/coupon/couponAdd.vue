<template>
  <div class="edit_add_page">
    <div class="content">
      <div class="title">
        <span>{{ title }}</span>
        <div class="btn_list">
          <span @click="cancel">取消</span>
          <span @click="save">保存</span>
        </div>
      </div>
      <br>
      <el-form ref="form" :model="form" label-width="150px">
        <h2>基础信息</h2>
        <br>
        <el-form-item label="活动名称:">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" :disabled="unStart" />
        </el-form-item>

        <el-form-item label="活动介绍:">
          <el-input
            v-model="form.activityIntroduce"
            type="textarea"
            placeholder="请输入活动介绍"
            :disabled="unStart"
            style="width: 400px"
          />
        </el-form-item>
        <!-- :picker-options="pickerOptions" -->

        <el-form-item label="报名时间:">
          <el-date-picker
            v-model="date2"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions1"
          />
          <p class="timeInfo">报名时间不能交叉且报名时间不能大于活动时间</p>
        </el-form-item>

        <el-form-item label="活动时间:">
          <el-date-picker
            v-model="date1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="applyEnd"
            :picker-options="pickerOptions"
          />
          <p class="timeInfo">平台活动时间不能交叉并且活动时间不能小于报名时间</p>
        </el-form-item>

        <el-form-item label="活动保证金:">
          <el-radio-group v-model="form.ifBond">
            <el-radio :label="1" :disabled="unStart">需要</el-radio>
            <el-radio :label="0" :disabled="unStart">不需要</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.ifBond === 1" label="保证金金额:">
          <el-input v-model="form.bondMoney" placeholder="请输入活动保证金金额" :disabled="unStart" />
        </el-form-item>

        <!-- <el-form-item label="活动标签">
          <el-input v-model="form.activityLabel" placeholder="请输入活动标签" :disabled="unStart" />
        </el-form-item> -->

        <h2>优惠规则</h2>
        <br>
        <el-form-item label="使用门槛:">
          满<el-input v-model="form.threshold" :disabled="unStart" style="width: 100px;margin: 0 12px;" />元
        </el-form-item>
        <el-form-item label="优惠方式:">
          <el-radio-group v-model="form.discountMode">
            <el-radio :label="1" :disabled="unStart">满减</el-radio>
            <el-radio :label="2" :disabled="unStart">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠内容:">
          <div v-if="form.discountMode === 1">
            减<el-input v-model="form.couponContent" :disabled="unStart" style="width: 100px;margin: 0 12px;" />元
          </div>
          <div v-if="form.discountMode === 2">
            <el-input v-model="form.couponContent" :disabled="unStart" style="width: 100px;margin-right: 12px;" />折
          </div>
        </el-form-item>

        <el-form-item label="发放数量:">
          <el-input v-model="form.number" :disabled="unStart" style="width: 100px;margin-right: 12px;" />张
        </el-form-item>
        <el-form-item label="是否限领:">
          <el-radio-group v-model="form.receiveType">
            <el-radio :label="1" :disabled="unStart">不限制</el-radio>
            <el-radio :label="2" :disabled="unStart">限制领取</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.receiveType === 2" label="限制领取次数:">
          <el-input v-model="form.frequency" type="number" :disabled="unStart" style="width: 100px;margin-right: 12px;" />次
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { activeAdd, activeUpdate, activeGetById } from '@/api/active'
import {
} from '@/api/active/active_seckill.js'
export default {
  data() {
    return {
      form: {
        activityName: '', // 活动名称
        activityIntroduce: '', // 活动介绍
        ifBond: 0, // 活动保证金
        bondMoney: '', // 保证金金额
        activityLabel: '', // 活动标签
        discountMode: 1, // 优惠方式
        discountProgramme: 1, // 优惠方案
        couponContent: 0,
        number: null, // 发放数量
        receiveType: 1,
        frequency: null
      },
      date1: [], // 活动时间
      date2: [], // 报名时间
      type: false,
      title: '',
      pickerOptions: {
        // disabledDate: time => {
        //   const t = this.$route.query.info;
        //   console.log(this.date1)
        //   if (this.date1[0] !== "" && t && t.status === 2) {
        //     return time.getTime() ;
        //   }
        //   return "";
        // }
      },
      pickerOptions1: {
        // disabledDate: time => {
        //   const t = this.$route.query.info;
        //   if (this.date2[0] !== "" && t && (t.status === 3 || t.status === 4)) {
        //     return time.getTime() < new Date(this.date2[0]).getTime();
        //   }
        //   return "";
        // }
      }
    }
  },
  computed: {
    info() {
      return this.$route.query.info || {}
    },
    unStart() {
      const t = this.$route.query.info
      return t && !(t.state === 0)
    },
    applyEnd() {
      const t = this.$route.query.info
      return t && (t.state === 3 || t.state === 4)
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.title = this.info.activityId ? '修改优惠券活动' : '新增优惠券活动'
      const res = await activeGetById({ activityId: this.info.activityId })
      if (JSON.stringify(res.data) !== '{}') {
        this.form = res.data
        this.date1 = [res.data.activityStartTime, res.data.activityEndTime]
        this.date2 = [res.data.signStartTime, res.data.signEndTime]
        const list = res.data.promotionDetail
        console.log(list)
        if (list.length) {
          list.map(item => {
            item.fullMoney /= 1
            item.reduceMoney /= 1
          })
          this.list = list
        }
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    save() {
      const params = Object.assign({}, this.form, {
        activityStartTime: this.date1[0] || '',
        activityEndTime: this.date1[1] || '',
        signStartTime: this.date2[0] || '',
        signEndTime: this.date2[1] || '',
        bondMoney: this.form.bondMoney * 1
      })
      let errMsg = ''
      if (params.activityName === '') {
        errMsg += '请输入活动名称'
      }
      if (params.activityIntroduce === '') {
        errMsg += '请输入活动介绍'
      }
      if (this.date2.length === 0) {
        errMsg += '请选择报名时间'
      }
      if (this.date1.length === 0) {
        errMsg += '请选择活动时间'
      }
      if (errMsg.length !== 0) {
        this.$message.error(errMsg)
        return
      }
      if (this.info.activityId) {
        return activeUpdate(
          Object.assign(params, { activityId: this.info.activityId })
        ).then(res => {
          if (res.code === '') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.reset()
            this.cancel()
          }
        })
      }
      return activeAdd(params).then(res => {
        if (res.code === '') {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.reset()
          this.cancel()
        }
      })
    },
    reset() {
      this.form = {
        activityName: '',
        activityIntroduce: '',
        ifBond: 2,
        bondMoney: '',
        activityLabel: '',
        discountMode: 1,
        discountProgramme: 1,
        image: '',
        promotionDetail: '',
        activityStartTime: '',
        activityEndTime: '',
        signStartTime: '',
        signEndTime: ''
      }
      this.list = [{ fullMoney: '', reduceMoney: '' }]
      this.date1 = []
      this.date2 = []
    }
  }
}
</script>

<style lang='scss' scoped>
.edit_add_page {
  padding: 20px;
  h2 {
    font-size: 24px;
    font-weight: 500;
    position: relative;
    &::before {
      content: "";
      height: 24px;
      width: 4px;
      background-color: #3a68f2;
      position: absolute;
      left: -10px;
      top: 2px;
      display: block;
    }
  }
  .content {
    background-color: #fff;
    padding: 0 50px 20px;
    overflow: hidden;
    .title {
      height: 100px;
      line-height: 100px;
      font-size: 24px;
      position: relative;
      border-bottom: 1px solid #e0e5eb;
      .btn_list {
        position: absolute;
        right: 0;
        top: 0;
        height: 50px;
        span {
          padding: 0;
          margin: 0;
          width: 100px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          display: inline-block;
          font-size: 16px;
          border-radius: 4px;
          box-sizing: border-box;
          &:hover {
            cursor: pointer;
          }
          &:nth-child(1) {
            background: rgba(255, 255, 255, 1);
            order: 1px solid rgba(224, 229, 235, 1);
            margin-right: 20px;
            border: 1px solid rgba(224, 229, 235, 1);
          }
          &:nth-child(2) {
            background: rgba(58, 104, 242, 1);
            color: #fff;
          }
        }
      }
    }
    .el-form {
      .el-form-item {
        label.el-form-item__label {
          font-size: 16px !important;
          color: red !important;
        }
      }
    }
    .photo {
      padding: 70px 100px;
      .avatar-uploader {
        width: 180px;
        .el-icon-plus,
        img {
          width: 180px;
          height: 180px;
          line-height: 180px;
          border: 1px #bbb solid;
          border-radius: 4px 4px 0px 4px;
          margin-bottom: 10px;
          text-align: center;
        }
        img {
          border: none;
        }
      }
    }
  }
  .timeInfo {
    font-size: 12px;
    color: #999999;
  }
  .el-input{
    width: 400px;
  }
}
</style>
