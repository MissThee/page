//meta中为自定义变量
//hidden：       是否显示在侧边栏
//title：        侧边栏名称
//tabCanClose：  tab是否显示关闭按钮
//value：        绑定的权限值（此值与用户的权限值permissionList关联，决定显示哪些路由）
export default [
  {
    path: '/',
    component: () => import('src/views/layout/Layout'),
    meta: { isHomePage:true, hidden: false, title: '文件查看' },
    children: [{
      path: '/home',
      name: 'home',
      component: () => import('src/views/content/home/Home'),
      meta: { title: '主页', tabCanClose: false },
    },{
      path: '/',
      name: 'md',
      component: () => import('src/views/content/md/MarkdownDoc'),
      meta: { title: '文档', tabCanClose: false },
    }],
  },

];
