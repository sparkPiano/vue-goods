<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form ref="userForm" :model="userForm" :label-width="100" label-position="right">
                    <FormItem label="登录账号：">
                        <span>{{ userForm.account }}</span>
                    </FormItem>
                </Form>
                <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right"
                      :rules="passwordValidate">
                    <FormItem label="原密码" prop="oldPwd" :error="oldPassError">
                        <Input v-model="editPasswordForm.oldPwd" placeholder="请输入现在使用的密码"></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="password">
                        <Input v-model="editPasswordForm.password" placeholder="请输入新密码，至少6位字符"></Input>
                    </FormItem>
                    <FormItem label="确认新密码" prop="password2">
                        <Input v-model="editPasswordForm.password2" placeholder="请再次输入新密码"></Input>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditPass">取消</Button>
                        <Button type="primary" style="width: 100px;" @click="saveEditPass">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'ownspace_index',
        data () {
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userForm: {
                    account: ''
                },
                oldPassError: '',
                editPasswordForm: {
                    oldPwd: '',
                    password: '',
                    password2: ''
                },
                passwordValidate: {
                    oldPwd: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
                        {max: 32, message: '最多输入32个字符', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: valideRePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            cancelEditUserInfor () {
                this.$store.commit('removeTag', 'ownspace_index');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            },
            cancelEditPass () {
                this.editPasswordForm = {};
            },
            saveEditPass () {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        let params = this.editPasswordForm;
                        this.$http.post('/user/updatePwd', params).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    this.$Message.success(resp.data.msg);
                                    this.editPasswordForm = {};
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this)
                        );
                    }
                });
            },
            init () {
                this.$http.get('/user/info').then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.userForm.account = resp.data.user.mc_account;
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                );
            }
        },
        mounted () {
            this.init();
        }
    };
</script>
