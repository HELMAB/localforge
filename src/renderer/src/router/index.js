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
  {
    path: '/expose',
    name: 'expose',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Expose' },
  },
  {
    path: '/mail',
    name: 'mail',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Mail' },
  },
  {
    path: '/dumps',
    name: 'dumps',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Dumps' },
  },
  {
    path: '/debugger',
    name: 'debugger',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Debugger' },
  },
  {
    path: '/herd-pro',
    name: 'herd-pro',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Herd Pro' },
  },
  {
    path: '/shortcuts',
    name: 'shortcuts',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Shortcuts' },
  },
  {
    path: '/integrations',
    name: 'integrations',
    component: () => import('../views/PlaceholderView.vue'),
    props: { title: 'Integrations' },
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
