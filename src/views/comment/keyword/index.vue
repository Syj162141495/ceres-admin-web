<template>
  <div class="custom_page">
    <div class="content">
      <!-- 顶部搜索 -->
      <div class="toolbar">
        <!-- 顶部搜索 -->
        <el-form :inline="true" :model="formInline">
          <el-form-item label="关键词">
            <el-input v-model="formInline.search" maxlength="20" placeholder="请输入关键词" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
            <el-button type="success" plain @click="add">新增关键词</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="stateLabel">
        <span class="formItem">状态：</span>
        <el-switch
          v-model="value"
          active-color="#3A68F2"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="changeState"
        />
      </div>
      <!--  表格 -->
      <div class="content_table">
        <div class="table">
          <el-table
            :data="tableData"
            border
            :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="keyWord" label="关键词" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="btnList">
                  <el-button type="text" @click="edit(scope.row)">修改</el-button>
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
    </div>
    <!-- 关键词 -->
    <el-dialog
      :visible.sync="isVisible.show"
      :title="isVisible.title"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="关键词">
            <el-input v-model="form.keyWord" maxlength="20" placeholder="请输入关键词" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="agreeEn">确定</el-button>
        <el-button @click="isVisible.show = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  wordStart,
  wordGetAll,
  wordAdd,
  wordGetById,
  wordUpdate,
  wordDelete
} from '@/api/business'
export default {
  data() {
    return {
      value: 0,
      formInline: {
        search: '',
        state: '',
        page: 1,
        pageSize: 10
      },
      form: {
        keyWord: '',
        state: '是否启用 1-是 0-否'
      },
      isVisible: {},
      humenList: [],
      total: 1,
      tableData: [],
      currentPage: 1,
      InviteList: []
    }
  },
  created() {
    this.getAll(this.formInline)
  },
  methods: {
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getAll(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getAll(this.formInline)
    },
    // 改变状态
    async changeState(index) {
      const res = await wordStart({ state: this.value })
      if (res.code === '') {
        // this.$message.success("成功");
      }
      console.log(index)
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 添加关键词
    add() {
      this.form.keyWord = ''
      this.isVisible = {
        show: true,
        title: '添加关键词',
        index: 1
      }
    },
    // 编辑
    async edit(row) {
      const res = await wordGetById({
        wordId: row.wordId
      })
      if (res.code === '') {
        this.form = res.data
        this.isVisible = {
          show: true,
          title: '编辑关键词',
          index: 2
        }
      }
    },
    async agreeEn() {
      if (this.isVisible.index === 1) {
        if (this.form.keyWord === '') {
          this.$message.error('请输入关键词')
          return
        }
        this.form.state = this.value
        const res = await wordAdd(this.form)
        if (res.code === '') {
          this.$message.success('新增成功')
          this.getAll(this.formInline)
          this.isVisible.show = false
        }
      } else if (this.isVisible.index === 2) {
        this.form.state = this.value
        const res = await wordUpdate(this.form)
        if (res.code === '') {
          this.$message.success('编辑成功')
          this.getAll(this.formInline)
          this.isVisible.show = false
        }
      }
    },
    // 删除
    del(row) {
      this.$confirm('确定要删除该条关键词?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          wordDelete({ wordId: row.wordId }).then(res => {
            if (res.code === '') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.getAll(this.formInline)
          })
        })
        .catch(() => {})
    },
    // 清除
    clear() {
      this.formInline = {
        orderFormid: '',
        distributorName: '',
        distributorPhone: '',
        dates: [],
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    // 初始化查询所有数据
    async getAll(formInline) {
      const res = await wordGetAll(formInline)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../../styles/elDialog.scss");
.custom_page {
  padding: 20px;
}
.checkBoxStyle {
  margin-bottom: 20px;
}
.dialog_content {
  width: 275px;
  height: 46px;
  margin: auto;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  margin-top: 25px;
}
.stateLabel {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  .formItem {
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    font-weight: 700;
  }
}
</style>

