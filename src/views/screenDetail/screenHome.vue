<template>
  <div class="about-container">
    <!-- <div class="about-title">
      <div class="about-user">您好，朱云鹏</div>
    </div> -->
    <div class="about-content">
        
    
      <div class="about-left">
        <div class="left-top">
          <div class="left-top-left">
            <div class="left-top-left-title">
              <img src="../../assets/title-icon.png" />
              <span>总体数据概览</span>
            </div>
            <div class="left-top-echarts">
              <div id="overallData" style="width:2.2rem; height: 2.6rem;"></div>
            </div>
          </div>
          <div class="left-top-right">
            <div class="left-top-right-title">
              <img src="../../assets/title-icon.png" />
              <span>系统月度支付情况</span>
            </div>
            <div class="left-top-monthpay">
              <div id="monthPayData" style="width:2.2rem; height: 2.6rem;"></div>
            </div>
          </div>
        </div>
        <div class="left-center">
          <div class="left-center-left">
            <div class="left-center-left-title">
              <img class="img" src="../../assets/title-icon.png" />
              <span>本月农民工工资发放情况</span>
            </div>
            <div class="left-center-salary-wrapper">
              <div class="salary-entrance">
                <div class="title">
                  <span>累计入场农民工人数</span>
                  <span class="text">4209</span>
                </div>
                <div class="progress-wrpper">
                  <a-progress
                    :stroke-color="{
                      '0%': '#19337F',
                      '100%': '#5DDFFE',
                    }"
                    :percent="99.9"
                    :showInfo="false"
                  />
                </div>
              </div>
              <div class="salary-issue">
                <div class="title">
                  <span>发放工资农民工人数</span>
                  <span class="text">4226</span>
                </div>
                <div class="progress-wrpper">
                  <a-progress
                    :stroke-color="{
                      '0%': '#F0501A',
                      '100%': '#F3921B',
                    }"
                    :percent="99.9"
                    :showInfo="false"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="left-center-right">
            <div class="left-center-right-title">
              <img class="img" src="../../assets/title-icon.png" />
              <span>区块链支付告警</span>
            </div>
            <div class="left-center-right-table">
              <a-table
                :rowKey="((record, index) => {return index})"
                :columns="payWarningColumns"
                :data-source="payWarningData"
                :pagination="false"
                :bordered="false"
                :locale="locale"
              >
                <template #renderEmpty>
                  <a-empty
                    :image="require('../../assets/warning-icon.png')"
                  ></a-empty>
                </template>
              </a-table>
            </div>
          </div>
        </div>
        <div class="left-down">
          <div class="left-down-title">
            <img class="img" src="../../assets/title-icon.png" />
            <span>各分局标段支付进度数据</span>
          </div>
          <div class="left-down-lengend">
            <div class="lengend-wrapper"><span class="contractColor"></span>总包支付金额</div>
            <div class="lengend-wrapper"><span class="subColor"></span>业主支付金额</div>
          </div>
          <div class="left-down-paySchedule">
            <div id="payScheduleData" style="width:4.2rem; height: 2.6rem;"></div>
          </div>
        </div>
      </div>
      <div class="about-center">
        
        <div class="about-month">
          <div class="about-year">
            <div class="item"  :class="[year == item ? 'active' : '']" v-for="(item, index) of [2022, 2023]" :key="index"  @click="clickYear(item)">{{item}}年</div>
          </div>
            <div class="about-month-options">
                <div 
                  class="item"
                  v-for="(item, index) of dateMoth" 
                  :key="index"
                  @click="handleClick(item.value, index)"
                  :class="[isDateIndex == index ? 'active' : '']"
                >
                  {{ item.name }}
                </div>
            </div>
        </div>
        <div class="about-eye" @click="handleEyeClick">
          <a-icon class="eye" type="eye" v-if="!isEyeStatus" />
          <a-icon class="eye" type="eye-invisible" v-else />
          <a-button class="eye-btn" type="primary" @click="handleEnterSystemClick">进入系统</a-button>
        </div>
        <div class="about-desc-wrapper">
            <div class="about-desc">
              <span class="name">{{ unitData.companyName }}</span>
              <div class="detail">
                <span>签订合同总额：{{ isEyeStatus ? '******' : unitData.contractAmount }}万元</span>
                <span>当月结算金额：{{ isEyeStatus ? '******' : unitData.settlAmount }}万元</span>
                <span>当月支付金额：{{ isEyeStatus ? '******' : unitData.paymentAmount }}万元</span>
              </div>
            </div>
            <div class="about-line"></div>
            <div class="about-second">
              <div v-for="(item, index) of unitData.children" :key="index" class="title-top">
                <span class="name" :class="[isActive == index  ? 'isActive' : '']" @click="handleActiveClick(index, item)">
                  <a-tooltip>
                    <template slot="title">
                      {{ item.companyName }}
                    </template>
                    {{ setCompanyName(item.companyName) }}
                  </a-tooltip>
                </span>
                <div class="top-detail">
                  <span>合同总额：{{ isEyeStatus ? '******' : item.contractAmount }}万元</span>
                  <span>当月结算金额：{{ isEyeStatus ? '******' : item.settlAmount }}万元</span>
                  <span>当月支付金额：{{ isEyeStatus ? '******' : item.paymentAmount }}万元</span>
                </div>
              </div>
            </div>
            <div class="about-show" v-if="subData.length > 0">
            <swiper :options="swiperOption" ref="mySwiper">
              <swiper-slide v-for="(item, index) of subData" :key="index">
                <div class="slide-wrapper">
                  <span class="name">{{ item.companyName }}</span>
                  <div class="about-footer">
                    <span>合同总额：{{ isEyeStatus ? '******' : item.contractAmount }}万元</span>
                    <span>当月结算金额：{{ isEyeStatus ? '******' : item.settlAmount }}万元</span>
                    <span>当月支付金额：{{ isEyeStatus ? '******' : item.paymentAmount }}万元</span>
                    <span v-if="item.flag" @click="handleLeftClick(item)" class="about-worker">农民工工资支付详情</span>
                  </div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>
          </div>
      </div>
      <div class="about-right">
        <div class="right-top">
          <div class="right-top-left">
            <div class="right-top-left-title">
              <img src="../../assets/title-icon.png" />
              <span>分包上链情况</span>
            </div>
            <div class="right-top-subChain">
              <div id="subChainData" style="width:2.2rem; height: 2.6rem;"></div>
            </div>
          </div>
          <div class="right-top-right">
            <div class="right-top-right-title">
              <img src="../../assets/title-icon.png" />
              <span>分包类型分析</span>
            </div>
            <div class="right-top-subType">
              <div id="subTypeData" style="width:2.2rem; height: 3rem;"></div>
            </div>
          </div>
        </div>
        <div class="right-center">
          <div class="right-center-left">
            <div class="right-center-left-title">
              <img src="../../assets/title-icon.png" />
              <span>总包上链合同</span>
            </div>
            <div class="right-center-contractChain">
              <div id="contractChainData" style="width:2.2rem; height: 3rem;"></div>
            </div>
          </div>
          <div class="right-center-right">
            <div class="right-center-right-title">
              <img src="../../assets/title-icon.png" />
              <span>分包合同金额分析</span>
            </div>
            <div class="right-center-contractAmount">
              <div id="contractAmountData" style="width:2.2rem; height: 3rem;"></div>
            </div>
          </div>
        </div>
        <div class="right-down">
          <div class="right-down-title">
            <img class="img" src="../../assets/title-icon.png" />
            <span>合同支付进度</span>
          </div>
          <div class="right-down-lengend">
            <div class="lengend-wrapper"><span class="contractColor"></span>分包合同总金额</div>
            <div class="lengend-wrapper"><span class="subColor"></span>分包合同累计支付金额</div>
          </div>
          <div class="right-down-paySchedule">
            <div id="contractScheduleData" style="width:4.2rem; height: 2.6rem;"></div>
          </div>
        </div>
      </div>
    
    </div>

    <a-modal v-model="isLeftVisible" class="left-modal" :closable="false" :footer="false" @cancel="handleCancelClick">
      <a-table
        :rowKey="((record, index) => {return index})"
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
        :bordered="false"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <template slot="accNo" slot-scope="text, record">
          <span>{{ isEyeStatus ? '******' : record.accNo }}</span>
        </template>
        <template slot="amount" slot-scope="text, record">
          <span>{{ isEyeStatus ? '******' : record.amount }}</span>
        </template>
        <template slot="result">
          <span>支付成功</span>
        </template>
        <template slot="isRealName">
          <span class="is-real-name">已实名</span>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getUnitData, getSubData, getUnitMonthData, getSubMonthData, getWageMonthData, getLeftData, getRightData } from '@/api/screenDetail'
