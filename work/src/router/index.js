import { createRouter, createWebHistory } from 'vue-router'
import FvList from '@/components/FvList.vue'
import FvEditor from '@/components/FvEditor.vue'
import FvRecruitment from '@/components/FvRecruitment.vue'
import FvError from '@/components/ErrorPage.vue'
import FvNotFound from '@/components/NotFountPage.vue'

const routes = [
  {
    path: '/',
    name: 'list',
    component: FvList
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: FvEditor
  },
  {
    path: '/Recruitment/:id',
    name: 'Recruitment',
    component: FvRecruitment
  },
  {
    path: '/error',
    name: 'ServerError',
    component: FvError,
  },
  {
    path: "/:catchAll(.*)",
    name: 'NotFound',
    component: FvNotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router