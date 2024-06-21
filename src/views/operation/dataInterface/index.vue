<template>
  <div style="margin-left: 1%; margin-right: 1%">
    <!--    <el-input v-model="search" placeholder="search" style="width: 300px; margin-bottom: 10px;" />-->
    <el-button type="primary" class="green-button" style="margin-bottom: 10px; margin-left: 0" @click="showAddDialogForm">新增</el-button>
    <!--新增或编辑弹窗-->
    <el-dialog :title="dialogFormName" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer scrollable-container">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px">
          <div class="item-pair">
            <el-form-item
              label="业务系统"
              :rules="[{
                required: true, message: '请输入业务系统名称', trigger: 'blur' }]"
              prop="systemModuleName"
            >
              <el-input v-model="dynamicValidateForm.systemModuleName" label="业务系统" />
            </el-form-item>
            <el-form-item
              label="接口名称"
              :rules="[{
                required: true, message: '请输入接口名称', trigger: 'blur' }]"
              prop="dataInterfaceName"
            >
              <el-input v-model="dynamicValidateForm.dataInterfaceName" label="接口名称" />
            </el-form-item>
          </div>
          <div class="item-pair">
            <el-form-item label="请求方式">
              <el-select
                v-model="dynamicValidateForm.dataInterfaceHttpMethod"
                style="width: 206px"
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
            <el-form-item
              label="请求路径"
              :rules="[{
                required: true, message: '请输入请求路径', trigger: 'blur' }]"
              prop="dataInterfaceUrl"
            >
              <el-input v-model="dynamicValidateForm.dataInterfaceUrl" label="接口请求路径" style="width: 206px;" />
            </el-form-item>
          </div>
          <div class="item-pair">
            <el-form-item
              label="返回类型"
              :rules="[{
                required: true, message: '请输入接口返回类型', trigger: 'blur' }]"
              prop="dataInterfaceReturnType"
            >
              <el-input v-model="dynamicValidateForm.dataInterfaceReturnType" label="接口返回类型" type="textarea" style="width: 206px;" />
            </el-form-item>
            <el-form-item label="返回示例">
              <el-input v-model="dynamicValidateForm.dataInterfaceReturnTypeExample" label="接口返回示例" type="textarea" style="width: 206px;" />
            </el-form-item>
          </div>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.dataInterfaceParameterList"
            :key="index"
            style="display: flex"
            :label="index === 0 ? '接口参数' : ''"
          >
            <div style="display: flex;">
              <el-input
                v-model="dynamicValidateForm.dataInterfaceParameterList[index].dataInterfaceParameterType"
                :style="{ 'margin-left': index === 0 ? '-100px' : 'auto', width: '208px' }"
                type="textarea"
                placeholder="参数类型"
              />
              <el-input
                v-model="dynamicValidateForm.dataInterfaceParameterList[index].dataInterfaceParameterExample"
                style="margin-left: 13px; width: 208px"
                type="textarea"
                placeholder="参数示例"
              />
              <el-button style="margin-left: 13px" @click.prevent="removeDataInterfaceParameter(domain)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item style="display: flex">
            <el-button style="margin-left: 386px" @click="addDataInterfaceParameter(dynamicValidateForm)">新增接口参数</el-button>
            <el-button type="primary" @click="submitForm('dynamicValidateForm', dynamicValidateForm)">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-table 
      :data="dataInterfaceList" 
      style="width: 100%" 
      class="el-table"
      border
      :header-cell-style="{ background: '#EEF3FF', color: '#333333', 'text-align':'center'}"
    >
      <el-table-column label="序号" prop="dataInterfaceId" width="50px" />
      <el-table-column label="业务系统" prop="systemModuleName" />
      <el-table-column label="接口名称" prop="dataInterfaceName" />
      <el-table-column label="接口请求方式" prop="dataInterfaceHttpMethod" />
      <el-table-column label="接口请求地址" prop="dataInterfaceUrl" />
      <el-table-column label="接口返回参数类型" prop="dataInterfaceReturnType" />
      <el-table-column label="接口返回参数示例" prop="dataInterfaceReturnTypeExample" />
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showView(scope.row)">查看接口参数</el-button>
          <el-button type="text" size="mini" @click="showEditDialogForm(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="接口参数信息" :visible.sync="parameterDialogFormVisible">
      <div v-if="dataInterfaceParameterList.length === 0">
        暂无参数
      </div>
      <el-form :model="dataInterfaceParameterList">
        <div v-for="(dataInterfaceParameter, index) in dataInterfaceParameterList" :key="index" class="item-pair">
          <el-form-item :label="`参数${index + 1}类型`">
            <el-input v-model="dataInterfaceParameter.dataInterfaceParameterType" :disabled="true" />
          </el-form-item>
          <el-form-item :label="`参数${index + 1}示例`" style="margin-left: 5%">
            <el-input v-model="dataInterfaceParameter.dataInterfaceParameterExample" :disabled="true" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="parameterDialogFormVisible = false">确 定</el-button>
      </div>
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
      isAddOrEdit: 0,
      search: '',
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
      this.dynamicValidateForm.pageSize = val
      getDataInterfaceList(this.dynamicValidateForm).then(res => {
        this.dataInterfaceList = res.data.list
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      this.dynamicValidateForm.pageNumber = val
      getDataInterfaceList(this.dynamicValidateForm).then(res => {
        console.log(res)
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
  background-color: #4CAF50;
  color: white;
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
/* .el-button--primary {
  background-color: #007bff;
  border-color: #007bff;
  border-radius: 4px;
}
.el-button {
  font-weight: 500;
  border-radius: 4px;
} */
.el-dialog__header {
  padding: 20px 24px;
}
.el-dialog__body {
  padding: 20px;
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
