import request from '@/utils/request'

let proApi = {
    list: '/thirdPeriodProject/list',
    add: '/thirdPeriodProject/add',
    edit: '/thirdPeriodProject/edit',
    proList2: '/thirdPeriodProject/getPrjList',
    detail: '/thirdPeriodProject/detail/',
    ownerUnit: '/thirdPeriodProject/getOwnerUnitList'
}

// 获取三级项目管理列表
export function getProjectList3 (data) {
    return request({
        url: proApi.list,
        method: 'post',
        data
    })
}

// 新增三级项目
export function addProjectList3 (data) {
    return request({
        url: proApi.add,
        method: 'post',
        data
    })
}

// 修改三级项目
export function editProjectList3 (data) {
    return request({
        url: proApi.edit,
        method: 'post',
        data
    })
}

// 获取二级项目
export function getProList2 () {
    return request({
        url: proApi.proList2,
        method: 'get'
    })
}


// 获取三级项目详情
export function getProjectDetail3 (id) {
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