<style lang="less">
    @import 'common/protocol.less';
</style>

<template>
    <div class="content">
        <eheader></eheader>
        <div class="head_border"></div>
        <div class="conteng_bg">
            <section class="w12 login disf">
                <em class="fr">已经注册，请&nbsp;&nbsp;<a class=" logbtn fr" href="#">前往登录</a></em>
            </section>
            <section class="main w12">
                <div class="title_top"><span class="title1 fl">商家注册</span></div>
                <div class="w12 stepBox">
                    <div class="step">
                        <div class="step_item1">
                            <div>1</div>
                            <span>用户协议</span>
                        </div>
                        <div class="step_item2 acitive">
                            <div>2</div>
                            <span>注册</span>
                        </div>
                        <div class="step_item3">
                            <div>3</div>
                            <span>注册成功</span>
                        </div>
                    </div>
                </div>
                <div class="inputsec">
                    <Form ref="formValidate" :model="formValidate" :rules="rules" :label-width="140">
                        <FormItem label="账号" prop="mc_account" style="width:400px;">
                            <Input v-model="formValidate.mc_account" placeholder="请输入账号"/>
                        </FormItem>
                        <FormItem label="密码" prop="mc_password" style="width:400px;">
                            <Input v-model="formValidate.mc_password" type="password" placeholder="请输入密码"/>
                        </FormItem>
                        <FormItem label="确认密码" prop="mc_password2" style="width:400px;">
                            <Input v-model="formValidate.mc_password2" type="password" placeholder="请输入再次输入密码"/>
                        </FormItem>
                        <FormItem label="联系方式" style="width:400px;" prop="mc_phone">
                            <Input v-model="formValidate.mc_phone" placeholder="请输入联系方式"/>
                        </FormItem>
                        <FormItem label="法人/联系人姓名" prop="mc_linkman" style="width:400px;">
                            <Input v-model="formValidate.mc_linkman" placeholder="请输入法人或联系人姓名"/>
                        </FormItem>
                        <FormItem label="法人/联系人电话" prop="mc_linkphone" style="width:400px;">
                            <Input v-model="formValidate.mc_linkphone" placeholder="请输入联系方式"/>
                        </FormItem>
                        <FormItem label="法人/联系人身份证号" prop="mc_idnum" style="width:400px;">
                            <Input v-model="formValidate.mc_idnum" placeholder="请输入法人或联系人身份证号码"/>
                        </FormItem>
                        <Form-item>
                            <label class="db fl">&nbsp;</label>
                            <Button type="info" @click="back">上一步</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="primary" @click="register">注册</Button>
                        </Form-item>
                    </Form>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import eheader from './common/eheader';
    export default{
        name: 'toRegister',
        components: {
            eheader
        },
        data () {
            const validateAccount = (rule, value, callback) => {
                let acc = /^[a-zA-z]\w{3,15}$/;
                if (value === '') {
                    callback(new Error('账号不能为空'));
                } else if (!acc.test(value)) {
                    callback(new Error('字母开头，4-16位'));
                } else {
                    this.$http.get('/user/valid', {
                        params: {account: this.formValidate.mc_account}
                    }).then(
                        function (resp) {
                            if (resp.data.code === '000') {
                                callback();
                            } else {
                                callback(new Error('账号被占用'));
                            }
                        }.bind(this)
                    );
                }
            };

            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value.length < 6) {
                    callback(new Error('密码长度不能小于6位'));
                } else {
                    if (this.formValidate.mc_password2 !== '') {
                        this.$refs.formValidate.validateField('mc_password2');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formValidate.mc_password) {
                    callback(new Error('两次密码输入不一致!'));
                } else {
                    callback();
                }
            };
            const validatePhone = (rule, value, callback) => {
                let mobile = /^1[3|4|5|7|8]\d{9}$/;
                let phone = /^0\d{2,3}-?\d{7,8}$/;
                if (value === '') {
                    callback(new Error('请输入联系方式'));
                } else if (!mobile.test(value) && !phone.test(value)) {
                    callback(new Error('电话号码格式不正确'));
                } else {
                    callback();
                }
            };
            const validateidnum = (rule, value, callback) => {
                let idNum = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (value === '') {
                    callback(new Error('请输入身份证号吗'));
                } else if (!idNum.test(value)) {
                    callback(new Error('身份证号码格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                formValidate: {
                    mc_account: '',
                    mc_password: '',
                    mc_password2: '',
                    mc_phone: '',
                    mc_linkman: '',
                    mc_linkphone: '',
                    mc_idnum: '',
                    account: ''
                },
                rules: {
                    mc_account: [
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                        { validator: validateAccount, trigger: 'blur' }
                    ],
                    mc_password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    mc_password2: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    mc_phone: [
                        { required: true, message: '联系方式不能为空', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    mc_linkman: [
                        { required: true, message: '法人或联系人姓名不能为空', trigger: 'blur' }
                    ],
                    mc_linkphone: [
                        { required: true, message: '法人或联系人联系方式不能为空', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    mc_idnum: [
                        { required: true, message: '法人或联系人身份证号码不能为空', trigger: 'blur' },
                        { validator: validateidnum, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            back () {

            },
            register () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        let params = this.formValidate
                        this.$http.post('/user/register', params).then(
                            function (resp) {
                                console.log(resp)
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    } else {
                        this.$Message.error('信息填写不完整，请检查填写信息!', 5);
                    }
                });
            }
        }
    };
</script>

<style>

</style>
