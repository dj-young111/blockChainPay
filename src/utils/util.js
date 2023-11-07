
import axios from 'axios'
import storage from 'store'
import CryptoJS from 'crypto-js'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export const dataSourceBank = [
  {
    value: 1,
    name: '中国建设银行'
  },
  {
    value: 2,
    name: '中国工商银行'
  },
  {
    value: 3,
    name: '中国农业银行'
  },
  {
    value: 4,
    name: '中国银行'
  },
  {
    value: 5,
    name: '中国交通银行'
  },
  {
    value: 6,
    name: '光大银行'
  },
  {
    value: 7,
    name: '招商银行'
  },
  {
    value: 8,
    name: '邮储银行'
  }
]


export function setDataSourceBank (value) {
  switch (value) {
    case 1:
      return '中国建设银行';
    case 2:
      return '中国工商银行';
    case 3:
      return '中国农业银行';
    case 4:
      return '中国银行';
    case 5:
      return '中国交通银行';
    case 6:
      return '光大银行';
    case 7:
      return '招商银行';
    case 8:
      return '邮储银行';
  }
}

export function setCompanyType (type) {
  switch (type) {
    case 1:
      return '建设单位';
    case 2:
      return '施工企业';
    case 3:
      return '劳务公司';
    case 4: 
      return '供应商';
  }
}

// 招标项目类型代码
export function setDidInvestProjectType (type) {
  switch (type) {
    case 1:
      return '建筑市政';
    case 2:
      return '园林绿化';
    case 3:
      return '水利工程';
    case 4: 
      return '交通工程';
    case 5:
      return '电力工程';
    case 6:
      return '公路工程';
    case 7: 
      return '海口与航道工程';
    case 8:
      return '机电安装工程';
    case 9: 
      return '地质矿产工程';
    default:
      return '其他';
  }
}


// 资金来源代码
export function setFundsSource (type) {
  switch (type) {
    case 1:
      return '政府投资';
    case 2:
      return '政府投资+社会投资';
    case 3:
      return '雄安集团投资';
    case 4: 
      return '雄安集团投资+社会投资';
    case 5:
      return '雄安集团投资+政府补贴/回购';
    case 6:
      return '企业投资';
  }
}


// 项目下发平台代码
export function setProjectDistrPlatform (type) {
  switch (type) {
    case 1:
      return '中国建设银行';
    case 2:
      return '中国工商银行';
    case 3:
      return '中国农业银行';
    case 4: 
      return '中国银行';
    case 5:
      return '中国交通银行';
    case 6:
      return '光大银行';
    case 7:
      return '招商银行';
    case 8: 
      return '邮储银行';
  }
}

// 项目区域代码
export function setProjectRegion (type) {
  switch (type) {
    case 1:
      return '容东片区';
    case 2:
      return '昝岗片区';
    case 3:
      return '启动区';
    case 4: 
      return '起步区';
    case 5:
      return '雄东片区';
    case 6:
      return '容西片区';
    case 7:
      return '寨里片区';
    case 8: 
      return '安州小镇';
    case 9:
      return '美丽乡村';
    case 10:
      return '白洋淀综合治理';
    case 11:
      return '基础设施';
    case 12:
      return '新区内道路';
    case 13:
      return '水利防洪';
    case 14:
      return '造林绿化';
    case 15:
      return '施工配套';
    case 16:
      return '智能城市';
    case 17:
      return '其他片区外项目';
    case 18:
      return '容城';
    case 19:
      return '雄县';
    case 20:
      return '安新'
  }
}

//项目类型
export function setProjectType (type) {
  switch (type) {
    case 1:
      return '重点项目';
    case 2:
      return '一般项目';
    case 3:
      return '土储项目';
  }
}

// 工程进度
export function setProjectProgress (type) {
  switch (type) {
    case 1:
      return '建议阶段';
    case 2:
      return '政府审核';
    case 3:
      return '可研阶段';
    case 4:
      return '初设阶段';
    case 5:
      return '设计阶段';
    case 6:
      return '计划阶段';
    case 7:
      return '招标阶段';
    case 8:
      return '施工阶段';
    case 9:
      return '竣工阶段';
  }
}

