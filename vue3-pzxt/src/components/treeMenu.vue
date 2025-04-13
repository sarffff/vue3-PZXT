<script setup>
import { resolveComponent } from "vue";
import { useRouter } from "vue-router";
import { useHeaderStore  } from "@/stores"; // Pinia Store
import * as ElementPlusIconsVue from "@element-plus/icons-vue"; // 导入所有 Element Plus 图标

const props = defineProps(["index", "menudata"]);
const menuStore = useHeaderStore();
const router = useRouter();

// 动态解析 Element Plus 图标
const getIconComponent = (iconName) => {
  return ElementPlusIconsVue[iconName] || resolveComponent(iconName) || "div"; // 兜底处理
};

// 点击菜单
const handleClick = (item, active) => {  
  menuStore.addMenu(item.meta);
  menuStore.updateMenuActive(active);
  router.push(item.meta.path);
};
</script>

<template>
  <template v-for="(item, index) in props.menudata" :key="`${props.index}-${item.meta.id}`">
    <el-menu-item
      v-if="!item.children || item.children.length === 0"
      :index="`${props.index}-${item.meta.id}`"
      @click="handleClick(item, `${index}-${item.meta.id}`)"
    >
      <el-icon size="20">
        <component :is="getIconComponent(item.meta.icon)" />
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="getIconComponent(item.meta.icon)" />
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu :index="`${props.index}-${item.meta.id}`" :menudata="item.children" />
    </el-sub-menu>
  </template>
</template>




<style  scoped>

</style>
