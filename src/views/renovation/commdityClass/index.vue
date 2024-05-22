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
      :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
    >
      <el-table-column prop="classifyName" label="服务分类" />
      <el-table-column prop="previousClassifyName" label="上级分类" align="center" />
      <el-table-column prop="sortNumb" label="排序号" align="center" />
      <el-table-column prop="serviceIntroduction" label="介绍" />
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
      @success="init(formParams)"
    />
  </div>
</template>
<script>
import {
  commdityClassGetAll,
  commdityClassDelete,
  commdityClassGetByClassifyLevel
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
    this.init(this.formParams)
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
    // 添加一级类别
    addFirstClassifyLevel() {
      this.dialog = {
        type: 'addFirst',
        isVisible: true
      }
      this.$refs.edit.setParams({ treeData: [], classifyLevel: 1 })
    },
    editClose() {
      this.dialog.isVisible = false
    },
    // 编辑
    updateRow(row) {
      this.dialog = {
        type: 'edit',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId, classifyLevel: row.level })
    },
    // 查看
    checkRow(row) {
      this.dialog = {
        type: 'check',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId, classifyLevel: row.level })
    },
    // 在指定行添加下一级的对象
    async addRow(row) {
      this.dialog = {
        type: 'add',
        isVisible: true
      }
      this.$refs.edit.setParams({ id: row.classifyId, classifyLevel: row.level })
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
            this.init(this.formParams)
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
      // this.getAll(this.formParams)
      this.init(this.formParams)
    },

    async getAll(formParams) {
      const res = await commdityClassGetAll(formParams)
      this.tableData = res.data.list
      this.total = res.data.total
    },

    async getByClassifyHierarchy(formParams, classifyLevel) {
      const hierarchyParams = formParams
      hierarchyParams.classifyLevel = classifyLevel
      const res = await commdityClassGetByClassifyLevel(hierarchyParams)
      this.tableData = res.data.list
      this.total = res.data.total
    },

    async init(formParams) {
      let classifyLevel = 1
      let tableData = []
      const id_item_map = {}
      let pid_ids_map = {}
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const hierarchyParams = formParams
        hierarchyParams.classifyLevel = classifyLevel
        const res = await commdityClassGetByClassifyLevel(hierarchyParams)
        if (res.data.total === 0) {
          break
        }
        const rawTableData = res.data.list
        rawTableData.sort((a, b) => a.classifyId - b.classifyId)
        if (classifyLevel === 1) {
          // 先获得所有1级的分类，存入id_item_map。
          // 对id进行排序，获得排序号X，存入item.sortNumb。
          this.total = res.data.total
          let sortNumb = 1
          for (let i = 0; i < rawTableData.length; i++) {
            const item = rawTableData[i]
            item.level = classifyLevel
            id_item_map[item.classifyId] = item
            item.sortNumb = 'O' + sortNumb.toString()
            sortNumb++
          }
          tableData = rawTableData
        } else {
          // 再获得所有2级(及以上)分类，存入id_item_map。
          // 遍历所有2级分类的pid，存入pid_ids_map，其中一个k-v对为 pid:[id1,id2,...]
          // 针对其中的一个k-v对，通过id_item_map[pid]获得上级分类pitem
          // 上级分类名为pitem.classifyName，存入item.previousClassifyName
          // 对[id1,id2,...]进行排序，获得序号XX，将其与上级排序号相加，存入item.sortNumb
          pid_ids_map = {}
          for (let i = 0; i < rawTableData.length; i++) {
            const item = rawTableData[i]
            id_item_map[item.classifyId] = item
            const pid = item.classifyPid
            if (pid in pid_ids_map) {
              pid_ids_map[pid].push(item.classifyId)
            } else {
              pid_ids_map[pid] = [item.classifyId]
            }
          }
          for (const pid in pid_ids_map) {
            const pitem = id_item_map[pid]
            const ids = pid_ids_map[pid]
            ids.sort()
            let sortNumb = 1
            for (let i = 0; i < ids.length; i++) {
              const item = id_item_map[ids[i]]
              item.level = classifyLevel
              item.previousClassifyName = pitem.classifyName
              item.sortNumb = pitem.sortNumb + sortNumb.toString().padStart(2, '0')
              id_item_map[pid] = item
              if ('children' in pitem) {
                pitem['children'].push(item)
              } else {
                pitem['children'] = [item]
              }
              sortNumb++
            }
          }
        }
        classifyLevel++
      }
      console.info(tableData)
      this.tableData = tableData
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
