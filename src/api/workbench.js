import request from '@/utils/request'

const contractApi = {
  contractList: '/contractProcess/getTodoList',
  contractDone: '/contractProcess/getDoneList',
  contractDetail: '/contractProcess/detail/',
  contractOperation: '/contractProcess/submit',
  paymentList: '/paymentProcess/getTodoList',
  paymenDone: '/paymentProcess/getDoneList',
  payDetail: '/paymentProcess/payDetail/',
  reqDetail: '/paymentProcess/reqDetail/',
  salaryDetail: '/paymentProcess/salaryDetail/',
  paymentOperation: '/paymentProcess/submit',
  contractLog: '/contractProcess/getProcessLog/',
  payLog: '/paymentProcess/getProcessLog/',
  selectAccount: '/companyAccount/selectAccount',
  paymentDetail: '/payment/list',
  paymentStatus: '/payment/getStatus',
  editByProcess: '/contract/editByProcess',
  payCollection: '/supProcess/getTodoList',
  payCollectionDetail: '/supProcess/detail/',
  payCollectionLog: '/supProcess/getProcessLog/',
  payCollectionSubmit: '/supProcess/submit',
  editPayCollection: '/supplementaryPayment/edit',
  payCollectionDone: '/supProcess/getDoneList',
  paymentProcessInfo: '/paymentProcess/payStatus/'
}

// 获取合同待办列表
export function getContractTodoList (data) {
    return request({
        url: contractApi.contractList,
        method: 'post',
        data
    })
}

// 获取合同已办列表
export function getContractFinishList (data) {
    return request({
        url: contractApi.contractDone,
        method: 'post',
        data
    })
}

// 获取合同详情列表
export function getContractDetailList (id) {
    return request({
        url: `${contractApi.contractDetail}${id}`,
        method: 'post'
    })
}

// 合同待办通过/驳回
export function contractSubmit (data) {
    return request({
        url: contractApi.contractOperation,
        method: 'post',
        data
    })
}


// 获取支付待办列表
export function getPaymentTodoList (data) {
    return request({
        url: contractApi.paymentList,
        method: 'post',
        data
    })
}

// 获取支付审批待办详情(付款)
export function getPaymentPayDetail (id) {
    return request({
        url: `${contractApi.payDetail}${id}`,
        method: 'post'
    })
}

// 获取支付审批待办详情（请款）
export function getPaymentReqDetail (id) {
    return request({
        url: `${contractApi.reqDetail}${id}`,
        method: 'post'
    })
}

// 获取支付审批待办详情（工资）
export function getPaymentSalaryDetail (id) {
    return request({
        url: `${contractApi.salaryDetail}${id}`,
        method: 'post'
    })
}

// 支付待办通过/驳回
export function paymentSubmit (data) {
    return request({
        url: contractApi.paymentOperation,
        method: 'post',
        data
    })
}

// 获取支付已办
// 获取合同已办列表
export function getPaymentFinishList (data) {
    return request({
        url: contractApi.paymenDone,
        method: 'post',
        data
    })
}

// 获取合同审批日志
export function getContractLog(code) {
    return request({
        url: `${contractApi.contractLog}${code}`,
        method: 'post',
    })
}

// 获取支付审批日志
export function getPayLog(id) {
    return request({
        url: `${contractApi.payLog}${id}`,
        method: 'post',
    })
}

// 获取账户信息
export function getSelectAccount(data) {
    return request({
        url: contractApi.selectAccount,
        method: 'post',
        data
    })
}

// 获取支付明细
export function getPaymentDetail (data) {
    return request({
        url: contractApi.paymentDetail,
        method: 'post',
        data
    })
}

// 获取支付状态
export function getPaymentStatus () {
    return request({
        url: contractApi.paymentStatus,
        method: 'post'
    })
}

// 编辑审批信息
export function getEditByProcess (data) {
    return request({
        url: contractApi.editByProcess,
        method: 'post',
        data
    })
}

// 获取支付补录待办列表
export function getPayCollection(data) {
    return request({
        url: contractApi.payCollection,
        method: 'post',
        data
    })
}

// 获取支付补录详情
export function getPayCollectionDetail (code) {
    return request({
        url: `${contractApi.payCollectionDetail}${code}`,
        method: 'post'
    })
}

// 获取支付补录日志
export function getPayCollectionLog(code) {
    return request({
        url: `${contractApi.payCollectionLog}${code}`,
        method: 'post',
    })
}

// 支付补录通过/驳回
export function payCollectionSubmit (data) {
    return request({
        url: contractApi.payCollectionSubmit,
        method: 'post',
        data
    })
}

// 编辑支付补录信息
export function getEditByPayCollection (data) {
    return request({
        url: contractApi.editPayCollection,
        method: 'post',
        data
    })
}

// 支付补录已办列表
export function getPayCollectionFinishList (data) {
    return request({
        url: contractApi.payCollectionDone,
        method: 'post',
        data
    })
}

//

export function getPaymentProcessInfo (id) {
    return request({
        url: contractApi.paymentProcessInfo + id,
        method: 'get',
    })
}