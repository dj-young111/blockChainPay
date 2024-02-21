<template>
  <a-result status="403" title="403" sub-title="对不起，您没有查看当前页面权限，请重新登录！">
    <!-- <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template> -->
  </a-result>
</template>

<script>
export default {
  name: 'Exception403',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
