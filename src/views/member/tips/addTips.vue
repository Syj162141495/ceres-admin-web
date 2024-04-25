<!--  -->
<template>
  <div class="addtips">
    <template>
      <div class="add_page">
        <div class="header">
          <span v-if="tipState">创建标签</span>
          <span v-else>编辑标签</span>
          <div class="btn_list">
            <el-button @click="back">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
        <div class="add_content">
          <el-form label-width="80px">
            <el-form-item label="标签名称">
              <el-input v-model="form.name" maxlength="32" placeholder="最多输入32个字符" />
            </el-form-item>
            <el-form-item label="标签类型">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">手动标签</el-radio>
                <el-radio :label="2">自动标签</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="form.type === 2" class="auto_label">
              <el-form-item label="满足条件">
                <el-radio-group v-model="form.meetCondition">
                  <el-radio :label="1">满足任意选中的条件即可</el-radio>
                  <el-radio :label="2">必须满足所有选被中的条件</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="交易条件">
                <el-checkbox-group v-model="checkBox">
                  <el-row>
                    <el-checkbox :label="1" name="config">最后消费时间</el-checkbox>
                    <el-row>
                      <el-radio-group v-model="form.config.lastConsumTime.type">
                        <el-row class="indent">
                          <el-radio :label="1">最近</el-radio>
                          <el-select
                            v-model="form.config.lastConsumTime.value"
                            style="width: 70px"
                            :disabled="
                              form.config.lastConsumTime.type === 2 ||
                                !checkBox.includes(1)
                            "
                          >
                            <el-option
                              v-for="(item, index) in dayList"
                              :key="index"
                              :label="item.label"
                              :value="item.label"
                            />
                          </el-select>
                          <span style="font-size: 16px; margin-left: 10px">天</span>
                        </el-row>
                        <el-row class="indent">
                          <el-radio :label="2">自定义</el-radio>
                          <el-date-picker
                            v-model="date"
                            :disabled="
                              form.config.lastConsumTime.type === 1 ||
                                !checkBox.includes(1)
                            "
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd"
                            @change="handleChange"
                          />
                        </el-row>
                      </el-radio-group>
                    </el-row>
                  </el-row>
                  <el-row>
                    <el-checkbox :label="2" name="config">累计消费次数</el-checkbox>
                    <el-row class="indent">
                      <el-col :span="3" class="unit">
                        <el-input
                          v-model="totalConsumTimes.start"
                          :disabled="!checkBox.includes(2)"
                          type="number"
                          oninput="value=value.replace(/[^\d]/g,'')"
                        />
                        <span>次</span>
                      </el-col>
                      <el-col :span="1" style="font-size: 16px; text-align: center">ㅡ</el-col>
                      <el-col :span="3" class="unit">
                        <el-input
                          v-model="totalConsumTimes.end"
                          :disabled="!checkBox.includes(2)"
                          type="number"
                          oninput="value=value.replace(/[^\d]/g,'')"
                        />
                        <span>次</span>
                      </el-col>
                    </el-row>
                  </el-row>
                  <el-row>
                    <el-checkbox :label="3" name="config">累计消费金额</el-checkbox>
                    <el-row class="indent">
                      <el-col :span="3" class="unit">
                        <el-input
                          v-model="totalConsumAmount.start"
                          :disabled="!checkBox.includes(3)"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          type="number"
                        />
                        <span>元</span>
                      </el-col>
                      <el-col :span="1" style="font-size: 16px; text-align: center">ㅡ</el-col>
                      <el-col :span="3" class="unit">
                        <el-input
                          v-model="totalConsumAmount.end"
                          :disabled="!checkBox.includes(3)"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          type="number"
                        />
                        <span>元</span>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { tipsAdd, tipsGetById, tipsUpdate } from '@/api/customerMage'
