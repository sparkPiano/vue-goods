<style lang="less">
    @import '../../styles/upload.less';
</style>
<template>
    <div>
        <Row :gutter="10">
            <Col span="5">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        店铺设置
                    </p>
                    <Menu active-name="1" width="auto">
                        <MenuItem @click.native="toDetails(1)" name="1">
                            <Icon type="ionic"></Icon>
                            基本信息
                        </MenuItem>
                        <MenuItem @click.native="toDetails(2)" name="2">
                            <Icon type="ios-people"></Icon>
                            账号设置
                        </MenuItem>
                        <MenuItem @click.native="toDetails(3)" name="3">
                            <Icon type="social-foursquare-outline"></Icon>
                            证件信息
                        </MenuItem>
                    </Menu>
                </Card>
            </Col>
            <Col span="19">
                <Card v-show="display_card" class="set_store">
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        基本信息
                    </p>
                    <Row>
                        <Form :label-width="70" ref="addElement" :model="addElement" :rules="rules">
                            <Row>
                                <Col span="11">
                                    <FormItem label="商家账号" prop="mc_account">
                                        <Input v-model="addElement.mc_account" readonly/>
                                    </FormItem>
                                </Col>
                                <Col span="1" style="text-align: center">&nbsp;</Col>
                                <Col span="11">
                                    <FormItem label="联系电话" prop="mc_linkphone">
                                        <Input v-model="addElement.mc_linkphone"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                    <FormItem label="店铺名称" prop="sp_name">
                                        <Input v-model="addElement.sp_name"/>
                                    </FormItem>
                                </Col>
                                <Col span="1" style="text-align: center">&nbsp;</Col>
                                <Col span="11">
                                    <FormItem label="联系人" prop="mc_linkman">
                                        <Input v-model="addElement.mc_linkman"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="11">
                                    <FormItem label="身份证号" prop="mc_idnum">
                                        <Input v-model="addElement.mc_idnum"/>
                                    </FormItem>
                                </Col>
                                <Col span="1" style="text-align: center">&nbsp;</Col>
                                <Col span="11">
                                    <FormItem label="联系人电话" prop="mc_phone">
                                        <Input v-model="addElement.mc_phone"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="店铺大图">
                                        <div class="upload-list" v-for="item in uploadList">
                                            <template v-if="item.status === 'finished'">
                                                <img :src="item.url">
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-eye-outline"
                                                          @click.native="handleView(item.url)"></Icon>
                                                    <Icon type="ios-trash-outline"
                                                          @click.native="handleRemove(item)"></Icon>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <Progress v-if="item.showProgress" :percent="item.percentage"
                                                          hide-info></Progress>
                                            </template>
                                        </div>
                                        <Upload
                                                name="url"
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
                                <Col span="12">
                                    <FormItem label="店铺小图">
                                        <div class="upload-list" v-for="item in uploadList2">
                                            <template v-if="item.status === 'finished'">
                                                <img :src="item.url">
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-eye-outline"
                                                          @click.native="handleView(item.url)"></Icon>
                                                    <Icon type="ios-trash-outline"
                                                          @click.native="handleRemoveContent(item)"></Icon>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <Progress v-if="item.showProgress" :percent="item.percentage"
                                                          hide-info></Progress>
                                            </template>
                                        </div>
                                        <Upload
                                                name="url"
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
                                <Col span="12">
                                    <FormItem label="工作日" prop="sp_day">
                                        <Input v-model="addElement.sp_day" placeholder="周一到周五"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="营业时间" prop="sp_hours">
                                        <Input v-model="addElement.sp_hours"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <FormItem label="所属渠道" prop="sp_name">
                                    <Input v-model="addElement.sp_name" readonly/>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="所在省市" prop="areas">
                                    <al-selector v-model="addElement.areas" level="2" auto/>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="详细地址" prop="sp_addr">
                                    <Input v-model="addElement.sp_addr"/>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="店铺介绍" prop="sp_profile">
                                    <Input v-model="addElement.sp_profile" type="textarea"
                                           :autosize="{minRows: 3,maxRows: 5}"></Input>
                                </FormItem>
                            </Row>
                            <Row>
                                <Col span="24">
                                    <FormItem>
                                        <Button @click="saveForm" type="primary">保存</Button>
                                        <!--<Button type="ghost" style="margin-left: 8px">取消</Button>-->
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Card>
                <Card v-show="set_account" class="set_store">
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        账户设置
                    </p>
                    <Row>
                        <Form :label-width="70" ref="addaccount" :model="addaccount" :rules="rules">
                            <Row>
                                <Col span="12">
                                    <FormItem label="户名" prop="accout_name">
                                        <Input v-model="addaccount.accout_name"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="开户行" prop="bank_name">
                                        <Input v-model="addaccount.bank_name"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="账号" prop="bank_account">
                                        <Input v-model="addaccount.bank_account"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem>
                                        <Button @click="saveAccount" type="primary">保存</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Card>
                <Card v-show="set_information" class="set_store">
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        附件信息
                    </p>
                    <Form :label-width="100" :model="docForm">
                        <Row>
                            <FormItem label="组织机构代码证">
                                <div class="upload-list" v-for="item in docForm.orgList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline"
                                                  @click.native="handleView(item.url)"></Icon>
                                            <Icon type="ios-trash-outline"
                                                  @click.native="handleCodes(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage"
                                                  hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                        name="url"
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
                        </Row>
                        <Row>
                            <FormItem label="营业执照">
                                <div class="upload-list" v-for="item in docForm.licList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline"
                                                  @click.native="handleView(item.url)"></Icon>
                                            <Icon type="ios-trash-outline"
                                                  @click.native="handlelicense(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage"
                                                  hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                        name="url"
                                        :show-upload-list="false"
                                        :on-success="handleSuccess4"
                                        :format="['jpg','jpeg','png']"
                                        :max-size="2048"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload4"
                                        type="drag"
                                        :action.sync="action"
                                        style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="camera" size="20"></Icon>
                                    </div>
                                </Upload>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="身份证">
                                <div class="upload-list" v-for="item in docForm.idList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline"
                                                  @click.native="handleView(item.url)"></Icon>
                                            <Icon type="ios-trash-outline"
                                                  @click.native="handleIdcard(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage"
                                                  hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                        name="url"
                                        :show-upload-list="false"
                                        :on-success="handleSuccess5"
                                        :format="['jpg','jpeg','png']"
                                        :max-size="2048"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload5"
                                        type="drag"
                                        :action.sync="action"
                                        style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="camera" size="20"></Icon>
                                    </div>
                                </Upload>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button @click="savePicture" type="primary">保存</Button>
                            </FormItem>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Modal title="预览图片" v-model="visible" width="500">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data () {
            return {
                set_information: false,
                set_account: false,
                display_card: true,
                imgName: '',
                visible: false,
                uploadList: [],
                uploadList2: [],
                action: '',
                addaccount: {
                    accout_name: '',
                    bank_name: '',
                    bank_account: ''
                },
                docForm: {
                    orgList: [],
                    licList: [],
                    idList: [],
                    sp_orgcode: '',
                    sp_buslicense: '',
                    sp_identity: ''
                },
                addElement: {
                    shopThumb: '',
                    shopImg: '',
                    mc_account: '',
                    mc_linkphone: '',
                    mc_phone: '',
                    sp_name: '',
                    mc_linkman: '',
                    mc_idnum: '',
                    sp_day: 'www',
                    sp_hours: 'eeee',
                    areas: [],
                    sp_province: '',
                    sp_city: '',
                    sp_area: '',
                    sp_addr: '',
                    sp_profile: '',
                    sp_province_code: '',
                    sp_city_code: '',
                    sp_area_code: '',
                },
                rules: {
                    mc_account: [
                        {required: true, message: '请输入商家账号', trigger: 'blur'}
                    ],
                    mc_linkphone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'}
                    ],
                    mc_phone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'}
                    ],
                    sp_name: [
                        {required: true, message: '请输入店铺名称', trigger: 'blur'}
                    ],
                    mc_linkman: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    mc_idnum: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'}
                    ],
                    sp_addr: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    accout_name: [
                        {required: true, message: '请输入户名', trigger: 'blur'}
                    ],
                    bank_name: [
                        {required: true, message: '请输入开户行', trigger: 'blur'}
                    ],
                    bank_account: [
                        {required: true, message: '请输入账户', trigger: 'blur'}
                    ],
                    areas: [
                        {required: true, message: '请输入所在城市', type: 'array', trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            saveForm () {
                this.$refs.addElement.validate((valid) => {
                    if (valid) {
                        let data = this.$refs.addElement.model;
                        let areas = this.addElement.areas;
                        if (areas.length > 0) {
                            data['sp_province_code'] = areas[0].code;
                            data['sp_province_name'] = areas[0].name;
                            data['sp_city_code_name'] = areas[1].code;
                            data['sp_city_name'] = areas[1].name;
                            data['sp_area_code'] = areas[2].code;
                            data['sp_area_name'] = areas[2].name;
                        }
                        this.$http.post('/shop/save', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    } else {
                        this.$Message.error('请输入内容');
                    }
                });
            },
            savePicture () {
                let idList = this.docForm.idList;
                let idStr = new Array();
                for (let i = 0; i < idList.length; i++) {
                    let idFile = idList[i];
                    idStr[i] = idFile.name;
                }
                this.docForm.sp_identity = idStr.join(',');
                let params = this.docForm;
                this.$http.post('/shop/updateDoc', params).then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$Message.success(resp.data.msg);
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            },
            saveAccount () {
                this.$refs.addaccount.validate((valid) => {
                    if (valid) {
                        let data = this.addaccount;

                        this.$http.post('/shop/updateAcc', data).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    } else {
                        this.$Message.error('请输入内容');
                    }
                });
            },
            getData () {
                this.$http.get('/shop/info').then(
                    function (resp) {
                        console.log(resp)
                        if (resp.data.code === '000') {
                            let areaArray = new Array();
                            if (resp.data.shop.sp_province && resp.data.shop.sp_city && resp.data.shop.sp_area) {
                                areaArray[0] = resp.data.shop.sp_province;
                                areaArray[1] = resp.data.shop.sp_city;
                                areaArray[2] = resp.data.shop.sp_area;
                            }
                            this.addElement.areas = areaArray;
                            console.log(this.addElement.areas)
                            // for(let i = 0; i < areaArray.length; i++) {
                            //     this.addElement.areas = areaArray[i];
                            // }
                            // let AArray = new Array();
                            // if (this.addElement.sp_province === '') {
                            //     AArray[0] = resp.data.shop.sp_province_code;
                            // }
                            // if (this.addElement.sp_city === '') {
                            //     AArray[1] = resp.data.shop.sp_city_code;
                            // }
                            // if (this.addElement.sp_area === '') {
                            //     AArray[2] = resp.data.shop.sp_area_code;
                            // }
                            // this.addElement.areas = AArray;
                            if (resp.data.shopImg) {
                                this.uploadList = resp.data.shopImg;
                            }
                            if (resp.data.shopThumb) {
                                this.uploadList2 = resp.data.shopThumb;
                            }

                            if (resp.data.orgImg) {
                                this.docForm.orgList = resp.data.orgImg;
                            }
                            if (resp.data.licImg) {
                                this.docForm.licList = resp.data.licImg;
                            }
                            if (resp.data.idImg) {
                                this.docForm.idList = resp.data.idImg;
                            }
                            this.addaccount = resp.data.acc;
                            this.addElement = resp.data.mc;
                            this.addElement.sp_name = resp.data.shop.sp_name;
                            this.addElement.sp_addr = resp.data.shop.sp_addr;
                            this.addElement.sp_day = resp.data.shop.sp_day;
                            this.addElement.sp_hours = resp.data.shop.sp_hours;
                            this.addElement.sp_profile = resp.data.shop.sp_profile;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this));
            },
            handleView (url) {
                this.imgName = url;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.uploadList;
                this.uploadList.splice(fileList.indexOf(file), 1);
            },
            handleRemoveContent (file) {
                const fileList = this.uploadList2;
                this.uploadList2.splice(fileList.indexOf(file), 1);
            },
            handleCodes (file) {
                const fileList = this.docForm.orgList;
                this.docForm.orgList.splice(fileList.indexOf(file), 1);
            },
            handlelicense (file) {
                const fileList = this.docForm.licList;
                this.docForm.licList.splice(fileList.indexOf(file), 1);
            },
            handleIdcard (file) {
                const fileList = this.docForm.idList;
                this.docForm.idList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.addElement.shopImg = response.fileName;
                this.uploadList = fileList;
            },
            handleSuccess2 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.addElement.shopThumb = response.fileName;
                this.uploadList2 = fileList;
            },
            handleSuccess3 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.docForm.sp_orgcode = response.fileName;
                this.docForm.orgList = fileList;
            },
            handleSuccess4 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.docForm.sp_buslicense = response.fileName;
                this.docForm.licList = fileList;
            },
            handleSuccess5 (response, file, fileList) {
                file.url = response.filePath;
                file.name = response.fileName;
                this.docForm.idList = fileList;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式不正确。',
                    desc: file.name + ' 不是jpg文件或者png文件.'
                });
            },
            handleMaxSize (file) {
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
                const check = this.docForm.orgList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片。'
                    });
                }
                return check;
            },
            handleBeforeUpload4 () {
                const check = this.docForm.licList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片。'
                    });
                }
                return check;
            },
            handleBeforeUpload5 () {
                const check = this.docForm.idList.length < 2;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传2张图片。'
                    });
                }
                return check;
            },
            toDetails (res) {
                if (res === 1) {
                    this.display_card = true;
                    this.set_account = false;
                    this.set_information = false;
                }
                if (res === 2) {
                    this.display_card = false;
                    this.set_account = true;
                    this.set_information = false;
                }
                if (res === 3) {
                    this.display_card = false;
                    this.set_account = false;
                    this.set_information = true;
                }
            }
        },
        mounted () {
            this.action = this.$http.defaults.baseURL + '/upload';
            this.getData();
        },
        created () {

        }

    };
</script>