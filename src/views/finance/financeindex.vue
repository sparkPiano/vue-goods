<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Col span="24">
                <Card class="set_store">
                    <p slot="title">
                        <Icon type="social-yen"></Icon>
                        财务结算
                    </p>
                    <Row>
                        <Form ref="searchform" :model="searchform" inline>
                            <FormItem label="结算月" :label-width="60">
                                <DatePicker type="month" placeholder="选择日期"
                                            @on-change="dateChange"></DatePicker>
                            </FormItem>
                            <FormItem style="padding-left: -20px;">
                                <Button @click="search" type="primary" icon="search">搜索</Button>
                                <Button @click="cancelSearch" type="ghost">取消</Button>
                            </FormItem>
                            <FormItem>
                                <div style="color:red;margin-top:10px;">注意：每月1号、16号为账单结算日期</div>
                            </FormItem>
                        </Form>
                    </Row>
                    <Row>
                        <Table :data="data" :columns="columns" border></Table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total.sync="total" :page-size="pageSize" :current.sync="pageNumber"
                              @on-change="setPageNum"
                              show-elevator show-total show-sizer @on-page-size-change="setPageSize"></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'finance_index',
        data () {
            return {
                pageSize: 20,
                total: 0,
                pageNumber: 1,
                height: 590,
                data: [
                    {
                        total_price: 1234,
                        cut_price: 2.22,
                        actual_price: 3333,
                        status: '0',
                        balance_day: '2018-04-09'
                    }
                ],
                searchform: {
                    balance_day: ''
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        key: 'total_price',
                        align: 'center',
                        title: '总金额',
                        ellipsis: true
                    },
                    {
                        key: 'cut_price',
                        align: 'center',
                        title: '抽成金额',
                        width: 120
                    },
                    {
                        key: 'actual_price',
                        align: 'center',
                        title: '实际结算金额',
                        width: 120
                    },
                    {
                        title: '结算标志',
                        align: 'center',
                        key: 'status',
                        render (h, params) {
                            const row = params.row;
                            if (row.status === '0') {
                                return '未结算';
                            } else {
                                return '已结算';
                            }
                        }
                    },
                    {
                        key: 'balance_day',
                        align: 'center',
                        title: '报表生成日期',
                        width: 120
                    },
                    {
                        key: 'op',
                        align: 'center',
                        title: '操作',
                        width: 220,
                        render: (h, params) => {
                            let row = params.row;
                            if (row.status) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {reportId: row.report_id};
                                                this.$router.push({
                                                    name: 'finance_info',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '明细')
                                ]);
                            }
                        }
                    }
                ]
            };
        },
        methods: {
            search () {
                this.getData();
            },
            cancelSearch () {
                this.searchform.balance_day = '';
                this.getData();
            },
            getData () {
                let params = this.searchform;
                params['pageNumber'] = this.pageNumber;
                params['pageSize'] = this.pageSize;
                this.$http.get('/finance/list', {
                    params: params
                }).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.data = resp.data.result;
                            this.total = resp.data.total;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this));
            },
            setPageSize (size) {
                this.pageSize = size;
                this.getData();
            },
            dateChange (value) {
                this.searchform.balance_day = value;
            },
            setPageNum (num) {
                this.pageNumber = num;
                this.getData();
            }
        },
        mounted () {
            this.getData();
        }
    };
</script>