export default {
  data() {
    return {
      form: {
        name: '', // 标签名称
        meetCondition: 1, // 满足条件
        type: 1,
        config: {
          totalConsumTimes: '',
          // 最近
          lastConsumTime: {
            type: 1,
            value: 3
          },
          totalConsumAmount: ''
        }
      },
      addForm: {
        labelName: '', // 标签名称
        labelType: '', // 标签类型 1-手动标签 2-自动标签
        meetConditions: '', // 满足条件 1-满足任意一个被选中条件即可  2-必须满足所有被选中条件
        lastConsumptionTime: '', // 是否选中最后消费时间 1-是 0-否
        consumptionFrequency: '', // 是否选中累计消费次数  1-是 0-否
        consumptionMoney: '', // 是否选中累计交易金额 1-是 0-否
        consumptionDay: '', // 最近几天（天）
        consumptionStartTime: '', // 最后消费开始时间
        consumptionEndTime: '', // 最后消费结束时间
        frequencyStart: '', // 起始次数
        frequencyEnd: '', // 截止次数
        moneyStart: '', // 起始金额
        moneyEnd: '' // 截止金额
      },
      checkBox: [], // 交易条件
      totalConsumTimes: {
        start: '',
        end: ''
      },
      totalConsumAmount: {
        start: '',
        end: ''
      },
      tipState: '',
      date: [], // 自定义时间
      dayList: [
        { label: 3 },
        { label: 7 },
        { label: 15 },
        { label: 30 },
        { label: 45 },
        { label: 60 }
      ],
      buyerLabelId: ''
    }
  },
  computed: {},
  mounted() {
    console.log(this.$route.params)
    this.buyerLabelId = this.$route.params.buyerLabelId
    if (JSON.stringify(this.$route.params) === '{}') {
      this.tipState = true
    } else {
      this.tipState = false
      console.log('nmsl')
      this.getDetails(this.buyerLabelId)
    }
    console.log(this.tipState)
  },
  methods: {
    handleChange(value) {
      console.log(value)
      // this.form.config.lastConsumTime.value = `${(value && value[0]) || ''}${value && value[0] ? '至' : ''}${(value && value[1]) || ''}`
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 编辑查询
    getDetails(buyerLabelId) {
      tipsGetById({ buyerLabelId }).then(res => {
        console.log(res)
        this.form = {
          name: res.data.labelName, // 标签名称
          meetCondition: res.data.meetConditions, // 满足条件
          type: res.data.labelType,
          config: {
            totalConsumTimes: '',
            // 最近
            lastConsumTime: {
              type: 1,
              value: 3
            },
            totalConsumAmount: ''
          }
        }
        this.totalConsumTimes = {
          start: res.data.frequencyStart,
          end: res.data.frequencyEnd
        }
        this.totalConsumAmount = {
          start: res.data.moneyStart,
          end: res.data.moneyEnd
        }
        this.checkBox = res.data.consumptions
      })
    },
    // 添加/编辑
    async save() {
      console.log(this.form)
      console.log(this.checkBox)
      console.log(this.date)
      if (this.form.type === 1) {
        this.form.config.lastConsumTime.value = ''
        this.form.meetConditions = ''
      }
      const obj = {
        labelName: this.form.name, // 标签名称
        labelType: this.form.type, // 标签类型 1-手动标签 2-自动标签
        meetConditions: this.form.meetCondition,
        conditions: this.checkBox,
        consumptionDay: this.form.config.lastConsumTime.value, // 最近几天（天）
        consumptionStartTime: this.date[0] || '', // 最后消费开始时间
        consumptionEndTime: this.date[1] || '', // 最后消费结束时间
        frequencyStart: this.totalConsumTimes.start, // 起始次数
        frequencyEnd: this.totalConsumTimes.end, // 截止次数
        moneyStart: this.totalConsumAmount.start, // 起始金额
        moneyEnd: this.totalConsumAmount.end // 截止金额
      }
      if (this.tipState) {
        const res = await tipsAdd(obj)
        if (res.code === '') {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$router.go(-1)
        }
      } else {
        obj.buyerLabelId = this.buyerLabelId
        const res = await tipsUpdate(obj)
        if (res.code === '') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.add_page {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  .header {
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    border-bottom: 1px solid #e0e5eb;
    .btn_list {
      float: right;
    }
  }

  .add_content {
    width: 60%;
    margin: 20px auto;
    .indent {
      padding-left: 20px;
      margin-bottom: 15px;
      box-sizing: border-box;
    }
    .auto_label {
      background-color: #f7f7f7;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}

.unit {
  position: relative;
  span {
    position: absolute;
    right: 0;
    font-size: 16px;
    border-left: 1px solid #dcdfe6;
    padding: 0 8px;
  }
  .el-input__inner {
    padding: 0 40px 0 5px;
  }
}
</style>
