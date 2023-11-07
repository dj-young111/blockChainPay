<template>
    <page-header-wrapper>
        <a-card :bordered="false">
            <div class="system-log-wrapper">
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
                </a-table>
            </div>
        </a-card>
    </page-header-wrapper>
</template>
<script>
import moment from 'moment'
const columns = [
    {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: '15%'
    },
    {
        title: '手机号码',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: '15%'
    },
    {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: '15%'
    },
    {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
        width: '15%'
    },
]
export default {
    data () {
        this.columns = columns
        return {
            loading: false,
            loadData: [
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: '登入',
                    date: '2022/7/27 16:30:15'
                },
                {
                    userName: '林晨',
                    phoneNumber: '13995560080',
                    operator: '登出',
                    date: '2022/7/27 15:40:00'
                },
                {
                    userName: '李宝阔',
                    phoneNumber: '18910485853',
                    operator: '登入',
                    date: '2022/7/27 15:37:21'
                },
                {
                    userName: '赵凯',
                    phoneNumber: '13699543174',
                    operator: '登入',
                    date: '2022/7/27 14:56:09'
                },
                {
                    userName: '高俊',
                    phoneNumber: '13808074037',
                    operator: '登出',
                    date: '2022/7/27 14:45:32'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: '登出',
                    date: '2022/7/27 14:29:43'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: '登入',
                    date: '2022/7/27 14:10:35'
                },
            ],
            pagination: {

            }
        }
    },
    created() {
        // this.loadData = []
    },
    mounted () {
        let newUserName = window.localStorage.getItem('userName').replace(/"/g, '')
        let newDate = moment().format('YYYY/MM/DD HH:mm:ss')
        let newPhoneNo = window.localStorage.getItem('phoneNo').replace(/"/g, '')
        let oper = '登入'
        let strObj = {
            userName: newUserName,
            date: newDate,
            phoneNumber: newPhoneNo,
            operator: oper
        }
        this.loadData.unshift(strObj)
    },
    methods: {

    }
}
</script>