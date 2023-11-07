<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="二级项目编号">
                <a-input v-model="queryParam.secondPeriodProjectCode" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="二级项目名称">
                <a-input v-model="queryParam.secondPeriodProjectName" placeholder="请输入"/>
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
          <!-- <a-button type="link" @click="handleDeleteClick(scope)">删除</a-button> -->
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
            <a-form-model-item label="二级项目编号" prop="projectIDLv2">
              <a-input 
                type="text"  
                v-model="addForm.projectIDLv2"
                placeholder="请输入二级项目编号"
                :disabled="isEdit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="二级项目名称" prop="projectNameLv2">
              <a-input 
                type="text" 
                v-model="addForm.projectNameLv2"
                placeholder="请输入二级项目名称"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="所属一级项目" prop="projectIDLv1">
              <a-select v-model="addForm.projectIDLv1" placeholder="请选择所属一个项目">
                <a-select-option v-for="item of projectList" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="可研估算投资额" prop="feasibilityStudyEstimate">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.feasibilityStudyEstimate"
                  placeholder="请输入"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="初设概算投资额" prop="perliminaryDesignBudget">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.perliminaryDesignBudget"
                  placeholder="请输入"
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
            <span>二级项目编号：</span>
            <span>{{ detailObj.projectIDLv2 }}</span>
          </a-col>
          <a-col :span="12">
            <span>二级项目名称：</span>
            <span>{{ detailObj.projectNameLv2 }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>所属一级项目：</span>
            <span>{{ detailObj.projectIDLv1 }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>可研估算投资额：</span>
            <span>{{ detailObj.feasibilityStudyEstimate }} 万元</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>初设概算投资额：</span>
            <span>{{ detailObj.perliminaryDesignBudget }} 万元</span>
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
import { projectType } from '@/utils/util'
import { getProList1, getProjectList2, addProjectList2, deleteProList2, editProjectList2, getProjectDetail2 } from '@/api/projectList2'
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
    title: '一级项目编号',
    dataIndex: 'projectIDLv1',
    key: 'projectIDLv1',
    width: '15%'
  },
  {
    title: '一级项目名称',
    dataIndex: 'projectNameLv1',
    key: 'projectNameLv1',
    width: '20%'
  },
  {
    title: '二级项目编号',
    dataIndex: 'projectIDLv2',
    key: 'projectIDLv2',
    width: '10%'
  },
  {
    title: '二级项目名称',
    dataIndex: 'projectNameLv2',
    key: 'projectNameLv2',
    width: '20%'
  },
  { 
    title: '操作', 
    key: 'operation', 
    scopedSlots: { customRender: 'operation' },
    width: '20%'
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
        secondPeriodProjectCode: '',
        secondPeriodProjectName: ''
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
        projectIDLv2: '',
        projectNameLv2: '',
        projectIDLv1: undefined,
        feasibilityStudyEstimate: '',
        perliminaryDesignBudget: '',
      },
      rules: {
        projectIDLv2: [{ required: true, message: '请输入二级项目编号', trigger: 'change' }],
        projectNameLv2: [{ required: true, message: '请输入二级项目名称', trigger: 'change' }],
        projectIDLv1: [{ required: true, message: '请选择所属一级项目', trigger: 'change' }],
        feasibilityStudyEstimate: [{ required: true, message: '请输入可研估算投资额', trigger: 'change' }],
        perliminaryDesignBudget: [{ required: true, message: '请输入初设估算投资额', trigger: 'change' }],
      },
      projectType: projectType,
      projectList: [],
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
    this.getProjectList1()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let reqObj = {
        secondPeriodProjectCode: this.queryParam.secondPeriodProjectCode,
        secondPeriodProjectName: this.queryParam.secondPeriodProjectName,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getProjectList2(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
      })
    },
    getProjectList1 () {
      getProList1().then(res => {
        console.log(res)  
        if(res && res.length > 0) {
          this.projectList = res
        }
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
      console.log(page, pageSize)
      this.pagination.current = page
      this.getQuotaApplyList()
    },
    handleShowSizeChange(current, size) {
      console.log(current, size)
      this.pagination.pageSize = size
      this.getQuotaApplyList()
    },
    handleDateChange(date, dateString) {
      console.log(date, dateString)
      this.queryParam.applyDate = dateString
    },
    handleAddClick() {
      this.isAddVisible = true
      this.modalTitle = '新建'
      this.modalOk = '立即创建'
      let result = {
        projectIDLv2: '',
        projectNameLv2: '',
        projectIDLv1: undefined,
        feasibilityStudyEstimate: '',
        perliminaryDesignBudget: '',
      }
      this.addForm = result
      this.isEdit = false
    },
    handleReviewClick(record) {
      console.log(record)
      this.isDetailVisible = true
      getProjectDetail2(record.id).then(res => {
        console.log(res)
        if(res.status == 1 && res.data) {
          this.detailObj = res.data
        }
      })
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          if(self.isEdit) {
            editProjectList2(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.data)
                self.isAddVisible = false
                self.getQuotaApplyList()
              }
            })
          } else {
            addProjectList2(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success(res.data)
                self.isAddVisible = false
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
      this.getQuotaApplyList()
    },
    handleEditClick(record) {
      this.isEdit = true
      this.isAddVisible = true
      this.modalTitle = '编辑'
      this.modalOk = '确定'
      this.addForm = record
    },
    // 删除
    handleDeleteClick(record) {
      deleteProList2(record.id).then(res => {
        if(res.status == 1) {
          this.$message.success(res.data)
          this.isAddVisible = false
          this.getQuotaApplyList()
        }
      })

    },
    handleSubmitClick() {
      this.isDetailVisible = false
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