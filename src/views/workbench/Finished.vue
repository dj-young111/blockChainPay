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
                        <template slot="processStatus" slot-scope="text, record">
                            <span>{{ setProcessStatus(record.processStatus) }}</span>
                        </template>
                        <template slot="paymentStatus" slot-scope="text, record">
                            <span>{{ setPaymentStatus(record.paymentStatus) }}</span>
                        </template>
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handlePaymentReviewClick(scope)">查看</a-button>
                            <a-button v-if="scope.processStatus == 3" type="link" @click="handlePaymenDetailClick(scope)">明细</a-button>
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
                        <template slot="contractStatus" slot-scope="text, record">
                            <span>{{ setContractStatus(record.contractStatus) }}</span>
                        </template>
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handlePayCollectionReviewClick(scope)">查看</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="3" :tab="`合同审批${contractCount ? '(' + contractCount + ')' : ''}`" force-render>
                    <a-table
                        :rowKey="((record, index) => {return index})"
                        :data-source='contractData'
                        :columns="columns"
                        :pagination="pagination"
                        :scroll="{ x: 1200, y: 600 }"
                    >
                        <span slot="serial" slot-scope="text, record, index">
                            {{ index + 1 }}
                        </span>
                        <template slot="contractStatus" slot-scope="text, record">
                            <span>{{ setContractStatus(record.contractStatus) }}</span>
                        </template>
                        <template slot="operation" slot-scope="scope">
                            <a-button type="link" @click="handleReviewClick(scope)">查看</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-card>

        <a-modal v-model="isAddVisible" class="addContractTodoModal" :footer="null">
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
                            <span>{{ setPaymentPeriod(contractObj.contractPaymentPeriod)}}</span>
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
                <div class="process" v-if="contractObj.contractCreate != 1">
                    <div class="model-row">
                        <span>审批流程</span><strong>* 请在此部分设定与本合同审批及本合同支付审批相关的流程</strong>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同经办人：</span>
                            <span>{{ contractObj.contractOperatorName }}</span>
                        </a-col>
                        <a-col :span="12">
                            <span>合同一级复核人：</span>
                            <span>{{ contractObj.contractPrimaryReviewerName }}</span>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="12">
                            <span>合同二级复核人（如有）：</span>
                            <span>{{ contractObj.contractSecondaryReviewerName }}</span>
                        </a-col>
                        <a-col :span="12">
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
                        <a-col :span="12">
                            <div class="upload-wrapper">
                                <span v-for="(item, index) of contractObj.contractFile" :key="index">{{ item.name }}<a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                            </div>
                        </a-col>
                    </a-row>
                </div>
                <div class="process">
                    <div class="model-row">
                        <span>审批信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="8">
                            <!-- <a-form-model-item label="操作" prop="currentHandle">
                                <a-select v-model="addForm.currentHandle" placeholder="请选择">
                                    <a-select-option v-for="item of operationSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item> -->
                            <span>操作：</span>
                            <span>{{ setCurrentHandle(contractObj.currentHandle) }}</span>
                        </a-col>
                        <a-col :span="8">
                            <!-- <a-form-model-item label="备注">
                                <a-input
                                    placeholder="请输入"
                                    v-model="addForm.remark"
                                />
                            </a-form-model-item> -->
                            <span>备注：</span>
                            <span>{{ contractObj.remark }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>上一步备注：</span>
                            <span>{{ contractObj.lastRemark }}</span>
                        </a-col>
                    </a-row>
                </div>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handleSubmitModalClick">确认</a-button>
            </div>
        </a-modal>


        <a-modal v-model="isPayVisible" class="addContractTodoModal" title="审批详情" :footer="null">
            <div class="model-row">
                <span>当前进度</span>
            </div>
            <a-steps progress-dot :current="paymentObj.status == 3 ? paymentObj.nodeList.length : paymentObj.step - 1" size="small" style="margin-bottom: 20px;">
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
                                    <span v-for="(item, index) of paymentObj.salaryDetails" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
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
                                    <span v-for="(item, index) of paymentObj.paymentDetails" :key="index">{{ item.name }} <a style="margin-left: 10px;" :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a></span>
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
                    </div>
                    <div>
                        <!-- <div class="model-row">
                            <span>支付要件</span>
                        </div>
                        <a-row :gutter="24" class="model-col">
                            <a-col :span="12">
                                <div class="upload-wrapper">
                                    <span v-for="(item, index) of paymentObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a></span>
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
                            <span>操作：</span>
                            <span>{{ setCurrentHandle(paymentObj.currentHandle) }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>备注：</span>
                            <span>{{ paymentObj.remark }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>上一步备注：</span>
                            <span>{{ paymentObj.lastRemark }}</span>
                        </a-col>
                    </a-row>
                </div>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handlePaymentSubmitModalClick">确认</a-button>
            </div>
        </a-modal>

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


        <a-modal v-model="isPayDetailVisible" class="addContractTodoModal" title="明细详情" :footer="false">
            <div class="pay-detail-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :span="12">
                        <a-form-item label="账户名称">
                            <a-input v-model="queryParam.accNoName" placeholder="请输入账户名称"/>
                        </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="账号或卡号">
                                <a-input v-model="queryParam.accNo" placeholder="请输入账号或卡号">
                                </a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item label="支付状态">
                                <a-select v-model="queryParam.status" placeholder="请选择" >
                                    <a-select-option v-for="item of statusList" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <span class="table-page-search-submitButtons">
                                <a-button type="primary" @click="handleSearchDetailClick">查询</a-button>
                                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
                <a-table
                        :rowKey="((record, index) => {return index})"
                        :data-source='paymentDetailData'
                        :columns="paymentDetailColumns"
                        :pagination="paymentDetailPagination"
                        style="margin-top: 20px;"
                    >
                        <template slot="status" slot-scope="text, record">
                            <span>{{ record.status ? setProcessDetailStatus(record.status) : '' }}</span>
                        </template>
                    </a-table>
            </div>
        </a-modal>


        <!-- 支付补录详情 -->
        <a-modal v-model="isCollectionVisible" class="addContractTodoModal" title="支付补录详情" :footer="null">
            <div class="model-row">
                <span>基本信息</span>
            </div>
            <a-row :gutter="24" class="model-col">
            <a-col :span="12">
                <span>支付场景：</span>
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
            <div v-if="collectionObj.belongPaymentScene != '4'">
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
            <div v-else>
                <div class="model-row">
                    <span>付款账号信息</span>
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
            <div class="model-row">
                <span>交易信息</span>
            </div>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>已结算金额（元）：</span>
                    <span>{{ collectionObj.contractSettlAmount }}</span>
                </a-col>
                <a-col :span="12">
                    <span>已支付金额（元）:</span>
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
                    <span>{{ collectionObj.settlementBatchName }}</span>
                </a-col>
            </a-row>
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
            <div class="model-row">
                <span>支付要件及付款成功凭证</span>
            </div>
            <div v-if="collectionObj.belongPaymentSceneName != '工资款'">
                <a-row :gutter="24" class="model-col">
                    <a-col :span="24" >
                        <span>请上传与本次支付相关的发票及银行回单：</span>
                        <div class="upload-span">
                            <span v-for="(item, index) of collectionObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div v-else>
                <a-row :gutter="24" style='margin-top: 20px;'>
                    <a-col :span="24" style="display: flex; flex-direction: row; padding-left: 20px;">
                        <span>请上传对应成功支付的工资单：</span>
                        <div class="upload-span" style="display: flex; flex-direction: column;">
                            <span v-for="(item, index) of collectionObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="24" style='margin-top: 20px;'>
                    <a-col :span="24" style="display: flex; flex-direction: row; padding-left: 20px;">
                        <span>请上传对应成功支付的回执单：</span>
                        <div class="upload-span" style="display: flex; flex-direction: column;">
                            <span v-for="(item, index) of collectionObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="process">
                    <div class="model-row">
                        <span>审批信息</span>
                    </div>
                    <a-row :gutter="24" class="model-col">
                        <a-col :span="8">
                            <span>操作：</span>
                            <span>{{ setCurrentHandle(collectionObj.currentHandle) }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>备注：</span>
                            <span>{{ collectionObj.remark }}</span>
                        </a-col>
                        <a-col :span="8">
                            <span>上一步备注：</span>
                            <span>{{ collectionObj.lastRemark }}</span>
                        </a-col>
                    </a-row>
                </div>
            <a-row :gutter="24" class="model-col">
                <a-col :span="24">
                    <div style="width: 100%; text-align:center;">
                        <a-checkbox v-model="collectionObj.paymentFlag" disabled>
                        已在其他渠道付款成功
                        </a-checkbox>
                    </div>
                </a-col>
            </a-row>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handleCollectionDetailSubmitClick">确定</a-button>
            </div>
        </a-modal>


    </page-header-wrapper>
</template>
<script>
import { getContractFinishList, getContractDetailList, getPaymentFinishList, getPaymentReqDetail, getPaymentPayDetail, getPaymentSalaryDetail, getContractLog, getPayLog, getPaymentDetail, getPaymentStatus, getPayCollection, getPayCollectionFinishList, getPayCollectionDetail } from '@/api/workbench'

import moment from 'moment'

import { fileUrl } from "@/utils/request"

const columns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '80px'
    },
    {
        title: '合同类型',
        dataIndex: 'contractTypeName',
        key: 'contractTypeName',
        width: '300px'
    },
    {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: '300px'
    },
    {
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        width: '300px'
    },
    {
        title: '合同甲方',
        dataIndex: 'companyAName',
        key: 'companyAName',
        width: '300px'
    },
    {
        title: '合同乙方',
        dataIndex: 'companyBName',
        key: 'companyBName',
        width: '300px'
    },
    {
        title: '合同总额（元）',
        dataIndex: 'contractAmount',
        key: 'contractAmount',
        width: '180px'
    },
    {
        title: '当前处理人',
        dataIndex: 'currentProcessorName',
        key: 'currentProcessorName',
        width: '180px'
    },
    {
        title: '合同状态',
        dataIndex: 'contractStatus',
        key: 'contractStatus',
        scopedSlots: { customRender: 'contractStatus' },
        width: '180px'
    },
    {
        title: '操作', 
        key: 'operation', 
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
        width: '100px'
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
        title: '流程状态',
        dataIndex: 'processStatus',
        key: 'processStatus',
        scopedSlots: { customRender: 'processStatus' },
        width: '100px'
    },
    {
        title: '支付状态',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        scopedSlots: { customRender: 'paymentStatus' },
        width: '180px'
    },
    {
        title: '操作', 
        key: 'operation', 
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
        width: '100px'
    },
]

const paymentDetailColumns = [
    {
        title: '账户名称',
        dataIndex: 'accNoName',
        key: 'accNoName',
        width: '10%'
    },
    {
        title: '账号或卡号',
        dataIndex: 'accNo',
        key: 'accNo',
        width: '10%'
    },
    {
        title: '开户行名称',
        dataIndex: 'accBankName',
        key: 'accBankName',
        width: '10%'
    },
    {
        title: '开户行联行号',
        dataIndex: 'openBankNo',
        key: 'openBankNo',
        width: '10%'
    },
    {
        title: '金额（元）',
        dataIndex: 'amount',
        key: 'amount',
        width: '10%'
    },
    {
        title: '支付状态',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '支付信息',
        dataIndex: 'reason',
        key: 'reason',
        width: '10%'
    }
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
    width: '180px'
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

export default {
    data () {
        this.columns = columns
        this.paymentColumns = paymentColumns
        this.paymentDetailColumns = paymentDetailColumns
        this.payCollectionColumns = payCollectionColumns
        return {
            activeKey: '1',
            contractData: [],
            contractCount: '',
            paymentCount: '',
            paymentData: [],
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
            paymentDetailPagination: {
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
                    this.handlePageDetailChange(page, pageSize)
                },
                onShowSizeChange: (current, size) => {
                    this.handleShowSizeDetailChange(current, size)
                },
            },
            isAddVisible: false,
            isPayVisible: false,
            contractObj: {},
            paymentObj: {},
            isLogVisible: false,
            contractLogList: [],
            isPayLogVisible: false,
            payLogList: [],
            fileUrl,
            isPayDetailVisible: false,
            paymentDetailData: [],
            queryParam: {
                accNoName: '',
                accNo: '',
                status: undefined,
            },
            statusList: [],
            bussinessId: '',
            taskName: '',
            isShowScene: false,
            isShowSalaryScene: false,
            scene: '',
            isShowAWorker: false,
            isShowBWorker: false,
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
            payCollectionCount: '',
            isCollectionVisible: false,
            collectionObj: {}
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
    },
    mounted() {
        this.getContractFinishInfo()
        this.getPaymentFinishInfo()
        this.getPaymentStatusInfo()
        this.getPayCollectionList()
    },
    methods: {
        getContractFinishInfo () {
            let reqObj = {
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getContractFinishList(reqObj).then(res => {
                const data = res.data
                this.contractData = data.pageList
                this.pagination.total = data.rowCount
                this.contractCount = data.rowCount
            })
        },
        getPaymentFinishInfo() {
            let reqObj = {
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            getPaymentFinishList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    const data = res.data
                    this.paymentData = data.pageList
                    this.paymentPagination.total = data.rowCount
                    this.paymentCount = data.rowCount
                }
            })
        },
        getPaymentStatusInfo() {
            getPaymentStatus().then(res => {
                this.statusList = res
            })
        },
        getPayCollectionList() {
            let reqObj = {
                pageNum: this.payCollectionPagination.current,
                pageSize: this.payCollectionPagination.pageSize
            }
            getPayCollectionFinishList(reqObj).then(res => {
                const data = res.data
                this.payCollectionData = data.pageList
                this.payCollectionCount = data.rowCount
            })
        },
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
            this.paymentPagination.pageSize = size
            // this.getContractTodoInfo()
        },
        handlePageDetailChange(page, pageSize) {
            console.log(page, pageSize)
            this.paymentDetailPagination.current = page
            // this.getContractTodoInfo()
        },
        handleShowSizeDetailChange(current, size) {
            console.log(current, size)
            this.paymentDetailPagination.pageSize = size
            // this.getContractTodoInfo()
        },
        handleTabsChange() {

        },
        handleReviewClick(scope) {
            this.isAddVisible = true
            getContractDetailList(scope.id).then(res => {
                if(res.status == 1 && res.data) {
                    this.contractObj = res.data
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
                }
            })
        },
        handlePaymentReviewClick(scope) {
            this.isPayVisible = true
            let self = this
            this.scene = scope.scene
            if(scope.paymentScene >= 1 && scope.paymentScene <= 6) {
                getPaymentReqDetail(scope.id).then(res => {
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
        handleSubmitModalClick() {
            this.isAddVisible = false
        },
        handlePaymentSubmitModalClick() {
            this.isPayVisible = false
        },
        handleLogClick(code) {
            this.isLogVisible = true
            getContractLog(code).then(res => {
                console.log(res)
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
                if(res.status == 1 && res.data) {
                    this.payLogList = res.data
                }
            })
        },
        handlePayLogSubmitClick() {
            this.isPayLogVisible = false
        },
        handlePaymenDetailClick(row) {
            this.isPayDetailVisible = true
            this.queryParam.accNoName = ''
            this.queryParam.accNo = ''
            this.queryParam.status = undefined
            let reqObj = {
                bussinessId: row.belongId,
                taskName: row.taskName,
            }
            this.bussinessId = row.belongId
            this.taskName = row.taskName
            getPaymentDetail(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.paymentDetailData = res.data.pageList
                }
            })
        },
        handleSearchDetailClick() {
            let reqObj = {
                bussinessId: this.bussinessId,
                taskName: this.taskName,
                status: this.queryParam.status,
                accNoName: this.queryParam.accNoName,
                accNo: this.queryParam.accNo,
                pageNum: this.paymentDetailPagination.current,
                pageSize: this.paymentDetailPagination.pageSize,
            }
            getPaymentDetail(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.paymentDetailData = res.data.pageList
                }
            })
        },
        handlePayDetailSubmitClick() {
            this.isPayDetailVisible = false
        },
        handlePayCollectionPageChange(current, size) {
            this.payCollectionPagination.current = current
        },
        handlePayCollectionShowSizeChange(current, size) {
            this.payCollectionPagination.pageSize = size
        },
        handlePayCollectionReviewClick(scope) {
            this.isCollectionVisible = true
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
                        this.collectionObj.payerAcc = res.data.payerAcc
                        this.collectionObj.payerName = res.data.payerName
                        this.collectionObj.payerOpenBank = res.data.payerOpenBank
                        this.collectionObj.payerOpenBankNo = res.data.payerOpenBankNo
                        this.collectionObj.payeeAcc = res.data.payeeAcc
                        this.collectionObj.payeeName = res.data.payeeName
                        this.collectionObj.payeeOpenBank = res.data.payeeOpenBank
                        this.collectionObj.payeeOpenBankNo = res.data.payeeOpenBankNo
                    }
                    this.collectionObj.paymentFlag = res.data.paymentFlag == 0 ? false : true
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

                    let newReceiptStr = this.collectionObj.otherFile && this.collectionObj.otherFile.substring(0, this.collectionObj.otherFile.length - 1).split(',')
                    let uploadReceiptArr = []
                    newReceiptStr && newReceiptStr.map(res => {
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
        handleCollectionDetailSubmitClick() {
            this.isCollectionVisible = false
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
        setCurrentHandle(status) {
            switch (status) {
                case 1:
                    return '通过';
                case 2:
                    return '驳回';
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
        setPaymentStatus(status) {
            switch(status) {
                case 0:
                    return '待支付';
                case 1:
                    return '支付成功';
                case 2:
                    return '支付失败';
                case 3:
                    return '部分支付';
                case 4:
                    return '已提交银行'
            }
        },
        setProcessStatus (status) {
            switch (status) {
                case 1:
                    return '待处理';
                case 2:
                    return '审批中';
                case 3:
                    return '已完成';
                case 4:
                    return '已驳回'
            }
        },
        setProcessDetailStatus (status) {
            // 1-付款成功，收款确认成功；2-付款失败；3-付款成功，收款未确认；4-付款成功，收款确认失败
            switch (status) {
                // case 1:
                //     return '付款成功，收款确认成功';
                // case 2:
                //     return '付款失败';
                // case 3:
                //     return '付款成功，收款未确认';
                // case 4:
                //     return '付款成功，收款确认失败'
                case 0:
                    return '待支付';
                case 1:
                    return '支付成功';
                case 2:
                    return '支付失败';
                case 3:
                    return '部分支付'
            }
        },
        setMoment(date) {
            if(date) {
                return moment(date).format('YYYY-MM-DD hh:mm')
            }
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
    width: 1000px;
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
        width: 80px!important;
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
      }
  }
  .footer-wrapper{
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 20px;
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
  }
  .pay-detail-wrapper{
      .ant-form-item-label{
        width: 80px!important;
      }
      .ant-form {
          .ant-select{
            width: 180px!important;
        }
      }
  }
}
</style>

