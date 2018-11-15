<style lang="less">
    @import './401.less';
</style>

<template>
    <div class="error401">
        <div class="error401-body-con">
            <Card>
                <div class="error401-body-con-title">4<span class="error401-0-span"><Icon type="unlocked"></Icon></span><span class="error401-key-span"><Icon size="220" type="ios-bolt-outline"></Icon></span></div>
                <p class="error401-body-con-message">You don't log in</p>
                <div class="error401-btn-con">
                    <Button @click="goLogin" size="large" style="width: 200px;margin-left: 40px;" type="primary">重新登录</Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error401',
    methods: {
        goLogin () {
        	this.$store.commit('logout', this);
            this.$store.commit('clearOpenedSubmenu');
        }
    }
};
</script>
