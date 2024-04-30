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
        default-expand-all
        :expand-on-click-node="false"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div class="content">
            <template v-if="data.depth < 3">
              <el-input
                v-model="data.categoryName"
                class="input"
                :disabled="isCheck"
                maxlength="20"
                size="mini"
                :placeholder="data.depth | placeholderTips"
              />
              <el-select v-model.number="data.link" size="mini" placeholder="请选择链接">
                <el-option
                  v-for="(item, index) in dictList"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictId"
                />
              </el-select>
              <el-upload
                class="upload-uploader"
                :on-success="handleImageSuccessOne"
                :multiple="false"
                :show-file-list="false"
                :action="action"
                :file-list="data.categoryImgArray"
              >
                <img
                  v-if="data.categoryImgArray.length && data.categoryImgArray[0].imgPath"
                  width="80"
                  height="80"
                  :src="data.categoryImgArray.length && data.categoryImgArray[0].imgPath"
                >
                <i v-else class="el-icon-plus" />
              </el-upload>
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
              @click="() => append(data)"
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
            v-if="type === 'add'"
            class="add"
            type="primary"
            size="small"
            @click="addClassification"
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
        2: '输入二级类别名称'
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
        edit: '修改类别',
        check: '查看类别'
      }
      return stateMap[this.type]
    },
    isCheck() {
      return this.type === 'check'
    }
  },
  async created() {
    const res = await getSelect({
      dictName: '服务分类链接'
    })
    console.log(res)
    this.dictList = res.data
  },
  methods: {
    async queryOneCategory(oneClassifyId) {
      console.log(oneClassifyId)
      if (oneClassifyId === undefined) {
        this.treeData = []
        return
      }
      const res = await commdityClassgetById({
        oneClassifyId
      })
      console.log(res)
      const resData = res.data
      const treeFilter = item => {
        const {
          categoryName,
          categoryImg,
          categoryPath,
          parentName,
          categoryImgArray,
          depth,
          id,
          link
        } = item
        const newMap = {
          depth: depth,
          categoryName,
          categoryPath: categoryPath || '',
          parentName,
          categoryImgArray,
          link,
          id
        }
        console.log(depth)
        if (depth === 3) {
          newMap.categoryImgArray = [
            {
              url: categoryImg
            }
          ]
        }
        if (item.childs && item.childs.length) {
          newMap.childs = item.childs.map(treeFilter)
        }
        return newMap
      }
      if (resData) {
        resData.childs =
          resData && resData.childs && resData.childs.map(treeFilter)
        this.treeData = [resData]
      } else {
        this.treeData = []
      }
      console.log(this.treeData)
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
    addClassification() {
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
    append(data) {
      console.log(data)
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
      data.childs.push(newChild)
    },
    remove(node, data) {
      // console.log(node,'node')
      // console.log(data.id,'data')
      const parent = node.parent
      const children = parent.data.childs || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.deleteArr.push(data.id || '')
    },
    onSubmit() {
      console.log(this.type)
      if (this.type === 'add') {
        this.addGroup()
      } else {
        this.updateGroup()
      }
    },
    async addGroup() {
      console.log(this.treeData)
      const treeFilter = item => {
        const {
          categoryName,
          categoryImgArray,
          categoryPath,
          parentName,
          depth,
          link
        } = item
        const newMap = {
          depth: depth,
          categoryName,
          categoryPath: categoryPath || '',
          parentName,
          link
        }
        if (categoryImgArray) {
          newMap.categoryImg = categoryImgArray[0].imgPath
        }
        if (depth === 3) {
          newMap.categoryImg = categoryImgArray[0].url
        }
        if (item.childs && item.childs.length) {
          newMap.childs = item.childs.map(treeFilter)
        }
        return newMap
      }
      const params = this.treeData.map(treeFilter)
      console.log(params)
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
    async updateGroup() {
      const treeFilter = item => {
        const {
          categoryName,
          categoryImgArray,
          categoryPath,
          parentName,
          depth,
          id,
          link
        } = item
        const newMap = {
          depth: depth,
          categoryName,
          categoryPath: categoryPath || '',
          parentName,
          link,
          id
        }

        if (categoryImgArray) {
          newMap.categoryImg = categoryImgArray[0].imgPath
        }
        if (depth === 3) {
          newMap.categoryImg = categoryImgArray[0].url
        }
        if (item.childs && item.childs.length) {
          newMap.childs = item.childs.map(treeFilter)
        }
        return newMap
      }
      console.log(this.treeData)
      const params = this.treeData.map(treeFilter)
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
    setParams({ id }) {
      console.log(id)
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
.upload-uploader {
  margin-left: 30px;
}
</style>
