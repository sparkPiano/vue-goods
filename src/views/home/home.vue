<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10" class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        店铺信息
                    </p>
                    <Row>
                        <Col span="4">
                            <img src="../../images/365.png" alt="">
                        </Col>
                        <Col :pull="2" span="8">
                            <div style="cursor: pointer;" @click="tosetshop">
                                <p style="padding-top:10px;">店铺名称：{{ sp_name }}</p>
                                <p style="padding-top:5px;">店铺地址：{{ sp_province }}{{ sp_city }}{{ sp_area }}{{ sp_addr
                                    }}</p>
                                <p style="padding-top:5px;">注册日期：{{ ct.split(" ")[0] }}</p>
                            </div>
                        </Col>
                        <Col class="star_five" span="6">
                            <h3>综合评价</h3>
                            <p>服务态度&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Rate disabled v-model="valueDisabled"></Rate>
                            </p>
                            <p>用户满意度&nbsp;&nbsp;<Rate disabled v-model="valueDisicon"></Rate>
                            </p>
                        </Col>
                        <Col class="store_status" span="6">
                            <h3>店铺状态</h3>
                            <h2 class="audit_status">
                                <p style="color: #657180;" href="">{{ sp_status == '0' ? '待审核' : ( sp_status=='1' ?
                                    '审核通过' : '未通过审核' )}}</p>
                            </h2>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col span="12">
                <Row :gutter="5">
                    <Col span="8">
                        <infor-card
                                id-name="pendAudit_count"
                                :end-val="count.pendAudit"
                                iconType="person-stalker"
                                color="#2d8cf0"
                                intro-text="待审核商品"></infor-card>
                    </Col>
                    <Col span="8">
                        <infor-card
                                id-name="pendIsOn_count"
                                :end-val="count.pendIsOn"
                                iconType="podium"
                                color="#64d572"
                                :iconSize="50"
                                intro-text="待上架商品"></infor-card>
                    </Col>
                    <Col span="8">
                        <infor-card
                                id-name="onSale_count"
                                :end-val="count.onSale"
                                iconType="social-yen"
                                color="#ffd572"
                                intro-text="出售中商品"
                        ></infor-card>
                    </Col>

                </Row>
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="calendar"></Icon>
                            待处理订单
                        </p>
                        <Row>
                            <Col span='8'>
                                <span class="font_size">待付款：{{ pendPay }}</span>
                            </Col>
                            <Col span='8'>
                                <span class="font_size">待接单：{{ pendOrder }}</span>
                            </Col>
                            <Col span='8'>
                                <span class="font_size">待送达：{{ pendArrive }}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col :span='8'>
                                <span class="font_size">待确认：{{ pendConfirm }}</span>
                            </Col>
                            <Col :span='8'>
                                <span class="font_size">待退款：{{ refund }}</span>
                            </Col>
                            <Col :span='8'>
                                <span class="font_size">已完成：{{ complete }}</span>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Col>
            <Col span="12">
                <Row>
                    <Card>
                        <p slot="title">
                            <Icon type="film-marker"></Icon>
                            活动推荐
                        </p>
                        <article>
                            <h1>正在筹备中，敬请期待...</h1>
                        </article>
                    </Card>
                </Row>
                <Row class="margin-top-10">
                    <Card>
                        <p slot="title">
                            <Icon type="document-text"></Icon>
                            商家学习
                        </p>
                        <Collapse v-model="value2" accordion>
                            <Panel name="1"> 1.注册店铺
                                <p slot="content">
                                    <span class="font_size">1. 注册店铺:请务必正确填写店铺相关信息，若有法人请上传法人身份证照片，若无法人请上传店铺联系人身份证照片。</span><br/>
                                    <span class="font_size">2. 若三证合一，营业执照及组织机构代码证请上传同一证件。</span>
                                </p>
                            </Panel>
                            <Panel name="2"> 2.店铺信息变更
                                <p slot="content">
                                    <span class="font_size">1. 店铺注册后，若雪修改店铺相关信息，在【店铺设置】中修改。</span><br/>
                                    <span class="font_size">2. 若店铺审核未通过，更改信息后，由系统管理人员重新审核。</span><br/>
                                    <span class="font_size">3. 若店铺审核通过后，更改店铺信息，将不再进行二次审核。</span><br/>
                                    <span class="font_size">4. 请认真填写开户行信息，订单结算金额将汇入填写的银行账号。</span><br/>
                                    <span class="font_size">5. 店铺审核记录，点击店铺状态查看审核记录。</span>
                                </p>
                            </Panel>
                            <Panel name="3"> 3.商品发布
                                <p slot="content">
                                    <span class="font_size">1. 发布商品前，请先维护商品规格信息。在【规格管理】中设置，比如商品类目为衣服，可在规格管理中为衣服添加颜色、尺码等规格，并为颜色设置白色、黑色、灰色等规格值，为尺码设置S、M、L等规格值。</span><br/>
                                    <span class="font_size">2. 若发布的商品为虚拟物品，则无需维护商品规格。</span><br/>
                                    <span class="font_size">3. 商品添加成功后，需要系统人员进行审核，审核通过后的商品方可上架销售。</span><br/>
                                    <span class="font_size">4. 对已上架的商品进行修改，同样需要系统人员重新审核，审核通过后再次上架。</span><br/>
                                    <span class="font_size">5. 买家只能购买已上架的商品。</span>
                                </p>
                            </Panel>
                        </Collapse>
                    </Card>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import countUp from './components/countUp.vue';
    import inforCard from './components/inforCard.vue';

    export default {
        name: 'home',
        components: {
            countUp,
            inforCard
        },
        data () {
            return {
                count: {
                    pendAudit: 0,
                    pendIsOn: 0,
                    onSale: 0
                },
                value3: '1',
                value2: '1',
                value1: '1',
                valueDisabled: 5,
                valueDisicon: 5,
                pendPay: 0,
                pendOrder: 0,
                pendArrive: 0,
                pendConfirm: 0,
                complete: 0,
                refund: 0,
                sp_name: '',
                sp_province: '',
                sp_city: '',
                sp_area: '',
                ct: '',
                sp_addr: '',
                sp_status: ''
            };
        },
        methods: {
            tosetshop () {
                this.$router.push({path: '/shop/index'});
            },
            getData () {
                this.$http.get('/user/home').then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.count.pendAudit = Number(resp.data.home.pendAudit);
                            this.count.pendIsOn = Number(resp.data.home.pendIsOn);
                            this.count.onSale = Number(resp.data.home.onSale);

                            this.pendConfirm = resp.data.home.pendConfirm;
                            this.complete = resp.data.home.complete;
                            this.refund = resp.data.home.refund;
                            this.sp_name = resp.data.shop.sp_name;
                            this.sp_province = resp.data.shop.sp_province;
                            this.sp_city = resp.data.shop.sp_city;
                            this.sp_area = resp.data.shop.sp_area;
                            this.sp_addr = resp.data.shop.sp_addr;
                            this.ct = resp.data.shop.ct;
                            this.sp_status = resp.data.shop.sp_status;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            }
        },
        mounted () {
            this.getData();
        },
        created () {

        }
    };
</script>
