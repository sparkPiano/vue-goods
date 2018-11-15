<template>
    <Table :height="280" :columns="columns" :data="data" border></Table>
</template>
<script>
    export default {
        name: 'customTable',
        data() {
            return {
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        key: 'nick',
                        title: '昵称',
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        key: 'amount',
                        title: '消费金额',
                        align: 'right',
                        width: 120,
                    },
                    {
                        key: 'sname',
                        title: '店铺名称',
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        key: 'num',
                        title: '消费次数',
                        align: 'right',
                        width: 70
                    }
                ],
                data: []
            };
        },
        props: {
            tableData: Array,
            height: String
        },
        methods: {
            getData(url, param) {
                this.$http.get(url, {
                    params: param
                }).then(
                    function (res) {
                        if (res.data.code = '000') {
                            this.data = res.data.record;
                        }
                    }.bind(this)
                );
            }
        },
        mounted() {
        },
        created() {
        }
    };
</script>
