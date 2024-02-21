<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="任务名称">
                <a-input v-model="queryParam.taskName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="支付状态">
                <a-select v-model="queryParam.status" placeholder="请选择" >
                  <a-select-option :key="0" :value="0">
                    待支付
                  </a-select-option>
                  <a-select-option :key="1" :value="1">
                    支付成功
                  </a-select-option>
                  <a-select-option :key="2" :value="2">
                    支付失败
                  </a-select-option>
                  <a-select-option :key="3" :value="3">
                    部分成功
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="收款账户户名">
                    <a-input v-model="queryParam.accNoName" placeholder="请输入"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
        <!-- <a-button type="primary" icon="plus" size="small" class="add" @click="handleAddClick">新建</a-button> -->
      </div>

      <a-table
        :rowKey="((record, index) => {return index})"
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
        :scroll="{ x: 1200, y: 600 }"
        :loading="loading"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <template slot="paymentType" slot-scope="text, record">
          <span>{{ record.paymentType == '1' ? '对公' : '对私'}}</span>
        </template>
        <template slot="receiverName" slot-scope="text, record">
          <span>{{record.paymentType == '1' ? text : '-'}}</span>
        </template>
         <template slot="receiverAccount" slot-scope="text, record">
          <span>{{record.paymentType == '1' ? text : '-'}}</span>
        </template>
         <template slot="receiverBank" slot-scope="text, record">
          <span>{{record.paymentType == '1' ? text : '-'}}</span>
        </template>
        <template slot="status" slot-scope="text, record">
          <span v-if="record.paymentStatus == 0">待支付</span>
          <span v-if="record.paymentStatus == 1">支付成功</span>
          <span v-if="record.paymentStatus == 2">支付失败</span>
          <span v-if="record.paymentStatus == 3">部分成功</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <a-button v-if="scope.paymentType == '2'" type="link" @click="handleReviewClick(scope)">查看</a-button>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model="isDetailVisible" class="addModal" title="详情" :footer="null" width="80%">
      <div class="search-detail">
        <a-select v-model="detailStatus" class="status-select" placeholder="请选择" width='300px'>
          <a-select-option :key="''" :value="''">
            全部
          </a-select-option>
          <a-select-option :key="0" :value="0">
            待支付
          </a-select-option>
          <a-select-option :key="1" :value="1">
            支付成功
          </a-select-option>
          <a-select-option :key="2" :value="2">
            支付失败
          </a-select-option>
        </a-select>
         <a-button type="primary" @click="searchDetail">查询</a-button>
         <a-button type="primary" style="margin-left: 20px"  @click="$newExportsExcel(`${fileUrl}/payment/detail/info/list/file
