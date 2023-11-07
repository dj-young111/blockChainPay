import request from '@/utils/request'

const contractApi = {
  list: '/paymentManage/getPaymentMenu',
  collectionList: '/supplementaryPayment/list',
  paymentScene: '/supplementaryPayment/getPaymentScene',
  contractName: '/supplementaryPayment/getContractList',
  taskName: '/supplementaryPayment/getTaskName/',
  receive: '/supplementaryPayment/getInfo',
  collectionAdd: '/supplementaryPayment/add',
  collectionDetail: '/supplementaryPayment/detail/',
  addReqFunds: '/requestFunds/add',
  addPayFunds: '/paymentFunds/add',
  flowList: '/moneyFlow/list',
  flowDetail: '/moneyFlow/detail/',
  flowDetailNew: '/moneyFlow/detailByMonth',
  paymentBankNum: '/paymentFunds/getAccount',
  projectList: '/paymentFunds/getPrjList',
  payContractName: '/paymentFunds/getContractList',
  payReceive: '/paymentFunds/getInfo',
  totalContract: '/salaryRelated/getGeneralContract',
  subContract: '/salaryRelated/getSubContract/',
  // reqAndPayReceive: '/salaryRelated/getInfo/',
  reqAndPayReceive: '/salaryRelated/getSalInfo',
  addSalary: '/salaryRelated/add',
  subContractList: '/salaryRelated/getSubContractList',
  paymentTaskName: '/paymentFunds/getTaskName/',
  salaryTaskName: '/salaryRelated/getTaskName/',
  reqTaskName: '/requestFunds/getTaskName/',
  reqReceive: '/requestFunds/getInfo',
  updateBProcess: '/paymentManage/updateBProcessNode',
  uploadServer: '/mfiles',
  downloadDetail: '/model/downloadModel/',
  applyList: '/paymentManage/list',
  applyDetail: '/paymentFunds/getDetail/',
  reqDetail: '/requestFunds/getDetail/',
  salaryDetail: '/salaryRelated/getDetail/',
  payDetailDesc: '/moneyFlow/payDetail/',
  payDetailDescNew: '/moneyFlow/payDetailByMonth',
  payAccount: '/salaryRelated/getAccount',
  payAccountInfo: '/salaryRelated/getAccountDetail/',
  currentSms: '/paymentProcess/sendSmsCurentUser',
  settleAdd: '/settlementBatch/add',
  settleList: '/settlementBatch/list',
  settleEdit: '/settlementBatch/edit',
  settleDetail: '/settlementBatch/detail/',
  settleCompanyInfo: '/settlementBatch/companyInfo',
  settleDel: '/settlementBatch/del/',
  monthDetail: '/moneyFlow/monthDetail',
  getCompContract: '/paymentFunds/getCompanyB',
  getComp1Contract: '/salaryRelated/getCompanyB',
}

// 获取支付管理合同列表
export function getPaymentApplyList () {
    return request({
        url: contractApi.list,
        method: 'get',
    })
}

// 获取支付信息补录列表
export function getPayCollectionList (data) {
  return request({
      url: contractApi.collectionList,
      method: 'post',
      data
  })
}


// 获取支付场景
export function getPaymentScene () {
  return request({
      url: contractApi.paymentScene,
      method: 'get',
  })
}


// 获取所属合同名称
export function getContractName () {
  return request({
      url: contractApi.contractName,
      method: 'get',
  })
}

// 获取付款相关所属合同名称
export function getPaymentContractName () {
  return request({
      url: contractApi.payContractName,
      method: 'get',
  })
}

// 获取任务名称
export function getTaskName (value) {
  return request({
      url: `${contractApi.taskName}${value}`,
      method: 'get',
  })
}

// 获取请款任务名称
export function getReqTaskName (value) {
  return request({
      url: `${contractApi.reqTaskName}${value}`,
      method: 'get',
  })
}

// 获取付款任务名称
export function getPayTaskName (value) {
  return request({
      url: `${contractApi.paymentTaskName}${value}`,
      method: 'get',
  })
}

// 获取工资任务名称
export function getSalaryTaskName (value) {
  return request({
      url: `${contractApi.salaryTaskName}${value}`,
      method: 'get',
  })
}

// 获取项目收付款信息
// export function getReceive (code) {
//   return request({
//       url: `${contractApi.receive}${code}`,
//       method: 'get',
//   })
// }
export function getReceive (data) {
  return request({
      url: contractApi.receive,
      method: 'post',
      data
  })
}

// 添加支付信息补录
export function addCollection (data) {
  return request({
      url: contractApi.collectionAdd,
      method: 'post',
      data
  })
}

// 获取支付信息补录详情
export function getCollentDetail (id) {
  return request({
      url: `${contractApi.collectionDetail}${id}`,
      method: 'get',
  })
}

// 添加请款信息
export function addReqFund (data) {
  return request({
      url: contractApi.addReqFunds,
      method: 'post',
      data
  })
}

// 添加付款信息
export function addPayFund (data) {
  return request({
      url: contractApi.addPayFunds,
      method: 'post',
      data
  })
}

// 获取资金流向列表
export function getMoneyFlow (data) {
  return request({
      url: contractApi.flowList,
      method: 'post',
      data
  })
}

// 获取资金流向详情
export function getMoneyFlowDetail (code, generalCode) {
  return request({
      url: `${contractApi.flowDetail}${code}/${generalCode}`,
      method: 'post',
  })
}
// 获取资金流向详情
export function getMoneyflowDetailNew (code, generalCode, date) {
  return request({
      url: `${contractApi.flowDetailNew}`,
      method: 'post',
      data: {
        prjCode: code,
        generalContractCode: generalCode,
        date
      }
  })
}


