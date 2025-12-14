import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/create',
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreateProjectView.vue'),
  },
  {
    path: '/nginx',
    name: 'nginx',
    component: () => import('../views/NginxConfigView.vue'),
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/ManageToolsView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
