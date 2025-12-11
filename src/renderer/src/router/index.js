import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/create'
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreateProjectView.vue')
  },
  {
    path: '/nginx',
    name: 'nginx',
    component: () => import('../views/NginxConfigView.vue')
  },
  {
    path: '/ssl',
    name: 'ssl',
    component: () => import('../views/SslGeneratorView.vue')
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/ManageToolsView.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
