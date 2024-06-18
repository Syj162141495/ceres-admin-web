<template>
  <div style="margin-left: 3%; margin-right: 3%">
    <div style="margin-top: 20px;">
      <el-form :inline="true" :v-model="searchForm">
        <el-form-item label="业务系统">
          <el-input v-model="searchForm.searchSystemModuleName" placeholder="请输入业务系统名称" />
        </el-form-item>
        <el-form-item label="接口名称">
          <el-input v-model="searchForm.searchInterfaceName" placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select
            v-model="searchForm.searchHttpMethod"
            placeholder="请选择请求方式"
          >
            <el-option
              v-for="item in httpMethodOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
              {{ item.value }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="success" plain @click="showAddDialogForm">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--新增或编辑弹窗-->
    <el-dialog :title="dialogFormName" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer scrollable-container">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px">
          <el-row>
            <el-col :span="1" />
            <el-col :span="11">
              <el-form-item
                label="业务系统"
                :rules="[{
                  required: true, message: '请输入业务系统名称', trigger: 'blur' }]"
                prop="systemModuleName"
              >
                <el-input v-model="dynamicValidateForm.systemModuleName" label="业务系统" style="width: 100%;" placeholder="请输入业务系统名称" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="接口名称"
                :rules="[{
                  required: true, message: '请输入接口名称', trigger: 'blur' }]"
                prop="dataInterfaceName"
              >
                <el-input v-model="dynamicValidateForm.dataInterfaceName" label="接口名称" style="width: 100%;" placeholder="请输入接口名称" />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <el-row>
            <el-col :span="1" />
            <el-col :span="11">
              <el-form-item label="请求方式">
                <el-select
                  v-model="dynamicValidateForm.dataInterfaceHttpMethod"
                  placeholder="请选择请求方式"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in httpMethodOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="请求路径"
                :rules="[{
                  required: true, message: '请输入请求路径', trigger: 'blur' }]"
                prop="dataInterfaceUrl"
              >
                <el-input v-model="dynamicValidateForm.dataInterfaceUrl" label="接口请求路径" style="width: 100%;" placeholder="请输入请求路径" />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <el-row>
            <el-col :span="1" />
            <el-col :span="22">
              <el-form-item
                label="返回类型"
                :rules="[{
                  required: true, message: '请输入接口返回类型', trigger: 'blur' }]"
                prop="dataInterfaceReturnType"
              >
                <el-input v-model="dynamicValidateForm.dataInterfaceReturnType" label="接口返回类型" type="textarea" style="width: 100%;" placeholder="请输入接口返回类型" />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <el-row>
            <el-col :span="1" />
            <el-col :span="22">
              <el-form-item label="返回示例">
                <el-input v-model="dynamicValidateForm.dataInterfaceReturnTypeExample" label="接口返回示例" type="textarea" style="width: 100%;" placeholder="请输入接口返回示例" />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.dataInterfaceParameterList"
            :key="index"
            :label="index === 0 ? '接口参数' : ''"
          >
            <el-row>
              <el-col :span="9">
                <el-input
                  v-model="dynamicValidateForm.dataInterfaceParameterList[index].dataInterfaceParameterType"
                  type="textarea"
                  placeholder="请输入参数类型"
                />
              </el-col>
              <el-col :span="9">
                <el-input
                  v-model="dynamicValidateForm.dataInterfaceParameterList[index].dataInterfaceParameterExample"
                  type="textarea"
                  placeholder="请输入参数示例"
                  style="margin-left: 10px"
                />
              </el-col>
              <el-col :span="2">
                <el-button type="danger" plain style="margin-left: 25px" @click.prevent="removeDataInterfaceParameter(domain)">删除</el-button>
              </el-col>
              <el-col :span="1" />
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="22">
              <el-form-item>
                <el-button plain type="success" @click="addDataInterfaceParameter(dynamicValidateForm)">新增接口参数</el-button>
                <el-button plain type="primary" @click="submitForm('dynamicValidateForm', dynamicValidateForm)">提交</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
          </el-row>
        </el-form>
      </div>
    </el-dialog>
    <el-table :data="dataInterfaceList" style="width: 100%" class="el-table" :header-cell-style="{ background: '#EEF3FF', color: '#333333' }" border>
      <el-table-column label="序号" prop="dataInterfaceId" width="50px" />
      <el-table-column label="业务系统" prop="systemModuleName" />
      <el-table-column label="接口名称" prop="dataInterfaceName" />
      <el-table-column label="接口请求方式" prop="dataInterfaceHttpMethod" />
      <el-table-column label="接口请求地址" prop="dataInterfaceUrl" />
      <el-table-column label="接口返回参数类型" prop="dataInterfaceReturnType" />
      <el-table-column label="接口返回参数示例" prop="dataInterfaceReturnTypeExample" />
      <el-table-column label="操作" width="100%">
        <template slot-scope="scope">
          <el-button plain size="mini" type="text" @click="showView(scope.row)">查看接口参数</el-button>
          <el-button plain size="mini" type="text" @click="showEditDialogForm(scope.$index, scope.row)">编辑</el-button>
          <el-button plain size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="接口参数信息" :visible.sync="parameterDialogFormVisible">
      <div v-if="dataInterfaceParameterList.length === 0">
        暂无参数
      </div>
      <el-form :model="dataInterfaceParameterList">
        <div v-for="(dataInterfaceParameter, index) in dataInterfaceParameterList" :key="index">
          <el-row>
            <el-col :span="1" />
            <el-col :span="11">
              <el-form-item :label="`参数${index + 1}类型`">
                <el-input v-model="dataInterfaceParameter.dataInterfaceParameterType" :disabled="true" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item :label="`参数${index + 1}示例`" style="margin-left: 5%">
                <el-input v-model="dataInterfaceParameter.dataInterfaceParameterExample" :disabled="true" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
        </div>
      </el-form>
    </el-dialog>
    <el-pagination
      :current-page="dynamicValidateForm.pageNumber"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="dynamicValidateForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getDataInterfaceList, insertDataInterface, updateDataInterface, deleteDataInterface } from '@/api/dataInterface'

