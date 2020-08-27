export default {
  path: '/',
  name: 'home',
  component: () => import('../view/Home.vue'),
  children: [
    {
      path: '',
      redirect: '/test'
    },
    {
      path: 'test',
      name: '测试穿梭框',
      component: () => import('../view/Test.vue')
    },
    {
      path: 'test2',
      name: 'link-comp',
      component: () => import('../view/Test2.vue')
    },
  ]

}
