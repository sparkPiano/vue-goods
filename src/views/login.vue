<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名"/>
                            <span slot="prepend">
                                        <Icon :size="16" type="person"></Icon>
                                </span>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码"/>
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p @click="toRegister" class="login-tip">还没有账号？注册一个</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            toRegister () {
                this.$router.push({name: 'protocol'});
                console.log('执行了');
            },
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        let param = new URLSearchParams();
                        param.append('username', this.form.userName);
                        param.append('password', this.form.password);
                        param.append('rememberMe', false);

                        this.$http.post('/user/login', param).then(
                            function (resp) {
                                if (resp.data.code === '000') {
                                    Cookies.set('user', this.form.userName);
                                    Cookies.set('access', resp.data.role);
                                    // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                                    this.$router.push({
                                        name: 'home_index'
                                    });
                                } else {
                                    this.$Message.error(resp.data.msg);
                                }
                            }.bind(this));
                    }
                });
            }
        }
    };
</script>

<style>

</style>
