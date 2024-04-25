<!--  -->
<template>
  <div class="userStyle">
    <!-- 搜索 -->
    <div class="formSearch">
      <el-form :inline="true" :model="formInline">
        <el-form-item>
          <el-button type="primary" @click="add">新增权益</el-button>
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
        <el-table-column prop="memberName" label="权益名称" />
        <el-table-column label="权益图标" width="180" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.memberIcon"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column prop="memberReason" label="权益说明" />
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
    <!-- 新增权益 -->
    <el-dialog
      :title="userState ? '新增权益' : '修改权益'"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <!-- 新增权益 -->
      <div>
        <el-form ref="ruleForm" :model="addForm" label-width="80px" :rules="equityRules">
          <el-form-item label="权益名称" prop="memberName">
            <el-input v-model="addForm.memberName" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="权益图标">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="addForm.memberIcon" :src="addForm.memberIcon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="权益说明" prop="memberReason">
            <el-input v-model="addForm.memberReason" type="textarea" placeholder="请输入角色描述" />
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
  addMembership,
  getMembership,
  getMembershipInfo,
  delMembership, changeMembership
} from '@/api/member'
import { uploadUrl } from '@/utils/request'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      formInline: {
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      total: 1,
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      userState: 1,
      isChange: false,
      checkStrictly: true,
      action: uploadUrl,
      addForm: {
        memberId: null,
        memberIcon: '', // 权益图标
        memberName: '', // 权益名称
        memberReason: '' // 权益描述
      },
      addFormDialog: false,
      equityRules: {
        memberName: [
          { required: true, message: '请输入权益名称', trigger: 'blur' }
        ],
        memberReason: [
          { required: true, message: '请输权益描述', trigger: 'blur' }
        ]
      },
      roleId: null,
      imageUrl: ''
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
    handleAvatarSuccess(response) {
      const { url } = response.data
      this.addForm.memberIcon = url
      console.log(this.addForm.memberIcon, 'urls')
      this.$forceUpdate()
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
      console.log(index)
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
        search: '', // 搜索字段
        state: '', // 是否启用 1-是 0-否
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      }
      this.getAll(this.formInline)
    },
    // 新增角色
    add() {
      this.userState = 1
      this.addFormDialog = true
      this.isChange = true
      this.addForm = {
        memberId: null,
        memberIcon: '', // 权益图标
        memberName: '', // 权益名称
        memberReason: '' // 权益描述
      }
    },
    // 确认新增角色
    addForm_enter(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 修改
          if (!this.isChange) {
            changeMembership(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
              this.getAll(this.formInline)
              this.addFormDialog = false
            })
          } else {
            // 新增
            addMembership(this.addForm).then(res => {
              console.log(res)
              if (res.code === '') {
                this.$message({
                  message: '新增成功',
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
      this.addFormDialog = true
      this.isChange = false
      console.log(row)
      getMembershipInfo({ memberId: row.memberId }).then(res => {
        this.addForm = res.data
        console.log(this.addForm, '详情')
      })
    },
    // 删除权益
    async del(row) {
      this.$confirm('是否继续删除此权益?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delMembership({ memberId: row.memberId }).then(res => {
            if (res.code === '') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.getAll(this.formInline)
          })
        })
        .catch(() => {
          return false
        })
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await getMembership(formInline)
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
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
