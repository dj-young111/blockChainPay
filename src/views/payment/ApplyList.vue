<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                        <a-form-item label="任务名称">
                            <a-input v-model="taskName" placeholder="请输入任务名称"/>
                        </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                                <a-button style="margin-left: 8px" type="primary" @click="handleAddClick">新增</a-button>
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
                    <template slot="operation" slot-scope="scope">
                        <a-button type="link" @click="handleReviewClick(scope)">详情</a-button>
                    </template>
                </a-table>
        </a-card>

        <!-- 请款 -->
        <a-modal v-model="isReqDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleReqDetailSubmitClick" @cancel="handleReqDetailCancelClick">
            <a-form-model
                ref='reqDetailForm'
                :model="reqDetailForm"
                :rules="reqDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="任务名称" prop="taskName">
                        <a-input v-model="reqDetailForm.taskName" placeholder=""/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="所属合同名称" prop="belongContractCode">
                    <a-select v-model="reqDetailForm.belongContractCode" placeholder="请选择" @change="handleReqContractCodeChange">
                        <a-select-option v-for="item of payContractNameSelect" :key="item.value" :value="item.value">
                        {{ item.name }}
                        </a-select-option>
                    </a-select>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="所属项目名称">
                    <a-input 
                        type="text" 
                        v-model="requestObj.prjName"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                            <a-input 
                                type="text" 
                                v-model="requestObj.payerAcc"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款银行账号户名">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payerName"
                            disabled
                        />
                        </a-form-model-item>
                        <!-- <a-form-model-item label="付款银行账号户名">
                            <a-select v-model="requestObj.payerName" 
                                    show-search
                                    placeholder="请选择付款银行账号户名"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    :options="requestData"
                                    @search="handleRequestSearch"
                                    @change="handleRequestChange">
                                </a-select>
                        </a-form-model-item> -->
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方开户行">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payerOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                    <a-form-model-item label="收款方银行账号">
                    <a-input 
                        type="text" 
                        v-model="requestObj.payeeAcc"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="收款银行账号户名">
                    <a-input 
                        type="text" 
                        v-model="requestObj.payeeName"
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
                            v-model="requestObj.payeeOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payeeOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="text"  
                            v-model="requestObj.contractPaidAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="requestObj.contractSettlAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="申请金额（元）" prop="applicationAmount">
                        <a-input 
                            type="text"  
                            v-model="reqDetailForm.applicationAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="reqDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="reqDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                            <a-button type="link" @click="handleSettleClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleReqChangeFile"
                                :before-upload="beforeReqImgUpload"
                                :default-file-list="reqDetailForm.fileUrlList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                        <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleReqChangeApproveFile"
                                :before-upload="beforeReqImgApproveUpload"
                                :default-file-list="reqDetailForm.fileApproveUrlList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleReqChangeOtherFile"
                                :before-upload="beforeReqImgOtherUpload"
                                :default-file-list="reqDetailForm.fileUrlOtherList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工程进度请款 -->
        <a-modal v-model="isProgressReqDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleProgressReqDetailSubmitClick" @cancel="handleProgressReqDetailCancelClick">
            <a-form-model
                ref='progressReqDetailForm'
                :model="progressReqDetailForm"
                :rules="progressReqDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="任务名称" prop="taskName">
                        <a-input v-model="progressReqDetailForm.taskName" placeholder=""/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="所属合同名称" prop="belongContractCode">
                    <a-select v-model="progressReqDetailForm.belongContractCode" placeholder="请选择" @change="handleReqContractCodeChange">
                        <a-select-option v-for="item of payContractNameSelect" :key="item.value" :value="item.value">
                        {{ item.name }}
                        </a-select-option>
                    </a-select>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="requestObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <!-- <a-col :span="12">
                        <a-form-model-item label="累计验工计价金额（元）" prop="totalValuationAmount">
                        <a-input 
                            type="text" 
                            v-model="progressReqDetailForm.totalValuationAmount"
                        />
                        </a-form-model-item>
                    </a-col> -->
                </a-row>
                <!-- <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次验工计价金额（元）" prop="currentValuationAmount">
                        <a-input 
                            type="text" 
                            v-model="progressReqDetailForm.currentValuationAmount"
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row> -->
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                            <a-input 
                                type="text" 
                                v-model="requestObj.payerAcc"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款银行账号户名">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payerName"
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
                            v-model="requestObj.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payerOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                    <a-form-model-item label="收款方银行账号">
                    <a-input 
                        type="text" 
                        v-model="requestObj.payeeAcc"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="收款银行账号户名">
                    <a-input 
                        type="text" 
                        v-model="requestObj.payeeName"
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
                            v-model="requestObj.payeeOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="requestObj.payeeOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="number"  
                            v-model="requestObj.contractPaidAmount"
                            placeholder="请输入"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="requestObj.contractSettlAmount"
                            placeholder="请输入"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="申请金额（元）" prop="applicationAmount">
                        <a-input 
                            type="number"  
                            v-model="progressReqDetailForm.applicationAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="progressReqDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="progressReqDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                            <a-button type="link" @click="handleSettleClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleProgressReqChangeFile"
                                :before-upload="beforeProgressReqImgUpload"
                                :default-file-list="progressReqDetailForm.fileUrlList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                        <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleProgressReqChangeApproveFile"
                                :before-upload="beforeProgressReqImgApproveUpload"
                                :default-file-list="progressReqDetailForm.fileUrlApproveList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleProgressReqChangeOtherFile"
                                :before-upload="beforeProgressReqImgOtherUpload"
                                :default-file-list="progressReqDetailForm.fileUrlOtherList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 付款 -->
        <a-modal v-model="isPayDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handlePayDetailSubmitClick" @cancel="handlePayDetailCancelClick">
            <a-form-model
                ref='rulePaymentForm'
                :model="payDetailForm"
                :rules="payDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                        <a-input 
                            type="text" 
                            v-model="payDetailForm.taskName"
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属乙方公司名称"  prop="companyBName">
                        <a-select show-search v-model="payDetailForm.companyBName" :filter-option="filterOption" placeholder="请选择" @change="handleCompanyBNameChange">
                            <a-select-option v-for="item of companyBNameList" :key="item.companyBName" :value="item.companyBName">
                            {{ item.companyBName }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" v-if="companyContractList.length > 0">
                    <a-col :span="12">
                        <a-form-model-item label="所属合同名称"  prop="belongContractCode">
                        <a-select show-search v-model="payDetailForm.belongContractCode" :filter-option="filterOption" placeholder="请选择" @change="handlePayContractCodeChange">
                            <a-select-option v-for="item of companyContractList" :key="item.contractCode" :value="item.contractCode">
                            {{ item.contractName }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="合同金额（元）">
                        <a-input 
                            type="text"
                            v-model="contractNum"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="paymentObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号" prop='paymentBankNum'>
                        <a-select v-model="payDetailForm.paymentBankNum" placeholder="请选择" @change="handlePayBankNumChange">
                            <a-select-option v-for="item of paymentBankNumSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>

                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方名称">
                            <a-input 
                                type="text" 
                                v-model="paymentObj.payeeName"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款银行账号户名">
                            <a-input 
                                type="text" 
                                v-model="paymentObj.payeeName"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方银行账号">
                            <a-input 
                                type="text" 
                                v-model="paymentObj.payeeAcc"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                        <a-input 
                            type="text" 
                            v-model="paymentObj.payeeOpenBankNo"
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
                            v-model="paymentObj.payeeOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="number"  
                            v-model="paymentObj.contractPaidAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="paymentObj.contractSettlAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款金额（元）" prop="paymentAmount">
                        <a-input 
                            type="number"  
                            v-model="payDetailForm.paymentAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="payDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="payDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                            <a-button type="link" @click="handleSettleClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handlePayChangeFile"
                            :before-upload="beforePayImgUpload"
                            :default-file-list="payDetailForm.fileUrlList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handlePayChangeApproveFile"
                            :before-upload="beforePayImgApproveUpload"
                            :default-file-list="payDetailForm.fileUrlApproveList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handlePayChangeOtherFile"
                            :before-upload="beforePayImgOtherUpload"
                            :default-file-list="payDetailForm.fileUrlOtherList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 其他付款 -->
        <a-modal v-model="isOtherDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handlePayDetailOtherSubmitClick" @cancel="handlePayDetailOtherCancelClick">
            <a-form-model
                ref='ruleOtherForm'
                :model="payDetailOtherForm"
                :rules="payDetailOtherRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                        <a-input 
                            type="text" 
                            v-model="payDetailOtherForm.taskName"
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <!-- <a-select v-model="payDetailOtherForm.prjName" placeholder="请选择" @change="handleProjectNameOtherChange">
                                <a-select-option v-for="item of projectNameSelect" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select> -->
                            <a-input disabled v-model="prjNameValue"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属合同名称" prop="belongContractCode">
                            <a-select v-model="payDetailOtherForm.belongContractCode" placeholder="请选择" @change="handleProjectContractCodeChange">
                                <a-select-option v-for="item of payContractNameSelect" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号" prop="payerAcc">
                            <a-select v-model="payDetailOtherForm.payerAcc" placeholder="请选择">
                                <a-select-option v-for="item of bankNumSelect" :key="item.value" :value="item.value">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <a-input 
                                type="number"  
                                v-model="contractPaidAmount"
                                placeholder="请输入"
                                disabled
                                />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <a-input 
                                type="number"  
                                v-model="contractSettlAmount"
                                placeholder="请输入"
                                disabled
                                />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款总金额（元）" prop="paymentAmount">
                        <a-input 
                            type="number"  
                            v-model="payDetailOtherForm.paymentAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款总笔数" prop="paymentNum">
                            <a-input 
                                type="number" 
                                v-model="payDetailOtherForm.paymentNum" 
                                placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="payDetailOtherForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="payDetailOtherForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-form-model-item label="所属结算批次">
                        <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                        <a-button type="link" @click="handleSettleClick">选择</a-button>
                    </a-form-model-item>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleOtherPayChangeFile"
                            :before-upload="beforeOtherPayImgUpload"
                            :default-file-list="payDetailOtherForm.fileUrlList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleOtherPayChangeApproveFile"
                            :before-upload="beforeOtherPayImgApproveUpload"
                            :default-file-list="payDetailOtherForm.fileUrlApproveList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <!-- <a-row :gutter="24">
                    <a-col :span="15" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传付款明细" prop="fileDetails">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleOtherPayDetailChangeFile"
                            :before-upload="beforeOtherPayDetailImgUpload"
                            :default-file-list="payDetailOtherForm.fileDetails"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        <a class="download-wrapper" :href="`${$fileUrl}/model/downloadModel/2`">批量代付（对私）模板下载</a>
                        </a-form-model-item>
                    </a-col>
                </a-row> -->
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="选择合同相关联工资单">
                            <span v-if="isSalarySelect">{{ cacheSalary }}</span>
                            <a-button type="link" @click="handleSalarySelectClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleOtherPayChangeOtherFile"
                            :before-upload="beforeOtherPayImgOtherUpload"
                            :default-file-list="payDetailOtherForm.fileUrlOtherList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工资 -->
        <a-modal v-model="isSalaryDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleSalaryDetailSubmitClick" @cancel="handleSalaryDetailCancelClick">
            <a-form-model
                ref='ruleSalaryDetailForm'
                :model="salaryDetailForm"
                :rules="salaryDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                            <a-input 
                                type="text" 
                                v-model="salaryDetailForm.taskName"
                            />
                        </a-form-model-item>
                    </a-col>
                     <a-col :span="12">
                        <a-form-model-item label="所属乙方公司名称"  prop="companyBName">
                        <a-select show-search v-model="salaryDetailForm.companyBName" :filter-option="filterOption" placeholder="请选择" @change="handleCompanyBNameChange">
                            <a-select-option v-for="item of companyBNameList" :key="item.companyBName" :value="item.companyBName">
                            {{ item.companyBName }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" v-if="companyContractList.length > 0">
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                            <a-select v-model="salaryDetailForm.belongSubContractCode" placeholder="请选择" @change="handleSalaryContractCodeChange">
                                <a-select-option v-for="item of companyContractList" :key="item.contractCode" :value="item.contractCode">
                                {{ item.contractName }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                     <a-col :span="12">
                        <a-form-model-item label="合同金额（元）">
                        <a-input 
                            type="text"
                            v-model="contractNum"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.companyAName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <!-- <a-form-model-item label="中标主体工资专户名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payerName"
                            disabled
                        />
                        </a-form-model-item> -->
                        <a-form-model-item label="中标主体工资专户名称">
                            <a-select v-model="salaryObj.payerName" 
                                    show-search
                                    placeholder="请选择中标主体工资专户名称"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    :options="salaryData"
                                    @search="handleSalaryPayerSearch"
                                    @change="handleSalaryPayerChange">
                                </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payerAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.companyBName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商账户名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payeeName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payeeAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payeeOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行联行号">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payeeOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.contractPaidAmount"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.contractSettlAmount"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                        <a-input 
                            type="text" 
                            v-model="salaryDetailForm.totalSalary"
                            
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                        <a-input 
                            type="text" 
                            v-model="salaryDetailForm.totalNum"
                            
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="salaryDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                        <a-input 
                            type="text" 
                            v-model="salaryDetailForm.transactionRemark"
                            
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <a-month-picker placeholder="请选择工资月份" @change="handleSalartMonthChange" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-form-model-item label="所属结算批次">
                        <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                        <a-button type="link" @click="handleSettleClick">选择</a-button>
                    </a-form-model-item>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryChangeFile"
                                :before-upload="beforeSalaryImgUpload"
                                :default-file-list="salaryDetailForm.fileUrlList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryChangeApproveFile"
                                :before-upload="beforeSalaryImgApproveUpload"
                                :default-file-list="salaryDetailForm.fileUrlApproveList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="选择合同相关联工资单">
                            <!-- <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryDetailChangeFile"
                                :before-upload="beforeSalaryDetailImgUpload"
                                :default-file-list="salaryDetailForm.fileDetails"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                            <a class="download-wrapper" :href="`${$fileUrl}/model/downloadModel/1`">批量代付明细账单模板下载</a> -->
                            <span v-if="isSalarySelect">{{ cacheSalary }}</span>
                            <a-button type="link" @click="handleSalarySelectClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryChangeOtherFile"
                                :before-upload="beforeSalaryImgOtherUpload"
                                :default-file-list="salaryDetailForm.fileUrlOtherList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工资 (劳务分包，专业分包) -->
        <a-modal v-model="isSubContractSalaryDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleSubContractSalaryDetailSubmitClick" @cancel="handleSubContractSalaryDetailCancelClick">
            <a-form-model
                ref='ruleSubContractSalaryDetailForm'
                :model="subContractSalaryDetailForm"
                :rules="subContractSalaryDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                            <a-input 
                                type="text" 
                                v-model="subContractSalaryDetailForm.taskName"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                            <a-select v-model="subContractSalaryDetailForm.belongSubContractCode" placeholder="请选择" @change="handleSubContractSalaryContractCodeChange">
                                <a-select-option v-for="item of subContractSelectList" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="subContractSalaryObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                        <a-input 
                            type="text" 
                            v-model="subContractSalaryObj.companyAName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款银行账号" prop="payerAcc">
                        <!-- <a-input 
                            type="text" 
                            v-model="subContractSalaryObj.companyBName"
                            disabled
                        /> -->
                            <a-select v-model="subContractSalaryDetailForm.payerAcc" placeholder="请选择" @change="handleSubContractSalaryContractBankCodeChange">
                                <a-select-option v-for="item of payAccountInfoSelect" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款账号户名">
                        <a-input 
                            type="text" 
                            v-model="payAccountInfo.payerName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款账号开户行">
                        <a-input 
                            type="text" 
                            v-model="payAccountInfo.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款账号开户行联行号">
                        <a-input 
                            type="text" 
                            v-model="payAccountInfo.payerOpenBankNo"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="number"  
                            v-model="payAccountInfo.contractPaidAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="payAccountInfo.contractSettlAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                        <a-input 
                            type="number" 
                            v-model="subContractSalaryDetailForm.totalSalary"
                            placeholder="请输入"
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                        <a-input 
                            type="number" 
                            v-model="subContractSalaryDetailForm.totalNum"
                            placeholder="请输入"
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="subContractSalaryDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                        <a-input 
                            type="text" 
                            v-model="subContractSalaryDetailForm.transactionRemark"
                            
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <a-month-picker placeholder="请选择工资月份" @change="handleSubContractSalartMonthChange" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-form-model-item label="所属结算批次">
                        <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                        <a-button type="link" @click="handleSettleClick">选择</a-button>
                    </a-form-model-item>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSubContractSalaryChangeFile"
                                :before-upload="beforeSubContractSalaryImgUpload"
                                :default-file-list="subContractSalaryDetailForm.fileUrlList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSubContractSalaryChangeApproveFile"
                                :before-upload="beforeSubContractSalaryImgApproveUpload"
                                :default-file-list="subContractSalaryDetailForm.fileUrlApproveList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="选择合同相关联工资单">
                            <!-- <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSubContractSalaryDetailChangeFile"
                                :before-upload="beforeSubContractSalaryDetailImgUpload"
                                :default-file-list="subContractSalaryDetailForm.fileDetails"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                            <a class="download-wrapper" :href="`${$fileUrl}/model/downloadModel/1`">批量代付明细账单模板下载</a> -->
                            <span v-if="isSalarySelect">{{ cacheSalary }}</span>
                            <a-button type="link" @click="handleSalarySelectClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSubContractSalaryChangeOtherFile"
                                :before-upload="beforeSubContractSalaryImgOtherUpload"
                                :default-file-list="subContractSalaryDetailForm.fileUrlOtherList"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 请款+代发 -->
        <!-- <a-modal v-model="isReqAndPayDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleReqAndPayDetailSubmitClick" @cancel="handleReqAndPayDetailCancelClick">
            <a-form-model
                ref='ruleReqAndPayForm'
                :model="reqAndPayDetailForm"
                :rules="reqAndPayDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayDetailForm.taskName"
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属总包合同名称" prop="belongGeneralContractCode">
                        <a-select v-model="reqAndPayDetailForm.belongGeneralContractCode" placeholder="请选择" @change="handleReqAndPayTotalContractCodeChange">
                            <a-select-option v-for="item of totalContractSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                        <a-select v-model="reqAndPayDetailForm.belongSubContractCode" placeholder="请选择" @change="handleSubContractCodeChange">
                            <a-select-option v-for="item of subContractSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.companyAName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户名称">
                            <a-select v-model="reqAndPayObj.payerName" 
                                    show-search
                                    placeholder="请选择中标主体工资专户名称"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    :options="payerData"
                                    @search="handlePayerSearch"
                                    @change="handlePayerChange">
                                </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payerAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>建设单位信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位名称">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitName"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户名称">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitAccName"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位银行账号">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitAcc"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户开户行">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.ownerUnitOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    
                </a-row>
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.companyBName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayDetailForm.totalSalary"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayDetailForm.totalNum"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="reqAndPayDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <a-month-picker placeholder="请选择工资月份" @change="handleMonthChange" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeFile"
                            :before-upload="beforeReqAndPayImgUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlList"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeApproveFile"
                            :before-upload="beforeReqAndPayImgApproveUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlApproveList"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细" prop="fileDetails">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayDetailChangeFile"
                            :before-upload="beforeReqAndPayDetailImgUpload"
                            :default-file-list="reqAndPayDetailForm.fileDetails"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                            <span class="download-wrapper" @click="handleBatchDownload">批量代付明细账单模板下载</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeOtherFile"
                            :before-upload="beforeReqAndPayImgOtherUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlOtherList"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal> -->

        
        <!-- 请款+代发 -->
        <a-modal v-model="isReqAndPayDetailVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleReqAndPayDetailSubmitClick" @cancel="handleReqAndPayDetailCancelClick">
            <a-form-model
                ref='ruleReqAndPayForm'
                :model="reqAndPayDetailForm"
                :rules="reqAndPayDetailRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayDetailForm.taskName"
                        />
                        </a-form-model-item>
                    </a-col>
                    <!-- <a-col :span="12">
                        <a-form-model-item label="所属总包合同名称" prop="belongGeneralContractCode">
                        <a-select v-model="reqAndPayDetailForm.belongGeneralContractCode" placeholder="请选择" @change="handleReqAndPayTotalContractCodeChange">
                            <a-select-option v-for="item of totalContractSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col> -->
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                        <a-select v-model="reqAndPayDetailForm.belongSubContractCode" placeholder="请选择" @change="handleSubContractCodeChange">
                            <a-select-option v-for="item of subContractSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                            </a-select-option>
                        </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.prjName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.companyAName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户名称">
                            <a-select v-model="reqAndPayObj.payerName" 
                                    show-search
                                    placeholder="请选择中标主体工资专户名称"
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="null"
                                    :options="payerData"
                                    @search="handlePayerSearch"
                                    @change="handlePayerChange">
                                </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payerAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payerOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <!-- <div class="modal-title">
                    <span>建设单位信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位名称">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitName"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户名称">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitAccName"
                                disabled
                            />
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位银行账号">
                            <a-input 
                                type="text" 
                                v-model="reqAndPayObj.ownerUnitAcc"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户开户行">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.ownerUnitOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    
                </a-row> -->
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.companyBName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号户名">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payeeName"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payeeAcc"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行">
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payeeOpenBank"
                            disabled
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayObj.contractPaidAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayObj.contractSettlAmount"
                            disabled
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayDetailForm.totalSalary"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                        <a-input 
                            type="text"  
                            v-model="reqAndPayDetailForm.totalNum"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                        <a-input 
                            type="number"  
                            v-model="reqAndPayDetailForm.currentSettlementAmount"
                            placeholder="请输入"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="reqAndPayDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <a-month-picker placeholder="请选择工资月份" @change="handleMonthChange" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-form-model-item label="所属结算批次">
                        <span v-if="isSettleSelect">{{ cacheSettle }}</span>
                        <a-button type="link" @click="handleSettleClick">选择</a-button>
                    </a-form-model-item>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeFile"
                            :before-upload="beforeReqAndPayImgUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeApproveFile"
                            :before-upload="beforeReqAndPayImgApproveUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlApproveList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <!-- <a-form-model-item class="upload-wrapper" label="上传工资明细" prop="fileDetails">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayDetailChangeFile"
                            :before-upload="beforeReqAndPayDetailImgUpload"
                            :default-file-list="reqAndPayDetailForm.fileDetails"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                            <a class="download-wrapper" :href="`${$fileUrl}/model/downloadModel/1`">批量代付明细账单模板下载</a>
                        </a-form-model-item> -->
                        <a-form-model-item class="upload-wrapper" label="选择合同相关联工资单">
                            <span v-if="isSalarySelect">{{ cacheSalary }}</span>
                            <a-button type="link" @click="handleSalarySelectClick">选择</a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqAndPayChangeOtherFile"
                            :before-upload="beforeReqAndPayImgOtherUpload"
                            :default-file-list="reqAndPayDetailForm.fileUrlOtherList"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <a-modal v-model="isContractRoleVisible" class="addModal" ok-text="确认" cancel-text="取消" @ok="handleContractRoleSubmitClick" @cancel="handleContractRoleCancelClick">
            <a-form-model
                ref='contractRoleForm'
                :model="contractRoleForm"
                :rules="contractRoleRules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="合同经办人" prop="contractOperator">
                        <a-select v-model="contractRoleForm.contractOperator" placeholder="请选择合同经办人">
                          <a-select-option v-for="item of agentSelect" :key="item.value" :value="item.value">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同一级复核人" prop="contractPrimaryReviewer">
                        <a-select v-model="contractRoleForm.contractPrimaryReviewer" placeholder="请选择合同一级复核人">
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
                            <a-select v-model="contractRoleForm.contractSecondaryReviewer" placeholder="请选择合同二级复核人">
                            <a-select-option v-for="item of reviewSelect2" :key="item.value" :value="item.value">
                                {{ item.name }}
                            </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                
                
            </a-form-model>
        </a-modal>


        <!-- 详情 -->
        <!-- 请款详情 -->
        <a-modal v-model="isReqDetailViewVisible" class="addModal" ok-text="确认" @ok="handleReqDetailViewSubmitClick">
            <a-form-model
                ref='reqDetailViewForm'
                :model="reqDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="任务名称" prop="taskName">
                        <span>{{ reqDetailView.taskName }}</span>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="所属合同名称" prop="belongContractCode">
                        <span>{{ reqDetailView.belongContractCode }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="所属项目名称">
                        <span>{{ reqDetailView.prjName }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                            <span>{{ reqDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款银行账号户名">
                            <span>{{ reqDetailView.payerName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方开户行">
                            <span>{{ reqDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款方联行行号">
                            <span>{{ reqDetailView.payerOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                    <a-form-model-item label="收款方银行账号">
                        <span>{{ reqDetailView.payeeAcc }}</span>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="收款银行账号户名">
                        <span>{{ reqDetailView.payeeName }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方开户行">
                            <span>{{ reqDetailView.payeeOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                            <span>{{ reqDetailView.payeeOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ reqDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ reqDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="申请金额（元）">
                            <span>{{ reqDetailView.applicationAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ reqDetailView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ reqDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ reqDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of reqDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of reqDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of reqDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工程进度请款详情 -->
        <a-modal v-model="isProgressReqDetailViewVisible" class="addModal" ok-text="确认" @ok="handleProgressReqDetailViewSubmitClick">
            <a-form-model
                ref='progressReqDetailForm'
                :model="progressReqDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="任务名称" prop="taskName">
                        <span>{{ progressReqDetailView.taskName }}</span>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="所属合同名称">
                    <span>{{ progressReqDetailView.belongContractCode }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ progressReqDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="累计验工计价金额（元）">
                            <span>{{ progressReqDetailView.totalValuationAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次验工计价金额（元）">
                        <span>{{ progressReqDetailView.currentValuationAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                            <span>{{ progressReqDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款银行账号户名">
                        <span>{{ progressReqDetailView.payerName}}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方开户行">
                            <span>{{ progressReqDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款方联行行号">
                            <span>{{ progressReqDetailView.payerOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                    <a-form-model-item label="收款方银行账号">
                        <span>{{ progressReqDetailView.payeeAcc }}</span>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="收款银行账号户名">
                        <span>{{ progressReqDetailView.payeeName }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方开户行">
                            <span>{{ progressReqDetailView.payeeOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                            <span>{{ progressReqDetailView.payeeOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ progressReqDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ progressReqDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="申请金额（元）">
                            <span>{{ progressReqDetailView.applicationAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ progressReqDetailView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ progressReqDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ progressReqDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of progressReqDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            <span></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of progressReqDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            <span></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of progressReqDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            <span></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 付款详情 -->
        <a-modal v-model="isPayDetailViewVisible" class="addModal" ok-text="确认" @ok="handlePayDetailViewSubmitClick">
            <a-form-model
                ref='rulePaymentViewForm'
                :model="payDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称">
                            <span>{{ payDetailView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属合同名称">
                        <span>{{ payDetailView.belongContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ payDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                        <span>{{ payDetailView.paymentBankNum }}</span>
                        </a-form-model-item>

                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>收款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方名称">
                            <span>{{ payDetailView.payeeName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款银行账号户名">
                            <span>{{ payDetailView.payeeName }}</span>
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方银行账号">
                            <span>{{ payDetailView.payeeAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方联行行号">
                        <span>{{ payDetailView.payeeOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                    
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="收款方开户行">
                            <span>{{ payDetailView.payeeOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ payDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ payDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款金额（元）">
                            <span>{{ payDetailView.paymentAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ payDetailView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ payDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ payDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of payDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of payDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of payDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>


        <!-- 其他付款详情 -->
        <a-modal v-model="isOtherDetailViewVisible" class="addModal" ok-text="确认" @ok="handlePayDetailOtherViewSubmitClick">
            <a-form-model
                ref='ruleOtherForm'
                :model="payDetailOtherView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                            <span>{{ payDetailOtherView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称" prop="prjName">
                            <span>{{ payDetailOtherView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属合同名称" prop="belongContractCode">
                            <span>{{ payDetailOtherView.belongContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号" prop="payerAcc">
                            <span>{{ payDetailOtherView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ payDetailOtherView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ payDetailOtherView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款总金额（元）" prop="paymentAmount">
                            <span>{{ payDetailOtherView.paymentAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款总笔数" prop="paymentNum">
                            <span>{{ payDetailOtherView.paymentNum }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ payDetailOtherView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ payDetailOtherView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ payDetailOtherView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of payDetailOtherView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of payDetailOtherView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="15" class="upload">
                        <a-form-model-item class="upload-wrapper" label="合同相关联工资单">
                            <span></span>
                        <!-- <span v-for="(item, index) of payDetailOtherView.paymentDetails" :key="index">{{ item.name }} <a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a><br/></span> -->
                        <!-- <span class="download-wrapper-left" @click="handleLeftBatchDownload">批量代付（对私）模板下载</span> -->
                        <!-- <span class="download-wrapper-right" @click="handleRightBatchDownload">批量代付（对公）模板下载</span> -->
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of payDetailOtherView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工资详情 -->
        <a-modal v-model="isSalaryDetailViewVisible" class="addModal" ok-text="确认" @ok="handleSalaryDetailViewSubmitClick">
            <a-form-model
                ref='ruleSalaryDetailForm'
                :model="salaryDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                            <span>{{ salaryDetailView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                            <span>{{ salaryDetailView.belongSubContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ salaryDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                            <span>{{ salaryDetailView.companyAName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户名称">
                            <span>{{ salaryDetailView.payerName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                            <span>{{ salaryDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                            <span>{{ salaryDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                            <span>{{ salaryDetailView.companyBName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商账户名称">
                            <span>{{ salaryDetailView.payeeName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号">
                            <span>{{ salaryDetailView.payeeAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行">
                            <span>{{ salaryDetailView.payeeOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行联行号">
                            <span>{{ salaryDetailView.payeeOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ salaryDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ salaryDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）">
                            <span>{{ salaryDetailView.totalSalary }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数">
                            <span>{{ salaryDetailView.totalNum }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                            <a-form-model-item label="本次结算金额（元）">
                                <span>{{ salaryDetailView.currentSettlementAmount }}</span>
                            </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ salaryDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <span>{{ salaryDetailView.month }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ salaryDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of salaryDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of salaryDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细">
                            <div class="upload-list">
                                <span v-for="(item, index) of salaryDetailView.salaryDetails" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            </div>
                            <!-- <a class="download-wrapper" href="http://203.110.222.136:8081/model/downloadModel/1">批量代付明细账单模板下载</a> -->
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of salaryDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

        <!-- 工资详情 （劳务分包，专业分包） -->
        <a-modal v-model="isSubContractSalaryDetailViewVisible" class="addModal" ok-text="确认" @ok="handleSubContractSalaryDetailViewSubmitClick">
            <a-form-model
                ref='ruleSalaryDetailForm'
                :model="salaryDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称" prop="taskName">
                            <span>{{ salaryDetailView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                            <span>{{ salaryDetailView.belongSubContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ salaryDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                            <span>{{ salaryDetailView.companyAName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>付款方信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款方银行账号">
                            <span>{{ salaryDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款账号户名">
                            <span>{{ salaryDetailView.payerName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="付款账号开户行">
                            <span>{{ salaryDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款账号开户行联行号">
                            <span>{{ salaryDetailView.payerOpenBankNo }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ salaryDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ salaryDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                    <a-form-model-item label="工资总金额（元）">
                        <span>{{ salaryDetailView.totalSalary }}</span>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="工资笔数">
                        <span>{{ salaryDetailView.totalNum }}</span>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ salaryDetailView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ salaryDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <span>{{ salaryDetailView.month }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ salaryDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of salaryDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of salaryDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细">
                            <div class="upload-list">
                                <span v-for="(item, index) of salaryDetailView.salaryDetails" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            </div>
                            <!-- <a class="download-wrapper" href="http://203.110.222.136:8081/model/downloadModel/1">批量代付明细账单模板下载</a> -->
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>其他附件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of salaryDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>


        <!-- 请款+代发详情 -->
        <!-- <a-modal v-model="isReqAndPayDetailViewVisible" class="addModal" ok-text="确认" @ok="handleReqAndPayDetailViewSubmitClick">
            <a-form-model
                ref='ruleReqAndPayForm'
                :model="reqAndPayDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称">
                            <span>{{ reqAndPayDetailView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属总包合同名称">
                            <span>{{ reqAndPayDetailView.belongContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称">
                            <span>{{ reqAndPayDetailView.belongSubContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ reqAndPayDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                            <span>{{ reqAndPayDetailView.companyAName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户名称">
                            <span>{{ reqAndPayDetailView.payerName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                            <span>{{ reqAndPayDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                            <span>{{ reqAndPayDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>建设单位信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位名称">
                            <span>{{ reqAndPayDetailView.ownerUnitName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户名称">
                                <span>{{ reqAndPayDetailView.ownerUnitAccName }}</span>
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位银行账号">
                            <span>{{ reqAndPayDetailView.ownerUnitAcc}}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户开户行">
                            <span>{{ reqAndPayDetailView.ownerUnitOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    
                </a-row>
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                            <span>{{ reqAndPayDetailView.companyBName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                            <span>{{ reqAndPayDetailView.totalSalary }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                            <span>{{ reqAndPayDetailView.totalNum }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ reqAndPayDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <span>{{ reqAndPayDetailView.month }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of reqAndPayDetailView.invoiceFile" :key="index">{{ item.name }} <a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of reqAndPayDetailView.approveFile" :key="index">{{ item.name }} <a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细">
                            <span v-for="(item, index) of reqAndPayDetailView.salaryDetails" :key="index">{{ item.name }} <a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a><br/></span>
                            <span class="download-wrapper" @click="handleBatchDownload">批量代付明细账单模板下载</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of reqAndPayDetailView.otherFile" :key="index">{{ item.name }} <a :href="`${fileUrl}/files?fileId=${item.url}&flag=true`">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal> -->

        <a-modal v-model="isReqAndPayDetailViewVisible" class="addModal" ok-text="确认" @ok="handleReqAndPayDetailViewSubmitClick">
            <a-form-model
                ref='ruleReqAndPayForm'
                :model="reqAndPayDetailView"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-title">
                    <span>基本信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="任务名称">
                            <span>{{ reqAndPayDetailView.taskName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <!-- <a-col :span="12">
                        <a-form-model-item label="所属总包合同名称">
                            <span>{{ reqAndPayDetailView.belongContractCode }}</span>
                        </a-form-model-item>
                    </a-col> -->
                    <a-col :span="12">
                        <a-form-model-item label="所属劳务分包合同名称">
                            <span>{{ reqAndPayDetailView.belongSubContractCode }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属项目名称">
                            <span>{{ reqAndPayDetailView.prjName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>中标主体信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体名称">
                            <span>{{ reqAndPayDetailView.companyAName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户名称">
                            <span>{{ reqAndPayDetailView.payerName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户账号">
                            <span>{{ reqAndPayDetailView.payerAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="中标主体工资专户开户行">
                            <span>{{ reqAndPayDetailView.payerOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <!-- <div class="modal-title">
                    <span>建设单位信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位名称">
                            <span>{{ reqAndPayDetailView.ownerUnitName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户名称">
                                <span>{{ reqAndPayDetailView.ownerUnitAccName }}</span>
                            </a-form-model-item>
                        </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="建设单位银行账号">
                            <span>{{ reqAndPayDetailView.ownerUnitAcc}}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="建设单位账户开户行">
                            <span>{{ reqAndPayDetailView.ownerUnitOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                    
                </a-row> -->
                <div class="modal-title">
                    <span>分包商信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商名称">
                            <span>{{ reqAndPayDetailView.companyBName }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号户名">
                            <span>{{ reqAndPayDetailView.payeeName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="分包商银行账号">
                            <span>{{ reqAndPayDetailView.payeeAcc }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="分包商开户行">
                            <span>{{ reqAndPayDetailView.payeeOpenBank }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付申请信息</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="已支付金额（元）">
                            <span>{{ reqAndPayDetailView.contractPaidAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已结算金额（元）">
                            <span>{{ reqAndPayDetailView.contractSettlAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资总金额（元）" prop="totalSalary">
                            <span>{{ reqAndPayDetailView.totalSalary }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资笔数" prop="totalNum">
                            <span>{{ reqAndPayDetailView.totalNum }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次结算金额（元）">
                            <span>{{ reqAndPayDetailView.currentSettlementAmount }}</span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <span>{{ reqAndPayDetailView.transactionRemark }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <span>{{ reqAndPayDetailView.month }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属结算批次">
                            <span>{{ reqAndPayDetailView.settlementBatchName }}</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传发票附件">
                            <span v-for="(item, index) of reqAndPayDetailView.invoiceFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传审批文件">
                            <span v-for="(item, index) of reqAndPayDetailView.approveFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细">
                            <span v-for="(item, index) of reqAndPayDetailView.salaryDetails" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                            <!-- <span class="download-wrapper" @click="handleBatchDownload">批量代付明细账单模板下载</span> -->
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料">
                            <span v-for="(item, index) of reqAndPayDetailView.otherFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a><br/></span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>


        

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


        <!-- 所属结算批次列表选择 -->
        <a-modal v-model="isSettleVisible" class="addModal" title="结算批次" :footer="null">
            <a-form layout="inline">
                <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="批次名称">
                    <a-input v-model="settleParam.batchName" placeholder="请输入" style="width: 150px;"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="创建企业">
                    <a-input v-model="settleParam.companyName" placeholder="请输入" style="width: 150px;"/>
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
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange, type: 'radio' }"
                style="margin-top: 20px;"
            >
            </a-table>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handleSettleSubmitClick">确定</a-button>
            </div>
        </a-modal>

        <!-- 选择合同关联工资单 -->
        <a-modal v-model="isSalaryVisible" class="addModal" title="合同关联工资单" :footer="null">
            <a-form layout="inline">
                <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="工资单名称">
                    <a-input v-model="salaryParam.salaryName" placeholder="请输入" style="width: 150px;"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="合同名称">
                    <a-input v-model="salaryParam.contractName" placeholder="请输入" style="width: 150px;"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                        <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                        <a-button type="primary" @click="handleSalarySearchClick">查询</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
            <a-table
                :rowKey="((record, index) => {return index})"
                :columns="salaryManageColumns"
                :data-source="salaryManageData"
                :pagination="salaryManagePagination"
                :loading="salaryManageLoading"
                :customRow="handleSalaryManageClickRow"
                :rowSelection="{ selectedRowKeys: selectedSalaryRowKeys, onChange: handleSalarySelectionChange, type: 'radio' }"
                style="margin-top: 20px;"
                :scroll="{ x: 800, y: 500 }"
            >
                <template slot="operation" slot-scope="scope">
                    <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${scope.salaryDetails.split(',')[0].substring(scope.salaryDetails.lastIndexOf('\#') + 1, scope.salaryDetails.length)}&flag=true`)">下载</a>
                </template>
            </a-table>
            <div class="footer-wrapper">
                <a-button type="primary" @click="handleSalaryManageSubmitClick">确定</a-button>
            </div>
        </a-modal>


    </page-header-wrapper>
</template>
<script>
import { 
    getPaymentApplyList, 
    getReqTaskName, 
    getPayTaskName,
    getSalaryTaskName,
    getContractName,
    getReceive,
    addReqFund,
    addPayFund,
    getProject,
    getPaymentBankNum,
    getTotalContract,
    getSubContract,
    getReqAndPayReceive,
    addSalaryFund,
    getSubContractList,
    getPaymentContractName,
    getPayReceive,
    getReqReceive,
    setUpdateBProcessNode,
    downloadDetail,
    getApplyList,
    getApplyDetail,
    getReqDetail,
    getSalaryDetail,
    getPayAccount,
    getPayAccountInfo,
    getCurrentSmsInfo,
    getSettleList,
    getCompContractList,
    getComp1ContractList
} from '@/api/payment'
import { getUserRole } from '@/api/contract'
import { getSelectAccount } from '@/api/workbench'
import { getContractSalaryList } from '@/api/worker'

import { fileUrl } from '@/utils/request'
import ArticleListContent from '@/components/ArticleListContent/ArticleListContent.vue'

import * as XLSX from 'xlsx'

const columns = [
    {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        width: '15%'
    },
    {
        title: '合同编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
        width: '15%'
    },
    {
        title: '交易总金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: '15%'
    },
    {
        title: '当前流程',
        dataIndex: 'currentNode',
        key: 'currentNode',
        width: '15%'
    },
    {
        title: '提交时间',
        dataIndex: 'submitDate',
        key: 'submitDate',
        width: '15%'
    },
    { 
        title: '操作', 
        key: 'operation', 
        scopedSlots: { customRender: 'operation' },
        width: '15%'
    },
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

const salaryManageColumns = [
    // {
    //     title: '序号',
    //     scopedSlots: { customRender: 'serial' },
    //     width: '100px'
    // },
    {
        title: '工资单名称',
        dataIndex: 'salaryName',
        key: 'salaryName',
        width: '350px'
    },
    {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
        width: '350px'
    },
    {
        title: '合同甲方公司名称',
        dataIndex: 'companyAName',
        key: 'companyAName',
        width: '400px'
    },
    {
        title: '工资单月份',
        dataIndex: 'month',
        key: 'month',
        width: '150px'
    },
    {
        title: '工资单总金额（元）',
        dataIndex: 'totalSalary',
        key: 'totalSalary',
        width: '250px'
    },
    {
        title: '工资单总笔数',
        dataIndex: 'totalNum',
        key: 'totalNum',
        width: '150px'
    },
    { 
        title: '操作', 
        key: 'operation', 
        scopedSlots: { customRender: 'operation' },
        width: '80px',
        fixed: 'right'
    },
]

export default {
  components: { ArticleListContent },
    data () {
        this.columns = columns
        this.settleColumns = settleColumns
        this.salaryManageColumns = salaryManageColumns
        return {
            companyBNameList: [],
            companyBNameList1: [],
            companyContractList: [],
            contractNum: '',
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
            loading: false,
            projectNameSearch: '',
            type: this.$route.query.type,
            taskName: '',
            applyList: [],
            isReqDetailVisible: false,
            isPayDetailVisible: false,
            isSalaryDetailVisible: false,
            isOtherDetailVisible: false,
            isReqAndPayDetailVisible: false,
            isProgressReqDetailVisible: false,
            reqDetailForm: {
                taskName: '',
                belongContractCode: undefined,
                applicationAmount: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                fileUrlList: [],
                fileApproveUrlList: [],
                fileUrlOtherList: []
            },
            progressReqDetailForm: {
                taskName: '',
                belongContractCode: undefined,
                totalValuationAmount: null,
                currentValuationAmount: null,
                applicationAmount: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                fileUrlList: [],
                fileUrlApproveList: [],
                fileUrlOtherList: []
            },
            payDetailForm: {
                taskName: '',
                belongContractCode: undefined,
                paymentBankNum: undefined,
                paymentAmount: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                fileUrlList: [],
                fileUrlApproveList: [],
                fileUrlOtherList: []
            },
            payDetailOtherForm: {
                taskName: '',
                // prjName: undefined,
                belongContractCode: undefined,
                payerAcc: undefined,
                paymentAmount: '',
                paymentNum: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                fileUrlList: [],
                fileDetails: [],
                fileUrlApproveList: [],
                fileUrlOtherList: []
            },
            salaryDetailForm: {
                taskName: '',
                // companyBName: '',
                belongSubContractCode: undefined,
                totalSalary: '',
                totalNum: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                month: '',
                fileUrlList: [],
                fileDetails: [],
                fileUrlApproveList: [],
                fileUrlOtherList: []
            },
            subContractSalaryDetailForm: {
                taskName: '',
                belongSubContractCode: undefined,
                totalSalary: '',
                totalNum: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                month: '',
                fileUrlList: [],
                fileDetails: [],
                fileUrlApproveList: [],
                fileUrlOtherList: [],
                payerAcc: undefined
            },
            reqAndPayDetailForm: {
                taskName: '',
                belongGeneralContractCode: undefined,
                belongSubContractCode: undefined,
                totalSalary: '',
                totalNum: '',
                currentSettlementAmount: '',
                transactionRemark: '',
                month: '',
                fileUrlList: [],
                fileDetails: [],
                fileUrlApproveList: [],
                fileUrlOtherList: []
            },
            reqDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                applicationAmount: [{ required: true, message: '请输入申请金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }], 
                fileApproveUrlList: [{ required: true, message: '请上传审批文件', trigger: 'change' }], 
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }], 
            },
            progressReqDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                totalValuationAmount: [{ required: true, message: '请输入累计验工计价金额', trigger: 'change' }], 
                currentValuationAmount: [{ required: true, message: '请输入本次验工计价金额', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                applicationAmount: [{ required: true, message: '请输入申请金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }], 
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }], 
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }], 
            },
            payDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                companyBName: [{ required: true, message: '请选择所属乙方公司名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                paymentBankNum: [{ required: true, message: '请选择付款银行账号', trigger: 'change' }], 
                paymentAmount: [{ required: true, message: '请输入付款总金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }],
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }],
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }]
            },
            payDetailOtherRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                // prjName: [{ required: true, message: '请选择所属项目名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                payerAcc: [{ required: true, message: '请选择付款方银行账号', trigger: 'change' }],
                paymentAmount: [{ required: true, message: '请输入付款总金额', trigger: 'change' }], 
                paymentNum: [{ required: true, message: '请输入付款笔数', trigger: 'change' }],
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上传付款明细', trigger: 'change' }],
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }],
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }],
            },
            salaryDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                companyBName: [{ required: true, message: '请选择所属乙方公司名称', trigger: 'change' }],
                belongSubContractCode: [{ required: true, message: '请选择所属劳务分包合同名称', trigger: 'change' }], 
                totalSalary: [{ required: true, message: '请输入工资总金额', trigger: 'change' }], 
                totalNum: [{ required: true, message: '请输入工资总笔数', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上工资明细', trigger: 'change' }],
                payerName: [{ required: true, message: '请选择中标主体工资专户名称', trigger: 'change' }],
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }],
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }],
            },
            subContractSalaryDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongSubContractCode: [{ required: true, message: '请选择所属劳务分包合同名称', trigger: 'change' }], 
                totalSalary: [{ required: true, message: '请输入工资总金额', trigger: 'change' }], 
                totalNum: [{ required: true, message: '请输入工资总笔数', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上工资明细', trigger: 'change' }],
                payerName: [{ required: true, message: '请选择中标主体工资专户名称', trigger: 'change' }],
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }],
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }],
                payerAcc: [{ required: true, message: '请选择付款银行账号', trigger: 'change' }], 
            },
            reqAndPayDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongGeneralContractCode: [{ required: true, message: '请选择所属总包合同名称', trigger: 'change' }], 
                belongSubContractCode: [{ required: true, message: '请选择所属劳务分包合同名称', trigger: 'change' }], 
                totalSalary: [{ required: true, message: '请输入工资总金额', trigger: 'change' }], 
                totalNum: [{ required: true, message: '请输入工资总笔数', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传发票附件', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上传工资明细', trigger: 'change' }], 
                fileUrlApproveList: [{ required: true, message: '请上传审批文件', trigger: 'change' }],
                fileUrlOtherList: [{ required: true, message: '请上传材料', trigger: 'change' }],
            },
            contractNameSelect: [],
            payContractNameSelect: [],
            applicationType: null,
            projectNameSelect: [],
            isBankNumDisabled: true,
            bankNumSelect: [],
            totalContractSelect: [],
            subContractSelect: [],
            subContractSelectList: [],
            reqAndPayObj: {},
            salaryObj: {},
            paymentObj: {},
            requestObj: {},
            progressObj: {},
            paymentBankNumSelect: [],
            isContractRoleVisible: false,
            contractRoleForm: {
                contractOperator: undefined,
                contractPrimaryReviewer: undefined,
                contractSecondaryReviewer: undefined
            },
            contractRoleRules: {
                contractOperator: [{ required: true, message: '请选择合同经办人', trigger: 'change' }], 
                contractPrimaryReviewer: [{ required: true, message: '请选择合同一级复核人', trigger: 'change' }], 
                companyOperator: [{ required: true, message: '请选择甲方企业经办人', trigger: 'change' }], 
            },
            agentSelect: [],
            reviewSelect1: [],
            reviewSelect2: [],
            contractRoleCode: '',
            paymentProcessId: '',
            isPayDetailViewVisible: false,
            isReqDetailViewVisible: false,
            isOtherDetailViewVisible: false,
            isProgressReqDetailViewVisible: false,
            isReqAndPayDetailViewVisible: false,
            isSalaryDetailViewVisible: false,
            payDetailView: {},
            reqDetailView: {},
            payDetailOtherView: {},
            progressReqDetailView: {},
            reqAndPayDetailView: {},
            salaryDetailView: {},
            fileUrl,
            payerData: [],
            payerSelectList: [],
            salaryData: [],
            salarySelectList: [],
            requestData: [],
            requestSelectList: [],
            scene: this.$route.query.scene,
            isSubContractSalaryDetailVisible: false,
            subContractSalaryObj: {},
            payAccountInfo: {},
            payAccountInfoSelect: [],
            isSubContractSalaryDetailViewVisible: false,
            prjNameValue: '',
            isShowVerification: false,
            verificationForm: {
                code: ''
            },
            verificationRules: {
                code: [{ required: true, message: '请输入短信验证码', trigger: 'change' }], 
            },
            cacheDataObj: {},
            isSettleSelect: false,
            cacheSettle: '',
            isSettleVisible: false,
            settleParam: {
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
            advanced: false,
            contractPaidAmount: '',
            contractSettlAmount: '',
            isSettleSelect: false,
            isSalaryVisible: false,
            salaryParam: {
                contractName: '',
                salaryName: ''
            },
            salaryManageData: [],
            salaryManagePagination: {
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
                this.handleSalaryManagePageChange(page, pageSize)
                },
                onShowSizeChange: (current, size) => {
                this.handleSalaryManageShowSizeChange(current, size)
                },
            },
            salaryManageLoading: false,
            selectedSalaryRowKeys: [],
            selectionSalaryRows: [],
            isSalarySelect: false,
            cacheSalary: ''
        }
    },
    mounted() {
        this.getContractNameList()
        this.getProjectList()
        this.getTotalContractList()
        this.getSubContractListInfo()
        this.getPaymentContractNameList()
        this.getPaymentBankNumList()
        this.getApplyInfo()
        this.getPayAccountSelect()
        this.getSettleInfo()
        this.getSalaryManageInfo()
        getCompContractList(' ').then(res => {
            this.companyBNameList = res
        })
        getComp1ContractList(' ').then(res => {
            this.companyBNameList1 = res
        })
    },
    watch: {
        // 'payDetailOtherForm.belongContractCode'(newVal) {
        //     getPayReceive(newVal).then(res => {
        //         if(res.status == 1 && res.data) {
        //             console.log(22222222222)
        //             this.payDetailOtherForm.prjName = res.data.prjName
        //         }
        //     })
        // }
    },
    methods: {
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        getApplyInfo() {
            let reqObj = {
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                taskName: this.taskName,
                paymentScene: this.type,

            }
            getApplyList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    this.loadData = res.data.pageList
                }
            })
        },
        getSettleInfo() {
            this.settleLoading = true
            let reqObj = {
                batchName: this.settleParam.batchName,
                companyName: this.settleParam.companyName,
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
        getSalaryManageInfo() {
            let reqObj = {
                contractName: this.salaryParam.contractName,
                salaryName: this.salaryParam.salaryName,
                pageNum: this.salaryManagePagination.current,
                pageSize: this.salaryManagePagination.pageSize
            }
            getContractSalaryList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    const data = res.data
                    this.salaryManageData = data.pageList
                }
            })
        },
        handleAddClick() {
            let self = this
            this.applicationType = self.type
            if(this.type == 1) {
                // 请款
                this.isReqDetailVisible = true
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                getReqTaskName(this.type).then(res => {
                    if(res.status == 1) {
                        self.reqDetailForm.taskName = res.data
                        console.log()
                    } else {
                        this.$message.warning(res.message)
                    }
                    
                })
            } else if(this.type == 2) {
                // 工程进度请款
                this.isProgressReqDetailVisible = true
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                getReqTaskName(this.type).then(res => {
                    self.progressReqDetailForm.taskName = res.data
                })
            } else if(this.type >= 3 && this.type <= 6 ) {
                this.isReqDetailVisible = true
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                this.reqDetailForm = {}
                getReqTaskName(this.type).then(res => {
                    self.reqDetailForm.taskName = res.data
                })
            } else if(this.type >= 7 && this.type < 13) {
                // 付款
                this.isPayDetailVisible = true
                this.isReqDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                getPayTaskName(this.type).then(res => {
                    self.payDetailForm.taskName = res.data
                })
            } else if(this.type == 13) {
                this.isSalaryDetailVisible = false
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = true
                this.isProgressReqDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                this.prjNameValue = ''
                this.contractPaidAmount = ''
                this.contractSettlAmount = ''
                getPayTaskName(this.type).then(res => {
                    self.payDetailOtherForm.taskName = res.data
                })
            } else if(this.type == 14) {
                // 请款+代发
                this.isReqAndPayDetailVisible = true
                this.isSalaryDetailVisible = false
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                this.isSubContractSalaryDetailVisible = false
                getSalaryTaskName(this.type).then(res => {
                    self.reqAndPayDetailForm.taskName = res.data
                })
            } else if(this.type > 14) {
                // 工资
                if(this.scene == 3 || this.scene == 6) {
                    this.isSubContractSalaryDetailVisible = true
                    this.isSalaryDetailVisible = false
                } else {
                    this.isSalaryDetailVisible = true
                    this.isSubContractSalaryDetailVisible = false
                }
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getSalaryTaskName(this.type).then(res => {
                    self.salaryDetailForm.taskName = res.data
                    self.subContractSalaryDetailForm.taskName = res.data
                })
            }
        },
        getPaymentApplyInfo() {
            getPaymentApplyList().then(res => {
                this.applyList = res
            })
        },
        getContractNameList() {
            getContractName().then(res => {
                this.contractNameSelect = res
            })
        },
        getProjectList () {
            getProject().then(res => {
                this.projectNameSelect = res
            })
        },
        getTotalContractList() {
            getTotalContract().then(res => {
                this.totalContractSelect = res
            })
        },
        getSubContractListInfo () {
            getSubContractList().then(res => {
                this.subContractSelectList = res
                this.subContractSelect = res
            })
        },
        getPaymentContractNameList () {
            getPaymentContractName().then(res => {
                this.payContractNameSelect = res
            })
        },
        getPaymentBankNumList () {
            getPaymentBankNum().then(res => {
                this.paymentBankNumSelect = res
                this.bankNumSelect = res
            })
        },
        getPayAccountSelect() {
            getPayAccount().then(res => {
                this.payAccountInfoSelect = res
            })
        },
        handleClick(item) {
            if(!item.editFlag) {
                this.$message.warning('当前用户无做操作权限！')
                return
            }
            let self = this
            this.applicationType = item.type
            if(item.type == 1) {
                // 请款
                this.isReqDetailVisible = true
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getReqTaskName(item.type).then(res => {
                    self.reqDetailForm.taskName = res.data
                })
            } else if(item.type == 2) {
                // 工程进度请款
                this.isProgressReqDetailVisible = true
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                getReqTaskName(item.type).then(res => {
                    self.progressReqDetailForm.taskName = res.data
                })
            } else if(item.type >= 3 && item.type <= 6 ) {
                this.isReqDetailVisible = true
                this.isPayDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getReqTaskName(item.type).then(res => {
                    self.reqDetailForm.taskName = res.data
                })
            } else if(item.type >= 7 && item.type < 13) {
                // 付款
                this.isPayDetailVisible = true
                this.isReqDetailVisible = false
                this.isSalaryDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getPayTaskName(item.type).then(res => {
                    self.payDetailForm.taskName = res.data
                })
            } else if(item.type == 13) {
                this.isSalaryDetailVisible = false
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = true
                this.isProgressReqDetailVisible = false
                getPayTaskName(item.type).then(res => {
                    self.payDetailOtherForm.taskName = res.data
                })
            } else if(item.type == 14) {
                // 请款+代发
                this.isReqAndPayDetailVisible = true
                this.isSalaryDetailVisible = false
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getSalaryTaskName(item.type).then(res => {
                    self.reqAndPayDetailForm.taskName = res.data
                })
            } else if(item.type > 14) {
                // 工资
                this.isSalaryDetailVisible = true
                this.isReqDetailVisible = false
                this.isPayDetailVisible = false
                this.isOtherDetailVisible = false
                this.isProgressReqDetailVisible = false
                getSalaryTaskName(item.type).then(res => {
                    self.salaryDetailForm.taskName = res.data
                })
            }
        },
        handleReqContractCodeChange(value) {
            let reqObj = {
                contractCode: value
            }
            getReqReceive(reqObj).then(res => {
                if(res.status == 1) {
                    this.requestObj = res.data
                }
            })
        },
        // 请款
        handleReqDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.reqDetailForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.reqDetailForm)
                    reqObj.applicationAmount = Number(reqObj.applicationAmount)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    reqObj.applicationType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile
                    let approveFile = ''
                    reqObj.fileApproveUrlList && reqObj.fileApproveUrlList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile
                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    delete reqObj.fileUrlList
                    delete reqObj.fileApproveUrlList
                    delete reqObj.fileUrlOtherList
                    addReqFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isReqDetailVisible = false
                            if(res.data.contractCode == 'contractCode1') {
                                this.contractRoleCode = res.data.contractCode
                                this.paymentProcessId = res.data.paymentProcessId
                                this.isContractRoleVisible = true
                                this.getUserRoleList(1, res.data.contractACompanyCode, res.data.contractBCompanyCode)
                                this.getUserRoleList(2, res.data.contractACompanyCode, res.data.contractBCompanyCode)
                                this.getUserRoleList(3, res.data.contractACompanyCode, res.data.contractBCompanyCode)
                            }
                            this.$message.success('添加成功！')
                            this.getApplyInfo()
                        }
                    })
                }
            })
            
        },
        // 工程进度请款
        handleProgressReqDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.progressReqDetailForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.progressReqDetailForm)
                    reqObj.applicationType = this.applicationType
                    reqObj.applicationAmount = Number(reqObj.applicationAmount)
                    reqObj.totalValuationAmount = Number(reqObj.totalValuationAmount)
                    reqObj.currentValuationAmount = Number(reqObj.currentValuationAmount)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile

                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''

                    delete reqObj.fileUrlList
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    addReqFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isProgressReqDetailVisible = false
                            this.$message.success('添加成功!')
                            this.getPaymentApplyInfo()
                            this.getApplyInfo()
                            this.$refs.progressReqDetailForm.resetFields()
                        } else if(res.status == -1) {
                            this.$message.warning(res.message)
                        }
                    })
                }
            })
        },
        handleProgressReqDetailCancelClick() {
            this.isProgressReqDetailVisible = false
            this.$refs.progressReqDetailForm.resetFields()
            this.requestObj = {}
        },
        handleCompanyBNameChange(value) {
            console.log(value)
            console.log(this.companyBNameList)
            let companyContractData = this.companyBNameList.filter(
                v => {
                     return value === v.companyBName
                }
            )
            let companyContractList = companyContractData[0].contractList
            this.companyContractList = companyContractList
            console.log(companyContractList)
        },
        handlePayContractCodeChange(value) {
            console.log(value)
            let itemData = this.companyContractList.filter(
                v => {
                     return value === v.contractCode
                }
            )
            this.contractNum = itemData[0].amount
            console.log(itemData)
            // contractNum
            let self = this
            let code = ''
            let reqObj = {
                contractCode: value
            }
            getPayReceive(reqObj).then(res => {
                if(res.status == 1) {
                    this.paymentObj = res.data
                }
            })
        },
        handlePayBankNumChange() {

        },
        handleProjectNameOtherChange(value) {
            // getPaymentBankNum(value).then(res => {
            //     console.log(res)
            //     if(value) {
            //         this.bankNumSelect = res
            //         this.isBankNumDisabled = false
            //     } else {
            //         this.bankNumSelect = []
            //         this.isBankNumDisabled = true
            //     }
            // })
        },
        handleProjectContractCodeChange(value) {
            let self = this
            let reqObj = {
                contractCode: value
            }
            getPayReceive(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    self.prjNameValue = res.data.prjName
                    self.contractPaidAmount = res.data.contractPaidAmount
                    self.contractSettlAmount = res.data.contractSettlAmount
                }
            })
        },
        handlePaymentOtherCodeChange(value) {
            getReceive(value).then(res => {
                if(res.status == 1) {
                    const data = res.data
                    this.payDetailOtherForm.prjName = data.prjName
                    this.payDetailOtherForm.payerAcc = data.payerAcc
                }
            })
        },
        handleSalaryContractCodeChange(value) {
            // getReqAndPayReceive(value).then(res => {
            //     if(res.status == 1 && res.data) {
            //         this.salaryObj = res.data
            //     }
            // })
             let itemData = this.companyContractList.filter(
                v => {
                     return value === v.contractCode
                }
            )
            this.contractNum = itemData[0].amount
            let reqObj = {
                contractCode: '',
                generalContractCode: '',
                subContractCode: value
            }
            getReqAndPayReceive(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.salaryObj = res.data
                }
            })
        },
        handleSubContractSalaryContractCodeChange(value) {
            let reqObj = {
                contractCode: '',
                generalContractCode: '',
                subContractCode: value
            }
            getReqAndPayReceive(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.subContractSalaryObj = res.data
                }
            })
        },
        handleSubContractSalaryContractBankCodeChange(value) {
            getPayAccountInfo(value).then(res => {
                if(res.status == 1 && res.data) {
                    this.payAccountInfo = res.data
                }
            })
        },
        handleReqAndPayTotalContractCodeChange(value) {
            getSubContract(value).then(res => {
                this.subContractSelect = res
            })
        },
        handleSubContractCodeChange(value) {
            // getReqAndPayReceive(value).then(res => {
            //     if(res.status == 1 && res.data) {
            //         this.reqAndPayObj = res.data
            //     }
            // })
            let reqObj = {
                contractCode: '',
                generalContractCode: this.reqAndPayDetailForm.belongGeneralContractCode,
                subContractCode: value
            }
            getReqAndPayReceive(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.reqAndPayObj = res.data
                }
            })

        },
        handleReqDetailCancelClick() {
            this.isReqDetailVisible = false
            this.$refs.reqDetailForm.resetFields()
            this.requestObj = {}
        },
        handlePayDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.rulePaymentForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.payDetailForm)
                    reqObj.paymentAmount = Number(reqObj.paymentAmount)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    reqObj.paymentType = Number(this.applicationType)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile

                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    delete reqObj.fileUrlList
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    // this.isPayDetailVisible = false
                    // this.isShowVerification = true
                    // getCurrentSmsInfo().then(res => {
                    //     if(res.status == 1) {
                    //         this.$message.success(res.data.data)
                    //     } else {
                    //         this.$message.warning(res.data.data)
                    //     }
                    // })
                    // this.cacheDataObj = {}
                    // this.cacheDataObj = reqObj
                    // return
                    addPayFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isPayDetailVisible = false
                            this.$message.success('添加成功!')
                            this.getApplyInfo()
                            this.$refs.rulePaymentForm.resetFields()
                        }
                    })
                }
            })
        },
        handlePayDetailCancelClick() {
            this.isPayDetailVisible = false
            this.$refs.rulePaymentForm.resetFields()
            this.paymentObj = {}
        },
        // 其他付款提交
        handlePayDetailOtherSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleOtherForm.validate(valid => {
                if(valid) {
                    if(!this.selectionSalaryRows || this.selectionSalaryRows.length == 0) {
                        this.$message.warning('请选择合同关联工资单')
                        return
                    }
                    let reqObj = Object.assign({}, this.payDetailOtherForm)
                    reqObj.paymentType = Number(this.applicationType)
                    reqObj.belongPrjCode = this.prjNameValue
                    reqObj.paymentBankNum = Number(reqObj.payerAcc)
                    reqObj.paymentAmount = Number(reqObj.paymentAmount)
                    reqObj.paymentNum = Number(reqObj.paymentNum)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentDetails = detailFile

                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.workerSalaryList = this.workerSalaryList
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    reqObj.salaryManageId = this.selectionSalaryRows.length > 0 ? this.selectionSalaryRows[0].id : ''
                    delete reqObj.payerAcc
                    delete reqObj.prjName
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    addPayFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isOtherDetailVisible = false
                            this.$message.success(res.data)
                            this.getApplyInfo()
                        } else {
                            if(res.data) {
                                this.$message.error(res.data)
                            } else {
                                this.$message.error(res.message)
                            }
                            
                        }
                    })
                }
            })
        },
        handlePayDetailOtherCancelClick() {
            this.isOtherDetailVisible = false
            this.$refs.ruleOtherForm.resetFields()
        },
        handleSalaryDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleSalaryDetailForm.validate(valid => {
                if(valid) {
                    if(!this.selectionSalaryRows || this.selectionSalaryRows.length == 0) {
                        this.$message.warning('请选择合同关联工资单')
                        return
                    }
                    let reqObj = Object.assign({}, this.salaryDetailForm)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    reqObj.salaryType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = detailFile


                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.workerSalaryList = this.workerSalaryList
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    reqObj.salaryManageId = this.selectionSalaryRows.length > 0 ? this.selectionSalaryRows[0].id : ''
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    addSalaryFund(reqObj).then(res => {
                        this.isSalaryDetailVisible = false
                        this.$message.success('添加成功！')
                        this.getApplyInfo()
                    })
                }
            })
        },
        handleSalaryDetailCancelClick() {
            this.isSalaryDetailVisible = false
            this.$refs.ruleSalaryDetailForm.resetFields()
            this.salaryObj = {}
        },
        handleSubContractSalaryDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleSubContractSalaryDetailForm.validate(valid => {
                if(valid) {
                    if(!this.selectionSalaryRows || this.selectionSalaryRows.length == 0) {
                        this.$message.warning('请选择合同关联工资单')
                        return
                    }
                    let reqObj = Object.assign({}, this.subContractSalaryDetailForm)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    reqObj.salaryType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = detailFile


                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.workerSalaryList = this.workerSalaryList
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    reqObj.salaryManageId = this.selectionSalaryRows.length > 0 ? this.selectionSalaryRows[0].id : ''
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    console.log(this.scene)
                    if(this.scene == 3 || this.scene == 6) {

                    } else {
                        reqObj.payerAcc = ''
                    }
                    addSalaryFund(reqObj).then(res => {
                        this.isSubContractSalaryDetailVisible = false
                        this.$message.success('添加成功！')
                        this.getApplyInfo()
                    })
                }
            })
        },
        handleSubContractSalaryDetailCancelClick() {
            this.isSubContractSalaryDetailVisible = false
            this.$refs.ruleSubContractSalaryDetailForm.resetFields()
            this.subContractSalaryObj = {}
        },
        // 请款+代发确认
        handleReqAndPayDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleReqAndPayForm.validate(valid => {
                if(valid) {
                    if(!this.selectionSalaryRows || this.selectionSalaryRows.length == 0) {
                        this.$message.warning('请选择合同关联工资单')
                        return
                    }
                    let reqObj = Object.assign({}, this.reqAndPayDetailForm)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
                    reqObj.salaryType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.invoiceFile = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = detailFile


                    let approveFile = ''
                    reqObj.fileUrlApproveList && reqObj.fileUrlApproveList.map(v => {
                            approveFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.approveFile = approveFile

                    let otherFile = ''
                    reqObj.fileUrlOtherList && reqObj.fileUrlOtherList.map(v => {
                            otherFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.otherFile = otherFile
                    reqObj.workerSalaryList = this.workerSalaryList
                    reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
                    reqObj.salaryManageId = this.selectionSalaryRows.length > 0 ? this.selectionSalaryRows[0].id : ''
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    delete reqObj.fileUrlApproveList
                    delete reqObj.fileUrlOtherList
                    addSalaryFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isReqAndPayDetailVisible = false
                            this.$message.success(res.data)
                            this.getApplyInfo()
                        } else if(res.status == -1) {
                            this.$message.error(res.message)
                        }
                    })
                }
            })
        },
        handleReqAndPayDetailCancelClick() {
            this.isReqAndPayDetailVisible = false
            this.$refs.ruleReqAndPayForm.resetFields()
            this.reqAndPayObj = {}
        },
        handleMonthChange(date, dateString) {
            this.reqAndPayDetailForm.month = dateString
        },
        handleSalartMonthChange(date, dateString) {
            this.salaryDetailForm.month = dateString
        },
        handleSubContractSalartMonthChange(date, dateString) {
            this.subContractSalaryDetailForm.month = dateString
        },
        getUserRoleList(id, companyA, companyB) {
            if(id == 1) {
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
                }
                })
            } else if(id == 2) {
                getUserRole(2, companyA, companyB).then(res => {
                let result = []
                if(res && Array.isArray(res.data)) {
                    res.data.map(v => {
                    let obj = {
                        name: v.userName,
                        value: String(v.id)
                    }
                    result.push(obj)
                    })
                    this.reviewSelect1 = result
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
        handleContractRoleSubmitClick(e) {
            e.preventDefault()
            let self = this
            this.$refs.contractRoleForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.contractRoleForm)
                    reqObj.contractCode = this.contractRoleCode
                    reqObj.paymentProcessId = this.paymentProcessId
                    setUpdateBProcessNode(reqObj).then(res => {
                        if(res.status == 1) {
                            self.isReqDetailVisible = false
                            self.isContractRoleVisible = false
                            self.getPaymentApplyInfo()
                        }
                    })
                } else {
                    return false
                }
            })
        },
        handleContractRoleCancelClick() {
            this.isReqDetailVisible = false
            this.isContractRoleVisible = false
        },
        handlePayChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.payDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailForm.fileUrlList = newFileList
                } else {
                    this.payDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.payDetailForm.fileUrlList = info.fileList
            }
        },
        beforePayImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handlePayChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.payDetailForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailForm.fileUrlApproveList = newFileList
                } else {
                    this.payDetailForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.payDetailForm.fileUrlApproveList = info.fileList
            }
        },
        beforePayImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handlePayChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.payDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.payDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.payDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforePayImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleOtherPayChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailOtherForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.payDetailOtherForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailOtherForm.fileUrlList = newFileList
                } else {
                    this.payDetailOtherForm.fileUrlList = info.fileList
                }
            } else {
                this.payDetailOtherForm.fileUrlList = info.fileList
            }
        },
        beforeOtherPayImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleOtherPayChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailOtherForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.payDetailOtherForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailOtherForm.fileUrlApproveList = newFileList
                } else {
                    this.payDetailOtherForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.payDetailOtherForm.fileUrlApproveList = info.fileList
            }
        },
        beforeOtherPayImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleOtherPayChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailOtherForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.payDetailOtherForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailOtherForm.fileUrlOtherList = newFileList
                } else {
                    this.payDetailOtherForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.payDetailOtherForm.fileUrlOtherList = info.fileList
            }
        },
        beforeOtherPayImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleOtherPayDetailChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.payDetailOtherForm.fileDetails.indexOf(info.file)  
                    const newFileList = this.payDetailOtherForm.fileDetails.slice()  
                    newFileList.splice(index, 1)  
                    this.payDetailOtherForm.fileDetails = newFileList
                } else {
                    this.payDetailOtherForm.fileDetails = info.fileList
                }
            } else {
                this.payDetailOtherForm.fileDetails = info.fileList
            }
        },
        beforeOtherPayDetailImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }

            return new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = r => {
                let data = r.target.result
                let workbook = XLSX.read(data, { type: 'binary' })
                let worksheet = workbook.Sheets[workbook.SheetNames[0]]
                let excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: ['accNoName', 'accNo', 'idCard', 'amount', 'accBankName', 'openBankNo']
                })
                excelData.shift()
                this.workerSalaryList = excelData
                resolve()
                }
                reader.readAsBinaryString(file)
            })
        },
        handleReqChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.reqDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqDetailForm.fileUrlList = newFileList
                } else {
                    this.reqDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.reqDetailForm.fileUrlList = info.fileList
            }
        },
        beforeReqImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleReqChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqDetailForm.fileApproveUrlList.indexOf(info.file)  
                    const newFileList = this.reqDetailForm.fileApproveUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqDetailForm.fileApproveUrlList = newFileList
                } else {
                    this.reqDetailForm.fileApproveUrlList = info.fileList
                }
            } else {
                this.reqDetailForm.fileApproveUrlList = info.fileList
            }
        },
        beforeReqImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleReqChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.reqDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.reqDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.reqDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforeReqImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleProgressReqChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.progressReqDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.progressReqDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.progressReqDetailForm.fileUrlList = newFileList
                } else {
                    this.progressReqDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.progressReqDetailForm.fileUrlList = info.fileList
            }
        },
        beforeProgressReqImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleProgressReqChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.progressReqDetailForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.progressReqDetailForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.progressReqDetailForm.fileUrlApproveList = newFileList
                } else {
                    this.progressReqDetailForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.progressReqDetailForm.fileUrlApproveList = info.fileList
            }
        },
        beforeProgressReqImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleProgressReqChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.progressReqDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.progressReqDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.progressReqDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.progressReqDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.progressReqDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforeProgressReqImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSalaryChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.salaryDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.salaryDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.salaryDetailForm.fileUrlList = newFileList
                } else {
                    this.salaryDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.salaryDetailForm.fileUrlList = info.fileList
            }
        },
        beforeSalaryImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSalaryChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.salaryDetailForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.salaryDetailForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.salaryDetailForm.fileUrlApproveList = newFileList
                } else {
                    this.salaryDetailForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.salaryDetailForm.fileUrlApproveList = info.fileList
            }
        },
        beforeSalaryImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSalaryChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.salaryDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.salaryDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.salaryDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.salaryDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.salaryDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforeSalaryImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSalaryDetailChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.salaryDetailForm.fileDetails.indexOf(info.file)  
                    const newFileList = this.salaryDetailForm.fileDetails.slice()  
                    newFileList.splice(index, 1)  
                    this.salaryDetailForm.fileDetails = newFileList
                } else {
                    this.salaryDetailForm.fileDetails = info.fileList
                }
            } else {
                this.salaryDetailForm.fileDetails = info.fileList
            }
        },
        beforeSalaryDetailImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }

            return new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = r => {
                let data = r.target.result
                console.log(XLSX)
                let workbook = XLSX.read(data, { type: 'binary' })
                let worksheet = workbook.Sheets[workbook.SheetNames[0]]
                let excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: ['accNoName', 'accNo', 'idCard', 'amount', 'accBankName', 'openBankNo']
                })
                excelData.shift()
                console.log(excelData)
                this.workerSalaryList = excelData
                resolve()
                }
                reader.readAsBinaryString(file)
            })
    //         let reader = new FileReader()
    //   reader.onload = (event) => {
    //     console.log(event);
    //     let data = event.target.result;
    //     const workbook = XLSX.read(data, {
    //       type: 'binary'
    //     });
    //     let resultArray = []
    //     workbook.SheetNames.forEach(function (sheetName) {
    //       console.log('workbook.Sheets[sheetName]', workbook.Sheets[sheetName]);
    //       const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    //       console.log('data', data);
    //       let mainData = data.slice(1)
    //       if (mainData.length > 0) {
    //         for (let row = 0; row < mainData.length; row++) {
    //           let rowData = {}
    //           for (let col = 0; col < data[0].length; col++) {
    //             rowData[data[0][col]] = mainData[row][col] || ''
    //           }
    //           resultArray.push(rowData)
    //         }
    //       } else {
    //         alert('至少需要一行有效数据')
    //       }
    //     })
    //     console.log('resultArray', resultArray);

    //   }
    //   reader.readAsBinaryString(file);
        },
        handleSubContractSalaryChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.subContractSalaryDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.subContractSalaryDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.subContractSalaryDetailForm.fileUrlList = newFileList
                } else {
                    this.subContractSalaryDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.subContractSalaryDetailForm.fileUrlList = info.fileList
            }
        },
        beforeSubContractSalaryImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSubContractSalaryChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.subContractSalaryDetailForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.subContractSalaryDetailForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.subContractSalaryDetailForm.fileUrlApproveList = newFileList
                } else {
                    this.subContractSalaryDetailForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.subContractSalaryDetailForm.fileUrlApproveList = info.fileList
            }
        },
        beforeSubContractSalaryImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSubContractSalaryChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.subContractSalaryDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.subContractSalaryDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.subContractSalaryDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.subContractSalaryDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.subContractSalaryDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforeSubContractSalaryImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleSubContractSalaryDetailChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.subContractSalaryDetailForm.fileDetails.indexOf(info.file)  
                    const newFileList = this.subContractSalaryDetailForm.fileDetails.slice()  
                    newFileList.splice(index, 1)  
                    this.subContractSalaryDetailForm.fileDetails = newFileList
                } else {
                    this.subContractSalaryDetailForm.fileDetails = info.fileList
                }
            } else {
                this.subContractSalaryDetailForm.fileDetails = info.fileList
            }
        },
        beforeSubContractSalaryDetailImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }

            return new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = r => {
                let data = r.target.result
                console.log(XLSX)
                let workbook = XLSX.read(data, { type: 'binary' })
                let worksheet = workbook.Sheets[workbook.SheetNames[0]]
                let excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: ['accNoName', 'accNo', 'idCard', 'amount', 'accBankName', 'openBankNo']
                })
                excelData.shift()
                console.log(excelData)
                this.workerSalaryList = excelData
                resolve()
                }
                reader.readAsBinaryString(file)
            })
        },



        handleReqAndPayChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqAndPayDetailForm.fileUrlList.indexOf(info.file)  
                    const newFileList = this.reqAndPayDetailForm.fileUrlList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqAndPayDetailForm.fileUrlList = newFileList
                } else {
                    this.reqAndPayDetailForm.fileUrlList = info.fileList
                }
            } else {
                this.reqAndPayDetailForm.fileUrlList = info.fileList
            }
        },
        beforeReqAndPayImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleReqAndPayChangeApproveFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqAndPayDetailForm.fileUrlApproveList.indexOf(info.file)  
                    const newFileList = this.reqAndPayDetailForm.fileUrlApproveList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqAndPayDetailForm.fileUrlApproveList = newFileList
                } else {
                    this.reqAndPayDetailForm.fileUrlApproveList = info.fileList
                }
            } else {
                this.reqAndPayDetailForm.fileUrlApproveList = info.fileList
            }
        },
        beforeReqAndPayImgApproveUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleReqAndPayChangeOtherFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqAndPayDetailForm.fileUrlOtherList.indexOf(info.file)  
                    const newFileList = this.reqAndPayDetailForm.fileUrlOtherList.slice()  
                    newFileList.splice(index, 1)  
                    this.reqAndPayDetailForm.fileUrlOtherList = newFileList
                } else {
                    this.reqAndPayDetailForm.fileUrlOtherList = info.fileList
                }
            } else {
                this.reqAndPayDetailForm.fileUrlOtherList = info.fileList
            }
        },
        beforeReqAndPayImgOtherUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }
        },
        handleReqAndPayDetailChangeFile(info) {
            const status = info.file.status;
            if (status !== "uploading") {
                if (status == "removed") {
                    const index = this.reqAndPayDetailForm.fileDetails.indexOf(info.file)  
                    const newFileList = this.reqAndPayDetailForm.fileDetails.slice()  
                    newFileList.splice(index, 1)  
                    this.reqAndPayDetailForm.fileDetails = newFileList
                } else {
                    this.reqAndPayDetailForm.fileDetails = info.fileList
                }
            } else {
                this.reqAndPayDetailForm.fileDetails = info.fileList
            }
        },
        beforeReqAndPayDetailImgUpload(file) {
            const isLt400M = file.size / 1024 / 1024 <= 400
            if (!isLt400M) {
                this.$message.error('上传文件大小不能超过 400MB!')
                return false
            }

            return new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = r => {
                let data = r.target.result
                console.log(XLSX)
                let workbook = XLSX.read(data, { type: 'binary' })
                let worksheet = workbook.Sheets[workbook.SheetNames[0]]
                let excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: ['accNoName', 'accNo', 'idCard', 'amount', 'accBankName', 'openBankNo']
                })
                excelData.shift()
                console.log(excelData)
                this.workerSalaryList = excelData
                resolve()
                }
                reader.readAsBinaryString(file)
            })
        },
        handleBatchDownload() {
            downloadDetail(1).then(res => {
                const data = res.data
                const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
                const link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'excel.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

            })
        },
        handleLeftBatchDownload() {
            downloadDetail(2).then(res => {
                console.log(res)
            })
            // downloadDetail(2).then(res => {
            //     const data = res.data
            //     const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
            //     const link = document.createElement('a')
            //     link.style.display = 'none'
            //     link.href = url
            //     link.setAttribute('download', 'excel.xlsx')
            //     document.body.appendChild(link)
            //     link.click()
            //     document.body.removeChild(link)

            // })
        },
        handleRightBatchDownload() {
            downloadDetail(3).then(res => {
                const data = res.data
                const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
                const link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'excel.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

            })
        },
        // 查看详情
        handleReviewClick(row) {
            if(this.type == 1) {
                // 请款
                this.isReqDetailViewVisible = true
                this.isPayDetailViewVisible = false
                this.isSalaryDetailViewVisible = false
                this.isOtherDetailViewVisible = false
                this.isProgressReqDetailViewVisible = false
                getReqDetail(row.id).then(res => {
                    this.reqDetailView = res.data
                    let newStr = this.reqDetailView.invoiceFile.substring(0, this.reqDetailView.invoiceFile.length - 1).split(',')
                        let uploadArr = []
                        newStr && newStr.map(res => {
                            // res = res.split('#')[0]
                            let num = res.lastIndexOf('\#')
                            let resObj = {
                                name: res.substring(0, num),
                                url: res.substring(num + 1, res.length)
                            }
                            uploadArr.push(resObj)
                        })
                        this.reqDetailView.invoiceFile = uploadArr
                    
                    let approveStr = this.reqDetailView.approveFile.substring(0, this.reqDetailView.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
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
                            approveArr.push(resObj)
                        })
                        this.reqDetailView.approveFile = approveArr

                    let otherStr = this.reqDetailView.otherFile.substring(0, this.reqDetailView.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
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
                            otherArr.push(resObj)
                        })
                        this.reqDetailView.otherFile = otherArr
                })
            } else if(this.type == 2) {
                // 工程进度请款
                this.isProgressReqDetailViewVisible = true
                this.isReqDetailViewVisible = false
                this.isPayDetailViewVisible = false
                this.isSalaryDetailViewVisible = false
                this.isOtherDetailViewVisible = false
                getReqDetail(row.id).then(res => {
                    this.progressReqDetailView = res.data
                    let newStr = this.progressReqDetailView.invoiceFile.substring(0, this.progressReqDetailView.invoiceFile.length - 1).split(',')
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
                        this.progressReqDetailView.invoiceFile = uploadArr

                    let approveStr = this.progressReqDetailView.approveFile.substring(0, this.progressReqDetailView.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
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
                            approveArr.push(resObj)
                        })
                        this.progressReqDetailView.approveFile = approveArr


                    let otherStr = this.progressReqDetailView.otherFile.substring(0, this.progressReqDetailView.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
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
                            otherArr.push(resObj)
                        })
                        this.progressReqDetailView.otherFile = otherArr
                })
            } else if(this.type >= 3 && this.type <= 6 ) {
                this.isReqDetailViewVisible = true
                this.isPayDetailViewVisible = false
                this.isSalaryDetailViewVisible = false
                this.isOtherDetailViewVisible = false
                this.isProgressReqDetailViewVisible = false
                // getReqTaskName(this.type).then(res => {
                //     this.reqDetailForm.taskName = res.data
                // })
                getReqDetail(row.id).then(res => {
                    console.log(res.data)
                    this.reqDetailView = res.data

                    let newStr = this.reqDetailView.invoiceFile.substring(0, this.reqDetailView.invoiceFile.length - 1).split(',')
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
                        this.reqDetailView.invoiceFile = uploadArr

                    let approveStr = this.reqDetailView.approveFile.substring(0, this.reqDetailView.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
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
                            approveArr.push(resObj)
                        })
                        this.reqDetailView.approveFile = approveArr


                    let otherStr = this.reqDetailView.otherFile.substring(0, this.reqDetailView.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
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
                            otherArr.push(resObj)
                        })
                        this.reqDetailView.otherFile = otherArr                    
                })
            } else if(this.type >= 7 && this.type < 13) {
                // 付款
                this.isPayDetailViewVisible = true
                getApplyDetail(row.id).then(res => {
                    if(res.status == 1) {
                        console.log(res.data)
                        this.payDetailView = res.data
                        let newStr = this.payDetailView.invoiceFile.substring(0, this.payDetailView.invoiceFile.length - 1).split(',')
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
                        this.payDetailView.invoiceFile = uploadArr
                        
                        let approveStr = this.payDetailView.approveFile.substring(0, this.payDetailView.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
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
                            approveArr.push(resObj)
                        })
                        this.payDetailView.approveFile = approveArr

                        let otherStr = this.payDetailView.otherFile.substring(0, this.payDetailView.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
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
                            otherArr.push(resObj)
                        })
                        this.payDetailView.otherFile = otherArr
                    }
                })
            } else if(this.type == 13) {
                this.isOtherDetailViewVisible = true
                getApplyDetail(row.id).then(res => {
                    this.payDetailOtherView = res.data
                    let newStr = this.payDetailOtherView.invoiceFile && this.payDetailOtherView.invoiceFile.substring(0, this.payDetailOtherView.invoiceFile.length - 1).split(',')
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
                        this.payDetailOtherView.invoiceFile = uploadArr
                    let newFile = this.payDetailOtherView.paymentDetails && this.payDetailOtherView.paymentDetails.substring(0, this.payDetailOtherView.paymentDetails.length - 1).split(',')
                        let uploadFile = []
                        newFile && newFile.map(res => {
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
                            uploadFile.push(resObj)
                        })
                        this.payDetailOtherView.paymentDetails = uploadFile
                        console.log(this.payDetailOtherView.paymentDetails)


                    let approveStr = this.payDetailOtherView.approveFile && this.payDetailOtherView.approveFile.substring(0, this.payDetailOtherView.approveFile.length - 1).split(',')
                        let approveArr = []
                        approveStr && approveStr.map(res => {
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
                            approveArr.push(resObj)
                        })
                        this.payDetailOtherView.approveFile = approveArr

                    let otherStr = this.payDetailOtherView.otherFile && this.payDetailOtherView.otherFile.substring(0, this.payDetailOtherView.otherFile.length - 1).split(',')
                        let otherArr = []
                        otherStr && otherStr.map(res => {
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
                            otherArr.push(resObj)
                        })
                        this.payDetailOtherView.otherFile = otherArr
                })
            } else if(this.type == 14) {
                // 请款+代发
                this.isReqAndPayDetailViewVisible = true
                this.isSalaryDetailViewVisible = false
                this.isReqDetailViewVisible = false
                this.isPayDetailViewVisible = false
                this.isOtherDetailViewVisible = false
                this.isProgressReqDetailViewVisible = false
                getSalaryDetail(row.id).then(res => {
                    this.reqAndPayDetailView = res.data
                    let newFile = this.reqAndPayDetailView.invoiceFile && this.reqAndPayDetailView.invoiceFile.substring(0, this.reqAndPayDetailView.invoiceFile.length - 1).split(',')
                        let uploadFile = []
                        newFile && newFile.map(res => {
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
                            uploadFile.push(resObj)
                        })
                    this.reqAndPayDetailView.invoiceFile = uploadFile
                    let file = this.reqAndPayDetailView.salaryDetails && this.reqAndPayDetailView.salaryDetails.substring(0, this.reqAndPayDetailView.salaryDetails.length - 1).split(',')
                        let fileUrl = []
                        file && file.map(res => {
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
                            fileUrl.push(resObj)
                        })
                    this.reqAndPayDetailView.salaryDetails = fileUrl


                    let approveStr = this.reqAndPayDetailView.approveFile && this.reqAndPayDetailView.approveFile.substring(0, this.reqAndPayDetailView.approveFile.length - 1).split(',')
                        let approveFile = []
                        approveStr && approveStr.map(res => {
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
                            approveFile.push(resObj)
                        })
                    this.reqAndPayDetailView.approveFile = approveFile

                    let otherStr = this.reqAndPayDetailView.otherFile && this.reqAndPayDetailView.otherFile.substring(0, this.reqAndPayDetailView.otherFile.length - 1).split(',')
                        let otherFile = []
                        otherStr && otherStr.map(res => {
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
                            otherFile.push(resObj)
                        })
                    this.reqAndPayDetailView.otherFile = otherFile
                })
            } else if(this.type > 14) {
                // 工资
                if(this.scene == 3 || this.scene == 6) {
                    this.isSubContractSalaryDetailViewVisible = true
                    this.isSalaryDetailViewVisible = false
                } else {
                    this.isSalaryDetailViewVisible = true
                    this.isSubContractSalaryDetailViewVisible = false
                }
                // this.isSalaryDetailViewVisible = true
                this.isReqDetailViewVisible = false
                this.isPayDetailViewVisible = false
                this.isOtherDetailViewVisible = false
                this.isProgressReqDetailViewVisible = false
                getSalaryDetail(row.id).then(res => {
                    this.salaryDetailView = res.data
                    let newFile = this.salaryDetailView.invoiceFile && this.salaryDetailView.invoiceFile.substring(0, this.salaryDetailView.invoiceFile.length - 1).split(',')
                        let uploadFile = []
                        newFile && newFile.map(res => {
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
                            uploadFile.push(resObj)
                        })
                    this.salaryDetailView.invoiceFile = uploadFile
                    let file = this.salaryDetailView.salaryDetails && this.salaryDetailView.salaryDetails.substring(0, this.salaryDetailView.salaryDetails.length - 1).split(',')
                        let fileUrl = []
                        file && file.map(res => {
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
                            fileUrl.push(resObj)
                        })
                    this.salaryDetailView.salaryDetails = fileUrl

                    let approveStr = this.salaryDetailView.approveFile && this.salaryDetailView.approveFile.substring(0, this.salaryDetailView.approveFile.length - 1).split(',')
                        let approveFile = []
                        approveStr && approveStr.map(res => {
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
                            approveFile.push(resObj)
                        })
                    this.salaryDetailView.approveFile = approveFile

                    let otherStr = this.salaryDetailView.otherFile && this.salaryDetailView.otherFile.substring(0, this.salaryDetailView.otherFile.length - 1).split(',')
                        let otherFile = []
                        otherStr && otherStr.map(res => {
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
                            otherFile.push(resObj)
                        })
                    this.salaryDetailView.otherFile = otherFile
                })
            }
        },
        handleReqDetailViewSubmitClick() {
            this.isReqDetailViewVisible = false
        },
        handleProgressReqDetailViewSubmitClick() {
            this.isProgressReqDetailViewVisible = false
        },
        handlePayDetailViewSubmitClick() {
            this.isPayDetailViewVisible = false
        },
        handlePayDetailOtherViewSubmitClick() {
            this.isOtherDetailViewVisible = false
        },
        handleSalaryDetailViewSubmitClick() {
            this.isSalaryDetailViewVisible = false
        },
        handleSubContractSalaryDetailViewSubmitClick() {
            this.isSubContractSalaryDetailViewVisible = false
        },
        handleReqAndPayDetailViewSubmitClick() {
            this.isReqAndPayDetailViewVisible = false
        },
        // 请款详情下载
        handleReqDetailViewDownloadClick() {

        },
        // 付款详情下载
        handlePayDetailViewDownloadClick() {

        },
        // 其他付款详情下载
        handlePayDetailOtherViewDownloadClick() {

        },
        handleSearchClick() {
            console.log(22222222)
            this.getApplyInfo()
        },
        handlePayerSearch(value) {
            console.log(value)
            let reqObj = {
                accountName: value,
                accountType: this.reqAndPayObj.paymentScene,
                companyName: '',
                unifiedCreditCode: ''
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    console.log(res.data)
                    this.payerSelectList = res.data
                    let result = []
                    res.data && res.data.map(v => {
                        let accountObj = {
                            label: v.accountName,
                            value: v.accountNum
                        }
                        result.push(accountObj)
                    })
                    this.payerData = result
                }
            })
        },
        handlePayerChange(value) {
            console.log(value)
            this.payerSelectList.map(v => {
                if(v.accountNum == value) {
                    this.reqAndPayObj.payerAcc = v.accountNum
                    this.reqAndPayObj.payerOpenBank = v.openBank
                }
            })
        },
        handleSalaryPayerSearch(value) {
            let reqObj = {
                accountName: value,
                accountType: this.salaryObj.paymentScene,
                companyName: '',
                unifiedCreditCode: ''
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    console.log(res.data)
                    this.salarySelectList = res.data
                    let result = []
                    res.data && res.data.map(v => {
                        let accountObj = {
                            label: v.accountName,
                            value: v.accountNum
                        }
                        result.push(accountObj)
                    })
                    this.salaryData = result
                }
            })
        },
        handleSalaryPayerChange(value) {
            this.salarySelectList.map(v => {
                if(v.accountNum == value) {
                    this.salaryObj.payerAcc = v.accountNum
                    this.salaryObj.payerOpenBank = v.openBank
                }
            })
        },
        handleRequestSearch(value) {
            let reqObj = {
                accountName: value,
                accountType: this.requestObj.paymentScene,
                companyName: '',
                unifiedCreditCode: ''
            }
            getSelectAccount(reqObj).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    console.log(res.data)
                    this.requestSelectList = res.data
                    let result = []
                    res.data && res.data.map(v => {
                        let accountObj = {
                            label: v.accountName,
                            value: v.accountNum
                        }
                        result.push(accountObj)
                    })
                    this.requestData = result
                }
            })
        },
        handleRequestChange(value) {
            this.requestSelectList.map(v => {
                if(v.accountNum == value) {
                    this.requestObj.payerAcc = v.accountNum
                    this.requestObj.payerOpenBank = v.openBank
                }
            })
        },
        handleVerificationClick(e) {
            e.preventDefault()
            this.$refs.verificationForm.validate(valid => {
                if(valid) {
                    console.log(111111111111)
                    addPayFund(this.cacheDataObj).then(res => {
                        if(res.status == 1) {
                            this.isPayDetailVisible = false
                            this.$message.success('添加成功!')
                            this.getApplyInfo()
                            this.$refs.rulePaymentForm.resetFields()
                        }
                    })
                }
            })
        },
        handleSettleClick() {
            this.isSettleVisible = true
        },
        handleSettleSearchClick() {
            this.getSettleInfo()
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
        handleSalarySelectClick() {
            this.isSalaryVisible = true
            
        },
        handleSalarySearchClick() {
            this.getSalaryManageInfo()
        },
        handleSalaryManageClickRow(record) {
            return {
                on: {
                click: () => {
                    let keys = []
                    keys.push(record.id)
                    this.selectionSalaryRows.push(record)
                    this.selectedSalaryRowKeys = keys
                }
                }
            }
            },  
        handleSalarySelectionChange(selectedRowKeys, selectionRows) {
            this.selectedSalaryRowKeys = selectedRowKeys
            this.selectionSalaryRows = selectionRows
        },
        handleSalaryManageSubmitClick() {
            this.isSalaryVisible = false
            this.isSalarySelect = true
            this.cacheSalary = this.selectionSalaryRows.length > 0 ? this.selectionSalaryRows[0].salaryName : ''
        }
    }
}
</script>
<style lang="less">
.apply-wrapper{
    .card-wrapper{
        box-shadow: 0 0 10px 2px #ccc;
        margin: 20px;
    }
}
.addModal{
    .modal-title{
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
    .modal-title::before{
        content: '';
        position: absolute;
        left: 0;
        width: 6px;
        height: 20px;
        background: #508EDF;
    }
    .upload-wrapper{
        width: 100%;
        display: flex;
        flex-direction: row;
        .upload-wrapper{
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
  .ant-modal-content{
    width: 1200px!important;
    margin-left: -280px!important;
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
        width: 180px!important;
      }
  }
  .modal-row{
    span{
      display: inline-block;
      line-height: 60px;

    }
  }
  .upload{
      position: relative;
    .download-wrapper{
        color: #1890FF;
        position: absolute;
        right: -100px;
        top: -11px;
    }
    .download-wrapper:hover{
        cursor: pointer;
    }
    .download-wrapper-left, .download-wrapper-right{
        color: #1890FF;
        position: absolute;
    }
    .download-wrapper-left {
        top: -11px;
        right: 0px;
    }
    .download-wrapper-left:hover{
        cursor: pointer;
    }
    .download-wrapper-right {
        top: -11px;
        right: -375px;
    }
  }
  .footer-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
.verificationModal{
    .modal-title{
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
    .modal-title::before{
        content: '';
        position: absolute;
        left: 0;
        width: 6px;
        height: 20px;
        background: #508EDF;
    }
    .ant-form-item-label{
        width: 120px!important;
      }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
</style>