// 合同类型
export function setContractType (type) {
  switch (type) {
    case 1:
      return '总承包合同';
    case 2:
      return '劳务分包合同';
    case 301:
      return '专业分包土木（建筑或土建）';
    case 302:
      return '专业分包装饰装修（幕墙）';
    case 303:
      return '专业分包安装（水电、暖通、消防、弱电、强电等）';
    case 304:
      return '专业分包园林绿化';
    case 305:
      return '专业分包其他';
    case 401:
      return '大宗商品采购混凝土';
    case 402:
      return '大宗商品采购钢材';
    case 403:
      return '大宗商品采购砂石料';
    case 404:
      return '大宗商品采购电梯';
    case 405:
      return '大宗商品采购空调';
    case 406:
      return '大宗商品采购苗木';
    case 407:
      return '大宗商品采购其他';
    case 501:
      return '大宗设备租赁机器设备';
    case 502:
      return '大宗设备租赁其他';
    case 6:
      return '其他合同'; 
  }
}


// 分包状态
export function setSubcontractStatus (type) {
  switch (type) {
    case 1:
      return '未进场';
    case 2:
      return '已完工';
    case 3:
      return '施工中';
  }
}

export const financingStatus = [
  {
    value: 1,
    name: '融资中'
  },
  {
    value: 2,
    name: '融资结束'
  }
]

export function setFinancingStatus (type) {
  switch (type) {
    case 1:
      return '融资中';
    case 2:
      return '融资结束'
  }
}

export const projectType = [
  {
    value: 1,
    name: '建筑市政'
  }, 
  {
    value: 2,
    name: '园林绿化'
  },
  {
    value: 3,
    name: '水利工程'
  },
  {
    value: 4,
    name: '交通工程'
  },
  {
    value: 5,
    name: '电力工程'
  },
  {
    value: 6,
    name: '公路工程'
  },
  {
    value: 7,
    name: '海口与航道工程'
  },
  {
    value: 8,
    name: '机电安装工程'
  },
  {
    value: 9,
    name: '地质矿产工程'
  },
  {
    value: 10,
    name: '其他'
  }
]



export function newExportsExcel(href, name = '文件', flag = true) {
  let anchor = document.createElement('a')
  let herf = href
  let token = storage.get(ACCESS_TOKEN)
  let str
  if (flag) {
    let params = queryURLParams(href)
    let fileId = params.fileId
    let index = fileId.lastIndexOf('\.')
    str = fileId.substring(index +1, fileId.length)
  } else {
    str = 'xlsx'
  }
  axios.get(
      herf,
      {
          responseType: 'blob',
          headers: {
              Token: token
          }
      }
  ).then(res => {
      console.log(res)
      let ObjectUrl = window.URL.createObjectURL(res.data)
      anchor.href = ObjectUrl
      anchor.download = name + '.' + str
      anchor.click()
      window.URL.revokeObjectURL(ObjectUrl)
  })

}

  function queryURLParams(URL) {
    // const url = location.search; // 项目中可直接通过search方法获取url中"?"符后的字串
    let url = URL.split("?")[1];
    let obj = {}; // 声明参数对象
    let arr = url.split("&"); // 以&符号分割为数组
    for (let i = 0; i < arr.length; i++) {
      let arrNew = arr[i].split("="); // 以"="分割为数组
      obj[arrNew[0]] = arrNew[1];
    }
    return obj;
  }

  export function encrypted(message) {
    var key = CryptoJS.enc.Utf8.parse('82347812');
    var encrypted = CryptoJS.DES.encrypt(message, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  export function decrypted(ciphertext) {
    var key = CryptoJS.enc.Utf8.parse('82347812');
    var decrypted = CryptoJS.DES.decrypt({ciphertext: CryptoJS.enc.Base64.parse(ciphertext)}, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }