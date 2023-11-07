<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="项目名称">
                <a-input v-model="queryParam.projectName" placeholder="请输入项目名称"/>
              </a-form-item>
            </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="项目编号">
                  <a-input v-model="queryParam.projectId" placeholder="请输入项目区域">
                  </a-input>
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
            <a-form-model-item label="项目名称" prop="projectName">
              <a-input 
                type="text"  
                v-model="addForm.projectName"
                placeholder="请输入"
                :disabled="isEdit"
              />
            </a-form-model-item>
          </a-col>
        <a-col :span="12">
            <a-form-model-item label="项目编号" prop="projectId">
              <a-input 
                type="text"  
                v-model="addForm.projectId"
                placeholder="请输入"
                :disabled="isEdit"
              />
            </a-form-model-item>
          </a-col>
            </a-row>
        <a-row :gutter="24">
            <a-col :span="12">
                <a-form-model-item label="项目区域" prop="projectRegion">
                <a-input 
                    type="text" 
                    v-model="addForm.projectRegion"
                    placeholder="请输入"
                />
                </a-form-model-item>
            </a-col>
          <a-col :span="12">
            <a-form-model-item label="建设单位名称" prop="ownerUnit">
              <!-- <a-input 
                type="text" 
                v-model="addForm.ownerUnit"
                placeholder="请输入"
              /> -->
              <a-select v-model="addForm.ownerUnit" placeholder="请选择" >
                <a-select-option v-for="item of ownerUnitSelect" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :span="12">
            <a-form-model-item label="项目总投资额" prop="projectTotalInvestment">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.projectTotalInvestment"
                  placeholder="请输入"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="textarea">
          <a-col>
            <a-form-model-item label="建设规模及内容" prop="projectDescription">
              <a-input 
                type="textarea" 
                v-model="addForm.projectDescription"
                class="textarea"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      
    </a-modal>


    <a-modal v-model="isDetailVisible" class="addModal" title="详情" :footer="null">
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目名称：</span>
            <span>{{ detailObj.projectName }}</span>
          </a-col>
          <a-col :span="12">
            <span>项目编号：</span>
            <span>{{ detailObj.projectId }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目所属区域：</span>
            <span>{{ detailObj.projectRegion }}</span>
          </a-col>
          <a-col :span="12">
            <span>建设单位名称：</span>
            <span>{{ detailObj.ownerUnitName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目总投资额：</span>
            <span>{{ detailObj.projectTotalInvestment }} 万元</span>
          </a-col>
        </a-row>
        <a-row :gutter="24"  class="modal-row">
          <a-col>
            <span>建设规模及内容：</span>
            <span>{{ detailObj.projectDescription }}</span>
          </a-col>
        </a-row>
      <div class="footer-wrapper">
        <a-button type="primary" @click="handleDetailClick">确定</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { projectType } from '@/utils/util'
import { getProjectList, addProjectList, editProjectList, getOwnerUnit, getProjectDetail } from '@/api/projectList'


const columns = [
  // {
  //   title: '序号',
  //   scopedSlots: { customRender: 'serial' },
  //   fixed: 'left',
  //   width: 80
  // },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: '15%'
  },
  {
    title: '项目编号',
    dataIndex: 'projectId',
    key: 'projectId',
    width: '20%'
  },
  {
    title: '项目区域',
    dataIndex: 'projectRegion',
    key: 'projectRegion',
    width: '10%'
  },
  {
    title: '项目总投资额度（万元）',
    dataIndex: 'projectTotalInvestment',
    key: 'projectTotalInvestment',
    width: '15%'
  },
  {
    title: '建设规模及内容',
    dataIndex: 'projectDescription',
    key: 'projectDescription',
    scopedSlots: { customRender: 'projectDescription' },
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
        projectName: '',
        projectId: ''
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
        projectName: '',
        projectId: '',
        projectRegion: '',
        ownerUnit: '',
        projectTotalInvestment: '',
        projectDescription: '',
      },
      rules: {
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
        projectId: [{ required: true, message: '请输入项目编号', trigger: 'change' }],
        projectRegion: [{ required: true, message: '请输入项目所属区域', trigger: 'change' }],
        ownerUnit: [{ required: true, message: '请输入建设单位名称', trigger: 'change' }],
        projectTotalInvestment: [{ required: true, message: '请输入项目总投资额', trigger: 'change' }],
        projectDescription: [{ required: true, message: '请输入建设规模及内容', trigger: 'change' }],
      },
      ownerUnitSelect: [],
      modalTitle: '',
      modalOk: '',
      isEdit: false,
      isDetailVisible: false,
      detailObj: {},
      isAddBtnShow: null
    }
  },
  created() {
    setTimeout(() => {
      this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    this.getProjectSelectList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let reqObj = {
        projectName: this.queryParam.projectName,
        projectId: this.queryParam.projectId,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getProjectList(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          // this.pagination.total = data.rowCount
        }
      })
    },
    // 获取建设单位
    getProjectSelectList() {
      getOwnerUnit().then(res => {
        if(res && res.length > 0) {
            console.log(res)
          this.ownerUnitSelect = res
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
      this.modalTitle = '新建'
      this.modalOk = '立即创建'
      let result = {
        projectName: '',
        projectId: '',
        projectRegion: '',
        ownerUnit: '',
        projectTotalInvestment: '',
        projectDescription: ''
      }
      this.addForm = result
      this.isEdit = false
    },
    handleStartDateChange(date, dateString) {
      console.log(date, dateString)
      this.addForm.startDate = dateString
    },
    handleEndDateChange(date, dateString) {
      console.log(date, dateString)
      this.addForm.endDate = dateString
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          if(self.isEdit) {
            editProjectList(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.data)
                self.isAddVisible = false
                self.getQuotaApplyList()
              }
            })
          } else {
            addProjectList(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.data)
                self.isAddVisible = false
                self.$refs.ruleForm.resetFields()
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
      this.getQuotaApplyList()
      this.$refs.ruleForm.resetFields()
    },
    handleReviewClick(row) {
      this.isDetailVisible = true
      getProjectDetail(row.id).then(res => {
        if(res.status == 1 && res.data) {
          this.detailObj = res.data
        }
      })
      
    },
    handleEditClick(row) {
      this.modalTitle = '编辑'
      this.modalOk = '确定'
      this.isAddVisible = true
      this.isEdit = true
      console.log(row)
      this.addForm = row
      this.addForm.projectType = String(row.projectType)
      this.addForm.fundingSource = String(row.fundingSource)
      this.addForm.startDate = moment(row.startDate, 'YYYY-MM-DD')
      this.addForm.endDate = moment(row.endDate, 'YYYY-MM-DD')
    },
    handleDetailClick() {
      this.isDetailVisible = false
    },
    setProjectType(value) {
      let result = ''
      this.projectTypeList && this.projectTypeList.map(v => {
        if(value == v.value) {
          result = v.name
        }
      })
      return result
    },
    setProjectTypeText(id) {
      let newName = ''
      this.projectTypeList && this.projectTypeList.map(res => {
        if(id == res.value) {
          newName = res.name
        }
      })
      return newName
    },
    setFundingSource(status) {
      switch (status) {
        case 1: 
          return '政府投资';
        case 2:
          return '企业投资';
        case 3:
          return '政府投资+企业投资'
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
    .ant-form-inline .ant-form-item > .ant-form-item-label{
        width: 120px;
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
  .modal-row{
    span{
      display: inline-block;
      line-height: 60px;

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