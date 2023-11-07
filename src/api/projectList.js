import request from '@/utils/request'

let proApi = {
    list: '/project/list',
    add: '/project/add',
    edit: '/project/edit',
    detail: '/project/detail/',
    ownerUnit: '/project/getOwnerUnitList'
}

// 获取三级项目管理列表
export function getProjectList (data) {
    return request({
        url: proApi.list,
        method: 'post',
        data
    })
}

// 新增三级项目
export function addProjectList (data) {
    return request({
        url: proApi.add,
        method: 'post',
        data
    })
}

// 修改三级项目
export function editProjectList (data) {
    return request({
        url: proApi.edit,
        method: 'post',
        data
    })
}

// 获取二级项目
export function getProList () {
    return request({
        url: proApi.proList2,
        method: 'get'
    })
}


// 获取三级项目详情
export function getProjectDetail (id) {
    return request({
        url: `${proApi.detail}${id}`,
        method: 'post'
    })
}

// 获取业主单位
export function getOwnerUnit() {
    return request({
        url: proApi.ownerUnit,
        method: 'get'
    })
}