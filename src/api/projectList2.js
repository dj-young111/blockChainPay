import request from '@/utils/request'

let proApi = {
    list: '/project/lv2',
    add: '/project/lv2',
    edit: '/project/lv2',
    getPro1: '/project/lv1',
    delete: '/secondPeriodProject/delete/',
    detail: '/secondPeriodProject/detail/'
}

// 获取二级项目管理列表
export function getProjectList2 (params) {
    return request({
        url: proApi.list,
        method: 'get',
        params
    })
}

// 新增二级项目
export function addProjectList2 (data) {
    return request({
        url: proApi.add,
        method: 'post',
        data
    })
}

// 查看二级项目信息
export function checkProjectList2 (data) {
    return request({
        url: proApi.list,
        method: 'post',
        data
    })
}

// 编辑二级项目信息
export function editProjectList2 (data) {
    return request({
        url: proApi.edit,
        method: 'put',
        data
    })
}

// 获取一级项目列表
export function getProList1 (params) {
    return request({
        url: proApi.getPro1,
        method: 'get',
        params
    })
}

// 删除
export function deleteProList2 (id) {
    return request({
        url: `${proApi.delete}${id}`,
        method: 'delete'
    })
}

// 编辑二级项目信息
export function getProjectDetail2 (id) {
    return request({
        url: `${proApi.detail}${id}`,
        method: 'post'
    })
}