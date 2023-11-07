<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="detail-container">
                <div class="detail-wrapper">
                    <a-row :gutter="24">
                        <div class="title">
                            <span>项目信息</span>
                        </div>
                        <a-col :span="8">
                            <span>项目名称：{{ msgObj.prjName }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>业主单位名称：{{ msgObj.ownerUnitName }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>总包单位名称：{{ msgObj.generalUnitName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <div class="title">
                            <span>结算信息</span>
                        </div>
                        <a-col :span="8">
                            <span>结算日期：{{ msgObj.month }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>业主支付金额：{{ msgObj.unitPaymentAmount }}元</span>
                        </a-col>
                        <a-col :span="8">
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <div class="title">
                            <span>总包单位支付信息</span>
                        </div>
                    </a-row>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :columns="columns"
                        :data-source="totalLoadData"
                        :pagination="pagination"
                        :scroll="{ x: 1200, y: 600 }"
                        :loading="loading"
                        style="margin-top: 20px;"
                    >
                        <span slot="serial" slot-scope="text, record, index">
                            {{ index + 1 }}
                        </span>
                    </a-table>
                </div>
            </div>
        </a-card>
    </page-header-wrapper>
</template>
<script>

import { getMonthDetail } from '@/api/payment'

const columns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '5%'
    },
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
        width: '20%'
    },
    {
        title: '所关联合同类型',
        dataIndex: 'contractTypeName',
        key: 'contractTypeName',
        width: '15%'
    },
    // {
    //     title: '支付类型',
    //     dataIndex: 'contractAmount',
    //     key: 'contractAmount',
    //     width: '15%'
    // },
    {
        title: '支付类型名称',
        dataIndex: 'paymentSceneName',
        key: 'paymentSceneName',
        width: '10%'
    },
    {
        title: '所属批次名称',
        dataIndex: 'settlementBatchName',
        key: 'settlementBatchName',
        width: '10%'
    },
    {
        title: '支付金额（元）',
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: '10%'
    }
]

export default {
    data () {
        this.columns = columns
        return {
            prjCode: this.$route.query.prjCode,
            totalLoadData: [
                // {
                //     payeeName: '北京华天幕墙工程有限公司',
                //     contractName: '雄安•电建智汇城容东片区1号地块项目XARD0046南地块幕布工程空调采购合同',
                //     contractTypeName: '专业分包-装饰装修(幕墙)',
                //     contractAmount: '工程款',
                //     contractPaidAmount: '17410335.48'
                // },
                // {
                //     payeeName: '北京华天幕墙工程有限公司',
                //     contractName: '雄安•电建智汇城容东片区1号地块项目XARD0046南地块幕布工程空调采购合同',
                //     contractTypeName: '专业分包-装饰装修(幕墙)',
                //     contractAmount: '工资款',
                //     contractPaidAmount: '104080.00'
                // },
                // {
                //     payeeName: '保定弘皓门业制造有限公司',
                //     contractName: '雄安•电建智汇城容东片区1号地块项目XARD0046地块人防工程专业分包合同',
                //     contractTypeName: '专业分包-安装',
                //     contractAmount: '工程款',
                //     contractPaidAmount: '1186816.30'
                // },
                // {
                //     payeeName: '珠海兴业绿色建筑科技有限公司',
                //     contractName: '雄安•电建智汇城容东片区1号地块项目XARD0046北地块幕墙工程专业分包合同',
                //     contractTypeName: '专业分包-装饰装修(幕墙)',
                //     contractAmount: '工程款',
                //     contractPaidAmount: '16332685.45'
                // },
                // {
                //     payeeName: '珠海兴业绿色建筑科技有限公司',
                //     contractName: '雄安•电建智汇城容东片区1号地块项目XARD0046北地块幕墙工程专业分包合同',
                //     contractTypeName: '专业分包-装饰装修(幕墙)',
                //     contractAmount: '工资款',
                //     contractPaidAmount: '68160.00'
                // },
                // {
                //     payeeName: '总计',
                //     contractName: '',
                //     contractTypeName: '',
                //     contractAmount: '',
                //     contractPaidAmount: '35102077.23'
                // },
            ],
            loading: false,
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
            msgObj: {},
            month: this.$route.query.month && this.$route.query.month == '2022年6月' ? '2022-06' : this.$route.query.month == '2022年7月' ? '2022-07' : this.$route.query.month == '2022年8月' ? '2022-08' : this.$route.query.month == '2022年9月' ? '2022-09' : ''
        }
    },
    mounted() {
        this.getMonthInfo()
        console.log(this.$route.query.month)
    },
    methods: {
        getMonthInfo() {
            let reqObj = {
                prjCode: this.prjCode,
                month: this.month,
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getMonthDetail(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    const data = res.data
                    this.totalLoadData = data.generalPaymentInfo
                    this.msgObj = data
                }
            })
        },
        handlePageChange(page, pageSize) {
            console.log(page, pageSize)
            this.pagination.current = page
            this.getMonthInfo()
        },
        handleShowSizeChange(current, size) {
            console.log(current, size)
            this.pagination.pageSize = size
            this.getMonthInfo()
        },
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