<!--  -->
<template>
  <div>
    <div class="pending">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="服务机构名称">
            <el-input v-model="formInline.shopName" placeholder="请输入服务机构名称" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="formInline.chargePersonName" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="onSubmit">查询</el-button>
            <el-button type="success" plain @click="addbuss">新建服务商</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="服务商名称" show-overflow-tooltip width="100">
            <template slot-scope="scope">{{ scope.row.shopName }}</template>
          </el-table-column>
          <el-table-column prop="city" label="城市" />
          <el-table-column prop="area" label="地区" />
          <el-table-column prop="serviceClassify" label="服务类型" />
          <el-table-column prop="institutionalClassify" label="机构类型" />
          <el-table-column prop="institutionalGrade" label="机构等级" />
          <el-table-column prop="address" label="机构地址" />
          <el-table-column prop="reditCode" label="信用代码" />
          <el-table-column prop="chargePersonName" label="联系人" />
          <el-table-column prop="chargePersonPhone" label="联系电话" />
          <el-table-column prop="coordinateX" label="经度" />
          <el-table-column prop="coordinateY" label="纬度" />
          <el-table-column prop="introduction" label="机构简介" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="seeMore(scope.row)">查看</el-button>
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.state == 1" type="text" @click="del(scope.row)">禁用</el-button>
                <el-button v-else type="text" @click="del(scope.row)">启用</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="fenye">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- ******************************************************弹框开始****************************************************** -->
      <!-- 新建服务商弹框 -->
      <el-dialog
        :title="
          userState === 0
            ? '新增服务商'
            : userState === 1
              ? '修改服务商'
              : '查看服务商'
        "
        :visible.sync="dialogVisible"
        width="45%"
        center
        :close-on-click-modal="false"
      >
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="授权信息" name="first">
              <div class="two-column-tabs">
                <el-form ref="ruleFormInfo" :model="ruleForm" :rules="rulesInfo" label-width="100px">
                  <div class="tab-content-column1">
                    <p>
                      <el-form-item label="服务商名称" prop="shopName">
                        <el-input v-model="ruleForm.shopName" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="城市" prop="city">
                        <el-input v-model="ruleForm.city" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="地区" prop="area">
                        <el-input v-model="ruleForm.area" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="服务类型" prop="serviceClassify">
                        <el-input v-model="ruleForm.serviceClassify" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="机构类型" prop="institutionalClassify">
                        <el-input v-model="ruleForm.institutionalClassify" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="机构等级" prop="institutionalGrade">
                        <el-input v-model="ruleForm.institutionalGrade" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="机构地址" prop="address">
                        <el-input v-model="ruleForm.address" :disabled="disabled" />
                      </el-form-item>
                    </p>
                  </div>
                  <div class="tab-content-column2">
                    <p>
                      <el-form-item label="信用代码" prop="reditCode">
                        <el-input v-model="ruleForm.reditCode" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="联系人" prop="chargePersonName">
                        <el-input v-model="ruleForm.chargePersonName" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="联系电话" prop="chargePersonPhone">
                        <el-input v-model="ruleForm.chargePersonPhone" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="经度" prop="coordinateX">
                        <el-input v-model="ruleForm.coordinateX" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="纬度" prop="coordinateY">
                        <el-input v-model="ruleForm.coordinateY" :disabled="disabled" />
                      </el-form-item>
                      <el-form-item label="机构简介" prop="introduction">
                        <el-input v-model="ruleForm.introduction" :disabled="disabled" />
                      </el-form-item>
                    </p>
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="服务商信息" name="second">
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="账号" prop="shopPhone">
                  <el-input v-model="ruleForm.shopPhone" :disabled="disabled" maxlength="20" />
                </el-form-item>
                <el-form-item label="密码" prop="shopPassword">
                  <el-input v-model="ruleForm.shopPassword" type="password" :disabled="disabled" maxlength="20" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeFn">取 消</el-button>
          <el-button v-if="activeName == 'first'" type="primary" @click="next">下一步</el-button>
          <el-button v-else type="primary" @click="addCheck('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  businessListGetAll,
  businessListSave,
  businessListGetById,
  businessListUpdate,
  businessListStart,
  getClassify
} from '@/api/business'
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      // 新建服务商弹框
      dialogVisible: false,
      activeName: 'first',
      formInline: {
        shopName: '', // 服务商名称
        // shopCode: '', // 服务商编码
        chargePersonName: '', // 服务商负责人
        // contractState: '', // 合同状态 1-有效 0-无效
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      disabled: false,
      ruleForm: {
        shopName: '', // 服务商名称
        city: '',
        area: '',
        serviceClassify: '',
        institutionalClassify: '',
        institutionalGrade: '',
        address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        shopPhone: '', // 账号
        shopPassword: '' // 密码
      },
      rulesInfo: {
        shopName: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ],
        serviceClassify: [
          { required: true, message: '请输入服务类型', trigger: 'blur' }
        ],
        institutionalClassify: [
          { required: true, message: '请输入机构类型', trigger: 'blur' }
        ],
        institutionalGrade: [
          { required: true, message: '请输入机构等级', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入机构地址', trigger: 'blur' }
        ],
        reditCode: [
          { required: true, message: '请输入信用代码', trigger: 'blur' }
        ],
        chargePersonName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        chargePersonPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        coordinateX: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        coordinateY: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入机构简介', trigger: 'blur' }
        ]
      },
      rules: {
        shopPhone: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '目前只支持中国大陆的手机号码'
          }
        ],
        shopPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },

          {
            pattern: /^[~!@#$%^&*\-+=_.0-9a-zA-Z]{8,16}$/,
            message: '8-16密码数字英文混合'
          }
        ]
      },
      total: 1,
      serviceList: [],
      tableData: [],
      currentPage: 1,
      userState: 1
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getAll(this.formInline)
  },
  // 方法集合
  methods: {
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    onSubmit() {
      this.getAll(this.formInline)
    },
    // 新建服务商
    addbuss() {
      this.userState = 0
      this.disabled = false
      this.ruleForm = {
        shopName: '', // 服务商名称
        city: '',
        area: '',
        serviceClassify: '',
        institutionalClassify: '',
        institutionalGrade: '',
        address: '',
        reditCode: '',
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        coordinateX: '',
        coordinateY: '',
        introduction: '',
        // shopAdress: '', // 地址
        // classify: '', //大类
        // coordinate: '', //坐标
        // service: '', //提供服务
        // effectiveDate: '', // 生效日期
        // effectiveYear: '', // 生效年限
        // contractState: 1, // 合同状态 1-有效 0-无效
        shopPhone: '', // 账号
        shopPassword: '' // 密码
      }
      this.dialogVisible = true
      this.ruleForm.service =
        this.ruleForm.service[2] ||
        this.ruleForm.service[1] ||
        this.ruleForm.service[0] ||
        this.ruleForm.service
      console.log(this.userState)
    },
    next() {
      this.activeName = 'second'
    },
    closeFn() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['ruleFormInfo'].clearValidate()
        this.dialogVisible = false
      })
    },
    // 新建服务商确定
    addCheck(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          console.log(this.userState)
          console.log(this.ruleForm)
          if (this.ruleForm.shopName === '') {
            this.$message.error('请输入服务商名称')
            return
          }
          if (this.ruleForm.city === '') {
            this.$message.error('请输入城市')
            return
          }
          if (this.ruleForm.chargePersonName === '') {
            this.$message.error('请输入联系人')
            return
          }
          if (!this.userState) {
            businessListSave(this.ruleForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.dialogVisible = false
              this.$refs.ruleForm.clearValidate()
            })
          } else {
            businessListUpdate(this.ruleForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs.ruleForm.clearValidate()
              }
              this.getAll(this.formInline)
              this.dialogVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请输入完整信息')
          return false
        }
      })
    },
    // 查看
    async seeMore(row) {
      const res = await businessListGetById({ shopId: row.shopId })
      if (res.code === '') {
        this.userState = 3
        this.disabled = true
        this.ruleForm = res.data
        this.dialogVisible = true
      }
    },
    // 编辑
    async edit(row) {
      this.userState = 1
      this.disabled = false
      const res = await businessListGetById({ shopId: row.shopId })
      this.ruleForm = res.data
      this.dialogVisible = true
      console.log(this.ruleForm)
    },
    // 删除
    async del(row) {
      console.log(row)
      if (row.state === 1) {
        const res = await businessListStart({
          shopName: row.shopName,
          state: 0,
          shopId: row.shopId
        })
        if (res.code === '') {
          this.$message({
            message: '停用成功',
            type: 'success'
          })
          this.getAll(this.formInline)
        }
      } else {
        const res = await businessListStart({
          shopName: row.shopName,
          state: 1,
          shopId: row.shopId
        })
        if (res.code === '') {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          this.getAll(this.formInline)
        }
      }
    },
    // businessListGetAll
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await businessListGetAll(formInline)
      this.total = res.data.total
      this.tableData = res.data.list
    },

    async selectList() {
      const res = await getClassify()
      this.serviceList = res.data
    }
  }
}
</script>
<style lang='scss' scoped>
.tableBox {
  overflow-x: auto;
}
.two-column-tabs {
  display: flex;
  justify-content: space-between; /* 根据需要调整内容间距 */
  /* 根据实际情况可能需要设置最大宽度、溢出处理等 */
}
.tab-content-column1,
.tab-content-column2 {
  display: inline-block;
  vertical-align: top; /* 确保垂直对齐 */
  width: 50%; /* 各占一半宽度 */
  box-sizing: border-box; /* 包括padding和border在内计算宽度 */
  font-size: 16px; /* 重置字体大小 */
  /* 其他样式，如 padding、margin、border 等 */
}
@import url("../../../styles/elDialog.scss");
.pending {
  padding: 30px;
}
.fenye {
  margin-top: 20px;
}
.elipt {
  width: 50%;
}
.elspan {
  margin-left: 10px;
}
</style>
