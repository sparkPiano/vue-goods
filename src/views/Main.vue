<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <a type="text" v-show="!shrink"><span class="title">所依商城</span></a>
                    <img v-show="shrink" src="https://xiaoi-img.oss-cn-qingdao.aliyuncs.com/assets/image/logo.png"
                         key="min-logo"/>
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                            @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <message-tip v-model="mesCount"></message-tip>
                    <theme-switch></theme-switch>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Button type="ghost" shape="circle" icon="log-out"
                                    @click="handleClickUserDropdown('loginout')"></Button>
                            <Button type="text" @click="handleClickUserDropdown('ownSpace')">
                                <div style="width:72px;float:left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                    {{ userName }}
                                </div>
                            </Button>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>

        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}" ref="pageContent">
            <happy-scroll color="rgba(51,51,51,0.7)" scroll-top="20" size="5" resize smaller-move-h="end"
                          smaller-move-v="end">
                <div class="single-page">
                    <keep-alive :include="cachePage">
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </happy-scroll>
        </div>

    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch
        },
        data () {
            return {
                scrollTop: 0,
                scrollLeft: 0,
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                timer: null
            };
        },
        mounted () {
            this.init();
            let that = this;
            this.$store.commit('changeHeight', this);

            window.addEventListener('resize', () => {
                this.$store.commit('changeHeight', that);
            });
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            },
            titleTheme () {
                return this.$store.state.app.themeColor;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                this.checkTag(this.$route.name);

                this.timer = setInterval(() => {
                    this.getMsg();
                }, 600000);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$Modal.confirm({
                        content: '<p>确定退出吗？</p>',
                        loading: false,
                        onOk: () => {
                            this.$store.commit('logout', this);
                            this.$store.commit('clearOpenedSubmenu');
                        }
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            getMsg () {
                this.$http.get('/order/msg').then(
                    function (resp) {
                        if (resp.data.code === '000') {
                            this.$store.commit('updateOrderMsgList', resp.data.result);

                            let count = resp.data.result.length;
                            this.$store.commit('setMessageCount', count);
                            if (count > 0) {
                                this.$router.push({
                                    name: 'message_index'
                                });
                            }
                        } else {
                            this.$Message.error(resp.data.msg);
                        }
                    }.bind(this)
                ).catch(function (error) {
                    alert(error);
                });
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        }
    };
</script>