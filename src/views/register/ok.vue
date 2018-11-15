<style lang="less">
    @import 'common/protocol';
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
                        <div class="step_item2">
                            <div>2</div>
                            <span>注册</span>
                        </div>
                        <div style="margin-left:6px;" class="step_item3 acitive">
                            <div>3</div>
                            <span>注册成功</span>
                        </div>
                    </div>
                </div>
                <div class="success">
                    <div class="suc1">恭喜您注册成功</div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
    import eheader from './common/eheader';
    export default {
        name: 'ok',
        components: {
            eheader
        },
        data () {
            return {
            };
        },
        methods: {
        }
    };
</script>