import { companyJuneWage1, companyJuneWage2 } from '@/utils/mock'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/utils/flexible'
import 'swiper/dist/css/swiper.css'
import Empty from './empty.vue'

const columns = [
  {
    title: '户名',
    dataIndex: 'accName',
    key: 'accName',
    width: '15%'
  },
  {
    title: '账号',
    dataIndex: 'accNo',
    key: 'accNo',
    scopedSlots: { customRender: 'accNo' },
    width: '20%'
  },
  {
    title: '金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    scopedSlots: { customRender: 'amount' },
    width: '12%'
  },
  {
    title: '支付结果',
    dataIndex: 'result',
    key: 'result',
    scopedSlots: { customRender: 'result' },
    width: '12%'
  },
  {
    title: '是否实名',
    dataIndex: 'isRealName',
    key: 'isRealName',
    scopedSlots: { customRender: 'isRealName' },
    width: '10%'
  }
]

const payWarningColumns = [
  {
    title: '劳务分包名称',
    dataIndex: 'subContractName',
    key: 'subContractName',
    width: '15%',
    align: 'center'
  },
  {
    title: '农民工',
    dataIndex: 'payAccNoName',
    key: 'payAccNoName',
    width: '10%',
    align: 'center'
  },
  {
    title: '支付金额',
    dataIndex: 'amount',
    key: 'amount',
    width: '10%',
    align: 'center'
  },
  {
    title: '支付异常原因',
    dataIndex: 'reason',
    key: 'reason',
    width: '15%',
    align: 'center'
  }
]

