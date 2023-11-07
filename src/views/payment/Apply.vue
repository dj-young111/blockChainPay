<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="apply-wrapper">
                <a-row :gutter="16">
                    <a-col :span="8" v-for="(item, index) of applyList" :key="index" @click="handleClick(item)">
                        <a-card class="card-wrapper" :title="item.name" hoverable>
                            <p><span class="title">支付要素：</span>{{ setDeatilText(item.name, item.companyRole) }}</p>
                            <p><span class="title">累计完成：</span>{{ item.totalNum }} 笔</p>
                            <p><span class="title">累计金额：</span>{{ item.totalAmount }} 元</p>
                            <p><span class="title">场景描述：</span>{{ setDescription(item.name, item.companyRole) }}</p>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
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
                        <a-select-option v-for="item of contractNameSelect" :key="item.value" :value="item.value">
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
                            v-model="requestObj.payerOpenBankNo"
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
                    <a-form-model-item label="申请金额（元）" prop="applicationAmount">
                    <a-input 
                        type="text"  
                        v-model="reqDetailForm.applicationAmount"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="交易附言">
                        <a-input v-model="reqDetailForm.transactionRemark" placeholder="请输入"/>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item class="upload-wrapper" label="上传材料" prop="fileUrlList">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleReqChangeFile"
                            :before-upload="beforeReqImgUpload"
                            :default-file-list="reqDetailForm.fileUrlList"
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
                        <a-select-option v-for="item of contractNameSelect" :key="item.value" :value="item.value">
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
                    <a-col :span="12">
                        <a-form-model-item label="累计验工计价金额（元）" prop="totalValuationAmount">
                        <a-input 
                            type="text" 
                            v-model="progressReqDetailForm.totalValuationAmount"
                        />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="本次验工计价金额（元）" prop="currentValuationAmount">
                        <a-input 
                            type="text" 
                            v-model="progressReqDetailForm.currentValuationAmount"
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
                            v-model="requestObj.payerOpenBankNo"
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
                    <a-form-model-item label="申请金额（元）" prop="applicationAmount">
                    <a-input 
                        type="text"  
                        v-model="progressReqDetailForm.applicationAmount"
                        />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="交易附言">
                        <a-input v-model="progressReqDetailForm.transactionRemark" placeholder="请输入"/>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item class="upload-wrapper" label="上传材料" prop="fileUrlList">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleProgressReqChangeFile"
                            :before-upload="beforeProgressReqImgUpload"
                            :default-file-list="progressReqDetailForm.fileUrlList"
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
                        <a-form-model-item label="所属合同名称" prop="belongContractCode">
                        <a-select v-model="payDetailForm.belongContractCode" placeholder="请选择" @change="handlePayContractCodeChange">
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
                            v-model="paymentObj.payerOpenBankNo"
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
                        <a-form-model-item label="付款金额（元）" prop="paymentAmount">
                        <a-input 
                            type="text"  
                            v-model="payDetailForm.paymentAmount"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="payDetailForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料" prop="fileUrlList">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handlePayChangeFile"
                            :before-upload="beforePayImgUpload"
                            :default-file-list="payDetailForm.fileUrlList"
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
                        <a-form-model-item label="所属项目名称" prop="prjName">
                            <a-select v-model="payDetailOtherForm.prjName" placeholder="请选择" @change="handleProjectNameOtherChange">
                                <a-select-option v-for="item of projectNameSelect" :key="item.value" :value="item.value">
                                {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="所属合同名称" prop="belongContractCode">
                            <a-select v-model="payDetailOtherForm.belongContractCode" placeholder="请选择">
                                <a-select-option v-for="item of contractNameSelect" :key="item.value" :value="item.value">
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
                        <a-form-model-item label="付款总金额（元）" prop="paymentAmount">
                        <a-input 
                            type="text"  
                            v-model="payDetailOtherForm.paymentAmount"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="付款总笔数" prop="paymentNum">
                            <a-input v-model="payDetailOtherForm.paymentNum" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="交易附言">
                            <a-input v-model="payDetailOtherForm.transactionRemark" placeholder="请输入"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="9">
                        <a-form-model-item class="upload-wrapper" label="上传其他付款材料" prop="fileUrlList">
                        <a-upload
                            :action="`${$fileUrl}/files`"
                            @change="handleOtherPayChangeFile"
                            :before-upload="beforeOtherPayImgUpload"
                            :default-file-list="payDetailOtherForm.fileUrlList"
                        >
                            <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                        </a-upload>
                        </a-form-model-item>
                    </a-col>
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
                        <span class="download-wrapper-left" @click="handleLeftBatchDownload">批量代付（对私）模板下载</span>
                        <span class="download-wrapper-right" @click="handleRightBatchDownload">批量代付（对公）模板下载</span>
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
                        <a-form-model-item label="所属劳务分包合同名称" prop="belongSubContractCode">
                            <a-select v-model="salaryDetailForm.belongSubContractCode" placeholder="请选择" @change="handleSalaryContractCodeChange">
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
                        <a-form-model-item label="中标主体工资专户名称">
                        <a-input 
                            type="text" 
                            v-model="salaryObj.payerName"
                            disabled
                        />
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
                        <a-form-model-item label="交易附言">
                        <a-input 
                            type="text" 
                            v-model="salaryDetailForm.transactionRemark"
                            
                        />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="工资月份">
                            <a-month-picker placeholder="请选择工资月份" @change="handleSalartMonthChange" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="modal-title">
                    <span>支付要件</span>
                </div>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item class="upload-wrapper" label="上传材料" prop="fileUrlList">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryChangeFile"
                                :before-upload="beforeSalaryImgUpload"
                                :default-file-list="salaryDetailForm.fileUrlList"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12" class="upload">
                        <a-form-model-item class="upload-wrapper" label="上传工资明细" prop="fileDetails">
                            <a-upload
                                :action="`${$fileUrl}/files`"
                                @change="handleSalaryDetailChangeFile"
                                :before-upload="beforeSalaryDetailImgUpload"
                                :default-file-list="salaryDetailForm.fileDetails"
                            >
                                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                            </a-upload>
                            <span class="download-wrapper" @click="handleBatchDownload">批量代付明细账单模板下载</span>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-modal>

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
                        <a-input 
                            type="text" 
                            v-model="reqAndPayObj.payerName"
                            disabled
                        />
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
                        <a-form-model-item class="upload-wrapper" label="上传材料" prop="fileUrlList">
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
    downloadDetail
} from '@/api/payment'
import { getUserRole } from '@/api/contract'
export default {
    data () {
        return {
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
                transactionRemark: '',
                fileUrlList: []
            },
            progressReqDetailForm: {
                taskName: '',
                belongContractCode: undefined,
                totalValuationAmount: null,
                currentValuationAmount: null,
                applicationAmount: '',
                transactionRemark: '',
                fileUrlList: []
            },
            payDetailForm: {
                taskName: '',
                belongContractCode: undefined,
                paymentBankNum: undefined,
                paymentAmount: '',
                transactionRemark: '',
                fileUrlList: []
            },
            payDetailOtherForm: {
                taskName: '',
                prjName: undefined,
                belongContractCode: undefined,
                payerAcc: undefined,
                paymentAmount: '',
                paymentNum: '',
                transactionRemark: '',
                fileUrlList: [],
                fileDetails: []
            },
            salaryDetailForm: {
                taskName: '',
                belongSubContractCode: undefined,
                totalSalary: '',
                totalNum: '',
                transactionRemark: '',
                month: '',
                fileUrlList: [],
                fileDetails: []
            },
            reqAndPayDetailForm: {
                taskName: '',
                belongGeneralContractCode: undefined,
                belongSubContractCode: undefined,
                totalSalary: '',
                totalNum: '',
                transactionRemark: '',
                month: '',
                fileUrlList: [],
                fileDetails: []
            },
            reqDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                applicationAmount: [{ required: true, message: '请输入申请金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传材料', trigger: 'change' }], 
            },
            progressReqDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                totalValuationAmount: [{ required: true, message: '请输入累计验工计价金额', trigger: 'change' }], 
                currentValuationAmount: [{ required: true, message: '请输入本次验工计价金额', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                applicationAmount: [{ required: true, message: '请输入申请金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传材料', trigger: 'change' }], 
            },
            payDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                paymentBankNum: [{ required: true, message: '请选择付款银行账号', trigger: 'change' }], 
                paymentAmount: [{ required: true, message: '请输入付款总金额', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传材料', trigger: 'change' }]
            },
            payDetailOtherRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                prjName: [{ required: true, message: '请选择所属项目名称', trigger: 'change' }], 
                belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }], 
                payerAcc: [{ required: true, message: '请选择付款方银行账号', trigger: 'change' }],
                paymentAmount: [{ required: true, message: '请输入付款总金额', trigger: 'change' }], 
                paymentNum: [{ required: true, message: '请输入付款笔数', trigger: 'change' }],
                fileUrlList: [{ required: true, message: '请上传其他付款材料', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上传付款明细', trigger: 'change' }],
            },
            salaryDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongSubContractCode: [{ required: true, message: '请选择所属劳务分包合同名称', trigger: 'change' }], 
                totalSalary: [{ required: true, message: '请输入工资总金额', trigger: 'change' }], 
                totalNum: [{ required: true, message: '请输入工资总笔数', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传材料', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上工资明细', trigger: 'change' }],
            },
            reqAndPayDetailRules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }], 
                belongGeneralContractCode: [{ required: true, message: '请选择所属总包合同名称', trigger: 'change' }], 
                belongSubContractCode: [{ required: true, message: '请选择所属劳务分包合同名称', trigger: 'change' }], 
                totalSalary: [{ required: true, message: '请输入工资总金额', trigger: 'change' }], 
                totalNum: [{ required: true, message: '请输入工资总笔数', trigger: 'change' }], 
                fileUrlList: [{ required: true, message: '请上传材料', trigger: 'change' }],
                fileDetails: [{ required: true, message: '请上传工资明细', trigger: 'change' }], 
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
            paymentProcessId: ''
        }
    },
    mounted() {
        this.getPaymentApplyInfo()
        this.getContractNameList()
        this.getProjectList()
        this.getTotalContractList()
        this.getSubContractListInfo()
        this.getPaymentContractNameList()
        this.getPaymentBankNumList()
    },
    methods: {
        getPaymentApplyInfo() {
            getPaymentApplyList().then(res => {
                const filterArr =  res.filter(v => {
                    return v.name !== '建设者工资请款+发放'
                })
                this.applyList = filterArr
                // console.log(res)
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
        handleClick(item) {
            // if(!item.editFlag) {
            //     this.$message.warning('当前用户无做操作权限！')
            //     return
            // }
            if(item.companyRole == 1) {
                this.$message.warning('当前用户无操作权限, 请联系管理员！')
                return
            }
            if(item.companyRole == 2 && item.name == '工程预付款请款') {
                this.$message.warning('当前用户无操作权限, 请联系管理员！')
                return
            }
            if(item.companyRole == 2 && item.name == '工程进度款请款') {
                this.$message.warning('当前用户无操作权限, 请联系管理员！')
                return
            }
            // if(item.companyRole == 2 && item.name == '建设者工资请款+发放') {
            //     this.$message.warning('当前用户无操作权限, 请联系管理员！')
            //     return
            // }
            // if(item.companyRole == 3 && item.name == '建设者工资请款+发放') {
            //     this.$message.warning('当前用户无操作权限, 请联系管理员！')
            //     return
            // }
            // if(item.companyRole == 6 && item.name == '建设者工资请款+发放') {
            //     this.$message.warning('当前用户无操作权限, 请联系管理员！')
            //     return
            // }

            if(item.companyRole == 2 && item.name == '二类费用请款') {
                this.$message.warning('当前用户无操作权限, 请联系管理员！')
                return
            }
            if(item.companyRole == 2 && item.name == '建设者工资请款') {
                this.$message.warning('当前用户无操作权限, 请联系管理员！')
                return
            }
            this.$router.push({
                path: '/payment/applyList',
                query: {
                    type: item.type,
                    scene: item.companyRole
                }
            })
            return
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
            getReqReceive(value).then(res => {
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
                    reqObj.applicationType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    delete reqObj.fileUrlList
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
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    delete reqObj.fileUrlList
                    addReqFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isProgressReqDetailVisible = false
                            this.$message.success(res.message)
                            this.getPaymentApplyInfo()
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
        handlePayContractCodeChange(value) {
            let self = this
            let code = ''
            getPayReceive(value).then(res => {
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
            getReqAndPayReceive(value).then(res => {
                if(res.status == 1 && res.data) {
                    this.salaryObj = res.data
                }
            })
        },
        handleReqAndPayTotalContractCodeChange(value) {
            getSubContract(value).then(res => {
                this.subContractSelect = res
            })
        },
        handleSubContractCodeChange(value) {
            getReqAndPayReceive(value).then(res => {
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
                    reqObj.paymentType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    delete reqObj.fileUrlList
                    addPayFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isPayDetailVisible = false
                            this.$message.success(res.message)
                            this.getPaymentApplyInfo()
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
                    let reqObj = Object.assign({}, this.payDetailOtherForm)
                    reqObj.paymentType = this.applicationType
                    reqObj.belongPrjCode = reqObj.prjName
                    reqObj.paymentBankNum = Number(reqObj.payerAcc)
                    reqObj.paymentAmount = Number(reqObj.paymentAmount)
                    reqObj.paymentNum = Number(reqObj.paymentNum)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    delete reqObj.payerAcc
                    delete reqObj.prjName
                    delete reqObj.fileUrlList
                    addPayFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isOtherDetailVisible = false
                            this.$message.success(res.message)
                            this.getPaymentApplyInfo()
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
                    let reqObj = Object.assign({}, this.salaryDetailForm)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.salaryType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.paymentFile = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = detailFile
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    addSalaryFund(reqObj).then(res => {
                        this.isSalaryDetailVisible = false
                        this.$message.success(res.message)
                        this.getPaymentApplyInfo()
                    })
                }
            })
        },
        handleSalaryDetailCancelClick() {
            this.isSalaryDetailVisible = false
            this.$refs.ruleSalaryDetailForm.resetFields()
            this.salaryObj = {}
        },
        // 请款+代发确认
        handleReqAndPayDetailSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleReqAndPayForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.reqAndPayDetailForm)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.salaryType = this.applicationType
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.uploadData = resultFile
                    let detailFile = ''
                    reqObj.fileDetails && reqObj.fileDetails.map(v => {
                            detailFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = detailFile
                    delete reqObj.fileUrlList
                    delete reqObj.fileDetails
                    addSalaryFund(reqObj).then(res => {
                        if(res.status == 1) {
                            this.isReqAndPayDetailVisible = false
                            this.$message.success(res.data)
                            this.getPaymentApplyInfo()
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
        setDescription(name, code) {
            if(name == '工程预付款付款' && code == 1) {
                return '建设单位向中标主体支付工程预付款';
            } else if(name == '工程进度款付款' && code == 1) {
                return '建设单位向中标主体支付工程进度款';
            } else if(name == '建设者工资付款' && code == 1) {
                return '建设单位根据合同将建设者工资款支付到中标主体工资专户'
            } else  if(name == '其他付款' && code == 1) {
                return '建设单位根据付款明细进行付款';
            } else if(name == '二类费用付款' && code == 1) {
                return '建设单位支付二类费用款项';
            } else if(name == '工程预付款请款' && code == 2) {
                return '中标主体向建设单位申请工程预付款';
            } else if(name == '工程进度款请款' && code == 2) {
                return '中标主体向建设单位申请工程进度款';
            // } else if(name == '建设者工资请款+发放' && code == 2) {
            //     return '中标主体根据支付要件向建设单位申请建设者工资，并进行代发';
            } else if(name == '材料款付款' && code == 2) {
                return '中标主体向材料商、其他分包商、设备租赁商支付材料款'
            } else if(name == '工程款付款' && code == 2) {
                return '中标主体向劳务分包、专业分包支付工程款'
            } else if(name == '建设者工资代发' && code == 2) {
                return '中标主体根据支付要件代发建设者工资'
            } else if(name == '二类费用请款' && code == 2) {
                return '中标主体向建设单位申请二类费用请款'
            } else if(name == '建设者工资请款' && code == 2) {
                return '中标主体根据支付要件向建设单位申请建设者工资'
            } else if(name == '其他付款' && code == 2) {
                return '中标主体根据付款明细进行付款'
            } else if(name == '工程进度款请款' && code == 3) {
                return '分包企业向总包企业申请工程进度款'
            // } else if(name == '建设者工资请款+发放' && code == 3) {
            //     return '分包企业根据工资明细向总包企业请款并向建设者发放'
            } else if(name == '建设者工资发放' && code == 3) {
                return '分包企业根据工资明细向建设者发放工资'
            } else if(name == '其他付款' && code == 3) {
                return '分包企业根据付款明细进行付款'
            } else if(name == '材料款请款' && code == 6) {
                return '分包企业向总包企业申请材料款'
            } else if(name == '工程进度款请款' && code == 6) {
                return '分包企业向总包企业申请工程进度款'
            // } else if(name == '建设者工资请款+发放' && code == 6) {
            //     return '分包企业根据工资明细向总包企业请款并向建设者发放'
            } else if(name == '建设者工资发放' && code == 6) {
                return '分包企业根据工资明细向建设者发放工资'
            } else if(name == '其他付款' && code == 6) {
                return '分包企业根据付款明细进行付款'
            } else if(name == '材料款请款' && code == 4) {
                return '分包企业向总包企业申请材料款'
            } else if(name == '其他付款' && code == 4) {
                return '分包企业根据付款明细进行付款'
            } else if(name == '材料款请款' && code == 5) {
                return '分包企业向总包企业申请材料款'
            } else if(name == '其他付款' && code == 5) {
                return '分包企业根据付款明细进行付款'
            } else if(name == '二类费用请款' && code == 7) {
                return '二类费用相关单位向业主单位申请二类费用款'
            } else if(name == '二类费用请款' && code == 8) {
                return '二类费用相关单位向业主单位申请二类费用款'
            } else if(name == '二类费用请款' && code == 9) {
                return '二类费用相关单位向业主单位申请二类费用款'
            }
        },
        setDeatilText(name, type) {
            if(name == '工程预付款付款' && type == 1) {
                return '1.中标通知书 2.总承包合同 3.增值税专用发票'
            } else if(name == '工程进度款付款' && type == 1){
                return '1.总承包合同 2. 验工计价单 3.增值税专用发票'
            } else if(name == '建设者工资付款' && type == 1) {
                return '1.总承包合同'
            } else if(name == '其他付款' && type == 1) {
                return '1.付款明细'
            } else if(name == '二类费用付款' && type == 1) {
                return '1.二类费用合同 2.增值税专用发票'
            } else if(name == '工程预付款请款' && type == 2) {
                return '1.中标通知书 2.总承包合同 3.增值税专用发票';
            } else if(name == '工程进度款请款' && type == 2) {
                return '1.总承包合同 2.验工计价单 3.增值税专用发票';
            // } else if(name == '建设者工资请款+发放' && type == 2) {
            //     return '1.付款明细';
            } else if(name == '材料款付款' && type == 2) {
                return '1.分包合同  2.供货单  3.增值税专用发票'
            } else if(name == '工程款付款' && type == 2) {
                return '1.分包合同  2.验工计价单 3.增值税专用发票'
            } else if(name == '建设者工资代发' && type == 2) {
                return '1.付款明细'
            } else if(name == '二类费用请款' && type == 2) {
                return '1.二类费用合同 2.增值税专用发票'
            } else if(name == '建设者工资请款' && type == 2) {
                return '1.付款明细'
            } else if(name == '其他付款' && type == 2) {
                return '1.付款明细'
            } else if(name == '工程进度款请款' && type == 3) {
                return '1.分包合同 2.验工计价单 3.增值税专用发票'
            // } else if(name == '建设者工资请款+发放' && type == 3) {
            //     return '1.付款明细 2.分包合同'
            } else if(name == '建设者工资发放' && type == 3) {
                return '1.付款明细'
            } else if(name == '其他付款' && type == 3) {
                return '1.付款明细'
            } else if(name == '材料款请款' && type == 6) {
                return '1.分包合同 2.供货单 3.增值税专用发票'
            } else if(name == '工程进度款请款' && type == 6) {
                return '1.分包合同 2.验工计价单 3.增值税专用发票'
            // } else if(name == '建设者工资请款+发放' && type == 6) {
            //     return '1.付款明细 2.分包合同'
            } else if(name == '建设者工资发放' && type == 6) {
                return '1.付款明细'
            } else if(name == '其他付款' && type == 6) {
                return '1.付款明细'
            } else if(name == '材料款请款' && type == 4) {
                return '1.分包合同 2.供货单 3.增值税专用发票'
            } else if(name == '其他付款' && type == 4) {
                return '1.付款明细'
            } else if(name == '材料款请款' && type == 5) {
                return '1.分包合同 2.供货单 3.增值税专用发票'
            } else if(name == '其他付款' && type == 5) {
                return '1.付款明细'
            } else if(name == '二类费用请款' && type == 7) {
                return '1.二类费用合同 2.增值税专用发票'
            } else if(name == '二类费用请款' && type == 8) {
                return '1.二类费用合同 2.增值税专用发票'
            } else if(name == '二类费用请款' && type == 9) {
                return '1.二类费用合同 2.增值税专用发票'
            }
        }

    }
}
</script>
<style lang="less">
.apply-wrapper{
    .card-wrapper{
        // box-shadow: 0 0 10px 2px #ccc;
        margin: 20px;
        border-radius: 8px;
        background: #FAFAFA;
        .title{
            color: #ACACAC;
        }
        .ant-card-head{
            .ant-card-head-wrapper{
                .ant-card-head-title {
                    color: #406DBE;
                    font-weight: 600;
                    font-size: 18px;
                }
            }
        }
    }
    .ant-card-hoverable:hover{
        border-color: #508EDF;
        background: #F9FBFF;
        box-shadow: 0 0 10px 2px #508EDF;
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
  .ant-modal-content{
    width: 1150px;
    margin-left: -140px;
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
        right: -186px;
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
        right: -186px;
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
</style>