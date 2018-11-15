<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
    @import '../../styles/upload.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card class="set_store">
                    <p slot="title">
                        <Icon type="ios-cart"></Icon>
                        商品管理
                    </p>
                    <a type="text" slot="extra" @click="add">
                        <Icon type="plus-round"></Icon>
                    </a>
                    <Row>
                        <Form ref="searchForm" :model="searchform" inline>
                            <FormItem label="商品名称" :label-width="60">
                                <Input v-model="searchform.goods_title" placeholder="请输入商品名称查询"/>
                            </FormItem>
                            <FormItem label="商品状态" :label-width="60">
                                <Select v-model="searchform.goods_status" placeholder="请选择" style="width:150px;">
                                    <Option v-for="item in failures" :value="item.value" :key="item.value">{{item.label
                                        }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="是否上架" :label-width="60">
                                <Select v-model="searchform.is_on" placeholder="请选择" style="width:150px;">
                                    <Option v-for="item in togos" :value="item.value" :key="item.value">{{item.label
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
        <!--添加商品-->
        <Modal v-model="showAdd" @on-ok="save" @on-cancel="cancel" :title.sync="modalTitle" width="800" scrollable>
            <Form :label-width="70" ref="addform" :model="addform" :rules="rules">
                <Row>
                    <Col span="8">
                        <FormItem label="所属类目" prop="cat_id">
                            <Poptip trigger="click" placement="bottom-start" v-model="visiblelei">
                                <Input placeholder="选择所属类目" v-model="addform.cat_name" readonly/>
                                <div slot="content">
                                    <Tree :data="channels" @on-select-change="setChannel"></Tree>
                                </div>
                            </Poptip>
                        </FormItem>
                    </Col>
                    <Col :offset="4" span="8">
                        <FormItem label="是否实物" prop="is_real">
                            <Select v-model="addform.is_real">
                                <Option v-for="item in reals" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品标题" prop="goods_title">
                            <Input v-model="addform.goods_title" placeholder="请输入商品标题"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="副标题">
                            <Input v-model="addform.goods_subtitle" placeholder="请输入商品副标题"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品货号">
                            <Input v-model="addform.goods_sn" placeholder="请输入商品货号"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="关键词">
                            <Input v-model="addform.keywords" placeholder="请输入关键词"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="一口价" prop="priceStr">
                            <Input v-model="addform.priceStr" @on-blur="validPrice" placeholder="请输入商品货号"/>
                        </FormItem>
                    </Col>
                    <Col span="11" :offset="1">
                        <FormItem label="商品数量" prop="goods_stocks">
                            <Input v-model="addform.goods_stocks" @on-blur="validStock" placeholder="请输入数量"/>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="选择规格" v-show="hasSpec">
                    <CheckboxGroup class="select_spec" @change="selectspec" v-model="checkAllGroup" @on-change="querySpecValues">
                        <Checkbox v-for="item in specList" :label="item.sid">{{ item.sname }}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="商品规格" v-show="sv">
                    <Row v-for="item in attrs">
                        <Col :span="24" style="overflow: hidden">
                            <ul class="SKU_TYPE" style="float:left">
                                <li :sku-type-name='item.sname'>{{item.sname}}：</li>
                            </ul>
                            <ul style="float:left;margin-left:2%;overflow:hidden;">
                                <li style="float:left;" v-for="a in item.specInfo">
                                    <label>
                                        <input class="sku_value" @change="skuvalue" :title='a.svid' :value="a.svname"
                                               type="checkbox"/>{{a.svname}}
                                    </label>
                                </li>
                            </ul>
                            <div class="clear"></div>
                        </Col>
                    </Row>
                    <div id="skuTable"></div>
                </FormItem>
                <Row>
                    <Col span="24">
                        <FormItem label="列表图片" prop="goods_thumb">
                            <div class="upload-list" v-for="item in uploadList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    ref="thumbUpload"
                                    name="url"
                                    v-model="addform.goods_thumb"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品图片" prop="goods_img">
                            <div class="upload-list" v-for="item in uploadList2">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemovegoodimg(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    ref="imgUpload"
                                    name="url"
                                    v-model="addform.goods_img"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess2"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload2"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品详情" prop="goods_desc">
                            <div class="upload-list" v-for="item in uploadList3">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemovedetails(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    ref="descUpload"
                                    name="url"
                                    v-model="addform.goods_desc"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess3"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload3"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品备注">
                            <Input v-model="addform.goods_remark" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="save">确定</Button>
            </Row>
        </Modal>
        <!--编辑商品-->
        <Modal v-model="showExit" @on-ok="saveExit" @on-cancel="cancelExit" :title.sync="modalTitleexit" width="800"
               scrollable>
            <Form :label-width="70" ref="exitform" :model="exitform" :rules="rulesexit">
                <Row>
                    <Col span="8">
                        <FormItem label="所属类目">
                            <Poptip trigger="click" placement="bottom-start" v-model="visiblelei">
                                <Input placeholder="选择所属类目" v-model="exitform.cat_name" readonly/>
                                <div slot="content">
                                    <Tree :data="channels" @on-select-change="setChannel"></Tree>
                                </div>
                            </Poptip>
                        </FormItem>
                    </Col>
                    <Col :offset="4" span="8">
                        <FormItem label="是否实物" prop="is_real">
                            <Select v-model="exitform.is_real">
                                <Option v-for="item in reals" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品标题" prop="goods_title">
                            <Input v-model="exitform.goods_title" placeholder="请输入商品标题"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="副标题">
                            <Input v-model="exitform.goods_subtitle" placeholder="请输入商品副标题"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品货号">
                            <Input v-model="exitform.goods_sn" placeholder="请输入商品货号"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="关键词">
                            <Input v-model="exitform.keywords" placeholder="请输入关键词"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="一口价" prop="goods_priceStr">
                            <Input v-model="exitform.goods_priceStr" placeholder="请输入商品货号"/>
                        </FormItem>
                    </Col>
                    <Col span="11" :offset="1">
                        <FormItem label="商品数量" prop="goods_stocks">
                            <Input v-model="exitform.goods_stocks" placeholder="请输入数量"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="列表图片" prop="goods_thumb">
                            <div class="upload-list" v-for="item in uploadList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    name="url"
                                    v-model="exitform.goods_thumb"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品图片" prop="goods_img">
                            <div class="upload-list" v-for="item in uploadList2">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemovegoodimg(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    name="url"
                                    v-model="exitform.goods_img"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess2"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload2"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品详情" prop="goods_desc">
                            <div class="upload-list" v-for="item in uploadList3">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemovedetails(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                    name="url"
                                    v-model="exitform.goods_desc"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess3"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload3"
                                    type="drag"
                                    :action.sync="action"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="商品备注">
                            <Input v-model="exitform.goods_remark" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row slot="footer">
                <Button type="text" @click="cancelExit">取消</Button>
                <Button type="primary" @click="saveExit">确定</Button>
            </Row>
        </Modal>
        <Modal title="预览图片" v-model="visible" width="500">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery';
    export default {
        name: 'goods_index',
        data () {
            return {
                checklengthnum: [],
                skuValObj: {},
                title: [],
                value: [],
                checkAllGroup: [],
                attrs: '',
                sv: false,
                hasSpec: false,
                specList: [],
                visiblelei: false,
                channels: [],
                pageSize: 20,
                action: '',
                uploadList: [],
                uploadList2: [],
                uploadList3: [],
                imgName: '',
                visible: false,
                addform: {
                    aabb: '',
                    goods_thumb: [],
                    goods_img: [],
                    goods_desc: [],
                    cat_name: '无',
                    goods_title: '',
                    goods_subtitle: '',
                    goods_sn: '',
                    keywords: '',
                    goods_stocks: '',
                    goods_remark: '',
                    goodsSpec: [],
                    priceStr: '',
                    cat_id: '',
                    is_real: 1
                },
                exitform: {
                    goods_thumb: [],
                    goods_img: [],
                    goods_desc: [],
                    cat_name: '',
                    goods_title: '',
                    goods_subtitle: '',
                    goods_sn: '',
                    keywords: '',
                    goods_priceStr: '',
                    goods_stocks: '',
                    goods_remark: '',
                    goodsSpec: [],
                    cat_id: '',
                    goods_id: '',
                    is_real: 1
                },
                rules: {
                    cat_id: [
                        {required: true, message: '请选择所属类目', trigger: 'change'}
                    ],
                    is_real: [
                        {required: true, message: '请选择是否实物', trigger: 'change', type: 'number'}
                    ],
                    goods_title: [
                        {required: true, message: '请输入商品标题', trigger: 'blur'}
                    ],
                    priceStr: [
                        {required: true, message: '价格不能为空', trigger: 'blur'}
                    ],
                    goods_stocks: [
                        {required: true, message: '数量不能为空', trigger: 'blur', type: 'number'}
                    ],
                    goods_thumb: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                    goods_img: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                    goods_desc: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ]
                },
                rulesexit: {
                    // cat_id: [
                    //     {required: true, message: '请选择所属类目', trigger: 'change'}
                    // ],
                    is_real: [
                        {required: true, message: '请选择是否实物', trigger: 'change', type: 'number'}
                    ],
                    goods_title: [
                        {required: true, message: '请输入商品标题', trigger: 'blur'}
                    ],
                    goods_priceStr: [
                        {required: true, message: '价格不能为空', trigger: 'blur'}
                    ],
                    goods_stocks: [
                        {required: true, message: '数量不能为空', trigger: 'blur', type: 'number'}
                    ],
                    goods_thumb: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                    goods_img: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                    goods_desc: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ]
                },
                reals: [
                    {value: 1, label: '是'},
                    {value: 0, label: '否'}
                ],
                showAdd: false,
                showExit: false,
                modalTitle: '添加',
                modalTitleexit: '编辑',
                pageNumber: 1,
                total: 0,
                height: 590,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        key: 'goods_id',
                        align: 'center',
                        title: '商品编号',
                        width: 120
                    },
                    {
                        key: 'goods_title',
                        align: 'center',
                        title: '商品名称',
                        ellipsis: true
                    },
                    {
                        key: 'goods_stocks',
                        align: 'center',
                        title: '总库存',
                        width: 120
                    },
                    {
                        title: '状态',
                        key: 'goods_status',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.goods_status === 0 ? 'blue' : row.goods_status === 1 ? 'green' : 'red';
                            const text = row.goods_status === 0 ? '待审核' : row.goods_status === 1 ? '通过' : '拒绝';
                            return h('p', {
                                props: {
                                    // type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '是否上架',
                        key: 'is_on',
                        width: 110,
                        align: 'center',
                        render: (h, params) => {
                            const row = params.row;
                            const text = row.is_on === 0 ? '否' : '是';
                            return text;
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'goods_ct',
                        align: 'center',
                        width: 190
                    },
                    {
                        key: 'op',
                        align: 'center',
                        title: '操作',
                        width: 220,
                        render: (h, params) => {
                            let edit = h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.edit(params.row.goods_id);
                                    }
                                }
                            }, '编辑');

                            let remove = h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除这条数据吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.remove(params.row.goods_id);
                                        this.data.splice(params.index, 1);
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        margin: '0 4px 0 0'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        placement: 'top'
                                    }
                                }, '删除')
                            ]);

                            let on = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.onOff(params.row.goods_id, true);
                                    }
                                }
                            }, '上架');

                            let off = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.onOff(params.row.goods_id, false);
                                    }
                                }
                            }, '下架');

                            if (params.row.is_on === 0 && params.row.goods_status === 1) {
                                return h('div', [edit, remove, on]);
                            } else if (params.row.is_on === 1) {
                                return h('div', [edit, remove, off]);
                            } else {
                                return h('div', [edit, remove]);
                            }
                        }
                    }
                ],
                searchform: {
                    goods_title: '',
                    goods_status: '',
                    is_on: ''
                },
                data: [],
                failures: [
                    {value: '', label: '全部'},
                    {value: '0', label: '待审核'},
                    {value: '1', label: '通过'},
                    {value: '2', label: '拒绝'}
                ],
                togos: [
                    {value: '', label: '全部'},
                    {value: '0', label: '未上架'},
                    {value: '1', label: '已上架'}
                ]
            };
        },
        methods: {
            selectspec () {
                this.createTable();
            },
            skuvalue () {
                this.createTable();
            },
            createTable () {
                let alreadySetSkuVals = {};// 已经设置的SKU值数据
                this.getAlreadySetSkuVals();// 获取已经设置的SKU值
                let b = true;
                let skuTypeArr = []; // 存放SKU类型的数组
                let totalRow = 1;
                $('.SKU_TYPE').each(function () {
                    let skuTypeNode = $(this).children('li');
                    let skuTypeObj = {}; // sku类型对象
                    skuTypeObj.skuTypeTitle = $(skuTypeNode).attr('sku-type-name');
                    // 是否是必选SKU 0：不是；1：是；
                    // let is_required = $(skuTypeNode).attr('is_required');
                    let skuValueArr = [];// 存放SKU值得数组
                    let skuValNode = $(this).next();
                    let skuValCheckBoxs = $(skuValNode).find('input[type=\'checkbox\'][class*=\'sku_value\']');
                    // let checkedNodeLen = 0; // 选中的SKU节点的个数
                    $(skuValCheckBoxs).each(function () {
                        if ($(this).is(':checked')) {
                            let skuValObj = {}; // SKU值对象
                            skuValObj.skuValueTitle = $(this).val(); // SKU值名称
                            skuValObj.skuValueId = $(this).attr('propvalid'); // SKU值主键
                            skuValObj.skuPropId = $(this).attr('propid'); // SKU类型主键
                            skuValueArr.push(skuValObj);
                            // checkedNodeLen++;
                        }
                    });
                    // if (is_required && "1" == is_required) { // 必选sku
                    //     if (checkedNodeLen <= 0) { // 有必选的SKU仍然没有选中
                    //         b = false;
                    //         return false;// 直接返回
                    //     }
                    // }
                    if (skuValueArr && skuValueArr.length > 0) {
                        totalRow = totalRow * skuValueArr.length;
                        skuTypeObj.skuValues = skuValueArr;// sku值数组
                        skuTypeObj.skuValueLen = skuValueArr.length;// sku值长度
                        skuTypeArr.push(skuTypeObj);// 保存进数组中
                    }
                });
                if (skuTypeArr.length <= 0) {
                    b = false;
                    $('#skuTable').html('');
                    return false;
                }
                let SKUTableDom = '';// sku表格数据
                // 开始创建行
                if (b) { // 必选的SKU属性已经都选中了
                    SKUTableDom += '<table border=\'1\' class=\'skuTable\'><tr>';
                    // 创建表头
                    for (let t = 0; t < skuTypeArr.length; t++) {
                        SKUTableDom += '<th width="15%">' + skuTypeArr[t].skuTypeTitle + '</th>';
                    }
                    SKUTableDom += '<th>原价</th><th>优惠价</th><th>库存</th>';
                    SKUTableDom += '</tr>';
                    // 循环处理表体
                    for (let i = 0; i < totalRow; i++) { // 总共需要创建多少行
                        let currRowDoms = '';
                        let rowCount = 1;// 记录行数
                        let propvalidArr = [];// 记录SKU值主键
                        let propIdArr = [];// 属性类型主键
                        let propvalnameArr = [];// 记录SKU值标题
                        let propNameArr = [];// 属性类型标题
                        for (let j = 0; j < skuTypeArr.length; j++) { // sku列
                            let skuValues = skuTypeArr[j].skuValues;// SKU值数组
                            let skuValueLen = skuValues.length;// sku值长度
                            rowCount = (rowCount * skuValueLen);// 目前的生成的总行数
                            let anInterBankNum = (totalRow / rowCount);// 跨行数
                            let point = ((i / anInterBankNum) % skuValueLen);
                            propNameArr.push(skuTypeArr[j].skuTypeTitle);
                            if (0 == (i % anInterBankNum)) { // 需要创建td
                                currRowDoms += '<td style="text-align: center;" rowspan='+anInterBankNum+'>'+skuValues[point].skuValueTitle+'</td>';
                                propvalidArr.push(skuValues[point].skuValueId);
                                propIdArr.push(skuValues[point].skuPropId);
                                propvalnameArr.push(skuValues[point].skuValueTitle);
                            } else {
                                // 当前单元格为跨行
                                propvalidArr.push(skuValues[parseInt(point)].skuValueId);
                                propIdArr.push(skuValues[parseInt(point)].skuPropId);
                                propvalnameArr.push(skuValues[parseInt(point)].skuValueTitle);
                            }
                        }

                        let propvalids = propvalidArr.toString()
                        let alreadySetSkuPrice = '';// 已经设置的SKU原价
                        let alreadySetSkuBestPrice = '';// 已经设置的SKU优惠价
                        let alreadySetSkuStock = '';// 已经设置的SKU库存
                        // 赋值
                        if (alreadySetSkuVals) {
                            let currGroupSkuVal = alreadySetSkuVals[propvalids];// 当前这组SKU值
                            if (currGroupSkuVal) {
                                alreadySetSkuPrice = currGroupSkuVal.skuPrice;
                                alreadySetSkuBestPrice = currGroupSkuVal.skuBestPrice;
                                alreadySetSkuStock = currGroupSkuVal.skuStock;
                            }
                        }
                        SKUTableDom += '<tr propvalids=\'' + propvalids + '\' propids=\'' + propIdArr.toString() + '\' propvalnames=\'' + propvalnameArr.join(',') + '\'  propnames=\'' + propNameArr.join(';') + '\' class="sku_table_tr">' + currRowDoms + '<td><input style="text-align: center;" type="text" class="setting_sku_price" value="' + alreadySetSkuPrice + '"/></td><td><input  style="text-align: center;" type="text" class="setting_sku_bestprice" value="' + alreadySetSkuBestPrice + '"/></td><td><input style="text-align: center;" type="text" class="setting_sku_stock" value="' + alreadySetSkuStock + '"/></td></tr>';
                    }
                    SKUTableDom += '</table>';
                }
                $('#skuTable').html(SKUTableDom);
                this.getStocks();
                this.getYkj();
            },
            // 获取已经设置的SKU值
            getAlreadySetSkuVals () {
                let alreadySetSkuVals = {};
                // 获取设置的SKU属性值
                $('tr[class*=\'sku_table_tr\']').each(function () {
                    let skuPrice = $(this).find('input[type=\'text\'][class*=\'setting_sku_price\']').val();// SKU原价格
                    let skuBestPrice = $(this).find('input[type=\'text\'][class*=\'setting_sku_bestprice\']').val();// SKU优惠后价格
                    let skuStock = $(this).find('input[type=\'text\'][class*=\'setting_sku_stock\']').val();// SKU库存
                    if (skuPrice || skuStock || skuBestPrice) { // 已经设置了全部或部分值
                        let propvalids = $(this).attr('propvalids');// SKU值主键集合
                        let propvalnames = $(this).attr('propvalnames');// SKU值主键集合
                        alreadySetSkuVals[propvalids] = {
                            'propvalnames': propvalnames,
                            'skuPrice': skuPrice,
                            'skuBestPrice': skuBestPrice,
                            'skuStock': skuStock
                        };
                    }
                });
            },
            // 设置商品库存总数量
            getStocks () {
                let stocks = 0;
                $('tr[class*=\'sku_table_tr\']').each(function () {
                    let skuStock = $('td').find('input[type=\'text\'][class*=\'setting_sku_stock\']').val();
                    if (skuStock) {
                        console.log(skuStock);
                        stocks += parseInt(skuStock);
                    }
                });
                this.addform.goods_stocks = stocks;
            },
            // 取所有规格中优惠价最小值
            getYkj () {
                let p = 0;
                // 获取设置的SKU属性值
                $('tr[class*=\'sku_table_tr\']').each(function (index, element) {
                    let price = $(this).find('input[type=\'text\'][class*=\'setting_sku_bestprice\']').val();
                    console.log(price)
                    if (index === 0) {
                        p = price;
                    } else {
                        p = p > price ? price : p;
                    }
                });
                this.addform.priceStr = p;
            },
            getChannels () {
                this.$http.get('/spec/category').then(
                    function (resp) {
                        // console.log(resp.data.result)
                        this.channels = resp.data.result;
                    }.bind(this)
                );
            },
            setChannel (selectedArray) {
                $('#skuTable').html('');
                let objid = selectedArray;
                for (let i = 0; i < objid.length; i++) {
                    this.addform.aabb = objid[i].id;
                }
                if (selectedArray.length > 0) {
                    this.$http.get('/spec/catSpec', {
                        params: {cat_id: this.addform.aabb}
                    }).then(
                        function (resp) {
                            this.specList = resp.data.result;
                            if (this.specList.length > 0) {
                                this.hasSpec = true;
                            } else {
                                this.hasSpec = false;
                            }
                            this.sv = false;
                        }.bind(this)
                    );
                    this.addform.cat_id = selectedArray[0].id;
                    this.exitform.cat_id = selectedArray[0].id;
                    this.visiblelei = false;
                    this.addform.cat_name = selectedArray[0].title;
                    this.exitform.cat_name = selectedArray[0].title;
                } else {
                    this.addform.cat_id = '';
                    this.exitform.cat_id = '';
                    this.addform.cat_name = '';
                    this.exitform.cat_name = '';
                }
                this.pageNumber = 1;
                this.getData();
            },
            querySpecValues (selectedArray) {
                let arr = [];
                for (let i = 0; i < this.checkAllGroup.length; i++) {
                    arr[i] = this.checkAllGroup[i];
                }
                if (selectedArray.length > 0) {
                    this.$http.get('/spec/specValue', {
                        params: {sids: this.checkAllGroup.join(',')}
                    }).then(
                        function (resp) {
                            this.attrs = resp.data.result;
                            if (resp.data.result.length > 0) {
                                this.sv = true;
                                this.readonly = true;
                            } else {
                                this.sv = false;
                                this.readonly = false;
                            }
                        }.bind(this)
                    );
                } else {
                    this.sv = false;
                    this.readonly = false;
                    $('#skuTable').html('');
                }
            },
            onOff (goodsId, isOn) {
                let url = '/goods/on';
                if (!isOn) {
                    url = '/goods/off';
                }
                this.$http.post(url, {goods_id: goodsId}).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$Message.success(resp.data.msg);
                            this.getData();
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            save () {
                this.$refs.addform.validate((valid) => {
                    if (valid) {
                        let data = this.addform;
                        this.$http.post('/goods/save', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                    this.showAdd = false;
                                    this.getData();
                                    this.$refs.addform.resetFields();
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    } else {
                        this.$Message.error('请输入内容!');
                    }
                });
            },
            saveExit () {
                this.$refs.exitform.validate((valid) => {
                    if (valid) {
                        let data = this.exitform;
                        console.log(data)
                        this.$http.post('/goods/save', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                    this.showExit = false;
                                    this.getData();
                                    this.$refs.exitform.resetFields();
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            cancel () {
                this.showAdd = false;
            },
            cancelExit () {
                this.showExit = false;
            },
            search () {
                this.getData();
            },
            cancelSearch () {
                this.searchform.goods_title = '';
                this.searchform.goods_status = '';
                this.searchform.is_on = '';
                this.getData();
            },
            getData () {
                let params = this.searchform;
                params['pageNumber'] = this.pageNumber;
                params['pageSize'] = this.pageSize;
                this.$http.get('/goods/list', {
                    params: params
                }).then(
                    function (resp) {
                        // console.log(resp)
                        if (resp.data.code === '000') {
                            this.data = resp.data.result;
                            this.total = resp.data.total;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            setPageSize (size) {
                this.pageSize = size;
                this.getData();
            },
            handleView (url) {
                this.imgName = url;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.uploadList;
                this.uploadList.splice(fileList.indexOf(file), 1);
            },
            handleRemovegoodimg (file) {
                const fileList = this.uploadList2;
                this.uploadList2.splice(fileList.indexOf(file), 1);
            },
            handleRemovedetails (file) {
                const fileList = this.uploadList2;
                this.uploadList3.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.addform.goods_thumb = response.fileName;
                this.exitform.goods_thumb = response.fileName;
                this.uploadList = fileList;
            },
            handleSuccess2 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.addform.goods_img = response.fileName;
                this.exitform.goods_img = response.fileName;
                this.uploadList2 = fileList;
            },
            handleSuccess3 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.addform.goods_desc = response.fileName;
                this.exitform.goods_desc = response.fileName;
                this.uploadList3 = fileList;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式不正确。',
                    desc: file.name + ' 不是jpg文件或者png文件.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: '文件 ' + file.name + ' 太大，不能超过2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片。'
                    });
                }
                return check;
            },
            handleBeforeUpload2 () {
                const check = this.uploadList2.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片。'
                    });
                }
                return check;
            },
            handleBeforeUpload3 () {
                const check = this.uploadList3.length < 9;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传9张图片。'
                    });
                }
                return check;
            },
            add () {
                this.showAdd = true;
                this.uploadList = [];
                this.uploadList2 = [];
                this.uploadList3 = [];
                this.addform.cat_name = '无';
                this.$refs.imgUpload.clearFiles();
                this.$refs.descUpload.clearFiles();
                this.$refs.thumbUpload.clearFiles();
            },
            remove (goodsId) {
                this.$http.post('/goods/remove', {goods_id: goodsId}).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$Message.success(resp.data.msg);
                            this.getData();
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            edit (goodsId) {
                this.$http.get('/goods/info', {
                    params: {
                        goods_id: goodsId
                    }
                }).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.uploadList = [];
                            this.uploadList2 = [];
                            this.uploadList3 = [];
                            if (resp.data.desc) {
                                this.uploadList3 = resp.data.desc;
                            }
                            if (resp.data.goods.goods_img) {
                                this.uploadList2 = resp.data.img;
                            }
                            if (resp.data.thumb) {
                                this.uploadList = resp.data.thumb;
                            }
                            console.log(resp);
                            this.exitform.goods_id = resp.data.goods.goods_id;
                            this.exitform.goods_title = resp.data.goods.goods_title;
                            this.exitform.goods_subtitle = resp.data.goods.goods_subtitle;
                            this.exitform.goods_remark = resp.data.goods.goods_remark;
                            this.exitform.goods_stocks = resp.data.goods.goods_stocks;
                            this.exitform.keywords = resp.data.goods.keywords;
                            this.exitform.goods_sn = resp.data.goods.goods_sn;
                            this.exitform.is_real = resp.data.goods.is_real;
                            this.exitform.goods_priceStr = resp.data.goods.priceStr;
                            this.exitform.cat_id = resp.data.goods.cat_id;
                            this.exitform.cat_name = resp.data.cat_name;
                            this.showExit = true;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            validPrice () {
                let price = this.addform.priceStr;
                price = price.replace(/(^\s*)|(\s*$)/g, '');
                if (price == '') {
                    this.addform.priceStr = 0.00;
                    return true;
                }
                if (!isNaN(price)) {
                    this.addform.priceStr = parseFloat(price).toFixed(2);
                } else {
                    this.addform.priceStr = 0.00;
                }
            },
            validStock () {
                let stock = this.addform.goods_stocks;
                stock = stock.replace(/(^\s*)|(\s*$)/g, '');
                this.addform.goods_stocks = parseInt(stock);
                if (isNaN(this.addform.goods_stocks)) {
                    this.addform.goods_stocks = 0;
                }
            },
            setPageNum (num) {
                this.pageNumber = num;
                this.getData();
            }
        },
        created () {
            // this.columns = tableData.columnsgood;
        },
        mounted () {
            this.action = this.$http.defaults.baseURL + '/upload';
            this.getData();
            this.getChannels();
        }
    };
</script>