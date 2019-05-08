import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const encryptTest = r => require.ensure([], () => r(require('@/page/encryptTest')), 'encryptTest');
const apiTest = r => require.ensure([], () => r(require('@/page/apiTest')), 'apiTest');
const mockTest = r => require.ensure([], () => r(require('@/page/mockTest')), 'mockTest');
const todoList = r => require.ensure([], () => r(require('@/page/todoList')), 'todoList');

const routes = [{
        path: '/',
        component: login
    },
    {
        path: '/manage',
        component: manage,
        name: '',
        children: [{
                path: '',
                component: home,
                meta: [],
            }, {
                path: '/encryptTest',
                component: encryptTest,
                meta: ['接口测试', '加解密'],
            },
            {
                path: '/apiTest',
                component: apiTest,
                meta: ['接口测试', 'APITEST'],
            },
            {
                path: '/mockTest',
                component: mockTest,
                meta: ['接口测试', 'MOCKTEST'],
            },
            {
                path: '/todoList',
                component: todoList,
                meta: ['接口测试', 'TODOLIST']
            }
        ]
    }
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production',
})