export default {
  data() {
    return {
      searchForm: {
        searchSystemModuleName: '',
        searchInterfaceName: '',
        searchHttpMethod: ''
      },
      isAddOrEdit: 0,
      dialogFormName: '',
      dialogFormVisible: false,
      dynamicValidateForm: {
        dataInterfaceId: 0,
        systemModuleName: '',
        dataInterfaceName: '',
        dataInterfaceHttpMethod: '',
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      },
      dataInterfaceList: [],
      total: 0,
      httpMethodOptions: [{
        value: 'GET'
      }, {
        value: 'POST'
      }, {
        value: 'PUT'
      }, {
        value: 'DELETE'
      }, {
        value: 'PATCH'
      }],
      parameterDialogFormVisible: false,
      dataInterfaceParameterList: [],
      deleteDialogVisible: false
    }
  },
  created() {
    this.load()
  },
  methods: {
    search() {
      const dataInterfaceParam = {
        dataInterfaceId: 0,
        systemModuleName: this.searchForm.searchSystemModuleName,
        dataInterfaceName: this.searchForm.searchInterfaceName,
        dataInterfaceHttpMethod: this.searchForm.searchHttpMethod,
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      }
      getDataInterfaceList(dataInterfaceParam).then(res => {
        this.dataInterfaceList = res.data.list
        this.total = res.data.total
      })
    },
    // 数据加载
    load() {
      const dataInterfaceParam = {
        dataInterfaceId: 0,
        systemModuleName: '',
        dataInterfaceName: '',
        dataInterfaceHttpMethod: '',
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      }
      getDataInterfaceList(dataInterfaceParam).then(res => {
        this.dataInterfaceList = res.data.list
        this.total = res.data.total
      })
    },
    // 展示新增表单
    showAddDialogForm() {
      this.dialogFormName = '新增'
      this.dialogFormVisible = true
      this.isAddOrEdit = 0
      this.dynamicValidateForm = {
        dataInterfaceId: 0,
        systemModuleName: '',
        dataInterfaceName: '',
        dataInterfaceHttpMethod: '',
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      }
    },
    showView(row) {
      this.parameterDialogFormVisible = true
      this.dataInterfaceParameterList = row.dataInterfaceParameterList
    },
    // 展示修改表单
    showEditDialogForm(index, row) {
      this.dialogFormName = '编辑'
      this.dialogFormVisible = true
      this.isAddOrEdit = 1
      this.dynamicValidateForm = row
      console.log('showEditDialogForm', row)
    },
    // 数据删除
    handleDelete(index, row) {
      this.$confirm('您确定要执行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          deleteDataInterface(row).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功执行!'
            })
            this.load()
          })
            .catch(() => {
              this.$message({
                message: '操作取消执行'
              })
            })
        })
    },
    submitForm(formName, dynamicValidateForm) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAddOrEdit === 0) {
            for (let i = 0; i < dynamicValidateForm.dataInterfaceParameterList.length; i++) {
              dynamicValidateForm.dataInterfaceParameterList[i].dataInterfaceParameterId = 0
            }
            insertDataInterface(dynamicValidateForm).then(res => {
              this.dialogFormVisible = false
              this.load()
            })
          } else {
            updateDataInterface(dynamicValidateForm).then(res => {
              this.dialogFormVisible = false
              this.load()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeDataInterfaceParameter(item) {
      const index = this.dynamicValidateForm.dataInterfaceParameterList.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.dataInterfaceParameterList.splice(index, 1)
      }
    },
    addDataInterfaceParameter(dynamicValidateForm) {
      dynamicValidateForm.dataInterfaceParameterList.push({
        dataInterfaceId: dynamicValidateForm.dataInterfaceId,
        dataInterfaceParameterType: '',
        dataInterfaceParameterExample: ''
      })
    },
    handleSizeChange(val) {
      const dataInterfaceParam = {
        dataInterfaceId: 0,
        systemModuleName: this.searchForm.searchSystemModuleName,
        dataInterfaceName: this.searchForm.searchInterfaceName,
        dataInterfaceHttpMethod: this.searchForm.searchHttpMethod,
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      }
      dataInterfaceParam.pageSize = val
      getDataInterfaceList(dataInterfaceParam).then(res => {
        this.dataInterfaceList = res.data.list
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      const dataInterfaceParam = {
        dataInterfaceId: 0,
        systemModuleName: this.searchForm.searchSystemModuleName,
        dataInterfaceName: this.searchForm.searchInterfaceName,
        dataInterfaceHttpMethod: this.searchForm.searchHttpMethod,
        dataInterfaceUrl: '',
        dataInterfaceReturnType: '',
        dataInterfaceReturnTypeExample: '',
        dataInterfaceParameterList: [],
        pageNumber: 1,
        pageSize: 5
      }
      dataInterfaceParam.pageNumber = val
      getDataInterfaceList(dataInterfaceParam).then(res => {
        this.dataInterfaceList = res.data.list
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
/**{*/
/*  border: black 1px solid;*/
/*}*/
.item-pair{
  display: flex;
}

.green-button {
  margin-top: 10px;
  margin-left: 10px;
}
.el-table tr td,
.el-table tr th {
  padding: 12px 0;
  vertical-align: middle;
}
.el-table {
  border-top: 1px solid #dfe6ec;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.el-dialog__header {
  padding: 20px 24px;
}
.el-dialog__body {
  padding: 20px;
}
.el-button {
  border: none;
}
.el-pager li.active {
  background-color: #007bff;
  color: #fff;
}
.el-pagination button {
  border-radius: 4px;
}
.scrollable-container {
  max-height: 400px; /* 限制容器的最大高度 */
  overflow-y: auto; /* 当内容溢出时，垂直方向显示滚动条 */
  /* 可选：自定义滚动条样式，这里提供一个基本的例子 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f0f0f0;
}
.user-dialog {
  justify-content: center;
}
</style>
