<!--  -->
<template>
  <div class="dictStyle">
    <!-- 左侧列表 -->
    <div class="leftTable">
      <el-card class="box-card">
        <div class="cardItem">
          <!-- 顶部搜索框 -->
          <div class="formSearch">
            <el-form :inline="true" :model="formInline">
              <el-form-item label="字典名称">
                <el-input v-model="formInline.search" placeholder="请输入字典名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="search">查询</el-button>
                <el-button type="info" plain @click="clear">重置</el-button>
                <el-button type="success" plain @click="add">新建</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 表格 -->
          <div class="tableBox">
            <el-table
              ref="singleTable"
              :data="tableData"
              border
              highlight-current-row
              style="width: 100%"
              @current-change="tableChange"
            >
              <el-table-column type="index" width="50" />
              <el-table-column property="dictName" label="字典名称" width="220" />
              <el-table-column property="dictDescribe" label="字典描述" width="120" />
              <el-table-column property="createTime" label="创建时间" />
              <el-table-column label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="btnList">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
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
        </div>
      </el-card>
    </div>
    <!-- 右侧列表 -->
    <div class="rightTable">
      <el-card class="box-card">
        <span class="cardSpan">字典详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addNewDict">新增</el-button>
        <div class="cardItem">
          <!-- 表格 -->
          <div class="tableBox">
            <el-table ref="singleTable" :data="anothTable" style="width: 100%">
              <el-table-column type="index" width="50" />
              <el-table-column property="dictName" label="字典名称" width="120" />
              <el-table-column property="dictDescribe" label="字典描述" width="120" />
              <el-table-column property="createTime" label="创建时间" />
              <el-table-column label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="btnList">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="del(scope.row)">删除</el-button>
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
                :total="antotal"
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- *************对话框开始************* -->
    <el-dialog
      :title="userState ? '新增字典' : '修改字典'"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <!-- 新增角色 -->
      <div>
        <el-form ref="ruleForm" :model="addForm" label-width="80px" :rules="userRules">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="addForm.dictName" placeholder="请输入字典名称" />
          </el-form-item>
          <el-form-item label="字典描述">
            <el-input v-model="addForm.dictDescribe" placeholder="请输入字典描述" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="addForm_enter('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  dictGetAll,
  dictAdd,
  dictGetById,
  dictUpdate,
  dictGetChilds,
  dictDelete
} from '@/api/setup'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      formInline: {
        search: '',
        page: 1,
        pageSize: 10
      },
      sonInline: {
        dictPid: '',
        page: 1,
        pageSize: 10
      },
      total: 1,
      antotal: 1,
      tableData: [],
      anothTable: [],
      currentPage: 1,
      addFormDialog: false,
      addForm: {
        dictId: '', // 字典id
        dictPid: '', // 字典父id
        dictName: '', // 字典名称
        dictDescribe: '', // 字典描述
        createTime: '' // 创建时间
      },
      userState: 1,
      userRules: {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ]
      }
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
  activated() {},
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
    handleSizeChanges(val) {
      this.sonInline.pageSize = val
      this.getAllR(this.sonInline)
    },
    handleCurrentChanges(val) {
      this.sonInline.page = val
      this.getAllR(this.sonInline)
    },
    tableChange(val) {
      console.log(val)
      this.sonInline.dictPid = val.dictId
      dictGetChilds(this.sonInline).then(res => {
        console.log(res)
        this.anothTable = res.data.list
        this.antotal = res.data.total
      })
    },
    // 初始化查询所有数据
    async getAllR(formInline) {
      const res = await dictGetChilds(formInline)
      this.anothTable = res.data.list
      this.antotal = res.data.total
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 新增
    add() {
      this.userState = 1
      this.addFormDialog = true
      this.addForm = {
        dictId: '', // 字典id
        dictPid: '', // 字典父id
        dictName: '', // 字典名称
        dictDescribe: '', // 字典描述
        createTime: '' // 创建时间
      }
    },
    // 新增子字典
    addNewDict() {
      this.userState = 1
      this.addFormDialog = true
      this.addForm = {
        dictId: '', // 字典id
        dictPid: '', // 字典父id
        dictName: '', // 字典名称
        dictDescribe: '', // 字典描述
        createTime: '' // 创建时间
      }
      this.addForm.dictPid = this.sonInline.dictPid
      console.log(this.addForm)
    },
    // 编辑
    edit(row) {
      this.userState = 0
      this.addFormDialog = true
      console.log(row)
      dictGetById({ dictId: row.dictId }).then(res => {
        this.addForm = res.data
        console.log(this.addForm)
        // this.addForm.roleIds = [1];
      })
    },
    // 删除角色
    async del(row) {
      const res = await dictDelete({ dictId: row.dictId })
      if (res.code === '') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getAll(this.formInline)
        this.tableChange({
          dictId: this.sonInline.dictPid
        })
      }
    },
    // 确认新增字典
    addForm_enter(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.userState) {
            dictAdd(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.tableChange({
                dictId: this.sonInline.dictPid
              })
              this.addFormDialog = false
            })
          } else {
            console.log(this.addForm)
            dictUpdate(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.tableChange({
                dictId: this.sonInline.dictPid
              })
              this.addFormDialog = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clear() {
      this.formInline = {
        search: '', // 搜索字段
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      }
      this.getAll(this.formInline)
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await dictGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.dictStyle {
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: flex-start;
}
.leftTable {
  width: 49%;
}
.rightTable {
  width: 49%;
}
.cardSpan {
  font-size: 15px;
  color: #606266;
  font-weight: bold;
}
</style>
