<template>
  <div class="about-container">
    <div class="about-title">
      <div class="about-logo" @click="handleLogoClick"></div>
      <div class="about-name-icon"></div>
      <div class="about-user">您好，朱云鹏</div>
    </div>
    <!-- <div class="about-options">
      <div class="options-row">
        <div class="item">中电建建筑集团二标段</div>
        <div class="item">中电建建筑集团四标段</div>
        <div class="item">水电四局三标段</div>
        <div class="item">水电五局四标段</div>
        <div class="item emprty"></div>
      </div>
      <div class="options-row second">
        <div class="item">水电七局一标段</div>
        <div class="item">水电七局三标段</div>
        <div class="item">水电八局三标段</div>
        <div class="item">水电八局四标段</div>
        <div class="item active">水电九局四标段</div>
      </div>
    </div> -->
    <div class="about-content">
        <div class="about-month">
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
                <!-- <div class="item" @click="handleClick(6)">六月及以前</div>
                <div class="item active" @click="handleClick(7)">七月</div>
                <div class="item" @click="handleClick(8)">八月</div> -->
                <!-- <div class="item">九月</div> -->
            </div>
            <!-- <div class="about-month-options month-second">
                <div class="item">十月</div>
                <div class="item">十一月</div>
                <div class="item">十二月</div>
            </div> -->
        </div>
        <!-- <div class="about-diagram">
          <div class="about-detail">
            <span class="detail-line"></span>
            <span>2022年7月20日 15:27</span>
            <span>工程款： 34,929,837.23 元</span>
            <span>工资款： 17,929,837.23 元</span>
          </div>
          <div class="about-line">
            <div class="line"></div>
          </div>
          <div class="about-subsidiary">
            <div class="sub-wrapper">
              <div class="detail">
                <div class="content">
                  <span>北京华天幕墙工程有限公司</span>
                </div>
                <span class="item">2022年7月20日 16:32</span>
                <span class="item">工程款： 17,410,335.48 元</span>
                <span class="item">工资款： 104,080.00 元<span class="item-desc" @click="handleLeftClick">详情</span></span>
              </div>
              <div class="detail">
                <div class="content">
                  <span>保定弘皓门业制造有限公司</span>
                </div>
                <span class="item">2022年7月20日 16:41</span>
                <span class="item">工程款： 1,186,816.30 元</span>
              </div>
              <div class="detail">
                <div class="content">
                  <span>珠海兴业绿色建筑科技有限公司</span>
                </div>
                <span class="item">2022年7月20日 16:46</span>
                <span class="item">工程款： 16,332,685.45 元</span>
                <span class="item">工资款： 68,160.00 元<span class="item-desc" @click="handleRightClick">详情</span></span>
              </div>
            </div>
          </div>
        </div> -->
        <!-- <div class="about-desc-wrapper" v-if="isDateIndex == 0">
          <div class="about-desc">
            <span class="name">中电建河北雄安智汇城建设发展有限公司</span>
            <div class="detail">
              <span>2022年7月20日 15:27</span>
              <span>工程款： 34,929,837.23 元</span>
              <span>工资款： 17,929,837.23 元</span>
            </div>
          </div>
          <div class="about-per-line"></div>
          <div class="about-second about-per-wrapper">
            <div v-for="(item, index) of monthCacheData" :key="index" class="title-top">
              <span class="name">{{ item.companyName }}</span>
              <div class="top-detail" :class="[index == 1 ? 'top-pg' : '']">
                <span>{{ item.date }}</span>
                <span>工程款：{{ item.amount }}元</span>
                <span v-if="item.settleAmount">工资款：{{ item.settleAmount }}元</span>
              </div>
            </div>
          </div>
        </div> -->
        <div class="about-desc-wrapper">
          <div class="about-desc">
            <span class="name">{{ unitData.companyName }}</span>
            <div class="detail">
              <span>签订合同总额：{{ unitData.contractAmount }}万元</span>
              <span>累计结算金额：{{ unitData.settlAmount }}万元</span>
              <span>累计支付金额：{{ unitData.paymentAmount }}万元</span>
            </div>
          </div>
          <div class="about-line"></div>
          <div class="about-second">
            <div v-for="(item, index) of unitData.children" :key="index" class="title-top">
              <span class="name" :class="[isActive == index  ? 'isActive' : '']" @click="handleActiveClick(index, item)">{{ item.companyName }}</span>
              <div class="top-detail">
                <span>合同总额：{{ item.contractAmount }}万元</span>
                <span>累计结算金额：{{ item.settlAmount }}万元</span>
                <span>累计支付金额：{{ item.paymentAmount }}万元</span>
              </div>
            </div>
          </div>
          <div class="about-show" v-if="subData.length > 0">
          <!-- <div class="about-line"></div>
          <div class="about-thord">
            <div v-for="(item, index) of subData" :key="index" class="title-top">
              <span class="name">{{ item.companyName }}</span>
              <div class="about-footer">
                <span>合同总额：{{ item.contractAmount }}万元</span>
                <span>累计结算金额：{{ item.settlAmount }}万元</span>
                <span>累计支付金额：{{ item.paymentAmount }}万元</span>
                <span v-if="item.flag" @click="handleLeftClick" class="about-worker">农民工工资支付详情</span>
              </div>
            </div>
          </div> -->
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) of subData" :key="index">
              <div class="slide-wrapper">
                <span class="name">{{ item.companyName }}</span>
                <div class="about-footer">
                  <span>合同总额：{{ item.contractAmount }}万元</span>
                  <span>累计结算金额：{{ item.settlAmount }}万元</span>
                  <span>累计支付金额：{{ item.paymentAmount }}万元</span>
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
    <a-modal v-model="isLeftVisible" class="left-modal" :closable="false" :footer="false" @cancel="handleCancelClick">
      <!-- <div class="table-wrapper">
        <div class="title">
          <span style="width: 10%; text-align:center;">序号</span>
          <span style="width: 20%; text-align:center;">户名</span>
          <span style="width: 40%;  text-align:center;">账号</span>
          <span style="width: 10%;  text-align:center;">金额（元）</span>
          <span style="width: 10%;  text-align:center;">支付结果</span>
        </div>
        <div class="content" v-for="item of loadData" :key="item.index">
            <span style="width: 10%;  text-align:center;">{{ item.index }}</span>
            <span style="width: 20%;  text-align:center;">{{ item.name }}</span>
            <span style="width: 40%;  text-align:center;">{{ item.account }}</span>
            <span style="width: 10%;  text-align:center;">{{ item.amount }}</span>
            <span style="width: 10%;  text-align:center;">{{ item.result }}</span>
        </div>
        <div class="modal-footer">
          <span @click="handlePrevClick"><a-icon type="left" /></span>
          <span @click="handleOneClick">1</span>
          <span @click="handleTwoClick">2</span>
          <span @click="handleNextClick"><a-icon type="right" /></span>
        </div>
      </div> -->
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
        <template slot="result">
          <span>支付成功</span>
        </template>
        <template slot="isRealName">
          <span class="is-real-name">已实名</span>
        </template>
      </a-table>
    </a-modal>
    <!-- <a-modal v-model="isRightVisible" class="left-modal" :closable="false" :footer="false">
      <div class="table-wrapper">
        <div class="title">
          <span style="width: 10%; text-align:center;">序号</span>
          <span style="width: 20%; text-align:center;">户名</span>
          <span style="width: 40%;  text-align:center;">账号</span>
          <span style="width: 10%;  text-align:center;">金额（元）</span>
          <span style="width: 10%;  text-align:center;">支付结果</span>
        </div>
        <div class="content" v-for="item of zhData" :key="item.index">
            <span style="width: 10%;  text-align:center;">{{ item.index }}</span>
            <span style="width: 20%;  text-align:center;">{{ item.name }}</span>
            <span style="width: 40%;  text-align:center;">{{ item.account }}</span>
            <span style="width: 10%;  text-align:center;">{{ item.amount }}</span>
            <span style="width: 10%;  text-align:center;">{{ item.result }}</span>
        </div>
        <div class="modal-footer">
          <span>1</span>
        </div>
      </div>
    </a-modal> -->
  </div>
