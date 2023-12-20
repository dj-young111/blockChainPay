<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="payroll-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="工资单名称">
                                <a-input v-model="queryParam.salaryName" placeholder="请输入工资单名称"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="合同名称">
                                <a-input v-model="queryParam.contractName" placeholder="请输入合同名称">
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                                <a-button type="primary" @click="handleSearchClick">查询</a-button>
                                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
                <a-button type="primary" icon="plus" size="small" class="add" @click="handleAddClick">新增</a-button>
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
                <template slot="operation" slot-scope="scope">
                    <!-- <a-button type="link" @click="$newExportsExcel(`${fileUrl}/files?fileId=${scope.salaryDetails.split(',')[0].substring(scope.salaryDetails.lastIndexOf('\#') + 1, scope.salaryDetails.length)}&flag=true`)">下载</a-button> -->
                    <a-button type="link" :disabled="scope.salaryDetails ? false : true"><a  @click="$newExportsExcel(`${fileUrl}/files?fileId=${scope.salaryDetails.split(',')[0].substring(scope.salaryDetails.lastIndexOf('\#') + 1, scope.salaryDetails.length)}&flag=true`)">下载</a></a-button>
                    <a-button type="link" @click="handleEditClick(scope)">编辑</a-button>
                    <!-- <a-button type="link" @click="handleDeleteClick(scope)">删除</a-button> -->
                    <a-popconfirm
                        title="确定要删除吗?"
                        @confirm="handleDeleteClick(scope)"
                        >
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-card>

        <!-- 新增 -->
        <a-modal v-model="isAddVisible" class="addPayrollModal" title="新增" ok-text="确认" cancel-text="取消" @ok="handlePayrollOnSubmitClick" @cancel="handlePayrollCancelClick">
            <a-form-model
                ref='ruleForm'
                :model="addForm"
                :rules="rules"
                :label-col="{ span: 8 }" 
                :wrapper-col="{ span: 12 }"
            >
                <div class="modal-wrapper">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="工资单名称" prop="salaryName">
                            <a-input 
                                type="text"  
                                v-model="addForm.salaryName"
                                placeholder="请输入工资单名称"
                            />
                            
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12" v-if="!isEdit">
                            <a-form-model-item label="乙方公司名称"  prop="companyBName" >
                            <a-select show-search v-model="addForm.companyBName" :filter-option="filterOption" placeholder="请选择" @change="handleCompanyBNameChange">
                                <a-select-option v-for="item of companyBNameList" :key="item.companyBName" :value="item.companyBName">
                                {{ item.companyBName }}
                                </a-select-option>
                            </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12" v-else>
                            <a-form-model-item label="乙方公司名称"  prop="companyBName" >
                            <a-input 
                                    type="text"
                                    v-model="addForm.companyBName"
                                    disabled
                                />
                            </a-form-model-item>
                        </a-col>
                        </a-row>
                    <a-row :gutter="24" v-if="companySelect.length > 0 || isEdit ">
                            <a-col :span="12" v-if="!isEdit">
                                <a-form-model-item label="合同名称" prop="contractCode">
                                    <a-select v-model="addForm.contractCode" placeholder="请选择合同名称" @change="handleContractNameChange">
                                        <a-select-option v-for="item of companySelect" :key="item.contractCode" :value="item.contractCode">
                                        {{ item.contractName }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" v-else>
                                <a-form-model-item label="合同名称" prop="contractName">
                                    <a-input 
                                    type="text"
                                    v-model="addForm.contractName"
                                    disabled
                                />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="合同金额（元）" v-if="!isEdit">
                                <a-input 
                                    type="text"
                                    v-model="contractNum"
                                    disabled
                                />
                                </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="合同甲方公司名称" prop="companyAName">
                                <a-input 
                                    type="text" 
                                    v-model="addForm.companyAName"
                                    placeholder="请输入合同甲方公司名称"
                                    disabled
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="工资单月份" prop="month">
                                <a-month-picker
                                    v-model="addForm.month"
                                    type="date"
                                    placeholder="请选择月份"
                                    style="width: 100%;"
                                    format="YYYY-MM"
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-model-item label="工资单总金额（元）" prop="totalSalary">
                                <a-input v-model="addForm.totalSalary" type="number" placeholder="请输入工资单总金额"/>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="工资单总笔数" prop="totalNum">
                                <a-input v-model="addForm.totalNum" type="number" placeholder="请输入工资单总笔数"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="24" class="upload-wrapper">
                            <a-form-model-item label="请上传工资单" prop="fileUrlList">
                                <a-upload
                                    :action="`${$fileUrl}/salaryFiles`"
                                    @change="handleChangeFile"
                                    :before-upload="beforeImgUpload"
                                    :default-file-list="addForm.fileUrlList"
                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.xlsx,.xls,.doc,.docx"
                                >
                                    <a-button type="primary"> <a-icon type="upload" /> 添加文件 </a-button>
                                </a-upload>
                                <a class="download-wrapper" @click="$newExportsExcel(`${$fileUrl}/model/downloadModel/1`, '批量代付明细账单模板', false)">批量代付明细账单模板下载</a>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model>  
        </a-modal>
    </page-header-wrapper>
</template>
<script>
import { getWorkerSalaryPayrollList, getContractList, getCompanyName, addPayroll, editPayroll, deletePayroll, getPayrollDetail, getCompMsgData } from '@/api/worker'
import moment from 'moment'
import { fileUrl } from '@/utils/request'
import * as XLSX from 'xlsx'
import storage from 'store'
import request from '@/utils/request'
import axios from 'axios'
const columns = [
    {
        title: '序号',
        scopedSlots: { customRender: 'serial' },
        width: '100px'
    },
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
        title: '合同乙方公司名称',
        dataIndex: 'companyBName',
        key: 'companyBName',
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
        width: '250px',
        fixed: 'right'
    },
]

