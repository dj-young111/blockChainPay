<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-fund-wrapper" style="margin-bottom: 20px;">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="企业名称">
                <a-input v-model="queryParam.companyName" placeholder="请输入" style="width: 300px;"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleCompanySearchClick">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-page-search-wrapper">
        <a-button type="primary" icon="plus" size="small" class="add" v-if="isAddBtnShow" @click="handleAddClick">新建</a-button>
      </div>

      <a-table
        :rowKey="((record, index) => {return index})"
        :columns="columns"
        :data-source="loadData"
        :pagination="pagination"
        :scroll="{ y: 600 }"
        :loading="loading"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <span slot="companyRole" slot-scope="text, record">
          {{ record.companyRole ? setCompanyTypeName(record.companyRole) : '' }}
        </span>
        <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">查看</a-button>
          <a-button type="link" :disabled="!scope.editFlag" @click="handleEditClick(scope)">编辑</a-button>
          <a-button type="link" @click="handleRelatedClick(scope)">关联项目</a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 企业基本信息form  -->
    <a-modal v-model="isAddVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :rules="rules"
        :label-col="{ span: 8 }" 
        :wrapper-col="{ span: 12 }"
      >
      <div class="modal-wrapper">
        <div class="title">
          <span>企业基本信息</span>
        </div>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="企业名称" prop="companyName">
              <a-input 
                type="text"  
                v-model="addForm.companyName"
                placeholder="请输入企业名称"
                :disabled="isEditShow"
              />
              
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="统一社会信用代码" prop="unifiedCreditCode">
              <a-input 
                type="text" 
                v-model="addForm.unifiedCreditCode"
                placeholder="请输入统一社会信用代码"
                :disabled="isEditShow"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="企业角色" prop="companyRole">
              <a-select v-model="addForm.companyRole" placeholder="请选择企业角色">
                <a-select-option v-for="item of projectType" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="注册地址" prop="registeredOffice">
              <a-input v-model="addForm.registeredOffice" placeholder="请输入注册地址"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="企业联系人" prop="enterpriseContacts">
              <a-input v-model="addForm.enterpriseContacts" placeholder="请输入企业联系人"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人电话" prop="enterpriseContactNumber">
              <a-input v-model="addForm.enterpriseContactNumber" :disabled="isDisabled" placeholder="请输入联系人电话"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="所属项目" prop="relationPrj">
              <a-select
                v-model="addForm.relationPrj"
                mode="multiple"
                style="width: 100%"
                placeholder="请选择所属项目"
                :options="relationPrjSelect"
                @change="handleRelationPrjChange"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row> -->



        <!-- <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="营业执照" prop="fileUrlList">
              <a-upload 
                :action="`${$fileUrl}/files`"
                @change="handleChangeFile"
                :before-upload="beforeImgUpload"
                :file-list="addForm.fileUrlList"
                :showUploadList="{
                    showRemoveIcon: true
                }"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF">
                 <a-button icon="upload" type="primary">上传</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row> -->
        <div class="footer" v-if="isCompanyBasicFooter">
          <a-button type="primary" style="margin-right:20px;" @click="handleAddCompanyInfoClick">下一步</a-button>
          <a-button @click="handleCancelCompanyInfoClick">取消</a-button>
        </div>
      </div>

      <!-- <div class="modal-wrapper" v-if="isCompanyInfo">
        <div class="title">
          <span>企业账户信息</span>
        </div>
        <a-table
          :rowKey="((record, index) => {return index})"
          :data-source="accountInfo"
          :columns="accountColumns"
          :pagination="false"
        >
          <template slot="accountType" slot-scope="text, record">
            <span>{{ setAccountName(record.accountType) }}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <a-button type="link" @click="handleAccountEditClick(scope)" :disabled="isDisabled">编辑</a-button>
            <a-button type="link" @click="handleAccountFreezeClick(scope)" :disabled="isDisabled">{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
          </template>
        </a-table>
        <a-button style="margin: 20px 0;" type="primary" @click="handleContinueAddClick" v-if="isCompanyAccountInfoFooter">继续添加</a-button>
        <div class="footer" v-if="isCompanyAccountInfoFooter">
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyAccountInfoUpClick">上一步</a-button>
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyAccountInfoDownClick">下一步</a-button>
          <a-button @click="handleCompanyAccountInfoCancelClick">取消</a-button>
        </div>
      </div> -->
        
      </a-form-model>

      <!-- <div class="modal-wrapper" v-if="isCompanyUserInfo">
        <div class="title">
          <span>企业用户信息</span>
        </div>
        <a-table
          :rowKey="((record, index) => {return index})"
          :data-source="accountUserInfo"
          :columns="accountUserColumns"
          :pagination="false"
        >
          <template slot="roleId" slot-scope="text, record">
            <span>{{ setRoleName(record.roleId) }}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <a-button type="link" @click="handleUserEditClick(scope)" :disabled="isDisabled" >编辑</a-button>
            <a-button type="link" @click="handleUserFreezeClick(scope)" :disabled="isDisabled">{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
          </template>
        </a-table>
        <a-button style="margin: 20px 0;" type="primary" @click="handleContinueAddUserClick" v-if="isCompanyUserInfoFooter">继续添加</a-button>
        <div class="footer" v-if="isCompanyUserInfoFooter">
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoUpClick">上一步</a-button>
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoDownClick">下一步</a-button>
          <a-button @click="handleCompanyUserInfoCancelClick">取消</a-button>
        </div>
      </div> -->
      <!-- <div class="modal-wrapper" v-if="isCompanyAddUserInfo">
        <a-form-model
          ref='companyUserForm'
          :model="companyUserForm"
          :rules="companyUserRules"
          :label-col="{ span: 8 }" 
          :wrapper-col="{ span: 12 }"
        >
          <div class="title">
            <span>企业用户信息</span>
          </div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="用户角色" prop="roleId">
                <a-select v-model="companyUserForm.roleId" placeholder="请选择企业角色">
                  <a-select-option v-for="item of roleList" :key="item.id" :value="item.id">
                    {{ item.roleName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="用户名称" prop="userName">
                <a-input v-model="companyUserForm.userName" placeholder="请输入用户名称"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="用户手机号" prop="phoneNo">
                <a-input v-model="companyUserForm.phoneNo" placeholder="请输入用户手机号"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="初始密码" prop="password">
                <a-input v-model="companyUserForm.password" placeholder="请输入初始密码"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="footer">
            <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoSubmitClick">确认</a-button>
            <a-button @click="handleCompanyUserInfoSubmitCancelClick">取消</a-button>
          </div>
        </a-form-model>
      </div> -->
      <!-- <div class="footer" v-if="isLastConfirm">
        <a-button type="primary" style="margin-right:20px;" @click="handleOnUpClick" v-if="!isCheck">上一步</a-button>
        <a-button type="primary" style="margin-right:20px;" @click="handleOnSubmitClick" v-if="!isCheck">创建</a-button>
        <a-button @click="handleOnCancelClick" v-if="!isCheck">取消</a-button>
        <a-button type="primary" @click="handleConfirmClick" v-if="isCheck">确定</a-button>
      </div> -->
      
    </a-modal>
    <!-- 企业账户信息列表  -->
    <a-modal v-model="isAddCompanyVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false" >
      <div class="modal-wrapper">
        <div class="title">
          <span>企业账户信息</span>
        </div>
        <a-table
          :rowKey="((record, index) => {return index})"
          :data-source="accountInfo"
          :columns="accountColumns"
          :pagination="false"
        >
          <template slot="accountType" slot-scope="text, record">
            <span>{{ setAccountName(record.accountType) }}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <a-button type="link" @click="handleAccountEditClick(scope)" :disabled="isDisabled">编辑</a-button>
            <a-button type="link" @click="handleAccountFreezeClick(scope)" :disabled="isDisabled">{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
          </template>
        </a-table>
        <a-button style="margin: 20px 0;" type="primary" @click="handleContinueAddClick">继续添加</a-button>
        <div class="footer">
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyAccountInfoUpClick">上一步</a-button>
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyAccountInfoDownClick">下一步</a-button>
          <a-button @click="handleCompanyAccountInfoCancelClick">取消</a-button>
        </div>
      </div>
    </a-modal>
    <!-- 企业账户form  -->
    <a-modal v-model="isAddCompanyAccountVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false">
      <a-form-model
        ref='companyForm'
        :model="companyAccountForm"
        :rules="companyAccountRules"
        :label-col="{ span: 8 }" 
        :wrapper-col="{ span: 12 }"
      >
        <div class="modal-wrapper">
          <div class="title">
            <span>企业账户信息</span>
          </div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="账户类型" prop="accountType">
                <a-select v-model="companyAccountForm.accountType" placeholder="请选择账户类型">
                  <a-select-option v-for="item of companyAccountType" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="账户户名" prop="accountName">
                <a-input v-model="companyAccountForm.accountName" placeholder="请输入账户名称"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="银行账号" prop="accountNum">
                <a-input v-model="companyAccountForm.accountNum" placeholder="请输入银行账号" :disabled="isEditShow"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="开户银行" prop="openBank">
                <a-input v-model="companyAccountForm.openBank" placeholder="请输入开户银行"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="开户行联行号" prop="openBankNum">
                <a-input v-model="companyAccountForm.openBankNum" placeholder="请输入开户行联行号"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          
          <div class="footer">
            <a-button type="primary" style="margin-right:20px;" @click="handleCompanyAccountInfoSubmitClick">确认</a-button>
            <a-button @click="handleCompanyAccountInfoSubmitCancelClick">取消</a-button>
          </div>
        </div>
      </a-form-model>
    </a-modal>
    <!-- 企业用户信息列表 -->
    <a-modal v-model="isAddCompanyUserAccountVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false">
      <div class="modal-wrapper">
        <div class="title">
          <span>企业用户信息</span>
        </div>
        <a-table
          :rowKey="((record, index) => {return index})"
          :data-source="accountUserInfo"
          :columns="accountUserColumns"
          :pagination="false"
        >
          <template slot="roleId" slot-scope="text, record">
            <span>{{ setRoleName(record.roleId) }}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <a-button type="link" @click="handleUserEditClick(scope)">编辑</a-button>
            <a-button type="link" @click="handleUserFreezeClick(scope)">{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
          </template>
        </a-table>
        <a-button style="margin: 20px 0;" type="primary" @click="handleContinueAddUserClick">继续添加</a-button>
        <div class="footer">
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoUpClick">上一步</a-button>
          <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoDownClick">下一步</a-button>
          <a-button @click="handleCompanyUserInfoCancelClick">取消</a-button>
        </div>
      </div>
    </a-modal>
    <!-- 企业用户form -->
    <a-modal v-model="isAddCompanyUserFormVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false">
      <div class="modal-wrapper">
        <a-form-model
          ref='companyUserForm'
          :model="companyUserForm"
          :rules="companyUserRules"
          :label-col="{ span: 8 }" 
          :wrapper-col="{ span: 12 }"
        >
          <div class="title">
            <span>企业用户信息</span>
          </div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="用户角色" prop="roleId">
                <a-select v-model="companyUserForm.roleId" placeholder="请选择企业角色">
                  <a-select-option v-for="item of roleList" :key="item.id" :value="item.id">
                    {{ item.roleName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="用户名称" prop="userName">
                <a-input v-model="companyUserForm.userName" placeholder="请输入用户名称"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="用户手机号" prop="phoneNo">
                <a-input v-model="companyUserForm.phoneNo" placeholder="请输入用户手机号" :disabled="isEditShow"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="初始密码" prop="password">
                <a-input v-model="companyUserForm.password" type="password" placeholder="请输入初始密码" :disabled="isEditShow"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="footer">
            <a-button type="primary" style="margin-right:20px;" @click="handleCompanyUserInfoSubmitClick">确认</a-button>
            <a-button @click="handleCompanyUserInfoSubmitCancelClick">取消</a-button>
          </div>
        </a-form-model>
      </div>
    </a-modal>

    <a-modal v-model="isAddCompanyDetailVisible" class="addCompanyModal" :closable="false" :footer="null" :maskClosable="false">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :label-col="{ span: 8 }" 
        :wrapper-col="{ span: 12 }"
      >
        <div class="modal-wrapper">
          <div class="title">
            <span>企业基本信息</span>
          </div>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="企业名称">
                <span>
                  {{ addForm.companyName }}
                </span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="统一社会信用代码">
                <span>
                  {{ addForm.unifiedCreditCode }}
                </span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="企业角色">
                <span>{{ setCompanyTypeName(addForm.companyRole) }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="注册地址">
                <span>{{ addForm.registeredOffice }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="企业联系人">
                <span>{{ addForm.enterpriseContacts }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人电话">
                <span>{{ addForm.enterpriseContactNumber }}</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="所属项目">
                <span>{{ isAddCompanyDetailVisible ? setRelationPrj(addForm.relationPrj) : '' }}</span>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-model-item label="营业执照">
                  <span v-for="(item, index) of addForm.fileUrlList" :key="index">
                    {{ item.name }}
                    <a @click="$newExportsExcel(`${fileUrl}/files?fileId=${item.response ? item.response.data : ''}&flag=true`)">下载</a>
                  </span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div class="modal-wrapper">
        <div class="title">
          <span>企业账户信息</span>
        </div>
        <a-table
          :rowKey="((record, index) => {return index})"
          :data-source="accountInfo"
          :columns="accountColumns"
          :pagination="false"
        >
          <template slot="accountType" slot-scope="text, record">
            <span>{{ setAccountName(record.accountType) }}</span>
          </template>
          <template slot="status" slot-scope="text, record">
            <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
          </template>
          <template slot="operation" slot-scope="scope">
            <a-button type="link" disabled>编辑</a-button>
            <a-button type="link" disabled>{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
          </template>
        </a-table>

      </div>
      <div class="modal-wrapper">
          <div class="title">
            <span>企业用户信息</span>
          </div>
          <a-table
            :rowKey="((record, index) => {return index})"
            :data-source="accountUserInfo"
            :columns="accountUserColumns"
            :pagination="false"
          >
            <template slot="roleId" slot-scope="text, record">
              <span>{{ setRoleName(record.roleId) }}</span>
            </template>
            <template slot="status" slot-scope="text, record">
              <span>{{ record.status == 0 ? '冻结' : '生效' }}</span>
            </template>
            <template slot="operation" slot-scope="scope">
              <a-button type="link" disabled>编辑</a-button>
              <a-button type="link" disabled>{{ scope.status == 1 ? '冻结' : '开启' }}</a-button>
            </template>
          </a-table>
        </div>

      <div class="footer">
        <a-button type="primary" style="margin-right:20px;" @click="handleOnUpClick" v-if="!isCheck">上一步</a-button>
        <a-button type="primary" style="margin-right:20px;" @click="handleOnSubmitClick" v-if="!isCheck">{{ isEditShow ? '确定' : '创建' }}</a-button>
        <a-button @click="handleOnCancelClick" v-if="!isCheck">取消</a-button>
        <a-button type="primary" @click="handleConfirmClick" v-if="isCheck">确定</a-button>
      </div>
    </a-modal>

    <a-modal v-model="isRelatedVisible" class="addCompanyModal" :footer="null" :maskClosable="false">
      <div class="modal-wrapper">
        <div class="title">
          <span>关联项目</span>
        </div>
        <div class="select-modal-relation">
          <a-row :gutter="24">
            <a-col :span="18" style="display: flex; flex-direction: row; align-items: center; padding-left: 40px;">
              <span style="display: inline-block;width: 160px;">所属项目：</span>
              <a-select
                  v-model="relationPrj"
                  mode="multiple"
                  style="width: 85%"
                  placeholder="请选择所属项目"
                  :options="relationPrjSelect"
                  @change="handleRelationPrjChange"
                >
              </a-select>
            </a-col>
          </a-row>
        </div>
        <div class="footer" style="margin-top: 100px;">
          <a-button type="primary" style="margin-right:20px;" @click="handleRelatedConfirmClick">确认</a-button>
          <a-button @click="handleRelatedCancelClick">取消</a-button>
        </div>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { 
  getManagementList, 
  checkCompanyInfo, 
  addCompanyInfo, 
  getCompanyType, 
  addCompanyAccountInfo, 
  getComapnyAccountType, 
  getCompanyAccountTypeTable,
  createCompanyInfo,
  editCompanyAccountInfo,
  setOpenOrFreeze,
  getCompanyUserList,
  companyCancel,
  editCompanyInfo,
  getCompanyAccountInfo,
  getRelationPrj,
  belongProject
} from '@/api/managementList'
import { getCompanyUserRole, addUser, editUser, getCompanyUserInfoList, forzenUser, getUserDetail } from '@/api/user'
import { downloadDetail } from '@/api/payment'
import { encrypted, decrypted } from '@/utils/util'

import { fileUrl } from '@/utils/request'
// import { STable, Ellipsis } from '@/components'
// import { getQuotaList } from '@/api/level1'
// import { dataSourceBank } from '@/utils/util'

const columns = [
  // {
  //   title: '序号',
  //   scopedSlots: { customRender: 'serial' },
  //   fixed: 'left',
  //   width: 80
  // },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: '30%'
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'unifiedCreditCode',
    key: 'unifiedCreditCode',
    width: '20%'
  },
  {
    title: '企业类型',
    dataIndex: 'companyRoleName',
    key: 'companyRoleName',
    scopedSlots: { customRender: 'companyRoleName' },
    width: '20%'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '20%'
  },
]

const accountColumns = [
  {
    title: '账户类型',
    dataIndex: 'accountType',
    key: 'accountType',
    scopedSlots: { customRender: 'accountType' },
    width: '10%'
  },
  {
    title: '开户行',
    dataIndex: 'openBank',
    key: 'openBank',
    width: '10%'
  },
  {
    title: '开户行联行号',
    dataIndex: 'openBankNum',
    key: 'openBankNum',
    width: '12%'
  },
  {
    title: '户名',
    dataIndex: 'accountName',
    key: 'accountName',
    width: '10%'
  },
  {
    title: '账号',
    dataIndex: 'accountNum',
    key: 'accountNum',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    width: '10%'
  },
  {
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '10%'
  }
]

const accountInfo = []

const accountUserInfo = []

const accountUserColumns = [
  {
    title: '用户类型',
    dataIndex: 'roleId',
    key: 'roleId',
    scopedSlots: { customRender: 'roleId' },
    width: ''
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    key: 'userName',
    width: ''
  },
  {
    title: '用户手机号码',
    dataIndex: 'phoneNo',
    key: 'phoneNo',
    width: ''
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    width: ''
  },
  {
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '10%'
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
    this.accountColumns = accountColumns
    this.accountUserColumns = accountUserColumns
    return {
      loadData: [],
      companyId: '',
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
        companyName: '',
        unifiedCreditCode: '',
        companyRole: undefined,
        registeredOffice: '',
        enterpriseContacts: '',
        enterpriseContactNumber: '',
        // relationPrj: undefined,
        fileUrlList: [],
      },
      rules: {
        companyName: [{ required: true, message: '请输入企业名称', trigger: 'change' }],
        unifiedCreditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'change' }],
        companyRole: [{ required: true, message: '请选择企业角色', trigger: 'change' }],
        registeredOffice: [{ required: true, message: '请输入注册地址', trigger: 'change' }],
        enterpriseContacts: [{ required: true, message: '请输入企业联系人', trigger: 'change' }],
        enterpriseContactNumber: [{ required: true, message: '请输入联系人电话', trigger: 'change' }],
        // relationPrj: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
        // fileUrlList: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
      },
      companyAccountForm: {
        accountType: undefined,
        accountName: '',
        accountNum: '',
        openBank: '',
        openBankNum: ''
      },
      companyAccountRules: {
        accountType: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
        accountName: [{ required: true, message: '请输入账户户名', trigger: 'change' }],
        accountNum: [{ required: true, message: '请输入银行账号', trigger: 'change' }],
        openBank: [{ required: true, message: '请输入开户银行', trigger: 'change' }],
        openBankNum: [{ required: true, message: '请输入开户行联行号', trigger: 'change' }],
      },
      companyUserForm: {
        roleId: undefined,
        userName: '',
        phoneNo: '',
        password: ''
      },
      companyUserRules: {
        roleId: [{ required: true, message: '请输入用户角色', trigger: 'change' }],
        userName: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
        phoneNo: [{ required: true, message: '请输入用户手机号', trigger: 'change' }],
        password: [{ required: true, message: '请输入初始密码', trigger: 'change' }],
      },
      projectType: [],
      companyAccountType: [],
      isAddCompany: true,
      isCompanyInfo: false,
      accountInfo,
      isAddCompanyInfoForm: true,
      isCompanyAccountInfo: false,
      isCompanyUserInfo: false,
      accountUserInfo: accountUserInfo,
      isCompanyAddUserInfo: false,
      isCompanyBasicFooter: true,
      isCompanyAccountInfoFooter: true,
      isCompanyUserInfoFooter: true,
      isLastConfirm: false,
      roleList: [],
      isCheck: false,
      isDisabled: false,
      isCompanyAccountEdit: false,
      isCompanyUserEdit: false,
      isEditShow: false,
      isAddBtnShow: false,
      isAddCompanyVisible: false,
      isAddCompanyAccountVisible: false,
      isAddCompanyUserAccountVisible: false,
      isAddCompanyUserFormVisible: false,
      isAddCompanyDetailVisible: false,
      fileUrl,
      relationPrjSelect: [],
      isRelatedVisible: false,
      relationPrj: [],
      relationId: '',
      queryParam: {
        companyName: ''
      },
      advanced: false,
    }
  },
  // watch: {
  //   'addForm.fileUrlList'(newVal) {
  //     console.log(newVal)
  //     if(newVal.length > 0) {
  //       this.addForm.fileUrlList = newVal
  //       console.log(this.addForm)
  //     }
  //   }
  // },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    this.getCompanyTypeList()
    this.getCompanyAccountTypeList()
    this.getCompanyUserRoleList()
    this.getRelationPrjSelect()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let reqObj = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let self = this
      getManagementList(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          self.loading = false
          const data = res.data
          self.loadData = data.pageList
          self.pagination.total = data.rowCount
        }
      })
    },
    getCompanyTypeList() {
      getCompanyType().then(res => {
        if(res && res.length > 0) {
          let result = res.map(v => {
            v.value = Number(v.value)
            return v
          })
          this.projectType = result
        }
      })
    },
    getCompanyInfo(id) {
      checkCompanyInfo(id).then(res => {
        if(res.status == 1 && res.data) {
          let result = {}
          result = res.data.companyInfo ? res.data.companyInfo : {}
          res.data.companyInfo.enterpriseContactNumber = decrypted(res.data.companyInfo.enterpriseContactNumber)
          res.data.companyInfo.enterpriseContacts = decrypted(res.data.companyInfo.enterpriseContacts)
          result.fileUrlList = []
          let file = res.data.companyInfo.busLicense && res.data.companyInfo.busLicense.substr(0, res.data.companyInfo.busLicense.length - 1).split(',')
              file && file.map((item, index) => {
                  let files = {}
                  files.uid = String(-index - 1)
                  let num = item.lastIndexOf('\#')
                  files.name = item.substring(0, num) 
                  files.url = item.substring(num + 1, item.length)
                  files.status = 'done'
                  files.response = { 'status':'done', data: files.url }
                  result.fileUrlList.push(files)
              })
          delete result.busLicense
          this.addForm = result
          let resultPrj = []
          this.addForm.relationPrj && this.addForm.relationPrj.split(',').map(v1 => {
            this.relationPrjSelect && this.relationPrjSelect.map(v2 => {
              if(v1 == v2.value) {
                resultPrj.push(v2.value)
              }
            })
          })
          this.addForm.relationPrj = resultPrj
          // this.addForm.fileUrlList = [{ name: '测试', response: { data: 'group1/M00/00/00/CnkAAmI6zIGAbBnMAABszLRg3tw812.pdf', status: 'done' }, status: 'done', uid: '-1', url: 'group1/M00/00/00/CnkAAmI6zIGAbBnMAABszLRg3tw812.pdf' }]
          this.accountInfo = res.data.accountList
          res.data.userList.map(v => {
            console.log(v.userName)
            v.userName = decrypted(v.userName)
            v.phoneNo = decrypted(v.phoneNo)
          })
          this.accountUserInfo = res.data.userList
        }
      })
    },
    getCompanyAccountTypeList() {
      getComapnyAccountType().then(res => {
        if(res && res.length > 0) {
          let result = res.map(v => {
            v.value = Number(v.value)
            return v
          })
          this.companyAccountType = result
        }
      })
    },
    getCompanyAccountTypeTableList(id) {
      let self = this
      let result = []
      getCompanyAccountTypeTable(id).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.$nextTick(() => {
            result = res.data
            self.accountInfo = result
          })
        }
      })
    },
    getCompanyUserListInfo(id) {
      getCompanyUserList(id).then(res => {
        if(res.status == 1) {
          this.accountUserInfo = res.data
        }
      })
    },
    getCompanyUserRoleList() {
      getCompanyUserRole().then(res => {
        if(res && res.length > 0) {
          this.roleList = res
        }
      })
    },
    getRelationPrjSelect() {
      getRelationPrj().then(res => {
        let result = []
        res && res.map(v => {
          let obj = {
            label: v.name,
            value: v.id
          }
          result.push(obj)
        })
        this.relationPrjSelect = result
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
      this.addForm.companyName = ''
      this.addForm.unifiedCreditCode = ''
      this.addForm.companyRole = undefined
      this.addForm.registeredOffice = ''
      this.addForm.enterpriseContacts = ''
      this.addForm.enterpriseContactNumber = ''
      this.addForm.fileUrlList = []
      this.isAddCompanyInfoForm = true
      this.isAddCompany = true
      this.isCompanyInfo = false
      this.isCompanyAccountInfo = false
      this.isCompanyUserInfo = false
      this.isCheck = false
      this.isLastConfirm = false
      this.isCompanyBasicFooter = true
      this.isCompanyAddUserInfo = false
      this.isDisabled = false
      this.isEditShow = false
      this.accountInfo = []
      this.accountUserInfo = []
      this.companyId = ''
    },
    handleReviewClick(record) {
      this.isAddCompanyDetailVisible = true
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.getCompanyInfo(record.id)
      this.isCheck = true
      
    },
    handleConfirmClick() {
      // this.$refs.ruleForm.validate(valid => {
      //   if(valid) {
          this.isAddCompanyDetailVisible = false
          this.isAddVisible = false
          this.isAddCompanyVisible = false
          this.isAddCompanyAccountVisible = false
          this.isAddCompanyUserAccountVisible = false
          this.isAddCompanyUserFormVisible = false
          this.getQuotaApplyList()
          setTimeout(() => {
            this.isCheck = false
          }, 1000)
      //   } else {
      //     return false
      //   }

      // })
    },
    handleEditClick(row) {
      this.isEditShow = true
      this.isAddCompanyDetailVisible = false
      this.isAddVisible = true
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.getCompanyInfo(row.id)
      this.companyId = row.id
    },
    // 企业基本信息下一步按钮
    handleAddCompanyInfoClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          let reqObj = Object.assign({}, this.addForm)
          let resultFile = ''
          reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                resultFile += v.name + '#' + v.response.data + ','
            })
          reqObj.busLicense = resultFile
          delete reqObj.fileUrlList
          delete reqObj.id
          reqObj.relationPrj = reqObj.relationPrj && reqObj.relationPrj.join()
          reqObj.enterpriseContacts = encrypted(reqObj.enterpriseContacts)
          reqObj.enterpriseContactNumber = encrypted(reqObj.enterpriseContactNumber)
          if(this.isEditShow) {
            editCompanyInfo(reqObj).then(res => {
              if(res.status == 1) {
                self.$message.success(res.message)
                self.companyId = res.data
                self.addForm.companyName = '' 
                self.addForm.unifiedCreditCode = ''
                self.addForm.companyRole = undefined
                self.addForm.registeredOffice = ''
                self.addForm.enterpriseContacts = ''
                self.addForm.enterpriseContactNumber = ''
                self.addForm.fileUrlList = []

                self.isAddCompany = false
                self.isCompanyInfo = true
                self.isCompanyAccountInfoFooter = true
                self.isAddCompanyVisible = true
                self.isAddVisible = false
                // self.getCompanyAccountTypeTableList(self.companyId)
                // this.getCompanyInfo(self.companyId)
              } else if(res.status == -1) {
                this.$message.warning(res.message)
              }
            })
          } else {
            console.log('add')
            addCompanyInfo(reqObj).then(res => {
              if(res.status == 1) {
                self.$message.success(res.message)
                self.companyId = res.data
                self.addForm.companyName = '' 
                self.addForm.unifiedCreditCode = ''
                self.addForm.companyRole = undefined
                self.addForm.registeredOffice = ''
                self.addForm.enterpriseContacts = ''
                self.addForm.enterpriseContactNumber = ''
                self.addForm.fileUrlList = []

                self.isAddCompany = false
                self.isCompanyInfo = true
                self.isCompanyAccountInfoFooter = true
                self.isAddCompanyVisible = true
                self.isAddVisible = false
                // self.getCompanyAccountTypeTableList(self.companyId)
              } else if(res.status == -1) {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleCancelCompanyInfoClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      this.$refs.ruleForm.resetFields()
    },
    handleContinueAddClick() {
      this.isEditShow = false
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = true
      this.companyAccountForm.accountType = undefined 
      this.companyAccountForm.accountName = '',
      this.companyAccountForm.accountNum = '',
      this.companyAccountForm.openBank = '',
      this.companyAccountForm.openBankNum = ''
    },
    // 企业账户信息上一步按钮
    handleCompanyAccountInfoUpClick() {
      this.isAddVisible = true
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.getCompanyInfo(this.companyId)
    },
    handleCompanyAccountInfoDownClick() {
      if(this.accountInfo.length == 0) {
        this.$message.warning('请添加企业账户信息')
        return
      }
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = true
    },
    handleCompanyAccountInfoCancelClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      if(!this.isEditShow) {
        companyCancel(this.companyId).then(res => {
          console.log(res)
        })
      }
      
    },
    // 企业账户信息添加弹窗确认
    handleCompanyAccountInfoSubmitClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.companyForm.validate(valid => {
        if(valid) {
          this.companyAccountForm.companyId = this.companyId
          if(self.isEditShow) {
            editCompanyAccountInfo(this.companyAccountForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.data)
                self.getCompanyAccountTypeTableList(self.companyId)
                this.$refs.companyForm.resetFields()
                this.isAddVisible = false
                this.isAddCompanyVisible = true
                this.isAddCompanyAccountVisible = false
                this.isAddCompanyUserAccountVisible = false
                this.isAddCompanyUserFormVisible = false
                this.isAddCompanyDetailVisible = false
              } else if(res.status == -1) {
                this.$message.error(res.message)
              }
            })
          } else {
            addCompanyAccountInfo(this.companyAccountForm).then(res => {
              if(res.status == 1) {
                self.$message.success('添加成功')
                this.isAddVisible = false
                this.isAddCompanyVisible = true
                this.isAddCompanyAccountVisible = false
                this.isAddCompanyUserAccountVisible = false
                this.isAddCompanyUserFormVisible = false
                this.isAddCompanyDetailVisible = false
                self.getCompanyAccountTypeTableList(self.companyId)
                this.$refs.companyForm.resetFields()
              } else if(res.status == -1) {
                this.$message.error(res.message)
              }
            })
          }
          
        } else {
          return false
        }
      })
    },
    // 企业账户信息添加弹窗取消
    handleCompanyAccountInfoSubmitCancelClick() {
      this.isAddVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyVisible = true
      // this.$refs.companyForm.resetFields()
      // companyCancel(this.companyId).then(res => {
      //   console.log(res)
      // })
    },
    // 编辑企业账户信息
    handleAccountEditClick(row) {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = true
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      this.isEditShow = true
      console.log(row)
      getCompanyAccountInfo(row.id).then(res => {
        if(res.status == 1) {
          this.companyAccountForm = res.data
        }
      })
    },
    // 冻结
    handleAccountFreezeClick(row) {
      setOpenOrFreeze(row.id).then(res => {
        if(res.status == 1) {
          this.$message.success(res.data)
          this.getCompanyAccountTypeTableList(this.companyId)
        }
      })
    },
    // 企业用户信息继续添加
    handleContinueAddUserClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = true
      this.isAddCompanyDetailVisible = false
      this.companyUserForm.roleId = undefined,
      this.companyUserForm.userName = '',
      this.companyUserForm.phoneNo = '',
      this.companyUserForm.password = ''
      this.isEditShow = false
    },
    // 企业用户信息上一步
    handleCompanyUserInfoUpClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = true
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
    },
    // 企业用户信息下一步
    handleCompanyUserInfoDownClick() {
      if(this.accountUserInfo.length == 0) {
        this.$message.warning('请添加企业用户信息')
        return
      }
      this.getCompanyInfo(this.companyId)
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = true
    },
    // 企业用户信息取消
    handleCompanyUserInfoCancelClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      if(!this.isEditShow) {
        companyCancel(this.companyId).then(res => {
          console.log(res)
        })
      }
    },
    // 企业用户信息添加确认
    handleCompanyUserInfoSubmitClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.companyUserForm.validate(valid => {
        if(valid) {
          console.log(self.companyUserForm)
          self.companyUserForm.companyId = self.companyId
          self.companyUserForm.userName = encrypted(self.companyUserForm.userName)
          self.companyUserForm.phoneNo = encrypted(self.companyUserForm.phoneNo)
          if(self.isEditShow) {
            editUser(self.companyUserForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.message)
                self.getCompanyAccountTypeTableList(self.companyId)
                this.isAddCompanyUserFormVisible = false
                this.isAddVisible = false
                this.isAddCompanyVisible = false
                this.isAddCompanyAccountVisible = false
                this.isAddCompanyUserAccountVisible = true
                this.getCompanyInfo(self.companyId)
              } else if(res.status == -1) {
                this.$message.error(res.message)
              }
            })
          } else {
            addUser(self.companyUserForm).then(res => {
              if(res.status == 1) {
                self.$message.success('添加成功')
                self.getCompanyAccountTypeTableList(self.companyId)
                this.isAddCompanyUserFormVisible = false
                this.isAddVisible = false
                this.isAddCompanyVisible = false
                this.isAddCompanyAccountVisible = false
                this.isAddCompanyUserAccountVisible = true
                this.getCompanyInfo(self.companyId)
              } else if(res.status == -1) {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
      
    },
    // 企业用户信息添加取消
    handleCompanyUserInfoSubmitCancelClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = true
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      this.$refs.companyUserForm.resetFields()
      if(!this.isEditShow) {
        companyCancel(this.companyId).then(res => {
          console.log(res)
        })
      }
    },
    handleOnUpClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = true
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
    },
    // 创建
    handleOnSubmitClick(e) {
      let self = this
      createCompanyInfo(self.companyId).then(res => {
        if(res.status == 1) {
          self.$message.success(res.message)
          this.isAddVisible = false
          this.isAddCompanyVisible = false
          this.isAddCompanyAccountVisible = false
          this.isAddCompanyUserAccountVisible = false
          this.isAddCompanyUserFormVisible = false
          this.isAddCompanyDetailVisible = false
          this.getQuotaApplyList()
          self.companyId = ''
          this.accountInfo = []
          this.accountUserInfo = []
        } else {
          self.companyId = ''
          this.accountInfo = []
          this.accountUserInfo = []
        }
      })
    },
    handleOnCancelClick() {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = false
      this.isAddCompanyDetailVisible = false
      if(!this.isEditShow) {
        companyCancel(this.companyId).then(res => {
          console.log(res)
        })
      }
    },
    handleUserEditClick(row) {
      this.isAddVisible = false
      this.isAddCompanyVisible = false
      this.isAddCompanyAccountVisible = false
      this.isAddCompanyUserAccountVisible = false
      this.isAddCompanyUserFormVisible = true
      this.isAddCompanyDetailVisible = false
      this.isEditShow = true
      getUserDetail(row.id).then(res => {
        if(res.status == 1) {
          this.companyUserForm = res.data
        }
      })
      // editUser(this.companyUserForm).then(res => {
      //   if(res.statue == 1) {
      //     this.companyUserForm = res.data
      //   }
      // })
    },
    // 冻结用户
    handleUserFreezeClick(row) {
      forzenUser(row.id).then(res => {
        if(res.status == 1) {
          this.$message.success(res.data)
          this.getCompanyUserListInfo(row.companyId)
        }
      })
    },
    // 附件上传
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
    handleDownloadClick(item) {
      console.log(item)
      // downloadDetail().then(res => {

      // })
    },
    handleRelationPrjChange(value) {
      this.relationPrj = value
    },
    handleRelatedClick(scope) {
      this.isRelatedVisible = true
      this.relationId = scope.id
      // let str = '111'
      // if(str.indexOf(',') != -1) {
      //   this.relationPrj = str.split(',')
      // } else {
      //   this.relationPrj[0] = str
      // }
      // this.relationPrj = '111,22222'.split(',')
      checkCompanyInfo(scope.id).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          let relationStr = res.data.companyInfo.relationPrj ? res.data.companyInfo.relationPrj : ''
  
          if(relationStr.indexOf(',') != -1) {
            
            this.relationPrj = relationStr.split(',')
          } else {
            if(relationStr != '') {
              
              this.relationPrj = relationStr
              
            } else {
              
              this.relationPrj = []
            }
            
          }
        }
      })
    },
    handleRelatedConfirmClick() {
      let reqObj = {
        id: this.relationId,
        relationPrj: this.relationPrj.join()
      }
      console.log(222222)
      belongProject(reqObj).then(res => {
        console.log(res)
        if(res.status == 1) {
          this.isRelatedVisible = false
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleRelatedCancelClick() {
      this.isRelatedVisible = false
    },
    handleCompanySearchClick() {
      this.loading = true
      let reqObj = {
        companyName: this.queryParam.companyName,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      let self = this
      getManagementList(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          self.loading = false
          const data = res.data
          self.loadData = data.pageList
          self.pagination.total = data.rowCount
          this.queryParam.companyName = ''
        } else {
          this.$message.error(res.data)
        }
      })
    },
    setCompanyTypeName(value) {
      let result = ''
      this.projectType && this.projectType.map(v => {
        if(value == v.value) {
          result = v.name
        }
      })
      return result
    },
    setRoleName(value) {
      let newName = ''
      this.roleList && this.roleList.map(v => {
        if(value == v.id) {
          newName = v.roleName
        }
      })
      return newName
    },
    setAccountName(value) {
      let newName = ''
      this.companyAccountType && this.companyAccountType.map(v => {
        if(value == v.value) {
          newName = v.name
        }
      })
      return newName
    },
    setRelationPrj(value){
      if(value && typeof value == 'string') {
        console.log(2222)
        let newArr = value && value.split(',')
        let str = ''
        this.relationPrjSelect && this.relationPrjSelect.map(v => {
          newArr.map(v1 => {
            console.log(v1, v)
            if(v1 == v.value) {
              console.log(v.label)
              str += v.label + ','
            }
          })
        })
        console.log(str)
        return str
      }
      
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
.addCompanyModal{
  .modal-wrapper{
    margin-bottom: 20px;
    .title{
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span{
        margin-left: 15px;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .title::before{
      content: '';
      position: absolute;
      width: 6px;
      height: 20px;
      background: #508EDF;
    }
    .download{
      color: #508EDF;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .ant-modal-content{
    width: 800px;
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
        width: 135px!important;
      }
  }
  .footer{
    text-align: center;
  }
}
.ant-select-dropdown-menu .ant-select-dropdown-menu-item{
  white-space: normal!important;
  word-break: break-all!important;
  overflow: none!important;
  text-overflow: initial!important;
}
</style>