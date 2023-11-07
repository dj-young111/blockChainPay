import request from '@/utils/request'

let companyApi = {
    unitData: '/screenDataOverview/getUnitTotalData',
    subData: '/screenDataOverview/getSubData/',
    unitMonthData: '/screenDataOverview/getUnitTotalMonthData/',
    subMonthData: '/screenDataOverview/getSubMonthData/',
    wageData: '/screenDataOverview/getWorkerSalary',
    leftData: '/screenDataInside/getDataLeft',
    rightData: '/screenDataInside/getDataRight'
}

export function getUnitData () {
    return request({
      url: companyApi.unitData,
      method: 'get'
    })
  }

export function getSubData (code) {
    return request({
      url: `${companyApi.subData}${code}`,
      method: 'get'
    })
  }

  export function getUnitMonthData (month) {
    return request({
      url: `${companyApi.unitMonthData}${month}`,
      method: 'get'
    })
  }

  export function getSubMonthData (name, date) {
    return request({
      url: `${companyApi.subMonthData}${name}/${date}`,
      method: 'get'
    })
  }

  export function getWageMonthData (data) {
    return request({
      url: companyApi.wageData,
      method: 'post',
      data
    })
  }

  export function getLeftData () {
    return request({
      url: companyApi.leftData,
      method: 'get'
    })
  }

  export function getRightData () {
    return request({
      url: companyApi.rightData,
      method: 'get'
    })
  }