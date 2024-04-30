import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/businessList',
  meta: {
    title: '服务商管理',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'businessList',
    name: 'businessList',
    component: () => import('@/views/business/businessList/index'),
    meta: {
      title: '服务商列表',
      icon: 'table'
    }
  },
  {
    path: 'settlement',
    name: 'settlement',
    component: () => import('@/views/business/settlement/index'),
    meta: {
      title: '入驻申请',
      icon: 'tree'
    }
  },
  {
    hidden: true,
    path: 'addSettlement',
    name: 'addSettlement',
    component: () => import('@/views/business/settlement/addSettlement'),
    meta: {
      title: '入驻申请详情',
      icon: 'tree'
    }
  }
  ]
},

{
  path: '/renovation',
  component: Layout,
  name: 'renovation',
  meta: {
    title: '运营管理',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'wechatApp',
    name: 'wechatApp',
    component: () => import('@/views/renovation/wechatApp/index'),
    meta: {
      title: '小程序',
      icon: 'table'
    }
  },
  {
    path: 'custom',
    name: 'custom',
    component: () => import('@/views/renovation/custom/index'),
    meta: {
      title: '自定义页面',
      icon: 'tree'
    }
  },
  {
    path: 'commdityClass',
    name: 'commdityClass',
    component: () => import('@/views/renovation/commdityClass/index'),
    meta: {
      title: '服务分类',
      icon: 'tree'
    }
  },
  {
    path: 'commoditySystem',
    name: 'commoditySystem',
    component: () => import('@/views/renovation/commoditySystem/index'),
    meta: {
      title: '服务管理',
      icon: 'tree'
    }
  },
  {
    hidden: true, // (默认 false)
    path: 'addCommodity',
    name: 'addCommodity',
    component: () => import('@/views/renovation/commoditySystem/addCommodity'),
    meta: {
      title: '查看详情',
      icon: 'table'
    }
  }
  ]
},
{
  path: '/active',
  component: Layout,
  redirect: '/active/seckilllist',
  meta: {
    title: '平台活动',
    icon: 'el-icon-s-help'
  },
  children: [
    // {
    //   path: '/active/index',
    //   name: 'active',
    //   component: () => import('@/views/active/index'),
    //   meta: {
    //     title: '平台活动',
    //     icon: 'dashboard'
    //   }
    // },
    // {
    //   hidden: true,
    //   path: '/active/add',
    //   name: 'addActive',
    //   component: () => import('@/views/active/addActive'),
    //   meta: {
    //     title: '新增活动',
    //     icon: 'dashboard'
    //   }
    // },
    // {
    //   hidden: true,
    //   path: '/active/activeDetails',
    //   name: 'activeDetails',
    //   component: () => import('@/views/active/activeDetails'),
    //   meta: {
    //     title: '活动详情',
    //     icon: 'dashboard'
    //   }
    // },
    {
      path: '/active/couponlist',
      name: 'couponlist',
      component: () => import('@/views/active/coupon/index.vue'),
      meta: {
        title: '优惠券活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/couponlist/add',
      name: 'couponlistAdd',
      component: () => import('@/views/active/coupon/couponAdd.vue'),
      meta: {
        title: '新增优惠券活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/couponlist/couponDetail',
      name: 'couponDetail',
      component: () => import('@/views/active/coupon/couponDetail.vue'),
      meta: {
        title: '优惠券活动详情',
        icon: 'dashboard'
      }
    },
    {
      path: '/active/seckilllist',
      name: 'seckilllist',
      component: () => import('@/views/active/seckill/index.vue'),
      meta: {
        title: '秒杀活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/seckilllist/add',
      name: 'seckilllistAdd',
      component: () => import('@/views/active/seckill/seckillAdd.vue'),
      meta: {
        title: '新增秒杀活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/seckilllist/seckillDetail',
      name: 'seckillDetail',
      component: () => import('@/views/active/seckill/seckillDetail.vue'),
      meta: {
        title: '秒杀活动详情',
        icon: 'dashboard'
      }
    },
    {
      path: '/active/discountlist',
      name: 'discountlist',
      component: () => import('@/views/active/discount/index.vue'),
      meta: {
        title: '限时折扣',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/discount/add',
      name: 'discountAdd',
      component: () => import('@/views/active/discount/discountAdd.vue'),
      meta: {
        title: '新增折扣活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/discount/discountDetail',
      name: 'discountDetail',
      component: () => import('@/views/active/discount/discountDetail.vue'),
      meta: {
        title: '折扣活动详情',
        icon: 'dashboard'
      }
    },
    {
      path: '/active/politelist',
      name: 'politelist',
      component: () => import('@/views/active/polite/index.vue'),
      meta: {
        title: '支付有礼',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/politelist/add',
      name: 'politelistAdd',
      component: () => import('@/views/active/polite/politeAdd.vue'),
      meta: {
        title: '新增支付有礼活动',
        icon: 'dashboard'
      }
    },
    {
      hidden: true,
      path: '/active/politelist/politeDetail',
      name: 'politeDetail',
      component: () => import('@/views/active/polite/politeDetail.vue'),
      meta: {
        title: '支付有礼活动详情',
        icon: 'dashboard'
      }
    }
  ]
},
{
  path: '/pay',
  component: Layout,
  children: [{
    path: '/',
    name: 'pay',
    component: () => import('@/views/pay/index'),
    meta: {
      title: 'Redis延时任务',
      icon: 'dashboard'
    }
  }]
},
{
  path: '/finance',
  component: Layout,
  meta: {
    title: '财务',
    icon: 'dashboard'
  },
  children: [{
    path: 'withdrawal',
    name: 'withdrawal',
    component: () => import('@/views/finance/withdrawal/index'),
    meta: {
      title: '提现申请',
      icon: 'dashboard'
    }
  },
  {
    path: 'overview',
    name: 'overview',
    component: () => import('@/views/finance/overview/index'),
    meta: {
      title: '财务概况',
      icon: 'dashboard'
    }
  },
  {
    path: 'bond',
    name: 'bond',
    component: () => import('@/views/finance/bond/index'),
    meta: {
      title: '财务概况',
      icon: 'dashboard'
    }
  },
  {
    path: 'application',
    name: 'application',
    component: () => import('@/views/finance/application/index'),
    meta: {
      title: '用户提现申请',
      icon: 'dashboard'
    }
  }
  ]
},
// {
//   path: '/after',
//   component: Layout,
//   children: [{
//     path: 'after',
//     name: 'after',
//     component: () => import('@/views/after/index'),
//     meta: {
//       title: '售后处理',
//       icon: 'dashboard'
//     }
//   },
//   {
//     path: 'afterDetails',
//     name: 'afterDetails',
//     component: () => import('@/views/after/details'),
//     meta: {
//       title: '售后详情',
//       icon: 'dashboard'
//     }
//   }
//   ]
// },
{
  path: '/order',
  component: Layout,
  redirect: '/order',
  name: 'order',
  meta: {
    title: '订单',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'pending',
    name: 'pending',
    component: () => import('@/views/order/pending/index'),
    meta: {
      title: '待处理订单',
      icon: 'table'
    }
  },
  // pendDetails
  {
    hidden: true, // (默认 false)
    path: 'pendDetails',
    name: 'pendDetails',
    component: () => import('@/views/order/pending/pendDetails'),
    meta: {
      title: '订单详情',
      icon: 'table'
    }
  },
  {
    path: 'after',
    name: 'after',
    component: () => import('@/views/order/after/index'),
    meta: {
      title: '售后处理',
      icon: 'dashboard'
    }
  },
  {
    path: 'afterDetails',
    name: 'afterDetails',
    component: () => import('@/views/order/after/details'),
    meta: {
      title: '售后详情',
      icon: 'dashboard'
    }
  }
  ]
},
// {
//   path: '/system',
//   component: Layout,
//   children: [{
//       hidden: true, // (默认 false)
//       path: '/system/editShopSys',
//       component: () => import('@/views/system/shopSys/edit'), // Parent router-view
//       name: 'editShopSys',
//       meta: {
//         title: '编辑店铺信息'
//       },
//     },
//     {
//       path: '/system/shopSys',
//       component: () => import('@/views/system/shopSys/index'), // Parent router-view
//       name: 'dict',
//       meta: {
//         title: '店铺设置',
//         icon: 'dashboard'
//       },
//     },
//   ]
// },
{
  path: '/comment',
  component: Layout,
  redirect: '/comment/commentSys',
  name: 'comment',
  meta: {
    title: '评论',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'commentSys',
    name: 'commentSys',
    component: () => import('@/views/comment/commentSys/index'),
    meta: {
      title: '评论管理',
      icon: 'tree'
    }
  },
  {
    path: 'sensitive',
    name: 'sensitive',
    component: () => import('@/views/comment/sensitive/index'),
    meta: {
      title: '敏感词管理',
      icon: 'table'
    }
  },
  {
    path: 'keyWord',
    name: 'keyWord',
    component: () => import('@/views/comment/keyword/index'),
    meta: {
      title: '关键词管理',
      icon: 'tree'
    }
  }
  ]
},
// customer
{
  path: '/customer',
  component: Layout,
  redirect: '/customer/customerMage',
  name: 'customer',
  meta: {
    title: '客户管理',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'customerMage',
    name: 'customerMage',
    component: () => import('@/views/customer/customerMage/index'),
    meta: {
      title: '客户管理',
      icon: 'table'
    }
  },
  {
    hidden: true,
    path: 'customerDetails',
    name: 'customerDetails',
    component: () => import('@/views/customer/customerMage/customerDetails'),
    meta: {
      title: '客户详情',
      icon: 'table'
    }
  },
  {
    path: 'tips',
    name: 'tips',
    component: () => import('@/views/customer/tips/index'),
    meta: {
      title: '标签管理',
      icon: 'tree'
    }
  },
  {
    hidden: true,
    path: 'addTips',
    name: 'addTips',
    component: () => import('@/views/customer/tips/addTips'),
    meta: {
      title: '创建标签',
      icon: 'tree'
    }
  }
  ]
},
{
  path: '/setup',
  component: Layout,
  redirect: '/setup/user',
  name: 'setup',
  meta: {
    title: '系统管理',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'user',
    name: 'user',
    component: () => import('@/views/setup/user/index'),
    meta: {
      title: '用户管理',
      icon: 'table'
    }
  },
  {
    path: 'role',
    name: 'role',
    component: () => import('@/views/setup/role/index'),
    meta: {
      title: '角色管理',
      icon: 'tree'
    }
  },
  {
    path: 'tabs',
    name: 'tabs',
    component: () => import('@/views/setup/tabs/index'),
    meta: {
      title: '菜单管理',
      icon: 'tree'
    }
  },
  {
    path: 'businessMenus',
    name: 'businessMenus',
    component: () => import('@/views/setup/businessMenus/index'),
    meta: {
      title: '商家菜单',
      icon: 'tree'
    }
  },
  {
    path: 'dict',
    name: 'dict',
    component: () => import('@/views/setup/dict/index'),
    meta: {
      title: '字典管理',
      icon: 'tree'
    }
  }
  ]
},
// 消息中心
{
  path: '/notice',
  component: Layout,
  redirect: '/notice/history',
  name: 'notice',
  meta: {
    title: '消息中心',
    icon: 'el-icon-chat-square'
  },
  children: [{
    path: 'history',
    name: 'history',
    component: () => import('@/views/notice/history'),
    meta: {
      title: '历史消息',
      icon: 'el-icon-chat-dot-square'
    }
  },
  {
    path: 'push',
    name: 'push',
    component: () => import('@/views/notice/push'),
    meta: {
      title: '消息推送',
      icon: 'el-icon-chat-line-square'
    }
  }
  ]
},
// 客户中心
{
  path: '/member',
  component: Layout,
  redirect: '/member/memberList',
  name: 'member',
  meta: {
    title: '客户管理',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'memberList',
    name: 'memberList',
    component: () => import('@/views/member/memberList/index'),
    meta: {
      title: '客户管理',
      icon: 'table'
    }
  },
  {
    path: 'equity',
    name: 'equity',
    component: () => import('@/views/member/equity/index'),
    meta: {
      title: '客户权益',
      icon: 'table'
    }
  },
  {
    hidden: true,
    path: 'customerDetails',
    name: 'customerDetails',
    component: () => import('@/views/member/customerMage/customerDetails'),
    meta: {
      title: '客户详情',
      icon: 'table'
    }
  },
  {
    path: 'tips',
    name: 'tips',
    component: () => import('@/views/member/tips/index'),
    meta: {
      title: '标签管理',
      icon: 'tree'
    }
  },
  {
    path: 'levelList',
    name: 'levelList',
    component: () => import('@/views/member/levelList/index'),
    meta: {
      title: '客户等级',
      icon: 'tree'
    }
  },
  {
    hidden: true,
    path: 'addTips',
    name: 'addTips',
    component: () => import('@/views/member/tips/addTips'),
    meta: {
      title: '创建标签',
      icon: 'tree'
    }
  }
  ]
}
  // 404 page must be placed at the end !!!
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
