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
        title: '应用模块',
        dataIndex: 'operator',
        key: 'operator',
        width: '15%'
    },
    {
        title: '记录',
        dataIndex: 'record',
        key: 'record',
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
                    operator: 'user',
                    record: '该用户已经冻结，请联系管理员！',
                    date: '2022/7/27 16:45:06'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: 'user',
                    record: '账户或密码错误！',
                    date: '2022/7/27 16:44:09'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: 'user',
                    record: '账户或密码错误！',
                    date: '2022/7/27 16:42:35'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: 'user',
                    record: '账户或密码错误！',
                    date: '2022/7/27 16:42:07'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: 'user',
                    record: '账户或密码错误！',
                    date: '2022/7/27 16:41:43'
                },
                {
                    userName: '系统运维员2',
                    phoneNumber: '18649121617',
                    operator: 'user',
                    record: '账户或密码错误！',
                    date: '2022/7/27 16:40:28'
                }
            ],
            pagination: {

            }
        }
    },
    methods: {

    }
}
</script>