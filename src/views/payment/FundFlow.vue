<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-fund-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="项目名称">
                <a-input v-model="queryParam.prjName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="业主单位名称">
                <a-input v-model="queryParam.ownerUnitName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="中标主体名称">
                    <a-input v-model="queryParam.bidWinnerName" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="总承包合同名称">
                  <a-input v-model="queryParam.generalContractName" placeholder="请输入">
                  </a-input>
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
      </div>

      <a-table
        :rowKey="((record, index) => {return index})"
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
        :scroll="{ y: 600 }"
        :loading="loading"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">资金流向查询</a-button>
        </template>
      </a-table>
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
    dataIndex: 'prjName',
    key: 'prjName',
    width: '15%'
  },
  {
    title: '业主单位名称',
    dataIndex: 'ownerUnitName',
    key: 'ownerUnitName',
    width: '20%'
  },
  {
    title: '中标主体名称',
    dataIndex: 'bidWinnerName',
    key: 'bidWinnerName',
    width: '10%'
  },
  {
    title: '总承包合同名称',
    dataIndex: 'generalContractName',
    key: 'generalContractName',
    width: '10%'
  },
  {
    title: '总承包合同金额（万元）',
    dataIndex: 'generalContractAmount',
    key: 'generalContractAmount',
    width: '15%'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '15%'
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
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        prjName: '',
        ownerUnitName: '',
        bidWinnerName: '',
        generalContractName: ''
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
    }
  },
  mounted () {
    this.getQuotaApplyList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let resObj = {
        prjName: this.queryParam.prjName,
        ownerUnitName: this.queryParam.ownerUnitName,
        bidWinnerName: this.queryParam.bidWinnerName,
        generalContractName: this.queryParam.generalContractName,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getMoneyFlow(resObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
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
<style lang="less">
.table-page-fund-wrapper{
    margin-bottom: 20px;
    .ant-form-item {
        margin-bottom: 20px;
        .ant-form-item-label{
            width: 120px;
        }
        .ant-form-item-control{
            width: 300px;
        }
    }
}
</style>