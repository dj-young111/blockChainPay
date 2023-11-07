import request from '@/utils/request'

const contractApi = {
  list: '/contract/list',
  add: '/contract/add',
  type: '/contract/getContractType',
  typeChildren: '/contract/getContractDetailType/',
  typeAll: '/contract/getContractTypeAll',
  generalContract: '/contract/getGeneralContract',
//   thirdProject: '/contract/getThirdPrj',
  thirdProject: '/contract/getThirdPrjList',
  userRole: '/contract/getUserByRole/',
  detail: '/contract/detail/',
  edit: '/contract/edit',
  thirdPrjName: '/contract/getThirdPrjName/',
  downloadFile: '/files',
  companyCreditCode: '/contract/getCompanyList/'
}

// 获取合同列表
export function getContractList (data) {
    return request({
        url: contractApi.list,
        method: 'post',
        data
    })
}

// 添加
export function addContractInfo (data) {
    return request({
        url: contractApi.add,
        method: 'post',
        data
    })
}

// 获取一级合同类型
export function getContractType () {
    return request({
        url: contractApi.type,
        method: 'get'
    })
}

// 获取二级合同类型
export function getContractTypeChildren (type) {
    return request({
        url: `${contractApi.typeChildren}${type}`,
        method: 'get'
    })
}

// 获取总合同类型
export function getContractTypeAll () {
    return request({
        url: contractApi.typeAll,
        method: 'get'
    })
}

// 获取总包合同名称
export function getGeneralContract () {
    return request({
        url: contractApi.generalContract,
        method: 'get'
    })
}

// 获取所属三级项目
// export function getThirdProject () {
//     return request({
//         url: contractApi.thirdProject,
//         method: 'get'
//     })
// }

// 获取所属三级项目
export function getThirdProject (proName) {
    return request({
        url: `${contractApi.thirdProject}/${proName}`,
        method: 'post'
    })
}

// 获取不同角色用户
export function getUserRole (id, companyA, companyB) {
    return request({
        url: `${contractApi.userRole}${id}/${companyA}/${companyB}`,
        method: 'post'
    })
}

// 获取合同详情
export function getContractDetail (id) {
    return request({
        url: `${contractApi.detail}${id}`,
        method: 'post',
    })
}

// 修改合同信息
export function editContractInfo (data) {
    return request({
        url: contractApi.edit,
        method: 'post',
        data
    })
}

// 根据总包合同名称获取所属三级项目信息
export function getThirdPrjName (id) {
    return request({
        url: `${contractApi.thirdPrjName}${id}`,
        method: 'get'
    })
}

// 文件下载
export function getDownloadFile(params) {
    return request({
        url: `${contractApi.downloadFile}`,
        method: 'get',
        params
    })
}

// 根据合同名称获取统一社会信用代码
export function getCompanyCreditCode (name) {
    return request({
        url: `${contractApi.companyCreditCode}${name}`,
        method: 'post'
    })
}