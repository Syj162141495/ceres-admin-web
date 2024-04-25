<!--  -->
<template>
  <div class="userStyle">
    <!-- 搜索 -->
    <div class="formSearch">
      <el-form :inline="true" :model="formInline">
        <el-form-item>
          <el-button type="primary" @click="add">新增会员等级</el-button>
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
        <el-table-column prop="memberLevelName" label="会员等级" />
        <el-table-column prop="growth" label="成长值" />
        <el-table-column label="等级图标" width="140" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.memberLevelIcon"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column label="等级背景" width="140" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.memberLevelBackground"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column prop="memberLevelReason" label="等级说明" />
        <el-table-column prop="memberIds" label="等级权益" />
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
      :title="userState ? '新增会员等级' : '修改会员等级'"
      :visible.sync="addFormDialog"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <!-- 新增权益 -->
      <div>
        <el-form ref="ruleForm" :model="addForm" label-width="80px" :rules="levelRules">
          <el-form-item label="等级名称" prop="memberLevelName">
            <el-input v-model="addForm.memberLevelName" placeholder="请输入会员等级名称" />
          </el-form-item>
          <el-form-item label="成长值" prop="growth">
            <el-input v-model="addForm.growth" placeholder="请输入会员成长值" oninput="value=value.replace(/[^\d]/g,'')" />
          </el-form-item>
          <el-form-item label="等级图标" prop="memberLevelIcon">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleIconSuccess"
            >
              <img v-if="addForm.memberLevelIcon" :src="addForm.memberLevelIcon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <p class="formInfo">建议尺寸：100*100像素，jpg、png图片类型</p>
          </el-form-item>
          <el-form-item label="等级背景" prop="memberLevelBackground">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="handleBgSuccess"
            >
              <img v-if="addForm.memberLevelBackground" :src="addForm.memberLevelBackground" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <p class="formInfo">建议尺寸：100*100像素，jpg、png图片类型</p>
          </el-form-item>
          <el-form-item class="inputWide" label="等级权益" prop="ids">
            <el-select
              v-model="addForm.ids"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in tagList"
                :key="item.memberId"
                :label="item.memberName"
                :value="item.memberId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="等级说明" prop="memberLevelReason">
            <el-input v-model="addForm.memberLevelReason" type="textarea" placeholder="请输入等级说明" />
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
  getMembership,
  delMembership,
  getMemberlevel,
  getLevelInfo,
  updateLevel,
  addLevel,
  deleteLevel
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
      checkStrictly: true,
      action: uploadUrl,
      addForm: {
        growth: null,
        ids: [],
        memberLevelBackground: '',
        memberLevelIcon: '',
        memberLevelName: '',
        memberLevelReason: ''
      },
      equity: {
        page: '1', // 当前页
        pageSize: '1000' // 每页记录数
      },
      tagList: [],
      addFormDialog: false,
      levelRules: {
        memberLevelName: [
          { required: true, message: '请输入权益名称', trigger: 'blur' }
        ],
        memberLevelReason: [
          { required: true, message: '请输等级说明', trigger: 'blur' }
        ],
        growth: [
          { required: true, message: '请输入会员成长值', trigger: 'blur' }
        ],
        memberLevelIcon: [
          { required: true }
        ],
        memberLevelBackground: [
          { required: true }
        ],
        ids: [
          { required: true }
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
    this.getTagList(this.equity)
  },
  // 方法集合
  methods: {
    // 获取权益
    async getTagList(equity) {
      const res = await getMembership(equity)
      if (res.code === '') {
        this.tagList = res.data.list
        console.log(this.tagList, 'taglist')
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    handleIconSuccess(response) {
      const { url } = response.data
      this.addForm.memberLevelIcon = url
      this.$forceUpdate()
    },
    handleBgSuccess(response) {
      const { url } = response.data
      this.addForm.memberLevelBackground = url
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
    // 新增会员等级
    add() {
      this.userState = 1
      this.addFormDialog = true
      this.addForm = {
        growth: null,
        ids: [],
        memberLevelBackground: '',
        memberLevelIcon: '',
        memberLevelName: '',
        memberLevelReason: ''
      }
    },
    // 确认新增会员
    addForm_enter(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 修改
          if (this.userState === 2) {
            updateLevel(this.addForm).then(res => {
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
            this.addForm.growth = parseInt(this.addForm.growth)
            addLevel(this.addForm).then(res => {
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
    // 编辑等级信息
    edit(row) {
      this.addFormDialog = true
      this.userState = 2
      console.log(row)
      getLevelInfo({ memberLevelId: row.memberLevelId }).then(res => {
        this.addForm = res.data
        delete this.addForm.memberIds
        this.addForm.ids = this.addForm.ids.map(v => parseInt(v))
        console.log(res.data, '详情')
      })
    },
    // 删除该等级
    async del(row) {
      this.$confirm('是否继续删除此等级?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteLevel({ memberLevelId: row.memberLevelId }).then(res => {
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
      const res = await getMemberlevel(formInline)
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
.formInfo {
  line-height: 0px;
  color: #999999;
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
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
