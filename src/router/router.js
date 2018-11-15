import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
    // component: () => import('@/views/register/protocol.vue')
};
export const registerRouter = {
    path: '/protocol',
    name: 'protocol',
    meta: {
        title: '商家注册'
    },
    component: () => import('@/views/register/protocol.vue')
};
export const toregisterRouter = {
    path: '/toRegister',
    name: 'toRegister',
    meta: {
        title: '商家注册'
    },
    component: () => import('@/views/register/toRegister.vue')
};
export const okRouter = {
    path: '/ok',
    name: 'ok',
    meta: {
        title: '注册成功'
    },
    component: () => import('@/views/register/ok.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-未登录'
    },
    name: 'error-401',
    component: () => import('@//views/error-page/401.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
        { path: 'finance/:reportId', title: '财务报表明细', name: 'finance_info', component: () => import('@/views/finance/finance_info.vue') },
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: () => import('@/views/order/order_info.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/shop',
        icon: 'social-skype-outline',
        name: 'shop',
        title: '店铺设置',
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'social-skype-outline',
                name: 'shop_index',
                title: '店铺设置',
                component: () => import('@/views/shop/index.vue')
            }
        ]
    },
    {
        path: '/spec',
        icon: 'grid',
        name: 'spec',
        title: '规格管理',
        component: Main,
        children: [
            { path: 'index', icon: 'grid', access: 0, title: '规格管理', name: 'spec_index', component: () => import('@/views/spec/specifications.vue') }
        ]
    },
    {
        path: '/goods',
        icon: 'ios-cart',
        title: '商品管理',
        name: 'goods',
        component: Main,
        children: [
        	{ path: 'index', icon: 'ios-cart', access: 0, title: '商品管理', name: 'goods_index', component: () => import('@/views/goods/goodsment.vue') }
        ]
    },
    {
        path: '/order',
        icon: 'social-buffer-outline',
        title: '订单管理',
        name: 'order',
        component: Main,
        children: [
        	{ path: 'index', icon: 'social-buffer-outline', access: 0,title: '订单管理', name: 'order_index', component: () => import('@/views/order/orderment.vue') }
        ]
    },
    {
        path: '/finance',
        icon: 'social-yen',
        title: '财务结算',
        name: 'finance',
        component: Main,
        children: [
        	{ path: 'index', icon: 'social-yen',access: 0, title: '财务结算', name: 'finance_index', component: () => import('@/views/finance/financeindex.vue') }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    registerRouter,
    toregisterRouter,
    okRouter,
    locking,
    ...appRouter,
    page500,
    page401,
    page403,
    page404

];