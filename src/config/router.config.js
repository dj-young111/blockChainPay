// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.reports.home' },
    redirect: '/project/projectList1',
    children: [
      // 统计报表
      {
        path: '/reports',
        name: 'reports',
        redirect: '/project/projectList1',
        component: RouteView,
        meta: { title: 'menu.reports', icon: bxAnaalyse },
        children: [
          // 一级项目信息明细表
          {
            path: '/project/projectList1',
            name: 'LevelProjectList1',
            component: () => import('@/views/project/ProjectList1'),
            meta: { title: 'menu.reports.levelProjectList1' }
          },
        ]
      }

      // forms
      // {
      //   path: '/form',
      //   redirect: '/form/base-form',
      //   component: RouteView,
      //   meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/basicForm'),
      //       meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'StepForm',
      //       component: () => import('@/views/form/stepForm/StepForm'),
      //       meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'AdvanceForm',
      //       component: () => import('@/views/form/advancedForm/AdvancedForm'),
      //       meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
      //     }
      //   ]
      // },

      // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: RouteView,
      //   redirect: '/list/table-list',
      //   meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/BasicList'),
      //       meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/search/Article'),
      //           meta: { title: '搜索列表（文章）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/search/Projects'),
      //           meta: { title: '搜索列表（项目）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/search/Applications'),
      //           meta: { title: '搜索列表（应用）', permission: [ 'table' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },

      // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic'),
      //       meta: { title: '基础详情页', permission: [ 'profile' ] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '高级详情页', permission: [ 'profile' ] }
      //     }
      //   ]
      // },

      // result
      // {
      //   path: '/result',
      //   name: 'result',
      //   component: RouteView,
      //   redirect: '/result/success',
      //   meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
      //   children: [
      //     {
      //       path: '/result/success',
      //       name: 'ResultSuccess',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
      //       meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
      //     },
      //     {
      //       path: '/result/fail',
      //       name: 'ResultFail',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
      //       meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
      //     }
      //   ]
      // },

      // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: '403', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: '404', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: '500', permission: [ 'exception' ] }
      //     }
      //   ]
      // },

      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center'),
      //       meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         }
      //       ]
      //     }
      //   ]
      // }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '主页' },
    redirect: '/workbench/todo',
    children: [
      {
        path: '/workbench',
        name: 'Workbench',
        redirect: '/workbench/todo',
        component: RouteView,
        meta: { title: '工作台', icon: 'desktop' },
        children: [
          {
            path: '/workbench/todo',
            name: 'Todo',
            component: () => import('@/views/workbench/Todo'),
            meta: { title: '待办事项' }
          },
          {
            path: '/workbench/finished',
            name: 'Finished',
            component: () => import('@/views/workbench/Finished'),
            meta: { title: '已办事项' }
          }
        ]
      },
      // 统计报表
      {
        path: '/project',
        name: 'Project',
        redirect: '/project/projectList',
        component: RouteView,
        meta: { title: '项目管理', icon: 'project' },
        children: [
          {
            path: '/project/projectList',
            name: 'ProjectList',
            component: () => import('@/views/project/ProjectList'),
            meta: { title: '项目管理' }
          },
          // 一级项目信息明细表
          {
            path: '/project/projectList1',
            name: 'ProjectList1',
            component: () => import('@/views/project/ProjectList1'),
            meta: { title: '一级项目管理' },
            hidden: true
          },
          {
            path: '/project/projectList2',
            name: 'ProjectList2',
            component: () => import('@/views/project/ProjectList2'),
            meta: { title: '二级项目管理' },
            hidden: true
          },
          {
            path: '/project/projectList3',
            name: 'ProjectList3',
            component: () => import('@/views/project/ProjectList3'),
            meta: { title: '三级项目管理' },
            hidden: true
          },
        ]
      },
      {
        path: '/contract',
        name: 'ContractManagement',
        redirect: '/contract/contract',
        component: RouteView,
        meta: { title: '合同管理', icon: 'profile' },
        children: [
          {
            path: '/contract/contract',
            name: 'Contract',
            component: () => import('@/views/contract/Contract'),
            meta: { title: '工程合同管理' }
          }
        ]
      },
      {
        path: '/payment',
        name: 'Payment',
        redirect: '/payment/apply',
        component: RouteView,
        meta: { title: '支付管理', icon: 'property-safety' },
        children: [
          {
            path: '/payment/apply',
            name: 'Apply',
            component: () => import('@/views/payment/Apply'),
            meta: { title: '支付申请' }
          },
          {
            path: '/payment/applyList',
            name: 'ApplyList',
            component: () => import('@/views/payment/ApplyList'),
            meta: { title: '支付申请列表' },
            hidden: true
          },
          {
            path: '/payment/fundflow',
            name: 'FundFlow',
            component: () => import('@/views/payment/FundFlow'),
            meta: { title: '资金流查询' }
          },
          {
            path: '/payment/detail',
            name: 'Detail',
            component: () => import('@/views/payment/Detail'),
            meta: { title: '资金流向查询' },
            hidden: true
          },
          {
            path: '/payment/collection',
            name: 'Collection',
            component: () => import('@/views/payment/Collection'),
            meta: { title: '支付信息补录' }
          },
          {
            path: '/payment/info',
            name: 'Info',
            component: () => import('@/views/payment/Info'),
            meta: { title: '' },
            hidden: true
          },
          {
            path: '/payment/settleBatch',
            name: 'SettleBatch',
            component: () => import('@/views/payment/SettleBatch'),
            meta: { title: '结算批次管理' },
          }
        ]
      },
      {
        path: '/company',
        name: 'Company',
        redirect: '/company/managementList',
        component: RouteView,
        meta: { title: '公司管理', icon: 'cluster' },
        children: [
          {
            path: '/company/managementList',
            name: 'ManagementList',
            component: () => import('@/views/company/ManagementList'),
            meta: { title: '公司管理' }
          }
        ]
      },
      {
        path: '/worker',
        name: 'Worker',
        redirect: '/worker/parameterList',
        component: RouteView,
        meta: { title: '农民工工资管理', icon: 'account-book' },
        children: [
          {
            path: '/worker/parameterList',
            name: 'ParameterList',
            component: () => import('@/views/worker/ParameterList'),
            meta: { title: '农民工工资台账' }
          },
          {
            path: '/worker/payroll',
            name: 'Payroll',
            component: () => import('@/views/worker/Payroll'),
            meta: { title: '农民工工资单管理' }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/operationLog',
        component: RouteView,
        meta: { title: '日志管理', icon: 'cluster' },
        children: [
          {
            path: '/system/operationLog',
            name: 'SystemLog',
            component: () => import('@/views/system/OperationLog'),
            meta: { title: '操作日志' }
          },
          {
            path: '/system/secureLog',
            name: 'SecureLog',
            component: () => import('@/views/system/SecureLog'),
            meta: { title: '安全日志' }
          }
        ]
      },
      {
        path: '/reports/modifyPassword',
        name: 'ModifyPassword',
        component: () => import('@/views/account/ModifyPassword'),
        meta: { title: '修改密码' },
        hidden: true
      },
    ]
  },
  // {
  //   path: '/financing',
  //   name: 'financing',
  //   redirect: '/financing/list',
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'financingList',
  //       component: () => import('@/views/financing/List'),
  //       meta: { title: '融资申请列表' }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      // },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/screenHome',
    name: 'screenHome',
    component: () => import('@/views/screenDetail/screenHome'),
    hidden: true
  },
  {
    path: '/screenHomeOriginal',
    name: 'screenHomeOriginal',
    component: () => import('@/views/screenDetail/screenHomeOriginal'),
    hidden: true
  },
  // {
  //   path: '/screenAbout',
  //   name: 'screenAbout',
  //   component: () => import('@/views/screenDetail/screenAbout'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
