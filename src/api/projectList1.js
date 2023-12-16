import request from '@/utils/request'

let proApi = {
    list: '/project/lv1',
    add: '/project/lv1',
    check: '/firstPeriodProject/detail/',
    edit: '/project/lv1',
}

// 获取一级项目管理列表
export function getProjectList1 (params) {
    return request({
        url: proApi.list,
        method: 'get',
        params
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
        method: 'put',
        data
    })
}
