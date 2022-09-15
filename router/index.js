import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import student_work_submit from '@/components/student_work_submit'
import teacher from '@/components/teacher'
import student01 from '@/components/student01'
import student_class from '@/components/student_class'
import student_work from '@/components/student_work'
import resetpassword from '@/components/resetpassword'
import teacher_view from '@/components/teacher_view'
import student_work_submit01 from '@/components/student_work_submit01'
import register from '@/components/register'
import rider from '@/components/rider'
import rider_getallorder from '@/components/rider_getallorder'
import rider_haveorder from '@/components/rider_haveorder'
import rider_runall from '@/components/rider_runall'
import rider_qinall from '@/components/rider_qinall'
import rider_zeall from '@/components/rider_zeall'
import rider_chengall from '@/components/rider_chengall'
import rider_runhave from '@/components/rider_runhave'
import rider_qinhave from '@/components/rider_qinhave'
import rider_zehave from '@/components/rider_zehave'
import rider_chenghave from '@/components/rider_chenghave'


Vue.prototype.$router = Router

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path:'/student_work_submit',
      name:'student_work_submit',
      component:student_work_submit
    },
    {
        path:'/teacher',
        name:'teacher',
        component:teacher
    },
    {
        path:'/login',
        name:'login',
        component:login
    },
    {
      path:'/student01',
      name:'student01',
      component:student01
    },
    {
      path:'/student_class',
      name:'student_class',
      component:student_class
    },
    {
      path:'/student_work',
      name:'student_work',
      component:student_work
    },
    {
      path:'/resetpassword',
      name:'resetpassword',
      component:resetpassword
    },
    {
      path:'/teacher_view',
      name:'teacher_view',
      component:teacher_view
    },
    {
      path:'/student_work_submit01',
      name:'student_work_submit01',
      component:student_work_submit01
    },
    {
      path:'/register',
      name:'register',
      component:register
    },
    {
      path:'/rider',
      name:'rider',
      component:rider,
      children:[{
        path:'/rider_getallorder',
        name:'rider_getallorder',
        component:rider_getallorder,
      },
      {
        path:'/rider_haveorder',
        name:'rider_haveorder',
        component:rider_haveorder,
      },
      {
        path:'/rider_runall',
        name:'rider_runall',
        component:rider_runall,
      },
      {
        path:'/rider_qinall',
        name:'rider_qinall',
        component:rider_qinall,
      },
      {
        path:'/rider_zeall',
        name:'rider_zeall',
        component:rider_zeall,
      },
      {
        path:'/rider_chengall',
        name:'rider_chengall',
        component:rider_chengall,
      },
      {
        path:'/rider_runhave',
        name:'rider_runhave',
        component:rider_runhave,
      },
      {
        path:'/rider_qinhave',
        name:'rider_qinhave',
        component:rider_qinhave,
      },
      {
        path:'/rider_zehave',
        name:'rider_zehave',
        component:rider_zehave,
      },
      {
        path:'/rider_chenghave',
        name:'rider_chenghave',
        component:rider_chenghave,
      },
    ]
    },
  ]
})
