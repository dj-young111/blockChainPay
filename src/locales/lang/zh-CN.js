import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.reports.home': '主页',
  'menu.reports': '统计报表',
  'menu.reports.levelProjectList1': '一级项目信息明细表',
  'menu.reports.levelProjectList2': '二级项目信息明细表',
  'menu.reports.levelProjectList3': '三级项目信息明细表',
  'menu.reports.partyContractList': '甲总合同信息明细表',
  'menu.reports.totalContractList': '总分合同信息明细表',
  'menu.reports.enterpriseList': '企业信息明细表',
  'menu.reports.workerWagesList': '工人工资明细表',
  'menu.reports.migrantThroughPayList': '农民工工资穿透支付明细表',
  'menu.reports.migrantWageActiveList': '农民工工资激活明细表',
  'menu.reports.chainProjectPayProgressList': '上链项目支付进度表',
  'menu.reports.subcontractSummaryList': '分包合同汇总表',
  'menu.reports.subcontractClassifiyList': '分包合同分类明细表',
  'menu.reports.migrantThroughPayTotalList': '农民工工资穿透支付汇总表',
  'menu.reports.migrantWageActiveTotalList': '农民工工资激活汇总表',
  'menu.reports.unitOperatingManagementList': '建设单位运营管理表',
  

  'layouts.usermenu.dialog.title': '提示',
  'layouts.usermenu.dialog.content': '您确定要退出吗？',
}

export default {
  ...components,
  ...locale
}
