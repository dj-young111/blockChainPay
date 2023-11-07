<template>
  <div class="home-container">
    <div class="home-title"></div>
    <div class="home-options">
      <div class="options-row">
        <div class="item">中电建建筑集团二标段</div>
        <div class="item">中电建建筑集团四标段</div>
        <div class="item">水电四局三标段</div>
        <div class="item">水电五局四标段</div>
        <div class="emprty"></div>
      </div>
      <div class="options-row second">
        <div class="item">水电七局一标段</div>
        <div class="item">水电七局三标段</div>
        <div class="item">水电八局三标段</div>
        <div class="item">水电八局四标段</div>
        <div class="item" @click="handleClick">水电九局四标段</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home",
  methods: {
    handleClick() {
      this.$router.push({ path: '/screenAbout' })
    }
  },
  mounted() {
    this.handleClick()
  }
};
</script>
<style lang="less" scoped>
.home-container{
  width: 100%;
  height: 100vh;
  background: url('../../assets/bg-img.png') no-repeat;
  background-size: 100% 100%;
  .home-title{
    width: 100%;
    height: 123px;
    background: url('../../assets/home-title.png') no-repeat;
    background-size: 100% 100%;
  }
  .home-options{
    width: 90%;
    height: 188px;
    margin: 0 auto!important;
    border-bottom: 2px dashed #214B67;
    display: flex;
    flex-direction: column;
    .options-row{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding-top: 29px!important;
      .item{
        width: 227px;
        height: 40px;
        margin: 0px 40px!important;
        font-size: 16px;
        font-family: MiSans;
        font-weight: 500;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/item-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      .item:hover{
        cursor: pointer;
        background: url('../../assets/item-bg-active.png') no-repeat;
        background-size: 100% 100%;
      }
      .emprty{
        width: 227px;
        height: 40px;
        margin: 0px 40px!important;
        background: none;
      }
      .empaty:hover{
        background: none !important;
      }
    }
    .second{
      margin-top: 10px!important;
    }
  }
}
</style>
