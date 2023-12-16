import request from '@/utils/request'

let proApi = {
    list: '/project/lv3',
    add: '/project/lv3',
    edit: '/project/lv3',
    proList2: '/project/lv2',
    detail: '/thirdPeriodProject/detail/',
    ownerUnit: '/thirdPeriodProject/getOwnerUnitList'
}

// 获取三级项目管理列表
export function getProjectList3 (params) {
    return request({
        url: proApi.list,
        method: 'get',
        params
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
        method: 'put',
        data
    })
}

// 获取二级项目
export function getProList2 (params) {
    return request({
        url: proApi.proList2,
        method: 'get',
        params
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

// 登陆后项目相关接口  根据用户返回绑定的三级项目
export function getUserList() {
    return request({
        url: '/project/lv3/user',
        method: 'get'
    })
}

// 绑定时根据三级项目名称模糊查询
export function getUserSearchList(params) {
    return request({
        url: '/project/lv3/name',
        method: 'get',
        params
    })
}

// 绑定用户和项目关系
export function getUserbindList(projectIDLv3) {
    return request({
        url: '/project/lv3/bind/'+ projectIDLv3,
        method: 'post',
    })
}