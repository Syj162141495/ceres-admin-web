<template>
  <div class="history">
    <div class="content">
      <!-- 顶部搜索 -->
      <div class="toolbar">
        <el-form ref="formParams" :inline="true" :model="formParams" :rules="rules">
          <el-form-item label="标题" prop="noticeTitle">
            <el-input v-model="formParams.noticeTitle" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="消息类型" prop="noticeType">
            <el-select v-model="formParams.noticeType" placeholder="请选择消息类型">
              <el-option
                v-for="(item, index) in tipsList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间" prop="dates">
            <el-date-picker
              v-model="formParams.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label-width="0">
            <el-button type="primary" plain @click="search('formParams')">查询</el-button>
            <el-button plain @click="clear('formParams')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="content_table">
        <div class="table">
          <el-table
            :data="list"
            border
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            style="width: 100%"
          >
            <el-table-column prop="noticeTitle" label="标题" />
            <el-table-column label="内容" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-html="scope.row.noticeContent" />
              </template>
            </el-table-column>
            <el-table-column prop="noticeType" label="消息类型">
              <template slot-scope="scope">
                <span>{{ scope.row.noticeType===1?'系统通知':scope.row.noticeType===2?'公告':scope.row.noticeType===3?'站内信':'' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发送时间" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click.native.prevent="details(scope.row.noticeId)">详情</el-button>
                <el-button type="text" @click.native.prevent="delMsg(scope.row.noticeId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="fenye">
          <el-pagination
            :current-page="formParams.page"
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
    <!-- 消息详情弹窗 -->
    <el-dialog
      title="消息详情"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      modal
    >
      <div>
        <h2 style="text-align:center;font-weight:bold;">{{ noticeDetails.noticeTitle }}</h2>
        <span style="float: right;">{{ noticeDetails.createTime }}</span>
        <el-divider />
        <div v-html="noticeDetails.noticeContent" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { noticeGetAll, noticeGetById, noticeDelete } from '@/api/notice'
export default {
  data() {
    return {
      list: [],
      total: 1,
      formParams: {
        noticeTitle: null,
        noticeType: null,
        dates: [],
        page: 1,
        pageSize: 10
      },
      tipsList: [{
        id: 1,
        name: '系统消息'
      },
      {
        id: 2,
        name: '公告'
      },
      {
        id: 3,
        name: '站内信'
      }],
      rules: {
        noticeTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, message: '请输入标题', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      noticeDetails: {
        noticeTitle: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
        createTime: '2021-03-10 10:10',
        noticeContent: `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" /><ul>
        <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
        </ul>`
      }
    }
  },
  mounted() {
    this.getAll()
  },
  methods: {
    // 历史消息列表
    async getAll() {
      const res = await noticeGetAll(this.formParams)
      this.list = res.data.list
      this.total = res.data.total
    },
    // 消息详情
    async details(id) {
      const res = await noticeGetById({ noticeId: id })
      this.noticeDetails = res.data
      this.dialogVisible = true
    },
    // 删除消息提示
    async delMsg(id) {
      this.$confirm('此操作将永久删除该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除消息
    async del(id) {
      const res = await noticeDelete({ noticeId: id })
      if (res.code === '') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getAll()
      }
    },
    // 查询
    async search(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.total = 1
          this.formParams.page = 1
          this.getAll()
        } else {
          return false
        }
      })
    },
    // 重置表单
    async clear(formName) {
      this.$refs[formName].resetFields()
      this.getAll()
    },
    // 更改页数
    async handleSizeChange(val) {
      this.formParams.pageSize = val
      this.getAll()
    },
    // 翻页
    async handleCurrentChange(val) {
      this.formParams.page = val
      this.getAll()
    },
    // 关闭消息详情
    async handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../styles/elDialog.scss");
.history{
  padding: 20px;
}
</style>
<style scoped>
.history /deep/ .el-table .cell.el-tooltip img {
  max-height: 100px;
}
</style>
