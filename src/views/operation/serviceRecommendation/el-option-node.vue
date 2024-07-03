// el-option-node.vue
<template>
  <el-option :key="index" :label="source[label]" :value="source[value]" />
</template>

<script>
export default {
  name: 'ItemComponent',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    index: { // 每一行的索引
      type: Number
    },
    source: { // 每一行的内容
      type: Object,
      default() {
        return {}
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    label: { // 要显示的名称
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    value: { // 绑定的值
      type: String
    }
  }
}
</script>
