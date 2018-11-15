<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="android-list"></Icon>
                    订单基本信息
                </p>
                <Form :label-width="100">
                    <Row>
                        <Col span="6">
                            <FormItem label="订单编号"><strong>{{orderform.order_id}} </strong></FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="订单标题"><strong>{{orderform.order_title}}</strong></FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="买家ID"><strong>{{orderform.user_id}} </strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="交易单号"><strong>{{orderform.trans_num}}</strong></FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                            <FormItem label="商品总价"><strong>{{orderform.total_price/100}}（元）</strong></FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="实际支付金额"><strong>{{orderform.actual_price/100}}（元）</strong></FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="支付方式"><strong>{{orderform.pay_type}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="支付状态"><strong>{{orderform.pay_status}}</strong></FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='6'>
                            <FormItem label="订单状态"><strong>{{orderform.order_status}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="收货人姓名"><strong>{{orderform.rp_name}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="收货人电话"><strong>{{orderform.rp_mobile}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="收货地址"><strong>{{orderform.rp_addr}}</strong></FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='6'>
                            <FormItem label="物流公司"><strong>{{orderform.exp_company}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="物流单号"><strong>{{orderform.exp_num}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="创建时间"><strong>{{orderform.create_time}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="付款时间"><strong>{{orderform.pay_time}}</strong></FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='6'>
                            <FormItem label="发货时间"><strong>{{orderform.accept_time}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="送达时间"><strong>{{orderform.confirm_time}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="完成时间"><strong>{{orderform.complete_time}}</strong></FormItem>
                        </Col>
                        <Col span='6'>
                            <FormItem label="买家留言"><strong>{{orderform.order_remark}}</strong></FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title">
                    <Icon type="clipboard"></Icon>
                    订单明细
                </p>
                <Table :data="data" :columns="columns" border></Table>
            </Card>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'order_info',
        data () {
            return {
                orderId: '',
                columns: [
                    {
                        key: 'goods_title',
                        align: 'center',
                        title: '商品名称',
                        ellipsis: true
                    },
                    {
                        key: 'goods_spec',
                        align: 'center',
                        title: '规格',
                        render: (h, params) => {
                            const row = params.row;
                            if (row.goods_spec) {
                                return h('span', row.goods_spec);
                            } else {
                                return h('span', '无');
                            }
                        }
                    },
                    {
                        key: 'unit_price',
                        align: 'right',
                        title: '单价(元)',
                        render: (h, params) => {
                            const row = params.row;
                            const money = (row.unit_price / 100).toFixed(2);

                            return h('strong', money);
                        }
                    },
                    {
                        key: 'amount',
                        align: 'right',
                        title: '数量'
                    },
                    {
                        key: 'total_price',
                        align: 'right',
                        title: '总价(元)',
                        render: (h, params) => {
                            const row = params.row;
                            const money = (row.total_price / 100).toFixed(2);

                            return h('strong', money);
                        }
                    }
                ],
                data: [],
                orderform: {}
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.orderId = this.$route.params.orderId;
                this.getDetail();
            },
            getDetail () {
                this.$http.get('/order/detail?order_id=' + this.orderId).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            if (resp.data.record) {
                                this.orderform = resp.data.record;
                                switch (this.orderform.pay_status) {
                                    case 0:
                                        this.orderform.pay_status = '未支付';
                                        break;
                                    case 1:
                                        this.orderform.pay_status = '已支付';
                                        break;
                                    case 2:
                                        this.orderform.pay_status = '支付失败';
                                        break;
                                    default:
                                        this.orderform.pay_status = this.orderform.pay_status;
                                }

                                switch (this.orderform.pay_type) {
                                    case 0:
                                        this.orderform.pay_type = '未支付';
                                        break;
                                    case 1:
                                        this.orderform.pay_type = '支付宝';
                                        break;
                                    case 2:
                                        this.orderform.pay_type = '微信';
                                        break;
                                    case 3:
                                        this.orderform.pay_type = '敬老卡';
                                        break;
                                    default:
                                        this.orderform.pay_type = this.orderform.pay_type;
                                }

                                switch (this.orderform.order_status) {
                                    case 0:
                                        this.orderform.order_status = '待付款';
                                        break;
                                    case 1:
                                        this.orderform.order_status = '待发货';
                                        break;
                                    case 2:
                                        this.orderform.order_status = '已发货';
                                        break;
                                    case 3:
                                        this.orderform.order_status = '已送达';
                                        break;
                                    case 4:
                                        this.orderform.order_status = '已完成';
                                        break;
                                    case 5:
                                        this.orderform.order_status = '退款中';
                                        break;
                                    case 6:
                                        this.orderform.order_status = '已退款';
                                        break;
                                    case 7:
                                        this.orderform.order_status = '已取消';
                                        break;
                                    default:
                                        this.orderform.order_status = this.orderform.order_status;
                                }
                            }
                            if (resp.data.detail) {
                                this.data = resp.data.detail;
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
