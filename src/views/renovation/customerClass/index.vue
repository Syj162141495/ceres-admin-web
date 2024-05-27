<template>
  <div class="classification-page">
    <div class="toolbar">
      <el-button type="success" @click="addFirstClassifyLevel">添加一级类别</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="classifyId"
      border
      :header-cell-style="{ background: '#EEF3FF', color: '#333333', 'text-align':'center'}"
    >
      <el-table-column prop="classifyName" label="客户分类" />
      <el-table-column prop="previousClassifyName" label="上级分类" align="center" />
      <el-table-column prop="sortNumb" label="排序号" align="center" />
      <el-table-column prop="description" label="介绍" />
      <el-table-column prop="status" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="checkRow(scope.row)">查看</el-button>
          <el-button type="text" @click.native.prevent="updateRow(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.level<3" type="text" @click.native.prevent="addRow(scope.row)">添加</el-button>
          <el-button type="text" @click.native.prevent="deleteRow(scope.row)">删除</el-button>
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
    <edit-dialog
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="init"
    />
  </div>
</template>

<script>
import {
  customerClassDelete,
  getCustomerClassByPid
} from '@/api/renovation'
import EditDialog from './Edit'

export default {
  components: {
    EditDialog
  },

  data() {
    return {
      // 控制页码相关的变量
      formParams: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      currentPage: 1,
      // 表单数据
      tableData: [],
      // 控制Edit组件的变量
      dialogVisible: false,
      dialog: {
        type: 'add',
        isVisible: false
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    /* 处理页面变化的函数 */
    handleSizeChange(val) {
      this.formParams.pageSize = val
      this.getAll(this.formParams)
    },
    handleCurrentChange(val) {
      this.formParams.page = val
      this.getAll(this.formParams)
    },
    fetch(config) {
      const { limit, page } = config
      this.formParams.pageIndex = page || 1
      this.formParams.pageSize = limit || 10
      // this.getProductCategory()
    },

    /* 增删改查操作，唤醒Edit组件 */
    // 查看
    checkRow(row) {
      this.dialog = {
        type: 'check',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId })
    },
    // 编辑
    updateRow(row) {
      this.dialog = {
        type: 'edit',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId })
    },
    // 添加
    async addRow(row) {
      this.dialog = {
        type: 'add',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId })
    },
    // 删除
    async deleteRow(row) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          customerClassDelete({ classifyId: row.classifyId }).then(res => {
            if (res.code === '') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.init()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /* 获取数据填充tableData */
    async init() {
      const res = await getCustomerClassByPid({ 'classifyId': 0 })
      const items = res.data
      let sortNumb = 1
      for (const item of items) {
        item.level = 1
        item.sortNumb = 'O' + sortNumb.toString()
        sortNumb++
        item.children = []
        this.setChildern(item, 2)
      }
      this.tableData = items
    },
    async setChildern(pitem, level) {
      const res = await getCustomerClassByPid({ 'classifyId': pitem.classifyId })
      const items = res.data
      let sortNumb = 1
      for (const item of items) {
        item.level = level
        item.sortNumb = pitem.sortNumb + sortNumb.toString().padStart(2, '0')
        sortNumb++
        item.children = []
        item.previousClassifyName = pitem.classifyName
        pitem['children'].push(item)
        this.setChildern(item, level + 1)
      }
    },
    // 退出（右上角x)
    editClose() {
      this.dialog.isVisible = false
    },
    // 添加一级类别
    addFirstClassifyLevel() {
      this.dialog = {
        type: 'addFirst',
        isVisible: true
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  @import url("../../../styles/elDialog.scss");

  .classification-page {
    padding: 15px 20px;
    .toolbar {
      margin-bottom: 15px;
      text-align: right;
    }
  }
  </style>
