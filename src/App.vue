<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>

<style>
.ant-page-header-heading{
  display: none;
}
.ant-pro-sider-menu-logo a span svg,
.ant-pro-sider-menu-logo a span h1{
  display: none;
}
.ant-pro-sider-menu-logo a{
  background: #fff;
}
.ant-pro-sider-menu-logo a span {
  display: inline-block;
  width: 200px;
  height: 80px;
  /* background: url('./assets/lab.png') no-repeat; */
  background-size: 100% 70%;
  background-position: 0px 5px;
}
.ant-layout-footer{
  display: none;
}
</style>
