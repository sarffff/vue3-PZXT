import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router'; // 引入 Vue Router 实例

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref({});
  const routerList = ref([]);

  const setToken = (value) => {
    token.value = value;
  };

  const removeToken = () => {
    localStorage.removeItem('pzxt_user_token');
  };

  const setUserInfo = (value) => {
    userInfo.value = value;
  };

  const removeUserInfo = () => {
    userInfo.value = {};
  };

  // **设置权限并存储路由**
  const setPermissions = (value) => {
    // console.log("动态注册路由:", value);
    const modules = import.meta.glob('@/views/**/**/*.vue'); // 获取所有 Vue 组件

    const routerSet = (routes) => {
      routes.forEach(route => {
        if (!route.children) {
          const matchedPath = Object.keys(modules).find(path =>
            path.endsWith(`${route.meta.path}/index.vue`) // 适配 meta.path
          );
          if (matchedPath) {
            route.component = modules[matchedPath]; // 赋值动态组件
          } else {
            console.warn(`未找到匹配组件: ${route.meta.path}`);
          }
        } else {
          routerSet(route.children); // 递归处理子路由
        }
      });
    };

    routerSet(value);
    routerList.value = value;

    // **将路由信息存入 localStorage，刷新后恢复**
    localStorage.setItem('routerList', JSON.stringify(value));
  };

  // **恢复路由**
  const restorePermissions = () => {
    const savedRouterList = localStorage.getItem('routerList');
    if (savedRouterList) {
      const routes = JSON.parse(savedRouterList);
      setPermissions(routes); // 恢复权限

      // **遍历 routerList 并添加到路由**
      routes.forEach(parentRoute => {
        if (!router.hasRoute(parentRoute.name)) {
          router.addRoute('main', parentRoute);
        }

        (parentRoute.children || []).forEach(childRoute => {
          if (!router.hasRoute(childRoute.name)) {
            router.addRoute(parentRoute.name, childRoute);
          }
        });
      });

      // console.log("恢复后的路由列表:", router.getRoutes());
    }
  };

  return {
    routerList,
    token,
    userInfo,
    setToken,
    removeToken,
    setUserInfo,
    removeUserInfo,
    setPermissions,
    restorePermissions
  };
}, {
  persist: {
    key: 'pzxt_user_token',
    paths: ['token', 'userInfo', 'routerList']
  }
});
