<template>
     <page-header-wrapper>
        <a-card :bordered="false">
            <div class="wage-parameter-wrapper">
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
                    <span slot="payStatus" slot-scope="text, record">
                        {{ record.payStatus ? setPayStatus(record.payStatus) : '' }}
                    </span>
                    <template slot="payDetail" slot-scope="text, record">
                        <a-button type="link" @click="handleReviewClick(record)">查询</a-button>
                    </template>
                </a-table>
            </div>
        </a-card>
        <a-modal v-model="isDetailVisible" class="payDetailModal" title="支付详情" :footer="false">
            <div class="">
                <a-table
                    :rowKey="((record, index) => {return index})"
                    :columns="detailColumns"
                    :data-source="loadDetailData"
                    :pagination="detailPagination"
                >
                    <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                    </span>
                </a-table>
            </div>
        </a-modal>
    </page-header-wrapper>
</template>
<script>
import { getWorkerSalaryList, getWorkerSalaryDetail } from '@/api/worker'
const columns = [
    {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: '350px'
    },
    {
        title: '合同乙方名称',
        dataIndex: 'companyBName',
        key: 'companyBName',
        width: '300px'
    },
    {
        title: '工资月份',
        dataIndex: 'month',
        key: 'month',
        width: '120px'
    },
    {
        title: '总计金额（元）',
        dataIndex: 'totalNum',
        key: 'totalNum',
        width: '200px'
    },
    {
        title: '工资笔数',
        dataIndex: 'totalSalary',
        key: 'totalSalary',
        width: '120px'
    },
    {
        title: '支付时间',
        dataIndex: 'payDate',
        key: 'payDate',
        width: '150px'
    },
    {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        scopedSlots: { customRender: 'payStatus' },
        width: '150px'
    },
    {
        title: '支付详情',
        dataIndex: 'payDetail',
        key: 'payDetail',
        scopedSlots: { customRender: 'payDetail' },
        width: '120px',
        fixed: 'right',
    },
]
const detailColumns = [
    {
        title: '农民工姓名',
        dataIndex: 'accNoName',
        key: 'accNoName',
        width: '15%'
    },
    {
        title: '农民工身份证号',
        dataIndex: 'toOrgNo',
        key: 'toOrgNo',
        width: '15%'
    },
    {
        title: '农民工工资卡号',
        dataIndex: 'accNo',
        key: 'accNo',
        width: '15%'
    },
    {
        title: '工资金额',
        dataIndex: 'amount',
        key: 'amount',
        width: '15%'
    },
    {
        title: '工资开户行',
        dataIndex: 'accBankName',
        key: 'accBankName',
        width: '15%'
    },
    {
        title: '支付状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%'
    }
]
export default {
    data () {
        this.columns = columns
        this.detailColumns = detailColumns
        return {
            loading: false,
            loadData: [],
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
            isDetailVisible: false,
            loadDetailData: [],
            detailPagination: {
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
                    this.handleDetailPageChange(page, pageSize)
                },
                onShowSizeChange: (current, size) => {
                    this.handleDetailShowSizeChange(current, size)
                },
            },
            contractCode: '',
            month: ''
        }
    },
    mounted () {
        this.getWageParameter()
    },
    methods: {
        getWageParameter() {
            this.loading = true
            let reqObj = {
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getWorkerSalaryList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    this.loading = false
                    const data = res.data.pageList
                    this.loadData = data
                }
            })
        },
        handleReviewClick(scope) {
            this.isDetailVisible = true
            this.contractCode = scope.contractCode
            this.month = scope.month
            let reqObj = {
                contractCode: this.contractCode,
                month: this.month,
                pageNum: this.detailPagination.current,
                pageSize: this.detailPagination.pageSize
            }
            getWorkerSalaryDetail(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    const data = res.data.pageList
                    this.loadDetailData = data
                }
            })
        },
        handlePageChange(page, pageSize) {
            this.pagination.current = page
            this.getWageParameter()
        },
        handleShowSizeChange(current, size) {
            this.pagination.pageSize = size
            this.getWageParameter()
        },
        handleDetailPageChange(page, pageSize) {
            this.detailPagination.current = page
            this.handleReviewClick()
        },
        handleDetailShowSizeChange(current, size) {
            this.detailPagination.pageSize = size
            this.handleReviewClick()
        },
        setPayStatus(code) {
            if(!code) return '';
            switch (code) {
                case 1: 
                    return '已完成';
                case 2: 
                    return '部分完成';
                case 3: 
                    return '支付失败';
            }
        }
    }
}
</script>
<style lang="less">
.payDetailModal{
  .ant-modal-content{
    width: 1200px;
    margin-left: -200px;
  }
}
</style>
    
      