<template>
  <div class="classification-page">
    <div class="toolbar">
      <el-button type="success" @click="addBar">添加一级类别</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      row-key="id"
      :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
      :tree-props="{ children: 'childs' }"
    >
      <el-table-column prop="classifyName" label="商品类别" />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="checkRow(scope.row)">查看</el-button>
          <el-button type="text" @click.native.prevent="updateRow(scope.row)">编辑</el-button>
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
      @success="getProductCategory"
    />
  </div>
</template>
<script>
import {
  commdityClassGetAll,
  commdityClassDelete
} from '@/api/renovation'
import EditDialog from './Edit'
export default {
  components: {
    EditDialog
  },
  data() {
    return {
      dialogVisible: false,
      formParams: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      dialog: {
        type: 'add',
        isVisible: false
      }
    }
  },
  created() {
    this.getProductCategory()
    this.getAll(this.formParams)
  },
  methods: {
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
      this.getProductCategory()
    },
    addBar() {
      this.dialog = {
        type: 'add',
        isVisible: true
      }
      this.$refs.edit.setParams({ treeData: [] })
    },
    editClose() {
      this.dialog.isVisible = false
    },
    // 编辑
    updateRow(row) {
      const id = row.classifyId
      this.dialog = {
        type: 'edit',
        isVisible: true
      }
      this.$refs.edit.setParams({
        id: id
      })
    },
    // 查看
    checkRow(row) {
      const id = row.classifyId
      this.dialog = {
        type: 'check',
        isVisible: true
      }
      this.$refs.edit.setParams({
        id
      })
    },
    // 删除
    async deleteRow(row) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          commdityClassDelete({ oneClassifyId: row.classifyId }).then(res => {
            if (res.code === '') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.getAll(this.formParams)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    async getProductCategory() {
      this.getAll(this.formParams)
    },
    async getAll(formParams) {
      const res = await commdityClassGetAll(formParams)
      this.tableData = res.data.list
      this.total = res.data.total
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
