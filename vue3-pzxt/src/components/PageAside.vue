<script setup>
import { Monitor, Menu as IconMenu, Checked, List, User } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useHeaderStore,useUserStore } from '@/stores';
import treeMenu from './treeMenu.vue'
defineProps({
    collapse: {
        type: Boolean,
        default: false
    }
})
const route = useRoute();
const headerStore = useHeaderStore();
const userStore = useUserStore();

const routequery = ref(route.path);
const subRoutes = {
    '/auth/admin': { title: '账号管理', icon: User },
    '/auth/group': { title: '菜单管理', icon: IconMenu },
    '/vppz/staff': { title: '陪护管理', icon: Checked },
    '/vppz/order': { title: '订单管理', icon: List },
    '/dashboard': { title: '控制台', icon: Monitor }

}
const menudata = userStore.routerList
watch(() => route.path, (newPath) => {
  routequery.value = newPath
  if (subRoutes[newPath]) {
    headerStore.addTab({
      path: newPath,
      ...subRoutes[newPath]
    })
  }
})
</script>

<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
        default-active="2" text-color="#fff" router :collapse="collapse">
        <div class="title">
            <slot name="title"></slot>
        </div>
        <tree-menu :menudata="menudata" :index="1" ></tree-menu>
    </el-menu>
</template>

<style scoped>
.title {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    align-items: center;
    text-align: center;
    margin: 0.5vw 0 1vw 0;
}
</style>