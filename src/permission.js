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

const whiteList = ['login', 'register', 'registerResult', 'screenHome', 'screenAbout', 'screenHomeOriginal'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/project/projectList1'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if(to.query && to.query.code) {
    let code = to.query.code
    let clientId = 'c0de75b76d66c2aede8964b303594b46'
    let clientSecret = '41986a049e3bca9712a936fd77ba681a'
    
    let loginParams = {
      tempCode: code,
      key: `Basic ${window.btoa(`${clientId}:${clientSecret}`)}`
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
        if (storage.get(ACCESS_TOKEN)) {
          next({ path: '/' })
        } else {
          next({ path: '/user/login' })
          store.commit('SET_TOKEN', '')
          storage.remove(ACCESS_TOKEN)
        }
      } else {
        next({ path: '/user/login' })
        store.commit('SET_TOKEN', '')
        storage.remove(ACCESS_TOKEN)
      }
    })

    
  } else {
    if (storage.get(ACCESS_TOKEN)) {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath })
        NProgress.done()
      }  else {
        next()
      }
    } else {
      if (whiteList.includes(to.name)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
  
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
