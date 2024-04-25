<template>
  <div>
    <el-button type="warning" @click="reidis">Redis延时任务</el-button>
  </div>
</template>

<script>
import { initializationRedis } from '@/api/pay'
export default {
  name: '',
  data() {
    return {}
  },
  methods: {
    async reidis() {
      const res = await initializationRedis()
      if (res.code === '') {
        this.$message.success('执行成功')
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
