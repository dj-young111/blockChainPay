import request from '@/utils/request'

const workerApi = {
  workerSalaryList: '/workerSalary/list',
  workerSalaryDetail: '/workerSalary/detail',
  payrollList: '/salayManage/list',
  payrollAdd: '/salayManage/add',
  payrollEdit: '/salayManage/edit',
  payrollDelete: '/salayManage/del/',
  contractSelect: '/salayManage/getContractList',
  companyName: '/salayManage/getInfo/',
  payrollDetail: '/salayManage/detail/',
  salaryManage: '/salayManage/getSalaryManageList',
  getCompMsg: '/salayManage/getCompanyB'
}

// 农民工工资列表
export function getWorkerSalaryList(data) {
    return request({
      url: workerApi.workerSalaryList,
      method: 'post',
      data
    })
  }
  
  // 农民工工资支付详情
  export function getWorkerSalaryDetail(data) {
    return request({
      url: workerApi.workerSalaryDetail,
      method: 'post',
      data
    })
  }

// 农民工工资单列表
export function getWorkerSalaryPayrollList(data) {
  return request({
    url: workerApi.payrollList,
    method: 'post',
    data
  })
}

// 新增工资单
export function addPayroll(data) {
  return request({
    url: workerApi.payrollAdd,
    method: 'post',
    data
  })
}

// 编辑工资单
export function editPayroll(data) {
  return request({
    url: workerApi.payrollEdit,
    method: 'post',
    data
  })
}

// 删除工资单
export function deletePayroll(code) {
  return request({
    url: `${workerApi.payrollDelete}${code}`,
    method: 'delete',
  })
}

// 选择合同
export function getContractList() {
  return request({
    url: workerApi.contractSelect,
    method: 'get',
  })
}

// 获取企业名称
export function getCompanyName(code) {
  return request({
    url: `${workerApi.companyName}${code}`,
    method: 'get',
  })
}

// 获取工资单详情
export function getPayrollDetail(code) {
  return request({
    url: `${workerApi.payrollDetail}${code}`,
    method: 'post',
  })
}

// 获取合同关联工资单
export function getContractSalaryList(data) {
  return request({
    url: workerApi.salaryManage,
    method: 'post',
    data
  })
}


// 获取企业名称
export function getCompMsgData (name) {
  return request({
      url: workerApi.getCompMsg + name,
      method: 'post',
      data: {name}
  })
}