export default {
    data () {
        this.columns = columns
        return {
            advanced: false,
            queryParam: {
                salaryName: '',
                contractName: ''
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
                salaryName: '',
                contractName: '',
                companyAName: '',
                companyBName: '',
                contractCode: '',
                month: '',
                totalSalary: '',
                totalNum: '',
                fileUrlList: []
            },
            rules: {
                // salaryName: [{ required: true, message: '请输入工资单名称', trigger: 'change' }],
                // contractName: [{ required: true, message: '请选择合同名称', trigger: 'change' }],
                // month: [{ required: true, message: '请选择工资单月份', trigger: 'change' }],
                // totalSalary: [{ required: true, message: '请输入工资单总金额', trigger: 'change' }],
                // totalNum: [{ required: true, message: '请输入工资单总笔数', trigger: 'change' }],
                // fileUrlList: [{ required: true, message: '请上传工资单', trigger: 'change' }],
            },
            companySelect: [],
            workerSalaryList: [],
            fileUrl,
            isEdit: false,
            cacheId: null,
            companyBNameList: [],
            contractNum: ''
        }
    },
    mounted() {
        this.getSalaryList()
        this.getContractInfo()
        let projectIDLv3 = localStorage.getItem('projectIDLv3')
        let data = {
            projectIDLv3
        }
        getCompMsgData(data).then(res => {
            this.companyBNameList = res
        })
    },
    methods: {
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
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
            this.companySelect = companyContractList
            console.log(companyContractList)
        },
        getSalaryList() {
            this.loading = true
            let reqObj = {
                contractName: this.queryParam.contractName,
                salaryName: this.queryParam.salaryName,
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                projectIDLv3: localStorage.getItem('projectIDLv3')
            }
            getWorkerSalaryPayrollList(reqObj).then(res => {
                if(res.status == 1 && res.data) {
                    this.loadData = res.data.pageList
                    this.pagination.total = res.data.rowCount
                    this.loading = false
                }
            })
        },
        getContractInfo() {
            // getContractList().then(res => {
            //     this.companySelect = res
            // })
        },
        handleSearchClick() {
            this.getSalaryList()
        },
        handleAddClick() {
            this.addForm = {}
            // this.addForm.fileUrlList = []
            // this.addForm.salaryName = ''
            // this.addForm.contractName = ''
            // this.addForm.companyAName = ''
            // this.addForm.companyBName = ''
            // this.addForm.contractCode = ''
            // this.addForm.month = ''
            // this.addForm.totalSalary = ''
            // this.addForm.totalNum = ''
            this.isAddVisible = true
            this.isEdit = false
            // this.$forceUpdate()
        },
        handleContractNameChange(value) {
            console.log(value)
            let itemData = this.companySelect.filter(
                v => {
                     return value === v.contractCode
                }
            )
            this.addForm.contractName = itemData[0].contractName
            this.contractNum = itemData[0].amount
            this.$forceUpdate()
            getCompanyName(value).then(res => {
                console.log(res)
                if(res.status == 1 && res.data) {
                    this.addForm.companyAName = res.data
                    this.$forceUpdate()
                }
            })
        },
        handlePayrollOnSubmitClick(e) {
            e.preventDefault()
            this.$refs.ruleForm.validate(valid => {
                if(valid) {
                    let reqObj = Object.assign({}, this.addForm)
                    let resultFile = ''
                    reqObj.fileUrlList && reqObj.fileUrlList.map(v => {
                            resultFile += v.name + '#' + v.response.data + ','
                        })
                    reqObj.salaryDetails = resultFile
                    reqObj.totalNum = Number(reqObj.totalNum)
                    reqObj.totalSalary = Number(reqObj.totalSalary)
                    reqObj.month = moment(reqObj.month).format('YYYY-MM')
                    reqObj.workerSalaryList = this.workerSalaryList
                    reqObj.projectIDLv3 = localStorage.getItem('projectIDLv3')
                    delete reqObj.fileUrlList
                    if(!this.isEdit) {
                        console.log(reqObj)
                        addPayroll(reqObj).then(res => {
                            if(res.status == 1) {
                                this.isAddVisible = false
                                this.$message.success(res.data)
                                this.getSalaryList()
                                window.location.reload()
                            } else {
                                this.isAddVisible = false
                                this.$message.error(res.data)
                            }
                        }) 
                    } else {
                        reqObj.id = Number(this.cacheId)
                        editPayroll(reqObj).then(res => {
                            if(res.status == 1) {
                                this.isAddVisible = false
                                this.isEdit = false
                                this.$message.success(res.data)
                                this.getSalaryList()
                                window.location.reload()
                            } else {
                                this.isAddVisible = false
                                this.isEdit = false
                                this.$message.error(res.data)
                            }
                        })
                    }
                    

                } else {
                    return false
                }
            })
        },
        handlePayrollCancelClick() {
            this.isAddVisible = false
        },
                
        handleDownloadClick(scope) {
            this.$newExportsExcel('https://203.110.222.136:13448/api/files?fileId=group1/M00/00/23/rBEIKGSRaRGAVP54AAArt3yN1nI44.xlsx&flag=true', '安全页面表格.xlsx')
            // let anchor = document.createElement('a')
            // let herf = 'https://203.110.222.136:13448/api/files?fileId=group1/M00/00/23/rBEIKGSRaRGAVP54AAArt3yN1nI44.xlsx&flag=true'//`${fileUrl}/files?fileId=${scope.salaryDetails.split(',')[0].substring(scope.salaryDetails.lastIndexOf('\#') + 1, scope.salaryDetails.length)}&flag=true` 
            // let token = 'eyJhbGciOiJFUzI1NiJ9.eyJqdGkiOiJlYzYxOTUxZi1jYzJlLTQ5OGUtOGU1NC0wZGY4ZjU4NmY0NzkiLCJzdWIiOiIiLCJpZCI6IjEiLCJpYXQiOjE2OTE0MDI5OTIsImV4cCI6MTY5MTQwNjU5Mn0.czoKKE6ojjjbYwf0iWwNG7SUjD68ZgOtHnT_lkOWSp-l3-IIs6vPf8JYgjZoiHxDU-Tc5Bh6J41EphmeRuNs7Q'
            // axios.get(
            //     herf,
            //     {
            //         responseType: 'blob',
            //         headers: {
            //             Token: token
            //         }
            //     }
            // ).then(res => {
            //     console.log(res)
            //     let ObjectUrl = window.URL.createObjectURL(res.data)
            //     anchor.href = ObjectUrl
            //     anchor.download = '文件.xlsx'
            //     anchor.click()
            //     window.URL.revokeObjectURL(ObjectUrl)
            // })
        },
        handleEditClick(scope) {
            console.log(scope)
            this.isAddVisible = true
            this.isEdit = true
            getPayrollDetail(scope.id).then(res => {
                if(res.status == 1 && res.data) {
                    this.workerSalaryList = res.data.workerSalaryList ? res.data.workerSalaryList : []
                }
            })
            this.addForm.salaryName = scope.salaryName
            this.addForm.contractName = scope.contractName
            this.addForm.contractCode = scope.contractCode
            this.addForm.companyAName = scope.companyAName
            this.addForm.companyBName = scope.companyBName
            this.addForm.month = moment(scope.month, 'YYYY-MM')
            this.addForm.totalSalary = scope.totalSalary
            this.addForm.totalNum = scope.totalNum
            this.addForm.fileUrlList = []
            this.cacheId = scope.id
            let file = scope.salaryDetails && scope.salaryDetails.substr(0, scope.salaryDetails.length - 1).split(',')
            file && file.map((item, index) => {
                let files = {}
                files.uid = String(index)
                let num = item.lastIndexOf('\#')
                files.name =  item.substring(0, num)
                files.url = item.substring(num + 1, item.length) 
                console.log(files.url)
                // files.name = item.split('#')[0]
                // files.url = item.split('#')[1]
                files.status = 'done'
                files.response = { 'status':'done', data: files.url }
                this.addForm.fileUrlList.push(files)
            })
        },
        handleDeleteClick(scope) {
            console.log(scope)
            deletePayroll(scope.id).then(res => {
                if(res.status == 1) {
                    this.$message.success(res.data)
                    this.getSalaryList()
                } else {
                    this.$message.error(res.data)
                }
            })
        },
        handlePageChange(page, pageSize) {
            this.pagination.current = page
        },
        handleShowSizeChange(current, size) {
            this.pagination.pageSize = size
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
    }
}
</script>
<style lang="less">
.payroll-page-search-wrapper{
    .add{
        height: 32px;
        width: 80px;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .ant-form-item {
      .ant-form-item-control {
          width: 280px!important;
      }
    }
}
.addPayrollModal{
  .ant-modal-content{
    // width: 1000px;
    // margin-left: -120px;
    .ant-radio-group{
      width: 400px;
    }
    .ant-form-item-label{
        width: 220px!important;
      }
    .ant-form-item {
      .ant-form-item-control {
        .ant-calendar-picker-input.ant-input {
          width: 232px;
        }
      }
    } 
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
      .ant-form-item-label{
        width: 220px!important;
      }
  }
  .ant-modal-content{
    .upload-wrapper-settle{
        .ant-form-item-label{
            width: 280px!important;
        }
    }
  }
  .ant-modal-body{
    .upload-wrapper{
        position: relative!important;
        a.download-wrapper{
            position: absolute!important;
            top: -12px!important;
            right: 130px!important;
        }
    }
  }
  .footer-wrapper{
      width: 100%;
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
     
       