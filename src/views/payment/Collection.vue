<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="任务名称">
                <a-input v-model="queryParam.taskName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属支付类型">
                <a-select v-model="queryParam.belongPaymentScene" placeholder="请选择" >
                  <a-select-option v-for="item of paymentSceneSelect" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所属合同名称">
                    <a-input v-model="queryParam.belongContractCode" placeholder="请输入"/>
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
        <a-button type="primary" icon="plus" size="small" class="add" @click="handleAddClick">新建</a-button>
      </div>

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
        <template slot="status" slot-scope="text, record">
          <span>{{ record.status == 1 ? '待审批' : record.status == 2 ? '审批中' : record.status == 3 ? '已生效' : '' }}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">查看</a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="isAddVisible" class="addModal" title="支付信息补录" ok-text="确认" cancel-text="取消" @ok="handleSubmitModalClick" @cancel="handleCancelClick">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :rules="rules"
        :label-col="{ span: 8 }" 
        :wrapper-col="{ span: 12 }"
      >
        <div class="modal-title">
            <span>基本信息</span>
        </div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="支付类型" prop="belongPaymentScene">
              <a-select v-model="addForm.belongPaymentScene" placeholder="请选择" @change="handlePaymentSceneChange">
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
                v-model="addForm.taskName"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="所属合同名称" prop="belongContractCode">
              <a-select v-model="addForm.belongContractCode" placeholder="请选择" @change="handleContractCodeChange">
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
                v-model="addForm.prjName"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="所属合同编号">
              <span>{{ cacheContractNumber }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="" v-if="addForm.belongPaymentScene != '4'">
          <div class="modal-title">
            <span>付款方信息</span>
          </div>
          <a-row :gutter="24">
              <a-col :span="12">
              <a-form-model-item label="付款方银行账号">
                <a-input 
                  type="text" 
                  v-model="addForm.payerAcc"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="付款银行账号户名">
                <a-input 
                  type="text" 
                  v-model="addForm.payerName"
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
                      v-model="addForm.payerOpenBank"
                      disabled
                  />
                  </a-form-model-item>
              </a-col>
              <a-col :span="12">
                  <a-form-model-item label="付款方联行行号">
                  <a-input 
                      type="text" 
                      v-model="addForm.payerOpenBankNo"
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
                  v-model="addForm.payeeAcc"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="收款银行账号户名">
                <a-input 
                  type="text" 
                  v-model="addForm.payeeName"
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
                      v-model="addForm.payeeOpenBank"
                      disabled
                  />
                  </a-form-model-item>
              </a-col>
              <a-col :span="12">
                  <a-form-model-item label="收款方联行行号">
                  <a-input 
                      type="text" 
                      v-model="addForm.payeeOpenBankNo"
                      disabled
                  />
                  </a-form-model-item>
              </a-col>
          </a-row>
        </div>
        <div class="" v-else>
          <div class="modal-title">
            <span>付款账号信息</span>
          </div>
          <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item label="银行账号">
                  <a-input 
                    type="text" 
                    v-model="addForm.payerAcc"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
              <a-form-model-item label="银行账号户名">
                <a-input 
                  type="text" 
                  v-model="addForm.payerName"
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
                      v-model="addForm.payerOpenBank"
                      disabled
                  />
                  </a-form-model-item>
              </a-col>
              <a-col :span="12">
                  <a-form-model-item label="联行行号">
                  <a-input 
                      type="text" 
                      v-model="addForm.payerOpenBankNo"
                      disabled
                  />
                  </a-form-model-item>
              </a-col>
          </a-row>
        </div>
        <div class="modal-title">
            <span>交易信息</span>
        </div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="已支付金额（元）">
              <a-input 
                  type="number"  
                  v-model="addForm.contractPaidAmount"
                  disabled
                />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item label="已结算金额（元）">
              <a-input 
                  type="number"  
                  v-model="addForm.contractSettlAmount"
                  disabled
                />
            </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="本次支付金额（元）" prop="transactionAmount">
              <a-input 
                  type="number"  
                  v-model="addForm.transactionAmount"
                  placeholder="请输入"
                />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item label="本次结算金额（元）">
              <a-input 
                  type="number"  
                  v-model="addForm.currentSettlementAmount"
                  placeholder="请输入"
                />
            </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="支付方式" prop="paymentMethod">
              <a-select v-model="addForm.paymentMethod" placeholder="请选择" @change="handlePaymentMethodChange">
                <a-select-option v-for="item of paymentMethodSelect" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
                        <a-form-model-item label="支付日期" prop="payDate">
                            <a-date-picker
                                v-model="addForm.payDate"
                                type="date"
                                placeholder="请选择支付日期"
                                style="width: 100%;"
                                format="YYYY-MM-DD"
                            />
                        </a-form-model-item>
                    </a-col>
        </a-row>
        <a-row :gutter="24">
          <!-- <a-col :span="12">
            <a-form-model-item label="所属结算批次">
              <span v-if="isSettleSelect">{{ cacheSettle }}</span>
              <a-button type="link" @click="handleSettleClick">选择</a-button>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12" v-if="cacheValue === '4'">
                <a-form-model-item label="工资单月份" prop="salaryMonth">
                    <a-month-picker
                        v-model="addForm.salaryMonth"
                        type="date"
                        placeholder="请选择月份"
                        style="width: 100%;"
                        format="YYYY-MM"
                    />
                </a-form-model-item>
            </a-col>
        </a-row>
        <div class="modal-title">
            <span>支付要件及付款成功凭证</span>
        </div>
        <a-row :gutter="24" v-if="cacheValue != '4'">
          <a-col :span="24" class="upload-wrapper-item" >
            <a-form-model-item class="upload-wrapper" label="请上传与本次支付相关的发票及银行回单" prop="fileUrlList">
              <a-upload
                :action="`${$fileUrl}/files`"
                @change="handleChangeFile"
                :before-upload="beforeImgUpload"
                :default-file-list="addForm.fileUrlList"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
              >
                <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div v-else>
          <a-row :gutter="24">
            <a-col :span="24" class="upload-wrapper-item">
              <a-form-model-item class="upload-wrapper" label="请上传对应成功支付的工资单" prop="fileUrlList">
                <a-upload
                  :action="`${$fileUrl}/salaryFiles`"
                  @change="handleChangeFile"
                  :before-upload="beforeImgUpload"
                  :default-file-list="addForm.fileUrlList"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                >
                  <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                </a-upload>
                
              </a-form-model-item>
              <a class="download-wrapper" style="z-index: 1; margin-left:30px; margin-top: 10px; height: 20px" @click="$newExportsExcel(`${$fileUrl}/model/downloadModel/1`, '批量代付模板', false)">批量代付模板下载</a>
            </a-col>
          </a-row>
          <div style="margin-left:330px; margin-bottom: 10px">请下载模板并按照模板填写工资单上传</div>
          <a-row :gutter="24">
            <a-col :span="24" class="upload-wrapper-item">
              <a-form-model-item class="upload-wrapper" label="请上传对应成功支付的回执单" prop="fileReceiptUrlList">
                <a-upload
                  :action="`${$fileUrl}/files`"
                  @change="handleReceiptChangeFile"
                  :before-upload="beforeReceiptImgUpload"
                  :default-file-list="addForm.fileReceiptUrlList"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
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
                <a-checkbox v-model="payChannel" @change="handlePayChannelChange">
                  已在其他渠道付款成功
                </a-checkbox>
              </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal v-model="isDetailVisible" class="addModal" title="详情" :footer="null">
        <div class="modal-title">
            <span>基本信息</span>
        </div>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>支付类型：</span>
            <span>{{ detailObj.belongPaymentSceneName }}</span>
          </a-col>
          <a-col :span="12">
            <span>任务名称：</span>
            <span>{{ detailObj.taskName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>所属合同名称：</span>
            <span>{{ detailObj.contractName }}</span>
          </a-col>
          <a-col :span="12">
            <span>所属项目名称：</span>
            <span>{{ detailObj.prjName }}</span>
          </a-col>
        </a-row>

        <div v-if="detailObj.belongPaymentScene != '4'">
          <div class="modal-title">
            <span>付款方信息</span>
          </div>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
              <span>付款方银行账号：</span>
              <span>{{ detailObj.payerAcc }}</span>
            </a-col>
            <a-col :span="12">
              <span>付款银行账号户名：</span>
              <span>{{ detailObj.payerName }}</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
                  <span>付款方开户行：</span>
              <span>{{ detailObj.payerOpenBank }}</span>
              </a-col>
              <a-col :span="12">
                  <span>付款方联行行号：</span>
              <span>{{ detailObj.payerOpenBankNo }}</span>
              </a-col>
          </a-row>
          <div class="modal-title">
            <span>收款方信息</span>
          </div>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
              <span>收款方银行账号：</span>
              <span>{{ detailObj.payeeAcc }}</span>
            </a-col>
            <a-col :span="12">
              <span>收款银行账号户名：</span>
              <span>{{ detailObj.payeeName }}</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
                  <span>收款方开户行：</span>
              <span>{{ detailObj.payeeOpenBank }}</span>
              </a-col>
              <a-col :span="12">
                  <span>收款方联行行号：</span>
              <span>{{ detailObj.payeeOpenBankNo }}</span>
              </a-col>
          </a-row>
        </div>
        <div v-else>
          <div class="modal-title">
            <span>付款账号信息</span>
          </div>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
              <span>银行账号：</span>
              <span>{{ detailObj.payerAcc }}</span>
            </a-col>
            <a-col :span="12">
              <span>银行账号户名：</span>
              <span>{{ detailObj.payerName }}</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="modal-row">
              <a-col :span="12">
                  <span>开户行：</span>
              <span>{{ detailObj.payerOpenBank }}</span>
              </a-col>
              <a-col :span="12">
                  <span>联行行号：</span>
              <span>{{ detailObj.payerOpenBankNo }}</span>
              </a-col>
          </a-row>
        </div>
        <div class="modal-title">
            <span>交易信息</span>
        </div>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>已支付金额（元）：</span>
            <span>{{ detailObj.contractPaidAmount }}</span>
          </a-col>
          <!-- <a-col :span="12">
            <span>已结算金额（元）：</span>
            <span>{{ detailObj.contractSettlAmount }}</span>
          </a-col> -->
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>本次支付金额（元）：</span>
            <span>{{ detailObj.transactionAmount }}</span>
          </a-col>
          <!-- <a-col :span="12">
            <span>本次结算金额（元）:</span>
            <span>{{ detailObj.currentSettlementAmount }}</span>
          </a-col> -->
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>支付方式：</span>
            <span>{{ detailObj.paymentMethod == 1 ? '现金' : '非现金（承兑汇票、数字凭证等）' }}</span>
          </a-col>
          <a-col :span="12">
            <span>支付日期：</span>
            <span>{{ detailObj.payDate }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <!-- <a-col :span="12">
            <span>所属结算批次：</span>
            <span>{{ detailObj.settlementBatchName }}</span>
          </a-col> -->
           <a-col :span="12">
            <span>工资单月份：</span>
            <span>{{ detailObj.salaryMonth ? detailObj.salaryMonth: '' }}</span>
          </a-col>
        </a-row>
        <div class="modal-title">
            <span>支付要件及付款成功凭证</span>
        </div>
        <a-row :gutter="24" class="modal-row" v-if="detailObj.belongPaymentSceneName != '工资款'">
          <a-col :span="12">
            <span>请上传与本次支付相关的发票及银行回单：</span>
            <div class="upload-span">
              <span v-for="(item, index) of detailObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
            </div>
          </a-col>
        </a-row>
        <div v-else>
          <a-row :gutter="24" style="margin-top: 20px; ">
            <a-col :span="24" style="display: flex; flex-direction: row">
              <span>请上传对应成功支付的工资单：</span>
              <div class="upload-span" style="padding-left: 20px;display: flex; flex-direction: column;">
                <span v-for="(item, index) of detailObj.paymentFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter='24' style="margin-top: 20px;">
            <a-col :span="24" style="display: flex; flex-direction: row;">
              <span>请上传对应成功支付的回执单：</span>
              <div class="upload-span" style="padding-left: 20px;display: flex; flex-direction: column;">
                <span v-for="(item, index) of detailObj.otherFile" :key="index">{{ item.name }} <a style="margin-left: 10px;" @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.url}&flag=true`)">下载</a></span>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="24">
            <div style="width: 100%; text-align:center;">
                <a-checkbox v-model="detailObj.paymentFlag" @change="handlePayChannelChange" disabled>
                  已在其他渠道付款成功
                </a-checkbox>
              </div>
          </a-col>
        </a-row>
        <div class="footer-wrapper">
          <a-button type="primary" @click="handleDetailSubmitClick">确定</a-button>
        </div>
    </a-modal>


    <a-modal v-model="isSettleVisible" class="addModal" title="结算批次" :footer="null">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="批次名称">
              <a-input v-model="searchParam.batchName" placeholder="请输入" style="width: 150px;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建企业">
              <a-input v-model="searchParam.companyName" placeholder="请输入" style="width: 150px;"/>
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
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { 
  getPayCollectionList, 
  getPaymentScene, 
  getContractName, 
  getTaskName,
  getReceive,
  addCollection,
  getCollentDetail,
  updateServer
} from '@/api/payment'
// import { STable, Ellipsis } from '@/components'
// import { getQuotaList } from '@/api/level1'
// import { dataSourceBank } from '@/utils/util'
import { fileUrl } from '@/utils/request'
import { getSettleList, } from '@/api/payment'

const columns = [
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
    title: '所属支付类型',
    dataIndex: 'belongPaymentSceneName',
    key: 'belongPaymentSceneName',
    width: '300px'
  },
  {
    title: '所属合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: '400px'
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
    width: '200px'
  },
  {
    title: '补录状态',
    dataIndex: 'status',
    key: 'status',
    width: '120px',
    scopedSlots: { customRender: 'status' },
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '120px',
    fixed: 'right',
    align: 'center'
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
        taskName: '',
        belongPaymentScene: undefined,
        belongContractCode: ''
      },
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
      isAddVisible: false,
      addForm: {
        belongPaymentScene: undefined,
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
        belongContractCode: undefined,
        transactionAmount: '',
        currentSettlementAmount: '',
        fileUrlList: [],
        contractSettlAmount: '',
        contractPaidAmount: '',
        payDate: '',
        salaryMonth: '',
        fileReceiptUrlList: []
      },
      rules: {
        belongPaymentScene: [{ required: true, message: '请输入选择支付方式', trigger: 'change' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        belongContractCode: [{ required: true, message: '请选择所属合同名称', trigger: 'change' }],
        transactionAmount: [{ required: true, message: '请输入本次支付金额', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '请输入选择支付方式', trigger: 'change' }],
        payDate: [{ required: true, message: '请选择支付日期', trigger: 'change' }],
        salaryMonth: [{ required: true, message: '请选择工资单月份', trigger: 'change' }],
        fileUrlList: [{ required: true, message: '请上传', trigger: 'change' }],
        fileReceiptUrlList: [{ required: true, message: '请上传', trigger: 'change' }]
      },
      paymentSceneSelect: [],
      contractNameSelect: [],
      contractObj: {},
      addContractObj: {},
      paymentFlag: null,
      payChannel: false,
      isDetailVisible: false,
      detailObj: {},
      isAddBtnShow: null,
      fileUrl,
      paymentTypeSelect: [
        {
          value: "1",
          name: '预付款'
        },
        {
          value: "2",
          name: '工程款'
        },
        {
          value: "3",
          name: '材料款'
        },
        {
          value: "4",
          name: '工资款'
        }
      ],
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
      isSettleVisible: false,
      searchParam: {
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
      isSettleSelect: false,
      cacheSettle: '',
      cacheDetailObj: {},
      cacheContractNumber: ''
    }
  },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    this.getPaymentSceneList()
    this.getContractNameList()
    this.getSettleInfo()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let resObj = {
        taskName: this.queryParam.taskName,
        belongPaymentScene: this.queryParam.belongPaymentScene ? Number(this.queryParam.belongPaymentScene) : 0,
        belongContractCode: this.queryParam.belongContractCode,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        projectIDLv3: localStorage.getItem('projectIDLv3')
      }
      getPayCollectionList(resObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
      })
    },
    getPaymentSceneList() {
      getPaymentScene().then(res => {
        this.paymentSceneSelect = res
      })
    },
    getContractNameList() {
      let params = {
          projectIDLv3: localStorage.getItem('projectIDLv3')
      }
      getContractName(params).then(res => {
        this.contractNameSelect = res
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
    handleAddClick() {
      this.isAddVisible = true
      this.isSettleSelect = false
      this.cacheSettle = ''
      this.selectionRows = []
      this.selectedRowKeys = []
      this.cacheContractNumber = ''
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
          let reqObj = Object.assign({}, this.addForm)
          delete reqObj.prjName
          delete reqObj.payerAcc
          delete reqObj.payerName
          delete reqObj.payerOpenBank
          delete reqObj.payerOpenBankNo
          delete reqObj.payeeAcc
          delete reqObj.payeeName
          delete reqObj.payeeOpenBank
          delete reqObj.payeeOpenBankNo
          let resultFile = ''
          reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                resultFile += v.name + '#' + v.response.data + ','
            })
          reqObj.paymentFile = resultFile
          let receiptFile = ''
          reqObj.fileReceiptUrlList && reqObj.fileReceiptUrlList.map(v => {
              receiptFile += v.name + '#' + v.response.data + ','
          })
          reqObj.otherFile = receiptFile
          delete reqObj.fileUrlList
          delete reqObj.fileReceiptUrlList
          reqObj.paymentFlag = this.paymentFlag == true ? 1 : 0
          reqObj.belongPaymentScene = Number(reqObj.belongPaymentScene)
          reqObj.currentSettlementAmount = Number(reqObj.currentSettlementAmount)
          reqObj.transactionAmount = Number(reqObj.transactionAmount)
          reqObj.settlementBatchId = this.selectionRows.length > 0 ? this.selectionRows[0].id : ''
          reqObj.settlementBatchName = this.selectionRows.length > 0 ? this.selectionRows[0].companyName : ''
          reqObj.payDate = moment(reqObj.payDate).format('YYYY-MM-DD')
          reqObj.salaryMonth = moment(reqObj.salaryMonth).format('YYYY-MM')
          reqObj.projectIDLv3 = localStorage.getItem('projectIDLv3')
          addCollection(reqObj).then(res => {
            if(res.status == 1) {
              this.isAddVisible = false
              this.$message.success(res.data)
              this.getQuotaApplyList()
              this.addForm = {}
              // window.location.reload()
            }
          })
        } else {
          return false
        }
      })
    },
    handleCancelClick() {
      this.isAddVisible = false
      this.addForm.belongPaymentScene = '',
      this.addForm.taskName = '',
      this.addForm.prjName = '',
      this.addForm.payerAcc = '',
      this.addForm.payerName = '',
      this.addForm.payerOpenBank = '',
      this.addForm.payerOpenBankNo = '',
      this.addForm.payeeAcc = '',
      this.addForm.payeeName = '',
      this.addForm.payeeOpenBank = '',
      this.addForm.payeeOpenBankNo = '',
      this.addForm.belongContractCode = '',
      this.addForm.transactionAmount = ''
    },
    handleReviewClick(row) {
      this.isDetailVisible = true
      getCollentDetail(row.id).then(res => {
        if(res.status == 1) {
          this.detailObj = res.data
          if(this.detailObj.belongPaymentScene == '4') {
            this.detailObj.payeeAcc = res.data.peasantWorkerPayeeAcc
            this.detailObj.payeeName = res.data.peasantWorkerPayeeName
            this.detailObj.payeeOpenBank = res.data.peasantWorkerPayeeOpenBank
            this.detailObj.payeeOpenBankNo = res.data.peasantWorkerPayeeOpenBankNo
            if(res.data.peasantWorkerPayerAcc) {
              this.detailObj.payerAcc = res.data.peasantWorkerPayerAcc
              this.detailObj.payerName = res.data.peasantWorkerPayerName
              this.detailObj.payerOpenBank = res.data.peasantWorkerPayerOpenBank
              this.detailObj.payerOpenBankNo = res.data.peasantWorkerPayerOpenBankNo
            } else {
              this.detailObj.payerAcc = res.data.payerAcc
              this.detailObj.payerName = res.data.payerName
              this.detailObj.payerOpenBank = res.data.payerOpenBank
              this.detailObj.payerOpenBankNo = res.data.payerOpenBankNo
            }
          } else {
            this.detailObj.payeeAcc = res.data.payeeAcc
            this.detailObj.payeeName = res.data.payeeName
            this.detailObj.payeeOpenBank = res.data.payeeOpenBank
            this.detailObj.payeeOpenBankNo = res.data.payeeOpenBankNo
            this.detailObj.payerAcc = res.data.payerAcc
            this.detailObj.payerName = res.data.payerName
            this.detailObj.payerOpenBank = res.data.payerOpenBank
            this.detailObj.payerOpenBankNo = res.data.payerOpenBankNo
          }
          
          this.detailObj.paymentFlag = res.data.paymentFlag == 0 ? false : true
          // let newStr = this.detailObj.paymentFile.substring(0, this.detailObj.paymentFile.length - 1).split(',')
          // let uploadArr = []
          // newStr && newStr.map(res => {
          //   let num = res.lastIndexOf('\#')
          //   res = res.substring(0, num)
          //   // res = res.split('#')[0]
          //   uploadArr.push(res)
          // })
          // this.detailObj.paymentFile = uploadArr
          let newSalaryStr = this.detailObj.paymentFile && this.detailObj.paymentFile.substring(0, this.detailObj.paymentFile.length - 1).split(',')
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
          this.detailObj.paymentFile = uploadSalaryArr
          let newReceiptStr = this.detailObj.otherFile && this.detailObj.otherFile.substring(0, this.detailObj.otherFile.length - 1).split(',')
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
          this.detailObj.otherFile = uploadReceiptArr
        }
      })
    },
    handleEditClick(row) {
      this.isAddVisible = true
    },
    // 根据支付场景的改变获取任务名称
    handlePaymentSceneChange(value) {
      console.log(value)
      this.cacheValue = value
      if(this.cacheDetailObj) {
        if(value != '4') {
          this.addForm.payeeAcc = this.cacheDetailObj.payeeAcc
          this.addForm.payeeName = this.cacheDetailObj.payeeName
          this.addForm.payeeOpenBank = this.cacheDetailObj.payeeOpenBank
          this.addForm.payeeOpenBankNo = this.cacheDetailObj.payeeOpenBankNo
          this.addForm.payerAcc = this.cacheDetailObj.payerAcc
          this.addForm.payerName = this.cacheDetailObj.payerName
          this.addForm.payerOpenBank = this.cacheDetailObj.payerOpenBank
          this.addForm.payerOpenBankNo = this.cacheDetailObj.payerOpenBankNo
        } else {
          if(this.cacheDetailObj.peasantWorkerPayerAcc) {
            this.addForm.payerAcc = this.cacheDetailObj.peasantWorkerPayerAcc
            this.addForm.payerName = this.cacheDetailObj.peasantWorkerPayerName
            this.addForm.payerOpenBank = this.cacheDetailObj.peasantWorkerPayerOpenBank
            this.addForm.payerOpenBankNo = this.cacheDetailObj.peasantWorkerPayerOpenBankNo
          } else {
            this.addForm.payerAcc = this.cacheDetailObj.peasantWorkerPayeeAcc
            this.addForm.payerName = this.cacheDetailObj.peasantWorkerPayeeName
            this.addForm.payerOpenBank = this.cacheDetailObj.peasantWorkerPayeeOpenBank
            this.addForm.payerOpenBankNo = this.cacheDetailObj.peasantWorkerPayeeOpenBankNo
          }
          
        }
      }
      getTaskName(value).then(res => {
        if(res.status == 1) {
          console.log(res)
          this.addForm.taskName = res.data
        }
      })
    },
    handlePaymentMethodChange(value) {

    },
    handleContractCodeChange(value) {
      let reqObj = {
        contractCode: value
      }
      if(this.contractNameSelect && this.contractNameSelect.length > 0) {
        this.contractNameSelect.map(v => {
          if(v.value == value) {
            this.cacheContractNumber = v.value
          }
        })
      }
      getReceive(reqObj).then(res => {
        console.log(res)
        if(res.status == 1) {
          const data = res.data
          this.cacheDetailObj = data
          this.addForm.prjName = data.prjName
          this.addForm.contractPaidAmount = data.contractPaidAmount
          this.addForm.contractSettlAmount = data.contractSettlAmount
          if(this.addForm.belongPaymentScene == '4') {
            this.addForm.payeeAcc = data.peasantWorkerPayeeAcc
            this.addForm.payeeName = data.peasantWorkerPayeeName
            this.addForm.payeeOpenBank = data.peasantWorkerPayeeOpenBank
            this.addForm.payeeOpenBankNo = data.peasantWorkerPayeeOpenBankNo
            if(data.peasantWorkerPayerAcc) {
              this.addForm.payerAcc = data.peasantWorkerPayerAcc
              this.addForm.payerName = data.peasantWorkerPayerName
              this.addForm.payerOpenBank = data.peasantWorkerPayerOpenBank
              this.addForm.payerOpenBankNo = data.peasantWorkerPayerOpenBankNo
            } else {
              this.addForm.payerAcc = data.payerAcc
              this.addForm.payerName = data.payerName
              this.addForm.payerOpenBank = data.payerOpenBank
              this.addForm.payerOpenBankNo = data.payerOpenBankNo
            }
          } else {
            this.addForm.payeeAcc = data.payeeAcc
            this.addForm.payeeName = data.payeeName
            this.addForm.payeeOpenBank = data.payeeOpenBank
            this.addForm.payeeOpenBankNo = data.payeeOpenBankNo
            this.addForm.payerAcc = data.payerAcc
            this.addForm.payerName = data.payerName
            this.addForm.payerOpenBank = data.payerOpenBank
            this.addForm.payerOpenBankNo = data.payerOpenBankNo
          }
          
          
        }
      })
    },
    handleDateChange() {

    },
    handleDetailSubmitClick() {
      this.isDetailVisible = false
    },
    handlePayChannelChange(e) {
      console.log(e.target.checked)
      if(e.target.checked) {
        this.paymentFlag = 1
      } else {
        this.paymentFlag = 0
      }
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
    handleReceiptChangeFile(info) {
      const status = info.file.status;
      if (status !== "uploading") {
          if (status == "removed") {
              const index = this.addForm.fileReceiptUrlList.indexOf(info.file)  
              const newFileList = this.addForm.fileReceiptUrlList.slice()  
              newFileList.splice(index, 1)  
                this.addForm.fileReceiptUrlList = newFileList
          } else {
              this.addForm.fileReceiptUrlList = info.fileList
          }
      } else {
        this.addForm.fileReceiptUrlList = info.fileList
      }
    },
    beforeReceiptImgUpload(file) {
      const isLt400M = file.size / 1024 / 1024 <= 400
      if (!isLt400M) {
        this.$message.error('上传文件大小不能超过 400MB!')
        return false
      }
    },
    handleDownloadClick() {

    },
    handleUploadServerClick() {
      console.log(this.addForm.fileUrlList)
      let reqObj = {
        files: this.addForm.fileUrlList
      }
      updateServer($fileUrl, reqObj).then(res => {
        console.log(res)
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
.table-page-search-wrapper{
    .add{
        height: 32px;
        width: 80px;
        margin-bottom: 20px;
    }
    .ant-form-inline .ant-form-item > .ant-form-item-label{
        width: 120px;
    }
}
.addModal{
  .ant-modal-content{
    width: 900px;
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
  }
  .modal-title{
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 10px;
      span{
          margin-left: 15px;
          font-size: 16px;
          font-weight: 600;
      }
  }
  .modal-title::before{
      position: absolute;
      content: '';
      width: 6px;
      height: 20px;
      background: #508EDF;
  }
  .upload-wrapper-item{
    display: flex;
    flex-direction: row;
    position: relative;
    .upload-wrapper{
      display: flex;
      flex-direction: row;
        .ant-form-item-label{
          width: 320px!important;
        }
    }
    .upload-server{
      position: absolute;
      right: 125px;
      top: 43px;
      background: #7EBF56;
      color: #FFFFFF;
    }
    .upload-server{
      background: #7EBF56;
      border: 1px solid #7EBF56;
    }
  }
  .modal-row{
    span{
      line-height: 60px;
      margin-left: 10px;
    }
    .upload-span{
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        span{
          line-height: 30px;
        }
        .download{
          color: #508EDF;
          cursor: pointer;
          margin-left: 10px;
        }
      }
  }
  .footer-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
</style>