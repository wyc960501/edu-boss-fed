import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/', // 默认子路由
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/course/index.vue'),
        meta: {
          title: '课程管理',
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          breadList: [
            {
              title: '角色管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        meta: {
          breadList: [
            {
              title: '角色管理',
              url: '/role'
            },
            {
              title: '角色菜单管理'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true // 将路由路径参数映射到组件的 props 数据中
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-resource' */ '@/views/role/alloc-resource.vue'),
        meta: {
          breadList: [
            {
              title: '角色管理',
              url: '/role'
            },
            {
              title: '角色资源管理'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true // 将路由路径参数映射到组件的 props 数据中
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          breadList: [
            {
              title: '菜单管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'),
        meta: {
          breadList: [
            {
              title: '菜单管理',
              url: '/menu'
            },
            {
              title: '添加菜单'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'),
        meta: {
          breadList: [
            {
              title: '菜单管理',
              url: '/menu'
            },
            {
              title: '编辑菜单'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: {
          breadList: [
            {
              title: '资源管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/resource/create',
        name: 'resource-create',
        component: () => import(/* webpackChunkName: 'resource-create' */ '@/views/resource/create.vue'),
        meta: {
          breadList: [
            {
              title: '资源管理',
              url: '/resource'
            },
            {
              title: '添加资源'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/resource/:id/edit',
        name: 'resource-edit',
        component: () => import(/* webpackChunkName: 'resource-edit' */ '@/views/resource/edit.vue'),
        meta: {
          breadList: [
            {
              title: '资源管理',
              url: '/resource'
            },
            {
              title: '编辑资源'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/resourceCategory',
        name: 'resource-category',
        component: () => import(/* webpackChunkName: 'resource-category' */ '@/views/resource-category/index.vue'),
        meta: {
          breadList: [
            {
              title: '资源分类'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          breadList: [
            {
              title: '课程管理',
              url: '/course'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue'),
        meta: {
          breadList: [
            {
              title: '课程管理',
              url: '/course'
            },
            {
              title: '添加课程'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        meta: {
          breadList: [
            {
              title: '课程管理',
              url: '/course'
            },
            {
              title: '编辑课程'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
        meta: {
          breadList: [
            {
              title: '课程管理',
              url: '/course'
            },
            {
              title: '课程结构'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */ '@/views/course/video.vue'),
        meta: {
          breadList: [
            {
              title: '课程管理',
              url: '/course'
            },
            {
              title: '上传课程视频'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          breadList: [
            {
              title: '用户管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          breadList: [
            {
              title: '广告管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/advert/create',
        name: 'advert-create',
        component: () => import(/* webpackChunkName: 'advert-create' */ '@/views/advert/create.vue'),
        meta: {
          breadList: [
            {
              title: '广告管理',
              url: '/advert'
            },
            {
              title: '添加广告'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/advert/:id/edit',
        name: 'advert-edit',
        component: () => import(/* webpackChunkName: 'advert-edit' */ '@/views/advert/edit.vue'),
        meta: {
          breadList: [
            {
              title: '广告管理',
              url: '/advert'
            },
            {
              title: '编辑广告'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'),
        meta: {
          breadList: [
            {
              title: '广告位管理'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/advert-space/create',
        name: 'space-create',
        component: () => import(/* webpackChunkName: 'space-create' */ '@/views/advert-space/create.vue'),
        meta: {
          breadList: [
            {
              title: '广告位管理',
              url: '/advert-space'
            },
            {
              title: '添加广告位'
            }
          ],
          requiresAuth: true // 自定义数据
        }
      },
      {
        path: '/advert-space/:id/edit',
        name: 'space-edit',
        component: () => import(/* webpackChunkName: 'space-edit' */ '@/views/advert-space/edit.vue'),
        meta: {
          breadList: [
            {
              title: '广告位管理',
              url: '/advert-space'
            },
            {
              title: '编辑广告位'
            }
          ],
          requiresAuth: true // 自定义数据
        },
        props: true
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：任何页面的访问都要经过这里
// to: 要去哪里的路由信息
// from: 从哪里来的路由信息
// next: 通行的标志
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // 跳转到登录页面
      next({
        name: 'login',
        query: {
          // 通过 url 传递查询字符串
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
