<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="一级项目编号">
                <a-input v-model="queryParam.id" placeholder="请输入一级项目编号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="一级项目名称">
                <a-input v-model="queryParam.name" placeholder="请输入一级项目名称"/>
              </a-form-item>
            </a-col>
           
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" icon="plus" class="add"  @click="handleAddClick">新建</a-button>
                <a-button type="primary" icon="search" style="margin-left: 8px" @click="handleSearchClick">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
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
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <span slot="projectType" slot-scope="text, record">
          {{ record.projectType ? setProjectType(record.projectType) : ''}}
        </span>
        <template slot="operation" slot-scope="scope">
          <a-button  @click="handleReviewClick(scope)">查看</a-button>
          <a-button type="link" @click="handleEditClick(scope)">编辑</a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="isAddVisible" class="addModal" :title="modalTitle" :ok-text="modalOk" cancel-text="取消" @ok="handleSubmitModalClick" @cancel="handleCancelClick">
      <a-form-model
        ref='ruleForm'
        :model="addForm"
        :rules="rules"
        :label-col="{ span: 10 }" 
        :wrapper-col="{ span: 12 }"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="一级项目编码" prop="projectIDLv1">
              <a-input 
                type="text"  
                v-model="addForm.projectIDLv1"
                placeholder="请输入"
                :disabled="isEdit"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="一级项目名称" prop="projectNameLv1">
              <a-input 
                type="text" 
                v-model="addForm.projectNameLv1"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="项目投资年度" prop="investYear">
              <a-input 
                type="text" 
                v-model="addForm.investYear"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目所属区域" prop="projectRegion">
              <a-select v-model="addForm.projectRegion" placeholder="请选择" >
                <a-select-option v-for="item of projectRegionList" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="项目类型" prop="projectType">
              <a-select v-model="addForm.projectType" placeholder="请选择" >
                <a-select-option v-for="item of projectTypeList" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="招标项目类型代码" prop="bidInvestProjectType">
              <a-select v-model="addForm.bidInvestProjectType" placeholder="请选择" >
                <a-select-option v-for="item of bidInvestProjectTypeList" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <!--  -->
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="资金来源" prop="fundsSource">
              <a-select v-model="addForm.fundsSource" placeholder="请选择" >
                <a-select-option v-for="item of fundsSourceList" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目总投资额" prop="totalInvestAmount">
              <div class="investment">
                <a-input 
                  type="text"  
                  v-model="addForm.totalInvestAmount"
                  placeholder="请输入"
                /> <span>万元</span>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
         <a-row :gutter="24">
          <a-col :span="12">
           <a-form-model-item label="建设单位名称" prop="constructionUnit">
              <a-input 
                type="text" 
                v-model="addForm.constructionUnit"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目分配日期" prop="projectAllotime">
              <a-date-picker 
                type="text" 
                v-model="addForm.projectAllotime"
                @change="handleprojectAllotimeDateChange"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="项目拟开工日期" prop="startDate">
              <a-date-picker 
                type="text" 
                v-model="addForm.startDate"
                @change="handleStartDateChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目拟竣工日期" prop="endDate">
              <a-date-picker 
                type="text" 
                v-model="addForm.endDate"
                @change="handleEndDateChange"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
       
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="委托部门" prop="delegateDepartment">
              <a-input 
                  type="text"  
                  v-model="addForm.delegateDepartment"
                  placeholder="请输入"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="项目主管部门" prop="competentDepartment">
               <a-input 
                  type="text"  
                  v-model="addForm.competentDepartment"
                  placeholder="请输入"
                />
            </a-form-model-item>
          </a-col>
        </a-row>
         <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="前期工作函年份" prop="preWorkYear">
              <!-- <div class="investment"> -->
               <a-input 
                  type="text"  
                  v-model="addForm.preWorkYear"
                  placeholder="请输入"
                />
              <!-- </div> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="前期工作函文件号" prop="preWorkNo">
               <a-input 
                  type="text"  
                  v-model="addForm.preWorkNo"
                  placeholder="请输入"
                />
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
            <span>一级项目编号：</span>
            <span>{{ detailObj.projectIDLv1 }}</span>
          </a-col>
          <a-col :span="12">
            <span>一级项目名称：</span>
            <span>{{ detailObj.projectNameLv1 }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目投资年度：</span>
            <span>{{ detailObj.investYear }}</span>
          </a-col>
          <a-col :span="12">
            <span>项目所属区域：</span>
            <span>{{ detailObj.projectRegion }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目类型：</span>
            <span>{{ setProjectTypeText(detailObj.projectType) }}</span>
          </a-col>
          <a-col :span="12">
            <span>建设单位名称：</span>
            <span>{{ detailObj.constructionUnit }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>资金来源：</span>
            <span>{{ setfundsSource(detailObj.fundsSource) }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目总投资额：</span>
            <span>{{ detailObj.totalInvestAmount }} 万元</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目拟开工日期：</span>
            <span>{{ detailObj.startDate }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="modal-row">
          <a-col :span="12">
            <span>项目拟竣工日期：</span>
            <span>{{ detailObj.endDate }}</span>
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
import { getProjectList1, addProjectList1, getProjectList1Type, editProjectList1, checkProjectList1 } from '@/api/projectList1'


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
    width: '15%'
  },
  {
    title: '项目投资年度',
    dataIndex: 'investYear',
    key: 'investYear',
    width: '10%'
  },
  {
    title: '项目区域',
    dataIndex: 'projectRegion',
    key: 'projectRegion',
    width: '10%'
  },
  {
    title: '项目类别',
    dataIndex: 'projectType',
    key: 'projectType',
    scopedSlots: { customRender: 'projectType' },
    width: '15%'
  },
  {
    title: '总投资额度（万元）',
    dataIndex: 'totalInvestAmount',
    key: 'totalInvestAmount',
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
        id: '',
        name: '',
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
        projectIDLv1: '',
        projectNameLv1: '',
        investYear: '',
        projectRegion: undefined,
        projectType: undefined,
        bidInvestProjectType: undefined,
        constructionUnit: '',
        fundsSource: undefined,
        totalInvestAmount: '',
        startDate: '',
        endDate: '',
        projectAllotime: '',
        projectDescription: '',
      },
      rules: {
        projectIDLv1: [{ required: true, message: '请输入一级项目编码', trigger: 'change' }],
        projectNameLv1: [{ required: true, message: '请输入一级项目名称', trigger: 'change' }],
        investYear: [{ required: true, message: '请选择项目投资年度', trigger: 'change' }],
        projectRegion: [{ required: true, message: '请输入项目所属区域', trigger: 'change' }],
        projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        bidInvestProjectType: [{ required: true, message: '招标项目类型代码', trigger: 'change' }],
        constructionUnit: [{ required: true, message: '请输入建设单位名称', trigger: 'change' }],
        fundsSource: [{ required: true, message: '请输入资金来源', trigger: 'change' }],
        totalInvestAmount: [{ required: true, message: '请输入项目总投资额', trigger: 'change' }],
        projectAllotime: [{ required: true, message: '项目分配日期', trigger: 'change' }],
        // startDate: [{ required: true, message: '请选择拟开工日期', trigger: 'change' }],
        // endDate: [{ required: true, message: '请选择拟竣工日期', trigger: 'change' }],
        // projectDescription: [{ required: true, message: '请输入建设规模及内容', trigger: 'change' }],
      },
      projectTypeList: [{name: '重点项目', value: 1}, {name: '一般项目', value: 2}, {name: '土储项目', value: 3}, {name: '发改立项', value: 4}],
      projectRegionList: [{name: '容东片区', value: 1},{name: '昝岗片区', value: 2},{name: '启动区', value: 3},{name: '起步区', value: 4},{name: '雄东片区', value: 5},{name: '容西片区', value: 6},{name: '寨里片区', value: 7},{name: '安州小镇', value: 8},{name: '美丽乡村', value: 9},{name: '白洋淀综合治理', value: 10},{name: '基础设施', value: 11},{name: '新区内道路', value: 12},{name: '水利防洪', value: 13},{name: '造林绿化', value: 14},{name: '施工配套', value: 15},{name: '智能城市', value: 16},{name: '其它片区外项目', value: 17},{name: '容城', value: 18},{name: '雄县', value: 19},{name: '安新', value: 20}],
      bidInvestProjectTypeList: [{name: '建筑市政', value: 1},{name: '园林绿化', value: 2},{name: '水利工程', value: 3},{name: '交通工程', value: 4},{name: '电力工程', value: 5},{name: '公路工程', value: 6},{name: '海口与航道工程', value: 7},{name: '机电安装工程', value: 8},{name: '地质矿产工程', value: 9},{name: '其他', value: 10}],
      fundsSourceList: [{name: '政府投资', value: 1},{name: '政府投资+社会投资', value: 2},{name: '雄安集团投资', value: 3},{name: '雄安集团投资+社会投资', value: 4},{name: '雄安集团投资+政府补贴/回购', value: 5},{name: '企业投资', value: 6}],
      modalTitle: '',
      modalOk: '',
      isEdit: false,
      isDetailVisible: false,
      detailObj: {},
      isAddBtnShow: null
    }
  },
  created() {
    // setTimeout(() => {
    //   this.isAddBtnShow = this.$route.meta.btn ? this.$route.meta.btn.add : false
    // }, 1000)
  },
  mounted () {
    this.getQuotaApplyList()
    // this.getProjectSelectList()
  },
  methods: {
    getQuotaApplyList() {
      this.loading = true
      let reqObj = {
        id: this.queryParam.id,
        name: this.queryParam.name,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getProjectList1(reqObj).then(res => {
        if(res.status == 1 && res.data) {
          this.loading = false
          const data = res.data
          this.loadData = data.pageList
          this.pagination.total = data.rowCount
        }
      })
    },
    // 获取一级项目类型
    // getProjectSelectList() {
    //   getProjectList1Type().then(res => {
    //     if(res && res.length > 0) {
    //       this.projectTypeList = res
    //     }
    //   })
    // },
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
      this.modalOk = '保存'
      let result = {
        projectIDLv1: '',
        projectNameLv1: '',
        investYear: '',
        projectRegion: undefined,
        projectType: undefined,
        constructionUnit: '',
        fundsSource: undefined,
        totalInvestAmount: '',
        startDate: '',
        endDate: '',
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
    handleprojectAllotimeDateChange(date, dateString) {
      console.log(date, dateString)
      this.addForm.projectAllotime = dateString
    },
    handleSubmitModalClick(e) {
      e.preventDefault()
      let self = this
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          if(self.isEdit) {
            editProjectList1(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success('编辑一级项目成功')
                self.isAddVisible = false
                self.getQuotaApplyList()
              }
            })
          } else {
            addProjectList1(self.addForm).then(res => {
              if(res.status == 1) {
                self.$message.success('新建一级项目成功')
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
      console.log(row)
      this.isDetailVisible = true
      checkProjectList1(row.id).then(res => {
        console.log(res)
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
      this.addForm.fundsSource = String(row.fundsSource)
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
    setfundsSource(status) {
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
      // line-height: 60px;

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