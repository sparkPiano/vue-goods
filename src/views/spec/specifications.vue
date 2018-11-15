<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Row>
            <Col span="19">
                <Card class="set_store">
                    <p slot="title">
                        <Icon type="grid"></Icon>
                        规格管理
                    </p>
                    <a type="text" slot="extra" @click="add">
                        <Icon type="plus-round"></Icon>
                    </a>
                    <Row>
                        <Form ref="searchForm" :model="searchform" inline>
                            <FormItem label="规格名称" :label-width="60">
                                <Input v-model="searchform.name" placeholder="请输入规格名称查询"/>
                            </FormItem>
                            <FormItem>
                                <Button @click="search" type="primary" icon="search">搜索</Button>
                                <Button @click="cancelSearch" type="ghost">取消</Button>
                            </FormItem>
                        </Form>
                    </Row>
                    <Row>
                        <can-edit-table refs="table" :height="height" v-model="data" @on-delete="remove" @on-edit="edit"
                                        @on-setIntv="setIntv"
                                        :columns-list="columns"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total.sync="total" :page-size="pageSize" :current.sync="pageNumber"
                              @on-change="setPageNum"
                              show-elevator show-total show-sizer @on-page-size-change="setPageSize"></Page>
                    </Row>
                </Card>
            </Col>
            <Col span="5" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        分类目录
                    </p>
                    <Tabs type="card">
                        <TabPane label="商品分类">
                            <div class="classification-con" v-bind:style="{ height: treeHeight + 'px' }">
                                <Tree :data="channels" @on-select-change="setChannel"></Tree>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Col>
        </Row>
        <Modal v-model="show" :title.sync="modalTitle" @on-ok="save" @on-cancel="cancelAdd"  scrollable>
            <Row>
                <Form :label-width="80" ref="attrForm" :model="attrForm" :rules="attrValidate">
                    <FormItem label="所属类目">
                        <Poptip trigger="click" placement="bottom-start" v-model="visible">
                            <Input placeholder="选择所属类目" v-model="parentName" readonly />
                            <div slot="content">
                                <Tree :data="channels" @on-select-change="setChannel"></Tree>
                            </div>
                        </Poptip>
                    </FormItem>
                    <FormItem label="规格名称" prop="sname">
                        <Input v-model="attrForm.sname" placeholder="请输入规格名称"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="attrForm.remark" type="textarea" :rows="2"/>
                    </FormItem>
                </Form>
            </Row>
            <Row slot="footer">
                <Button type="text" @click="cancelAdd">取消</Button>
                <Button type="primary" @click="save">确定</Button>
            </Row>
        </Modal>
        <Modal v-model="showExit" title="修改" @on-ok="saveExit" @on-cancel="cancelExit" scrollable>
            <Row>
                <Form :label-width="80" ref="ExitForm" :model="ExitForm" :rules="attrValidate2">
                    <FormItem label="所属类目">
                        <Poptip trigger="click" placement="bottom-start" v-model="visible">
                            <Input placeholder="选择所属类目" v-model="ExitForm.parentName" readonly />
                            <div slot="content">
                                <Tree :data="channels" @on-select-change="setChannel"></Tree>
                            </div>
                        </Poptip>
                    </FormItem>
                    <FormItem label="规格名称" prop="sname">
                        <Input v-model="ExitForm.sname" placeholder="请输入规格名称"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="ExitForm.remark" type="textarea" :rows="2"/>
                    </FormItem>
                </Form>
            </Row>
            <Row slot="footer">
                <Button type="text" @click="cancelExit">取消</Button>
                <Button type="primary" @click="saveExit()">确定</Button>
            </Row>
        </Modal>
        <Modal v-model="setvalue" title="设置"  scrollable>
            <Card style="height:70px;margin-bottom:10px;">
                <Form ref="setForm" :model="setForm" :rules="setValidate" :label-width="60">
                    <Row>
                        <Col :span='18'>
                            <FormItem label="规格值" prop="svname">
                                <Input v-model="setForm.svname"/>
                            </FormItem>
                        </Col>
                        <Col :span='6' style="padding-left:20px;">
                            <Button type="info" icon="checkmark-round" @click="setsave">保存</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Table border stripe :columns="cls" :data="dt" class="attr"></Table>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<script>
    import tableData from './common/data.js';
    import canEditTable from './common/canEditTable.vue';

    export default {
        name: 'spec_index',
        components: {
            canEditTable
        },
        data () {
            return {
                setForm: {
                    sid: '',
                    svname: ''
                },
                dt: [],
                setvalue: false,
                cls: [
                    {
                        title: '规格值',
                        key: 'svname',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            let setremove = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.setremove(params.row.svid);
                                        this.data.splice(params.index, 1);
                                    }
                                }
                            }, '删除');

                            return h('div', [setremove]);
                        }
                    }
                ],
                visible: false,
                parentName: '',
                modalTitle: '',
                attrForm: {
                    cat_id: '',
                    sname: '',
                    remark: ''
                },
                ExitForm: {
                    sid: '',
                    cat_id: '',
                    sname: '',
                    remark: '',
                    parentName: ''
                },
                attrValidate: {
                    cat_id: [
                        {required: true, message: '请选择所属类目', trigger: 'change'}
                    ],
                    sname: [
                        {required: true, message: '规格名称不能为空', trigger: 'blur'}
                    ]
                },
                attrValidate2: {
                    sname: [
                        {required: true, message: '规格名称不能为空', trigger: 'blur'}
                    ]
                },
                setValidate: {
                    svname: [
                        {required: true, message: '规格值不能为空', trigger: 'blur'}
                    ]
                },
                show: false,
                showExit: false,
                // customId: '',
                channels: [{
                    expand: true,
                    title: '全部',
                    id: '',
                    children: []
                }],
                sid: '',
                pageNumber: 1,
                pageSize: 20,
                total: 0,
                columns: [],
                data: [],
                searchform: {
                    name: '',
                    uid: ''
                }
            };
        },
        computed: {
            height () {
                return this.$store.state.app.containerHeight2;
            },
            treeHeight () {
                return this.$store.state.app.rightTreeHeight;
            }
        },
        methods: {
            setremove (svid) {
                this.$http.post('/spec/removevalue', {svid: svid}).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$Message.success(resp.data.msg);
                            this.qudata();
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            qudata () {
                this.$http.get('/spec/values', {params: {sid: this.setForm.sid}}).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.dt = resp.data.record;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            setsave () {
                this.$refs.setForm.validate((valid) => {
                    if (valid) {
                        let data = this.setForm;
                        this.$http.post('/spec/saveValue', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                    this.$refs.setForm.resetFields();
                                    this.qudata();
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            cancelAdd () {
                this.show = false;
            },
            cancelExit () {
                this.showExit = false;
            },
            save () {
                this.$refs.attrForm.validate((valid) => {
                    if (valid) {
                        let data = this.attrForm;
                        console.log(data)
                        this.$http.post('/spec/save', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                    this.show = false;
                                    this.attrForm = {};
                                    this.getData();
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            saveExit () {
                this.$http.post('/spec/update', {
                    sid: this.ExitForm.sid,
                    sname: this.ExitForm.sname,
                    cat_id: this.ExitForm.cat_id,
                    remark: this.ExitForm.remark
                }).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$Message.success(resp.data.msg);
                            this.showExit = false;
                            this.getData();
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            getChannels () {
                this.$http.get('/spec/category').then(
                    function (resp) {
                        // console.log(resp.data.result)
                        this.channels[0].children = resp.data.result;
                    }.bind(this)
                );
            },
            setChannel (selectedArray) {
                if (selectedArray.length > 0) {
                    this.attrForm.cat_id = selectedArray[0].id;
                    this.ExitForm.cat_id = selectedArray[0].id;
                    this.visible = false;
                    this.parentName = selectedArray[0].title;
                    this.ExitForm.parentName = selectedArray[0].title;
                } else {
                    this.attrForm.cat_id = '';
                    this.ExitForm.cat_id = '';
                    this.parentName = '';
                    this.ExitForm.parentName = '';
                }
                this.pageNumber = 1;
                this.getData();
            },
            remove (rows, index) {
                this.$http.post('/spec/remove', {sid: rows[index].sid}).then(
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
            edit (rows, index) {
                this.showExit = true;
                this.ExitForm.sname = rows[index].sname;
                this.ExitForm.sid = rows[index].sid;
                this.ExitForm.cat_id = rows[index].cat_id;
                this.ExitForm.remark = rows[index].remark;
                this.ExitForm.parentName = rows[index].cat_name;
            },
            setIntv (rows, index) {
                this.setForm.sid = rows[index].sid;
                this.setvalue = true;
                this.qudata();
            },
            add () {
                if (this.attrForm.cat_id === '' || this.attrForm.cat_id === '0000') {
                    this.$Message.warning('请在右侧列表中选择商品分类');
                    return false;
                }
                this.show = true;
                this.modalTitle = '添加';
            },
            setPageNum (num) {
                this.pageNumber = num;
                this.getData();
            },
            setPageSize (size) {
                this.pageSize = size;
                this.getData();
            },
            getData () {
                let params = this.searchform;
                params['pageNumber'] = this.pageNumber;
                params['pageSize'] = this.pageSize;
                params['catId'] = this.attrForm.cat_id;

                this.$http.get('/spec/list',
                    {
                        params: params
                    }
                ).then(
                    function (resp) {
                        // console.log(resp)
                        this.data = resp.data.result;
                        this.total = resp.data.total;
                    }.bind(this));
            },
            search () {
                this.getData();
            },
            cancelSearch () {
                this.searchform.name = '';
                this.getData();
            }
        },
        created () {
            this.columns = tableData.columns;
        },
        mounted () {
            this.getChannels();
            this.getData();
        }
    };
</script>