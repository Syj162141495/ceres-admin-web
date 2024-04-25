<template>
  <div class="tipStyle">
    <!-- 搜索 -->
    <div class="topSearch">
      <div class="formSearch">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="标签名称">
            <el-input v-model="formInline.labelName" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="标签类型">
            <el-select v-model="formInline.labelType" placeholder="请选择标签类型">
              <el-option label="手动标签" value="1" />
              <el-option label="自动标签" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rightBTn">
        <el-button type="primary" @click="addTips">新建标签</el-button>
        <el-button @click="exportTips">导出标签</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <el-table
        :data="tableData"
        border
        :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="标签名" width="220">
          <template slot-scope="scope">{{ scope.row.labelName }}</template>
        </el-table-column>
        <el-table-column prop="users" label="客户" />
        <el-table-column prop="labelType" label="标签类型">
          <template slot-scope="scope">
            <span v-if="scope.row.labelType == 1">手动标签</span>
            <span v-else>自动标签</span>
          </template>
        </el-table-column>
        <el-table-column prop="conditions" label="打标条件">
          <template slot-scope="scope">
            <div v-if="scope.row.conditions.length ==0">暂无标签</div>
            <div v-else @click="modelTouch(scope.row)">{{ scope.row.conditions.toString() }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="btnList">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteTips(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 批量删除 -->
      <div class="batch_btn">
        <el-button plain :disabled="!multipleSelection.length" @click="deleteTips">批量删除</el-button>
      </div>
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
    <!-- ******************************************************弹框开始***************************************************************** -->
    <!-- 打标详情弹框 -->
    <el-dialog
      title="打标详情"
      :visible.sync="dialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div class="diaddStyle">
        <h1>满足以下任意条件即可</h1>
        <div class="jiaoyi">
          <div class="leftJ">交易条件:</div>
          <div class="rightJ">
            <p v-for="(item,index) in text" :key="index">{{ item }}</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  tipsGetAll,
  tipsDelete,
  excel_platform_label
} from '@/api/customerMage'
export default {
  name: '',
  data() {
    return {
      formInline: {
        labelName: '', // 标签名称
        labelType: '', // 标签类型 1-手动标签 2-自动标签
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      currentPage: 1,
      dialogVisible: false,
      text: '',
      multipleSelection: []
    }
  },
  mounted() {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查询
    search() {
      this.total = 1
      this.formInline.page = 1
      this.getAll(this.formInline)
    },
    // 清楚
    clear() {
      this.formInline = {
        labelName: '', // 标签名称
        labelType: '', // 标签类型 1-手动标签 2-自动标签
        page: 1,
        pageSize: 10
      }
      this.getAll(this.formInline)
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'addTips',
        params: { buyerLabelId: row.buyerLabelId }
      })
    },
    // 初始化查询所有数据
    async getAll(formParams) {
      const res = await tipsGetAll(formParams)
      console.log(res)
      this.tableData = res.data.list
      this.total = res.data.total
    },
    // 新建标签
    addTips() {
      this.$router.push({ name: 'addTips' })
    },
    // 详情弹框
    modelTouch(row) {
      console.log(row.conditions)
      this.text = row.conditions
      this.dialogVisible = true
    },
    // 删除
    async deleteTips(row) {
      let ids = []
      if (this.multipleSelection.length === 0) {
        ids = [row.buyerLabelId]
      } else {
        this.multipleSelection.forEach(item => {
          ids.push(item.buyerLabelId)
        })
      }
      const res = await tipsDelete({ ids })
      if (res.code === '') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getAll(this.formInline)
      }
    },
    // 导出标签
    exportTips() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择导出行')
        return
      }
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.buyerLabelId)
      })
      excel_platform_label({ ids }).then(res => {
        console.log(res)
        const blob = new Blob([res])
        const fileName = '标签表.xlsx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import url("../../../styles/elDialog.scss");
.tipStyle {
  padding: 20px;
  .topSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .formSearch,
    .rightBTn {
      margin-left: 20px;
    }
  }
}
.diaddStyle {
  h1 {
    text-align: center;
    font-size: 24px;
    color: #333333;
  }
  .jiaoyi {
    display: flex;
    justify-content: center;
  }
  .leftJ {
    margin: 15px;
  }
  .leftJ,
  .rightJ {
    font-size: 16px;
    color: #333333;
  }
}
.batch_btn {
  padding: 5px 10px;
  border: 1px solid #dfe6ec;
  background-color: #fff;
  border-top: 0;
}
</style>
