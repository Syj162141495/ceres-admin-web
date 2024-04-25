<!--  -->
<template>
  <div class="sensitive">
    <el-card class="box-card">
      <div slot="header">
        <span>敏感词</span>
        <el-button
          style="float: right; width: 100px; height: 48px; border-radius: 4px"
          type="primary"
          @click="save"
        >保存</el-button>
      </div>
      <div class="text_item">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="状态">
            <el-radio-group v-model="form.state">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="处理措施">
            <el-radio-group v-model="form.handleMeasures">
              <el-radio label="1">禁止发布</el-radio>
              <el-radio label="2">需要审核</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="敏感词库">
            <el-input v-model="form.sensitiveWord" 
            placeholder="1.首次添加请直接输入保存，添加多个敏感词请用逗号隔开，如：'敏感词1,敏感词...' 2.二次添加请点击编辑，在原有的敏感词后再输入" 
            type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :header-cell-style="{ background: '#EEF3FF', color: '#333333' }"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="敏感词名称" width="220">
            <template slot-scope="scope">{{ scope.row.sensitiveWord }}</template>
          </el-table-column>
          <el-table-column label="是否开启">
            <template slot-scope="scope">
              <span v-if="scope.row.state">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="处理措施">
            <template slot-scope="scope">
              <span v-if="scope.row.handleMeasures == 1">禁止发布</span>
              <span v-else>需要审核</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="btnList">
                <el-button type="text" @click="run(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { sensitiveAdd, sensitiveGetAll, sensitiveUpdate } from '@/api/comment'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        sensitiveWord: '', // 敏感词库
        state: '1', // 是否开启 1-是 0-否
        handleMeasures: '2' // 处理措施  1-禁止发布 2-需审核
      },
      tableData: [],
      editState: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getAll()
  },
  // 方法集合
  methods: {
    // 添加敏感词
    async save() {
      if (this.form.sensitiveWord === '') {
        this.$message.error('请输入敏感词')
        return
      }
      if (this.editState) {
        const res = await sensitiveUpdate(this.form)
        if (res.code === '') {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          this.getAll()
          this.form.sensitiveWord = ''
        }
      } else {
        const res = await sensitiveAdd(this.form)
        if (res.code === '') {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          this.editState = false
          this.getAll()
          this.form.sensitiveWord = ''
        }
      }
    },
    async getAll() {
      const res = await sensitiveGetAll()
      console.log(res)
      this.tableData = res.data
      this.form.id = res.data[0].id
    },
    run(row) {
      this.editState = true
      this.form = {
        sensitiveWord: row.sensitiveWord, // 敏感词库
        state: row.state.toString(), // 是否开启 1-是 0-否
        handleMeasures: row.handleMeasures.toString(), // 处理措施  1-禁止发布 2-需审核
        id: row.id
      }
      console.log(this.form)
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