</template>

<script>
import { getUnitData, getSubData, getUnitMonthData, getSubMonthData, getWageMonthData } from '@/api/screenDetail'
import { companyJuneWage1, companyJuneWage2 } from '@/utils/mock'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

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
    width: '20%'
  },
  {
    title: '金额（元）',
    dataIndex: 'amount',
    key: 'amount',
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
export default {
  name: "About",
  components: { swiper, swiperSlide },
  data () {
    this.columns = columns
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
        }
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
      cacheUnitName: ''
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    this.handleClick(this.isDateIndex, 0)
    this.loadData = companyJuneWage1
    this.userName = window.localStorage.getItem('userName').replace(/\"/g, '')
  },
  watch: {
    count(newVal) {
      if(newVal == 1) {
        this.loadData = companyJuneWage1
      } else if(newVal == 2) {
        this.loadData = companyJuneWage2
      }
    }
  },
  methods: {
    getUnitInfo() {
      getUnitData().then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          const data = res.data
          this.unitData = res.data
        }
      })
    },
    getUnitMonthInfo() {
      getUnitMonthData(this.month).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.unitData = res.data
        }
      })
    },
    handleClick(num, index) {
      // this.isShow = !this.isShow
      this.subData = []
      this.isShow = true
      this.month = num
      this.isDateIndex = index
      console.log(this.isDateIndex)
      if(index == 0) {
        this.getUnitInfo()
      } else if(index == 1) {
        this.getUnitMonthInfo()
      } else if(index == 2) {
        this.getUnitMonthInfo()
      }
      this.isActive = null
    },
    handleOtherClick() {
      this.isShow = false
    },
    handleLeftClick(item) {
      this.isLeftVisible = true
      this.cacheCompanyName = item.companyName
      console.log(this.isDateIndex)
      let reqObj = {
        companyName: this.cacheCompanyName,
        unitName: this.cacheUnitName,
        date: this.isDateIndex == 0 ? '2022-06-01' : this.isDateIndex == 1 ? '2022-07-01' : '2022-08-01',
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getWageMonthData(reqObj).then(res => {
        console.log(112)
        console.log(this.isDateIndex)
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
      console.log(this.isDateIndex)
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
    }
  }
};
</script>
<style lang="less" scoped>
.about-container{
  width: 100%;
  height: 100vh;
  background: url('../../assets/bg-img.png') no-repeat;
  background-size: 100% 100%;
  .about-title{
    position: relative;
    width: 100%;
    height: 123px;
    background: url('../../assets/home-title.png') no-repeat;
    background-size: 100% 100%;
    .about-logo{
      width: 50px;
      height: 50px;
      position: absolute;
      top: 32px;
      left: 20px;
      background: transparent;
    }
    .about-logo:hover{
      cursor: pointer;
    }
    .about-name-icon{
      position: absolute;
      left: 5%;
      top: 35%;
      width: 337px;
      height: 31px;
      background: url('../../assets/zdj-name-icon.png') no-repeat;
      background-size: 100% 100%;
    }
    .about-user{
      width: 6%;
      height: 50px;
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
  .about-options{
    width: 90%;
    height: 188px;
    margin: 0 auto!important;
    border-bottom: 2px dashed #214B67;
    display: flex;
    flex-direction: column;
    .options-row{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding-top: 29px!important;
      .item{
        width: 227px;
        height: 40px;
        margin: 0px 40px!important;
        font-size: 16px;
        font-family: MiSans;
        font-weight: 500;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/item-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      .item:hover{
        cursor: pointer;
      }
      .active{
        background: url('../../assets/item-bg-active.png') no-repeat;
        background-size: 100% 100%;
      }
      .emprty{
        background: none;
      }
      .empaty:hover{
        background: none;
      }
    }
    .second{
      margin-top: 10px!important;
    }
  }
  .about-content{
      position: relative;
      padding-top: 32px!important;
      width: 90%;
      margin: 0 auto !important;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .about-month{
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 0;
          top: 40px;
          .about-month-options{
              display: flex;
              flex-direction: row;
              margin-left: 60px!important;
              .item{
                width: 77px;
                height: 40px;
                margin-right: 8px !important;
                background: url('../../assets/month-bg.png') no-repeat;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: center;
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
        .about-desc{
        .name{
          display: inline-block;
          width: 300px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: url('../../assets/item-bg.png') no-repeat;
          background-size: 100% 100%;
        }
        .detail{
          display: flex;
          flex-direction: column;
          margin-left: 150px;
          padding: 20px 10px!important;
          border-left: 1px dashed #214B67;
          color: #96E9FF;
          span{
            line-height: 30px;
          }
        }
      }
      .about-line{
        width: 75%;
        height: 1px;
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
            width: 230px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: url('../../assets/item-bg.png') no-repeat;
            background-size: 100% 100%;
            margin-top: 30px!important;
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
            left: 50%;
            width: 300px;
            display: flex;
            flex-direction: column;
            padding: 20px 10px!important;
            border-left: 1px dashed #214B67;
            color: #96E9FF;
          }
          .top-pg{
            left: 39%;
          }
        }
      }
      .about-show{
        width: 90%;
        height: 300px;
        display: flex;
        justify-content: ceter;
        align-items: center;
        .swiper-container{
          width: 100%;
          height: 240px;
          background: url('../../assets/swiper-bg.png') no-repeat;
          background-size: 100% 100%;
          .swiper-slide{
            background: #214B67;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            .slide-wrapper{
              width: 80%;
              height: 200px;
              background: url('../../assets/slide-bg.png') no-repeat;
              background-size: 100% 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .name{
                font-size: 16px;
                font-family: MiSans-Medium, MiSans;
                font-weight: 500;
                color: #2DE2FF;
                line-height: 30px;
                margin-bottom: 19px;
              }
              .about-footer{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .about-worker{
                  font-size: 12px;
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
}
</style>
<style lang="less">
.left-modal{
  color: #ffffff!important;
  .ant-modal{
    margin: 0 auto!important;
    .ant-modal-content{
      width: 800px;
      margin-left: -100px!important;
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
  }
  .ant-table-tbody > tr > td{
    border-bottom: none!important;
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
  }
  .ant-pagination-options-quick-jumper{
    color: #ffffff!important;
  }
}
</style>
