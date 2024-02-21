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
import request from '@/utils/request'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList =  ['login','404', '403'] //['login', 'register', 'registerResult', 'screenHome', 'screenAbout', 'screenHomeOriginal'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/workbench/todo'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
    if (storage.get(ACCESS_TOKEN)) {
      next()
      NProgress.done()
    } else {
      if (whiteList.includes(to.name)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        if(to.query && to.query.ticket) {
          let ticket = to.query.ticket
          let loginParams = {
            ticket
          }
          request({
            url: '/user/loginSso',
            method: 'post',
            data: loginParams,
          }).then(res => {
            console.log(res)
            if(res.status == 1) {
              window.localStorage.setItem(ACCESS_TOKEN, res.data.token)
              window.localStorage.setItem("userName", res.data.userName)
              window.localStorage.setItem('roleId', res.data.roleId)
              window.localStorage.setItem('phoneNo', res.data.phoneNo)
              window.localStorage.setItem('companyType', res.data.companyType)
              store.commit('SET_TOKEN', res.data.token)
              next({ path: defaultRoutePath })
              NProgress.done()
            } else {
              next({ path: '403' })
              NProgress.done()
            }
          })
        } else {
          // window.location.href = 'https://login.xacip.net/expertlogin?redirect=http://192.168.100.182:8000/'
          next({ path: loginRoutePath })
          // next({ path: '/403' })
          // NProgress.done()
        }
    }
  }
  
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
