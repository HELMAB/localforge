import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/projects',
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ManageProjectView.vue'),
  },
  {
    path: '/virtual-hosts',
    name: 'virtual-hosts',
    component: () => import('../views/ManageVirtualHostView.vue'),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ManageServicesView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/ManageSettingsView.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
