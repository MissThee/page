//meta中为自定义变量
//hidden：       是否显示在侧边栏
//title：        侧边栏名称
//tabCanClose：  tab是否显示关闭按钮
//value：        绑定的权限值（此值与用户的权限值permissionList关联，决定显示哪些路由）
export default [
  {
    path: '/',
    name: 'root',
    component: () => import('src/docviewer/views/layout/Layout'),
    meta: {isHomePage: true, hidden: false, title: '文件查看'},
    redirect: '/setting',
    children: [{
      path: '/md',
      name: 'md',
      component: () => import('src/docviewer/views/content/md/MarkdownDoc'),
      meta: {title: '文档', tabCanClose: false},
    }, {
      path: '/setting',
      name: 'setting',
      component: () => import('src/docviewer/views/content/setting/Setting'),
      meta: {title: '设置', tabCanClose: false},
    }, {
      path: '/info',
      name: 'info',
      component: () => import('src/docviewer/views/content/info/Info'),
      meta: {title: '说明', tabCanClose: false},
    },],
  }

];