<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-form-item label="批次名称">
                            <a-input v-model="queryParam.batchName" placeholder="请输入" style="width: 280px;"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item label="创建企业">
                            <a-input v-model="queryParam.companyName" placeholder="请输入" style="width: 280px;"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="!advanced && 8 || 24" :sm="24">
                        <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                            <a-button type="primary" @click="handleSearchClick">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
            <div class="settleBatch-title-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-button type="primary" @click="handleAddClick">新增</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <a-table
                :rowKey="((record, index) => {return index})"
                :columns="columns"
                :data-source="loadData"
                :pagination="pagination"
                :scroll="{ x: 1200, y: 600 }"
                :loading="loading"
            >
                <template slot="serial" slot-scope="text, record, index">
                    <span>
                        {{ index + 1 }}
                    </span>
                </template>
                <template slot="operation" slot-scope="scope">
                    <a-button type="link" @click="handleEditClick(scope)">编辑</a-button>
                    <!-- <a-button type="link" @click="handleDeleteClick(scope)">删除</a-button> -->
                    <a-popconfirm
                        title="确定删除吗？"
                        @confirm="handleDeleteClick(scope)"
                    >
                        <a-button type="link">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-card>
        <a-modal v-model="isAddVisible" class="addSettleModal" title="新增结算批次" ok-text="确认" cancel-text="取消" @ok="handleSubmitModalClick" @cancel="handleCancelClick">
            <a-form-model
                ref='batchForm'
                :model="batchForm"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="批次名称" prop="batchName">
                            <a-input v-model="batchForm.batchName" placeholder="请输入批次名称"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="创建日期" prop="createDate">
                            <a-date-picker
                                v-model="batchForm.createDate"
                                type="date"
                                placeholder="请选择创建日期"
                                style="width: 100%;"
                                format="YYYY-MM-DD"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="创建企业">
                            <a-input disabled v-model="batchForm.companyName" placeholder="请输入创建企业"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <a-modal v-model="isEditVisible" class="addSettleModal" title="编辑结算批次" ok-text="确认" cancel-text="取消" @ok="handleEditSubmitModalClick" @cancel="handleEditCancelClick">
            <a-form-model
                ref='batchEditForm'
                :model="batchEditForm"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="批次名称" prop="batchName">
                            <a-input v-model="batchEditForm.batchName" placeholder="请输入批次名称"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="创建日期" prop="createDate">
                            <a-date-picker
                                v-model="batchEditForm.createDate"
                                type="date"
                                placeholder="请选择创建日期"
                                style="width: 100%;"
                                format="YYYY-MM-DD"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-model-item label="创建企业">
                            <a-input disabled v-model="batchEditForm.companyName" placeholder="请输入创建企业"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

    </page-header-wrapper>        
</template>
<script>
import moment from 'moment'
import { addSettle, getSettleList, editSettle, detailSettle, getCurrentCompanyInfo, delSettle } from '@/api/payment'

const columns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '3%'
    },
    {
        title: '批次名称',
        dataIndex: 'batchName',
        key: 'batchName',
        width: '15%'
    },
    {
        title: '创建日期',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '15%'
    },
    {
        title: '创建企业',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '15%'
    },
    { 
        title: '操作', 
        key: 'operation', 
        scopedSlots: { customRender: 'operation' },
        width: '10%'
    },
]

export default {
    name: "SettleBatch",
    data () {
        this.columns = columns
        return {
            advanced: false,
            isAddVisible: false,
            queryParam: {
                batchName: '',
                companyName: ''
            },
            loadData: [],
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
            batchForm: {
                batchName: '',
                createDate: null,
                companyName: ''
            },
            rules: [

            ],
            batchEditForm: {
                batchName: '',
                createDate: '',
                companyName: ''
            },
            unifiedCreditCode: '',
            cacheId: '',
            isEditVisible: false
        }
    },
    mounted() {
        this.getSettleInfo()
        this.getCurrentSettleCompanyInfo()
    },
    methods: {
        getSettleInfo() {
            this.loading = true
            let reqObj = {
                batchName: this.queryParam.batchName,
                companyName: this.queryParam.companyName,
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getSettleList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    this.loading = false
                    this.loadData = res.data.pageList
                    this.pagination.total = res.data.rowCount
                } else {
                    this.$message.error(res.message)
                    this.loading = false
                }
            })
        },
        getCurrentSettleCompanyInfo() {
            getCurrentCompanyInfo().then(res => {
                if(res.status == 1 && res.data) {
                    this.unifiedCreditCode = res.data.unifiedCreditCode
                    this.batchForm.companyName = res.data.companyName
                    this.batchEditForm.companyName = res.data.companyName
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        handleSearchClick() {
            this.getSettleInfo()
        },
        handleAddClick() {
            this.isAddVisible = true
        },
        handlePageChange(page, pageSize) {
            this.pagination.current = page
            this.getSettleInfo()
        },
        handleShowSizeChange(current, size) {
            this.pagination.pageSize = size
            this.getSettleInfo()
        },
        handleSubmitModalClick(e) {
            e.preventDefault()
            this.$refs.batchForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.batchForm)
                    reqObj.createDate = moment(reqObj.createDate).format('YYYY-MM-DD')
                    reqObj.unifiedCreditCode = this.unifiedCreditCode
                    addSettle(reqObj).then(res => {
                        if(res.status == 1) {
                            this.$message.success(res.data)
                            this.isAddVisible = false
                            this.getSettleInfo()
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                    
                }
            })
        },
        handleCancelClick() {

        },
        handleEditSubmitModalClick(e) {
            e.preventDefault()
            this.$refs.batchEditForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.batchEditForm)
                    reqObj.createDate = moment(reqObj.createDate).format('YYYY-MM-DD')
                    reqObj.unifiedCreditCode = this.unifiedCreditCode
                    reqObj.id = this.cacheId
                    editSettle(reqObj).then(res => {
                        if(res.status == 1) {
                            this.$message.success(res.data)
                            this.isEditVisible = false
                            this.getSettleInfo()
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                    
                }
            })
        },
        handleEditCancelClick() {

        },
        handleEditClick(scope) {
            this.isEditVisible = true
            this.isAddVisible = false
            this.cacheId = scope.id
            detailSettle(scope.id).then(res => {
                if(res.status == 1 && res.data) {
                    this.batchEditForm.batchName = res.data.batchName
                    this.batchEditForm.createDate = res.data.createDate
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        handleDeleteClick(scope) {
            delSettle(scope.id).then(res => {
                if(res.status == 1) {
                    this.$message.success(res.data)
                    this.getSettleInfo()
                } else {
                    this.$message.error(res.data)
                }
            })
        }
    }
}
</script>
<style lang="less">

.settleBatch-title-wrapper{
    margin: 20px 0px;
}
</style>