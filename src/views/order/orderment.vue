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
                        <Icon type="social-buffer-outline"></Icon>
                        订单管理
                    </p>
                    <Row>
                        <Form ref="searchForm" :model="searchform" inline>
                            <FormItem label="订单编号" :label-width="60">
                                <Input v-model="searchform.order_id" placeholder="请输入订单编号查询"/>
                            </FormItem>
                            <FormItem label="订单状态" :label-width="60">
                                <Select v-model="searchform.order_status" placeholder="请选择" style="width:150px;">
                                    <Option v-for="item in failures" :value="item.value" :key="item.value">{{item.label
                                        }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="支付方式" :label-width="60">
                                <Select v-model="searchform.pay_type" placeholder="请选择" style="width:150px;">
                                    <Option v-for="item in ways" :value="item.value" :key="item.value">{{item.label
                                        }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem style="padding-left: -20px;">
                                <Button @click="search" type="primary" icon="search">搜索</Button>
                                <Button @click="cancelSearch" type="ghost">取消</Button>
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
        <Modal v-model="showAdd" @on-ok="save" @on-cancel="cancel" :title.sync="modalTitle1" width="800" scrollable>
            <Form :label-width="80">
                <Card>
                    <p slot="title">
                        买家信息
                    </p>
                    <Row>
                        <Col span="12">
                            <FormItem label="买家ID"><strong>{{Refundform.user_id}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="昵称"><strong>{{Refundform.mc_id}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系电话"><strong>{{Refundform.mc_id}}</strong></FormItem>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <Form style="margin-top: 20px;" :label-width="80">
                <Card>
                    <p slot="title">
                        收件人信息
                    </p>
                    <Row>
                        <Col span="12">
                            <FormItem label="收件人姓名"><strong>{{Refundform.rp_name}} </strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="收件人电话"><strong>{{Refundform.rp_mobile}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="收件人地址"><strong>{{Refundform.rp_addr}}</strong></FormItem>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <Form style="margin-top: 20px;" :label-width="90">
                <Card>
                    <p slot="title">
                        订单信息
                    </p>
                    <Row>
                        <Col span="24">
                            <FormItem label="订单标题"><strong>{{Refundform.order_title}} </strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="订单编号"><strong>{{Refundform.order_id}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="订单状态"><strong>{{Refundform.order_status}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="支付金额"><strong>{{Refundform.total_price}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="支付方式"><strong>{{Refundform.mc_id}}</strong></FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="退款原因"><strong>{{Refundform.cancel_reason}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="申请退款时间"><strong>{{Refundform.refund_apply_time}}</strong></FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="退款金额(元)"><strong>{{Refundform.refund_price}}</strong></FormItem>
                        </Col>
                        <Row slot="footer">
                            <Button type="text" @click="cancel">取消</Button>
                            <Button type="primary" @click="save">确定</Button>
                        </Row>
                    </Row>
                </Card>
            </Form>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'order_index',
        data () {
            return {
                modalTitle1: '退款详情',
                showAdd: false,
                reportId: '',
                Refundform: {
                    user_id: '',
                    rp_name: '',
                    rp_mobile: '',
                    rp_addr: '',
                    order_title: '',
                    order_id: '',
                    order_status: '',
                    cancel_reason: '',
                    refund_apply_time: '',
                    total_price: '',
                    refund_price: ''
                },
                pageSize: 20,
                total: 0,
                pageNumber: 1,
                height: 590,
                data: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        key: 'order_id',
                        align: 'center',
                        title: '订单编号',
                        ellipsis: true
                    },
                    {
                        key: 'order_title',
                        align: 'center',
                        title: '订单标题',
                        ellipsis: true,
                        width: 120
                    },
                    {
                        key: 'user_id',
                        align: 'center',
                        title: '买家ID',
                        width: 120
                    },
                    {
                        key: 'total_price',
                        align: 'center',
                        title: '订单金额',
                        width: 120
                    },
                    {
                        key: 'source',
                        align: 'center',
                        title: '订单来源',
                        width: 120
                    },
                    {
                        title: '订单状态',
                        align: 'center',
                        key: 'order_status',
                        render: (h, params) => {
                            const row = params.row;
                            if (row.order_status === 0) {
                                return '待支付';
                            } else if (row.order_status === 1) {
                                return '代发货';
                            } else if (row.order_status === 2) {
                                return '已发货';
                            } else if (row.order_status === 3) {
                                return '已送达';
                            } else if (row.order_status === 4) {
                                return '已完成';
                            } else if (row.order_status === 5) {
                                return '退款中';
                            } else if (row.order_status === 6) {
                                return '已退款';
                            } else if (row.order_status === 7) {
                                return '已取消';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        key: 'op',
                        align: 'left',
                        width: '150',
                        title: '操作',
                        render: (h, params) => {
                            if (params.row.order_status === 1) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {orderId: params.row.order_id};
                                                this.$router.push({
                                                    name: 'order_info',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '查看'),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.orderto(params.row.order_id);
                                            }
                                        }
                                    }, '接单')
                                ]);
                            } else if (params.row.order_status === 2) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                // let argu = {orderId: params.row.order_id};
                                                // this.$router.push({
                                                //     name: 'order_info',
                                                //     params: argu
                                                // });
                                                this.refund(params.row.order_id, true);
                                            }
                                        }
                                    }, '查看'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.confirmService(params.row.order_id);
                                            }
                                        }
                                    }, '确认送达')
                                ]);
                            } else if (params.row.order_status === 5) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {orderId: params.row.order_id};
                                                this.$router.push({
                                                    name: 'order_info',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '查看'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.refund(params.row.order_id);
                                                // this.save(params.row.order_id);
                                                // let argu = {reportId: params.row.order_id};
                                                // this.$router.push({
                                                //     name: 'refund_info',
                                                //     params: argu
                                                // });
                                            }
                                        }
                                    }, '退款')
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                let argu = {orderId: params.row.order_id};
                                                this.$router.push({
                                                    name: 'order_info',
                                                    params: argu
                                                });
                                            }
                                        }
                                    }, '查看')
                                ]);
                            }
                        }
                    }
                ],
                searchform: {
                    order_id: '',
                    order_status: '',
                    pay_type: ''
                },
                failures: [
                    {value: '', label: '全部'},
                    {value: '0', label: '待付款'},
                    {value: '1', label: '待接单'},
                    {value: '2', label: '已接单'},
                    {value: '3', label: '确认送达'},
                    {value: '4', label: '已完成'},
                    {value: '5', label: '退款申请中'},
                    {value: '6', label: '已退款'},
                    {value: '7', label: '已取消'}
                ],
                ways: [
                    {value: '', label: '全部'},
                    {value: '0', label: '支付宝支付'},
                    {value: '1', label: '微信支付'}
                ]
            };
        },
        methods: {
            save () {
                let ddd = this.Refundform.order_id;
                let rp = this.Refundform.refund_price;
                this.$Modal.confirm({
                    content: '<p>确定退款吗？退款金额' + rp + '元，确认后将退回到客户支付账户，确认后不可撤回</p>',
                    loading: false,
                    onOk: () => {
                        this.$http.post('/order/refund', {
                            order_id: ddd
                        }).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            refund (a) {
                this.showAdd = true;
                this.$http.get('/order/detail?order_id=' + a).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.Refundform = resp.data.record;
                            this.Refundform.order_status = resp.data.record.order_status === 5 ? '退款申请中' : '未结算';
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            cancel () {
                this.showAdd = false;
            },
            orderto(ID) {
                this.$Modal.confirm({
                    content: '<p>确认接单吗？</p>',
                    loading: false,
                    onOk: () => {
                        this.$http.post('/order/take', {
                            order_id: ID
                        }).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success('接单成功！请尽快送达');
                                    this.getData();
                                } else {
                                    this.$Message.error('接单失败，请稍后再试');
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            confirmService(ID) {
                this.$Modal.confirm({
                    content: '<p>确认已送达吗？</p>',
                    loading: false,
                    onOk: () => {
                        this.$http.post('/order/confirm', {
                            order_id: ID
                        }).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success('确认成功！');
                                    this.getData();
                                } else {
                                    this.$Message.error('确认失败，请稍后再试');
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            search() {
                this.getData();
            },
            cancelSearch() {
                this.searchform.order_id = '';
                this.searchform.order_status = '';
                this.searchform.pay_type = '';
                this.getData();
            },
            getData() {
                let params = this.searchform;
                params['pageNumber'] = this.pageNumber;
                params['pageSize'] = this.pageSize;
                this.$http.get('/order/list', {
                    params: params
                }).then(
                    function (resp) {
                        this.data = resp.data.result;
                        this.total = resp.data.total;
                    }.bind(this)
                );
            },
            setPageSize(size) {
                this.pageSize = size;
                this.getData();
            },
            setPageNum(num) {
                this.pageNumber = num;
                this.getData();
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>