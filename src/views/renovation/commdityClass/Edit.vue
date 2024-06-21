<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :type="type"
    :visible.sync="isVisible"
    center
    width="60%"
    top="50px"
    class="group-dialog"
  >
    <div class="add-dialog-component">
      <el-alert
        :style="{ backgroundColor: '#fff' }"
        title="保存后将生效在移动端的分类里"
        type="info"
        :closable="false"
      />
      <el-tree
        class="tree-box"
        :data="treeData"
        :props="{ children: 'childs' }"
        node-key="id"
        :default-expand-all="isCheck"
        :expand-on-click-node="false"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div class="content">
            <template v-if="data.depth <= 3">
              <el-input
                v-model="data.categoryName"
                class="input"
                style="width: 150px"
                :disabled="isCheck || isAdd(data)"
                maxlength="20"
                size="mini"
                :placeholder="data.depth | placeholderTips"
              />
              <el-input
                v-model="data.description"
                class="input"
                style="width: 300px"
                :disabled="isCheck || isAdd(data)"
                maxlength="200"
                :autosize="{ minRows: 1, maxRows: 2 }"
                type="textarea"
                :placeholder="showPlaceholder ? '添加分类描述（不超过200字）' : ''"
              />
              <el-input
                v-model="data.sort"
                class="input"
                style="width: 100px"
                :disabled="isCheck || isAdd(data)"
                maxlength="10"
                size="mini"
                placeholder="排序值"
              />
            </template>
            <template v-else>
              <div class="level-3-wrap">
                <div class="upload-wrap" :class="isCheck ? 'disabled' : ''">
                  <el-upload
                    :headers="headers"
                    :data="dataObj"
                    :multiple="false"
                    :show-file-list="false"
                    :file-list="data.categoryImgArray"
                    :on-success="handleImageSuccess"
                    class="upload-uploader"
                    :action="action"
                  >
                    <img
                      v-if="
                        data.categoryImgArray && data.categoryImgArray[0].url
                      "
                      :src="
                        data.categoryImgArray && data.categoryImgArray[0].url
                      "
                    >
                    <i v-else class="el-icon-plus" />
                  </el-upload>
                </div>
                <el-input
                  v-model="data.categoryName"
                  class="textarea-input"
                  type="textarea"
                  resize="none"
                  :disabled="isCheck"
                  size="mini"
                  placeholder="输入三级类别名称"
                />
              </div>
            </template>
          </div>
          <div v-if="!isCheck" class="setting-box">
            <el-button
              type="text"
              size="mini"
              @click="() => append(node,data)"
            >{{ data.depth | addTips }}</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
          </div>
        </div>
      </el-tree>
      <div class="add-btn-wrap">
        <template v-if="isCheck">
          <el-button class="add" type="primary" size="small" @click="close">确定</el-button>
        </template>
        <template v-else>
          <el-button
            v-if="type === 'addFirst'"
            class="add"
            type="primary"
            size="small"
            @click="addFirstClassification"
          >添加一级类别名称</el-button>
          <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { uploadUrl } from '@/utils/request'