export default {
  name: "About",
  components: { swiper, swiperSlide },
  data () {
    this.columns = columns
    this.payWarningColumns = payWarningColumns
    return {
      isShow: false,
      isLeftVisible: false,
      isRightVisible: false,
      loadData: [],
      count: 1,
      zhData: [
        {
          index: '1',
          name: '文朝法',
          account: '6215340300004717758',
          amount: '26950',
          result: '支付成功'
        },
        {
          index: '2',
          name: '史华强',
          account: '6217002300028251698',
          amount: '26950',
          result: '支付成功'
        },
        {
          index: '3',
          name: '张岩凯',
          account: '6217000120028809697',
          amount: '14260',
          result: '支付成功'
        }
      ],
      unitData: {},
      isActive: null,
      subData: [],
      month: 7,
      swiperOption: {
        loop: false,
        slidesPerView: 3,
        // 显示分页
        pagination: {
          el: '.swiper-pagination',
          clickable: false //允许分页点击跳转
        },
        // 设置点击箭头
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      dateMoth: [
        {
            name: '一月',
            value: '2023-01-01'
          },
          {
            name: '二月',
            value: '2023-02-01'
          },
          {
            name: '三月',
            value: '2023-03-01'
          },
          {
            name: '四月',
            value: '2023-04-01'
          },
          {
            name: '五月',
            value: '2023-05-01'
          },
          {
            name: '六月',
            value: '2023-06-01'
          },
          {
            name: '七月',
            value: '2023-07-01'
          },
          {
            name: '八月',
            value: '2023-08-01'
          },
          {
            name: '九月',
            value: '2023-09-01'
          },
          {
            name: '十月',
            value: '2023-10-01'
          },
      ],
      isDateIndex: 0,
      monthCacheData: [
        {
          companyName: '北京华天幕墙工程有限公司',
          date: '2022年7月20日 16:32',
          amount: '17,410,335.48',
          settleAmount: '104,080.00'
        },
        {
          companyName: '保定弘皓门业制造有限公司',
          date: '2022年7月20日 16:41',
          amount: '1,186,816.30',
          settleAmount: ''
        },
        {
          companyName: '珠海兴业绿色建筑科技有限公司',
          date: '2022年7月20日 16:46',
          amount: '16,332,685.45',
          settleAmount: '68,160.00'
        }
      ],
      userName: '',
      pagination: {
        current: 1,
        pageSize: 10,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: total => `共${total}条`,
        total: 0,
        onChange: (page, pageSize) => {
          this.handlePageChange(page, pageSize)
        },
        onShowSizeChange: (current, size) => {
          this.handleShowSizeChange(current, size)
        },
      },
      cacheCompanyName: '',
      cacheUnitName: '',
      monthList: [],
      amountList: [],
      payWarningData: [],
      locale: {
        emptyText: <Empty/>
      },
      cacheItem: {},
      isEyeStatus: true,
      year: 2023
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    // this.handleClick(this.isDateIndex, 0)
    this.month = '2023-01-01'
      this.getUnitMonthInfo()
      // this.getUnitInfo()
    this.loadData = companyJuneWage1
    this.userName = window.localStorage.getItem('userName') ? window.localStorage.getItem('userName').replace(/\"/g, '') : ''
    this.initOverallDataEcharts()
    this.initMonthPayDataEcharts()
    this.initSubChainDataEcharts()
    this.initSubTypeDataEcharts()
    this.initContractChainDataEcharts()
    this.initContractAmountDataEcharts()
    this.initPayScheduleDataEcharts()
    this.initContractScheduleDataEcharts()
  },
  watch: {
    count(newVal) {
      if(newVal == 1) {
        this.loadData = companyJuneWage1
      } else if(newVal == 2) {
        this.loadData = companyJuneWage2
      }
    },
  },
  methods: {
    getLeftInfo() {
      getLeftData().then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.payWarningData = res.data.paymentWarningList
        }
      })
    },
    getUnitInfo() {
      getUnitData().then(res => {
        if(res.status == 1 && res.data) {
          const data = res.data
          this.unitData = res.data
          this.cacheItem = res.data.children[2]
          this.handleActiveClick(2, this.cacheItem)
        }
      })
    },
    getUnitMonthInfo() {
      getUnitMonthData(this.month).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.unitData = res.data
          this.handleActiveClick(1,res.data.children[1])
        }
      })
    },
    clickYear(year) {
      this.year = year
      this.isDateIndex = 0
      if (year === 2022) {
        this.dateMoth = [
          {
            name: '六月及以前',
            value: '2022-06-01'
          },
          {
            name: '七月',
            value: '2022-07-01'
          },
          {
            name: '八月',
            value: '2022-08-01'
          },
          {
            name: '九月',
            value: '2022-09-01'
          },
          {
            name: '十月',
            value: '2022-10-01'
          },
          {
            name: '十一月',
            value: '2022-11-01'
          },
          {
            name: '十二月',
            value: '2022-12-01'
          }
        ]
        this.month = '2022-06-01'
        this.getUnitInfo()
      } else {
        this.dateMoth = [
          {
            name: '一月',
            value: '2023-01-01'
          },
          {
            name: '二月',
            value: '2023-02-01'
          },
          {
            name: '三月',
            value: '2023-03-01'
          },
          {
            name: '四月',
            value: '2023-04-01'
          },
          {
            name: '五月',
            value: '2023-05-01'
          },
           {
            name: '六月',
            value: '2023-06-01'
          },
          {
            name: '七月',
            value: '2023-07-01'
          },
          {
            name: '八月',
            value: '2023-08-01'
          },
          {
            name: '九月',
            value: '2023-09-01'
          },
          {
            name: '十月',
            value: '2023-10-01'
          },
        ]
        this.month = '2023-01-01'
        this.getUnitMonthInfo()
      }
      
    },
    handleClick(num, index) {
      // this.isShow = !this.isShow
      this.subData = []
      this.isShow = true
      this.month = num
      this.isDateIndex = index
      if(index == 0 && this.year === 2022) {
        this.getUnitInfo()
      } else {
        this.getUnitMonthInfo()
      }
      // if(index == 1) {
      //   this.getUnitMonthInfo()
      // } else if(index == 2) {
      //   this.getUnitMonthInfo()
      // } else if(index == 3) {
      //   this.getUnitMonthInfo()
      // } else if(index == 4) {
      //   this.getUnitMonthInfo()
      // }
      this.isActive = null
    },
    handleOtherClick() {
      this.isShow = false
    },
    handleLeftClick(item) {
      console.log(item)
      this.isLeftVisible = true
      this.cacheCompanyName = item.companyName
      console.log(this.isDateIndex)
      let date = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01', '2023-10-01']
      if (this.year === 2022) {
         date = ['2022-06-01', '2022-07-01', '2022-08-01', '2022-09-01', '2022-10-01', '2022-11-01', '2022-12-01']
      } else {
         date = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01', '2023-10-01']
      }
      let reqObj = {
        companyName: this.cacheCompanyName,
        unitName: this.cacheUnitName,
        date: date[this.isDateIndex],
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getWageMonthData(reqObj).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.loadData = res.data.pageList
        }
      })
    },
    handleRightClick() {
      this.isRightVisible = true
    },
    handleOneClick() {
      this.loadData = companyJuneWage1
      this.count = 1
    },
    handleTwoClick() {
      this.loadData = companyJuneWage2
      this.count = 2
    },
    handlePrevClick() {
      this.count--
      if(this.count <= 1) {
        this.count = 1
      }
    },
    handleNextClick() {
      this.count++
      if(this.count >= 2) {
        this.count = 2
      }
    },
    handleActiveClick(index, item) {
      this.isActive = index
      console.log(this.isActive)
      console.log(item, this.month)
      this.cacheUnitName = item.companyName
      console.log(this.isDateIndex)
      if(this.isDateIndex == 0) {
        getSubData(item.unifiedCreditCode).then(res => {
          console.log(res)
          if(res.status == 1 && res.data) {
            this.subData = res.data
          }
        })
      } else {
        getSubMonthData(item.companyName, this.month).then(res => {
          console.log(res)
          if(res.status == 1 && res.data) {
            this.subData = res.data
          }
        })
      }
    },
    handleLogoClick() {
      window.location.href = 'http://203.110.222.47:8061/enterprise/#/ProjectGroup/blockchainPay'
    },
    handlePageChange(page, pageSize) {
      console.log(page, pageSize)
      this.pagination.current = page
      let reqObj = {
        companyName: this.cacheCompanyName,
        unitName: this.cacheUnitName,
        date: this.isDateIndex == 0 ? '2022-06-01' : this.isDateIndex == 1 ? '2022-07-01' : '2022-08-01',
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getWageMonthData(reqObj).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.loadData = res.data.pageList
        }
      })
    },
    handleShowSizeChange(current, size) {
      console.log(current, size)
      this.pagination.pageSize = size
      let reqObj = {
        companyName: this.cacheCompanyName,
        unitName: this.cacheUnitName,
        date: this.isDateIndex == 0 ? '2022-06-01' : this.isDateIndex == 1 ? '2022-07-01' : '2022-08-01',
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getWageMonthData(reqObj).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.loadData = res.data.pageList
        }
      })
    },
    handleCancelClick() {
      this.loadData = []
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    initOverallDataEcharts() {
      getLeftData().then(res => {
        if(res.status == 1 && res.data) {
          let overallInfo = res.data.overallDataList

          const option = {
            title: {
              text: '万元',
              top: 12,
              left: 10,
              textStyle: {
                fontSize: 20,
                color: '#FFFFFF',
              }
            },
            // tooltip: {
            //   trigger: 'axis',
            //   axisPointer: {
            //     label: {
            //       show: true
            //     }
            //   }
            // },
            grid: {
                top: '13%',
                left: '1%',
                right: "1%",
                bottom: '20%',
                containLabel: true
              },
            xAxis: {
              data: ['总包合同', '业主结算', '业主支付', '分包合同', '总包支付'],
              axisLabel: {
                formatter:function(value) {
                  return value.split('').join('\n')
                },
                textStyle: {
                  color: '#FFFFFF',
                  fontSize: 24
                }
              }
            },
            yAxis: {
              axisLabel: {
                fontSize: 22,
                textStyle: {
                  color: '#FFFFFF'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#338199'
                }
              }
            },
            series: [
              {
                type: 'bar',
                barWidth: 20,
                data: overallInfo,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#3B88ED' },
                      { offset: 1, color: '#1E4477' }
                    ]
                  )
                },
              }
            ],
            
          }

          const overallData = echarts.init(document.getElementById('overallData'));

          overallData.setOption(option);

          window.addEventListener('resize', () => {
            overallData.resize()
          })
          }
      })
      
    },
    initMonthPayDataEcharts() {
      let self = this
      let monthList = []
      let amountList = []
      getLeftData().then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          monthList = res.data.monthlyPayment.monthList
          amountList = res.data.monthlyPayment.amountList

          const option = {
            grid: {
                top: '10%',
                left: '1%',
                right: "1%",
                bottom: '20%',
                containLabel: true
              },
            xAxis: {
              data: monthList,
              axisLabel: {
                formatter:function(value) {
                  return value.split('').join('\n')
                },
                textStyle: {
                  color: '#FFFFFF',
                  fontSize: 24
                }
              }
            },
            yAxis: {
              axisLabel: {
                fontSize: 22,
                textStyle: {
                  color: '#FFFFFF'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#338199'
                }
              }
            },
            series: [
              {
                type: 'bar',
                barWidth: 20,
                data: amountList,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#F3FA45' },
                      { offset: 1, color: '#162633' }
                    ]
                  )
                },
              }
            ],
        
      }

      const monthPayData = echarts.init(document.getElementById('monthPayData'));

      monthPayData.setOption(option);

      window.addEventListener('resize', () => {
        monthPayData.resize()
      })
        }
      })
      
    },
    initSubChainDataEcharts() {
      getRightData().then(res => {
        if(res.status == 1 && res.data) {
          let subCompanyNameList = res.data.subChainSituation.nameList
          let subCompanyValueList = res.data.subChainSituation.valueList

          const option = {
            grid: {
                top: '10%',
                left: '1%',
                right: "1%",
                bottom: '20%',
                containLabel: true
              },
                xAxis: {
                  data: subCompanyNameList,
                  axisLabel: {
                    formatter:function(value) {
                      return value.split('').join('\n')
                    },
                    textStyle: {
                      color: '#FFFFFF',
                      fontSize: 24
                    }
                  }
                },
                yAxis: {
                  axisLabel: {
                    fontSize: 24,
                    textStyle: {
                      color: '#FFFFFF'
                    }
                  },
                  splitLine: {
                    lineStyle: {
                      color: '#338199'
                    }
                  }
                },
                series: [
                  {
                    type: 'bar',
                    barWidth: 20,
                    data: subCompanyValueList,
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                        0,0,0,1,
                        [
                          { offset: 0, color: '#3B88ED' },
                          { offset: 1, color: '#1E4477' }
                        ]
                      )
                    },
                  }
                ],
                
              }

              const subChainData = echarts.init(document.getElementById('subChainData'));

              subChainData.setOption(option);

              window.addEventListener('resize', () => {
                subChainData.resize()
              })

        }
      })
      
    },
    initSubTypeDataEcharts() {
      getRightData().then(res => {
        if(res.status == 1 && res.data) {
          let subTypeSituation = res.data.subTypeSituation

          subTypeSituation && subTypeSituation.map(v => {
            if(v.name == '专业分包合同') {
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: 'rgba(4,27,54,0.5)' },
                      { offset: 1, color: 'rgba(41,118,210,0.5)' }
                    ]
                  )
                }
            } else if(v.name == '劳务分包合同') {
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#295E6F' },
                      { offset: 1, color: '#73F5D9' }
                    ]
                  )
                }
            } else if(v.name == '大宗商品采购合同') {
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#564936' },
                      { offset: 1, color: '#E8742E' }
                    ]
                  )
                }
            } else if(v.name == '大宗设备租赁合同') {
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#FFEE27' },
                      { offset: 1, color: '#333105' }
                    ]
                  )
                }
            } else if(v.name == '其他') {
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#FF27BD' },
                      { offset: 1, color: '#7C0A47' }
                    ]
                  )
                }
            }
          })


          const option = {
            tooltip: {
              trigger: 'item'
            },
              legend: {
                orient: 'vertical',
                bottom: 210,
                itemHeight: 6,
                itemWidth: 12,
                textStyle: {
                  color: "#FFFFFF",
                  fontSize: 18,
                }
              },
              series: [
                {
                  type: 'pie',
                  radius: ['30%', '40%'],
                  center: ['50%', '30%'],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                    position: 'center'
                  },
                  labelLine: {
                    show: false
                  },
                  // data: [
                  //   { 
                  //     value: 1048, 
                  //     name: '专业分包',
                  //     itemStyle: {
                  //       color: new echarts.graphic.LinearGradient(
                  //         0,0,0,1,
                  //         [
                  //           { offset: 0, color: 'rgba(4,27,54,0.5)' },
                  //           { offset: 1, color: 'rgba(41,118,210,0.5)' }
                  //         ]
                  //       )
                  //     },
                  //   },
                  //   { 
                  //     value: 735, 
                  //     name: '劳务分包',
                  //     itemStyle: {
                  //       color: new echarts.graphic.LinearGradient(
                  //         0,0,0,1,
                  //         [
                  //           { offset: 0, color: '#295E6F' },
                  //           { offset: 1, color: '#73F5D9' }
                  //         ]
                  //       )
                  //     },
                  //   },
                  //   { 
                  //     value: 580, 
                  //     name: '材料供应商',
                  //     itemStyle: {
                  //       color: new echarts.graphic.LinearGradient(
                  //         0,0,0,1,
                  //         [
                  //           { offset: 0, color: '#564936' },
                  //           { offset: 1, color: '#E8742E' }
                  //         ]
                  //       )
                  //     },
                  //   },
                  //   { 
                  //     value: 484, 
                  //     name: '大宗设备租赁商',
                  //     itemStyle: {
                  //       color: new echarts.graphic.LinearGradient(
                  //         0,0,0,1,
                  //         [
                  //           { offset: 0, color: '#FFEE27' },
                  //           { offset: 1, color: '#333105' }
                  //         ]
                  //       )
                  //     },
                  //   },
                  //   { 
                  //     value: 300, 
                  //     name: '其他分包',
                  //     itemStyle: {
                  //       color: new echarts.graphic.LinearGradient(
                  //         0,0,0,1,
                  //         [
                  //           { offset: 0, color: '#FF27BD' },
                  //           { offset: 1, color: '#7C0A47' }
                  //         ]
                  //       )
                  //     },
                  //   }
                  // ]
                  data: subTypeSituation
                }
              ],
              
            }

            const subTypeData = echarts.init(document.getElementById('subTypeData'));

            subTypeData.setOption(option);

            window.addEventListener('resize', () => {
              subTypeData.resize()
            })
        }
      })
      
    },
    initContractChainDataEcharts() {
      getRightData().then(res => {
        if(res.status == 1 && res.data) {
          let totalChainSituationNameList = res.data.totalChainSituation.nameList
          let totalChainSituationValueList = res.data.totalChainSituation.valueList

          const option = {
            grid: {
                top: '10%',
                left: '1%',
                right: "1%",
                bottom: '30%',
                containLabel: true
              },
              xAxis: {
                data: totalChainSituationNameList,
                axisLabel: {
                  formatter:function(value) {
                    return value.split('').join('\n')
                  },
                  textStyle: {
                    color: '#FFFFFF',
                    fontSize: 24
                  }
                }
              },
              yAxis: {
                axisLabel: {
                  fontSize: 22,
                  textStyle: {
                    color: '#FFFFFF'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: '#338199'
                  }
                }
              },
              series: [
                {
                  type: 'bar',
                  barWidth: 20,
                  data: totalChainSituationValueList,
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      0,0,0,1,
                      [
                        { offset: 0, color: '#F3FA45' },
                        { offset: 1, color: '#162633' }
                      ]
                    )
                  },
                }
              ],
              
            }

            const contractChainData = echarts.init(document.getElementById('contractChainData'));

            contractChainData.setOption(option);

            window.addEventListener('resize', () => {
              contractChainData.resize()
            })
        }
      })
      
    },
    initContractAmountDataEcharts() {
      getRightData().then(res => {
        if(res.status == 1 && res.data) {
          let subAmountSituationList = res.data.subAmountSituation

          subAmountSituationList && subAmountSituationList.map(v => {
            if(v.name == '专业分包合同') {
              v.name = v.name + `  ${v.value}万元`
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: 'rgba(4,27,54,0.5)' },
                      { offset: 1, color: 'rgba(41,118,210,0.5)' }
                    ]
                  )
                }
            } else if(v.name == '劳务分包合同') {
              v.name = v.name + `  ${v.value}万元`
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#295E6F' },
                      { offset: 1, color: '#73F5D9' }
                    ]
                  )
                }
            } else if(v.name == '大宗商品采购合同') {
              v.name = v.name + `  ${v.value}万元`
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#564936' },
                      { offset: 1, color: '#E8742E' }
                    ]
                  )
                }
            } else if(v.name == '大宗设备租赁合同') {
              v.name = v.name + `  ${v.value}万元`
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#FFEE27' },
                      { offset: 1, color: '#333105' }
                    ]
                  )
                }
            } else if(v.name == '其他') {
              v.name = v.name + `  ${v.value}万元`
              v.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    [
                      { offset: 0, color: '#FF27BD' },
                      { offset: 1, color: '#7C0A47' }
                    ]
                  )
                }
            }
          })

          const option = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              bottom: 210,
              itemHeight: 6,
              itemWidth: 12,
              textStyle: {
                color: "#FFFFFF",
                fontSize: 18,
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['30%', '40%'],
                center: ['50%', '30%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                labelLine: {
                  show: false
                },
                // data: [
                //   { 
                //     value: 1048, 
                //     name: '专业分包',
                //     itemStyle: {
                //       color: new echarts.graphic.LinearGradient(
                //         0,0,0,1,
                //         [
                //           { offset: 0, color: 'rgba(4,27,54,0.5)' },
                //           { offset: 1, color: 'rgba(41,118,210,0.5)' }
                //         ]
                //       )
                //     },
                //   },
                //   { 
                //     value: 735, 
                //     name: '劳务分包',
                //     itemStyle: {
                //       color: new echarts.graphic.LinearGradient(
                //         0,0,0,1,
                //         [
                //           { offset: 0, color: '#295E6F' },
                //           { offset: 1, color: '#73F5D9' }
                //         ]
                //       )
                //     },
                //   },
                //   { 
                //     value: 580, 
                //     name: '材料供应商',
                //     itemStyle: {
                //       color: new echarts.graphic.LinearGradient(
                //         0,0,0,1,
                //         [
                //           { offset: 0, color: '#564936' },
                //           { offset: 1, color: '#E8742E' }
                //         ]
                //       )
                //     },
                //   },
                //   { 
                //     value: 484, 
                //     name: '大宗设备租赁商',
                //     itemStyle: {
                //       color: new echarts.graphic.LinearGradient(
                //         0,0,0,1,
                //         [
                //           { offset: 0, color: '#FFEE27' },
                //           { offset: 1, color: '#333105' }
                //         ]
                //       )
                //     },
                //   },
                //   { 
                //     value: 300, 
                //     name: '其他分包',
                //     itemStyle: {
                //       color: new echarts.graphic.LinearGradient(
                //         0,0,0,1,
                //         [
                //           { offset: 0, color: '#FF27BD' },
                //           { offset: 1, color: '#7C0A47' }
                //         ]
                //       )
                //     },
                //   }
                // ]
                data: subAmountSituationList
              }
            ],
            
          }

          const contractAmountData = echarts.init(document.getElementById('contractAmountData'));

      contractAmountData.setOption(option);

      window.addEventListener('resize', () => {
        contractAmountData.resize()
      })

        }
        
        
      })
      
    },
    initPayScheduleDataEcharts() {
      getLeftData().then(res => {
        if(res.status == 1 && res.data) {
          let prjName = res.data.paymentProgress.prjName
          let totalPayAmount = res.data.paymentProgress.totalPaymentAmount
          let ownerPayAmount = res.data.paymentProgress.ownerPaymentAmount

          const option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  label: {
                    show: true
                  }
                },
              },
              legend: {},
              grid: {
                top: '10%',
                left: '1%',
                right: "1%",
                bottom: '20%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                axisLabel: {
                  textStyle: {
                    fontSize: 8
                  }
                },
                axisLine: false,
                splitLine: false
              },
              yAxis: {
                type: 'category',
                splitLine: {
                  lineStyle: {
                    color: '#338199'
                  }
                },
                data: prjName,
                axisLabel: {
                  textStyle: {
                    fontSize: 18,
                    color: '#FFFFFF'
                  }
                },
              },
              series: [
                {
                  type: 'bar',
                  data: totalPayAmount,
                  stack: 'total',
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      1,0,0,0,
                      [
                        { offset: 0, color: '#5DDFFE' },
                        { offset: 1, color: '#19337F' }
                      ]
                    )
                  },
                },
                {
                  type: 'bar',
                  data: ownerPayAmount,
                  stack: 'total',
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      1,0,0,0,
                      [
                        { offset: 0, color: '#F3921B' },
                        { offset: 1, color: '#F0501A' }
                      ]
                    )
                  },
                }
              ],
              
            }

            const payScheduleData = echarts.init(document.getElementById('payScheduleData'));

            payScheduleData.setOption(option);

            window.addEventListener('resize', () => {
              payScheduleData.resize()
            })
        }
      })
      
    },
    initContractScheduleDataEcharts() {
      getRightData().then(res => {
        if(res.status == 1 && res.data) {
          let prjName = res.data.subPaymentProgress.prjName
          let subContractAmount = res.data.subPaymentProgress.subContractAmount
          let subPaymentAmount = res.data.subPaymentProgress.subPaymentAmount

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                label: {
                  show: true
                }
              }
            },
            grid: {
                top: '10%',
                left: '1%',
                right: "1%",
                bottom: '20%',
                containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLabel: {
                  textStyle: {
                    fontSize: 8
                  }
                },
              axisLine: false,
              splitLine: false
            },
            yAxis: {
              type: 'category',
              splitLine: {
                lineStyle: {
                  color: '#338199'
                }
              },
              axisLabel: {
                  textStyle: {
                    fontSize: 18,
                    color: '#FFFFFF'
                  }
                },
              data: prjName
            },
            series: [
              {
                type: 'bar',
                data: subContractAmount,
                stack: 'total',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    1,0,0,0,
                    [
                      { offset: 0, color: '#64F6E0' },
                      { offset: 1, color: '#055558' }
                    ]
                  )
                },
              },
              {
                type: 'bar',
                data: subPaymentAmount,
                stack: 'total',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    1,0,0,0,
                    [
                      { offset: 0, color: '#5DDFFE' },
                      { offset: 1, color: '#19337F' }
                    ]
                  )
                },
              }
            ],
            
          }

          const contractScheduleData = echarts.init(document.getElementById('contractScheduleData'));

          contractScheduleData.setOption(option);

          window.addEventListener('resize', () => {
            contractScheduleData.resize()
          })
        }
      })
      
    },
    setCompanyName(name) {
      if(name == '中电建建筑集团有限公司') {
        return '中电建建筑';
      } else if(name == '中国水利水电第四工程局有限公司') {
        return '水电四局';
      } else if(name == '中国水利水电第五工程局有限公司') {
        return '水电五局';
      } else if(name == '中国水利水电第七工程局有限公司') {
        return '水电七局';
      } else if(name == '中国水利水电第八工程局有限公司') {
        return '水电八局';
      } else if(name == '中国水利水电第九工程局有限公司'){
        return '水电九局'
      }
    },
    handleEyeClick() {
      this.isEyeStatus = !this.isEyeStatus
    },
    handleEnterSystemClick() {
      window.location.href = 'https://203.110.222.136:13448/'
    }
  }
};
</script>
<style lang="less" scoped>
.about-container{
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: #051427;
  .about-title{
    position: relative;
    width: 100%;
    height: 0.63rem;
    background: url('../../assets/home-title-new.png') no-repeat;
    background-size: 100% 100%;
    .about-user{
      width: 6%;
      height: 0.22rem;
      position: absolute;
      right: 0.5%;
      top: 10%;
      background: transparent;
      display: flex;
      align-items: center;
      padding-left: 10px;
      font-weight: 600;
      font-size: 12px;
      font-family: MiSans-Medium, MiSans;
      font-weight: 600;
      color: #1EB1EC;
      line-height: 30px;
    }
  }

  .about-content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    color: #FFFFFF;
    padding-left: 0.28rem;
    padding-right: 0.23rem;
    padding-top: 0.02rem;
    .about-left{
      margin-right: 0.23rem;
      .left-top {
        display: flex;
        flex-direction: row;
        .left-top-left{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .left-top-left-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
          .left-top-echarts{
            
            #overallData {
              
            }
          }
        }
        .left-top-right{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 0.12rem;
          .left-top-right-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
        }
      }
      .left-center{
        display: flex;
        flex-direction: row;
        margin-top: 0.155rem;
        .left-center-left{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          .left-center-left-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
          .left-center-salary-wrapper{
            width: 100%;
            padding-top: 0.17rem;
            padding-left: 0.11rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .salary-entrance{
              margin-top: 0.2rem;
              .title{
                width: 2.2rem;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 0.09rem;
                .text{
                  color: #65E1FF;
                }
              }
              .progress-wrpper{
                width: 2.2rem;
                margin-top: 0.2rem;
                margin-bottom: 0.3rem;
              }
            }
            .salary-issue{
              .title{
                width: 2.2rem;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 0.09rem;
                .text{
                  color: #F38E1B;
                }
              }
              .progress-wrpper{
                width: 2.2rem;
                margin-top: 0.2rem;
                margin-bottom: 0.3rem;
              }
            }
          }
        }
        .left-center-right{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 0.12rem;
          .left-center-right-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
          .left-center-right-table{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            font-size: 12px;
            padding-top: 15px;
            margin-left: -80px;
          }
        }
      }
      .left-down {
        width: 5.05rem;
        height: 2.35rem;
        background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
        border-radius: 6px;
        margin-top: 0.176rem;
        padding-top: 0.076rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .left-down-title{
          width: 4.75rem;
          height: 0.28rem;
          font-size: 0.11rem;
          background: url('../../assets/title-bg-icon.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
        }
        .left-down-lengend{
          position: absolute;
          top: 65px;
          left: 10%;
          width: 70%;
          height: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-size: 0.1rem;
          .lengend-wrapper{
            display: flex;
            flex-direction: row;
            align-items: center;
            .contractColor {
              display: inline-block;
              width: 30px;
              height: 10px;
              background: linear-gradient(270deg, #5DDFFE 0%, #19337F 100%);
              border-radius: 4px;
              margin-right: 10px;
            }
          }
          .lengend-wrapper{
            display: flex;
            flex-direction: row;
            align-items: center;
            .subColor {
              display: inline-block;
              width: 30px;
              height: 10px;
              background: linear-gradient(270deg, #F3921B 0%, #F0501A 100%);
              border-radius: 4px;
              margin-right: 10px;
            }
          }
          
        }
      }
    }
    .about-center {
      width: 12.85rem;
      height: 100%;
      // border: 1px solid #FFFFFF;
      position: relative;
      padding-top: 0.15rem;
      .about-year {
        display: flex;
        flex-direction: row;
        margin-left: 60px!important;
        max-width: 800px;
        flex-wrap: wrap;
        .item{
          width: 138.86px;
          height: 69.13px;
          margin-right: 8px !important;
          // background: url('../../assets/month-bg.png') no-repeat;
          // background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.11rem;
          margin-bottom: 20px;
      }
      .item:hover{
        cursor: pointer;
      }
      .active{
        cursor: pointer;
        // background: url('../../assets/month-bg-active.png') no-repeat;
        // background-size: 100% 100%;
        color: #5DDFFE;
      }
      }
      .about-month{
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 20px;
          .about-month-options{
              display: flex;
              flex-direction: row;
              margin-left: 60px!important;
              max-width: 800px;
              flex-wrap: wrap;
              .item{
                width: 138.86px;
                height: 69.13px;
                margin-right: 8px !important;
                background: url('../../assets/month-bg.png') no-repeat;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.11rem;
                margin-bottom: 20px;
            }
            .item:hover{
              cursor: pointer;
            }
            .active{
              cursor: pointer;
              background: url('../../assets/month-bg-active.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          .month-second{
            margin-top: 20px!important;
          }
          
      }
      .about-eye{
        position: absolute;
        top: 50px;
        right: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .eye{
          font-size: 40px!important;
        }
        .eye:hover{
          cursor: pointer;
        }
        .eye-btn{
          margin-left: 30px;
          font-size: 20px;
        }
      }
      .about-diagram{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .about-detail{
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-family: MiSans;
          font-weight: 500;
          line-height: 30px;
          color: #96E9FF;
          padding: 10px 55px!important;
          position: relative;
          border-left: 1px dashed #214B67;
          margin: 20px 0px 20px 285px!important;
          
        }
        .about-subsidiary{
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          padding-top: 50px!important;
          .sub-wrapper{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            .detail{
              display: flex;
              flex-direction: column;
              img{
                width: 50px;
                height: 50px;
              }
              .item{
                font-size: 14px;
                font-family: MiSans;
                font-weight: 500;
                line-height: 30px;
                color: #96E9FF;
                margin-left: 20px !important;
                .item-desc{
                  margin-left: 8px!important;
                  font-size: 14px;
                  font-family: MiSans;
                  font-weight: 500;
                  line-height: 30px;
                  color: #FFEB00;
                  text-decoration: underline;
                }
                .item-desc:hover{
                  cursor: pointer;
                }
              }
              .content{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 30px!important;
                img{
                  margin-bottom: 30px!important;
                }
              }
            }
          }
        }
        .about-line{
          width: 65.5%;
          height: 40px;
          border-top: 1px dashed #214B67;
          border-left: 1px dashed #214B67;
          border-right: 1px dashed #214B67;
          margin-top: 50px!important;
          position: relative;
          .line{
            position: absolute;
            top: -20px;
            left: 50%;
            height: 48px;
            width: 1px;
            border-left: 1px dashed #214B67;
          }
        }
        .icon-wrapper{
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding-left: 270px!important;
          .icon-img{
            width: 50px;
            height: 50px;
            margin-right: 27px!important;
          }
        }
        .title{
          padding-left: 320px!important;
        }
        
      }
      .about-desc-wrapper{
        width: 90%;
        margin: 0 auto!important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.053rem;
        .about-desc{
        .name{
          display: inline-block;
          width: 3.33rem;
          height: 0.32rem;
          line-height: 0.32rem;
          text-align: center;
          background: url('../../assets/item-bg.png') no-repeat;
          background-size: 100% 100%;
          font-size: 0.12rem;
        }
        .detail{
          display: flex;
          flex-direction: column;
          margin-left: 350px;
          padding: 60px 20px!important;
          border-left: 1px dashed #214B67;
          color: #96E9FF;
          font-size: 0.12rem;
          span{
            line-height: 30px;
          }
        }
      }
      .about-line{
        width: 92%;
        height: 1px;
        margin-left: -145px;
        border: 1px dashed #214B67;
      }
      .about-per-line{
        width: 60%;
        height: 1px;
        border: 1px dashed #214B67;
      }
      .about-second{
        display: flex;
        flex-direction: row;
        width: 90%;
        margin: 70px auto 0px!important;
        justify-content: space-around;
        .title-top{
          position: relative;
          .name{
            display: inline-block;
            width: 2.13rem;
            height: 0.32rem;
            line-height: 0.32rem;
            text-align: center;
            background: url('../../assets/item-bg.png') no-repeat;
            background-size: 100% 100%;
            margin-top: 130px!important;
            font-size: 0.12rem;
          }
          .name:hover{
            cursor: pointer;
          }
          .isActive{
            background: url('../../assets/item-bg-active.png') no-repeat;
            background-size: 100% 100%;
            position: relative;
          }
          .isActive::before{
            position: absolute;
            content: '';
            left: 50%;
            bottom: -30px;
            height: 30px;
            width: 1px;
            border: 1px dashed #214B67;
          }
          .top-detail{
            position: absolute;
            top: -70px;
            left: 35%;
            width: 400px;
            display: flex;
            flex-direction: column;
            padding: 60px 10px!important;
            border-left: 1px dashed #214B67;
            color: #96E9FF;
            font-size: 0.11rem;
          }
          .top-pg{
            left: 39%;
          }
        }
      }
      .about-show{
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: ceter;
        align-items: center;
        margin-top: 0.9rem;
        .swiper-container{
          width: 100%;
          height: 2.57rem;
          background: url('../../assets/swiper-bg.png') no-repeat;
          background-size: 100% 100%;
          .swiper-slide{
            background: #214B67;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            .slide-wrapper{
              width: 70%;
              height: 1.89rem;
              background: url('../../assets/slide-bg.png') no-repeat;
              background-size: 100% 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .name{
                font-size: 0.12rem;
                font-family: MiSans-Medium, MiSans;
                font-weight: 500;
                color: #2DE2FF;
                line-height: 20px;
                margin-bottom: 19px;
              }
              .about-footer{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 0.09rem;
                .about-worker{
                  font-size: 0.09rem;
                  font-family: MiSans-Medium, MiSans;
                  font-weight: 500;
                  color: #FFE600;
                  line-height: 30px;
                  margin-top: 20px;
                }
                .about-worker:hover{
                  cursor: pointer;
                }
              }
            }
          }
        }
        .about-line{
          width: 85%;
          height: 80px;
          margin: 30px auto 0px!important;
          border-left: none;
          border-right: none;
          border-bottom: none;
        }
        .about-thord{
          width: 100%;
          display: flex;
          flex-direction: row;
          margin: 0 auto!important;
          justify-content: space-between;
          .title-top{
            position: relative;
            .name{
              display: inline-block;
              width: 240px;
              height: 50px;
              line-height: 50px;
              text-align: center;
              background: url('../../assets/item-bg.png') no-repeat;
              background-size: 100% 100%;
              position: relative;
            }
            .name:hover{
              cursor: pointer;
            }
            .name::before {
              content: '';
              position: absolute;
              top: -80px;
              left: 50%;
              width: 1px;
              height: 80px;
              border: 1px dashed #214B67;
            }
            .isActive{
              background: url('../../assets/item-bg-active.png') no-repeat;
              background-size: 100% 100%;
            }
            .top-detail{
              position: absolute;
              top: -70px;
              left: 50%;
              width: 300px;
              display: flex;
              flex-direction: column;
              padding: 20px 10px!important;
              border-left: 1px dashed #214B67;
            }
            .about-footer{
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-top: 20px;
              padding-left: 20px;
              color: #96E9FF;
              .about-worker{
                color: #45a5e6;
                margin-left: 10px;
                margin-top: 10px;
              }
              .about-worker:hover{
                cursor: pointer;
              }
            }
          }
        }
      }
    
  }
    }
    .about-right{
      margin-left: 0.23rem;
      .right-top {
        display: flex;
        flex-direction: row;
        .right-top-left{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .right-top-left-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
        }
        .right-top-right{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 0.12rem;
          .right-top-right-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
        }
      }
      .right-center{
        display: flex;
        flex-direction: row;
        margin-top: 0.155rem;
        .right-center-left{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .right-center-left-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
        }
        .right-center-right{
          width: 2.47rem;
          height: 2.5rem;
          padding-left: 0.0044rem;
          padding-left: 0.0044rem;
          padding-top: 0.076rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 0.12rem;
          .right-center-right-title{
            width: 2.25rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
              width: 22px;
              height: 16px;
              vertical-align: middle;
              margin-left: 0.095rem;
            }
          }
        }
      }
      .right-down {
          position: relative;
          width: 5.05rem;
          height: 2.35rem;
          background: radial-gradient(circle, rgba(4,27,54,0.5) 0%, rgba(41,118,210,0.5) 100%);
          border-radius: 6px;
          margin-top: 0.176rem;
          padding-top: 0.076rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          .right-down-title{
            width: 4.75rem;
            height: 0.28rem;
            font-size: 0.11rem;
            background: url('../../assets/title-bg-icon.png') no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            img{
                width: 22px;
                height: 16px;
                vertical-align: middle;
                margin-left: 0.095rem;
              }
          }
          .right-down-lengend{
            position: absolute;
            top: 65px;
            left: 10%;
            width: 80%;
            height: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 0.1rem;
            .lengend-wrapper{
              display: flex;
              flex-direction: row;
              align-items: center;
              .contractColor {
                display: inline-block;
                width: 30px;
                height: 10px;
                background: linear-gradient(270deg, #64F6E0 0%, #055558 100%);
                border-radius: 4px;
                margin-right: 10px;
              }
            }
            .lengend-wrapper{
              display: flex;
              flex-direction: row;
              align-items: center;
              .subColor {
                display: inline-block;
                width: 30px;
                height: 10px;
                background: linear-gradient(270deg, #5DDFFE 0%, #19337F 100%);
                border-radius: 4px;
                margin-right: 10px;
              }
            }
            
          }
        }
    }
  }
}
@media (max-width: 1920px) {
  .about-container{
    .about-content{
      .about-left{
        .left-center{
          .left-center-left{
            .left-center-salary-wrapper{
              .salary-entrance{
                .progress-wrpper{
                  margin-top: 0.1rem;
                  margin-bottom: 0.1rem;
                }
              }
            }
          }
        }
        .left-down{
          position: relative;
          .left-down-lengend{
            position: absolute;
            top: 25px!important;
          }
        }
      }
      .about-right{
        .right-down{
          position: relative;
          .right-down-lengend{
            position: absolute;
            top: 25px!important;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.left-modal{
  color: hsl(0, 0%, 100%)!important;
  .ant-modal{
    margin: 0 auto!important;
    .ant-modal-content{
      width: 1400px;
      margin-left: -300px!important;
      background: url('../../assets/modal-bg.png') no-repeat;
      background-size: 100% 100%;
      .ant-modal-body{
        padding-right: 20px!important;
        .table-wrapper{
          width: 100%;
          color: #ffffff!important;
          .title{
            width: 100%;
            height: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
          }
          .content{
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
          }
          .modal-footer{
            width: 100%;
            height: 50px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            span{
              display: inline-block;
              margin: 0px 10px!important;
            }
            span:hover{
              cursor: pointer;
            }
          }
        }
        .is-real-name{
          border: 1px solid #83E34D;
          padding: 3px 5px;
          color: #83E34D;
        }
      }
    }
  }
  .ant-table .ant-table-content{
    color: #FFF!important;
  }
  .ant-table .ant-table-content .ant-table-body .ant-table-thead > tr > th{
    background: transparent!important;
    border-bottom: none!important;
    color: #FFFFFF;
    font-size: 28px!important;
  }
  .ant-table-tbody > tr > td{
    border-bottom: none!important;
    font-size: 28px!important;
  }
  .ant-table-tbody{
    > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-row-hover,.ant-table-row-hover>td{
      background: none !important;
    }
  }
  .ant-table-placeholder{
    background: transparent!important;
    border-top: none!important;
    border-bottom: none!important;
    .ant-empty .ant-empty-description{
      color: #ffffff!important;
    }
  }
  .ant-pagination-total-text{
    color: #FFFFFF!important;
    font-size: 28px!important;
  }
  .ant-pagination-options-quick-jumper{
    color: #ffffff!important;
    font-size: 28px!important;
  }
}
.about-left{
    .left-center{
      .left-center-left{
        .left-center-salary-wrapper{
          .salary-entrance{
            .progress-wrpper{
              .ant-progress .ant-progress-text{
                color: #FFFFFF!important;
              }
            }
          }
        }
      }
    }
  }
.about-content{
  .ant-progress-inner{
    width: 100%;
    height: 30px;
    border-radius: 4px;
    background: #F5F5F5!important;
    .ant-progress-bg{
      width: 100%;
      height: 30px!important;
      border-radius: 4px!important;
    }
  }
  .ant-progress-text{
    color: #FFFFFF!important;
  }
  .ant-table{
    margin-left: 30px;
    height: 2rem!important;
  }
  .ant-table .ant-table-content{
    height: 100%!important;
  }
  .ant-table .ant-table-content .ant-table-body .ant-table-thead > tr > th{
    background: transparent!important;
    color: #FFFFFF!important;
    border-bottom: none!important;
    padding: 0!important;
    font-size: 0.11rem!important;
  }
  .ant-table-thead{
    font-size: 12px;
    transform: scale(0.8)!important;
    background: transparent!important;
    width: 100%!important;
  }
  .ant-table-tbody{
    width: 2.2rem;
    font-size: 12px;
    transform: scale(0.6)!important;
    color: #FFFFFF!important;
    padding: 0!important;
    margin: 0!important;
  }
  .ant-table-tbody{
    > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-row-hover,.ant-table-row-hover>td{
      background: none !important;
      padding: 0!important;
    }
  }
  .ant-table-tbody > tr > td{
    border-bottom: none!important;
    padding: 0!important;
  }
  .ant-table-placeholder{
    width: 2.2rem;
    height: 2.6rem;
    margin-left: 50px;
    background: transparent!important;
    border-top: none!important;
    border-bottom: none!important;
  }
  .ant-table-placeholder{
    font-size: 12px;
    transform: scale(0.6);
    color: #FFFFFF;
  }
}
.ant-tooltip-inner{
    width: 1.8rem!important;
    height: 0.2rem!important;
    font-size: 0.11rem!important;
    margin-bottom: 0.13rem!important;
    text-align: center!important;
  }
</style>
