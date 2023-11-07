<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="合同类型">
                <a-cascader
                  v-model="queryParam.contractType"
                  :field-names="{ label: 'name', value: 'value', children: 'children' }"
                  :options="projectType"
                  placeholder="请选择合同类型"
                  change-on-select
                  @change="handleSearchContractTypeChange"
                ></a-cascader>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称/编号">
                <a-input v-model="queryParam.searchParam" placeholder="请输入搜索条件（合同名称或合同编号）"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                <a-button style="margin-left: 8px" type="primary" v-if="isAddBtnShow" @click="handleAddClick">新建</a-button>
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
        :scroll="{ x: 1200, y: 600 }"
        :loading="loading"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <template slot="status" slot-scope="text, record">
          <span>{{ record.status == '1' ? '审批中' : record.status == '2' ? '已生效' : record.status == '3' ? '已过期' : ''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">详情</a-button>
          <a-button type="link" :disabled="!scope.editFlag" @click="handleEditClick(scope)">合同变更</a-button>
          <!-- <a-button type="link" @click="handleSettleClick(scope)">合同结算信息</a-button> -->
          <!-- <a-button type="link" @click="handleHistoryClick(scope)">合同历史</a-button> -->
          <!-- <a-button type="link" @click="handleEditClick(scope)">删除</a-button> -->
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="isAddVisible" class="addContractModal" title="新增合同" ok-text="确认" cancel-text="取消" @ok="handleSubmitModalClick" @cancel="handleCancelClick" :confirmLoading="confirmLoading">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :rules="rules"
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
                        <a-radio-group v-model="addForm.contractCreate" @change="handleContractCreateChange">
                            <!-- <a-radio value="1">合同甲方</a-radio> -->
                            <a-radio value="2">合同乙方</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同类型" prop='contractType'>
                        <a-cascader
                          v-model="addForm.contractType"
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
                      <a-select v-model="addForm.belongContractCode" placeholder="请选择归属总包合同名称" @change="handleBelongContractCodeChange">
                        <a-select-option v-for="item of belongGeneralType" :key="item.value" :value="item.value">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12" v-else>
                  <a-form-model-item label="归属总包合同名称" >
                      <a-select v-model="addForm.belongContractCode" placeholder="请选择归属总包合同名称" disabled>
                        <a-select-option v-for="item of projectType" :key="item.value" :value="item.value" :title="item.name">
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
                      <a-select
                        v-model="addForm.belongProjectCode"
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
                        v-model="addForm.contractName"
                        placeholder="请输入合同名称"
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同编号" prop="contractCode">
                    <a-input 
                        type="text" 
                        v-model="addForm.contractCode"
                        placeholder="请输入合同编号"
                    />
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="合同签订日期" prop="contractSignDate">
                      <a-date-picker 
                        type="text" 
                        v-model="addForm.contractSignDate"
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
                        v-model="addForm.contractStartDate"
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
                        v-model="addForm.contractEndDate"
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
                        v-model="addForm.contractAmount"
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
                        v-model="addForm.prepaymentAmou"
                        placeholder="请输入合同预付款金额"
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同质保金金额（元）" prop="warrantyAmount">
                    <a-input 
                        type="number" 
                        v-model="addForm.warrantyAmount"
                        placeholder="请输入合同质保金金额"
                    />
                    </a-form-model-item>
                </a-col>
            </a-row> -->
            <!-- <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="合同付款周期" prop="contractPaymentPeriod">
                      <a-select v-model="addForm.contractPaymentPeriod" placeholder="请选择合同付款周期" :default-value="defaultPeriod">
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
                        v-model="addForm.contractPaymentProportion"
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
                        v-model="addForm.settledAmount"
                        placeholder="请输入合同已结算金额"
                    />
                    </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="合同已支付金额（元）" prop="paidAmount">
                    <a-input 
                        type="number" 
                        v-model="addForm.paidAmount"
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
                        v-model="addForm.companyAName"
                        placeholder="请输入甲方合同名称"
                    /> -->
                    <a-select
                        v-model="addForm.companyAName"
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
                        v-model="addForm.contractACompanyCode"
                        placeholder="请输入合同甲方公司统一社会信用代码"
                        :disabled="addForm.companyAName ? true : false"
                    />
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="合同甲方银行账户名称">
                    <a-input 
                        type="text" 
                        v-model="addForm.payerName"
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
                      <a-select v-model="addForm.payerAcc" placeholder="请输入合同甲方银行账号" @focus="handlePayerNameFocus" @change="handlePayerNameChange">
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
                        v-model="addForm.payerOpenBank"
                        placeholder="请输入甲方合同开户行"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同甲方联行行号">
                    <a-input 
                        type="text" 
                        v-model="addForm.payerOpenBankNo"
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
                        v-model="addForm.peasantWorkerPayerName"
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
                    <a-select v-model="addForm.peasantWorkerPayerAcc" placeholder="请输入甲方农民工工资专户账号" @focus="handlePeasantNameFocus" @change="handlePeasantNameChange">
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
                        v-model="addForm.peasantWorkerPayerOpenBank"
                        placeholder="请输入甲方农民工工资专户开户行"
                        disabled
                    />
                  </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="甲方农民工工资专户联行号">
                    <a-input 
                        type="text" 
                        v-model="addForm.peasantWorkerPayerOpenBankNo"
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
                        v-model="addForm.companyBName"
                        placeholder="请输入合同乙方公司名称"
                    /> -->
                    <a-select
                        v-model="addForm.companyBName"
                        show-search
                        placeholder="请输入搜索选择合同甲方公司名称"
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
                        v-model="addForm.contractBCompanyCode"
                        placeholder="请输入合同乙方公司统一社会信用代码"
                        @blur="handleBlur"
                        :disabled="addForm.companyBName ? true : false"
                    />
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-model-item label="合同乙方银行账户名称" prop="payeeAcc">
                    <a-input 
                        type="text" 
                        v-model="addForm.payeeName"
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
                      <a-select v-model="addForm.payeeAcc" placeholder="请输入合同乙方银行账号" @focus="handlePayeeNameFocus" @change="handlePayeeNameChange">
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
                        v-model="addForm.payeeOpenBank"
                        placeholder="请输入合同乙方开户行"
                        disabled
                    />
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item label="合同乙方联行行号" prop="payeeOpenBankNo">
                    <a-input 
                        type="text" 
                        v-model="addForm.payeeOpenBankNo"
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
                        v-model="addForm.peasantWorkerPayeeName"
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
                    <a-select v-model="addForm.peasantWorkerPayeeAcc" placeholder="请输入乙方农民工工资专户账号" @focus="handlePeasantPayeeNameFocus" @change="handlePeasantPayeeNameChange">
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
                        v-model="addForm.peasantWorkerPayeeOpenBank"
                        placeholder="请输入乙方农民工工资专户开户行"
                        disabled
                    />
                  </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="乙方农民工工资专户联行号">
                    <a-input 
                        type="text" 
                        v-model="addForm.peasantWorkerPayeeOpenBankNo"
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
            <div v-if="addForm.contractCreate == 2">
                <a-row :gutter="24">
                  <a-col :span="12">
                      <a-form-model-item label="合同经办人" prop="contractOperator">
                        <!-- @focus="handleContractOperatorFocus" -->
                          <a-select v-model="addForm.contractOperator" placeholder="请选择合同经办人" @focus="handleContractOperatorAgentFocus">
                            <a-select-option v-for="item of agentSelect" :key="item.value" :value="item.value">
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                      </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                      <a-form-model-item label="合同一级复核人" prop="contractPrimaryReviewer">
                        <!--  @focus="handleContractPrimaryFocus" -->
                          <a-select v-model="addForm.contractPrimaryReviewer" placeholder="请选择合同一级复核人" @focus="handleContractPrimaryFocus">
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
                          <a-select v-model="addForm.contractSecondaryReviewer" placeholder="请选择合同二级复核人" @focus="handleContractSecondFocus">
                            <a-select-option v-for="item of reviewSelect2" :key="item.value" :value="item.value">
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                      </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                      <a-form-model-item label="甲方企业经办人" prop="companyOperator">
                        <!-- @focus="handleContractOperatorFocus" -->
                          <a-select v-model="addForm.companyOperator" placeholder="请选择甲方企业经办人" @focus="handleContractOperatorFocus">
                            <a-select-option v-for="item of agentSelectA" :key="item.value" :value="item.value">
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                      </a-form-model-item>
                  </a-col>
              </a-row>
            </div>
            <div v-else>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="合同经办人" prop="companyContractDetailOperator">
                          <!-- @focus="handleCompanyContractOperatorFocus" -->
                            <a-select v-model="addForm.companyContractDetailOperator" placeholder="请选择合同经办人" @focus="handleCompanyContractOperatorFocus">
                              <a-select-option v-for="item of agentSelectB" :key="item.value" :value="item.value">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="合同一级复核人" prop="companyContractPrimaryReviewer" >
                          <!-- @focus="handleCompanyContractPrimaryFocus" -->
                            <!-- <a-select v-model="addForm.companyContractPrimaryReviewer" placeholder="请选择合同一级复核人" @change="handleSSSChange">
                              <a-select-option v-for="item of reviewSelect3" :key="item.value" :value="item.value">
                                {{ item.name }}
                              </a-select-option>
                            </a-select> -->
                            <a-select v-model="addForm.companyContractPrimaryReviewer" placeholder="请选择合同一级复核人" @change="handleSSSChange" @focus="handleCompanyContractPrimaryFocus">
                            <a-select-option v-for="item of reviewSelect3" :key="item.value" :value="item.value">
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="合同二级复核人（如有）">
                          <!-- @focus="handleCompanyContractSecondFocus" -->
                            <a-select v-model="addForm.companyContractSecondaryReviewer" placeholder="请选择合同二级复核人" @focus="handleCompanyContractSecondFocus">
                              <a-select-option v-for="item of reviewSelect2" :key="item.value" :value="item.value">
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
                    <a-form-model-item label="上传合同文件" prop="fileUrlList">
                      <div :key="imgKey">
                        <a-upload
                          :action="`${$fileUrl}/files`"
                          @change="handleChangeFile"
                          :before-upload="beforeImgUpload"
                          :default-file-list="addForm.fileUrlList"
                          :showUploadList="{
                              showRemoveIcon: true
                          }"
                          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                        >
                          <a-button type="primary"> <a-icon type="upload" /> 点击上传 </a-button>
                        </a-upload>
                      </div>
                      
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="合同相关补充材料">
                      <div :key="imgSupplementKey">
                        <a-upload
                          :action="`${$fileUrl}/files`"
                          @change="handleSupplementChangeFile"
                          :before-upload="beforeSupplementImgUpload"
                          :default-file-list="addForm.fileSupplementUrlList"
                          :showUploadList="{
                              showRemoveIcon: true
                          }"
                          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
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


    <a-modal v-model="isDetailVisible" class="addContractModal" title="详情" :footer="null">
        <div>
            <div class="model-row">
                <span>模板信息</span>
            </div>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同创建人：</span>
                    <span>{{ contractDetail.contractCreate ? (contractDetail.contractCreate == 1 ? '甲方' : '乙方') : '' }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同类型：</span>
                    <span>{{ contractDetail.contractTypeName }}</span>
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
                    <span>{{ contractDetail.belongContractName }}</span>
                </a-col>
                <a-col :span="12">
                    <span>归属三级项目信息：</span>
                    <span>{{ contractDetail.belongProjectName }}</span>
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
                    <span>{{ contractDetail.contractName }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同编号：</span>
                    <span>{{ contractDetail.contractCode }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同签订日期：</span>
                    <span>{{ contractDetail.contractSignDate }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同开始日期：</span>
                    <span>{{ contractDetail.contractStartDate }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同结束日期：</span>
                    <span>{{ contractDetail.contractEndDate }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同总金额（元）：</span>
                    <span>{{ contractDetail.contractAmount }}</span>
                </a-col>
            </a-row>
            <!-- <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同预付款金额（元）：</span>
                    <span>{{ contractDetail.prepaymentAmou }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同质保金金额（元）：</span>
                    <span>{{ contractDetail.warrantyAmount }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同付款周期：</span>
                    <span>{{ setCycleType(contractDetail.contractPaymentPeriod) }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同约定现金支付比例（%）：</span>
                    <span>{{ contractDetail.contractPaymentProportion }}</span>
                </a-col>
            </a-row> -->
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同已结算金额（元）：</span>
                    <span>{{ contractDetail.settledAmount }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同已支付金额（元）：</span>
                    <span>{{ contractDetail.paidAmount }}</span>
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
                    <span>{{ contractDetail.companyAName }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同甲方公司统一社会信用代码：</span>
                    <span>{{ contractDetail.contractACompanyCode }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同甲方银行账号：</span>
                    <span>{{ contractDetail.payerAcc }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同甲方银行账户名称：</span>
                    <span>{{ contractDetail.payerName }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同甲方开户行：</span>
                    <span>{{ contractDetail.payerOpenBank }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同甲方联行行号：</span>
                    <span>{{ contractDetail.payerOpenBankNo }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="isShowAWorker" class="model-col">
              <a-col :span="12">
                <span>甲方农民工工资专户账号：</span>
                <span>{{ contractDetail.peasantWorkerPayerAcc }}</span>
              </a-col>
              <a-col :span="12">
                <span>甲方农民工工资专户户名：</span>
                <span>{{ contractDetail.peasantWorkerPayerName }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="isShowAWorker" class="model-col">
              <a-col :span="12">
                <span>甲方农民工工资专户开户行：</span>
                <span>{{ contractDetail.peasantWorkerPayerOpenBank }}</span>
              </a-col>
              <a-col :span="12">
                <span>甲方农民工工资专户联行号：</span>
                <span>{{ contractDetail.peasantWorkerPayerOpenBankNo }}</span>
              </a-col>
            </a-row>
        </div>
        <div>
            <div class="model-row">
                <span>合同乙方信息</span>
            </div>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同乙方公司名称：</span>
                    <span>{{ contractDetail.companyBName }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同乙方公司统一社会信用代码：</span>
                    <span>{{ contractDetail.contractBCompanyCode }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同乙方银行账号：</span>
                    <span>{{ contractDetail.payeeAcc }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同乙方银行账户名称：</span>
                    <span>{{ contractDetail.payeeName }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同乙方开户行：</span>
                    <span>{{ contractDetail.payeeOpenBank }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同乙方联行行号：</span>
                    <span>{{ contractDetail.payeeOpenBankNo }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="isShowBWorker" class="model-col">
              <a-col :span="12">
                <span>乙方农民工工资专户账号：</span>
                <span>{{ contractDetail.peasantWorkerPayeeAcc }}</span>
              </a-col>
              <a-col :span="12">
                <span>乙方农民工工资专户户名：</span>
                <span>{{ contractDetail.peasantWorkerPayeeName }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="isShowBWorker" class="model-col">
              <a-col :span="12">
                <span>乙方农民工工资专户开户行：</span>
                <span>{{ contractDetail.peasantWorkerPayeeOpenBank }}</span>
              </a-col>
              <a-col :span="12">
                <span>乙方农民工工资专户联行号：</span>
                <span>{{ contractDetail.peasantWorkerPayeeOpenBankNo }}</span>
              </a-col>
            </a-row>
        </div>
        <div class="process">
            <div class="model-row">
                <span>审批流程</span><strong>* 请在此部分设定与本合同审批及本合同支付审批相关的流程</strong>
            </div>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同经办人：</span>
                    <span>{{ contractDetail.contractCreate == 1 ? contractDetail.companyOperatorName : contractDetail.contractOperatorName }}</span>
                </a-col>
                <a-col :span="12">
                    <span>合同一级复核人：</span>
                    <span>{{ contractDetail.contractCreate == 1 ? contractDetail.companyContractPrimaryReviewerName : contractDetail.contractPrimaryReviewerName }}</span>
                </a-col>
            </a-row>
            <a-row :gutter="24" class="model-col">
                <a-col :span="12">
                    <span>合同二级复核人（如有）：</span>
                    <span>{{ contractDetail.contractCreate == 1 ? contractDetail.companyContractSecondaryReviewerName : contractDetail.contractSecondaryReviewerName }}</span>
                </a-col>
                <a-col :span="12" v-if="contractDetail.contractCreate != 1">
                    <span>甲方企业经办人：</span>
                    <span>{{ contractDetail.companyOperatorName }}</span>
                </a-col>
            </a-row>
        </div>
        <div>
            <div class="model-row">
                <span>合同附件信息</span>
            </div>
            <a-row :gutter="24" class="model-col">
                  <a-col :span="12" style="display: flex; flex-direction: row; align-items: center;">
                    <span>上传合同文件:</span>
                    <div class="upload-wrapper">
                      <!-- <span v-for="(item, index) of contractDetail.contractFile" :key="index">{{ item }} <span class="download" @click="handleDownloadClick(addForm)">下载</span></span> -->
                      <span v-for="(item, index) of contractDetail.contractFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                    </div>
                  </a-col>
                  <a-col :span="12" style="display: flex; flex-direction: row; align-items: center;">
                    <span>上传合同文件:</span>
                    <div class="upload-wrapper">
                      <!-- <span v-for="(item, index) of contractDetail.contractFile" :key="index">{{ item }} <span class="download" @click="handleDownloadClick(addForm)">下载</span></span> -->
                      <span v-for="(item, index) of contractDetail.contractSupFile" :key="index">{{ item.name }} <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
                    </div>
                  </a-col>
            </a-row>
        </div>
        <div class="footer-wrapper">
          <a-button type="primary" @click="handleConfirmClick">确认</a-button>
        </div>
    </a-modal>

    <a-modal v-model="isSettleVisible" class="addContractModal" title="合同结算信息" :footer="null">
        <a-table
        :rowKey="((record, index) => {return index})"
        :columns="settleColumns"
        :data-source="settleList"
        :pagination="false"
        :scroll="{ y: 600 }"
        :loading="loading"
      >
      </a-table>
        <div class="footer-total-wrapper">
          <div class="total-num">
            <span>累计结算金额：{{ totalSettlAmount }}  元</span>
            <span>累计支付金额：{{ totalAmount }}  元</span>
          </div>
          
          <a-button type="primary" @click="handleSettleConfirmClick">确认</a-button>
        </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { getContractList, addContractInfo, getContractTypeAll, getGeneralContract, getThirdProject, getUserRole, getContractDetail, editContractInfo, getThirdPrjName, getDownloadFile, getCompanyCreditCode } from '@/api/contract'
import { fileUrl } from '@/utils/request'
import { getSelectAccount } from '@/api/workbench'
import { getPayDetailDesc } from '@/api/payment'

const columns = [
  // {
  //   title: '序号',
  //   scopedSlots: { customRender: 'serial' },
  //   fixed: 'left',
  //   width: 80
  // },
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
    width: '200px'
  },
  {
    title: '项目名称',
    dataIndex: 'belongProjectName',
    key: 'belongProjectName',
    width: '300px'
  },
  {
    title: '合同甲方公司名称',
    dataIndex: 'companyAName',
    key: 'companyAName',
    width: '300px'
  },
  {
    title: '合同乙方公司名称',
    dataIndex: 'companyBName',
    key: 'companyBName',
    width: '300px'
  },
  {
    title: '合同总额（元）',
    dataIndex: 'contractAmount',
    key: 'contractAmount',
    width: '200px'
  },
  {
    title: '合同状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    width: '120px'
  },
  {
    title: '当前版本',
    dataIndex: 'version',
    key: 'version',
    width: '180px'
  },
  {
    title: '创建日期',
    dataIndex: 'contractCreateDate;',
    key: 'contractCreateDate;',
    width: '180px'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '300px',
    align: 'center',
    fixed: 'right',
    align: 'center'
  },
]

const settleColumns = [
  {
    title: '结算时间',
    dataIndex: 'payDate',
    key: 'payDate',
    width: '13%'
  },
  {
    title: '付款方账号',
    dataIndex: 'payerAcc',
    key: 'payerAcc',
    width: '13%'
  },
  {
    title: '收款账户名称',
    dataIndex: 'payeeAccName',
    key: 'payeeAccName',
    width: '13%'
  },
  {
    title: '收款方账号',
    dataIndex: 'payeeAcc',
    key: 'payeeAcc',
    width: '13%'
  },
  {
    title: '结算金额',
    dataIndex: 'settlementAmount',
    key: 'settlementAmount',
    width: '13%'
  },
  {
    title: '支付金额',
    dataIndex: 'payAmount',
    key: 'payAmount',
    width: '13%'
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

export default {
  name: 'TableList',
//   components: {
//     STable,
//     Ellipsis
//   },
  data () {
    this.columns = columns
    this.settleColumns = settleColumns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        contractType: [],
        searchParam: '',
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
      loading: false,
      isAddVisible: false,
      addForm: {
        contractCreate: '',
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
        companyAName: undefined,
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
        fileSupplementUrlList: [],
        settledAmount: '',
        paidAmount: ''
      },
      rules: {
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
      projectType: [],
      thirdProjectSelect: [],
      agentSelect: [],
      reviewSelect1: [],
      reviewSelect2: [],
      reviewSelect3: [],
      agentSelectA: [],
      agentSelectB: [],
      belongGeneralType: [],
      cycleSelect,
      isContractType: true,
      isShowCompanyOperator: true,
      isShowEdit: false,
      defaultPeriod: undefined,
      isDetailVisible: false,
      contractDetail: {},
      belongCodeDisabled: false,
      isAddBtnShow: null,
      isShowAWorker: false,
      isShowBWorker: false,
      imgKey: '',
      cacheFile: '',
      fileUrl,
      payerNameSelect: [],
      peasantNameSelect: [],
      payeeNameSelect: [],
      peasantPayeeNameSelect: [],
      isSettleVisible: false,
      settleList: [],
      totalAmount: '',
      imgSupplementKey: '',
      totalSettlAmount: '',
      companyASelect: [],
      companyBSelect: [],
      confirmLoading: false
    }
  },
  watch: {
    'addForm.contractType'(newVal) {
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
    'contractDetail.contractTypeName'(newVal) {
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
    isShowEdit(newVal) {
      if(newVal) {
        this.imgKey = ''
        this.imgSupplementKey = ''
      } else {
        this.imgKey = Math.random()
        this.imgSupplementKey = Math.random()
      }
    }
    
  },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    this.getContractTypeSelect()
    this.getGeneralContractList()
    this.getThirdProjectList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let resObj = {
        contractType: Number(this.queryParam.contractType[this.queryParam.contractType.length - 1]),
        searchParam: this.queryParam.searchParam,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getContractList(resObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
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
    getThirdProjectList() {
      // getThirdProject().then(res => {
      //   if(res && res.length > 0) {
      //     this.thirdProjectSelect = res
      //   }
      // })
    },
    getUserRoleList(id, companyA, companyB) {
      // if(companyA && companyB) {
        
      // } else {
      //   this.$message.warning('请先输入甲乙方公司的统一社会信用代码')
      //   return
      // }
      console.log(this.addForm.contractCreate)
      console.log(companyA, companyB)
      if(this.addForm.contractCreate == 1) {
        companyA = this.addForm.companyAName
        companyB = this.addForm.contractACompanyCode
      } else {
        companyA = this.addForm.companyBName
        companyB = this.addForm.contractBCompanyCode
      }
      if(id == 1) {
        if(this.addForm.contractCreate == 2) {
          console.log(this.companyASelect)
          console.log(this.addForm.companyAName, this.addForm.contractACompanyCode)
          console.log(this.addForm.companyBName, this.addForm.contractBCompanyCode)
          getUserRole(1, this.addForm.companyAName, this.addForm.contractACompanyCode).then(res => {
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
              console.log(this.agentSelectA)
            }
          })
          getUserRole(1, this.addForm.companyBName, this.addForm.contractBCompanyCode).then(res => {
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
            console.log(this.reviewSelect3)
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
   handleSearchClick() {
     this.getQuotaApplyList()
   }, 
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handlePageChange(page, pageSize) {
      this.pagination.current = page
      this.getQuotaApplyList()
    },
    handleShowSizeChange(current, size) {
      this.pagination.pageSize = size
    },
    handleSettlePageChange(page, pageSize) {
      this.pagination.current = page
    },
    handleSettleShowSizeChange(current, size) {
      this.pagination.pageSize = size
      this.getQuotaApplyList()
    },
    handleAddClick() {
      this.isAddVisible = true
      this.isContractType = true
      this.isShowEdit = false
      // this.addForm.contractCreate = ''
      // this.addForm.contractType = []
      // this.addForm.belongContractCode = undefined
      // this.addForm.belongProjectCode = undefined
      // this.addForm.contractName = ''
      // this.addForm.contractCode = ''
      // this.addForm.contractSignDate = ''
      // this.addForm.contractStartDate = ''
      // this.addForm.contractEndDate = ''
      // this.addForm.contractAmount = ''
      // this.addForm.prepaymentAmou = ''
      // this.addForm.warrantyAmount = ''
      // this.addForm.contractPaymentPeriod = undefined
      // this.addForm.contractPaymentProportion = ''
      // this.addForm.companyAName = ''
      // this.addForm.contractACompanyCode = ''
      // this.addForm.payerAcc = ''
      // this.addForm.payerName = ''
      // this.addForm.payerOpenBank = ''
      // this.addForm.payerOpenBankNo = ''
      // this.addForm.companyBName = ''
      // this.addForm.contractBCompanyCode = ''
      // this.addForm.payeeAcc = ''
      // this.addForm.payeeName = ''
      // this.addForm.payeeOpenBank = ''
      // this.addForm.payeeOpenBankNo = ''
      // this.addForm.contractOperator = undefined
      // this.addForm.contractPrimaryReviewer = undefined
      // this.addForm.contractSecondaryReviewer = undefined
      // this.addForm.companyOperator = undefined
      // this.addForm.companyContractOperator = undefined
      // this.addForm.companyContractPrimaryReviewer = undefined
      // this.addForm.companyContractDetailOperator = undefined
      // this.addForm.peasantWorkerPayerName = ''
      // this.addForm.peasantWorkerPayerAcc = ''
      // this.addForm.peasantWorkerPayerOpenBank = ''
      // this.addForm.peasantWorkerPayerOpenBankNo = ''
      // this.addForm.peasantWorkerPayeeName = ''
      // this.addForm.peasantWorkerPayeeAcc = ''
      // this.addForm.peasantWorkerPayeeOpenBank = ''
      // this.addForm.peasantWorkerPayeeOpenBankNo = ''
      // this.addForm.fileUrlList = []
      // this.$refs.ruleForm.resetFields()
      this.addForm = {
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
        payerName: '',
        payerOpenBank: '',
        payerOpenBankNo: '',
        peasantWorkerPayerName: '',
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
        fileUrlList: []
      }
    },
    handleContractCreateChange(e) {
      if(e.target.value == 1) {
        this.isShowCompanyOperator = false
      } else {
        this.isShowCompanyOperator = true
      }
    },
    handleSearchContractTypeChange(value) {
      console.log(value)
    },
    handleBelongContractCodeChange(value) {
      let newValue = ''
      console.log(value)
      getThirdPrjName(value).then(res => {
        console.log(res)
        if(res.status == 1) {
          let data = res.data
          console.log(data)
          if(data) {
            getThirdProject(data).then(res => {
              console.log(res)
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
    handleEndDateChange(date, dateString) {
      console.log(date, dateString)
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          this.confirmLoading = true
          let reqObj = Object.assign({}, this.addForm)
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
          let resultSupFile = ''
          reqObj.fileSupplementUrlList && reqObj.fileSupplementUrlList.map(v => {
                resultSupFile += v.name + '#' + v.response.data + ','
            })
          reqObj.contractSupFile = resultSupFile
          reqObj.contractCreateUser = this.addForm.contractCreateUser
          reqObj.payableAmount = this.addForm.payableAmount
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
          
          delete reqObj.fileUrlList
          delete reqObj.fileSupplementUrlList
          delete reqObj.companyContractDetailOperator

          reqObj.settledAmount = Number(reqObj.settledAmount)
          reqObj.paidAmount = Number(reqObj.paidAmount)
          
          if(this.isShowEdit) {
            editContractInfo(reqObj).then(res => {
              if(res.status == 1) {
                setTimeout(() => {
                  this.confirmLoading = false
                }, 1000)
                this.$message.success(res.data)
                this.isAddVisible = false
                this.getQuotaApplyList()
                this.belongCodeDisabled = false
              } else {
                this.$message.error(res.data)
                setTimeout(() => {
                  this.confirmLoading = false
                }, 1000)
              }
            })
          } else {
            addContractInfo(reqObj).then(res => {
              if(res.status == 1) {
                setTimeout(() => {
                  this.confirmLoading = false
                }, 1000)
                this.$message.success(res.data)
                this.isAddVisible = false
                this.getQuotaApplyList()
                this.belongCodeDisabled = false
              } else {
                this.$message.error(res.data)
                setTimeout(() => {
                  this.confirmLoading = false
                }, 1000)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleCancelClick() {
      this.isAddVisible = false
      this.isShowEdit = false
      this.belongCodeDisabled = false
      this.addForm.contractCreate = ''
      this.addForm.contractType = []
      this.addForm.belongContractCode = undefined
      this.addForm.belongProjectCode = undefined
      this.addForm.contractName = ''
      this.addForm.contractCode = ''
      this.addForm.contractSignDate = ''
      this.addForm.contractStartDate = ''
      this.addForm.contractEndDate = ''
      this.addForm.contractAmount = ''
      this.addForm.prepaymentAmou = ''
      this.addForm.warrantyAmount = ''
      this.addForm.contractPaymentPeriod = undefined
      this.addForm.contractPaymentProportion = ''
      this.addForm.companyAName = ''
      this.addForm.contractACompanyCode = ''
      this.addForm.payerAcc = ''
      this.addForm.payerName = ''
      this.addForm.payerOpenBank = ''
      this.addForm.payerOpenBankNo = ''
      this.addForm.companyBName = ''
      this.addForm.contractBCompanyCode = ''
      this.addForm.payeeAcc = ''
      this.addForm.payeeName = ''
      this.addForm.payeeOpenBank = ''
      this.addForm.payeeOpenBankNo = ''
      this.addForm.contractOperator = undefined
      this.addForm.contractPrimaryReviewer = undefined
      this.addForm.contractSecondaryReviewer = undefined
      this.addForm.companyOperator = undefined
      this.addForm.companyContractOperator = undefined
      this.addForm.companyContractPrimaryReviewer = undefined
      this.addForm.fileUrlList = []
      this.addForm.companyContractDetailOperator = undefined
      this.addForm.peasantWorkerPayerName = ''
      this.addForm.peasantWorkerPayerAcc = ''
      this.addForm.peasantWorkerPayerOpenBank = ''
      this.addForm.peasantWorkerPayerOpenBankNo = ''
      this.addForm.peasantWorkerPayeeName = ''
      this.addForm.peasantWorkerPayeeAcc = ''
      this.addForm.peasantWorkerPayeeOpenBank = ''
      this.addForm.peasantWorkerPayeeOpenBankNo = ''
      this.$refs.ruleForm.resetFields()
      
    },
    handleReviewClick(row) {
      this.isDetailVisible = true
      getContractDetail(row.id).then(res => {
        if(res.status == 1 && res.data) {
          this.contractDetail = res.data
          this.cacheFile = this.contractDetail.contractFile
          let newStr = this.contractDetail.contractFile && this.contractDetail.contractFile.substring(0, this.contractDetail.contractFile.length - 1).split(',')
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
          this.contractDetail.contractFile = uploadArr

          let newSupStr = this.contractDetail.contractSupFile && this.contractDetail.contractSupFile.substring(0, this.contractDetail.contractSupFile.length - 1).split(',')
          let uploadSupArr = []
          newSupStr && newSupStr.map(res => {
            // res = res.split('#')[0]
            let num = res.lastIndexOf('\#')
            let resObj = {
              name: res.substring(0, num),
              url: res.substring(num + 1, res.length)
            }
            uploadSupArr.push(resObj)
          })
          this.contractDetail.contractSupFile = uploadSupArr
          if(this.contractDetail.contractACompanyCode && this.contractDetail.contractBCompanyCode) {
              this.getUserRoleList(1, this.contractDetail.contractACompanyCode, this.contractDetail.contractBCompanyCode)
              this.getUserRoleList(2, this.contractDetail.contractACompanyCode, this.contractDetail.contractBCompanyCode)
              this.getUserRoleList(3, this.contractDetail.contractACompanyCode, this.contractDetail.contractBCompanyCode)
          }
        }
      })
    },
    handleEditClick(row) {
      this.isAddVisible = true
      this.isShowEdit = true
      this.addForm = {
        contractCreate: '',
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
        payerName: '',
        payerOpenBank: '',
        payerOpenBankNo: '',
        peasantWorkerPayerName: '',
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
        fileSupplementUrlList: [],
        settledAmount: '',
        paidAmount: ''
      }
      let self = this
      getContractDetail(row.id).then(async res => {
        if(res.status == 1 && res.data) {
          const data = res.data
          if(String(data.contractType).length > 1) {
            let arr = []
            arr[0] = String(data.contractType).substr(0, 1)
            arr[1] = String(data.contractType)
            this.addForm.contractType = arr
          } else {
            let arr = []
            arr[0] = String(data.contractType)
            this.addForm.contractType = arr
          }
          this.belongCodeDisabled = data.belongContractCode ? true : false
          this.isContractType = data.contractType == 1 ? false : true
          this.addForm.contractCreate = String(data.contractCreate)
          if(data.contractCreate == 1) {
            this.isShowCompanyOperator = false
          } else {
            this.isShowCompanyOperator = true
          }
          console.log(this.addForm.contractCreate)
        
        this.addForm.belongContractCode = data.belongContractCode
        this.addForm.belongProjectCode = data.belongProjectCode
        console.log(this.thirdProjectSelect)
        this.addForm.contractName = data.contractName
        this.addForm.contractCode = data.contractCode
        this.addForm.contractSignDate = data.contractSignDate
        this.addForm.contractStartDate = data.contractStartDate
        this.addForm.contractEndDate = data.contractEndDate
        this.addForm.companyAName = data.companyAName
        this.addForm.contractACompanyCode = data.contractACompanyCode
        this.addForm.payerAcc = data.payerAcc
        this.addForm.payerName = data.payerName
        this.addForm.payerOpenBank = data.payerOpenBank
        this.addForm.payerOpenBankNo = data.payerOpenBankNo
        this.addForm.companyBName = data.companyBName
        this.addForm.contractBCompanyCode = data.contractBCompanyCode
        this.addForm.payeeAcc = data.payeeAcc
        this.addForm.payeeName = data.payeeName
        this.addForm.payeeOpenBank = data.payeeOpenBank
        this.addForm.payeeOpenBankNo = data.payeeOpenBankNo
        this.addForm.companyContractOperator = data.companyContractOperator
        this.addForm.peasantWorkerPayerName = data.peasantWorkerPayerName
        this.addForm.peasantWorkerPayerAcc = data.peasantWorkerPayerAcc
        this.addForm.peasantWorkerPayerOpenBank = data.peasantWorkerPayerOpenBank
        this.addForm.peasantWorkerPayerOpenBankNo = data.peasantWorkerPayerOpenBankNo
        this.addForm.peasantWorkerPayeeName = data.peasantWorkerPayeeName
        this.addForm.peasantWorkerPayeeAcc = data.peasantWorkerPayeeAcc
        this.addForm.peasantWorkerPayeeOpenBank = data.peasantWorkerPayeeOpenBank
        this.addForm.peasantWorkerPayeeOpenBankNo = data.peasantWorkerPayeeOpenBankNo
        this.addForm.contractAmount = String(data.contractAmount)
        this.addForm.contractOperator = data.contractOperator ? String(data.contractOperator) : undefined
        this.addForm.prepaymentAmou = String(data.prepaymentAmou)
        this.addForm.warrantyAmount = String(data.warrantyAmount)
        this.addForm.contractPaymentPeriod = String(data.contractPaymentPeriod)
        this.addForm.contractPaymentProportion = String(data.contractPaymentProportion)
        this.addForm.settledAmount = String(data.settledAmount)
        this.addForm.paidAmount = String(data.paidAmount)
        this.handleContractOperatorFocus()
          this.handleContractPrimaryFocus()
          this.handleContractSecondFocus()
          this.handleCompanyContractOperatorFocus()
          this.handleCompanyContractPrimaryFocus()
          this.handleCompanyContractSecondFocus()
          this.handleContractOperatorAgentFocus()
        this.addForm.contractCreateUser = data.contractCreateUser
        this.addForm.payableAmount = data.payableAmount
        let newResult = []
        let companyA = ''
        let companyB = ''
        // this.agentSelectA = []
        this.addForm.companyOperator = undefined
          if(this.addForm.contractACompanyCode && this.addForm.contractBCompanyCode) {
            if(this.addForm.contractCreate == 1) {
                companyA = this.addForm.companyAName
                companyB = this.addForm.contractACompanyCode
              } else {
                companyA = this.addForm.companyBName
                companyB = this.addForm.contractBCompanyCode
              }
                await getUserRole(1, companyA, companyB).then(res => {
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
                if(this.addForm.contractCreate == 2) {
                    await getUserRole(1, this.addForm.companyAName, this.addForm.contractACompanyCode).then(res => {
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
           

           await getUserRole(2, companyA, companyB).then(res => {
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
                console.log(newResult)
              }
            })

           await getUserRole(3, companyA, companyB).then(res => {
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
          this.reviewSelect3 = newResult
          
           this.addForm.contractPrimaryReviewer = data.contractPrimaryReviewer ? String(data.contractPrimaryReviewer) : undefined
           this.$set(this.addForm, 'companyContractPrimaryReviewer', undefined)
          this.addForm.contractSecondaryReviewer = data.contractSecondaryReviewer ? String(data.contractSecondaryReviewer) : undefined
          this.addForm.companyOperator = data.companyOperator ? String(data.companyOperator) : undefined
          
          this.addForm.companyContractPrimaryReviewer = data.companyContractPrimaryReviewer ? String(data.companyContractPrimaryReviewer) : undefined      
          
          this.addForm.companyContractSecondaryReviewer = data.companyContractSecondaryReviewer ? String(data.companyContractSecondaryReviewer) : undefined

          this.payerNameSelect && this.payerNameSelect.map(v => {
            if(reqObj.payerName == v.name) {
              reqObj.payerName = v.value
            }
          })
          this.peasantNameSelect && this.peasantNameSelect.map(v1 => {
            if(reqObj.peasantWorkerPayerName == v1.name) {
              reqObj.peasantWorkerPayerName = v1.value
            }
          })

          this.payeeNameSelect && this.payeeNameSelect.map(v2 => {
            if(reqObj.payeeName == v2.name) {
              reqObj.payeeName = v2.value
            }
          })

          this.peasantPayeeNameSelect && this.peasantPayeeNameSelect.map(v3 => {
            if(reqObj.peasantWorkerPayeeName == v3.name) {
              reqObj.peasantWorkerPayeeName = v3.value
            }
          })  
          
        let file = data.contractFile && data.contractFile.substr(0, data.contractFile.length - 1).split(',')
          file && file.map((item, index) => {
              let files = {}
              files.uid = String(index)
              files.name = item.split('#')[0]
              files.url = item.split('#')[1]
              files.status = 'done'
              files.response = { 'status':'done', data: files.url }
              this.addForm.fileUrlList.push(files)
          })

          let supFile = data.contractSupFile && data.contractSupFile.substr(0, data.contractSupFile.length - 1).split(',')
          supFile && supFile.map((item, index) => {
              let files = {}
              files.uid = String(index)
              files.name = item.split('#')[0]
              files.url = item.split('#')[1]
              files.status = 'done'
              files.response = { 'status':'done', data: files.url }
              this.addForm.fileSupplementUrlList.push(files)
          })

          this.addForm.companyContractDetailOperator = data.companyOperator ? String(data.companyOperator) : undefined
        
          this.$forceUpdate()
          
          
        }
      })
    },
    handleSettleClick(row) {
      console.log(row.contractCode)
      this.isSettleVisible = true
      getPayDetailDesc(row.contractCode).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.settleList = res.data.list
          this.totalAmount = res.data.totalAmount
          this.totalSettlAmount = res.data.totalSettlAmount
        }
      })

    },
    handleHistoryClick() {

    },
    handleSettleConfirmClick() {
      this.isSettleVisible = false
    },
    handleConfirmClick() {
      this.isDetailVisible = false
    },
    handleContractOperatorFocus() {
      this.getUserRoleList(1, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleContractOperatorAgentFocus() {
      console.log(this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
      this.getUserRoleList(1, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleContractPrimaryFocus() {
      this.getUserRoleList(2, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleContractSecondFocus() {
      this.getUserRoleList(3, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleCompanyContractOperatorFocus() {
      console.log(this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
      this.getUserRoleList(1, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleCompanyContractPrimaryFocus() {
      this.getUserRoleList(2, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleCompanyContractSecondFocus() {
      this.getUserRoleList(3, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
    },
    handleChangeFile(info) {
      const status = info.file.status;
      if (status !== "uploading") {
          if (status == "removed") {
              const index = this.addForm.fileUrlList.indexOf(info.file)  
              const newFileList = this.addForm.fileUrlList.slice()  
              newFileList.splice(index, 1)  
              this.addForm.fileUrlList = newFileList
          } else {
              this.addForm.fileUrlList = info.fileList
          }
      } else {
        this.addForm.fileUrlList = info.fileList
      }
    },
    beforeImgUpload(file) {
      const isLt400M = file.size / 1024 / 1024 <= 400
      if (!isLt400M) {
        this.$message.error('上传文件大小不能超过 400MB!')
        return false
      }
    },
    handleSupplementChangeFile(info) {
      const status = info.file.status;
      if (status !== "uploading") {
          if (status == "removed") {
              const index = this.addForm.fileSupplementUrlList.indexOf(info.file)  
              const newFileList = this.addForm.fileSupplementUrlList.slice()  
              newFileList.splice(index, 1)  
              this.addForm.fileSupplementUrlList = newFileList
          } else {
              this.addForm.fileSupplementUrlList = info.fileList
          }
      } else {
        this.addForm.fileSupplementUrlList = info.fileList
      }
    },
    beforeSupplementImgUpload(file) {
      const isLt400M = file.size / 1024 / 1024 <= 400
      if (!isLt400M) {
        this.$message.error('上传文件大小不能超过 400MB!')
        return false
      }
    },
    handleDownloadClick() {
      console.log(this.cacheFile.split('#')[1].split(',')[0])
      // getDownloadFile({ fileId: this.cacheFile }).then(res => {
      //   console.log(res)
      // })

    },
    handleSSSChange(val) {
      this.addForm.companyContractPrimaryReviewer = val
      console.log(this.addForm.companyContractPrimaryReviewer)
      this.$forceUpdate()
    },
    handleBlur(e) {
      console.log(e.target.value)
      if(e.target.value && this.addForm.contractACompanyCode) {
        this.getUserRoleList(1, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
        this.getUserRoleList(2, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
        this.getUserRoleList(3, this.addForm.contractACompanyCode, this.addForm.contractBCompanyCode)
      }
    },
    handlePayerNameFocus() {
      this.companyASelect && this.companyASelect.map(v => {
        if(this.addForm.companyAName == v.value) {
          this.addForm.companyAName = v.name
        }
      })
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
      this.companyBSelect && this.companyBSelect.map(v => {
        if(this.addForm.companyBName == v.value) {
          this.addForm.companyBName = v.name
        }
      })
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
      display: flex;
      flex-direction: column;
    }
  }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
</style>