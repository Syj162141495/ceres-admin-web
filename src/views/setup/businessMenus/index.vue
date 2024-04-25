<!--  -->
<template>
  <div class="userStyle">
    <!-- 搜索 -->
    <div class="formSearch">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="菜单名">
          <el-input v-model="formInline.permissionName" placeholder="请输入菜单名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
          <el-button type="info" plain @click="clear">重置</el-button>
          <el-button type="success" plain @click="add(1)">新增父级目录</el-button>
          <el-button type="success" plain @click="add(2)">新增子级菜单</el-button>
          <el-button type="success" plain @click="add(3)">新增子级按钮</el-button>
          <el-button type="success" plain @click="syncMenu()">同步菜单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        ref="menuList"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="permissionId"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        default-expand-all
        :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
        @select="select"
        @select-all="selectAll"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="permissionName" label="菜单名称" />
        <el-table-column label="图标">
          <template slot-scope="scope">
            <div>
              <i :class="scope.row.icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="菜单标识" />
        <el-table-column prop="createTime" label="创建时间" />
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

    <!-- *************对话框开始************* -->
    <el-dialog
      :title="userState ? '新增菜单' : '修改菜单'"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <!-- 新增角色 -->
      <div>
        <el-form ref="ruleForm" :model="addForm" label-width="80px" :rules="userRules">
          <el-form-item label="父节点ID">
            <el-input v-model="addForm.permissionPid" :disabled="true" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="菜单名称" prop="permissionName">
            <el-input v-model="addForm.permissionName" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单路径" prop="permission">
            <el-input v-model="addForm.permission" placeholder="请输入菜单路径" />
          </el-form-item>
          <el-form-item label="图标地址" prop="icon">
            <el-input
              v-model="addForm.icon"
              :prefix-icon="addForm.icon"
              placeholder="请输入图片地址"
              @focus="getFocus"
            />
          </el-form-item>
          <el-form-item label="菜单描述">
            <el-input v-model="addForm.describe" placeholder="请输入菜单描述" />
          </el-form-item>
          <el-form-item label="排序值" prop="sort">
            <el-input v-model="addForm.sort" type="number" placeholder="请输入排序值" />
          </el-form-item>
          <el-form-item label="权限类型" prop="resourceType">
            <el-select v-model="addForm.resourceType" placeholder="请选择活动区域">
              <el-option label="菜单" value="menu" />
              <el-option label="按钮" value="button" />
              <el-option label="目录" value="catalog" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="addForm_enter('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- *************同步菜单对话框开始************* -->
    <el-dialog
      :title="'同步菜单'"
      :visible.sync="syncMenuDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <!-- 新增角色 -->
      <div>
        <el-form ref="syncMenuForm" :model="syncMenuForm" label-width="80px" :rules="syncMenuRules">
          <el-form-item label="同步范围" prop="syncAll">
            <el-radio-group v-model="syncMenuForm.syncAll">
              <el-radio :label="true">同步所有</el-radio>
              <el-radio :label="false">同步指定商家</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="删除菜单">
            <el-checkbox v-model="syncMenuForm.delMenu" />
          </el-form-item>
          <el-form-item v-if="syncMenuForm.syncAll==false" label="商家账号">
            <el-input v-model="syncMenuForm.syncBusinessUsername" placeholder="请输入商家账号" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="syncMenuDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitSyncMenu('syncMenuForm')">确 定</el-button>
      </span>
    </el-dialog>

    <Icons :dialog-visible="iconVisible" @choose="chooseIcon" @close="iconVisible = false" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  businessTabsGetAll,
  businessTabsAdd,
  businessTabsGetById,
  businessTabsUpdate,
  businessTabsDelete,
  businessGetMaxSort,
  businessSyncMenu
} from '@/api/setup'
import Icons from './Icons'
import { Message } from 'element-ui'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Icons },
  data() {
    // 这里存放数据
    return {
      formInline: {
        permissionName: '', // 搜索字段
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      userState: 1,
      addForm: {
        permissionPid: '', // 父节点id
        permissionName: '', // 权限名称
        permissionUri: '', // URI
        permission: '', // 组件
        icon: '', // 图标地址
        describe: '', // 描述
        resourceType: 'menu', // 权限类型 menu-菜单 button-按钮 catalog-目录
        sort: '' // 排序值
      },
      syncMenuForm: {
        syncAll: false,
        syncBusinessUsername: '',
        delMenu: false
      },
      addFormDialog: false,
      syncMenuDialog: false,
      userRules: {
        permissionName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        sort: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标地址', trigger: 'blur' }]
      },
      syncMenuRules: {},
      iconVisible: false,
      multipleSelection: [],
      loading: false
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
    handleSelectionChange(val) {
      // console.dir(this.$refs.menuList.selection)
      // const sel = this.extract(val)
      this.multipleSelection = val
      // console.dir(this.$refs.menuList)
    },
    setChildren(children, type) {
      // 编辑多个子层级
      children.map(j => {
        this.toggleSelection(j, type)
        if (j.childs) {
          this.setChildren(j.childs, type)
        }
      })
    },
    // 选中父节点时，子节点一起选中取消
    select(selection, row) {
      if (selection.some(el => { return row.permissionId === el.permissionId })) {
        if (row.childs) {
          // row.childList.map(j => {
          //     this.toggleSelection(j, true)
          // })
          // 解决子组件没有被勾选到
          this.setChildren(row.childs, true)
        }
      } else {
        if (row.childs) {
          // row.childList.map(j => {
          //     this.toggleSelection(j, false)
          // })
          this.setChildren(row.childs, false)
        }
      }
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.menuList && this.$refs.menuList.toggleRowSelection(row, select)
        })
      }
    },
    // 选择全部
    selectAll(selection) {
      // tabledata第一层只要有在selection里面就是全选
      const isSelect = selection.some(el => {
        const tableDataIds = this.tableData.map(j => j.permissionId)
        return tableDataIds.includes(el.permissionId)
      })
      // tableDate第一层只要有不在selection里面就是全不选
      const isCancel = !this.tableData.every(el => {
        const selectIds = selection.map(j => j.permissionId)
        return selectIds.includes(el.permissionId)
      })
      console.log(isSelect, 'isSelect')
      if (isSelect) {
        selection.map(el => {
          if (el.childs) {
            // el.childList.map(j => {
            //     this.toggleSelection(j, true)
            // })
            // 解决子组件没有被勾选到
            this.setChildren(el.childs, true)
          }
        })
      }
      if (isCancel) {
        this.tableData.map(el => {
          if (el.childs) {
            // el.childList.map(j => {
            //     this.toggleSelection(j, false)
            // })
            // 解决子组件没有被勾选到
            this.setChildren(el.childs, false)
          }
        })
      }
      this.$emit('handleSelect', this.tableData)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    removeTag(index) {
      console.log(index)
    },
    tagChange(index) {
      this.$forceUpdate()
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清除
    clear() {
      this.formInline = {
        permissionName: '', // 搜索字段
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      }
      this.getAll(this.formInline)
    },
    // 新增角色
    add(index) {
      this.userState = 1
      businessGetMaxSort().then(res => {
        if (index === 1) {
          if (this.multipleSelection.length >= 1) {
            this.$message({
              message: '请勿选择节点进行操作'
            })
            return
          }
          this.addForm = {
            permissionPid: '', // 父节点id
            permissionName: '', // 权限名称
            permissionUri: '', // URI
            permission: '', // 组件
            icon: '', // 图标地址
            describe: '', // 描述
            resourceType: 'catalog', // 权限类型 menu-菜单 button-按钮 catalog-目录
            sort: parseInt(res.data) // 排序值
          }
          this.addFormDialog = true
        } else if (index === 2) {
          if (this.multipleSelection.length === 0) {
            this.$message({
              message: '请选择父节点'
            })
            return
          }
          if (this.multipleSelection[0].permissionPid !== 0) {
            this.$message({
              message: '请选择父节点进行操作'
            })
            return
          }
          this.addForm = {
            permissionPid: this.multipleSelection[0].permissionId, // 父节点id
            permissionName: '', // 权限名称
            permissionUri: '', // URI
            permission: '', // 组件
            icon: '', // 图标地址
            describe: '', // 描述
            resourceType: 'menu', // 权限类型 menu-菜单 button-按钮 catalog-目录
            sort: parseInt(res.data) // 排序值
          }
          this.addFormDialog = true
        } else if (index === 3) {
          if (this.multipleSelection.length === 0) {
            this.$message({
              message: '请选择子节点'
            })
            return
          }
          if (
            this.multipleSelection[0].permissionPid === 0 &&
            this.multipleSelection[0].childs.length !== 0
          ) {
            this.$message({
              message: '请勿选择父节点进行操作'
            })
            return
          }
          this.addForm = {
            permissionPid: this.multipleSelection[0].permissionId, // 父节点id
            permissionName: '', // 权限名称
            permissionUri: '', // URI
            permission: '', // 组件
            icon: 'el-icon-minus', // 图标地址
            describe: '', // 描述
            resourceType: 'button', // 权限类型 menu-菜单 button-按钮 catalog-目录
            sort: parseInt(res.data) // 排序值
          }
          this.addFormDialog = true
        }
      })
    },
    syncMenu() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要同步的节点'
        })
        return
      }
      this.syncMenuForm.syncAll = true
      this.syncMenuForm.syncBusinessUsername = ''
      this.syncMenuForm.delMenu = false
      this.syncMenuDialog = true
    },
    submitSyncMenu(syncMenuForm) {
      const that = this
      this.$refs[syncMenuForm].validate(valid => {
        if (valid) {
          if (that.syncMenuForm.syncAll === false && that.syncMenuForm.syncBusinessUsername === '') {
            this.$message({
              message: '请输入要同步的商家账号'
            })
            return
          }
          this.loading = true
          businessSyncMenu(Object.assign({}, this.syncMenuForm, { syncMenu: this.multipleSelection })).then(res => {
            if (res.code === '') {
              this.$message({
                message: '同步成功',
                type: 'success'
              })
            }
            this.loading = false
            this.syncMenuDialog = false
          }).catch(error => {
            if (error && error.message.includes('timeout')) {
              Message({
                message: '后台正在异步处理，请关注商家端菜单变化',
                type: 'error',
                duration: 2 * 1000
              })
            }
            this.loading = false
            this.syncMenuDialog = false
          })
        }
      })
    },
    // 确认新增角色
    addForm_enter(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.userState) {
            businessTabsAdd(this.addForm).then(res => {
              if (res.code === '') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.addFormDialog = false
            })
          } else {
            businessTabsUpdate(this.addForm).then(res => {
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.addFormDialog = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑角色
    edit(row) {
      this.userState = 0
      this.addFormDialog = true
      businessTabsGetById({ permissionId: row.permissionId }).then(res => {
        this.addForm = res.data
        // this.addForm.roleIds = [1];
      })
    },
    // 删除角色
    async del(row) {
      const res = await businessTabsDelete({ permissionId: row.permissionId })
      if (res.code === '') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
      this.getAll(this.formInline)
    },
    // 组件传回值
    chooseIcon(icon) {
      this.addForm.icon = icon
      this.iconVisible = false
    },
    getFocus() {
      this.iconVisible = true
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await businessTabsGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@import url("../../../styles/elDialog.scss");
.userStyle {
  padding: 20px;
}
</style>
