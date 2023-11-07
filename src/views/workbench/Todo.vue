<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <a-tabs :default-active-key="activeKey" @change="handleTabsChange">
                <a-tab-pane key="1" :tab="`支付审批${paymentCount ? '(' + paymentCount + ')' : ''}`">
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :data-source='paymentData'
                        :columns="paymentColumns"
                        :pagination="paymentPagination"
                        :scroll="{ x: 1200, y: 600 }"
                    >
                        <span slot="serial" slot-scope="text, record, index">
                            {{ index + 1 }}
                        </span>
                        <!-- <template slot="contractStatus" slot-scope="text, record">
                            <span>{{ setContractStatus(record.contractStatus) }}</span>
                        </template> -->
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handlePaymentAuditClick(scope)">审批</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="2" :tab="`支付补录${payCollectionCount ? '(' + payCollectionCount + ')' : ''}`" force-render>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :data-source='payCollectionData'
                        :columns="payCollectionColumns"
                        :pagination="payCollectionPagination"
                        :scroll="{ x: 1200, y: 600 }"
                    >
                        <span slot="serial" slot-scope="text, record, index">
                            {{ index + 1 }}
                        </span>
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handlePayCollectionAuditClick(scope)">审批</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="3" :tab="`合同审批${contractCount ? '(' + contractCount + ')' : ''}`" force-render>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :data-source='contractData'
                        :columns="columns"
                        :pagination="pagination"
                    >
                        <span slot="serial" slot-scope="text, record, index">
                            {{ index + 1 }}
                        </span>
                        <template slot="contractStatus" slot-scope="text, record">
                            <span>{{ setContractStatus(record.contractStatus) }}</span>
                        </template>
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handleAuditClick(scope)">审核</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-card>
        <!-- contract -->
        <a-modal v-model="isAddVisible" class="addContractTodoModal" title="审批详情" :footer="false">
            <div class="model-row">
                <span>当前进度</span>
            </div>
            <a-steps progress-dot :current="contractObj.step - 1" size="small" style="margin-bottom: 20px;">
                <a-step
                    v-for="item of contractObj.nodeList" 
                    :key="item.value"
                    :title="item.name"
                    :subTitle="setMoment(item.handleDate)"
                    :description="item.handleStatus"
                ></a-step>
            </a-steps>
            <div class="model-log">
                <a-button type="primary" @click="handleLogClick(contractObj.contractCode)">审批日志</a-button>
            </div>
            <a-form-model
                ref='ruleContractForm'
                :model="addForm"
                :rules="rules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div>
                    <div class="model-row">
                        <span>模板信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同创建人：</span>
                            <span>{{ contractObj.contractCreate ? (contractObj.contractCreate == 1 ? '甲方' : '乙方') : '' }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同类型：</span>
                            <span>{{ contractObj.contractTypeName }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同背景信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>归属总包合同名称：</span>
                            <span>{{ contractObj.belongContractName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>归属三级项目信息：</span>
                            <span>{{ contractObj.belongProjectName }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同基本信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同名称：</span>
                            <span>{{ contractObj.contractName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同编号：</span>
                            <span>{{ contractObj.contractCode }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class='model-col'>
                        <a-col :span="12">
                            <span>合同签订日期：</span>
                            <span>{{ contractObj.contractSignDate }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同开始日期：</span>
                            <span>{{ contractObj.contractStartDate }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同结束日期：</span>
                            <span>{{ contractObj.contractEndDate }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同总金额（元）：</span>
                            <span>{{ contractObj.contractAmount }}</span>
                        </a-col>
                    </a-row>
                    <!-- <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同预付款金额（元）：</span>
                            <span>{{ contractObj.prepaymentAmou }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同质保金金额（元）：</span>
                            <span>{{ contractObj.warrantyAmount }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同付款周期：</span>
                            <span>{{ setPaymentPeriod(contractObj.contractPaymentPeriod) }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同约定现金支付比例（%）：</span>
                            <span>{{ contractObj.contractPaymentProportion }}</span>
                        </a-col>
                    </a-row> -->
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同已结算金额（元）：</span>
                            <span>{{ contractObj.settledAmount }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同已支付金额（元）：</span>
                            <span>{{ contractObj.paidAmount }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同甲方信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同甲方公司名称：</span>
                            <span>{{ contractObj.companyAName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同甲方公司统一社会信用代码：</span>
                            <span>{{ contractObj.contractACompanyCode }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同甲方银行账号：</span>
                            <span>{{ contractObj.payerAcc }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同甲方银行账户名称：</span>
                            <span>{{ contractObj.payerName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同甲方开户行：</span>
                            <span>{{ contractObj.payerOpenBank }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同甲方联行行号：</span>
                            <span>{{ contractObj.payerOpenBankNo }}</span>
                        </a-col>
                    </a-row>
                    <div v-if="isShowAWorker">
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>甲方农民工工资专户户名：</span>
                                <span>{{ contractObj.peasantWorkerPayerName }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>甲方农民工工资专户账号：</span>
                                <span>{{ contractObj.peasantWorkerPayerAcc }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>甲方农民工工资专户开户行：</span>
                                <span>{{ contractObj.peasantWorkerPayerOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>甲方农民工工资专户联行号：</span>
                                <span>{{ contractObj.peasantWorkerPayerOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    
                </div>
                <div>
                    <div class="model-row">
                        <span>合同乙方信息</span>
                    </div>
                    <div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>合同乙方公司名称：</span>
                                <span>{{ contractObj.companyBName }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>合同乙方公司统一社会信用代码：</span>
                                <span>{{ contractObj.contractBCompanyCode }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>合同乙方银行账号：</span>
                                <span>{{ contractObj.payeeAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>合同乙方银行账户名称：</span>
                                <span>{{ contractObj.payeeName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>合同乙方开户行：</span>
                                <span>{{ contractObj.payeeOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>合同乙方联行行号：</span>
                                <span>{{ contractObj.payeeOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                        <div v-if="isShowBWorker">
                            <a-row :gutter="24" class="model-col">
                                <a-col :span="12">
                                    <span>乙方农民工工资专户户名：</span>
                                    <span>{{ contractObj.peasantWorkerPayeeName }}</span>
                                </a-col>
                                <a-col :span="12">
                                    <span>乙方农民工工资专户账号：</span>
                                    <span>{{ contractObj.peasantWorkerPayeeAcc }}</span>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24" class="model-col">
                                <a-col :span="12">
                                    <span>乙方农民工工资专户开户行：</span>
                                    <span>{{ contractObj.peasantWorkerPayeeOpenBank }}</span>
                                </a-col>
                                <a-col :span="12">
                                    <span>乙方农民工工资专户联行号：</span>
                                    <span>{{ contractObj.peasantWorkerPayeeOpenBankNo }}</span>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </div>
                <div class="process" v-if="contractObj.processorFlag == 'companyOperator' && contractObj.contractCreate == 2">
                    <div class="model-row">
                        <span>审批流程</span><strong>* 请在此部分设定与本合同审批及本合同支付审批相关的流程</strong>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同经办人" prop="contractOperator">
                                <a-select v-model="addForm.companyContractOperator" placeholder="请选择合同经办人" @focus="handleCompanyContractOperatorFocus">
                                <a-select-option v-for="item of agentSelectA" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同一级复核人" prop="companyContractPrimaryReviewer">
                                <a-select v-model="addForm.companyContractPrimaryReviewer" placeholder="请选择合同一级复核人" @focus="handleCompanyContractPrimaryFocus">
                                <a-select-option v-for="item of reviewSelect1" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同二级复核人（如有）">
                                <a-select v-model="addForm.companyContractSecondaryReviewer" placeholder="请选择合同二级复核人" @focus="handleCompanyContractSecondFocus">
                                <a-select-option v-for="item of reviewSelect2" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <!-- <a-col :span="12">
                            <a-form-model-item label="甲方企业经办人" prop="companyOperator" v-if="isShowCompanyOperator">
                                <a-select v-model="addForm.companyOperator" placeholder="请选择甲方企业经办人">
                                <a-select-option v-for="item of agentSelectA" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col> -->
                    </a-row>
                </div>

                <div class="process" v-else>
                    <div class="model-row">
                        <span>审批流程</span><strong>* 请在此部分设定与本合同审批及本合同支付审批相关的流程</strong>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同经办人：</span>
                            <span>{{ contractObj.contractCreate == 1 ? contractObj.companyOperatorName : contractObj.contractOperatorName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同一级复核人：</span>
                            <span>{{ contractObj.contractCreate == 1 ? contractObj.companyContractPrimaryReviewerName : contractObj.contractPrimaryReviewerName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同二级复核人（如有）：</span>
                            <span>{{ contractObj.contractCreate == 1 ? contractObj.companyContractSecondaryReviewerName : contractObj.contractSecondaryReviewerName }}</span>
                        </a-col>
                        <a-col :span="12" v-if="contractObj.contractCreate == 2">
                            <span>甲方企业经办人：</span>
                            <span>{{ contractObj.companyOperatorName }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同附件信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                            <span>上传合同文件：</span>
                            <div class="upload-wrapper">
                                <span v-for="(item, index) of contractObj.contractFile" :key="index">{{ item.name }}<a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                            </div>
                        </a-col>
                    </a-row>
                </div>
                
                <div class="process">
                    <div class="model-row">
                        <span>审批信息</span>
                    </div>
                    <a-row :gutter="24" class="process-label">
                        <a-col :span="8">
                            <a-form-model-item label="操作" prop="currentHandle">
                                <a-select v-model="addForm.currentHandle" placeholder="请选择" v-if="contractObj.processorFlag == 'contractOperator'">
                                    <a-select-option v-for="item of operationContractSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                                <a-select v-model="addForm.currentHandle" placeholder="请选择" v-else>
                                    <a-select-option v-for="item of operationSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="备注">
                                <a-input
                                    placeholder="请输入"
                                    v-model="addForm.remark"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="上一步备注">
                                <a-input
                                    v-model="paymentObj.lastRemark"
                                    disabled
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model>
            <a-row :gutter="24" style="margin-top: 30px;text-align: center;">
                <a-col>
                    <a-button @click="handleCancelClick" style="margin-right: 20px;">取消</a-button>
                    <a-button v-if="isEditBtn" type="primary" @click="handleEditModalClick" style="margin-right: 20px;">编辑</a-button>
                    <a-button type="primary" @click="handleSubmitModalClick" :loading="contractOnSubmitLoading">确认</a-button>
                </a-col>
            </a-row>
        </a-modal>

        <!-- payment -->
        <a-modal v-model="isPayVisible" class="addContractTodoModal" title="审批详情" ok-text="确认" cancel-text="取消" @ok="handlePaymentSubmitClick" @cancel="handlePaymentCancelClick">
            <div class="model-row">
                <span>当前进度</span>
            </div>
            <a-steps progress-dot :current="paymentObj.step - 1" size="small" style="margin-bottom: 20px;">
                <a-step 
                    v-for="item of paymentObj.nodeList" 
                    :key="item.value"
                    :title="item.name"
                    :subTitle="setMoment(item.handleDate)"
                    :description="item.handleStatus"
                ></a-step>
            </a-steps>
            <div class="model-log">
                <a-button type="primary" @click="handlePayLogClick(paymentObj.id)">审批日志</a-button>
            </div>
            <a-form-model
                ref='rulePaymentForm'
                :model="paymentForm"
                :rules="paymentRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div>
                    <div class="model-row">
                        <span>基本信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>任务名称：</span>
                            <span>{{ paymentObj.taskName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>所属合同名称：</span>
                            <span>{{ paymentObj.belongContractName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>所属项目名称：</span>
                            <span>{{ paymentObj.belongPrjName }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div v-if="scene == 3 && paymentObj.paymentScene >= 14 || scene == 6 && paymentObj.paymentScene >= 14 || scene == 2 && paymentObj.paymentScene > 14">
                    <div>
                        <div class="model-row">
                            <span>中标主体信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>中标主体名称：</span>
                                <span>{{ paymentObj.companyAName }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>付款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方银行账号：</span>
                                <span>{{ paymentObj.payerAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款方银行账号户名：</span>
                                <span>{{ paymentObj.payerName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方开户行：</span>
                                <span>{{ paymentObj.payerOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款方联行行号：</span>
                                <span>{{ paymentObj.payerOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付申请信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>已支付金额（元）：</span>
                                <span>{{ paymentObj.contractPaidAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>已结算金额（元）：</span>
                                <span>{{ paymentObj.contractSettlAmount }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>工资总金额（元）：</span>
                                <span>{{ paymentObj.paymentAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>工资总笔数：</span>
                                <span>{{ paymentObj.totalNum }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>本次结算金额（元）：</span>
                                <span>{{ paymentObj.currentSettlementAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>交易附言：</span>
                                <span>{{ paymentObj.transactionRemark }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>工资月份：</span>
                                <span>{{ paymentObj.month }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>所属结算批次：</span>
                                <!-- <span>{{ paymentObj.settlementBatchName }}</span> -->
                                <span v-if="paymentObj.settlementBatchName">{{ paymentObj.settlementBatchName }}</span>
                                <a-button type="link" @click="handleSettleClick">选择</a-button>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付要件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传发票附件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.invoiceFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传审批文件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.approveFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>合同相关联工资单：</span>
                                <!-- <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.salaryDetails" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)"></a></span>
                                </div> -->
                                <span>{{ paymentObj.salaryManageName }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>其他附件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传材料：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div v-else-if="scene == 2 && paymentObj.paymentScene == 14">
                    <div>
                        <div class="model-row">
                            <span>中标主体信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>中标主体名称：</span>
                                <span>{{ paymentObj.companyAName }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>中标主体工资专户名称：</span>
                                <span>{{ paymentObj.payerName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>中标主体工资专户账号：</span>
                                <span>{{ paymentObj.payerAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>中标主体工资专户开户行：</span>
                                <span>{{ paymentObj.payerOpenBank }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>分包商信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>分包商名称：</span>
                                <span>{{ paymentObj.companyBName }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>分包商账户名称：</span>
                                <span>{{ paymentObj.payeeName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>分包商银行账号：</span>
                                <span>{{ paymentObj.payeeAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>分包商开户行：</span>
                                <span>{{ paymentObj.payeeOpenBank }}</span>
                            </a-col>
                        </a-row>
                        <!-- <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>分包商开户行联行号：</span>
                                <span>{{ paymentObj.payeeOpenBankNo }}</span>
                            </a-col>
                        </a-row> -->
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付申请信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>已支付金额（元）：</span>
                                <span>{{ paymentObj.contractPaidAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>已结算金额（元）：</span>
                                <span>{{ paymentObj.contractSettlAmount }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>工资总金额（元）：</span>
                                <span>{{ paymentObj.paymentAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>工资总笔数：</span>
                                <span>{{ paymentObj.totalNum }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>本次结算金额（元）：</span>
                                <span>{{ paymentObj.currentSettlementAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>交易附言：</span>
                                <span>{{ paymentObj.transactionRemark }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>工资月份：</span>
                                <span>{{ paymentObj.month }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>所属结算批次：</span>
                                <span v-if="paymentObj.settlementBatchName">{{ paymentObj.settlementBatchName }}</span>
                                <a-button type="link" @click="handleSettleClick">选择</a-button>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付要件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传发票附件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.invoiceFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传审批文件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.approveFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>合同相关联工资单：</span>
                                <!-- <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.salaryDetails" :key="index">{{ item.name }} <a style="margin-left: 10px;" :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a></span>
                                </div> -->
                                <span>{{ paymentObj.salaryManageName }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>其他附件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传材料：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div v-else-if="paymentObj.paymentScene == 13">
                    <div>
                        <div class="model-row">
                            <span>付款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方银行账号：</span>
                                <span>{{ paymentObj.payerAcc }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付申请信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>已支付金额（元）：</span>
                                <span>{{ paymentObj.contractPaidAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>已结算金额（元）：</span>
                                <span>{{ paymentObj.contractSettlAmount }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>工资总金额（元）：</span>
                                <span>{{ paymentObj.paymentAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>工资总笔数：</span>
                                <span>{{ paymentObj.paymentNum }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>本次结算金额（元）：</span>
                                <span>{{ paymentObj.currentSettlementAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>交易附言：</span>
                                <span>{{ paymentObj.transactionRemark }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>所属结算批次：</span>
                                <span v-if="paymentObj.settlementBatchName">{{ paymentObj.settlementBatchName }}</span>
                                <a-button type="link" @click="handleSettleClick">选择</a-button>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付要件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传发票附件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传审批文件：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>合同相关联工资单：</span>
                                <!-- <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.paymentDetails" :key="index">{{ item.name }} <a style="margin-left: 10px;" :href="`${fileUrl}/files?fileId=${item.url}&flag=true`"></a></span>
                                </div> -->
                                <span>{{ paymentObj.salaryManageName }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>其他附件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                <span>上传材料：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div v-else>
                    <div>
                        <div class="model-row">
                            <span>付款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <a-form-model-item class="select-account" v-if="paymentObj.processorFlag == 'companyOperator' && paymentObj.paymentScene <= 6 " label="付款方银行账号">
                                    <a-select v-model="paymentObj.payerAcc" 
                                        show-search
                                        placeholder="请选择付款方银行账号"
                                        :default-active-first-option="false"
                                        :show-arrow="false"
                                        :filter-option="false"
                                        :not-found-content="null"
                                        :options="payerData"
                                        @search="handlePayerSearch"
                                        @change="handlePayerChange">
                                    </a-select>
                                </a-form-model-item>
                                <span v-else style="margin-left: -2px;">
                                    <span>付款方银行账号：</span>
                                    <span >{{ paymentObj.payerAcc }}</span>
                                </span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款方银行账号户名：</span>
                                <span>{{ paymentObj.payerName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方开户行：</span>
                                <span>{{ paymentObj.payerOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款方联行行号：</span>
                                <span>{{ paymentObj.payerOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>收款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>收款方银行账号：</span>
                                <span>{{ paymentObj.payeeAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>收款方银行账号户名：</span>
                                <span>{{ paymentObj.payeeName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class='model-col'>
                            <a-col :span="12">
                                <span>收款方开户行：</span>
                                <span>{{ paymentObj.payeeOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>收款方联行行号：</span>
                                <span>{{ paymentObj.payeeOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>支付申请信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>已支付金额（元）：</span>
                                <span>{{ paymentObj.contractPaidAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>已结算金额（元）：</span>
                                <span>{{ paymentObj.contractSettlAmount }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>申请金额（元）：</span>
                                <span>{{ paymentObj.paymentAmount }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>本次结算金额（元）：</span>
                                <span>{{ paymentObj.currentSettlementAmount }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>交易附言：</span>
                                <span>{{ paymentObj.transactionRemark }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>所属结算批次：</span>
                                <span v-if="paymentObj.settlementBatchName">{{ paymentObj.settlementBatchName }}</span>
                                <a-button type="link" @click="handleSettleClick">选择</a-button>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <!-- <div class="model-row">
                            <span>支付要件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.paymentFile" :key="index">{{ item.name }}<a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a></span>
                                </div>
                            </a-col>
                        </a-row> -->
                        <div>
                                <div class="model-row">
                                    <span>支付要件</span>
                                </div>
                                <a-row :gutter="24" class="model-col">
                                    <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                        <span>上传发票附件：</span>
                                        <div class="upload-wrapper">
                                            <span v-for="(item, index) of paymentObj.invoiceFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                        </div>
                                    </a-col>
                                    <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                        <span>上传审批文件：</span>
                                        <div class="upload-wrapper">
                                            <span v-for="(item, index) of paymentObj.approveFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                        </div>
                                    </a-col>
                                </a-row>
                        </div>
                        <div>
                            <div class="model-row">
                                <span>其他附件</span>
                            </div>
                            <a-row :gutter="24" class="model-col">
                                <a-col :span="12" style="display: flex; flex-direction: row;align-items: center;">
                                    <span>上传材料：</span>
                                    <div class="upload-wrapper">
                                        <span v-for="(item, index) of paymentObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </div>
                <div class="process">
                    <div class="model-row">
                        <span>审批信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="8">
                            <a-form-model-item label="操作" prop="currentHandle">
                                <a-select v-model="paymentForm.currentHandle" placeholder="请选择">
                                    <a-select-option v-for="item of operationSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="备注">
                                <a-input
                                    placeholder="请输入"
                                    v-model="paymentForm.remark"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="上一步备注">
                                <a-input
                                    v-model="paymentObj.lastRemark"
                                    disabled
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model>
        </a-modal>

        <!-- 合同审批日志 -->
        <a-modal v-model="isLogVisible" class="addContractTodoModal" title="审批日志" :footer="false">
            <div class="contract-log-wrapper">
                <div v-for="(item, index) of contractLogList" :key="index">
                    <div>{{ item.handleDate }}:</div>
                    <div class="log-wrapper">
                        <span>{{ item.currentProcessorName }}</span><span>{{ item.currentHandleName }}</span><span>备注：{{ item.remark }}</span>
                    </div>
                </div>
                <div class="log-footer">
                    <a-button type="primary" @click="handleLogSubmitClick">确认</a-button>
                </div>
            </div>
        </a-modal>


        <!-- 支付审批日志 -->
        <a-modal v-model="isPayLogVisible" class="addContractTodoModal" title="审批日志" :footer="false">
            <div class="contract-log-wrapper">
                <div v-for="(item, index) of payLogList" :key="index">
                    <div>{{ item.handleDate }}:</div>
                    <div class="log-wrapper">
                        <span>{{ item.currentProcessorName }}</span><span>{{ item.currentHandleName }}</span><span>备注：{{ item.remark }}</span>
                    </div>
                </div>
                <div class="log-footer">
                    <a-button type="primary" @click="handlePayLogSubmitClick">确认</a-button>
                </div>
            </div>
        </a-modal>

        <!-- 发送验证码 -->
        <a-modal v-model="isShowVerification" class="verificationModal" ok-text="确认" @ok="handleVerificationClick">
            <a-form-model
                ref='verificationForm'
                :model="verificationForm"
                :rules="verificationRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>验证码</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="18">
                        <a-form-model-item class="upload-wrapper" label="短信验证码" prop="code">
                            <a-input 
                                type="text" 
                                v-model="verificationForm.code"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>


        <!-- 合同编辑 -->
        <a-modal v-model="isEditStatus" class="addContractModal" title="编辑合同" ok-text="确认" cancel-text="取消" @ok="handleEditSubmitModalClick" @cancel="handleEditCancelClick">
            <a-form-model
                ref='editRuleForm'
                :model="editForm"
                :rules="editRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div>
                    <div class="model-row">
                        <span>模板信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同创建人" prop="contractCreate">
                                <a-radio-group v-model="editForm.contractCreate">
                                    <!-- <a-radio value="1">合同甲方</a-radio> -->
                                    <a-radio value="2">合同乙方</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同类型" prop='contractType'>
                                <a-cascader
                                v-model="editForm.contractType"
                                :field-names="{ label: 'name', value: 'value', children: 'children' }"
                                :options="projectType"
                                placeholder="请选择合同类型"
                                change-on-select
                                @change="handleContractTypeChange"
                                ></a-cascader>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同背景信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12" v-if="isContractType">
                            <a-form-model-item label="归属总包合同名称" prop="belongContractCode">
                            <a-select v-model="editForm.belongContractCode" placeholder="请选择归属总包合同名称" @change="handleBelongContractCodeChange">
                                <a-select-option v-for="item of belongGeneralType" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12" v-else>
                        <a-form-model-item label="归属总包合同名称" >
                            <a-select v-model="editForm.belongContractCode" placeholder="请选择归属总包合同名称" disabled>
                                <a-select-option v-for="item of belongGeneralType" :key="item.value" :value="item.value" :title="item.name">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="归属三级项目信息" prop="belongProjectCode">
                            <!-- <a-select v-model="addForm.belongProjectCode" placeholder="请选择归属三级项目信息" :disabled="belongCodeDisabled">
                                <a-select-option v-for="item of thirdProjectSelect" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select> -->
                            <a-input v-if="isShowProName" v-model="editForm.belongProjectCode" @focus="handleBelongProjectNameFocus"/>
                            <a-select
                                v-else
                                v-model="editForm.belongProjectCode"
                                show-search
                                placeholder="请输入搜索选择归属三级项目信息"
                                :filter-option="filterOption"
                                @search="handleThirdProjectSearch"
                                @change="handleThirdProjectChange"
                            >
                                <a-select-option v-for="item in thirdProjectSelect" :key="item.value" :value="item.value" :title="item.name">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同基本信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同名称" prop="contractName">
                            <a-input 
                                type="text" 
                                v-model="editForm.contractName"
                                placeholder="请输入合同名称"
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同编号" prop="contractCode">
                            <a-input 
                                type="text" 
                                v-model="editForm.contractCode"
                                placeholder="请输入合同编号"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同签订日期" prop="contractSignDate">
                            <a-date-picker 
                                type="text" 
                                v-model="editForm.contractSignDate"
                                @change="handleStartDateChange"
                                valueFormat="YYYY-MM-DD"
                                placeholder="请选择合同签订日期"
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同开始日期" prop="contractStartDate">
                            <a-date-picker 
                                type="text" 
                                v-model="editForm.contractStartDate"
                                @change="handleStartDateChange"
                                valueFormat="YYYY-MM-DD"
                                placeholder="请选择合同开始日期"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同结束日期" prop="contractEndDate">
                            <a-date-picker 
                                type="text" 
                                v-model="editForm.contractEndDate"
                                @change="handleStartDateChange"
                                valueFormat="YYYY-MM-DD"
                                placeholder="请选择合同结束日期"
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同总金额（元）" prop="contractAmount">
                            <a-input 
                                type="number" 
                                v-model="editForm.contractAmount"
                                placeholder="请输入合同总金额"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <!-- <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同预付款金额（元）" prop="prepaymentAmou">
                            <a-input 
                                type="number" 
                                v-model="editForm.prepaymentAmou"
                                placeholder="请输入合同预付款金额"
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同质保金金额（元）" prop="warrantyAmount">
                            <a-input 
                                type="number" 
                                v-model="editForm.warrantyAmount"
                                placeholder="请输入合同质保金金额"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row> -->
                    <!-- <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同付款周期" prop="contractPaymentPeriod">
                                <a-select v-model="editForm.contractPaymentPeriod" placeholder="请选择合同付款周期" :default-value="defaultPeriod">
                                    <a-select-option v-for="item of cycleSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同约定现金支付比例（%）" prop="contractPaymentProportion">
                            <a-input 
                                type="number" 
                                v-model="editForm.contractPaymentProportion"
                                placeholder="请输入合同预定现金支付比例"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row> -->
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同已结算金额（元）" prop="settledAmount">
                                <a-input 
                                    type="number" 
                                    v-model="editForm.settledAmount"
                                    placeholder="请输入合同已结算金额"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同已支付金额（元）" prop="paidAmount">
                                <a-input 
                                    type="number" 
                                    v-model="editForm.paidAmount"
                                    placeholder="请输入合同已支付金额"
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同甲方信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方公司名称" prop="companyAName">
                                <!-- <a-input 
                                    type="text" 
                                    v-model="editForm.companyAName"
                                    placeholder="请输入甲方合同名称"
                                /> -->
                                <a-select
                                    v-model="editForm.companyAName"
                                    show-search
                                    placeholder="请输入搜索选择合同甲方公司名称"
                                    :filter-option="filterCompanyAOption"
                                    @search="handleCompanyASearch"
                                    @change="handleCompanyAChange"
                                >
                                    <a-select-option v-for="item in companyASelect" :key="item.value" :value="item.value" :title="item.name">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方公司统一社会信用代码" prop="contractACompanyCode">
                            <a-input 
                                type="text" 
                                v-model="editForm.contractACompanyCode"
                                placeholder="请输入合同甲方公司统一社会信用代码"
                                :disbaled="editForm.companyAName ? true : false"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方银行账户名称">
                            <a-input 
                                type="text" 
                                v-model="editForm.payerName"
                                placeholder="请输入合同甲方银行账户名称"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方银行账号">
                            <!-- <a-input 
                                type="text" 
                                v-model="addForm.payerName"
                                placeholder="请输入合同甲方银行账户名称"

                            /> -->
                            <a-select v-model="editForm.payerAcc" placeholder="请输入合同甲方银行账号" @focus="handlePayerNameFocus" @change="handlePayerNameChange">
                                <a-select-option v-for="item of payerNameSelect" :key="item.value" :value="item.value">
                                {{ item.value }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方开户行">
                            <a-input 
                                type="text" 
                                v-model="editForm.payerOpenBank"
                                placeholder="请输入甲方合同开户行"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方联行行号">
                            <a-input 
                                type="text" 
                                v-model="editForm.payerOpenBankNo"
                                placeholder="请输入合同甲方联行行号"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" v-if="isShowAWorker">
                    <a-col :span="12">
                        <a-form-model-item label="甲方农民工工资专户户名">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayerName"
                                placeholder="请输入甲方农民工工资专户户名"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="甲方农民工工资专户账号">
                            <!-- <a-input 
                                type="text" 
                                v-model="addForm.peasantWorkerPayerName"
                                placeholder="请输入甲方农民工工资专户户名"
                            /> -->
                            <a-select v-model="editForm.peasantWorkerPayerAcc" placeholder="请输入甲方农民工工资专户账号" @focus="handlePeasantNameFocus" @change="handlePeasantNameChange">
                                <a-select-option v-for="item of peasantNameSelect" :key="item.value" :value="item.value">
                                {{ item.value }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                    <a-row :gutter="24" v-if="isShowAWorker">
                    <a-col :span="12">
                        <a-form-model-item label="甲方农民工工资专户开户行">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayerOpenBank"
                                placeholder="请输入甲方农民工工资专户开户行"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="甲方农民工工资专户联行号">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayerOpenBankNo"
                                placeholder="请输入甲方农民工工资专户联行号"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同乙方信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方公司名称" prop="companyBName">
                            <!-- <a-input 
                                type="text" 
                                v-model="editForm.companyBName"
                                placeholder="请输入合同乙方公司名称"
                            /> -->
                                <a-select
                                    v-model="editForm.companyBName"
                                    show-search
                                    placeholder="请输入搜索选择合同乙方公司名称"
                                    :filter-option="filterCompanyBOption"
                                    @search="handleCompanyBSearch"
                                    @change="handleCompanyBChange"
                                >
                                    <a-select-option v-for="item in companyBSelect" :key="item.value" :value="item.value" :title="item.name">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方公司统一社会信用代码" prop="contractBCompanyCode">
                            <a-input 
                                type="text" 
                                v-model="editForm.contractBCompanyCode"
                                placeholder="请输入合同乙方公司统一社会信用代码"
                                @blur="handleBlur"
                                :disbaled="editForm.companyBName ? true : false"
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方银行账户名称" prop="payeeAcc">
                            <a-input 
                                type="text" 
                                v-model="editForm.payeeName"
                                placeholder="请输入合同乙方银行账户名称"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方银行账号" prop="payeeName">
                            <!-- <a-input 
                                type="text" 
                                v-model="addForm.payeeName"
                                placeholder="请输入合同乙方银行账号名称"
                            /> -->
                            <a-select v-model="editForm.payeeAcc" placeholder="请输入合同乙方银行账号" @focus="handlePayeeNameFocus" @change="handlePayeeNameChange">
                                <a-select-option v-for="item of payeeNameSelect" :key="item.value" :value="item.value">
                                {{ item.value }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方开户行" prop="payeeOpenBank">
                            <a-input 
                                type="text" 
                                v-model="editForm.payeeOpenBank"
                                placeholder="请输入合同乙方开户行"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同乙方联行行号" prop="payeeOpenBankNo">
                            <a-input 
                                type="text" 
                                v-model="editForm.payeeOpenBankNo"
                                placeholder="请输入合同乙方联行行号"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" v-if="isShowBWorker">
                    <a-col :span="12">
                        <a-form-model-item label="乙方农民工工资专户户名">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayeeName"
                                placeholder="请输入乙方农民工工资专户户名"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="乙方农民工工资专户账号">
                            <!-- <a-input 
                                type="text" 
                                v-model="addForm.peasantWorkerPayeeName"
                                placeholder="请输入乙方农民工工资专户户名"
                            /> -->
                            <a-select v-model="editForm.peasantWorkerPayeeAcc" placeholder="请输入乙方农民工工资专户账号" @focus="handlePeasantPayeeNameFocus" @change="handlePeasantPayeeNameChange">
                                <a-select-option v-for="item of peasantPayeeNameSelect" :key="item.value" :value="item.value">
                                {{ item.value }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                    <a-row :gutter="24" v-if="isShowBWorker">
                    <a-col :span="12">
                        <a-form-model-item label="乙方农民工工资专户开户行">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayeeOpenBank"
                                placeholder="请输入乙方农民工工资专户开户行"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="乙方农民工工资专户联行号">
                            <a-input 
                                type="text" 
                                v-model="editForm.peasantWorkerPayeeOpenBankNo"
                                placeholder="请输入乙方农民工工资专户联行号"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                </div>
                <div class="process">
                    <div class="model-row">
                        <span>审批流程</span><strong>* 请在此部分设定与本合同审批及本合同支付审批相关的流程</strong>
                    </div>
                    <div>
                        <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同经办人" prop="contractOperator">
                                <!-- @focus="handleContractOperatorFocus" -->
                                <a-select v-model="editForm.contractOperator" placeholder="请选择合同经办人" @focus="handleContractOperatorAgentFocus">
                                    <a-select-option v-for="item of agentSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="合同一级复核人" prop="contractPrimaryReviewer">
                                <!--  @focus="handleContractPrimaryFocus" -->
                                <a-select v-model="editForm.contractPrimaryReviewer" placeholder="请选择合同一级复核人" @focus="handleContractPrimaryFocus">
                                    <a-select-option v-for="item of reviewSelect1" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                        <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同二级复核人（如有）">
                                <!-- @focus="handleContractSecondFocus" -->
                                <a-select v-model="editForm.contractSecondaryReviewer" placeholder="请选择合同二级复核人" @focus="handleContractSecondFocus">
                                    <a-select-option v-for="item of reviewSelect2" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="甲方企业经办人" prop="companyOperator">
                                <!-- @focus="handleContractOperatorFocus" -->
                                <a-select v-model="editForm.companyOperator" placeholder="请选择甲方企业经办人" @focus="handleContractOperatorFocus">
                                    <a-select-option v-for="item of agentSelectA" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    </div>
                </div>
                <div>
                    <div class="model-row">
                        <span>合同附件信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="上传合同文件" class="model-upload-file">
                            <div :key="imgKey">
                                <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleChangeFile"
                                :before-upload="beforeImgUpload"
                                :default-file-list="editForm.fileUrlList"
                                @remove="handleUploadRemoveClick"
                                :showUploadList="{
                                    showRemoveIcon: true
                                }"
                                >
                                <a-button type="primary"> <a-icon type="upload" /> 点击上传 </a-button>
                                </a-upload>
                            </div>
                            
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model>
        </a-modal>


        <!-- 支付信息补录 -->
        <a-modal v-model="isCollectionVisible" class="addContractTodoModal" title="支付补录详情" :footer="false">
            <div class="model-row">
                <span>当前进度</span>
            </div>
            <a-steps progress-dot :current="collectionObj.step - 1" size="small" style="margin-bottom: 20px;">
                <a-step
                    v-for="item of collectionObj.nodeList" 
                    :key="item.value"
                    :title="item.name"
                    :subTitle="setMoment(item.handleDate)"
                    :description="item.handleStatus"
                ></a-step>
            </a-steps>
            <div class="model-log">
                <a-button type="primary" @click="handleCollectionLogClick(collectionObj.businessId)">审批日志</a-button>
            </div>
            <a-form-model
                ref='rulePayCollectionForm'
                :model="payCollectionForm"
                :rules="payCollectionRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div>
                    <div class="model-row">
                        <span>基本信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>支付类型：</span>
                            <span>{{ collectionObj.belongPaymentSceneName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>任务名称：</span>
                            <span>{{ collectionObj.taskName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>所属合同名称：</span>
                            <span>{{ collectionObj.belongContractName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>所属项目名称：</span>
                            <span>{{ collectionObj.belongPrjName }}</span>
                        </a-col>
                    </a-row>
                </div>
                <div v-if="collectionObj.belongPaymentScene != '4'">
                    <div>
                        <div class="model-row">
                            <span>付款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方银行账号：</span>
                                <span>{{ collectionObj.payerAcc }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款银行账号户名：</span>
                                <span>{{ collectionObj.payerName }}</span>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>付款方开户行：</span>
                            <span>{{ collectionObj.payerOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>付款方联行行号：</span>
                            <span>{{ collectionObj.payerOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                    <div>
                        <div class="model-row">
                            <span>收款方信息</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                            <span>收款方银行账号：</span>
                            <span>{{ collectionObj.payeeAcc }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>收款银行账号户名：</span>
                            <span>{{ collectionObj.payeeName }}</span>
                        </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>收款方开户行：</span>
                            <span>{{ collectionObj.payeeOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>收款方联行行号：</span>
                            <span>{{ collectionObj.payeeOpenBankNo }}</span>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div v-else>
                    <div>
                        <div class="model-row">
                            <span>付款账号信息</span>
                        </div>
                    </div>
                    <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                            <span>银行账号：</span>
                            <span>{{ collectionObj.payerAcc }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>银行账号户名：</span>
                            <span>{{ collectionObj.payerName }}</span>
                        </a-col>
                        </a-row>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <span>开户行：</span>
                            <span>{{ collectionObj.payerOpenBank }}</span>
                            </a-col>
                            <a-col :span="12">
                                <span>联行行号：</span>
                            <span>{{ collectionObj.payerOpenBankNo }}</span>
                            </a-col>
                    </a-row>
                </div>
                <div>
                    <div class="model-row">
                        <span>交易信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>已结算金额（元）：</span>
                            <span>{{ collectionObj.contractSettlAmount }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>已支付金额（元）：</span>
                            <span>{{ collectionObj.contractPaidAmount }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                    <a-col :span="12">
                        <span>本次支付金额（元）：</span>
                        <span>{{ collectionObj.transactionAmount }}</span>
                    </a-col>
                    <a-col :span="12">
                        <span>本次结算金额（元）:</span>
                        <span>{{ collectionObj.currentSettlementAmount }}</span>
                    </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>支付方式：</span>
                            <span>{{ collectionObj.paymentMethod == 1 ? '现金' : '非现金（承兑汇票、数字凭证等）' }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>支付日期：</span>
                            <span>{{ collectionObj.payDate }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>所属结算批次：</span>
                            <!-- <span>{{ collectionObj.settlementBatchName }}</span> -->
                            <span v-if="collectionObj.settlementBatchName">{{ collectionObj.settlementBatchName }}</span>
                            <a-button type="link" @click="handleSettleClick">选择</a-button>
                        </a-col>
                    </a-row>
                </div>
                <!-- <div>
                    <div class="model-row">
                        <span>审批流程</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同经办人：</span>
                            <span>{{ collectionObj.companyOperatorName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同一级复核人：</span>
                            <span>{{ collectionObj.companyContractPrimaryReviewerName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同二级复核人（如有）：</span>
                            <span>{{ collectionObj.companyContractSecondaryReviewerName ? collectionObj.companyContractSecondaryReviewerName : '' }}</span>
                        </a-col>
                    </a-row>
                </div> -->
                <div>
                    <div class="model-row">
                        <span>支付要件及付款成功凭证</span>
                    </div>
                    <div v-if="collectionObj.belongPaymentSceneName != '工资款'">
                        <a-row :gutter="24" class="model-col">
                            <!-- <a-col :span="12">
                                <span>上传支付要件及付款成功凭证：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of collectionObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a></span>
                                </div>
                            </a-col> -->
                            <a-col :span="24" >
                                <span>请上传与本次支付相关的发票及银行回单：</span>
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of collectionObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div v-else>
                        <a-row :gutter="24" style="margin-top: 20px;">
                            <a-col :span="24" style="display: flex; flex-dircetion: row; padding-left: 20px;">
                                <span>请上传对应成功支付的工资单：</span>
                                <div class="upload-wrapper" style="display: flex; flex-direction: column;">
                                    <span v-for="(item, index) of collectionObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" style="margin-top: 20px;">
                            <a-col :span="24" style="display: flex; flex-dircetion: row; padding-left: 20px;">
                                <span>请上传对应成功支付的回执单：</span>
                                <div class="upload-wrapper" style="display: flex; flex-direction: column;">
                                    <span v-for="(item, index) of collectionObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    
                </div>
                <div class="process">
                    <div class="model-row">
                        <span>审批信息</span>
                    </div>
                    <a-row :gutter="24" class="process-label">
                        <a-col :span="8">
                            <a-form-model-item label="操作" prop="currentHandle">
                                <a-select v-model="payCollectionForm.currentHandle" placeholder="请选择" v-if="collectionObj.processorFlag == 'companyOperator'">
                                    <a-select-option v-for="item of operationContractSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                                <a-select v-model="payCollectionForm.currentHandle" placeholder="请选择" v-else>
                                    <a-select-option v-for="item of operationSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="备注">
                                <a-input
                                    placeholder="请输入"
                                    v-model="payCollectionForm.remark"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-model-item label="上一步备注">
                                <a-input
                                    v-model="payCollectionForm.lastRemark"
                                    disabled
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <a-row :gutter="24" style="margin-top: 30px;text-align: center;">
                    <a-col>
                        <a-button @click="handleCollectionCancelModalClick" style="margin-right: 20px;">取消</a-button>
                        <a-button v-if="isCollectionEditBtn" type="primary" @click="handleCollectionEditModalClick" style="margin-right: 20px;">编辑</a-button>
                        <a-button type="primary" @click="handleCollectionSubmitModalClick" :loading="collectionSubmitLoading">确认</a-button>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>
        

        <!-- 支付信息补录日志 -->
        <a-modal v-model="isCollectionLogVisible" class="addContractTodoModal" title="审批日志" :footer="false">
            <div class="contract-log-wrapper">
                <div v-for="(item, index) of collectionLogList" :key="index">
                    <div>{{ item.handleDate }}:</div>
                    <div class="log-wrapper">
                        <span>{{ item.currentProcessorName }}</span><span>{{ item.currentHandleName }}</span><span>备注：{{ item.remark }}</span>
                    </div>
                </div>
                <div class="log-footer">
                    <a-button type="primary" @click="handleCollectionLogSubmitClick">确认</a-button>
                </div>
            </div>
        </a-modal>

        <!-- 支付信息补录编辑 -->
        <a-modal v-model="isCollectionEditVisible" class="addContractTodoModal" title="支付信息补录" ok-text="确认" cancel-text="取消" @ok="handleEditCollectionSubmitModalClick" @cancel="handleEditCollectionCancelClick">
            <a-form-model
                ref='editCollectionForm'
                :model="editCollectionForm"
                :rules="editCollectionRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="model-row">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="支付类型" prop="belongPaymentScene">
                    <a-select v-model="editCollectionForm.belongPaymentScene" placeholder="请选择" @change="handlePaymentSceneChange" disabled>
                        <a-select-option v-for="item of paymentSceneSelect" :key="item.value" :value="item.value">
                        {{ item.name }}
                        </a-select-option>
                    </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="任务名称" prop="taskName">
                    <a-input 
                        type="text" 
                        v-model="editCollectionForm.taskName"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="所属合同名称" prop="belongContractCode">
                    <a-select v-model="editCollectionForm.belongContractCode" placeholder="请选择" @change="handleContractCodeChange" disabled>
                        <a-select-option v-for="item of contractNameSelect" :key="item.value" :value="item.value">
                        {{ item.name }}
                        </a-select-option>
                    </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="所属项目名称">
                    <a-input 
                        type="text" 
                        v-model="editCollectionForm.prjName"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                </a-row>
                
                <div v-if="editCollectionForm.belongPaymentScene != '4'">
                    <div class="model-row">
                        <span>付款方信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payerAcc"
                            disabled
                        />
                        </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="付款银行账号户名">
                            <a-input 
                                type="text" 
                                v-model="editCollectionForm.payerName"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方开户行">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payerOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                    <div class="model-row">
                        <span>收款方信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                        <a-form-model-item label="收款方银行账号">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payeeAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款银行账号户名">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payeeName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="收款方开户行">
                            <a-input 
                                type="text" 
                                v-model="editCollectionForm.payeeOpenBank"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="收款方联行行号">
                            <a-input 
                                type="text" 
                                v-model="editCollectionForm.payeeOpenBankNo"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <div v-else>
                    <div class="model-row">
                        <span>付款账号信息</span>
                    </div>
                    <a-row :gutter="24">
                        <a-col :span="12">
                        <a-form-model-item label="银行账号">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payerAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="银行账号户名">
                        <a-input 
                            type="text" 
                            v-model="editCollectionForm.payerName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="开户行">
                            <a-input 
                                type="text" 
                                v-model="editCollectionForm.payerOpenBank"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="联行行号">
                            <a-input 
                                type="text" 
                                v-model="editCollectionForm.payerOpenBankNo"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                
                <div class="model-row">
                    <span>交易信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <a-input 
                                type="number"  
                                v-model="editCollectionForm.contractSettlAmount"
                                disabled
                                />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <a-input 
                                type="number"  
                                v-model="editCollectionForm.contractPaidAmount"
                                disabled
                                />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="本次支付金额（元）" prop="transactionAmount">
                    <a-input 
                        type="text"  
                        v-model="editCollectionForm.transactionAmount"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="本次结算金额（元）">
                    <a-input 
                        type="text"  
                        v-model="editCollectionForm.currentSettlementAmount"
                        />
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="支付方式" prop="belongPaymentScene">
                        <a-select v-model="editCollectionForm.paymentMethod" placeholder="请选择" @change="handlePaymentMethodChange">
                            <a-select-option v-for="item of paymentMethodSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="支付日期" prop="payDate">
                            <a-date-picker
                                v-model="editCollectionForm.payDate"
                                type="date"
                                placeholder="请选择支付日期"
                                style="width: 100%;"
                                format="YYYY-MM-DD"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{selectionRows.length > 0 ? selectionRows[0].batchName + '(' + selectionRows[0].companyName + ')' : ''}} </span>
                            <a-button type="link" @click="handleSettleClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="model-row">
                    <span>支付要件及付款成功凭证</span>
                </div>
                <div v-if="cacheValue != '4'">
                    <a-row :gutter="24">
                        <a-col :span="12" class="upload-wrapper-item">
                            <a-form-model-item class="upload-wrapper-settle" label="请上传与本次支付相关的发票及银行回单" prop="fileUrlList" >
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleEditCollectionChangeFile"
                                :before-upload="beforeEditCollectionImgUpload"
                                :default-file-list="editCollectionForm.fileUrlList"
                                :remove="removeUploadFile"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                <div v-else>
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-model-item class="upload-wrapper" label="请上传对应成功支付的工资单" prop="fileUrlList">
                                <a-upload
                                    :action="`${$fileUrl}/files`"
                                    @change="handleEditCollectionChangeFile"
                                    :before-upload="beforeEditCollectionImgUpload"
                                    :default-file-list="editCollectionForm.fileUrlList"
                                    :remove="removeUploadFile"
                                >
                                    <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                                </a-upload>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-model-item class="upload-wrapper" label="请上传对应成功支付的工资单" prop="fileReceiptUrlList">
                                <a-upload
                                    :action="`${$fileUrl}/files`"
                                    @change="handleEditCollectionChangeFile"
                                    :before-upload="beforeEditCollectionImgUpload"
                                    :default-file-list="editCollectionForm.fileReceiptUrlList"
                                    :remove="removeUploadFile"
                                >
                                    <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                                </a-upload>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
                
                <a-row :gutter="24">
                <a-col :span="24">
                    <div style="width: 100%; text-align:center;">
                        <a-checkbox disabled>
                        已在其他渠道付款成功
                        </a-checkbox>
                    </div>
                </a-col>
                </a-row>
            </a-form-model>
        </a-modal>


        <!-- 所属结算批次 -->
        <a-modal v-model="isSettleVisible" class="settleModal" title="结算批次" :footer="null">
            <a-form layout="inline">
                <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="批次名称">
                    <a-input v-model="searchParam.batchName" placeholder="请输入" style="width: 180px;"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="创建企业">
                    <a-input v-model="searchParam.companyName" placeholder="请输入" style="width: 180px;"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                        <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                        <a-button type="primary" @click="handleSettleSearchClick">查询</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
            <a-table
                :rowKey="((record, index) => {return index})"
                :columns="settleColumns"
                :data-source="settleData"
                :pagination="settlePagination"
                :loading="settleLoading"
                :customRow="handleClickRow"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange, type: 'radio', getCheckboxProps: handleCheckboxProps }"
                style="margin-top: 20px;"
            >
            </a-table>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handleSettleSubmitClick">确定</a-button>
            </div>
        </a-modal>
    </page-header-wrapper>
</template>
<script>
import { 
    getContractTodoList, 
    getContractDetailList, 
    contractSubmit,
    getPaymentTodoList,
    getPaymentPayDetail,
    getPaymentReqDetail,
    getPaymentSalaryDetail,
    paymentSubmit,
    getContractLog,
    getPayLog,
    getSelectAccount,
    getEditByProcess,
    getPayCollection,
    getPayCollectionDetail,
    getPayCollectionLog,
    payCollectionSubmit,
    getEditByPayCollection,
    getPaymentProcessInfo
} from '@/api/workbench'
import { getContractList, addContractInfo, getContractTypeAll, getGeneralContract, getThirdProject, getUserRole, getContractDetail, editContractInfo, getThirdPrjName, getDownloadFile, getCompanyCreditCode } from '@/api/contract'
import { getCurrentSmsInfo, getPaymentScene, getTaskName, getContractName, getReceive, getSettleList } from '@/api/payment'
import { resolveOnChange } from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import { fileUrl } from '@/utils/request'
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';

const columns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '5%'
    },
    {
        title: '合同类型',
        dataIndex: 'contractTypeName',
        key: 'contractTypeName',
        width: '10%'
    },
    {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: '15%'
    },
    {
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        width: '10%'
    },
    {
        title: '合同甲方',
        dataIndex: 'companyAName',
        key: 'companyAName',
        width: '10%'
    },
    {
        title: '合同乙方',
        dataIndex: 'companyBName',
        key: 'companyBName',
        width: '10%'
    },
    {
        title: '合同总额（元）',
        dataIndex: 'contractAmount',
        key: 'contractAmount',
        width: '10%'
    },
    {
        title: '当前处理人',
        dataIndex: 'currentProcessorName',
        key: 'currentProcessorName',
        width: '10%'
    },
    {
        title: '合同状态',
        dataIndex: 'contractStatus',
        key: 'contractStatus',
        scopedSlots: { customRender: 'contractStatus' },
        width: '10%'
    },
    {
        title: '操作', 
        key: 'operation', 
        scopedSlots: { customRender: 'operation' },
        width: '15%'
    },
]

const paymentColumns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '80px'
    },
    {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        width: '300px'
    },
    {
        title: '付款账户名称',
        dataIndex: 'payerName',
        key: 'payerName',
        width: '400px'
    },
    {
        title: '付款账号',
        dataIndex: 'payerAcc',
        key: 'payerAcc',
        width: '300px'
    },
    {
        title: '收款账户名称',
        dataIndex: 'payeeName',
        key: 'payeeName',
        width: '300px'
    },
    {
        title: '收款账号',
        dataIndex: 'payeeAcc',
        key: 'payeeAcc',
        width: '300px'
    },
    {
        title: '申请金额（元）',
        dataIndex: 'applicationAmount',
        key: 'applicationAmount',
        width: '180px'
    },
    {
        title: '上一步处理人',
        dataIndex: 'lastProcessorName',
        key: 'lastProcessorName',
        width: '120px'
    },
    {
        title: '操作', 
        key: 'operation', 
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
        width: '100px'
    },
]

const payCollectionColumns = [
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
    title: '所属支付场景',
    dataIndex: 'belongPaymentSceneName',
    key: 'belongPaymentSceneName',
    width: '300px'
  },
  {
    title: '所属合同名称',
    dataIndex: 'belongContractName',
    key: 'belongContractName',
    width: '300px'
  },
  {
    title: '付款账户名称',
    dataIndex: 'payerName',
    key: 'payerName',
    width: '300px'
  },
  {
    title: '付款账号',
    dataIndex: 'payerAcc',
    key: 'payerAcc',
    width: '300px'
  },
  {
    title: '收账户名称',
    dataIndex: 'payeeName',
    key: 'payeeName',
    width: '300px'
  },
  {
    title: '收款账号',
    dataIndex: 'payeeAcc',
    key: 'payeeAcc',
    width: '300px'
  },
  {
    title: '金额（元）',
    dataIndex: 'transactionAmount',
    key: 'transactionAmount',
    width: '300px'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '120px',
    fixed: 'right',
    align: "center"
  },
]


const operationSelect = [
    {
        value: 1,
        name: '通过'
    },
    {
        value: 2,
        name: '驳回'
    }
]

const operationContractSelect = [
    {
        value: 1,
        name: '通过'
    },
    {
        value: 2,
        name: '作废'
    }
]

const cycleSelect = [
  {
    value: '1',
    name: '年度'
  },
  {
    value: '2',
    name: '季度'
  },
  {
    value: '3',
    name: '月度'
  }
]

const settleColumns = [
  {
        title: '批次名称',
        dataIndex: 'batchName',
        key: 'batchName',
        width: '100px'
    },
    {
        title: '创建日期',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '100px'
    },
    {
        title: '创建企业',
        dataIndex: 'companyName',
        key: 'companyName',
        width: '100px'
    },
]

export default {
    data () {
        this.columns = columns
        this.paymentColumns = paymentColumns
        this.payCollectionColumns = payCollectionColumns
        this.settleColumns = settleColumns
        return {
            activeKey: '1',
            paymentData: [],
            paymentCount: '',
            contractData: [],
            contractCount: '',
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
            paymentPagination: {
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
                    this.handlePaymentPageChange(page, pageSize)
                },
                onShowSizeChange: (current, size) => {
                    this.handlePaymentShowSizeChange(current, size)
                },
            },
            isAddVisible: false,
            isPayVisible: false,
            contractObj: {},
            paymentObj: {},
            addForm: {
                companyContractOperator: undefined,
                companyContractPrimaryReviewer: undefined,
                currentHandle: undefined,
                companyContractSecondaryReviewer: undefined,
                remark: ''
            },
            rules: {
                companyContractOperator: [{ required: true, message: '请选择合同经办人', trigger: 'change' }],
                companyContractPrimaryReviewer: [{ required: true, message: '请选择合同一级经办人', trigger: 'change' }],
                currentHandle: [{ required: true, message: '请选择', trigger: 'change' }],
            },
            paymentForm: {
                currentHandle: undefined,
                remark: ''
            },
            paymentRules: {
                currentHandle: [{ required: true, message: '请选择', trigger: 'change' }],
            },
            operationSelect,
            agentSelect: [],
            agentSelectA: [],
            reviewSelect1: [],
            reviewSelect2: [],
            isLogVisible: false,
            contractLogList: [],
            isPayLogVisible: false,
            payLogList: [],
            isShowAWorker: false,
            isShowBWorker: false,
            payerData: [],
            fileUrl,
            scene: '',
            isShowVerification: false,
            verificationForm: {
                code: ''
            },
            verificationRules: {
                code: [{ required: true, message: '请输入短信验证码', trigger: 'change' }],
            },
            cacheDataObj: {},
            isEditBtn: false,
            isEditStatus: false,
            projectType: [],
            cycleSelect,
            payerNameSelect: [],
            peasantNameSelect: [],
            payeeNameSelect: [],
            peasantPayeeNameSelect: [],
            editForm: {
                contractCreate: '2',
                contractType: [],
                belongContractCode: undefined,
                belongProjectCode: undefined,
                contractName: '',
                contractCode: '',
                contractSignDate: '',
                contractStartDate: '',
                contractEndDate: '',
                contractAmount: '',
                prepaymentAmou: '',
                warrantyAmount: '',
                contractPaymentPeriod: undefined,
                contractPaymentProportion: '',
                companyAName: '',
                contractACompanyCode: '',
                payerAcc: '',
                payerName: undefined,
                payerOpenBank: '',
                payerOpenBankNo: '',
                peasantWorkerPayerName: undefined,
                peasantWorkerPayerAcc: '',
                peasantWorkerPayerOpenBank: '',
                peasantWorkerPayerOpenBankNo: '',
                companyBName: '',
                contractBCompanyCode: '',
                payeeAcc: '',
                payeeName: '',
                payeeOpenBank: '',
                payeeOpenBankNo: '',
                peasantWorkerPayeeName: '',
                peasantWorkerPayeeAcc: '',
                peasantWorkerPayeeOpenBank: '',
                peasantWorkerPayeeOpenBankNo: '',
                contractOperator: undefined,
                contractPrimaryReviewer: undefined,
                contractSecondaryReviewer: undefined,
                companyOperator: undefined,
                companyContractDetailOperator: undefined,
                fileUrlList: [],
                settledAmount: '',
                paidAmount: ''
            },
            editRules: {
                contractCreate: [{ required: true, message: '请选择合同创建人', trigger: 'change' }],
                contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
                belongContractCode: [{ required: true, message: '请输入归属总包合同名称', trigger: 'change' }],
                belongProjectCode: [{ required: true, message: '请输入归属三级项目信息', trigger: 'change' }],
                contractName: [{ required: true, message: '请输入合同名称', trigger: 'change' }],
                contractCode: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
                contractSignDate: [{ required: true, message: '请选择合同签订日期', trigger: 'change' }],
                contractStartDate: [{ required: true, message: '请选择合同开始日期', trigger: 'change' }],
                contractEndDate: [{ required: true, message: '请选择合同结束日期', trigger: 'change' }],
                contractAmount: [{ required: true, message: '请输入合同总金额', trigger: 'change' }],
                prepaymentAmou: [{ required: true, message: '请输入合同预付款金额', trigger: 'change' }],
                warrantyAmount: [{ required: true, message: '请输入合同质保金金额', trigger: 'change' }],
                contractPaymentPeriod: [{ required: true, message: '请输入合同付款周期', trigger: 'change' }],
                contractPaymentProportion: [{ required: true, message: '请输入合同约定现金支付比例', trigger: 'change' }],
                companyAName: [{ required: true, message: '请输入合同甲方公司名称', trigger: 'change' }],
                contractACompanyCode: [{ required: true, message: '请输入合同甲方公司统一社会信用代码', trigger: 'change' }],
                payerAcc: [{ required: true, message: '请输入合同甲方银行账号', trigger: 'change' }],
                payerName: [{ required: true, message: '请输入合同甲方银行账户名称', trigger: 'change' }],
                payerOpenBank: [{ required: true, message: '请输入合同甲方开户行', trigger: 'change' }],
                payerOpenBankNo: [{ required: true, message: '请输入合同甲方联行行号', trigger: 'change' }],
                companyBName: [{ required: true, message: '请输入合同乙方公司名称', trigger: 'change' }],
                contractBCompanyCode: [{ required: true, message: '请输入合同乙方公司统一社会信用代码', trigger: 'change' }],
                payeeAcc: [{ required: true, message: '请输入合同乙方银行账号', trigger: 'change' }],
                payeeName: [{ required: true, message: '请输入合同乙方银行账户名称', trigger: 'change' }],
                payeeOpenBank: [{ required: true, message: '请输入合同乙方开户行', trigger: 'change' }],
                payeeOpenBankNo: [{ required: true, message: '请输入合同乙方联行行号', trigger: 'change' }],
                contractOperator: [{ required: true, message: '请选择合同经办人', trigger: 'change' }],
                contractPrimaryReviewer: [{ required: true, message: '请选择合同一级复核人', trigger: 'change' }],
                contractSecondaryReviewer: [{ required: true, message: '请选择合同二级复核人', trigger: 'change' }],
                fileUrlList: [{ required: true, message: '请上传合同文件', trigger: 'change' }],
                companyOperator: [{ required: true, message: '请选择甲方企业经办人', trigger: 'change' }],
                companyContractPrimaryReviewer: [{ required: true, message: '请选择合同一级复核人', trigger: 'change' }],
                companyContractDetailOperator: [{ required: true, message: '请选择合同经办人', trigger: 'change' }],
                settledAmount: [{ required: true, message: '请输入合同已结算金额', trigger: 'change' }],
                paidAmount: [{ required: true, message: '请输入合同已支付金额', trigger: 'change' }],
            },
            imgKey: '',
            defaultPeriod: undefined,
            thirdProjectSelect: [],
            isContractType: true,
            belongCodeDisabled: false,
            belongGeneralType: [],
            agentSelect: [],
            reviewSelect1: [],
            reviewSelect2: [],
            reviewSelect3: [],
            agentSelectA: [],
            agentSelectB: [],
            cacheScope: {},
            cacheUrl: '',
            isShowProName: true,
            operationContractSelect,
            payCollectionCount: '',
            payCollectionData: [],
            payCollectionPagination: {
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
                    this.handlePayCollectionPageChange(page, pageSize)
                },
                onShowSizeChange: (current, size) => {
                    this.handlePayCollectionShowSizeChange(current, size)
                },
            },
            paymentSceneSelect: [],
            isCollectionVisible: false,
            collectionObj: {},
            payCollectionForm: {
                currentHandle: undefined,
                remark: ''
            },
            payCollectionRules: {
                currentHandle: [{ required: true, message: '请选择', trigger: 'change' }],
            },
            isCollectionLogVisible: false,
            collectionLogList: [],
            isCollectionEditBtn: false,
            editCollectionForm: {
                belongPaymentScene: '',
                taskName: '',
                prjName: '',
                payerAcc: '',
                payerName: '',
                payerOpenBank: '',
                payerOpenBankNo: '',
                payeeAcc: '',
                payeeName: '',
                payeeOpenBank: '',
                payerOpenBankNo: '',
                belongContractCode: '',
                transactionAmount: '',
                currentSettlementAmount: '',
                fileUrlList: [],
                paymentMethod: '',
                payDate: '',
                fileReceiptUrlList: []
            },
            editCollectionRules: {
                belongPaymentScene: [{ required: true, message: '请输入一级项目编号', trigger: 'change' }],
                taskName: [{ required: true, message: '请输入一级项目名称', trigger: 'change' }],
                belongContractCode: [{ required: true, message: '请选择项目投资年度', trigger: 'change' }],
                transactionAmount: [{ required: true, message: '请输入建设规模及内容', trigger: 'change' }],
                fileUrlList: [{ required: true, message: '请上传', trigger: 'change' }],
                fileReceiptUrlList: [{ required: true, message: '请上传', trigger: 'change' }]
            },
            isCollectionEditVisible: false,
            contractNameSelect: [],
            cacheCollectionList: [],
            cacheCollectionScope: {},
            companyASelect: [],
            companyBSelect: [],
            isSettleVisible: false,
            searchParam: {
                batchName: '',
                companyName: ''
            },
            advanced: false,
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
            paymentMethodSelect: [
                {
                    value: '1',
                    name: '现金'
                },
                {
                    value: '2',
                    name: '非现金(承兑汇票、数字凭证等)'
                }
            ],
            cacheValue: '',
            cacheReceiptCollectionList: [],
            collectionSubmitLoading: false,
            contractOnSubmitLoading: false,
            isSalarySelect: false,
            cacheSalary: '',
            intervalID: ''
        }
    },
    watch: {
        'contractObj.contractTypeName'(newVal) {
            if(newVal == '总承包合同') {
                this.isShowBWorker = true
                this.isShowAWorker = false
            } else {
                this.isShowBWorker = false
                this.isShowAWorker = false
            }

            if(newVal == '劳务分包合同') {
                this.isShowAWorker = true
            }

            if(newVal.indexOf('专业分包') != -1) {
                this.isShowAWorker = true
            }
        },
        'editForm.contractType'(newVal) {
            if(newVal[0] == 1) {
                this.isShowBWorker = true
                this.isShowAWorker = false
            } else {
                this.isShowBWorker = false
                this.isShowAWorker = false
            }

            if(newVal[0] == 2) {
                this.isShowAWorker = true
            }
            if(newVal[0] == 3) {
                this.isShowAWorker = true
            }
        },
        'editForm.belongProjectName'(newVal) {
            if(newVal) {
                getThirdProject(newVal).then(res => {
                    this.thirdProjectSelect = res
                })
                
            }
            
        },
        'editForm.belongProjectCode'(newVal) {
            this.editForm.belongContractCode = newVal
        },
        isEditStatus(newVal) {
            if(newVal) {
                this.imgKey = ''
            } else {
                this.imgKey = Math.random()
            }
        },
        'editForm.belongContractName'(newVal) {
            if(this.belongGeneralType && this.belongGeneralType.length > 0) {
                this.belongGeneralType.map(v => {
                    if(newVal == v.name) {
                        this.editForm.belongContractCode = v.value
                    }
                })
            }
        },
        'collectionObj.settlementBatchId'(newVal) {
            if(newVal) {
                let result = []
                this.settleData && this.settleData.map(v => {
                    if(v.id == newVal) {
                        result.push(v)
                    }
                })
                this.selectionRows = result
                console.log(this.selectionRows)
            }
        }
    },
    mounted() {
        this.getContractTodoInfo()
        this.getPaymentTodoInfo()
        this.getContractTypeSelect()
        this.getGeneralContractList()
        this.getPayCollectionList()
        this.getPaymentSceneList()
        this.getContractNameList()
        this.getSettleInfo()

        // getPaymentProcessInfo(186).then(res => {
        //     let url = res.data.url
        //     console.log(url)
        //     if (res.data.paymentStatus === 4) {
        //      let moda = this.$info({
        //             title: '提示',
        //             content: () => <div> 银行制单成功，请前往企业网银进行后续操作。<a href={url} >立即前往 {url}</a> </div>,
        //             onOk() {
        //             console.log('OK');
        //             },
        //             onCancel() {
        //             console.log('Cancel');
        //             },
        //             class: 'test',
        //         });
        //          setTimeout(() => {
        //         moda.update(
        //             {
        //             title: '提示',
        //             content: h => <div> 银行制单成功，请前往企业网银进行后续操作。<a href={url} target="_blank">立即前往</a> </div>, 
        //             }
        //         )
        //     }, 5000);
        //     }
           
        //                                 //   Modal.destroyAll();
        // })
        
      
       
    },
    destroyed() {
        clearInterval(this.intervalID)
    },
    methods: {
        // 获取合同审批信息
        getContractTodoInfo () {
            let reqObj = {
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getContractTodoList(reqObj).then(res => {
                const data = res.data
                this.contractData = data.pageList
                this.pagination.total = data.rowCount
                this.contractCount = data.rowCount
            })
        },
        // 获取支付审批信息
        getPaymentTodoInfo() {
            let reqObj = {
                pageNum: this.paymentPagination.current,
                pageSize: this.paymentPagination.pageSize
            }
            getPaymentTodoList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    const data = res.data
                    this.paymentData = data.pageList
                    this.paymentCount = data.rowCount
                }
            })
        },
        getPaymentSceneList() {
            getPaymentScene().then(res => {
                this.paymentSceneSelect = res
            })
        },
        getContractTypeSelect () {
            getContractTypeAll().then(res => {
                if(res && res.length > 0) {
                this.projectType = res
                }
            })
        },
        getGeneralContractList() {
            getGeneralContract().then(res => {
                if(res && res.length > 0) {
                this.belongGeneralType = res
                } 
            })
        },
        getPayCollectionList() {
            let reqObj = {
                pageNum: this.payCollectionPagination.current,
                pageSize: this.payCollectionPagination.pageSize
            }
            getPayCollection(reqObj).then(res => {
                
                const data = res.data
                this.payCollectionData = data.pageList
                this.payCollectionCount = data.rowCount
            })
        },
        getSettleInfo() {
            this.settleLoading = true
            let reqObj = {
                batchName: this.searchParam.batchName,
                companyName: this.searchParam.companyName,
                pageNum: this.settlePagination.current,
                pageSize: this.settlePagination.pageSize
            }
            getSettleList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    this.settleLoading = false
                    const data = res.data
                    this.settleData = data.pageList
                    this.settlePagination.total = data.rowCount
                }
            })
        },
        handleBelongContractCodeChange(value) {
            let newValue = ''
            
            getThirdPrjName(value).then(res => {
                
                if(res.status == 1) {
                let data = res.data
                
                if(data) {
                    getThirdProject(data).then(res => {
                    
                    this.thirdProjectSelect = res
                    this.thirdProjectSelect && this.thirdProjectSelect.map(res => {
                        if(data == res.name) {
                        newValue = res.value
                        }
                    })
                    this.addForm.belongProjectCode = String(newValue)
                    })
                }
                // this.thirdProjectSelect && this.thirdProjectSelect.map(res => {
                //   if(data == res.name) {
                //     newValue = res.value
                //   }
                // })
                // this.addForm.belongProjectCode = String(newValue)
                this.belongCodeDisabled = true
                }
            })
        },
        // getUserRoleList(id, companyA, companyB) {

        //     console.log(11111111111)
            
        //     if(this.editForm.contractCreate == 1) {
        //         companyA = this.editForm.companyAName
        //         companyB = this.editForm.contractACompanyCode
        //     } else {
        //         companyA = this.editForm.companyBName
        //         companyB = this.editForm.contractBCompanyCode
        //     }
        //     this.$nextTick(() => {
        //         if(id == 1) {
        //         if(this.editForm.contractCreate == 2) {
        //             getUserRole(1, this.editForm.companyAName, this.editForm.contractACompanyCode).then(res => {
        //                 let result = []
        //                 if(res && Array.isArray(res.data)) {
        //                 res.data.map(v => {
        //                     let obj = {
        //                     name: v.userName,
        //                     value: String(v.id)
        //                     }
        //                     result.push(obj)
        //                 })
        //                 this.agentSelectA = result
        //                 console.log(this.agentSelectA)
        //                 }
        //             })
        //             getUserRole(1, this.editForm.companyBName, this.editForm.contractBCompanyCode).then(res => {
        //                 let result = []
        //                 if(res && Array.isArray(res.data)) {
        //                 res.data.map(v => {
        //                     let obj = {
        //                     name: v.userName,
        //                     value: String(v.id)
        //                     }
        //                     result.push(obj)
        //                 })
        //                 this.agentSelect = result
        //                 // this.agentSelectA = result
        //                 this.agentSelectB = result
        //                 }
        //             })
        //         } else {
        //             getUserRole(1, companyA, companyB).then(res => {
        //                 let result = []
        //                 if(res && Array.isArray(res.data)) {
        //                 res.data.map(v => {
        //                     let obj = {
        //                     name: v.userName,
        //                     value: String(v.id)
        //                     }
        //                     result.push(obj)
        //                 })
        //                 this.agentSelect = result
        //                 // this.agentSelectA = result
        //                 this.agentSelectB = result
        //                 }
        //             })
        //         }
                
        //     } else if(id == 2) {
        //         getUserRole(2, companyA, companyB).then(res => {
        //         let result = []
        //         let result1 = []
        //         if(res && Array.isArray(res.data)) {
        //             res.data.map(v => {
        //             let obj = {
        //                 name: v.userName,
        //                 value: String(v.id)
        //             }
        //             result.push(obj)
        //             result1.push(obj)
        //             })
        //             this.reviewSelect1 = result
        //             this.reviewSelect3 = result1
        //             console.log(this.reviewSelect3)
        //         }
        //         })
        //     } else if(id == 3) {
        //         getUserRole(3, companyA, companyB).then(res => {
        //         let result = []
        //         if(res && Array.isArray(res.data)) {
        //             res.data.map(v => {
        //             let obj = {
        //                 name: v.userName,
        //                 value: String(v.id)
        //             }
        //             result.push(obj)
        //             })
        //             this.reviewSelect2 = result
        //         }
        //         })
        //     }
        //     })
        //     console.log(this.agentSelectA)
        //     console.log(this.reviewSelect1)
        //     console.log(this.reviewSelect2)
        //     console.log(this.agentSelectB)
      
        // },
        handlePageChange(page, pageSize) {
            console.log(page, pageSize)
            this.pagination.current = page
            // this.getContractTodoInfo()
        },
        handleShowSizeChange(current, size) {
            console.log(current, size)
            this.pagination.pageSize = size
            // this.getContractTodoInfo()
        },
        handlePaymentPageChange(page, pageSize) {
            console.log(page, pageSize)
            this.paymentPagination.current = page
            // this.getContractTodoInfo()
        },
        handlePaymentShowSizeChange(current, size) {
            console.log(current, size)
            this.paymentpPagination.pageSize = size
            // this.getContractTodoInfo()
        },
        handlePayCollectionPageChange(page, pageSize) {
            this.payCollectionPagination.current = page
        },
        handlePayCollectionShowSizeChange(current, size) {
            this.payCollectionPagination.pageSize = size
        },
        handleTabsChange() {
            // this.selectionRows = []
            // this.selectedRowKeys = []
        },
        handleAuditClick(scope) {
            this.isAddVisible = true
            this.cacheScope = scope
            getContractDetailList(scope.id).then(res => {
                if(res.status == 1 && res.data) {
                    this.$nextTick(() => {
                        this.contractObj = res.data
                        this.cacheUrl = res.data.contractFile
                        this.isEditBtn = this.contractObj.processorFlag == 'contractOperator' ? true : false
                        let newStr = this.contractObj.contractFile.substring(0, this.contractObj.contractFile.length - 1).split(',')
                        let uploadArr = []
                        newStr && newStr.map(res => {
                            // res = res.split('#')[0]
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            uploadArr.push(resObj)
                        })
                        this.contractObj.contractFile = uploadArr
                        if(!this.contractObj.settlementBatchId) {
                            this.selectionRows = []
                        }
                        // if(this.contractObj.contractACompanyCode && this.contractObj.contractBCompanyCode) {
                        //     this.getUserRoleList(1, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
                        //     this.getUserRoleList(2, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
                        //     this.getUserRoleList(3, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
                        // }
                    })
                }
            })

        },
        handlePaymentAuditClick(scope) {
            this.isPayVisible = true
            let self = this
            this.scene = scope.scene
            if(scope.paymentScene >= 1 && scope.paymentScene <= 6) {
                getPaymentReqDetail(scope.id).then(res => {
                    console.log('pay: ', res)
                    if(res.status == 1 && res.data) {
                        self.paymentObj = res.data
                        let invoiceStr = self.paymentObj.invoiceFile && self.paymentObj.invoiceFile.substring(0, self.paymentObj.invoiceFile.length - 1).split(',')
                        let invoiceArr = []
                        invoiceStr && invoiceStr.map(res => {
                            // res = res.split('#')[0]
                            // invoiceArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            invoiceArr.push(resObj)
                        })
                        self.paymentObj.invoiceFile = invoiceArr

                        let approveStr = self.paymentObj.approveFile && self.paymentObj.approveFile.substring(0, self.paymentObj.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
                            // res = res.split('#')[0]
                            // approveArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            approveArr.push(resObj)
                        })
                        self.paymentObj.approveFile = approveArr

                        let otherStr = self.paymentObj.otherFile && self.paymentObj.otherFile.substring(0, self.paymentObj.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
                            // res = res.split('#')[0]
                            // otherArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            otherArr.push(resObj)
                        })
                        self.paymentObj.otherFile = otherArr

                    }
                })
            } else if(scope.paymentScene >= 7 && scope.paymentScene <= 13) {
                getPaymentPayDetail(scope.id).then(res => {
                    console.log("req: ", res)
                    if(res.status == 1 && res.data) {
                        self.paymentObj = res.data

                        let invoiceStr = self.paymentObj.invoiceFile && self.paymentObj.invoiceFile.substring(0, self.paymentObj.invoiceFile.length - 1).split(',')
                        let invoiceArr = []
                        invoiceStr && invoiceStr.map(res => {
                            // res = res.split('#')[0]
                            // invoiceArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            invoiceArr.push(resObj)
                        })
                        self.paymentObj.invoiceFile = invoiceArr

                        let approveStr = self.paymentObj.approveFile && self.paymentObj.approveFile.substring(0, self.paymentObj.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
                            // res = res.split('#')[0]
                            // approveArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            approveArr.push(resObj)
                        })
                        self.paymentObj.approveFile = approveArr

                        let otherStr = self.paymentObj.otherFile && self.paymentObj.otherFile.substring(0, self.paymentObj.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
                            // res = res.split('#')[0]
                            // otherArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            otherArr.push(resObj)
                        })
                        self.paymentObj.otherFile = otherArr

                        let newStr = self.paymentObj.paymentDetails && self.paymentObj.paymentDetails.substring(0, self.paymentObj.paymentDetails.length - 1).split(',')
                        let uploadArr = []
                        newStr && newStr.map(res => {
                            // let obj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let obj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            uploadArr.push(obj)
                        })
                        self.paymentObj.paymentDetails = uploadArr
                    }
                }) 
            } else if(scope.paymentScene > 13) {
                getPaymentSalaryDetail(scope.id).then(res => {
                    console.log("salary: ", res)
                    if(res.status == 1 && res.data) {
                        self.paymentObj = res.data
                        let invoiceStr = self.paymentObj.invoiceFile && self.paymentObj.invoiceFile.substring(0, self.paymentObj.invoiceFile.length - 1).split(',')
                        let invoiceArr = []
                        invoiceStr && invoiceStr.map(res => {
                            // res = res.split('#')[0]
                            // invoiceArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            invoiceArr.push(resObj)
                        })
                        self.paymentObj.invoiceFile = invoiceArr

                        let approveStr = self.paymentObj.approveFile && self.paymentObj.approveFile.substring(0, self.paymentObj.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
                            // res = res.split('#')[0]
                            // approveArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            approveArr.push(resObj)
                        })
                        self.paymentObj.approveFile = approveArr

                        let otherStr = self.paymentObj.otherFile && self.paymentObj.otherFile.substring(0, self.paymentObj.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
                            // res = res.split('#')[0]
                            // otherArr.push(res)
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            otherArr.push(resObj)
                        })
                        self.paymentObj.otherFile = otherArr

                        let newSalaryStr = self.paymentObj.salaryDetails && self.paymentObj.salaryDetails.substring(0, self.paymentObj.salaryDetails.length - 1).split(',')
                        let uploadSalaryArr = []
                        newSalaryStr && newSalaryStr.map(res => {
                            // res = res.split('#')[0]
                            // let resObj = {
                            //     name: res.split('#')[0],
                            //     url: res.split('#')[1]
                            // }
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            uploadSalaryArr.push(resObj)
                        })
                        self.paymentObj.salaryDetails = uploadSalaryArr
                    }
                })
            }
        },
        handleSubmitModalClick () {
            // e.preventDefault()
            let self = this
            this.$refs.ruleContractForm.validate(valid => {
                if(valid) {
                    this.contractOnSubmitLoading = true
                    let reqObj = Object.assign({}, this.addForm)
                    reqObj.contractCode = this.contractObj.contractCode
                    reqObj.currentProcessor = this.contractObj.currentProcessor
                    reqObj.id = this.contractObj.id
                    reqObj.processStatus = this.contractObj.processStatus
                    reqObj.processorFlag = this.contractObj.processorFlag
                    reqObj.step = this.contractObj.step
                    console.log(reqObj.processorFlag)
                    if(this.contractObj.contractCreate == 1) {
                        reqObj.companyOperator = Number(reqObj.contractOperator)
                        reqObj.companyContractPrimaryReviewer = Number(reqObj.contractPrimaryReviewer)
                        reqObj.companyContractSecondaryReviewer = reqObj.contractSecondaryReviewer ? Number(reqObj.contractSecondaryReviewer) : null
                    } else  if (reqObj.processorFlag == 'companyOperator' && this.contractObj.contractCreate == 2){
                        reqObj.contractOperator = Number(reqObj.contractOperator)
                        reqObj.contractPrimaryReviewer = Number(reqObj.contractPrimaryReviewer)
                        reqObj.contractSecondaryReviewer = reqObj.contractSecondaryReviewer ? Number(reqObj.contractSecondaryReviewer) : null
                    } else {
                        reqObj.contractOperator = Number(reqObj.contractOperator)
                        reqObj.contractPrimaryReviewer = Number(reqObj.contractPrimaryReviewer)
                        reqObj.contractSecondaryReviewer = reqObj.contractSecondaryReviewer ? Number(reqObj.contractSecondaryReviewer) : null
                        reqObj.companyOperator = reqObj.companyOperator ? Number(reqObj.companyOperator) : null
                    }
                    // reqObj.companyContractOperator = Number(reqObj.companyContractOperator)
                    // reqObj.companyContractPrimaryReviewer = Number(reqObj.companyContractPrimaryReviewer)
                    // reqObj.companyContractSecondaryReviewer = Number(reqObj.companyContractSecondaryReviewer)
                    // if(reqObj.processorFlag != 'companyOperator' && this.contractObj.contractCreate != 1) {
                    //     delete reqObj.companyOperator
                    //     delete reqObj.companyContractPrimaryReviewer
                    //     delete reqObj.companyContractSecondaryReviewer
                    // }
                    contractSubmit(reqObj).then(res => {
                        console.log(res)
                        if(res.status == 1) {
                            setTimeout(() => {
                                this.contractOnSubmitLoading = false
                            }, 1000)
                            this.isAddVisible = false
                            this.$message.success(res.data)
                            self.$refs.ruleContractForm.resetFields()
                            this.getContractTodoInfo()
                        } else {
                            this.$message.error(res.data)
                        }
                    })
                }
            })
        },
        handleCancelClick() {
            this.isAddVisible = false
        },
        handlePaymentSubmitClick(e) {
            e.preventDefault()
            let self = this
            this.$refs.rulePaymentForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.paymentForm)
                    reqObj.belongId = this.paymentObj.belongId
                    reqObj.contractCode = this.paymentObj.contractCode
                    reqObj.currentProcessor = this.paymentObj.currentProcessor
                    reqObj.id = this.paymentObj.id
                    reqObj.paymentScene = this.paymentObj.paymentScene
                    reqObj.processStatus = this.paymentObj.processStatus
                    reqObj.processorFlag = this.paymentObj.processorFlag
                    reqObj.step = this.paymentObj.step
                    reqObj.taskName = this.paymentObj.taskName
                    reqObj.createUser = this.paymentObj.createUser
                    reqObj.payerAcc = this.paymentObj.payerAcc
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : this.paymentObj.settlementBatchId
                    

                    // this.isPayVisible = false
                    // this.isShowVerification = true
                    // getCurrentSmsInfo().then(res => {
                    //     if(res.status == 1) {
                    //         this.$message.success(res.data.data)
                    //     } else {
                    //         this.$message.warning(res.data.data)
                    //     }
                    // })
                    // this.cacheDataObj = reqObj
                    // return
                    paymentSubmit(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isPayVisible = false
                            this.$message.success(res.data)
                            this.$refs.rulePaymentForm.resetFields()
                            this.getPaymentTodoInfo()

                            if (reqObj.currentHandle === 1 && this.paymentObj.nodeList[this.paymentObj.nodeList.length-1].handleStatus === '进行中') {
                                 let moda = this.$info({
                                    title: '提示',
                                    content: '银行制单中，请等待....',
                                    onOk: () => {
                                    console.log('OK');
                                     clearInterval(this.intervalID)
                                    },
                                    onCancel() {
                                    console.log('Cancel');
                                    },
                                    class: 'test',
                                });
                                getPaymentProcessInfo(this.paymentObj.id)
                                this.intervalID = setInterval(() => {
                                    getPaymentProcessInfo(this.paymentObj.id).then(res => {
                                        // Modal.destroyAll();
                                        let url = res.data.url
                                        if (res.data.paymentStatus === 1 || res.data.paymentStatus === 0 || res.data.paymentStatus === 3) {
                                            // this.$info({
                                            //     title: '提示',
                                            //     content: '银行制单中，请等待....',
                                            //     onOk() {
                                            //     console.log('OK');
                                            //      clearInterval( this.intervalID)
                                            //     },
                                            //     onCancel() {
                                            //     console.log('Cancel');
                                            //     },
                                            //     class: 'test',
                                            // });
                                        }
                                        if (res.data.paymentStatus === 4) {
                                            // this.$info({
                                            //     title: '提示',
                                            //     content: h => <div> 银行制单成功，请前往企业网银进行后续操作。<a href={url} target="_blank">立即前往</a> </div>,
                                            //     onOk() {
                                            //     console.log('OK');
                                            //      clearInterval( this.intervalID)
                                            //     },
                                            //     onCancel() {
                                            //     console.log('Cancel');
                                            //     },
                                            //     class: 'test',
                                            // });
                                            moda.update(
                                                {
                                                title: '提示',
                                                content: h => <div> 银行制单成功，请前往企业网银进行后续操作。<a href={url} target="_blank">立即前往</a> </div>, 
                                                }
                                            )
                                        }
                                        if (res.data.paymentStatus === 2) {
                                             moda.update(
                                                {
                                               title: '提示',
                                                content: '银行制单失败，请联系工作人员处理，联系电话15842666107。',
                                                }
                                            )
                                            // this.$info({
                                            //     title: '提示',
                                            //     content: '银行制单失败，请联系工作人员处理，联系电话15842666107。',
                                            //     onOk() {
                                            //     console.log('OK');
                                            //      clearInterval( this.intervalID)
                                            //     },
                                            //     onCancel() {
                                            //     console.log('Cancel');
                                            //     },
                                            //     class: 'test',
                                            // });
                                        }
                                    })
                                }, 5000);
                            }
                        }
                    })
                    
                }
            })
        },
        handlePaymentCancelClick() {
            this.isPayVisible  = false
        },
        handleLogClick(code) {
            this.isLogVisible = true
            console.log(code)
            getContractLog(code).then(res => {
                if(res.status == 1 && res.data) {
                    this.contractLogList = res.data
                }
            })
        },
        handleLogSubmitClick() {
            this.isLogVisible = false
        },
        handlePayLogClick(id) {
            this.isPayLogVisible = true
            getPayLog(id).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.payLogList = res.data
                }
            })
        },
        handlePayLogSubmitClick() {
            this.isPayLogVisible = false
        },
        handleDownloadClick() {

        },
        handlePayerSearch(value) {
            console.log(value)
            let reqObj = {
                accountName: value,
                accountType: this.paymentObj.paymentScene,
                companyName: '',
                unifiedCreditCode: ''
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    let result = []
                    res.data && res.data.map(v => {
                        let accountObj = {
                            label: v.accountNum,
                            value: v.accountNum
                        }
                        result.push(accountObj)
                    })
                    this.payerData = result
                }
            })
        },
        handlePayerChange() {

        },
        // handleCompanyContractOperatorFocus() {
        //     let reqObj = {
        //         accountName: '',
        //         accountType: 1,
        //         companyName: contractObj.contractCreate == 1 ? this.contractObj.companyAName : this.contractObj.companyBName,
        //         unifiedCreditCode: contractObj.contractCreate == 1 ? this.contractObj.contractACompanyCode : this.contractObj.contractBCompanyCode
        //     }
        //     getSelectAccount(reqObj).then(res => {
        //         console.log(res)
        //         if(res.status == 1 && res.data) {
        //         let result = []
        //         res.data && res.data.map(v => {
        //             let resObj = {
        //             name: v.accountName,
        //             value: v.accountNum,
        //             openBank: v.openBank,
        //             openBankNum: v.openBankNum
        //             }
        //             result.push(resObj)
        //         })
        //         this.agentSelect = result
        //         }
        //     })
        // },
        handleVerificationClick(e) {
            e.preventDefault()
            this.$refs.verificationForm.validate(valid => {
                if(valid) {
                    this.cacheDataObj = {}
                    this.cacheDataObj.smsCode = this.verificationForm.code
                    console.log(this.cacheDataObj)
                    paymentSubmit(this.cacheDataObj).then(res => {
                        if(res.status == 1) {
                            this.isPayVisible = false
                            this.isShowVerification = false
                            this.$message.success(res.data)
                            this.$refs.rulePaymentForm.resetFields()
                            this.getPaymentTodoInfo()
                        }
                    })
                }
            })
        },
        handleEditModalClick() {
            this.isEditStatus = true
            this.isAddVisible = false
            this.editForm = this.contractObj
            delete this.editForm.contractFile
            
            this.editForm.contractCreate = String(this.editForm.contractCreate)
            this.isContractType = this.contractObj.contractType == 1 ? false : true
            if(String(this.editForm.contractType).length > 1) {
                let arr = []
                arr[0] = String(this.editForm.contractType).substr(0, 1)
                arr[1] = String(this.editForm.contractType)
                this.editForm.contractType = arr
            } else {
                let arr = []
                arr[0] = String(this.editForm.contractType)
                this.editForm.contractType = arr
            }
            // if(this.isContractType) {
            //     if(this.belongGeneralType && this.belongGeneralType.length > 0) {
            //         this.belongGeneralType.map(v => {
            //             if(this.editForm.belongContractName == v.name) {
            //                 this.editForm.belongContractCode = v.value
            //             }
            //         })
            //     }
            // } else {
            //     if(this.projectType && this.projectType.length > 0) {
            //         this.projectType.map(v => {
            //             if(this.editForm.belongContractName == v.name) {
            //                 this.editForm.belongContractCode = v.value
            //             }
            //         })
                    
            //     }
            // }
            this.editForm.belongContractCode = ''
            if(this.belongGeneralType && this.belongGeneralType.length > 0) {
                    this.belongGeneralType.map(v => {
                        if(this.editForm.belongContractName == v.name) {
                            this.editForm.belongContractCode = v.value
                        }
                    })
                }
            if(this.thirdProjectSelect && this.thirdProjectSelect.length > 0) {
                this.thirdProjectSelect.map(v => {
                    if(this.editForm.belongProjectName == v.name) {
                        this.editForm.belongProjectCode = v.value
                    }
                })
            }
            
            this.editForm.contractPaymentPeriod = String(this.editForm.contractPaymentPeriod)
            let newResult = []
            let companyA = ''
            let companyB = ''
            this.editForm.contractOperator = this.editForm.contractOperator ? String(this.editForm.contractOperator) : ''
            this.editForm.contractPrimaryReviewer = this.editForm.contractPrimaryReviewer ? String(this.editForm.contractPrimaryReviewer) : ''
            this.editForm.contractSecondaryReviewer = this.editForm.contractSecondaryReviewer ? String(this.editForm.contractSecondaryReviewer) : ''
            this.editForm.companyOperator = this.editForm.companyOperator ? String(this.editForm.companyOperator) : ''
            if(this.editForm.contractACompanyCode && this.editForm.contractBCompanyCode) {
                    if(this.editForm.contractCreate == 1) {
                        companyA = this.editForm.companyAName
                        companyB = this.editForm.contractACompanyCode
                    } else {
                        companyA = this.editForm.companyBName
                        companyB = this.editForm.contractBCompanyCode
                    }

                    getUserRole(1, companyA, companyB).then(res => {
                        let result = []
                        if(res && Array.isArray(res.data)) {
                            res.data.map(v => {
                            let obj = {
                                name: v.userName,
                                value: String(v.id)
                            }
                            result.push(obj)
                            })
                            this.agentSelect = result
                            this.agentSelectB = result
                        }
                        })
                        if(this.editForm.contractCreate == 2) {
                            getUserRole(1, this.editForm.companyAName, this.editForm.contractACompanyCode).then(res => {
                        let result = []
                        if(res && Array.isArray(res.data)) {
                            res.data.map(v => {
                            let obj = {
                                name: v.userName,
                                value: String(v.id)
                            }
                            result.push(obj)
                            })
                            this.agentSelectA = result
                            this.$forceUpdate()
                        }
                        })
                        }
                

                getUserRole(2, companyA, companyB).then(res => {
                    let result = []
                    let result1 = []
                    if(res && Array.isArray(res.data)) {
                        res.data.map(v => {
                        let obj = {
                            name: v.userName,
                            value: String(v.id)
                        }
                        result.push(obj)
                        result1.push(obj)
                        })
                        this.reviewSelect1 = result
                        newResult = result
                    }
                    })

                getUserRole(3, companyA, companyB).then(res => {
                    let result = []
                    if(res && Array.isArray(res.data)) {
                        res.data.map(v => {
                        let obj = {
                            name: v.userName,
                            value: String(v.id)
                        }
                        result.push(obj)
                        })
                        this.reviewSelect2 = result
                    }
                    })


            }
            this.addForm.settledAmount = String(this.addForm.settledAmount)
            this.addForm.paidAmount = String(this.addForm.paidAmount)
            this.reviewSelect3 = newResult
            this.editForm.fileUrlList = []
            let file = this.cacheUrl && this.cacheUrl.substr(0, this.cacheUrl.length - 1).split(',')
            file && file.map((item, index) => {
                let files = {}
                files.uid = String(index)
                //   files.name = item.split('#')[0]
                //   files.url = item.split('#')[1]
                let num = item.lastIndexOf('\#')
                files.name = item.substring(0, num)
                files.url = item.substring(num + 1, item.length)
                files.status = 'done'
                files.response = { 'status':'done', data: files.url }
                this.editForm.fileUrlList.push(files)
            })
            this.editForm.belongProjectCode = this.editForm.belongProjectName
            // setTimeout(() => {
            //     let newStr = ''
            //     this.editForm.belongProjectCode = undefined
            //     this.thirdProjectSelect && this.thirdProjectSelect.map(v => {
            //         if(this.editForm.belongProjectName == v.name) {
            //             newStr = v.value
            //         }
            //     })
            //     this.editForm.belongProjectCode = newStr
            //     console.log(this.thirdProjectSelect)
            // }, 1000)
            setTimeout(() => {
                
            
            
            // this.handleCompanyContractOperatorFocus()
            // this.handleCompanyContractPrimaryFocus()
            // this.handleCompanyContractSecondFocus()

                this.handleContractOperatorAgentFocus()
                this.handleContractPrimaryFocus()
                this.handleContractSecondFocus()
                this.handleContractOperatorFocus()
            }, 1000)
        },
        handleContractTypeChange(value) {
            if(value[0] == 1) {
                this.isContractType = false
                this.belongCodeDisabled = false
                this.isShowBWorker = true
                this.isShowAWorker = false
            } else {
                this.isContractType = true
                this.isShowBWorker = false
                this.isShowAWorker = false
            }
            if(value[0] == 2) {
                this.isShowAWorker = true
            } else {
            }
            if(value[0] == 3) {
                this.isShowAWorker = true
            }
        },
        handleStartDateChange(date, dateString) {
            console.log(date, dateString)
        },
        handlePayerNameFocus() {
            let reqObj = {
                accountName: '',
                accountType: 1,
                companyName: this.addForm.companyAName,
                unifiedCreditCode: this.addForm.contractACompanyCode
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                let result = []
                res.data && res.data.map(v => {
                    let resObj = {
                    name: v.accountName,
                    value: v.accountNum,
                    openBank: v.openBank,
                    openBankNum: v.openBankNum
                    }
                    result.push(resObj)
                })
                this.payerNameSelect = result
                }
            })
        },
        handlePayerNameChange(value) {
                console.log(value)
                console.log(this.payerNameSelect)
                if(this.payerNameSelect && this.payerNameSelect.length > 0) {
                    this.payerNameSelect.map(v => {
                    if(value == v.value) {
                        this.addForm.payerAcc = v.value
                        this.addForm.payerName = v.name
                        this.addForm.payerOpenBank = v.openBank
                        this.addForm.payerOpenBankNo = v.openBankNum
                    }
                    })
                }
        },
        handlePeasantNameFocus() {
            let reqObj = {
                accountName: '',
                accountType: 2,
                companyName: this.addForm.companyAName,
                unifiedCreditCode: this.addForm.contractACompanyCode
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                let result = []
                res.data && res.data.map(v => {
                    let resObj = {
                    name: v.accountName,
                    value: v.accountNum,
                    openBank: v.openBank,
                    openBankNum: v.openBankNum
                    }
                    result.push(resObj)
                })
                this.peasantNameSelect = result
                }
            })
        },
        handlePeasantNameChange(value) {
            if(this.peasantNameSelect && this.peasantNameSelect.length > 0) {
                this.peasantNameSelect.map(v => {
                if(value == v.value) {
                    this.addForm.peasantWorkerPayerAcc = v.value
                    this.addForm.peasantWorkerPayerName = v.name
                    this.addForm.peasantWorkerPayerOpenBank = v.openBank
                    this.addForm.peasantWorkerPayerOpenBankNo = v.openBankNum
                }
                })
            }
        },
        handlePayeeNameFocus() {
            let reqObj = {
                accountName: '',
                accountType: 1,
                companyName: this.addForm.companyBName,
                unifiedCreditCode: this.addForm.contractBCompanyCode
            }
            getSelectAccount(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                let result = []
                res.data && res.data.map(v => {
                    let resObj = {
                    name: v.accountName,
                    value: v.accountNum,
                    openBank: v.openBank,
                    openBankNum: v.openBankNum
                    }
                    result.push(resObj)
                })
                this.payeeNameSelect = result
                console.log(this.payeeNameSelect)
                }
            })
        },
        handlePayeeNameChange(value) {
            if(this.payeeNameSelect && this.payeeNameSelect.length > 0) {
                this.payeeNameSelect.map(v => {
                if(value == v.value) {
                    this.addForm.payeeAcc = v.value
                    this.addForm.payeeName = v.name
                    this.addForm.payeeOpenBank = v.openBank
                    this.addForm.payeeOpenBankNo = v.openBankNum
                }
                })
            }
        },
        handlePeasantPayeeNameFocus() {
            let reqObj = {
                accountName: '',
                accountType: 2,
                companyName: this.addForm.companyBName ? this.addForm.companyBName : '',
                unifiedCreditCode: this.addForm.contractBCompanyCode ? this.addForm.contractBCompanyCode : ''
            }
            console.log(reqObj)
            getSelectAccount(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                let result = []
                res.data && res.data.map(v => {
                    let resObj = {
                    name: v.accountName,
                    value: v.accountNum,
                    openBank: v.openBank,
                    openBankNum: v.openBankNum
                    }
                    result.push(resObj)
                })
                this.peasantPayeeNameSelect = result
                }
            })
        },
        handlePeasantPayeeNameChange(value) {
            if(this.peasantPayeeNameSelect && this.peasantPayeeNameSelect.length > 0) {
                this.peasantPayeeNameSelect.map(v => {
                if(value == v.value) {
                    this.addForm.peasantWorkerPayeeAcc = v.value
                    this.addForm.peasantWorkerPayeeName = v.name
                    this.addForm.peasantWorkerPayeeOpenBank = v.openBank
                    this.addForm.peasantWorkerPayeeOpenBankNo = v.openBankNum
                }
                })
            }
        },
        handleBlur(e) {
            console.log(e.target.value)
            if(e.target.value && this.addForm.contractACompanyCode) {
                this.getUserRoleList(1, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
                this.getUserRoleList(2, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
                this.getUserRoleList(3, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
            }
        },
        getUserRoleList(id, companyA, companyB) {
            if(this.contractObj.contractCreate == 1) {
                companyA = this.contractObj.companyAName
                companyB = this.contractObj.contractACompanyCode
            } else {
                companyA = this.contractObj.companyBName
                companyB = this.contractObj.contractBCompanyCode
            }
            if(this.contractObj.processorFlag == 'companyOperator') {
                companyA = this.contractObj.companyAName
                companyB = this.contractObj.contractACompanyCode
            }
            if(id == 1) {
                if(this.contractObj.contractCreate == 2) {
                getUserRole(1, this.contractObj.companyAName, this.contractObj.contractACompanyCode).then(res => {
                    let result = []
                    if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                        let obj = {
                        name: v.userName,
                        value: String(v.id)
                        }
                        result.push(obj)
                    })
                    this.agentSelectA = result
                    }
                })
                getUserRole(1, this.contractObj.companyBName, this.contractObj.contractBCompanyCode).then(res => {
                    let result = []
                    if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                        let obj = {
                        name: v.userName,
                        value: String(v.id)
                        }
                        result.push(obj)
                    })
                    this.agentSelect = result
                    // this.agentSelectA = result
                    this.agentSelectB = result
                    }
                })
                } else {
                getUserRole(1, companyA, companyB).then(res => {
                    let result = []
                    if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                        let obj = {
                        name: v.userName,
                        value: String(v.id)
                        }
                        result.push(obj)
                    })
                    this.agentSelect = result
                    // this.agentSelectA = result
                    this.agentSelectB = result
                    }
                })
                }
                
            } else if(id == 2) {
                getUserRole(2, companyA, companyB).then(res => {
                let result = []
                let result1 = []
                if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                    let obj = {
                        name: v.userName,
                        value: String(v.id)
                    }
                    result.push(obj)
                    result1.push(obj)
                    })
                    this.reviewSelect1 = result
                    this.reviewSelect3 = result1
                }
                })
            } else if(id == 3) {
                getUserRole(3, companyA, companyB).then(res => {
                let result = []
                if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                    let obj = {
                        name: v.userName,
                        value: String(v.id)
                    }
                    result.push(obj)
                    })
                    this.reviewSelect2 = result
                }
                })
            }
            
        },
        handleThirdProjectSearch(value) {
            if(value){
                getThirdProject(value).then(res => {
                this.thirdProjectSelect = res
                console.log(this.thirdProjectSelect)
                })
            }
        
        },
        handleThirdProjectChange(value) {
            console.log(value)
            console.log(111111111)
            
        },
        handleContractOperatorFocus() {
            this.getUserRoleList(1, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
        },
        handleContractOperatorAgentFocus() {
            
            this.getUserRoleList(1, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
        },
        handleContractPrimaryFocus() {
            this.getUserRoleList(2, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
        },
        handleContractSecondFocus() {
            this.getUserRoleList(3, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
        },
        handleCompanyContractOperatorFocus() {
            console.log(22222222)
            console.log(this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
            // this.getUserRoleList(1, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
            this.getUserRoleList(1, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
        },
        handleCompanyContractPrimaryFocus() {
            // this.getUserRoleList(2, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
            this.getUserRoleList(2, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
        },
        handleCompanyContractSecondFocus() {
            // this.getUserRoleList(3, this.editForm.contractACompanyCode, this.editForm.contractBCompanyCode)
            this.getUserRoleList(3, this.contractObj.contractACompanyCode, this.contractObj.contractBCompanyCode)
        },
        handleChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.editForm.fileUrlList && this.editForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.editForm.fileUrlList 
                    newFileList.splice(index, 1)  
                    this.editForm.fileUrlList = newFileList
                    console.log(this.editForm.fileUrlList)
                } else {
                    this.editForm.fileUrlList = info.fileList
                    if(this.editForm.fileUrlList) {
                        this.$refs.editRuleForm.clearValidate(['fileUrlList'])
                    }
                }
            } else {
                this.editForm.fileUrlList = info.fileList
            }
        },
        beforeImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleUploadRemoveClick() {
            const index = this.editForm.fileUrlList && this.editForm.fileUrlList.indexOf(info.file)  
            const newFileList = this.editForm.fileUrlList 
            newFileList.splice(index, 1)  
            this.editForm.fileUrlList = newFileList
            console.log(this.editForm.fileUrlList)
        },
        handleEditSubmitModalClick(e) {
            e.preventDefault()
            console.log(this.editForm.fileUrlList)
            if(this.editForm.fileUrlList.length <= 0) {
                this.$message.warning('请上传合同文件')
                return
            }
            this.$refs.editRuleForm.validate(valid => {
                if(valid) {
                let reqObj = Object.assign({}, this.editForm)
                if(reqObj.contractType && reqObj.contractType.length > 0) {
                    reqObj.contractType = Number(reqObj.contractType[reqObj.contractType.length - 1])
                }
                reqObj.belongContractCode = reqObj.belongContractCode != undefined ? reqObj.belongContractCode : ''
                reqObj.contractCreate = Number(reqObj.contractCreate)
                reqObj.contractAmount = Number(reqObj.contractAmount)
                if(reqObj.contractCreate == 1) {
                    reqObj.companyOperator = Number(reqObj.companyContractDetailOperator)
                    reqObj.companyContractPrimaryReviewer = Number(reqObj.companyContractPrimaryReviewer)
                    reqObj.companyContractSecondaryReviewer = reqObj.companyContractSecondaryReviewer ? Number(reqObj.companyContractSecondaryReviewer) : null
                } else {
                    reqObj.contractOperator = Number(reqObj.contractOperator)
                    reqObj.contractPrimaryReviewer = Number(reqObj.contractPrimaryReviewer)
                    reqObj.contractSecondaryReviewer = reqObj.contractSecondaryReviewer ? Number(reqObj.contractSecondaryReviewer) : null
                    reqObj.companyOperator = reqObj.companyOperator ? Number(reqObj.companyOperator) : null
                }
                reqObj.prepaymentAmou = Number(reqObj.prepaymentAmou)
                reqObj.warrantyAmount = Number(reqObj.warrantyAmount)
                reqObj.contractPaymentPeriod = Number(reqObj.contractPaymentPeriod)
                reqObj.contractPaymentProportion = Number(reqObj.contractPaymentProportion)
                let resultFile = ''
                reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                        resultFile += v.name + '#' + v.response.data + ','
                    })
                reqObj.contractFile = resultFile
                reqObj.contractCreateUser = Number(this.editForm.contractCreate)
                reqObj.contractCreate = Number(this.editForm.contractCreate)
                reqObj.payableAmount = this.editForm.payableAmount ? this.editForm.payableAmount : 0
                this.payerNameSelect && this.payerNameSelect.map(v => {
                    if(reqObj.payerName == v.value) {
                    reqObj.payerName = v.name
                    }
                })
                this.peasantNameSelect && this.peasantNameSelect.map(v1 => {
                    if(reqObj.peasantWorkerPayerName == v1.value) {
                    reqObj.peasantWorkerPayerName = v1.name
                    }
                })

                this.payeeNameSelect && this.payeeNameSelect.map(v2 => {
                    if(reqObj.payeeName == v2.value) {
                    reqObj.payeeName = v2.name
                    }
                })

                this.peasantPayeeNameSelect && this.peasantPayeeNameSelect.map(v3 => {
                    if(reqObj.peasantWorkerPayeeName == v3.value) {
                    reqObj.peasantWorkerPayeeName = v3.name
                    }
                })  

                reqObj.belongProjectCode = ''
                reqObj.belongContractCode = ''

                this.thirdProjectSelect && this.thirdProjectSelect.map(v => {
                    if(this.editForm.belongProjectName == v.name) {
                        reqObj.belongProjectCode = v.value
                    }
                })

                this.belongGeneralType && this.belongGeneralType.map(v => {
                    if(this.editForm.belongContractName == v.name) {
                        reqObj.belongContractCode = v.value
                    }
                })

                this.projectType && this.projectType.map(v => {
                    if(this.editForm.belongContractName == v.name) {
                        reqObj.belongContractCode = v.value
                    }
                })
                console.log(reqObj)
                delete reqObj.fileUrlList
                delete reqObj.companyContractDetailOperator
                delete reqObj.nodeList
                delete reqObj.processStatus
                delete reqObj.step
                delete reqObj.processorFlag
                delete reqObj.currentNode
                delete reqObj.currentProcessor
                delete reqObj.belongContractName
                delete reqObj.belongProjectName
                delete reqObj.currentHandle
                delete reqObj.handleDate
                delete reqObj.remark
                delete reqObj.lastRemark
                delete reqObj.companyContractPrimaryReviewerName
                delete reqObj.companyContractSecondaryReviewerName
                delete reqObj.companyOperatorName
                delete reqObj.contractOperatorName
                delete reqObj.contractPrimaryReviewerName
                delete reqObj.contractSecondaryReviewerName
                delete reqObj.contractTypeName
                reqObj.settledAmount = Number(reqObj.settledAmount)
                reqObj.paidAmount = Number(reqObj.paidAmount)
                getEditByProcess(reqObj).then(res => {
                    if(res.status == 1) {
                        this.isEditStatus = false
                        this.isAddVisible = false
                        this.belongCodeDisabled = false
                        this.handleAuditClick(this.cacheScope)
                        this.$message.success(res.data)
                    } else {
                        this.$message.error(res.data)
                    }
                })
                
                } else {
                    return false
                }
            })
        },
        handleEditCancelClick() {
            this.isEditStatus = false
            this.isAddVisible = true
        },
        handleBelongProjectNameFocus() {
            this.isShowProName = false
        },
        handleFileRemoveClick(file) {
            let index = this.editForm.fileUrlList.indexOf(file)
            let newFileList = this.editForm.fileUrlList
            newFileList.splice(index, 1)
            this.editForm.fileUrlList = newFileList
        },
        handlePayCollectionAuditClick(scope) {
            this.isCollectionVisible = true
            this.cacheCollectionScope = scope
            getPayCollectionDetail(scope.id).then(res => {
                if(res.status == 1 && res.data) {
                    this.collectionObj = res.data
                    if(this.collectionObj.belongPaymentScene == '4') {
                        this.collectionObj.payeeAcc = res.data.peasantWorkerPayeeAcc
                        this.collectionObj.payeeName = res.data.peasantWorkerPayeeName
                        this.collectionObj.payeeOpenBank = res.data.peasantWorkerPayeeOpenBank
                        this.collectionObj.payeeOpenBankNo = res.data.peasantWorkerPayeeOpenBankNo
                        if(res.data.peasantWorkerPayerAcc) {
                            this.collectionObj.payerAcc = res.data.peasantWorkerPayerAcc
                            this.collectionObj.payerName = res.data.peasantWorkerPayerName
                            this.collectionObj.payerOpenBank = res.data.peasantWorkerPayerOpenBank
                            this.collectionObj.payerOpenBankNo = res.data.peasantWorkerPayerOpenBankNo
                        }
                        if(res.data.peasantWorkerPayeeAcc) {
                            this.collectionObj.payerAcc = res.data.peasantWorkerPayeeAcc
                            this.collectionObj.payerName = res.data.peasantWorkerPayeeName
                            this.collectionObj.payerOpenBank = res.data.peasantWorkerPayeeOpenBank
                            this.collectionObj.payerOpenBankNo = res.data.peasantWorkerPayeeOpenBankNo
                        }
                    } else {
                        this.collectionObj.payeeAcc = res.data.payeeAcc
                        this.collectionObj.payeeName = res.data.payeeName
                        this.collectionObj.payeeOpenBank = res.data.payeeOpenBank
                        this.collectionObj.payeeOpenBankNo = res.data.payeeOpenBankNo
                        this.collectionObj.payerAcc = res.data.payerAcc
                        this.collectionObj.payerName = res.data.payerName
                        this.collectionObj.payerOpenBank = res.data.payerOpenBank
                        this.collectionObj.payerOpenBankNo = res.data.payerOpenBankNo
                    }
                    this.cacheCollectionList = res.data.paymentFile
                    this.cacheReceiptCollectionList = res.data.otherFile
                    this.isCollectionEditBtn = this.collectionObj.processorFlag == 'companyOperator' ? true : false
                    let newSalaryStr = this.collectionObj.paymentFile && this.collectionObj.paymentFile.substring(0, this.collectionObj.paymentFile.length - 1).split(',')
                    let uploadSalaryArr = []
                    newSalaryStr && newSalaryStr.map(res => {
                        // res = res.split('#')[0]
                        // let resObj = {
                        //     name: res.split('#')[0],
                        //     url: res.split('#')[1]
                        // }
                        let num = res.lastIndexOf('\#')
                        let resObj = {
                            name: res.substring(0, num),
                            url: res.substring(num + 1, res.length)
                        }
                        uploadSalaryArr.push(resObj)
                    })
                    this.collectionObj.paymentFile = uploadSalaryArr

                    let newReceiprStr = this.collectionObj.otherFile && this.collectionObj.otherFile.substring(0, this.collectionObj.otherFile.length - 1).split(',')
                    let uploadReceiptArr = []
                    newReceiprStr && newReceiprStr.map(res => {
                        // res = res.split('#')[0]
                        // let resObj = {
                        //     name: res.split('#')[0],
                        //     url: res.split('#')[1]
                        // }
                        let num = res.lastIndexOf('\#')
                        let resObj = {
                            name: res.substring(0, num),
                            url: res.substring(num + 1, res.length)
                        }
                        uploadReceiptArr.push(resObj)
                    })
                    this.collectionObj.otherFile = uploadReceiptArr
                }
            })
        },
        handleCollectionSubmitModalClick() {
            this.collectionSubmitLoading = true
            let self = this
            this.$refs.rulePayCollectionForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.payCollectionForm)
                    reqObj.businessId = this.collectionObj.businessId
                    reqObj.currentProcessor = this.collectionObj.currentProcessor
                    reqObj.id = this.collectionObj.id
                    reqObj.processStatus = this.collectionObj.processStatus
                    reqObj.processorFlag = this.collectionObj.processorFlag
                    reqObj.step = this.collectionObj.step
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    payCollectionSubmit(reqObj).then(res => {
                        console.log(res)
                        if(res.status == 1 && res.data) {
                            this.isCollectionVisible = false
                            this.$message.success(res.data)
                            this.getPayCollectionList()
                            setTimeout(() => {
                                this.collectionSubmitLoading = false
                            }, 1000)
                        } else {
                            this.isCollectionVisible = false
                            this.$message.error(res.data)
                        }
                    })
                } else {
                    return false
                }
            })
            
        },
        handleCollectionCancelModalClick() {
            this.isCollectionVisible = false
        },
        handleCollectionEditModalClick() {
            this.isCollectionVisible = false
            this.isCollectionEditVisible = true
            this.editCollectionForm.belongPaymentScene = String(this.collectionObj.belongPaymentScene)
            this.editCollectionForm.taskName = this.collectionObj.taskName
            this.editCollectionForm.belongContractCode = String(this.collectionObj.belongContractCode)
            this.editCollectionForm.prjName = this.collectionObj.belongPrjName
            if(this.collectionObj.belongPaymentScene == '4') {
                this.editCollectionForm.payeeAcc = this.collectionObj.peasantWorkerPayeeAcc
                this.editCollectionForm.payeeName = this.collectionObj.peasantWorkerPayeeName
                this.editCollectionForm.payeeOpenBank = this.collectionObj.peasantWorkerPayeeOpenBank
                this.editCollectionForm.payeeOpenBankNo = this.collectionObj.peasantWorkerPayeeOpenBankNo
                if(this.collectionObj.peasantWorkerPayerAcc) {
                    this.editCollectionForm.payerAcc = this.collectionObj.peasantWorkerPayerAcc
                    this.editCollectionForm.payerName = this.collectionObj.peasantWorkerPayerName
                    this.editCollectionForm.payerOpenBank = this.collectionObj.peasantWorkerPayerOpenBank
                    this.editCollectionForm.payerOpenBankNo = this.collectionObj.peasantWorkerPayerOpenBankNo
                } else {
                    this.editCollectionForm.payerAcc = this.collectionObj.payerAcc
                    this.editCollectionForm.payerName = this.collectionObj.payerName
                    this.editCollectionForm.payerOpenBank = this.collectionObj.payerOpenBank
                    this.editCollectionForm.payerOpenBankNo = this.collectionObj.payerOpenBankNo
                }
            } else {
                this.editCollectionForm.payerAcc = this.collectionObj.payerAcc
                this.editCollectionForm.payerName = this.collectionObj.payerName
                this.editCollectionForm.payerOpenBank = this.collectionObj.payerOpenBank
                this.editCollectionForm.payerOpenBankNo = this.collectionObj.payerOpenBankNo
                this.editCollectionForm.payeeAcc = this.collectionObj.payeeAcc
                this.editCollectionForm.payeeName = this.collectionObj.payeeName
                this.editCollectionForm.payeeOpenBank = this.collectionObj.payeeOpenBank
                this.editCollectionForm.payeeOpenBankNo = this.collectionObj.payeeOpenBankNo
            }
            this.editCollectionForm.transactionAmount = this.collectionObj.transactionAmount
            this.editCollectionForm.currentSettlementAmount = this.collectionObj.currentSettlementAmount
            this.editCollectionForm.paymentMethod = this.collectionObj.paymentMethod
            this.editCollectionForm.fileUrlList = []
            this.editCollectionForm.contractSettlAmount = this.collectionObj.contractSettlAmount
            this.editCollectionForm.contractPaidAmount = this.collectionObj.contractPaidAmount
            this.editCollectionForm.payDate = this.collectionObj.payDate
            this.cacheValue = this.collectionObj.belongPaymentScene
            let file = this.cacheCollectionList && this.cacheCollectionList.substr(0, this.cacheCollectionList.length - 1).split(',')
            file && file.map((item, index) => {
                let files = {}
                files.uid = String(index)
                //   files.name = item.split('#')[0]
                //   files.url = item.split('#')[1]
                let num = item.lastIndexOf('\#')
                files.name = item.substring(0, num)
                files.url = item.substring(num + 1, item.length)
                files.status = 'done'
                files.response = { 'status':'done', data: files.url }
                this.editCollectionForm.fileUrlList.push(files)
            })

            let receiptfile = this.cacheReceiptCollectionList && this.cacheReceiptCollectionList.substr(0, this.cacheReceiptCollectionList.length - 1).split(',')
            receiptfile && receiptfile.map((item, index) => {
                let files = {}
                files.uid = String(index)
                //   files.name = item.split('#')[0]
                //   files.url = item.split('#')[1]
                let num = item.lastIndexOf('\#')
                files.name = item.substring(0, num)
                files.url = item.substring(num + 1, item.length)
                files.status = 'done'
                files.response = { 'status':'done', data: files.url }
                this.editCollectionForm.fileReceiptUrlList.push(files)
            })
            console.log(this.editCollectionForm.fileUrlList)

        },
        handleCollectionLogClick(code) {
            this.isCollectionLogVisible = true
            getPayCollectionLog(code).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.collectionLogList = res.data
                }
            })
        },
        handleCollectionLogSubmitClick() {
            this.isCollectionLogVisible = false
        },
        handleEditCollectionSubmitModalClick(e) {
            e.preventDefault()
            this.$refs.editCollectionForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.editCollectionForm)
                    reqObj.belongPaymentScene = Number(reqObj.belongPaymentScene)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    let receiptFile = ''
                    reqObj.fileReceiptUrlList && reqObj.fileReceiptUrlList.map(v => {
                            receiptFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    reqObj.otherFile = receiptFile
                    reqObj.paymentFlag = this.collectionObj.paymentFlag
                    reqObj.status = this.collectionObj.status
                    reqObj.transactionAmount = Number(reqObj.transactionAmount)
                    reqObj.companyId = this.collectionObj.companyId
                    reqObj.id = this.collectionObj.businessId
                    delete reqObj.fileUrlList
                    delete reqObj.fileReceiptUrlList
                    delete reqObj.payeeAcc
                    delete reqObj.payeeName
                    delete reqObj.payeeOpenBank
                    delete reqObj.payeeOpenBankNo
                    delete reqObj.payerAcc
                    delete reqObj.payerName
                    delete reqObj.payerOpenBank
                    delete reqObj.payerOpenBankNo
                    delete reqObj.prjName
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    reqObj.settlementBatchName = this.selectionRows.length > 0 ? this.selectionRows[0].companyName : ''
                    reqObj.payDate = moment(reqObj.payDate).format('YYYY-MM-DD')
                    getEditByPayCollection(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isCollectionEditVisible = false
                            this.isCollectionVisible = false
                            this.handlePayCollectionAuditClick(this.cacheCollectionScope)
                            this.$message.success(res.data)
                        } else {
                            this.$message.error(res.data)
                        }
                    })
                }
            })
        },
        handleEditCollectionCancelClick() {
            this.isCollectionEditVisible = false
        },
        handlePaymentSceneChange(value) {
            this.cacheValue = value
            console.log(value)
            getTaskName(value).then(res => {
                if(res.status == 1) {
                this.editCollectionForm.taskName = res.data
                }
            })
        },
        getContractNameList() {
            getContractName().then(res => {
                this.contractNameSelect = res
            })
        },
        handleContractCodeChange(value) {
            let reqObj = {
                contractCode: value
            }
            getReceive(reqObj).then(res => {
                console.log(res)
                if(res.status == 1) {
                const data = res.data
                this.editCollectionForm.prjName = data.prjName
                this.editCollectionForm.payerAcc = data.payerAcc
                this.editCollectionForm.payerName = data.payerName
                this.editCollectionForm.payerOpenBank = data.payerOpenBank
                this.editCollectionForm.payerOpenBankNo = data.payerOpenBankNo
                this.editCollectionForm.payeeAcc = data.payeeAcc
                this.editCollectionForm.payeeName = data.payeeName
                this.editCollectionForm.payeeOpenBank = data.payeeOpenBank
                this.editCollectionForm.payeeOpenBankNo = data.payeeOpenBankNo
                
                }
            })
        },
        removeUploadFile(file) {
            console.log(111111)
            console.log(this.editCollectionForm.fileUrlList)
            let index = this.editCollectionForm.fileUrlList.indexOf(file)
            let newFileList = this.editCollectionForm.fileUrlList
            newFileList.splice(index, 1)
            this.editCollectionForm.fileUrlList = newFileList
            console.log(this.editCollectionForm.fileUrlList)
        },
        handleEditCollectionChangeFile(info) {
        const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.editCollectionForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.editCollectionForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.editCollectionForm.fileUrlList = newFileList
                } else {
                    this.editCollectionForm.fileUrlList = info.fileList
                }
            } else {
                this.editCollectionForm.fileUrlList = info.fileList
            }
        },
        beforeEditCollectionImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        handleCompanyASearch(value) {
            if(value){
                getCompanyCreditCode(value).then(res => {
                this.companyASelect = res
                console.log(this.companyASelect)
                })
            }
        },
        handleCompanyAChange(value) {
            if(value) {
                this.addForm.contractACompanyCode = value
            }
        },
        filterCompanyAOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        handleCompanyBSearch(value) {
            if(value){
                getCompanyCreditCode(value).then(res => {
                this.companyBSelect = res
                console.log(this.companyBSelect)
                })
            }
        },
        handleCompanyBChange(value) {
            if(value) {
                this.addForm.contractBCompanyCode = value
            }
        },
        filterCompanyBOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        handleSettleClick() {
            this.isSettleVisible = true
        },
        handleSettleSearchClick() {
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
            console.log(this.selectedRowKeys)
            console.log(this.selectionRows)
        },
        handleCheckboxProps(record) {
            let result = []
            if(this.collectionObj.settlementBatchId) {
                this.settleData && this.settleData.map(v => {
                        if(v.id == this.collectionObj.settlementBatchId) {
                            result.push(v)
                        }
                })
                if(this.collectionObj.settlementBatchId) {
                    return {
                        props: {
                            disabled: false,
                            name: '',
                            defaultChecked: record.id === result[0].id
                        }
                    }
                } else {
                    return {
                        props: {
                            disabled: false,
                            name: '',
                            defaultChecked: record.id === ''
                        }
                    }
                }
            } else if(this.paymentObj.settlementBatchId) {
                this.settleData && this.settleData.map(v => {
                    if(v.id == this.paymentObj.settlementBatchId) {
                        result.push(v)
                    }
                })
                if(this.paymentObj.settlementBatchId) {
                    return {
                        props: {
                            disabled: false,
                            name: '',
                            defaultChecked: record.id === result[0].id
                        }
                    }
                } else {
                    return {
                        props: {
                            disabled: false,
                            name: '',
                            defaultChecked: record.id === ''
                        }
                    }
                }
            } else {
                return {
                        props: {
                            disabled: false,
                            name: '',
                            defaultChecked: record.id === ''
                        }
                    }
            }
            
            // return {
            //     props: {
            //         disabled: false,
            //         name: '',
            //         defaultChecked: record.id === ''
            //     }
            // }
            
        },
        handleSettleSubmitClick() {
            this.isSettleVisible = false
            this.collectionObj.settlementBatchName = this.selectionRows[0].batchName + '(' + this.selectionRows[0].companyName +')'
        },
        handleSettlePageChange(page, pageSize) {
            console.log(page, pageSize)
            this.settlePagination.current = page
            this.getSettleInfo()
        },
        handleSettleShowSizeChange(current, size) {
            console.log(current, size)
            this.settlePagination.pageSize = size
            this.getSettleInfo()
        },
        handlePaymentMethodChange(value) {

        },
        handleSalarySelectClick() {

        },
        setTreeList(data) {
            let result = []
            let obj = {}
            data.forEach(v => {
            const tmp = { ...v }
            if(tmp.children) {
                tmp.children = this.setTreeList(tmp.children)
            }
            obj = {
                label: tmp.name,
                value: tmp.value,
                }
                result.push(obj)
            })
            return result
        },
        setCycleType(status) {
            switch (status) {
                case 1:
                return '年度';
                case 2:
                return '月度';
                case 3:
                return '季度'
            }
        },
        setAgentSelect(id) {
            let newName = ''
            this.agentSelect && this.agentSelect.map(v => {
            if(id == v.value) {
                newName = v.name
            }
            })
            return newName
        },
        setReviewSelect1(id) {
            let newName = ''
            this.reviewSelect1 && this.reviewSelect1.map(v => {
                if(id == v.value) {
                newName = v.name
                }
            })
            return newName
        },
        setReviewSelect2(id) {
            let newName = ''
            this.reviewSelect2 && this.reviewSelect2.map(v => {
                if(id == v.value) {
                newName = v.name
                }
            })
            return newName
        },
        setThirdProjectName(value) {
            let newName = ''
            this.thirdProjectSelect && this.thirdProjectSelect.map(res => {
                if(value == res.value) {
                newName = res.name
                }
            })
            return newName
        },
        setContractStatus (status) {
            switch (status) {
                case 1:
                    return '待审批';
                case 2:
                    return '审批中';
                case 3: 
                    return '可用'
            }
        },
        setPaymentPeriod(status) {
            switch (status) {
                case 1:
                    return '年度';
                case 2:
                    return '季度';
                case 3:
                    return '月度'
            }
        },
        setReviewSelect1(id) {
            let newName = ''
            this.reviewSelect1 && this.reviewSelect1.map(v => {
                if(id == v.value) {
                newName = v.name
                }
            })
            return newName
            },
        setReviewSelect2(id) {
            let newName = ''
            this.reviewSelect2 && this.reviewSelect2.map(v => {
                if(id == v.value) {
                newName = v.name
                }
            })
            return newName
        },
        setAgentSelect(id) {
            let newName = ''
            this.agentSelect && this.agentSelect.map(v => {
                if(id == v.value) {
                newName = v.name
                }
            })
            return newName
        },
        setMoment(date) {
            if(date) {
                return moment(date).format('YYYY-MM-DD hh:mm')
            }
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
.addContractTodoModal{
    .model-row{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 10px;
        span{
            margin-left: 15px;
            font-size: 16px;
            font-weight: 600;
        }
        strong{
            font-size: 12px;
            margin-left: 20px;
            color: #f5222d;
        }
    }
    .model-row::before{
        content: '';
        position: absolute;
        left: 0;
        width: 6px;
        height: 20px;
        background: #508EDF;
    }
    .model-log{
        width: 100%;
        text-align: right;
    }
  .ant-modal-content{
    width: 1200px;
    margin-left: -120px;
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
    .ant-form-item-label{
        width: 220px!important;
      }
    .process {
        .ant-form-item-label{
        width: 180px!important;
      }
      .process-label{
          .ant-form-item-label{
            width: 80px!important;
        }
      }
    }
    .ant-form-item {
      .ant-form-item-control {
        .ant-calendar-picker-input.ant-input {
          width: 232px;
        }
      }
    } 
  }
  .model-col{
      span{
          display: inline-block;
          line-height: 60px;
          margin-left: 15px;
      }
      .upload-wrapper{
          display: flex;
          flex-direction: column;
          span{
              line-height: 30px;
          }
          .download{
            color: #508EDF;
            cursor: pointer;
            margin-left: 10px;
        }
      }
      .select-account{
          display: flex;
          flex-direction: row;
          align-items: center;
          .ant-form-item-label{
              width: 120px!important;
              padding-left: 16px;
          }
          .ant-form-item-control-wrapper{
              .ant-form-item-control{
                  .ant-form-item-children{
                      .ant-select{
                          width: 220px!important;
                      }
                  }
              }
          }
      }
  }
  .ant-modal-content{
      .ant-modal-body{
          .contract-log-wrapper{
              .log-wrapper{
                span{
                    margin-right: 30px;
                }
            }
            .log-footer{
                width: 100%;
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
          }
          
      }
      .ant-form-item-label{
        width: 220px!important;
      }
  }
  .ant-modal-content{
    .upload-wrapper-settle{
        .ant-form-item-label{
            width: 280px!important;
        }
    }
  }
  

  
}
.addContractModal{
    .model-row{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 10px;
        span{
            margin-left: 15px;
            font-size: 16px;
            font-weight: 600;
        }
        strong{
            font-size: 12px;
            margin-left: 20px;
            color: #f5222d;
        }
    }
    .model-row::before{
        content: '';
        position: absolute;
        left: 0;
        width: 6px;
        height: 20px;
        background: #508EDF;
    }
  .ant-modal-content{
    width: 1200px;
    margin-left: -220px;
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
    .ant-form-item-label{
        width: 220px!important;
      }
    .process {
        .ant-form-item-label{
        width: 220px!important;
      }
    }
    .ant-form-item {
      .ant-form-item-control {
        .ant-calendar-picker-input.ant-input {
          width: 232px;
        }
      }
    } 
  }
  .model-col{
      span{
          display: inline-block;
          line-height: 60px;
          margin-left: 15px;
      }
      .upload-wrapper{
        display: flex;
        flex-direction: column;
        span{
          line-height: 30px;
          .download{
            color: #508EDF;
            cursor: pointer;
            margin-left: 10px;
          }
        }
      }
  }
  .footer-wrapper{
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
  .footer-total-wrapper{
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    position: relative;
    .total-num{
      position: absolute;
      left: 20px;

    }
  }
}
.model-upload-file{
    .ant-form-item-label{
        position: relative;
    }
    .ant-form-item-label::before{
        position: absolute;
        content: '*';
        left: 110px;
        top: 0;
        color: #f5222d;
    }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
.settleModal{
    .ant-form-item-label{
        width: 120px!important;
    }
    .ant-modal-content{
        width: 1200px;
        margin-left: -120px;
    }
    .footer-wrapper{
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
