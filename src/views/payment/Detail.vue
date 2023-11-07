<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="detail-header-title">
                <div>
                    <a-month-picker v-model="date"  placeholder="选择月份" />
                </div>
                <a-button  @click="searchDate" style="margin-left: 10px">查询</a-button>
            </div>
            <div class="detail-container">

            
                <div class="detail-wrapper">
                    <a-row :gutter="24">
                        <div class="title">
                            <span>项目信息</span>
                        </div>
                        <a-col :span="8">
                            <span>项目名称：{{ detailObj.prjName }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>业主单位名称：{{ detailObj.ownerUnitName }}</span>
                        </a-col>
                        <a-col :span="8"></a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <div class="title">
                            <span>业主单位支付信息</span>
                        </div>
                        <a-col :span="8">
                            <span>业主累计签订合同金额：{{ detailObj.ownerSignAmount }} 万元</span>
                        </a-col>
                        <a-col :span="8">
                            <span>业主累计支付金额：{{ detailObj.ownerPaymentAmount }} 万元</span>
                        </a-col>
                        <a-col :span="8">
                            <span>业主支付比例：{{ detailObj.ownerPaymentProportion }} %</span>
                        </a-col>
                    </a-row>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :columns="columns"
                        :data-source="loadData"
                        style="margin-top: 20px;"
                    >
                        <template slot="operation" slot-scope="scope">
                            <a-button v-if="scope.payeeName != '总计'" type="link" @click="handleOwnerReviewClick(scope)">详情</a-button>
                        </template>
                    </a-table>
                    <a-row :gutter="24">
                        <div class="title">
                            <span>总包单位支付信息</span>
                            <!-- <span style="margin-left: 20px;">
                                <a-button type="link" v-for="(item, index) of btnList" :key="index" @click="handleLinkClick(item)">
                                    {{ item.month }}
                                </a-button>
                                <a-button type="link" disabled>2022年6月</a-button>
                                <a-button type="link" @click="handleLinkClick" style="margin-left: 20px;" :disabled="info && info == '9' ? false : true">2022年7月</a-button>
                            </span> -->
                        </div>
                        <a-col :span="8">
                            <span>总包累计签订合同金额：{{ detailObj.totalSignAmount }} 万元</span>
                        </a-col>
                        <a-col :span="8">
                            <span>总包累计支付金额：{{ detailObj.totalPaymentAmount }} 万元</span>
                        </a-col>
                        <a-col :span="8">
                            <span>总包支付比例：{{ detailObj.totalPaymentProportion }} %</span>
                        </a-col>
                        <a-col :span="8" style='margin-top: 10px;'>
                            <span>总包支付金额/业主支付金额：{{ detailObj.totalOwnerPaymentProportion }} %</span>
                        </a-col>
                        <!-- <a-col :span="8" style='margin-top: 10px;'>
                            <span>总包支付建设者工资金额：{{ detailObj.totalPaySalary }} 万元</span>
                        </a-col> -->
                        <a-col :span="8" style='margin-top: 10px;'>
                        </a-col>
                    </a-row>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :columns="columns"
                        :data-source="totalLoadData"
                        style="margin-top: 20px;"
                    >
                        <template slot="operation" slot-scope="scope">
                            <a-button v-if="scope.payeeName != '总计'" type="link" @click="handleTotalReviewClick(scope)">详情</a-button>
                        </template>
                    </a-table>
                </div>
                <a-modal v-model="isVisible" class="detail-modal-wrapper" title="详情" :footer="false" >
                    <!-- <a-row :gutter="24" style="margin: 20px 0px;">
                        <a-col :span="12">
                            <span>付款账号：{{ modalObj ? modalObj.payerAcc : '' }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>收款账号：{{ modalObj ? modalObj.payeeAcc : '' }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" style="margin: 20px 0px;">
                        <a-col :span="12">
                            <span>支付金额：{{ modalObj ? modalObj.payAmount : '' }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>支付时间：{{ modalObj ? modalObj.payDate : '' }}</span>
                        </a-col>
                    </a-row> -->
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :columns="modalColumns"
                        :data-source="modalData"
                        style="margin-top: 20px;"
                        :pagination="pagination"
                    >
                    </a-table>
                </a-modal>
            </div>
        </a-card>
    </page-header-wrapper>
</template>
<script>
import moment from 'moment';
import { getMoneyFlowDetail, getPayDetailDesc, getMoneyflowDetailNew, getPayDetailDescNew } from '@/api/payment'
const columns = [
    {
        title: '收款方名称',
        dataIndex: 'payeeName',
        key: 'payeeName',
        width: '15%'
    },
    {
        title: '所关联合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: '15%'
    },
    {
        title: '所关联合同类型',
        dataIndex: 'contractTypeName',
        key: 'contractTypeName',
        width: '15%'
    },
    {
        title: '合同金额（万元）',
        dataIndex: 'contractAmount',
        key: 'contractAmount',
        width: '15%'
    },
    {
        title: '合同已支付金额（万元）',
        dataIndex: 'contractPaidAmount',
        key: 'contractPaidAmount',
        width: '15%'
    },
    {
        title: '合同已结算金额（万元）',
        dataIndex: 'contractSettlAmount',
        key: 'contractSettlAmount',
        width: '15%'
    },
    { 
        title: '操作', 
        key: 'operation', 
        scopedSlots: { customRender: 'operation' },
        width: '10%'
    },
]

const modalColumns = [
    {
        title: '付款账号',
        dataIndex: 'payerAcc',
        key: 'payerAcc',
        width: '20%'
    },
    {
        title: '收款账号',
        dataIndex: 'payeeAcc',
        key: 'payeeAcc',
        width: '20%'
    },
    {
        title: '支付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: '20%'
    },
    {
        title: '结算金额',
        dataIndex: 'settlementAmount',
        key: 'settlementAmount',
        width: '20%'
    },
    {
        title: '支付时间',
        dataIndex: 'payDate',
        key: 'payDate',
        width: '20%'
    }
]

export default {
    data () {
        this.columns = columns
        this.modalColumns = modalColumns
        return {
            loadData: [],
            totalLoadData: [],
            code: this.$route.query.prjCode,
            info: this.$route.query.info,
            generalCode: this.$route.query.generalCode,
            detailObj: {},
            isVisible: false,
            modalData: [],
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
                    this.handleSizeChange(current, size)
                },
            },
            btnList: [
                {
                    id: 1,
                    month: '2022年6月'
                },
                {
                    id: 2,
                    month: '2022年7月'
                },
                {
                    id: 3,
                    month: '2022年8月'
                },
                {
                    id: 4,
                    month: '2022年9月'
                },
                {
                    id: 5,
                    month: '2022年10月'
                }
            ],
            date: ''
        }
    },
    mounted() {
        this.getMoneyFlowDetailInfo()
    },
    methods: {
        searchDate() {
            console.log(this.date)
            if (this.date) {
                this.date = moment(this.date).format('YYYY-MM')
            }
           this.getMoneyFlowDetailInfo()
        },
        getMoneyFlowDetailInfo () {
            // getMoneyFlowDetail(this.code, this.generalCode).then(res => {
            //     console.log(res)
            //     if(res.status == 1 && res.data) {
            //         const data = res.data
            //         this.detailObj = data
            //         this.loadData = data.ownerList
            //         this.totalLoadData = data.totalList
            //     }
            // })
            getMoneyflowDetailNew(this.code, this.generalCode, this.date).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    const data = res.data
                    this.detailObj = data
                    this.loadData = data.ownerList
                    this.totalLoadData = data.totalList
                }
            })
        },
        handleOwnerReviewClick(row) {
            this.isVisible = true
            this.modalData = []
            getPayDetailDescNew(row.contractCode, this.date).then(res => {
                if(res.status == 1 && res.data) {
                    this.modalData = res.data.page.pageList
                }
            })
        },
        handleTotalReviewClick(row) {
            this.isVisible = true
            this.modalData = []
            getPayDetailDescNew(row.contractCode, this.date).then(res => {
                if(res.status == 1 && res.data) {
                    this.modalData = res.data.page.pageList
                }
            })
        },
        handleOk() {
            this.isVisible = false
        },
        handlePaymentPageChange(page, pageSize) {
            console.log(page, pageSize)
            this.pagination.current = page
        },
        handlePaymentShowSizeChange(current, size) {
            console.log(current, size)
            this.pagination.pageSize = size
        },
        handleLinkClick(item) {
            this.$router.push({ path: '/payment/info', query: { prjCode: this.code, month: item.month } })
        }
    }
}
</script>
<style lang="less">
.detail-header-title{
    display: flex;
    flex-direction: row;

}
.detail-container{
    .detail-wrapper{
        .title{
            position: relative;
            display: flex;
            align-items: center;
            margin: 20px 0;
            span{
                margin-left: 12px;
                font-size: 16px;
                font-weight: 600;
            }
        }
        .title::before{
            position: absolute;
            content: '';
            width: 6px;
            height: 20px;
            background: #508EDF;
        }
    }
    
    
}
.detail-modal-wrapper{
    .ant-modal-content{
        width: 1000px!important;  
        margin-left: -120px!important;
    }
}

</style>