<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="ios-pulse-strong"></Icon>
                    报表汇总
                </p>
                <Form :label-width="100">
                    <Row>
                        <Col span="8">
                            <FormItem label="商家ID"><strong>{{detailform.mc_id}} </strong></FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="结算日期"><strong>{{detailform.balance_day}}</strong></FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="结算状态"><strong>{{detailform.status}}</strong></FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="总金额"><strong>{{detailform.total_price/100}}（元） </strong></FormItem>
                        </Col>
                        <Col span='8'>
                            <FormItem label="抽成金额"><strong>{{detailform.cut_price/100}}（元）</strong></FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="结算金额"><strong>{{detailform.actual_price/100}}（元）</strong></FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Row>
        <Row style="margin-top: 10px;">
            <Card>
                <p slot="title">
                    <Icon type="clipboard"></Icon>
                    订单详情
                </p>
                <Table :data="data" :columns="columns" border></Table>
            </Card>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'finance_info',
        data () {
            return {
                reportId: '',
                columns: [
                    {
                        key: 'order_id',
                        align: 'center',
                        title: '订单编号'
                    },
                    {
                        key: 'price',
                        align: 'right',
                        title: '订单金额',
                        render: (h, params) => {
                            const row = params.row;
                            const money = (row.price / 100).toFixed(2);

                            return h('strong', money);
                        }
                    },
                    {
                        key: 'cut_price',
                        align: 'right',
                        title: '抽成金额',
                        render: (h, params) => {
                            const row = params.row;
                            const money = (row.cut_price / 100).toFixed(2);

                            return h('strong', money);
                        }
                    },
                    {
                        key: 'actual_price',
                        align: 'right',
                        title: '实际结算金额',
                        render: (h, params) => {
                            const row = params.row;
                            const money = (row.actual_price / 100).toFixed(2);

                            return h('strong', money);
                        }
                    },
                    {
                        key: 'complete_time',
                        align: 'center',
                        title: '订单完成时间'
                    }
                ],
                data: [],
                detailform: {
                    mc_id: '',
                    balance_day: '',
                    status: '',
                    total_price: '',
                    cut_price: '',
                    actual_price: ''
                }
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.reportId = this.$route.params.reportId;
                this.getDetail();
            },
            getDetail () {
                this.$http.get('/finance/detail?report_id=' + this.reportId).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            console.log(resp)
                            this.detailform.mc_id = resp.data.record.mc_id;
                            this.detailform.balance_day = resp.data.record.balance_day;
                            this.detailform.status = resp.data.record.status === 1 ? '已结算' : '未结算';
                            this.detailform.total_price = resp.data.record.total_price;
                            this.detailform.cut_price = resp.data.record.cut_price;
                            this.detailform.actual_price = resp.data.record.actual_price;

                            if (resp.data.details) {
                                this.data = resp.data.details;
                            }
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            }
        }
    };
</script>