import {
  getSelect,
  commdityClassAdd,
  commdityClassgetById,
  commdityClassUpdate
} from '@/api/renovation'
let idx = 1000
let imgId = 1
export default {
  filters: {
    addTips(depth) {
      depth = depth + ''
      const tipsMp = {
        1: '添加二级类别名称',
        2: '添加三级类别名称'
      }
      return tipsMp[depth]
    },
    placeholderTips(depth) {
      depth = depth + ''
      const tipsMp = {
        1: '输入一级类别名称',
        2: '输入二级类别名称',
        3: '输入三级类别名称'
      }
      return tipsMp[depth]
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      params: {
        categoryName: ''
      },
      file: this.image ? this.image : '',
      imgList: [],
      customParams: {
        current: 1,
        map: {},
        model: {
          config: '',
          isCustom: true,
          isDelete: 0,
          name: ''
        },
        order: 'descending',
        size: 100,
        sort: 'id'
      },
      treeData: [],
      headers: {
        Authorization: ''
      },
      action: uploadUrl,
      dataObj: {
        folderId: 1
      },
      deleteArr: [],
      dictList: []
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    },
    title() {
      const stateMap = {
        add: '新建类别',
        addFirst: '新建类别',
        edit: '修改类别',
        check: '查看类别'
      }
      return stateMap[this.type]
    },
    // check状态下所有数据都不允许修改
    isCheck() {
      return this.type === 'check'
    },
    showPlaceholder() {
      return !this.isCheck
    }
  },
  async created() {
    const res = await getSelect({
      dictName: '服务分类链接'
    })
    this.dictList = res.data
  },
  methods: {
    // Add状态下不允许修改之前的类（除非是新加的）
    isAdd(data) {
      if (data.newAdd && data.newAdd === true) {
        return false
      } else {
        return this.type === 'add'
      }
    },
    handleImageSuccess(response, file, fileList) {
      console.log(response)
      const url = response.data.url
      fileList[0].url = url
    },
    handleImageSuccessOne(response, file, fileList) {
      const url = response.data.url
      console.log(fileList)
      fileList[0].imgPath = url
    },
    close() {
      this.$emit('close')
    },
    reset() {
      this.treeData = []
    },
    // 数据映射
    treeFilter(item) {
      const {
        categoryName,
        categoryPath,
        parentName,
        depth,
        id,
        link,
        description,
        sort
      } = item
      const newMap = {
        categoryName,
        categoryPath: categoryPath || '',
        parentName,
        depth,
        id,
        link,
        description,
        sort
      }
      if (item.childs && item.childs.length) {
        newMap.childs = item.childs.map(this.treeFilter)
      }
      return newMap
    },
    // 查询已有的树形结构
    async queryOneCategory(oneClassifyId) {
      if (oneClassifyId === undefined) {
        this.treeData = []
        return
      }
      const res = await commdityClassgetById({
        oneClassifyId
      })
      const resData = res.data
      if (resData) {
        resData.childs =
          resData && resData.childs && resData.childs.map(this.treeFilter)
        this.treeData = [resData]
      } else {
        this.treeData = []
      }

      this.sortTreeData({ children: this.treeData })
    },
    sortTreeData(root) {
      if (root.children) {
        root.children.sort((a, b) => a.sort - b.sort)
        for (const child of root.children) {
          this.sortTreeData(child)
        }
      }
    },
    // 添加一级类别名称，仅涉及前端
    addFirstClassification() {
      this.treeData.push({
        placeholder: '输入一级类别名称',
        addTips: '添加二级类别名称',
        categoryName: '',
        categoryPath: '',
        depth: 1,
        idx: idx++,
        categoryImgArray: [
          {
            id: imgId++,
            imgPath: ''
          }
        ]
      })
    },
    // 增添el-tree，仅涉及前端
    append(node, data) {
      node.expanded = true
      const { categoryName } = data
      const depth = data.depth + 1
      let newChild
      if (!data.childs) {
        this.$set(data, 'childs', [])
      }
      if (depth < 3) {
        newChild = {
          placeholder: '输入二级类别名称',
          addTips: '添加三级类别名称',
          depth,
          parentName: categoryName,
          categoryName: '',
          categoryPath: '',
          categoryImgArray: [
            {
              id: imgId++,
              imgPath: ''
            }
          ],
          childs: [],
          idx: idx++
        }
      } else {
        newChild = {
          parentName: categoryName,
          categoryImgArray: [
            {
              id: imgId++,
              url: ''
            }
          ],
          depth: 3,
          categoryName: '',
          idx: idx++
        }
      }
      newChild.newAdd = true
      data.childs.push(newChild)
    },
    // 删除el-tree，仅涉及前端
    remove(node, data) {
      // 处理子节点
      for (const i in data.childs) {
        const child = data.childs[i]
        this.deleteArr.push(child.id || '')
      }
      data.childs = null
      // // 处理自身（在父节点中将自己清除）
      const parentNode = node.parent
      // 如果不存在父节点，parentNode.data是Array反之是Object
      if (Array.isArray(parentNode.data)) {
        const index = parentNode.data.findIndex(d => d.idx === data.idx)
        parentNode.data.splice(index, 1)
      } else {
        const parentChilds = parentNode.data.childs
        const index = parentChilds.findIndex(d => d.idx === data.idx)
        parentChilds.splice(index, 1)
      }
      this.deleteArr.push(data.id || '')
    },
    // "保存"触发
    onSubmit() {
      if (this.type === 'addFirst') {
        this.addGroup()
      } else {
        this.updateGroup()
      }
    },
    // 增添
    async addGroup() {
      const params = this.treeData.map(this.treeFilter)
      if (params.length === 0) {
        this.$message.error('请添加分类')
        return
      }
      const obj = {
        classifies: params
      }
      const res = await commdityClassAdd(obj)
      if (res.code === '') {
        this.isVisible = false
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.$emit('success')
        this.deleteArr = []
      }
    },
    // 更新
    async updateGroup() {
      console.log(this.treeData)
      const params = this.treeData.map(this.treeFilter)
      const obj = {
        classifies: params,
        deleteIds: this.deleteArr
      }
      const res = await commdityClassUpdate(obj)
      if (res.code === '') {
        this.isVisible = false
        this.$message({
          message: '成功',
          type: 'success'
        })
        this.$emit('success')
        this.deleteArr = []
      }
    },
    //
    setParams({ id }) {
      this.queryOneCategory(id)
    }
  }
}
</script>
<style lang="scss">
.add-dialog-component {
  .tree-box {
    .el-tree-node__content {
      margin-bottom: 15px;
      height: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
@import url("../../../styles/elDialog.scss");
.group-dialog {
  .el-dialog {
    min-width: 500px;
    max-width: 600px;
  }
}
.add-dialog-component {
  padding: 15px 20px;
  max-height: 60vh;
  overflow: auto;
  .el-tree-node__content {
    &:hover {
      background-color: #fff;
    }
  }
  .tree-box {
    margin: 15px 0;
    .custom-tree-node {
      display: flex;
      width: 100%;
      text-align: left;
      .content {
        flex: 1;
        display: flex;
        align-items: center;
        .input {
          width: 60%;
          margin-right: 20px;
        }
        .textarea-input {
          width: 100%;
          margin-left: 15px;
          textarea {
            height: 80px;
          }
        }
      }
      .level-3-wrap {
        display: flex;
        .upload-wrap {
          position: relative;
          &.disabled::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 999;
            background-color: #f5f7fa;
            opacity: 0.5;
          }
          .el-upload {
            border: 1px dashed #d9d9d9;
          }
          i {
            width: 80px;
            height: 80px;
            line-height: 80px;
          }
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
  }
  .add-btn-wrap {
    text-align: center;
  }
}
</style>
