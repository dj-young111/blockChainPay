import request from '@/utils/request'

const userApi = {
  role: '/user/getRole',
  add: '/user/save',
  list: '/user/list',
  edit: '/user/edit',
  forzen: '/user/frozen/',
  detail: '/user/detail/',
}

// 获取用户角色
export function getCompanyUserRole () {
    return request({
        url: userApi.role,
        method: 'post'
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: userApi.add,
        method: 'put',
        data
    })
}

// 获取用户列表
export function getCompanyUserInfoList (data) {
    return request({
        url: userApi.list,
        method: 'post',
        data
    })
}

// 获取用户列表
export function editUser (data) {
    return request({
        url: userApi.edit,
        method: 'post',
        data
    })
}

// 冻结用户
export function forzenUser (id) {
    return request({
        url: `${userApi.forzen}${id}`,
        method: 'get'
    })
}

// 获取用户详情
export function getUserDetail (id) {
    return request({
        url: `${userApi.detail}${id}`,
        method: 'get'
    })
}


