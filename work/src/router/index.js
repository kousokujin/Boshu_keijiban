import { createRouter, createWebHistory } from 'vue-router'
import FvList from '@/components/FvList.vue'
import FvEditor from '@/components/FvEditor.vue'
import FvRecruitment from '@/components/FvRecruitment.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router