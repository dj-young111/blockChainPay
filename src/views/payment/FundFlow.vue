<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-fund-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="10" :sm="24">
              <a-form-item label="日期选择">
                <a-range-picker @change="onChange" style="width: 300px"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="content-title">{{companyType === 1 ? '业主支付情况': '总包支付情况' }}</div>
      <a-table
        :rowKey="((record, index) => {return index})"
        :columns="columns"
        :data-source="loadData"
        :pagination="false"
        :scroll="{ y: 600 }"
        :loading="loading"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <!-- <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">资金流向查询</a-button>
        </template> -->
      </a-table>
      <div v-if="data.length > 0">
        <div class="content-title" style="margin-top: 60px">总包支付情况</div>
        <div class="project-list">
        <div class="list-item" v-for="(item,index) in data" v-bind:key='index'>
          <div class="title">
            <span>{{item.companyName}}</span>
          </div>
          <div class="msg">签订合同总数：{{item.contractNum}}</div>
          <div class="msg">签订合同总金额（万元）：{{item.contractTotalAmount}}</div>
          <div class="msg">支付总金额（万元）：{{item.contractPayAmount}}</div>
          <div class="msg">合同支付比例：{{item.contractPayRate}}%</div>
          <div class="msg">资金执行比例：{{item.cashExecuteRate}}%</div>
        </div>
      </div>
    </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { getMoneyFlow } from '@/api/payment'

const columns = [
  // {
  //   title: '序号',
  //   scopedSlots: { customRender: 'serial' },
  //   fixed: 'left',
  //   width: 80
  // },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: '16%'
  },
  {
    title: '乙方单位名称',
    dataIndex: 'companyBName',
    key: 'companyBName',
    width: '10%'
  },
  {
    title: '合同类型',
    dataIndex: 'contractType',
    key: 'contractType',
    width: '10%'
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: '25%'
  },
  {
    title: '合同总金额（万元）',
    dataIndex: 'contractTotalAmount',
    key: 'contractTotalAmount',
    width: '8%'
  },
  {
    title: '合同支付金额（万元）',
    dataIndex: 'contractPayAmount',
    key: 'contractPayAmount',
    width: '8%'
  },
  {
    title: '合同支付比例（%）',
    dataIndex: 'contractPayRate',
    key: 'contractPayRate',
    width: '8%'
  },
  // { 
  //   title: '操作', 
  //   key: 'operation', 
  //   scopedSlots: { customRender: 'operation' },
  //   width: '15%'
  // },
]

export default {
  name: 'TableList',
//   components: {
//     STable,
//     Ellipsis
//   },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        // prjName: '',
        // ownerUnitName: '',
        // bidWinnerName: '',
        // generalContractName: ''
      },
      loadData: [],
    //   dataSourceBank: dataSourceBank,
      pagination: {
        current: 1,
        pageSize: 20,
        defaultCurrent: 1,
        defaultPageSize: 20,
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
      loading: false,
      data: [],
      companyType: 0
    }
  },
  mounted () {
    this.getQuotaApplyList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let resObj = {
        beginDate: this.queryParam.beginDate,
        endDate: this.queryParam.endDate,
        projectIDLv3: localStorage.getItem('projectIDLv3'),
        // pageNum: this.pagination.current,
        // pageSize: this.pagination.pageSize
      }
      getMoneyFlow(resObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.cashFlowInfoOwnVOList
          this.data = data.cashFlowInfoDownstreamVOList
          this.pagination.total = data.rowCount
          this.companyType = data.companyType
        }
      })
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.queryParam.beginDate = dateString[0]
      this.queryParam.endDate = dateString[1]
    },
   handleSearchClick() {
     this.getQuotaApplyList()
   }, 
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handlePageChange(page, pageSize) {
      console.log(page, pageSize)
      this.pagination.current = page
      this.getQuotaApplyList()
    },
    handleShowSizeChange(current, size) {
      console.log(current, size)
      this.pagination.pageSize = size
      this.getQuotaApplyList()
    },
    handleStartDateChange(date, dateString) {
      console.log(date, dateString)
    },
    handleEndDateChange(date, dateString) {
      console.log(date, dateString)
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          
        } else {
          return false
        }
      })
    },
    handleCancelClick() {
      this.isAddVisible = false
      this.$refs.ruleForm.resetFields()
    },
    handleReviewClick(row) {
      if(row.prjCode == 'project-004-009') {
        this.$router.push({
          path: '/payment/detail',
          query: {
            prjCode: row.prjCode,
            generalCode: row.generalContractCode,
            info: '9'
          }
        })
      } else {
        this.$router.push({
          path: '/payment/detail',
          query: {
            prjCode: row.prjCode,
            generalCode: row.generalContractCode
          }
        })
      }
      
    },
    handleEditClick(row) {
      this.isAddVisible = true
    },
    handleDateChange() {

    }
  }
}
</script>
<style lang="less" scope>
.content-title {
  font-size: 18px;
  color: #00285F;
  font-weight: 600;
  margin-bottom: 20px;
  margin-left: 10px;
}
 .project-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-top: 100px;
      .list-item {
        position: relative;
        width: 422px;
        height: 256px;
        background: rgba(255,255,255,0.39);
        box-shadow: 0px 3px 6px rgba(150,150,150,0.22);
        opacity: 1;
        border-radius: 15px;
        padding: 37px 38px 29px 44px;
        cursor: pointer;
        margin-bottom: 40px;
        margin-left: 20px;
        margin-right: 20px;
        .title {
          font-size: 20px;
          font-family: MiSans;
          font-weight: 600;
          line-height: 27px;
          color: #3A7FF5;
          margin-bottom: 28px;
          img {
            width: 15px;
            height: 15px;
            margin-right: 10px;
          }
        }
        .msg {
          font-size: 16px;
          font-family: MiSans;
          font-weight: 500;
          line-height: 26px;
          color: #626262;
        }
      }
      
    }
.table-page-fund-wrapper{
    margin-bottom: 20px;
    .ant-form-item {
        margin-bottom: 20px;
        .ant-form-item-label{
            width: 120px;
        }
        .ant-form-item-control{
            width: 200px;
        }
    }
}
</style>