<template>
  <div class="main">
    <div class="project-list">
      <div class="list-item" v-for="(item,index) in data" v-bind:key='index' @click="go(item)">
        <div class="title">
          <img src="../../assets/company.png" alt="">
          <span>{{item.projectName}}</span>
        </div>
        <div class="msg">业主单位：{{item.ownerName}}</div>
        <div class="msg">总包单位：{{item.generalName}}</div>
        <div class="msg">合同数量：{{item.contractNum}}个</div>
        <div class="msg">合同总金额：{{item.contractTotalAmount}}万元</div>
      </div>
      <div class="add-project">
        <div class="add" @click="addProject">
          <img src="../../assets/star.png" alt="">
          <div>关联项目</div>
        </div>
      </div>
    </div>
    <a-modal v-model="visible" class="addModal" title="关联项目" @ok='handleClick'>
      <a-row :gutter="24" class="modal-row">
          <div class="content-item">
            <span class="item-name">项目名称：</span>
            <a-select
              show-search
              :value="value"
              placeholder="输入项目名称"
              style="width: 200px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch"
              @change="handleChange"
            >
              <a-select-option v-for="d in list" :key="d.projectIDLv3">
                {{ d.projectName }}
              </a-select-option>
            </a-select>
          </div>  
        </a-row>
      
        <a-row :gutter="24" class="modal-row" v-if="selectProject.ownerName">
          <div class="content-item">
            <span class="item-name">业主单位：</span>
            <span>{{ selectProject.ownerName }}</span>
          </div>  
        </a-row>
        <a-row :gutter="24"  class="modal-row" v-if="selectProject.ownerName">
          <div class="content-item">
            <span class="item-name"> 总包单位：</span>
            <span>{{ selectProject.generalName }}</span>
          </div>  
        </a-row>
      <!-- <div class="footer-wrapper">
        <a-button type="primary" @click="handleClick">确定</a-button>
      </div> -->
    </a-modal>
  </div>
</template>

<script>
import { getUserList, getUserSearchList, getUserbindList } from '@/api/projectList3'

export default {
  components: {
  },
  data () {
    return {
      data: [],
      visible: false,
      list: [],
      value: undefined,
      selectProject: {}
    }
  },
  mounted() {
    if (localStorage.getItem('roleId') === '99') {
      localStorage.removeItem('projectIDLv3')
      localStorage.removeItem('projectName')
      this.$router.replace('/workbench')
    } else {
      this.getDataList()
    }
    
  },
  methods: {
    go(item) {
      localStorage.setItem('projectIDLv3', item.projectIDLv3)
      localStorage.setItem('projectName', item.projectName)
      this.$router.replace('/workbench')
    },
    getDataList() {
      getUserList().then(res => {
        this.data = res.data
        this.data.map(v => {
          v.generalName = v.generalName.join(',')
        })
      })
    },
    addProject() {
      this.visible = true
    },
    handleClick() {
      console.log(this.value)
      getUserbindList(this.value).then(res => {
        if (res.status === 1) {
          this.$message.success('关联项目成功')
          this.getDataList()
          this.visible = false
        }
      })
    },
    handleSearch(value) {
      let params = {
        name: value
      }
      getUserSearchList(params).then(res => {
        this.list = res.data
      })
    },
    handleChange(value) {
      console.log(value);
      this.value = value;
      let arr = this.list.filter(v => {
        return v.projectIDLv3 === value
      })
      arr[0].generalName = arr[0].generalName.join(',')
      this.selectProject = arr[0]
    },
  },
  beforeDestroy() {
      
  }
}
</script>

<style lang="less" >
  .content-item {
      display: flex;
      align-items: center;
      margin-left: 20px;
      margin-bottom: 10px;
      .item-name {
        font-size: 16px;
        color: #333;
      }
    }
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .project-list {
      width: 77%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 100px;
      .list-item {
        width: 432px;
        height: 256px;
        // margin-right: 63px;
        background: rgba(255,255,255,0.39);
        box-shadow: 0px 3px 6px rgba(150,150,150,0.22);
        opacity: 1;
        border-radius: 15px;
        padding: 37px 38px 29px 44px;
        cursor: pointer;
        margin-bottom: 40px;
        .title {
          font-size: 20px;
          font-family: MiSans;
          font-weight: 600;
          line-height: 27px;
          color: #3A7FF5;
          margin-bottom: 28px;
          img {
            width: 15px;
            height: 15px;
            margin-right: 10px;
          }
        }
        .msg {
          font-size: 16px;
          font-family: MiSans;
          font-weight: 500;
          line-height: 26px;
          color: #626262;
        }
      }
      
    }
    .add-project {
      width: 432px;
      height: 256px;
      background: rgba(237,245,252,0.79);
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      .add {
        width: 179px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(68,144,223,1);
        font-size: 20px;
        font-family: MiSans;
        font-weight: 600;
        line-height: 27px;
        color: #FFFFFF;
        cursor: pointer;
        img {
          width: 15px;
          margin-right: 6px;
        }
      }
    }
    
  }

</style>
