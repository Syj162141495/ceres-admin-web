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
      <el-form ref="form" :model="form" label-width="100px">
        <br />
        <h2>基础信息</h2>
        <br />
        <el-form-item label="活动名称:">
          <el-input
            v-model="form.politeName"
            placeholder="请输入活动名称"
            :disabled="unStart"
          />
        </el-form-item>

        <el-form-item label="活动备注:">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入活动备注"
            :disabled="unStart"
            style="width: 400px"
          />
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
          />
          <p class="timeInfo">平台活动时间不能交叉</p>
        </el-form-item>

        <h2>优惠规则</h2>
        <br />
        <el-form-item label="优惠方式:">
          <el-radio-group v-model="form.buyerMode">
            <el-radio :label="1" :disabled="unStart">按结算金额优惠</el-radio>
            <el-radio :label="2" :disabled="unStart">按结算数量优惠</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.buyerMode" label="优惠门槛:">
          <div v-if="form.buyerMode === 1">
            满<el-input
              v-model="form.buyer"
              type="number"
              :disabled="unStart"
              style="width: 100px; margin: 0 10px"
            />元
          </div>
          <div v-if="form.buyerMode === 2">
            满<el-input
              v-model="form.buyer"
              type="number"
              :disabled="unStart"
              style="width: 100px; margin: 0 10px"
            />件
          </div>
        </el-form-item>
        <el-form-item label="赠送内容:">
          <el-checkbox-group v-model="checkDiscount">
            <el-checkbox :label="1" :disabled="unStart">优惠券</el-checkbox>
            <el-checkbox :label="2" :disabled="unStart">成长值</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-show="checkDiscount.indexOf(1) !== -1"
          label="赠送优惠券:"
        >
          <el-button class="selectCoupon" @click="showCouponTable"
            >选择优惠券</el-button
          >
          <div class="showCoupon">
            <el-table
              v-show="couponSelectionList.length > 0"
              ref="showTable"
              :data="couponSelectionList"
              border
              :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
              tooltip-effect="dark"
              style="width: 800px"
            >
              <el-table-column prop="activityName" label="优惠券名称" />
              <el-table-column label="优惠类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.activityType === 1">满减</span>
                  <span v-if="scope.row.activityType === 2">折扣</span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="优惠券内容">
                <template slot-scope="scope">
                  <span v-if="scope.row.activityType === 1">
                    满{{ scope.row.threshold }}元 减{{
                      scope.row.couponContent
                    }}元
                  </span>
                  <span v-if="scope.row.activityType === 2">
                    满{{ scope.row.threshold }}元 打{{
                      scope.row.couponContent
                    }}折
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="到期时间" />
            </el-table>
          </div>
        </el-form-item>
        <el-form-item
          v-show="checkDiscount.indexOf(2) !== -1"
          label="赠送成长值:"
        >
          赠送<el-input
            v-model="form.growth"
            type="number"
            :disabled="unStart"
            style="width: 100px; margin: 0 10px"
          />点成长值
        </el-form-item>
      </el-form>
    </div>

    <!-- 选择优惠券 -->
    <el-dialog
      title="选择优惠券"
      :visible.sync="couponTableVisible"
      center
      width="1000px"
      :close-on-click-modal="false"
    >
      <div class="diaddStyle">
        <el-table
          ref="multipleTable"
          :data="couponList"
          :loading="couponloading"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="couponSelection"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="activityName" label="优惠券名称" />
          <el-table-column label="优惠类型" width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.activityType === 1">满减</span>
              <span v-if="scope.row.activityType === 2">折扣</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="优惠券内容" />
          <el-table-column prop="time" label="到期时间" />
        </el-table>
      </div>
      <el-pagination
        :current-page="couponQuery.page"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="couponTotal"
        style="float: right; margin: 10px 0"
        @current-change="handleCouponChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelCoupon" type="warning" @click="clearSelections"
          >取消选中内容</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPoliteDetail,
  getPoliteCoupon,
  addPoliteActivity,
  updatePoliteActivity,
} from "@/api/active/active_polite.js";
export default {
  data() {
    return {
      form: {
        politeName: "", // 活动名称
        remark: "", // 活动备注
        growth: 0,
        buyerMode: 0, // 消费方式 1-购买一定金额商品 2-购买一定数量商品
        buyer: 0, // 满多少元/件,参与活动
        // details: {
        //   activityId: '',
        //   activityName: '',
        //   activityType: '',
        //   couponContent: '',
        //   politeId: '',
        //   threshold: ''
        // }
      },
      date1: [], // 活动时间
      date2: [], // 报名时间
      type: false,
      title: "支付有礼活动",
      couponTableVisible: false,
      couponloading: false,
      couponQuery: {
        page: 1,
        pageSize: 10,
      },
      couponList: [],
      couponTotal: 10,
      couponSelectionList: [],
      checkDiscount: [],
    };
  },
  computed: {
    info() {
      return this.$route.query.info || {};
    },
    unStart() {
      const t = this.$route.query.info;
      return t && !(t.state === 0);
    },
    applyEnd() {
      const t = this.$route.query.info;
      return t && (t.state === 3 || t.state === 4);
    },
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      this.title = this.info.politeId ? "修改支付有礼活动" : "新增支付有礼活动";
      const res = await getPoliteDetail({ politeId: this.info.politeId });
      if (JSON.stringify(res.data) !== "{}") {
        this.form = res.data;
        this.date1 = [res.data.startTime, res.data.endTime];
        if (res.data.details && res.data.details.length > 0) {
          this.checkDiscount.push(1);
          this.couponSelectionList = res.data.details;
        }
        if (res.data.growth > 0) {
          this.checkDiscount.push(2);
        }
      }
    },
    selectDiscount(v) {
      if (v === 2) {
        this.form.discountProgramme = 2;
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    async showCouponTable() {
      this.couponTableVisible = true;
      this.couponloading = true;
      this.getCouponData();
    },
    handleCouponChange(val) {
      this.couponQuery.page = val;
      this.getCouponData();
    },
    async getCouponData() {
      const res = await getPoliteCoupon(this.couponQuery);
      this.couponList = res.data.list;
      this.couponTotal = res.data.total;
    },
    // 选择优惠券
    couponSelection(val) {
      this.couponSelectionList = val;
    },
    clearSelections() {
      this.$refs.multipleTable.clearSelection();
      this.form.details = [];
    },
    save() {
      if (this.couponSelectionList.length !== 0) {
        this.form.details = this.couponSelectionList.map((item) => {
          return {
            activityId: item.activityId,
            activityName: item.activityName,
            activityType: item.activityType,
            couponContent: item.couponContent,
            threshold: item.threshold,
          };
        });
      }
      const params = Object.assign({}, this.form, {
        startTime: this.date1[0] || "",
        endTime: this.date1[1] || "",
      });
      if (params.activityName === "") {
        this.$message.error("请输入活动名称");
        return;
      }
      if (this.date1.length === 0) {
        this.$message.error("请选择活动时间");
        return;
      }
      if (this.info.politeId) {
        return updatePoliteActivity(
          Object.assign(params, { id: this.info.politeId })
        ).then((res) => {
          if (res.code === "") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.reset();
            this.cancel();
          }
        });
      }
      return addPoliteActivity(params).then((res) => {
        if (res.code === "") {
          this.$message({
            message: "新增成功",
            type: "success",
          });
          this.reset();
          this.cancel();
        }
      });
    },
    reset() {
      this.form = {
        politeName: "", // 活动名称
        remark: "", // 活动备注
        growth: 0,
        buyerMode: 0, // 消费方式 1-购买一定金额商品 2-购买一定数量商品
        buyer: 0, // 满多少元/件,参与活动
      };
      this.date1 = [];
    },
  },
};
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
  .el-input {
    width: 400px;
  }
  .selectCoupon {
    width: 200px;
    margin-bottom: 12px;
    border: 1px solid #dcdfe6;
  }
  .cancelCoupon {
    display: block;
    margin: 20px 0 10px 820px;
  }
}
</style>
