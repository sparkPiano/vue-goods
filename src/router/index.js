import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    // base: '/shop',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

Util.ajax.interceptors.response.use(function (response) {
    return response;
}, function (err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 401:
                router.push({
                    name: 'error-401',
                    replace: true
                });
                break;
            case 403:
                router.push({
                    name: 'error-403',
                    replace: true
                });
                break;
            case 404:
                router.push({
                    name: 'error-404',
                    replace: true
                });
                break;
            case 500:
                router.push({
                    name: 'error-500',
                    replace: true
                });
                break;
            default:
                err.message = `连接出错(${err.response.status})!`;
        }
    } else {
        err.message = '连接服务器失败!';
    }

    return Promise.reject(err);
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
                let access = curRouterObj.access;
                let isAccess = false;

                if (access instanceof Array) {
                    for (let i = 0; i < access.length; i++) {
                        if (access[i] === parseInt(Cookies.get('access'))) {
                            isAccess = true;
                            break;
                        }
                    }
                } else {
                    isAccess = access === parseInt(Cookies.get('access'));
                }

                if (isAccess) {
                    Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                } else {
                    next({
                        replace: true,
                        name: 'error-403'
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
