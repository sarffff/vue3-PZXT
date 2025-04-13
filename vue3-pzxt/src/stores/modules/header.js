import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHeaderStore = defineStore('header', () => {
  const isCollapse = ref(false)
  const visitedTabs = ref([]);
  const activeTab = ref('');
  const activeMenu = ref('1-1');
  const menus = ref([]);
  const changeCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  const addTab = (tab) => {
    if (!visitedTabs.value.some(v => v.path === tab.path)) {
      visitedTabs.value.push(tab)
    }
    activeTab.value = tab.path
  }
  const removeTab = (path) => {
    visitedTabs.value = visitedTabs.value.filter(v => v.path !== path)
  }
  const updateActive = (path) => {
    activeTab.value = path
  }
  const addMenu = (menu)  => {
    if (menus.value.find((m) => m.id === menu.id)) {
      menus.value.push(menu);
    }
  }
  const updateMenuActive = (active) => {
    activeMenu.value = active;
  }
  return {
    isCollapse,
    changeCollapse,
    addTab,
    removeTab,
    updateActive,
    visitedTabs,
    activeTab,
    addMenu,
    updateMenuActive,
    activeMenu
  }
},
  {
    persist: true
  }
)