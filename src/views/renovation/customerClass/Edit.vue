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
      <el-alert :style="{ backgroundColor: '#fff' }" title="保存后将生效在移动端的分类里" type="info" :closable="false" />
      <el-tree
        class="tree-box"
        :data="treeData"
        :props="{ children: 'children' }"
        node-key="id"
        :default-expand-all="isCheck"
        :expand-on-click-node="false"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div class="content">
            <template>
              <el-input
                v-model="data.classifyName"
                class="input"
                :disabled="isCheck || isAdd(data)"
                maxlength="20"
                size="mini"
                :placeholder="data.classifyLevel | placeholderTips"
              />
              <el-input
                v-model="data.description"
                class="input"
                style="width: 300px"
                :disabled="isCheck || isAdd(data)"
                maxlength="200"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="添加分类描述（不超过200字）"
              />
            </template>
          </div>
          <div v-if="!isCheck" class="setting-box">
            <el-button type="text" size="mini" @click="() => append(node, data)">{{ data.classifyLevel | addTips
            }}</el-button>
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
import {
  customerClassAdd,
  customerClassUpdate,
  getCustomerClassById
} from '@/api/renovation'
let idx = 1000
export default {
  filters: {
    addTips(classifyLevel) {
      classifyLevel = classifyLevel + ''
      const tipsMp = {
        1: '添加二级类别名称',
        2: '添加三级类别名称'
      }
      return tipsMp[classifyLevel]
    },
    placeholderTips(classifyLevel) {
      classifyLevel = classifyLevel + ''
      const tipsMp = {
        1: '输入一级类别名称',
        2: '输入二级类别名称',
        3: '输入三级类别名称'
      }
      return tipsMp[classifyLevel]
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
      headers: {
        Authorization: ''
      },
      treeData: [],
      deleteArr: []
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
    }
  },
  async created() { },
  methods: {
    close() {
      this.$emit('close')
    },
    reset() {
      this.treeData = []
    },
    // Add状态下不允许修改之前的类（除非是新加的）
    isAdd(data) {
      if (data.newAdd && data.newAdd === true) {
        return false
      } else {
        return this.type === 'add'
      }
    },
    // 将后端获取的数据转换为前端可用的形式
    treeFilter(item) {
      const {
        classifyId,
        classifyPid,
        classifyName,
        classifyLevel,
        children,
        description,
        parentName // 前端设置
      } = item
      const newMap = {
        classifyId,
        classifyPid,
        classifyName,
        classifyLevel,
        children,
        description,
        parentName
      }
      if (item.children && item.children.length) {
        newMap.children = item.children.map(this.treeFilter)
      }
      return newMap
    },
    // 查询已有的树形结构
    async queryByClassifyID(classifyId) {
      if (classifyId === undefined) {
        this.treeData = []
        return
      }

      const res = await getCustomerClassById({ 'classifyId': classifyId })
      const resData = res.data
      console.error(resData)

      if (resData) {
        resData.children = resData && resData.children && resData.children.map(this.treeFilter)
        this.treeData = [resData]
      } else {
        this.treeData = []
      }
    },
    // 增添el-tree（一级类别），仅涉及前端
    addFirstClassification() {
      this.treeData.push({
        placeholder: '输入一级类别名称',
        addTips: '添加二级类别名称',
        classifyName: '',
        classifyLevel: 1,
        idx: idx++
      })
    },
    // 增添el-tree（二、三级类别），仅涉及前端
    append(node, data) {
      node.expanded = true
      if (!data.children) { this.$set(data, 'children', []) }

      const classifyName = data.classifyName
      const classifyLevel = data.classifyLevel + 1
      let newChild = {}

      if (classifyLevel === 2) {
        newChild = {
          placeholder: '输入二级类别名称',
          addTips: '添加三级类别名称',
          classifyLevel,
          parentName: classifyName,
          classifyName: '',
          children: [],
          idx: idx++
        }
      } else if (classifyLevel === 3) {
        newChild = {
          parentName: classifyName,
          classifyLevel: 3,
          classifyName: '',
          idx: idx++
        }
      }
      newChild.newAdd = true
      data.children.push(newChild)
    },
    // 删除el-tree，仅涉及前端
    remove(node, data) {
      // 处理子节点
      for (const i in data.children) {
        const child = data.children[i]
        this.deleteArr.push(child.id || '')
      }
      data.children = null
      // 处理自身（在父节点中将自己清除）
      const parentNode = node.parent
      // 如果不存在父节点，parentNode.data是Array反之是Object
      if (Array.isArray(parentNode.data)) {
        const index = parentNode.data.findIndex(d => d.idx === data.idx)
        parentNode.data.splice(index, 1)
      } else {
        const parentChilds = parentNode.data.children
        const index = parentChilds.findIndex(d => d.idx === data.idx)
        parentChilds.splice(index, 1)
      }
      this.deleteArr.push(data.id || '')
    },
    // "保存"触发
    onSubmit() {
      if (this.type === 'addFirst') {
        // 添加一级类别
        this.addGroup()
      } else {
        // 添加二、三级类别是update
        this.updateGroup()
      }
    },
    // 增添
    async addGroup() {
      const params = this.treeData.map(this.treeFilter)
      console.error('add', params)
      if (params.length === 0) {
        this.$message.error('请添加分类')
        return
      }
      const res = await customerClassAdd({ classifies: params })
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
      const params = this.treeData.map(this.treeFilter)
      const res = await customerClassUpdate({
        classifies: params,
        deleteIds: this.deleteArr
      })
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
    // 供index传递参数
    setParams({ id }) {
      this.queryByClassifyID(id)
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