?taskName=${taskName}&status=${detailStatus}`,'导出文件', false)">导出</a-button>
      </div>
        <a-table
        :rowKey="((record, index) => {return index})"
        :columns="detailColumns"
        :data-source="detailData"
        :pagination="settlePagination"
        :scroll="{ x: 1200, y: 600 }"
      >
       <template slot="paymentStatus" slot-scope="text, record">
          <span v-if="record.paymentStatus == 0">待支付</span>
          <span v-if="record.paymentStatus == 1">支付成功</span>
          <span v-if="record.paymentStatus == 2">支付失败</span>
          <span v-if="record.paymentStatus == 3">部分成功</span>
        </template>
      </a-table>
        <div class="footer-wrapper">
          <a-button type="primary" @click="handleDetailSubmitClick">确定</a-button>
        </div>
    </a-modal>

  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { 
  getPayCollectionList, 
  getPaymentScene, 
  getContractName, 
  getTaskName,
  getReceive,
  addCollection,
  getCollentDetail,
  updateServer
} from '@/api/payment'
// import { STable, Ellipsis } from '@/components'
// import { getQuotaList } from '@/api/level1'
// import { dataSourceBank } from '@/utils/util'
import { fileUrl } from '@/utils/request'
import { getSettleList, getSearchPayList, getSearchPayDetailList } from '@/api/payment'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    width: '80px'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
    width: '400px'
  },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: '300px'
  },
  {
    title: '付款类型',
    dataIndex: 'paymentType',
    key: 'paymentType',
    width: '400px',
    scopedSlots: { customRender: 'paymentType' },
  },
  {
    title: '付款账户名称',
    dataIndex: 'payeeName',
    key: 'payeeName',
    width: '300px'
  },
  {
    title: '付款账号',
    dataIndex: 'payeeAccount',
    key: 'payeeAccount',
    width: '300px'
  },
  {
    title: '付款账号开户行',
    dataIndex: 'payeeBank',
    key: 'payeeBank',
    width: '300px'
  },
  {
    title: '收款户名',
    dataIndex: 'receiverName',
    key: 'receiverName',
    width: '300px',
    scopedSlots: { customRender: 'receiverName' },
  },
  {
    title: '收款账号',
    dataIndex: 'receiverAccount',
    key: 'receiverAccount',
    width: '300px',
    scopedSlots: { customRender: 'receiverAccount' },
  },
  {
    title: '收款账号开户行',
    dataIndex: 'receiverBank',
    key: 'receiverBank',
    width: '300px',
    scopedSlots: { customRender: 'receiverBank' },
  },
  {
    title: '付款金额（元）',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
    width: '200px'
  },
  {
    title: '付款状态',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
    width: '120px',
    scopedSlots: { customRender: 'status' },
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '120px',
    fixed: 'right',
    align: 'center'
  },
]

const detailColumns = [
  {
        title: '付款户名',
        dataIndex: 'payeeName',
        key: 'payeeName',
        width: '100px'
    },
    {
        title: '付款账号',
        dataIndex: 'payeeAccount',
        key: 'payeeAccount',
        width: '100px'
    },
    {
        title: '付款账号开户行',
        dataIndex: 'payeeBank',
        key: 'payeeBank',
        width: '100px'
    },
    {
        title: '收款户名',
        dataIndex: 'receiverName',
        key: 'receiverName',
        width: '100px'
    },
    {
        title: '收款账号',
        dataIndex: 'receiverAccount',
        key: 'receiverAccount',
        width: '100px'
    },
    {
        title: '收款账号开户行',
        dataIndex: 'receiverBank',
        key: 'receiverBank',
        width: '100px'
    },
    {
        title: '付款金额',
        dataIndex: 'paymentAmount',
        key: 'paymentAmount',
        width: '100px'
    },
    {
        title: '付款状态',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        scopedSlots: { customRender: 'paymentStatus' },
        width: '100px'
    },
    {
        title: '失败原因',
        dataIndex: 'errorReason',
        key: 'errorReason',
        width: '100px'
    },
]

export default {
  name: 'TableList',
//   components: {
//     STable,
//     Ellipsis
//   },
  data () {
    this.columns = columns
    this.detailColumns = detailColumns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        taskName: '',
        status: undefined,
        accNoName: ''
      },
      loadData: [],
      detailData: [],
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
      isAddVisible: false,
      paymentSceneSelect: [],
      contractNameSelect: [],
      contractObj: {},
      addContractObj: {},
      paymentFlag: null,
      payChannel: false,
      isDetailVisible: false,
      detailObj: {},
      isAddBtnShow: null,
      fileUrl,
      cacheValue: '',
      isSettleVisible: false,
      searchParam: {
        batchName: '',
        companyName: ''
      },
      settleData: [],
      settlePagination: {
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
          this.handleSettlePageChange(page, pageSize)
        },
        onShowSizeChange: (current, size) => {
          this.handleSettleShowSizeChange(current, size)
        },
      },
      settleLoading: false,
      selectedRowKeys: [],
      selectionRows: [],
      isSettleSelect: false,
      cacheSettle: '',
      cacheDetailObj: {},
      cacheContractNumber: '',
      taskName: "",
      detailStatus: ''
    }
  },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let resObj = {
        taskName: this.queryParam.taskName,
        status: this.queryParam.status ? Number(this.queryParam.status) : undefined,
        accNoName: this.queryParam.accNoName,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        projectIDLv3: localStorage.getItem('projectIDLv3')
      }
      getSearchPayList(resObj).then(res => {
        if(res.data.status == 1 && res.data.data) {
          this.loading = false
          console.log(res.data)
          const data = res.data.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
      })
    },
    getPaymentSceneList() {
      getPaymentScene().then(res => {
        this.paymentSceneSelect = res
      })
    },
    getContractNameList() {
      let params = {
          projectIDLv3: localStorage.getItem('projectIDLv3')
      }
      getContractName(params).then(res => {
        this.contractNameSelect = res
      })
    },
    getSettleInfo(taskName) {
      let reqObj = {
          taskName: taskName,
          pageNum: this.settlePagination.current,
          pageSize: this.settlePagination.pageSize,
          status: this.detailStatus
      }
      getSearchPayDetailList(reqObj).then(res => {
        if(res.data.status == 1 && res.data.data) {
          this.settleLoading = false
          const data = res.data.data
          this.detailData = data.pageList
          this.settlePagination.total = data.rowCount
        }
      })
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
    handleAddClick() {
      this.isAddVisible = true
      this.isSettleSelect = false
      this.cacheSettle = ''
      this.selectionRows = []
      this.selectedRowKeys = []
      this.cacheContractNumber = ''
    },
    handleStartDateChange(date, dateString) {
      console.log(date, dateString)
    },
    handleEndDateChange(date, dateString) {
      console.log(date, dateString)
    },
    
    handleReviewClick(row) {
      this.isDetailVisible = true
      this.taskName = row.taskName
      this.getSettleInfo(row.taskName)
    },
    searchDetail() {
      this.getSettleInfo(this.taskName)
    },
    
    handlePaymentMethodChange(value) {

    },
   
    handleDateChange() {

    },
    handleDetailSubmitClick() {
      this.isDetailVisible = false
    },
    handlePayChannelChange(e) {
      console.log(e.target.checked)
      if(e.target.checked) {
        this.paymentFlag = 1
      } else {
        this.paymentFlag = 0
      }
    },
    
    handleSettleClick() {
      this.isSettleVisible = true
    },
    handleSettleSearchClick() {
      this.getSettleInfo(this.taskName)
    },
    handleSettlePageChange(page, pageSize) {
      console.log(page, pageSize)
      this.settlePagination.current = page
      this.getSettleInfo(this.taskName)
    },
    handleSettleShowSizeChange(current, size) {
      console.log(current, size)
      this.settlePagination.pageSize = size
      this.getSettleInfo()
    },
    handleClickRow(record) {
      return {
        on: {
          click: () => {
            let keys = []
            keys.push(record.id)
            this.selectionRows.push(record)
            this.selectedRowKeys = keys
          }
        }
      }
    },  
    handleSelectionChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    handleSettleSubmitClick() {
      this.isSettleVisible = false
      this.isSettleSelect = true
      console.log(this.selectionRows)
      this.cacheSettle = this.selectionRows[0].batchName + '(' + this.selectionRows[0].companyName + ')' 
    },
    setPaymentSceneSelect(value) {
      let newName = ''
      this.paymentSceneSelect && this.paymentSceneSelect.map(res => {
        if(value == res.value) {
          newName = res.name
        }
      })
      return newName
    }
  }
}
</script>
<style lang="less">
.table-page-search-wrapper{
    .add{
        height: 32px;
        width: 80px;
        margin-bottom: 20px;
    }
    .ant-form-inline .ant-form-item > .ant-form-item-label{
        width: 120px;
    }
}
.addModal{
  .ant-modal-content{
    .ant-radio-group{
      width: 400px;
    }
    .investment{
      display: flex;
      flex-direction: row;
      align-items: center;
      span{
        display: inline-block;
        width: 60px;
        margin-left: 10px;
      }
    }
  }
  .modal-title{
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 10px;
      span{
          margin-left: 15px;
          font-size: 16px;
          font-weight: 600;
      }
  }
  .modal-title::before{
      position: absolute;
      content: '';
      width: 6px;
      height: 20px;
      background: #508EDF;
  }
  .upload-wrapper-item{
    display: flex;
    flex-direction: row;
    position: relative;
    .upload-wrapper{
      display: flex;
      flex-direction: row;
        .ant-form-item-label{
          width: 320px!important;
        }
    }
    .upload-server{
      position: absolute;
      right: 125px;
      top: 43px;
      background: #7EBF56;
      color: #FFFFFF;
    }
    .upload-server{
      background: #7EBF56;
      border: 1px solid #7EBF56;
    }
  }
  .modal-row{
    span{
      line-height: 60px;
      margin-left: 10px;
    }
    .upload-span{
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        span{
          line-height: 30px;
        }
        .download{
          color: #508EDF;
          cursor: pointer;
          margin-left: 10px;
        }
      }
  }
  .footer-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
.search-detail {
  width: 100%;
  margin-bottom: 30px;
  .status-select {
    margin-right: 100px;
    width: 120px;
  }
}
</style>