// 获取支付银行账号
export function getPaymentBankNum () {
  return request({
      url: contractApi.paymentBankNum,
      method: 'get',
  })
}

// 获取项目列表
export function getProject () {
  return request({
      url: contractApi.projectList,
      method: 'get',
  })
}

// 获取总包合同下拉列表
export function getTotalContract () {
  return request({
      url: contractApi.totalContract,
      method: 'get',
  })
}

// 根据总包合同名称获取分包合同下拉列表
export function getSubContract (code) {
  return request({
      url: `${contractApi.subContract}${code}`,
      method: 'get',
  })
}

// 获取请款+代发收付款信息
// export function getReqAndPayReceive (code) {
//   return request({
//       url: `${contractApi.reqAndPayReceive}${code}`,
//       method: 'get',
//   })
// }
export function getReqAndPayReceive (data) {
  return request({
      url: contractApi.reqAndPayReceive,
      method: 'post',
      data
  })
}

// 获取付款收付款信息
// export function getPayReceive (code) {
//   return request({
//       url: `${contractApi.payReceive}${code}`,
//       method: 'get',
//   })
// }
export function getPayReceive (data) {
  return request({
      url: contractApi.payReceive,
      method: 'post',
      data
  })
}

// 获取请款收付款信息
// export function getReqReceive (code) {
//   return request({
//       url: `${contractApi.reqReceive}${code}`,
//       method: 'get',
//   })
// }
export function getReqReceive (data) {
  return request({
      url: contractApi.reqReceive,
      method: 'post',
      data
  })
}

// 添加工资信息
export function addSalaryFund (data) {
  return request({
      url: contractApi.addSalary,
      method: 'post',
      data
  })
} 

// 获取分包合同下拉列表
export function getSubContractList () {
  return request({
      url: contractApi.subContractList,
      method: 'get',
  })
}

// 指定乙方审批节点
export function setUpdateBProcessNode(data) {
  return request({
    url: contractApi.updateBProcess,
    method: 'post',
    data
  })
}

// 上传到服务器
export function updateServer (url, data) {
  return request({
    url: `${url}${contractApi.uploadServer}`,
    method: 'post',
    data
  })
}

// 批量代付明细账单下载
export function downloadDetail(type) {
  return request({
    url: `${contractApi.downloadDetail}${type}`,
    method: 'get',
    // responseType: 'arraybuffer',
  })
}

// 支付申请列表
export function getApplyList (data) {
  return request({
    url: contractApi.applyList,
    method: 'post',
    data
  })
}

// 获取付款详情
export function getApplyDetail (id) {
  return request({
    url: `${contractApi.applyDetail}${id}`,
    method: 'get',
})
}

// 获取请款详情
export function getReqDetail (id) {
  return request({
    url: `${contractApi.reqDetail}${id}`,
    method: 'get',
  })  
}

// 获取工资请款+代发详情
export function getSalaryDetail (id) {
  return request({
    url: `${contractApi.salaryDetail}${id}`,
    method: 'get',
  }) 
}

// 获取支付资金流向详情列表对应详情
export function getPayDetailDesc (code) {
  return request({
    url: `${contractApi.payDetailDesc}${code}`,
    method: 'get',
  })
}
// 获取支付资金流向详情列表对应详情
export function getPayDetailDescNew (code, date) {
  return request({
    url: `${contractApi.payDetailDescNew}`,
    method: 'post',
    data: {
      contractCode: code,
      date
    }
  })
}


// 获取付款银行账号
export function getPayAccount () {
  return request({
    url: contractApi.payAccount,
    method: 'get',
  })
}

// 通过付款银行账号获取相关信息
export function getPayAccountInfo (code) {
  return request({
    url: `${contractApi.payAccountInfo}${code}`,
    method: 'get',
  })
}

// 通过付款银行账号获取相关信息
export function getCurrentSmsInfo () {
  return request({
    url: contractApi.currentSms,
    method: 'get',
  })
}

// 获取结算批次列表
export function getSettleList (data) {
  return request({
    url: contractApi.settleList,
    method: 'post',
    data
  })
}

//结算批次添加
export function addSettle (data) {
  return request({
    url: contractApi.settleAdd,
    method: 'post',
    data
  })
}

//结算批次编辑
export function editSettle (data) {
  return request({
    url: contractApi.settleEdit,
    method: 'post',
    data
  })
}

// 结算批次详情
export function detailSettle (code) {
  return request({
    url: `${contractApi.settleDetail}${code}`,
    method: 'post',
  })
}

// 获取当前登录人企业信息
export function getCurrentCompanyInfo () {
  return request({
    url: contractApi.settleCompanyInfo,
    method: 'get',
  })
}

// 删除结算批次
export function delSettle (code) {
  return request({
    url: `${contractApi.settleDel}${code}`,
    method: 'delete',
  })
}

// 月度查询
export function getMonthDetail (data) {
  return request({
    url: contractApi.monthDetail,
    method: 'post',
    data
  })
}

// 付款获取乙方公司合同
export function getCompContractList (name) {
  return request({
      url: contractApi.getCompContract + name,
      method: 'post',
      data: {name}
  })
}


// 工资付款获取乙方公司合同
export function getComp1ContractList (name) {
  return request({
      url: contractApi.getComp1Contract + name,
      method: 'post',
      data: {name}
  })
}
