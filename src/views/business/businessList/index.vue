<!--  -->
<template>
  <div>
    <div class="pending">
      <!-- 搜索 -->
      <div class="formSearch">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="服务商名称">
            <el-input v-model="formInline.shopName" placeholder="请输入服务商名称" />
          </el-form-item>
          <!--<el-form-item label="服务商编码">
            <el-input v-model="formInline.shopCode" placeholder="请输入服务商编码" />
          </el-form-item>-->
          <el-form-item label="负责人">
            <el-input v-model="formInline.chargePersonName" placeholder="请输入负责人" />
          </el-form-item>
          <el-form-item label="合同状态">
            <el-select v-model="formInline.contractState" placeholder="请选择">
              <el-option label="有效" value="1" />
              <el-option label="无效" value="0" />
            </el-select>
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
          <el-table-column label="服务商名称" width="220">
            <template slot-scope="scope">{{ scope.row.shopName }}</template>
          </el-table-column>
          <!--<el-table-column prop="shopCode" label="服务商编码" />-->
          <el-table-column prop="shopAdress" label="区域" />
          <el-table-column prop="classify" label="大类" />
          <el-table-column prop="coordinate" label="坐标" />
          <el-table-column prop="service" label="提供服务" />
          <el-table-column prop="chargePersonName" label="负责人" />
          <el-table-column prop="chargePersonPhone" label="联系电话" />
          <el-table-column label="合同状态">
            <template slot-scope="scope">
              <span v-if="scope.row.contractState === 0">无效</span>
              <span v-if="scope.row.contractState === 1">有效</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作" show-overflow-tooltip>
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
        width="30%"
        center
        :close-on-click-modal="false"
      >
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="授权信息" name="first">
              <el-form ref="ruleFormInfo" :model="ruleForm" :rules="rulesInfo" label-width="100px">
                <el-form-item label="服务商名称" prop="shopName">
                  <el-input v-model="ruleForm.shopName" :disabled="disabled" />
                </el-form-item>
                <el-form-item label="服务商负责人" prop="chargePersonName">
                  <el-input v-model="ruleForm.chargePersonName" :disabled="disabled" />
                </el-form-item>
                <el-form-item label="负责人电话" prop="chargePersonPhone">
                  <el-input v-model="ruleForm.chargePersonPhone" :disabled="disabled" />
                </el-form-item>
                <el-form-item label="服务商地址" prop="shopAdress">
                  <el-input v-model="ruleForm.shopAdress" :disabled="disabled" />
                </el-form-item>


                <!-- <el-form-item label="大类" prop="classify">
                  <el-input v-model="ruleForm.classify" :disabled="disabled" />
                </el-form-item> -->
                <el-form-item label="大类">
                  <el-select v-model="ruleForm.classify" placeholder="请选择">
                    <el-option label="医疗" value="medical"></el-option>
                    <el-option label="康复" value="recovered"></el-option>
                    <el-option label="养老" value="retirement"></el-option>
                    <el-option label="其他" value="other"></el-option>
                  </el-select>
                </el-form-item>


                <el-form-item label="坐标" prop="coordinate">
                  <el-input v-model="ruleForm.coordinate" :disabled="disabled" />
                </el-form-item>



                <!-- <el-form-item label="提供服务" prop="service">
                  <el-input v-model="ruleForm.service" :disabled="disabled" />
                </el-form-item> -->
                <el-form-item label="提供服务">
                  <el-cascader
                    v-model="ruleForm.service"
                    :options="serviceList"
                    clearable
                    :props="{
                      checkStrictly: true,
                      label:'categoryName',
                      value:'id',
                      children:'childs'
                    }"
                  />
                </el-form-item>
                <!-- <el-form-item label="提供服务">
                  <el-select
                    v-model="ruleForm.service"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="option in serviceList"
                      :key="option.id"
                      :label="option.categoryName"
                      :value="option.id"
                    ></el-option>
                  </el-select>
                </el-form-item> -->



                <el-form-item label="生效日期" prop="effectiveDate">
                  <el-date-picker
                    v-model="ruleForm.effectiveDate"
                    :disabled="disabled"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="生效年限" prop="effectiveYear">
                  <el-input
                    v-model="ruleForm.effectiveYear"
                    type="text"
                    :disabled="disabled"
                    placeholder="请输入内容"
                    maxlength="4"
                    class="elipt"
                    style="width: 50%"
                    show-word-limit
                  />
                  <span class="elspan">年</span>
                </el-form-item>
                <el-form-item label="合同状态" prop="contractState">
                  <el-radio-group v-model="ruleForm.contractState">
                    <el-radio :disabled="disabled" :label="1">有效</el-radio>
                    <el-radio :disabled="disabled" :label="0">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="客户信息" name="second">
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
        shopCode: '', // 服务商编码
        chargePersonName: '', // 服务商负责人
        contractState: '', // 合同状态 1-有效 0-无效
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      disabled: false,
      ruleForm: {
        shopName: '', // 服务商名称
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        shopAdress: '', // 地址
        classify: '', //大类
        coordinate: '', //坐标
        service: '', //提供服务
        effectiveDate: '', // 生效日期
        effectiveYear: '', // 生效年限
        contractState: 1, // 合同状态 1-有效 0-无效
        shopPhone: '', // 账号
        shopPassword: '' // 密码
      },
      rulesInfo: {
        effectiveYear: [
          { required: true, message: '请输入生效时限', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        chargePersonName: [
          { required: true, message: '请输入服务商负责人', trigger: 'blur' }
        ],
        chargePersonPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        shopAdress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '请输入大类', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '请输入坐标', trigger: 'blur' }
        ],
        service: [
          { required: true, message: '请输入提供服务', trigger: 'blur' }
        ],
        contractState: [
          {
            required: true,
            message: '请选择合同状态',
            trigger: 'change'
          }
        ],
        effectiveDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
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
        chargePersonName: '', // 服务商负责人
        chargePersonPhone: '', // 负责人电话
        shopAdress: '', // 地址
        classify: '', //大类
        coordinate: '', //坐标
        service: '', //提供服务
        effectiveDate: '', // 生效日期
        effectiveYear: '', // 生效年限
        contractState: 1, // 合同状态 1-有效 0-无效
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
          if (this.ruleForm.effectiveDate === '') {
            this.$message.error('请输入生效日期')
            return
          }
          if (this.ruleForm.effectiveYear === '') {
            this.$message.error('请输入生效年限')
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
