import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: { name: 'home' } },
      { path: 'home', name: 'home', component: () => import('../views/HomeView.vue') },
      { path: 'button', name: 'button', component: () => import('../demos/ButtonDemo.vue') },
      {
        path: 'breadcrumb',
        name: 'breadcrumb',
        component: () => import('../demos/BreadcrumbDemo.vue'),
      },
      { path: 'divider', name: 'divider', component: () => import('../demos/DividerDemo.vue') },
      { path: 'image', name: 'image', component: () => import('../demos/ImageDemo.vue') },
      { path: 'card', name: 'card', component: () => import('../demos/CardDemo.vue') },
      { path: 'tag', name: 'tag', component: () => import('../demos/TagDemo.vue') },
      { path: 'input', name: 'input', component: () => import('../demos/InputDemo.vue') },
      { path: 'form', name: 'form', component: () => import('../demos/FormDemo.vue') },
      { path: 'checkbox', name: 'checkbox', component: () => import('../demos/CheckboxDemo.vue') },
      { path: 'radio', name: 'radio', component: () => import('../demos/RadioDemo.vue') },
      { path: 'select', name: 'select', component: () => import('../demos/SelectDemo.vue') },
      {
        path: 'number-stepper',
        name: 'number-stepper',
        component: () => import('../demos/NumberStepperDemo.vue'),
      },
      { path: 'dialog', name: 'dialog', component: () => import('../demos/DialogDemo.vue') },
      {
        path: 'message-box',
        name: 'message-box',
        component: () => import('../demos/MessageBoxDemo.vue'),
      },
      { path: 'loading', name: 'loading', component: () => import('../demos/LoadingDemo.vue') },
      { path: 'popover', name: 'popover', component: () => import('../demos/PopoverDemo.vue') },
      { path: 'menu', name: 'menu', component: () => import('../demos/MenuDemo.vue') },
      {
        path: 'nav-menu',
        name: 'nav-menu',
        component: () => import('../demos/NavMenuDemo.vue'),
      },
      { path: 'tabs', name: 'tabs', component: () => import('../demos/TabsDemo.vue') },
      {
        path: 'pagination',
        name: 'pagination',
        component: () => import('../demos/PaginationDemo.vue'),
      },
      {
        path: 'scroll-container',
        name: 'scroll-container',
        component: () => import('../demos/ScrollContainerDemo.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
