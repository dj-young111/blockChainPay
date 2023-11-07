<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="三级项目编号">
                <a-input v-model="queryParam.thirdPeriodProjectCode" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="三级项目名称">
                <a-input v-model="queryParam.thirdPeriodProjectName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form>
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
        <!-- <template slot="ownerUnit" slot-scope="scope">
          <span>{{ setOwnerUnitName(scope.ownerUnit) }}</span>
        </template> -->
        <template slot="operation" slot-scope="scope">
          <a-button type="link" @click="handleReviewClick(scope)">查看</a-button>
          <a-button type="link" :disabled="!scope.editFlag" @click="handleEditClick(scope)">编辑</a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="isAddVisible" class="addModal" :title="modalTitle" :ok-text="modalOk" cancel-text="取消" @ok="handleSubmitModalClick" @cancel="handleCancelClick">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :rules="rules"
        :label-col="{ span: 8 }" 
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="三级项目编号" prop="projectIDLv3">
              <a-input 
                type="text"  
                v-model="addForm.projectIDLv3"
                placeholder="请输入三级项目编号"
                :disabled="isEdit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="三级项目名称" prop="projectNameLv3">
              <a-input 
                type="text" 
                v-model="addForm.projectNameLv3"
                placeholder="请输入三级项目名称"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="所属二级项目" prop="projectIDLv2">
              <a-select v-model="addForm.projectIDLv2" placeholder="请选择所属二级项目">
                <a-select-option v-for="item of projectType" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="业主单位" prop="ownerUnit">
              <a-select v-model="addForm.ownerUnit" placeholder="请选择业主单位">
                <a-select-option v-for="item of ownerUnitSelect" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="建安控制价" prop="ciControlPrice">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.ciControlPrice"
                  placeholder="请输入建安控制价"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="建安合同金额" prop="ciContractAmount">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.ciContractAmount"
                  placeholder="请输入建安合同金额"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="监理合同金额" prop="supervisionContractAmount">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.supervisionContractAmount"
                  placeholder="请输入监理合同金额"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <a-modal v-model="isDetailVisible" class="addModal" title="详情" :footer="null">
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>三级项目编号：</span>
            <span>{{ detailObj.projectIDLv3 }}</span>
          </a-col>
          <a-col :span="12">
            <span>三级项目名称：</span>
            <span>{{ detailObj.projectNameLv3 }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>所属二级项目：</span>
            <span>{{ setProjectName(detailObj.projectIDLv2) }}</span>
          </a-col>
          <a-col :span="12">
            <span>业主单位：</span>
            <span>{{ setOwnerUnitName(detailObj.ownerUnit) }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>建安控制价：</span>
            <span>{{ detailObj.ciControlPrice }} 万元</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>建安合同金额：</span>
            <span>{{ detailObj.ciContractAmount }} 万元</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>监理合同金额：</span>
            <span>{{ detailObj.supervisionContractAmount }} 万元</span>
          </a-col>
        </a-row>
      <div class="footer-wrapper">
        <a-button type="primary" @click="handleSubmitClick">确定</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { getProjectList3, getProList2, addProjectList3, editProjectList3, getProjectDetail3, getOwnerUnit } from '@/api/projectList3'

const columns = [
  // {
  //   title: '序号',
  //   scopedSlots: { customRender: 'serial' },
  //   fixed: 'left',
  //   width: 80
  // },
  {
    title: '二级项目编号',
    dataIndex: 'projectIDLv2',
    key: 'projectIDLv2',
    width: '20%'
  },
  {
    title: '二级项目名称',
    dataIndex: 'projectNameLv2',
    key: 'projectNameLv2',
    width: '20%'
  },
  {
    title: '三级项目编号',
    dataIndex: 'projectIDLv3',
    key: 'projectIDLv3',
    width: '20%'
  },
  {
    title: '三级项目名称',
    dataIndex: 'projectNameLv3',
    key: 'projectNameLv3',
    width: '10%'
  },
  {
    title: '业主单位',
    dataIndex: 'ownerUnitName',
    key: 'ownerUnitName',
    scopedSlots: { customRender: 'ownerUnitName' },
    width: '15%'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '15%'
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
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        thirdPeriodProjectCode: '',
        thirdPeriodProjectName: ''
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
      loading: false,
      isAddVisible: false,
      addForm: {
        projectIDLv3: '',
        projectNameLv3: '',
        projectIDLv2: undefined,
        ownerUnit: undefined,
        ciControlPrice: '',
        ciContractAmount: '',
        supervisionContractAmount: ''
      },
      rules: {
        projectIDLv3: [{ required: true, message: '请输入三级项目编号', trigger: 'change' }],
        projectNameLv3: [{ required: true, message: '请输入三级项目名称', trigger: 'change' }],
        projectIDLv2: [{ required: true, message: '请选择所属二级项目', trigger: 'change' }],
        ownerUnit: [{ required: true, message: '请选择业主单位', trigger: 'change' }],
        ciControlPrice: [{ required: true, message: '请输入建安控制价', trigger: 'change' }],
        ciContractAmount: [{ required: true, message: '请输入建安合同金额', trigger: 'change' }],
        supervisionContractAmount: [{ required: true, message: '请输入监理合同金额', trigger: 'change' }],
      },
      projectType: [],
      modalTitle: '',
      modalOk: '',
      isEdit: false,
      isDetailVisible: false,
      detailObj: {},
      ownerUnitSelect: [],
      isAddBtnShow: false
    }
  },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    this.getProList2Select()
    this.getOwnerUnitSelect()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let reqObj = {
        thirdPeriodProjectCode: this.queryParam.thirdPeriodProjectCode,
        thirdPeriodProjectName: this.queryParam.thirdPeriodProjectName,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getProjectList3(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
      })
    },
    getProList2Select() {
      getProList2().then(res => {
        if(res && res.length > 0) {
          this.projectType = res
        }
      })
    },
    getOwnerUnitSelect() {
      getOwnerUnit().then(res => {
        this.ownerUnitSelect = res
      })
    },
   handleSearchClick() {
     this.getQuotaApplyList()
   }, 
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handlePageChange(page, pageSize) {
      this.pagination.current = page
      this.getQuotaApplyList()
    },
    handleShowSizeChange(current, size) {
      this.pagination.pageSize = size
      this.getQuotaApplyList()
    },
    handleDateChange(date, dateString) {
      this.queryParam.applyDate = dateString
    },
    handleReviewClick(record) {
      this.isDetailVisible = true
      getProjectDetail3(record.id).then(res => {
        if(res.status == 1 && res.data) {
          this.detailObj = res.data
        }
      })
    },
    handleEditClick(record) {
      this.isAddVisible = true
      this.modalTitle = '编辑'
      this.modalOk = '确定'
      this.addForm = record
      this.isEdit = true
    },
    handleAddClick() {
      this.isAddVisible = true
      this.modalTitle = '新建'
      this.modalOk = '立即创建'
      let result = {
        projectIDLv3: '',
        projectNameLv3: '',
        projectIDLv2: '',
        ownerUnit: '',
        ciControlPrice: '',
        ciContractAmount: '',
        supervisionContractAmount: '',
      }
      this.addForm = result
      this.isEdit = false
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          if(self.isEdit) {
            editProjectList3(self.addForm).then(res => {
              if(res.status == 1) {
                self.isAddVisible = false
                self.$message.success(res.data)
                self.getQuotaApplyList()
              }
            })
          } else {
            addProjectList3(this.addForm).then(res => {
              if(res.status == 1) {
                self.isAddVisible = false
                self.$message.success(res.data)
                self.getQuotaApplyList()
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
      this.$refs.ruleForm.resetFields()
    },
    handleSubmitClick() {
      this.isDetailVisible = false
    },
    setProjectName(value) {
      let newName = ''
      this.projectType && this.projectType.map(res => {
        if(value == res.value) {
          newName = res.name
        }
      })
      return newName
    },
    setOwnerUnitName (value) {
      let newName = ''
      this.ownerUnitSelect && this.ownerUnitSelect.map(res => {
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
.addModal{
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
    .textarea{
      .ant-form-item-label{
        text-align: left;
        width: 121px!important;
      }
    }
  }
  .modal-wrapper{
    span{
      display: inline-block;
      line-height: 60px;
    }
  }
  .footer-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>