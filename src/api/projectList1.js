import request from '@/utils/request'

let proApi = {
    list: '/firstPeriodProject/list',
    add: '/firstPeriodProject/add',
    check: '/firstPeriodProject/detail/',
    edit: '/firstPeriodProject/edit',
    type: '/firstPeriodProject/getPrjType'
}

// 获取一级项目管理列表
export function getProjectList1 (data) {
    return request({
        url: proApi.list,
        method: 'post',
        data
    })
}

// 新增一级项目信息
export function addProjectList1 (data) {
    return request({
        url: proApi.add,
        method: 'post',
        data
    })
}

// 查看一级项目信息
export function checkProjectList1 (id) {
    return request({
        url: `${proApi.check}${id}`,
        method: 'post'
    })
}

// 修改一级项目信息
export function editProjectList1 (data) {
    return request({
        url: proApi.edit,
        method: 'post',
        data
    })
}

// 获取一级项目类型
export function getProjectList1Type () {
    return request({
        url: proApi.type,
        method: 'get'
    })
}