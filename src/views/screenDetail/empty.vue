<template>
    <div class="empty-wrapper">
        <img src="../../assets/warning-icon.png" style=""/>
        <span>暂无告警</span>
    </div>
</template>
<script>
export default {
    props: {
        text: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="less" scoped>
.empty-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
        width: 80px;
        height: 80px;
    }
    span{
        margin-top: 20px;
        font-size: 0.11rem;
    }
}
</style>