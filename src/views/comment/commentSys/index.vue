<template>
  <div class="comment_manage_page">
    <div class="content">
      <el-tabs v-model="formParams.ifSensitive" @tab-click="selectItem">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.id.toString()"
        />
      </el-tabs>
      <div class="toolbar">
        <el-form :inline="true" :model="formParams">
          <el-form-item label="商家名称">
            <el-input v-model="formParams.shopName" />
          </el-form-item>

          <el-form-item label="商家编码">
            <el-input v-model="formParams.shopCode" />
          </el-form-item>

          <el-form-item label="商品ID">
            <el-input v-model="formParams.productId" />
          </el-form-item>

          <el-form-item label="关键词">
            <el-input v-model="formParams.keyword" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button plain @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="content_table">
        <div class="table">
          <el-table :data="tableData" border style="width: 100%" :header-cell-style="{ background: '#EEF3FF', color: '#333333' }">
            <el-table-column prop="shopName" label="商家名称" />
            <el-table-column prop="shopCode" label="商家编码" />
            <el-table-column prop="productId" label="商品ID" />
            <el-table-column prop="name" label="评论人" />
            <el-table-column prop="createTime" label="评论日期" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-if="Number(formParams.ifSensitive)">
                  <el-button type="text" @click="details(scope.row)">查看</el-button>
                </div>
                <div v-else>
                  <el-button type="text" @click="details(scope.row)">查看</el-button>
                  <el-button
                    type="text"
                    @click="handle(scope.row)"
                  >{{ scope.row.state ? "显示" : "隐藏" }}</el-button>
                  <el-button type="text" @click="deletes(scope.row.commentId)">删除</el-button>
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
    <!-- ******************************************************弹框开始***************************************************************** -->
    <!-- 查看评论弹框 -->
    <el-dialog
      title="评论详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="60%"
      center
    >
      <div class="pinStyle">
        <div class="comment">
          <div class="com_left">评论：</div>
          <div class="com_right">{{ commentDetails.comment }}</div>
        </div>
        <div v-if="commentDetails.images.length != 0" class="comment_imgList">
          <div class="img_left">图片：</div>
          <div class="imgList">
            <el-image
              v-for="(item,index) in commentDetails.images"
              :key="index"
              :src="item"
              :preview-src-list="commentDetails.images"
            />
          </div>
        </div>
        <div class="line" />
        <div v-if="commentDetails.addComment !=''" class="addComment">{{ commentDetails.time }}天后追评</div>
        <div class="comment">
          <div v-if="commentDetails.addComment !=''" class="com_left">追评：</div>
          <div class="com_right">{{ commentDetails.addComment }}</div>
        </div>
        <div v-if="commentDetails.addImages.length != 0" class="comment_imgList">
          <div class="img_left">图片</div>
          <div class="imgList">
            <el-image
              v-for="(item,index) in commentDetails.addImages"
              :key="index"
              :src="item"
              :preview-src-list="commentDetails.addImages"
            />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="Number(formParams.ifSensitive)" @click="toShow">允许展示</el-button>
        <el-button v-else @click="noneShow">隐藏</el-button>
        <el-button type="primary" @click="del">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  commentSysGetall,
  commentSysGetById,
  commentSysUpdate,
  commentSysDelete,
  commentAllow
} from '@/api/comment'
export default {
  data() {
    return {
      formParams: {
        ifSensitive: '0', // 是否敏感词审核  1-是 0-否
        shopName: '', // 商家名称
        shopCode: '', // 商家编码
        productId: '', // 商品id
        keyword: '', // 关键词
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      },
      date: [],
      tableData: [],
      tabList: [
        { name: '全部评论', id: 0 },
        { name: '敏感评论', id: 1 }
      ],
      total: 1,
      currentPage: 1,
      dialogVisible: false,
      commentDetails: { images: [], addImages: [] },
      commentId: ''
    }
  },
  created() {
    this.getList(this.formParams)
  },
  methods: {
    handleSizeChange(val) {
      this.formParams.pageSize = val
      this.getList(this.formParams)
    },
    handleCurrentChange(val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    selectItem(tab, event) {
      this.formParams.ifSensitive = tab.name
      console.log(tab.name)
      this.getList(this.formParams)
    },
    // 查询
    search() {
      this.total = 1
      this.formParams.page = 1
      this.getList(this.formParams)
    },
    // 重置
    clear() {
      this.formParams = {
        ifSensitive: '0', // 是否敏感词审核  1-是 0-否
        shopName: '', // 商家名称
        shopCode: '', // 商家编码
        productId: '', // 商品id
        keyword: '', // 关键词
        page: '1', // 当前页
        pageSize: '10' // 每页记录数
      }
      this.getList(this.formParams)
    },
    async handle(row) {
      if (row.state === 1) {
        const res = await commentSysUpdate({
          commentId: row.commentId,
          state: 0
        })
        if (res.code === '') {
          this.$message.success('显示成功')
          this.dialogVisible = false
          this.getList(this.formParams)
        }
        console.log(res)
      } else {
        const res = await commentSysUpdate({
          commentId: row.commentId,
          state: 1
        })
        if (res.code === '') {
          this.$message.success('隐藏成功')
          this.dialogVisible = false
          this.getList(this.formParams)
        }
        console.log(res)
      }
    },
    // 允许展示
    async toShow() {
      const res = await commentAllow({
        commentId: this.commentId
      })
      if (res.code === '') {
        this.$message.success('成功')
        this.dialogVisible = false
      }
    },
    // 隐藏
    async noneShow() {
      const res = await commentSysUpdate({
        commentId: this.commentId,
        state: 0
      })
      if (res.code === '') {
        this.$message.success('隐藏成功')
        this.dialogVisible = false
        this.getList(this.formParams)
      }
    },
    // 删除
    async del() {
      const res = await commentSysDelete({
        commentId: this.commentId
      })
      if (res.code === '') {
        this.$message.success('删除成功')
        this.dialogVisible = false
        this.getList(this.formParams)
      }
    },
    async deletes(id) {
      const res = await commentSysDelete({
        commentId: id
      })
      if (res.code === '') {
        this.$message.success('删除成功')
        this.getList(this.formParams)
      }
    },
    // 详情
    async details(row) {
      this.dialogVisible = true
      const res = await commentSysGetById({ commentId: row.commentId })
      this.commentId = row.commentId
      this.commentDetails = res.data
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 初始化查询所有数据
    async getList(formParams) {
      const res = await commentSysGetall(formParams)
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }
}
</script>

<style lang='scss' scoped>
@import url("../../../styles/elDialog.scss");
.comment_manage_page {
  padding: 20px;
}
.pinStyle {
  .comment {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .com_left {
      font-size: 20px;
      color: #333333;
      margin-right: 20px;
    }
    .com_right {
      font-size: 18px;
      color: #333333;
    }
  }
  .comment_imgList {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    .img_left {
      font-size: 20px;
      color: #333333;
      margin-right: 20px;
      width: 60px;
    }
    .imgList {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .el-image {
        width: 200px;
        height: 134px;
        border-radius: 4px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
  .line {
    width: 890px;
    height: 1px;
    background: #e0e5eb;
    margin: 0 auto;
    margin-bottom: 33px;
  }
  .addComment {
    font-size: 20px;
    color: #ff7911;
    margin-bottom: 20px;
  }
}
</style>

