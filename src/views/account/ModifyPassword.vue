<template>
    <page-header-wrapper>
        <a-form ref="modifyForm" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" class="modifyForm" @submit="handleSubmitClick">
            <a-form-item class="item-title">
                <span>修改密码</span>
            </a-form-item>
            <a-form-item label="原始密码" class="item">
                <a-input-password 
                    size="large"
                    placeholder="请输入原始密码"
                    v-decorator="[
                        'password',
                        {rules: [{ required: true, message: '请输入原始密码' }], validateTrigger: 'blur'}
                    ]"
                />
            </a-form-item>
            <a-form-item label="新密码" class="item">
                <a-input-password
                    size="large"
                    placeholder="8-16位，需包含大小写字母、数字、特殊符号"
                    v-decorator="[
                        'newPassword',
                        {rules: [{ required: true, message: '请输入新密码' }, { validator: passwordValidator }], validateTrigger: 'blur'}
                    ]"
                />
            </a-form-item>
            <a-form-item class="item-button">
                <a-button
                    size="large"
                    class="btn"
                    @click="handleResetClick"
                >
                    重置
                </a-button>
                <a-button
                    size="large"
                    type="primary"
                    class="btn"
                    htmlType="submit"
                >确定</a-button>
            </a-form-item>
        </a-form>
    </page-header-wrapper>
</template>
<script>
import { setModifyPassword } from '@/api/modifyPassword'
import notification from 'ant-design-vue/es/notification'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
    data () {
        return {
            form: this.$form.createForm(this)
        }
    },
    methods: {
        handleSubmitClick(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let reqObj = {
                        ...values,
                        phoneNo: JSON.parse(window.localStorage.getItem('phoneNo'))
                    }
                    setModifyPassword(reqObj).then(res => {
                        if(res.status == 1 && res.data) {
                            const data = res.data
                            if(data.status == -1) {
                                this.$message.error(data.message)
                                this.form.resetFields()
                            } else {
                                this.$message.success(data.data)
                                setTimeout(() => {
                                    storage.set(ACCESS_TOKEN, '')
                                    window.location.reload()
                                }, 600)
                            }
                            
                        }
                    })
                } else {
                    
                }
            });
        },
        handleResetClick() {
            this.form.resetFields()
        },
        passwordValidator(rule, value, callback) {
            console.log(value)
            let reg = /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,16}$))/
            if(reg.test(value)) {
                callback()
            } else {
                callback('请输入8-16位，需包含大小写字母、数字、特殊符号')
            }
        }
    }
}
</script>
<style lang="less">
.modifyForm{
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 45px;
    .item-title{
        width: 600px;
        margin-left: 90px;
        font-size: 16px;
        font-weight: 600;
    }
    .item{
        width: 600px;
    }
    .item-button{
        width: 600px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .btn{
            height: 40px;
            width: 80px;
            margin: 0px 20px;
            font-size: 14px;
        }
    }
}
</style>