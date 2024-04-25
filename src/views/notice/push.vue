<template>
  <div class="push">
    <div class="content">
      <!-- 信息栏 -->
      <div class="toolbar">
        <el-form ref="formParams" :inline="true" :model="formParams" :rules="rules">
          <el-form-item label="标题" prop="noticeTitle">
            <el-input v-model="formParams.noticeTitle" maxlength="18" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="消息类型" prop="noticeType">
            <el-select v-model="formParams.noticeType" placeholder="请选择消息类型">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接收用户" prop="receive">
            <el-select v-model="formParams.receive" placeholder="请选择接收用户">
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 富文本编辑器 -->
      <div>
        <tinymce ref="tinymceContent" v-model="formParams.noticeContent" :height="400" />
      </div>
      <div style="margin-top:20px;">
        <el-button style="width:100px;" type="primary" plain @click="send('formParams')">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { noticeSave } from '@/api/notice'
export default {
  components: { Tinymce },
  data() {
    return {
      typeList: [{
        id: 2,
        name: '公告'
      },
      {
        id: 3,
        name: '站内信'
      }],
      userList: [{
        id: 1,
        name: '全部用户'
      },
      {
        id: 2,
        name: '商家'
      },
      {
        id: 3,
        name: '普通用户'
      }],
      formParams: {
        noticeTitle: null,
        noticeType: null,
        noticeContent: null,
        receive: null
      },
      rules: {
        noticeTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, message: '请输入标题', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async send(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formParams.noticeContent === null) {
            this.$message({
              message: '请输入内容',
              type: 'warning'
            })
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    async save() {
      const res = await noticeSave(this.formParams)
      if (res.code === '') {
        this.$message({
          message: '消息发送成功',
          type: 'success'
        })
        this.$refs['formParams'].resetFields()
        this.$refs.tinymceContent.setContent('')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.push{
    padding: 20px;
}
</style>
