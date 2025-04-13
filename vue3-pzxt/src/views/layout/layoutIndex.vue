<script setup>
import PageAside from '@/components/PageAside.vue';
import NavHeader from '@/components/NavHeader.vue';
import { useHeaderStore } from '@/stores';
import { ref ,watch} from 'vue';
const headerStore = useHeaderStore();
const collapse = ref(headerStore.isCollapse)

watch(() => headerStore.isCollapse,
    (newVal) => {
        collapse.value = newVal
    })
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧固定侧边栏 -->
      <page-aside class="page-aside" 
      :collapse="collapse"
      >
        <template #title>
          DIDI陪诊
        </template>
      </page-aside>

      <!-- 右侧内容区域 -->
      <el-container direction="vertical">
        <el-header class="layout-header">
          <nav-header class="header-container" />
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;

  /* 整个布局容器设置为 flex */
  .el-container {
    height: 100%;
    flex-wrap: nowrap;
  }

  .layout-header {
    padding: 0;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .page-aside {
    /* 固定宽度 */
    height: 100vh;
    overflow-y: auto;
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: width 0.3s ease; /* 添加过渡动画 */
  }

  /* 右侧内容区域 */
  .el-container[direction="vertical"] {
    flex: 1;
    margin-left: 200px;
    /* 留出侧边栏空间 */
  }

  el-main {
    padding: 20px;
    background: #f0f2f5;
  }
}
</style>