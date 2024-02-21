import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import axios from 'axios'
import qs from 'qs'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList =  ['404', '403'] //['login', 'register', 'registerResult', 'screenHome', 'screenAbout', 'screenHomeOriginal'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if(to.query && to.query.ticket) {
    let ticket = to.query.ticket
    let loginParams = {
      ticket
    }
    axios({
      url: '/api/user/loginSso',
      method: 'post',
      data: loginParams,
    }).then(res => {
      if(res.data.status == 1 && res.data.data) {
        window.localStorage.setItem(ACCESS_TOKEN, res.data.data.data.token)
        window.localStorage.setItem("userName", res.data.data.data.userName)
        window.localStorage.setItem('roleId', res.data.data.data.roleId)
        window.localStorage.setItem('phoneNo', res.data.data.data.phoneNo)
        store.commit('SET_TOKEN', res.data.data.data.token)
        next({ path: defaultRoutePath })
        NProgress.done()
      }
    })

    
  } else {
    if (storage.get(ACCESS_TOKEN)) {
      // if (to.path === loginRoutePath) {
      //   next({ path: defaultRoutePath })
      //   NProgress.done()
      // }  else {
      //   next({ path: '/403' })
      //   NProgress.done()
      //   // next()
      // }
      next()
      NProgress.done()
    } else {
      if (whiteList.includes(to.name)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        // next()
        // next({ path: loginRoutePath, query: { redirect: to.fullPath } })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
  
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
