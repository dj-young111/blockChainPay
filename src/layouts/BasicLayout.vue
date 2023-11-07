<template>
  <pro-layout
    :title="title"
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :logo="logoRender"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <!-- Ads begin
      广告代码 真实项目中请移除
      production remove this Ads
    -->
    <ads v-if="isProPreviewSite && !collapsed"/>
    <!-- Ads end -->

    <!-- <setting-drawer :settings="settings" @change="handleSettingChange" /> -->
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import Ads from '@/components/Other/CarbonAds'
import LogoSvg from '../assets/logo.svg?inline'

import { constantRouterMap } from '@/config/router.config'
import { getMenuList } from '@/api/menu'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    Ads
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // 定宽: true / 流式: false
        contentWidth: defaultSettings.layout === 'sidemenu' ? false : defaultSettings.contentWidth === 'Fixed',
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      menuData: []
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    })
  },
  created () {
    let routes = constantRouterMap.find(item => item.path === '/')
    let newData = []
    getMenuList({}).then(res => {
      if(res.status == 1 && res.data) {
        const data = res.data
        newData = this.getMenuData(data, routes.children)
        
        let showRouter = []
        newData.map(v => {
          data.map(v1 => {
            if(v.meta.title == v1.menuName) {
              if(v.meta.title == '支付管理') {
                showRouter = v1.list
              }
              v.children.map(v2 => {
                v1.list.map(v3 => {
                  if(v2.meta.title == v3.menuName) {
                    v2.meta.btn = v3.btn
                    v2.hidden = false
                  }
                })
              })
            }
          })
        })
        newData.map(v => {
          if(v.meta.title == '支付管理') {
            const arr1 = v.children.filter(item1 => !showRouter.includes(v.children))
            const arr2 = showRouter.filter(item2 => !v.children.includes(showRouter))

            let resultList = [];
            for(let i = 0; i < v.children.length; i++){

                let obj = v.children [i];

                let num = obj.meta.title;

                let isExist = false;

                for(let j = 0; j < showRouter.length; j++){

                    let aj = showRouter[j];

                    let n = aj.menuName;

                    if(n == num){

                        isExist = true;

                        break;

                    }

                }

                if(!isExist){

                    resultList.push(obj);

                }

            }
            arr1.map(v => {
              resultList.map(v1 => {
                if(v.meta.title == v1.meta.title) {
                  v.hidden = true
                }
              })
            })
          }
        })
        // console.log(newData)

        this.menus = newData || []
        // this.getMenuData(data, routes.children)
      }
    })
    
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    // updateTheme(this.settings.primaryColor)
  },
  methods: {
    i18nRender,
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = false
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value === 'Fixed'
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = false
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = true
          }
          break
      }
    },
    logoRender () {
      return <LogoSvg />
    },
    getMenuData (item1, item2) {
      let newData = []
      item1.map(v => {
        item2.map(v1 => {
          if(v.menuName == v1.meta.title) {
            newData.push(v1)
          }
        })
      })
      return newData
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
