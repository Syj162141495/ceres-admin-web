<!--  -->
<template>
  <div>
    <div class="pending">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="服务状态">
            <el-radio-group
              @change="changeState"
              v-model="formInline.shelveState"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="0">已下架</el-radio-button>
              <el-radio-button label="1">已上架</el-radio-button>
              <el-radio-button label="2">待审核</el-radio-button>
              <el-radio-button label="3">审核失败</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <br />
          <el-form-item label="服务ID">
            <el-input
              v-model="formInline.productId"
              placeholder="请输入服务ID"
            />
          </el-form-item>
          <el-form-item label="服务名称">
            <el-input
              v-model="formInline.productName"
              placeholder="请输入服务名称"
            />
          </el-form-item>
          <el-form-item label="服务商名称">
            <el-input
              v-model="formInline.shopName"
              placeholder="请输入服务商名称"
            />
          </el-form-item>
          <el-form-item label="服务大类">
            <el-select v-model="formInline.classifyParentId" placeholder="请选择服务大类" @change="changeParentClass" style="width: 150px;" clearable @clear="changeParentClass" >
              <el-option
                v-for="(item,index) in parentClasses"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务小类">
            <el-select v-model="formInline.classifyId" placeholder="请选择服务小类" :disabled="!formInline.classifyParentId || formInline.classifyParentId === ''" style="width: 150px;" clearable >
              <el-option
                v-for="(item,index) in classes"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-select v-model="formInline.isRecommended" placeholder="请选择是否推荐" style="width: 80px;" >
              <el-option label="全部" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
            <!-- <span
              v-for="(item, index) in btnList"
              :key="index"
              class="promissStyle"
            >
              <el-button type="success" plain @click="btnClick(item)">{{
                item.permissionName
              }}</el-button>
            </span> -->
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
          size="mini"
        >
          <el-table-column
            type="index"
            prop="productId"
            label="序号"
            show-overflow-tooltip
            width="80"
          />
          <!-- <el-table-column label="服务主图" width="150" align="center">
            <template slot-scope="scope">
              <img height="80" width="80" :src="scope.row.image" alt srcset />
            </template>
          </el-table-column> -->
          <el-table-column prop="productName" label="服务名称" width="280" show-overflow-tooltip />
          <el-table-column prop="productType" label="类型" width="120" />
          <el-table-column prop="productCategory" label="大类" width="120" />
          <el-table-column prop="productSubCategory" label="小类" width="120" />
          <el-table-column
            prop="isRecommended"
            label="是否推荐"
            show-overflow-tooltip
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isRecommended==0">否</span>
              <span v-if="scope.row.isRecommended==1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shelveState"
            label="服务状态"
            show-overflow-tooltip
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.shelveState == 0">已下架</span>
              <span v-if="scope.row.shelveState == 1">已上架</span>
              <span v-if="scope.row.shelveState == 2">待审核</span>
              <span v-if="scope.row.shelveState == 3">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sectionPrice"
            label="价格区间"
            show-overflow-tooltip
            width="120"
          />
          <el-table-column prop="shopName" label="服务商名称" width="260" show-overflow-tooltip />
          <!-- <el-table-column
            prop="memberSection"
            label="会员价"
            show-overflow-tooltip
          /> -->
          <el-table-column
            prop="shopLocation"
            label="区域"
            show-overflow-tooltip
            width="200"
          />
          <!-- <el-table-column
            prop="stockNumber"
            label="库存"
            show-overflow-tooltip
          />
          <el-table-column
            prop="volume"
            label="实际销售"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fictitiousNumber"
            label="虚拟销售"
            show-overflow-tooltip
          /> -->
          <!-- <el-table-column prop="createTime" label="创建时间" width="180" /> -->
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button
                  v-if="scope.row.shelveState == 1"
                  @click="OutForced(scope.row)"
                  style="margin-right: 10px"
                  slot="reference"
                  type="text"
                  >强制下架</el-button
                >
                <el-button
                  v-if="scope.row.shelveState == 1"
                  type="text"
                  @click="setFictitious(scope.row)"
                  >虚拟销量</el-button
                >
                <el-button
                  v-if="scope.row.shelveState == 2"
                  type="text"
                  @click="examineShow(scope.row)"
                  >审核</el-button
                >
                <el-button type="text" @click="Godetails(scope.row)"
                  >查看详情</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 上架审核 -->
    <el-dialog title="上架审核" :visible.sync="examineVisible" width="30%">
      <el-form :model="ForcedForm">
        <el-form-item label="驳回原因" label-width="120px">
          <el-radio-group v-model="ForcedForm.shelveState">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="ForcedForm.shelveState == 3"
          label="驳回原因"
          label-width="120px"
        >
          <el-input
            type="textarea"
            v-model="ForcedForm.reject"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineVisible = false">取 消</el-button>
        <el-button type="primary" @click="submintUs">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置虚拟销量 -->
    <el-dialog
      title="自定义虚拟销量"
      :visible.sync="FictitiousVisible"
      width="460px"
    >
      <el-form :model="ForcedForm">
        <el-form-item label="" label-width="110px">
          <el-input-number
            v-model="ForcedForm.fictitiousNumber"
            :precision="0"
            :min="1"
            :max="999999999"
            label="请输入整数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="FictitiousVisible = false">取 消</el-button>
        <el-button type="primary" @click="FicSubmintUs">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClassify,
  getClassifyGetAll,
  Forced,
  setFictitious,
  examine,
} from "@/api/commodity";
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      loading: true,
      btnList: "",
      activeName: "first",
      formInline: {
        productType: this.$route.meta.title.substring(0, 4), // 服务类型
        shelveState: "", // 服务状态 0-已下架 1-已上架 2-待审核 3-审核失败
        productName: "", // 服务名称
        productId: "", //服务ID
        shopName: "", //服务商名称
        isRecommended: "", // 是否推荐
        classifyParentId: "", // 服务大类
        classifyId: "", // 服务小类
        page: 1, // 当前页
        pageSize: 5,
      },
      batchAdd: false,
      batchFileList: [],
      total: 1,
      tableData: [],
      currentPage: 1,
      FictitiousVisible: false,
      ForcedForm: {
        fictitiousNumber: 0,
        productId: "",
        reject: "",
        shelveState: 1,
      },
      examineVisible: false,
      classifyList: [],
      parentClasses: [],
      classes: []
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    await this.queryAllCategory();
    await this.getAll(this.formInline);
  },
  // 方法集合
  methods: {
    // 查看详情
    Godetails(row) {
      this.$router.push({
        name: "addCommodity",
        params: { productId: row.productId },
      });
    },
    // 设置虚拟销量
    setFictitious(row) {
      this.FictitiousVisible = true;
      this.ForcedForm.productId = row.productId;
      this.ForcedForm.fictitiousNumber = row.fictitiousNumber;
    },
    async FicSubmintUs() {
      const res = await setFictitious(this.ForcedForm);
      if (res.code === "") {
        this.FictitiousVisible = false;
        this.$message.success(
          "虚拟销量已设置：" + this.ForcedForm.fictitiousNumber
        );
        this.search();
      }
    },
    // 强制下架
    OutForced(row) {
      this.$alert("确定下架此服务吗？", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          console.log(action);
          if (action == "confirm") {
            this.ForcedForm.productId = row.productId;
            Forced(this.ForcedForm).then((res) => {
              if (res.code === "") {
                this.$message.success("下架成功");
                this.search();
              }
            });
          }
        },
      });
    },
    // 审核弹窗
    examineShow(row) {
      this.ForcedForm.productId = row.productId;
      this.ForcedForm.reject = "";
      this.examineVisible = true;
    },
    async submintUs() {
      if (this.ForcedForm.shelveState == 3 && this.ForcedForm.reject == "")
        return this.$message.warning("请输入驳回原因");
      const res = await examine(this.ForcedForm);
      if (res.code === "") {
        this.examineVisible = false;
        this.search();
        if (this.ForcedForm.shelveState == 1) {
          this.$message.success("审核成功");
        } else {
          this.$message.success("已驳回");
        }
      }
    },
    handleSizeChange(val) {
      console.log(val);
      this.formInline.pageSize = val;
      this.getAll(this.formInline);
    },
    handleCurrentChange(val) {
      console.log(val);
      this.formInline.page = val;
      this.getAll(this.formInline);
    },
    //  查询
    search() {
      this.total = 1;
      this.formInline.page = 1;
      this.getAll(this.formInline);
    },
    //服务状态查询
    changeState(e) {
      console.log(e);
      this.formInline.shelveState = e;
      this.getAll(this.formInline);
    },
    // 重置
    clear() {
      this.formInline.shelveState = "";
      this.formInline.productName = "";
      this.formInline.productId = "";
      this.formInline.shopName = "";
      this.formInline.page = 1;
      this.formInline.pageSize = 5;
      this.formInline.isRecommended = "";
      this.formInline.classifyParentId = "";
      this.formInline.classifyId = "";
      this.getAll(this.formInline);
    },

    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await getClassifyGetAll(formInline);
      for (const item of res.data.list) {
        let productCategory = "";
        let productSubCategory = "";
        for (const parentCatefory of this.categoryList) {
          for (const category of parentCatefory['childs']) {
            for (const subCategory of category["childs"]) {
              if (subCategory["id"].toString() === item.classifyId) {
                productCategory = category["categoryName"];
                productSubCategory = subCategory["categoryName"];
              }
            }
          }
        }
        item.productCategory = productCategory;
        item.productSubCategory = productSubCategory;
      }
      this.loading = false;
      this.total = res.data.total;
      this.tableData = res.data.list;
    },
    // 初始化查询所有分类
    async queryAllCategory() {
      const res = await getClassify()
      this.categoryList = res.data
      console.log(this.categoryList)
      this.parentClasses = this.categoryList.find(item => item.categoryName === this.$route.meta.title.substring(0, 4))['childs'];
      this.classes = this.parentClasses.find(item => item.id === this.formInline.classifyParentId) && this.parentClasses.find(item => item.id === this.formInline.classifyParentId)['childs'];
    },
    changeParentClass() {
      if (!this.formInline.classifyParentId) {
        this.classes = [];
        this.formInline.classifyId = undefined;
        return;
      }
      this.classes = this.parentClasses.find(item => item.id === this.formInline.classifyParentId) && this.parentClasses.find(item => item.id === this.formInline.classifyParentId)['childs'];
      this.formInline.classifyId = this.classes[0].id;
    }
  },
};
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
.clickMe {
  color: #3a68f2;
  cursor: pointer;
}
.vipDialog {
  .priceTable {
    table {
      width: 100%;
      text-align: center;
      border-left: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      font-size: 14px;
      color: #606266;
      border-collapse: collapse;
      tr {
        border-top: 1px solid #ebeef5;
        th {
          padding: 12px 0;
          background: #eef3ff;
          color: #333;
          border-right: 1px solid #ebeef5;
        }
        td {
          padding: 12px 0;
          border-right: 1px solid #ebeef5;
          &:nth-child(1),
          &:nth-child(2) {
            width: 80px;
          }
          .el-input {
            width: 100px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
