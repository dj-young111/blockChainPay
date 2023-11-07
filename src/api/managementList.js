import request from '@/utils/request'

let companyApi = {
    list: '/company/list',
    add: '/company/add',
    check: '/company/detail/',
    edit: '/company/edit',
    type: '/company/getCompanyType',
    account: '/companyAccount/add',
    accountType: '/companyAccount/getAccountType',
    accountList: 'companyAccount/list/',
    accountDetail: '/companyAccount/detail/',
    isFreeze: '/companyAccount/frozen/',
    editCompanyAccount: '/companyAccount/edit',
    create: '/company/create/',
    userList: '/company/getUserList/',
    companyCancel: '/company/cancel/',
    relationPrj: '/project/getAllPrjList',
    belongPrj: '/company/belongPrj'
}

// 获取公司管理列表
export function getManagementList (data) {
    return request({
        url: companyApi.list,
        method: 'post',
        data
    })
}

// 新建企业信息
export function addCompanyInfo (data) {
    return request({
        url: companyApi.add,
        method: 'post',
        data
    })
}

// 查看公司相关信息
export function checkCompanyInfo (id) {
    return request({
        url: `${companyApi.check}${id}`,
        method: 'post'
    })
}

// 编辑公司信息
export function editCompanyInfo (data) {
    return request({
        url: companyApi.edit,
        method: 'post',
        data
    })
}

// 获取公司类型
export function getCompanyType () {
    return request({
        url: companyApi.type,
        method: 'get',
    })
}

// 新建公司账户信息
export function addCompanyAccountInfo(data) {
    return request({
        url: companyApi.account,
        method: 'post',
        data
    })
}

// 获取公司账户类型
export function getComapnyAccountType() {
    return request({
        url: companyApi.accountType,
        method: 'get'
    })
}

// 获取公司账户列表
export function getCompanyAccountTypeTable(id) {
    return request({
        url: `${companyApi.accountList}${id}`,
        method: 'get'
    })
}

// 冻结/开启
export function setOpenOrFreeze(id) {
    return request({
        url: `${companyApi.isFreeze}${id}`,
        method: 'get'
    })
}

// 编辑公司账户信息
export function editCompanyAccountInfo(data) {
    return request({
        url: companyApi.editCompanyAccount,
        method: 'post',
        data
    })
}

// 创建
export function createCompanyInfo(id) {
    return request({
        url: `${companyApi.create}${id}`,
        method: 'post',
    })
}

// 获取企业用户列表
export function getCompanyUserList(id) {
    return request({
        url: `${companyApi.userList}${id}`,
        method: 'get',
    })
}

// 公司基本信息取消
export function companyCancel(id) {
    return request({
        url: `${companyApi.companyCancel}${id}`,
        method: 'post',
    })
}

// 获取企业账户信息
export function getCompanyAccountInfo(id) {
    return request({
        url: `${companyApi.accountDetail}${id}`,
        method: 'get',
    })
}

// 获取所属项目
export function getRelationPrj () {
    return request({
        url: companyApi.relationPrj,
        method: 'get',
    })
}

// 绑定项目信息
export function belongProject(data) {
    return request({
        url: companyApi.belongPrj,
        method: 'post',
        data
    })
}

