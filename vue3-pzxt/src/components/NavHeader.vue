<script setup>
import { Fold } from '@element-plus/icons-vue'
import { useHeaderStore,useUserStore } from '@/stores';
import * as Icons from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const headerStore = useHeaderStore();
const handCollapse = () => {
    headerStore.changeCollapse();
}
const router = useRouter()

// 动态导入图标组件的函数
const getIconComponent = (iconName) => {
    return Icons[iconName] || null;
};

const handleClick = (path) => {
    router.push(path)
    headerStore.updateActive(path)
}

const handleClose = (path) => {
    headerStore.removeTab(path)
    if (headerStore.activeTab === path) {
        const lastTab = headerStore.visitedTabs.slice(-1)[0]
        if (lastTab) {
            router.push(lastTab.path)
        } else {
            router.push('/dashboard')
        }
    }
}
const handleCommand = (command) => { 
    if (command === 'cancel') {
        useUserStore().removeToken()
        ElMessage.success('退出成功')
        router.replace('/login')   
    }
}
</script>

<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon @click="handCollapse" class="fold-icon">
                <Fold />
            </el-icon>
            <div class="custom-header-nav">
                <el-menu v-for="tab in headerStore.visitedTabs" :key="tab.path" class="header-nav"
                    :class="{ 'active': headerStore.activeTab === tab.path }">
                    <el-icon class="tab-icon" size="16px">
                        <component :is="getIconComponent(tab.icon.name)" />
                    </el-icon>
                    <span class="tab-title" @click="handleClick(tab.path)">{{ tab.title }}</span>
                    <el-icon class="close-icon" @click="handleClose(tab.path)" size="20">
                        <component :is="getIconComponent('Close')" />
                    </el-icon>
                </el-menu>
            </div>
        </div>

        <div class="header-right">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="username">admin</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<style scoped>

.flex-box {
    display: flex;
    align-items: center;
}
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;
        width: 100%;

        .fold-icon {
            width: 50px;
            height: 100%;
            font-size: 25px;
        }

        .fold-icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .custom-header-nav {
            display: flex;
            line-height: 60px;
            height: 100%;
            .header-nav {
                display: flex;
                align-items: center;
                height: 100%;
                padding: 0 5px;
                margin-right: 5px;
                cursor: pointer;
                .tab-icon {
                    margin-right: 8px;
                }

                .tab-title {
                    font-size: 17px;
                    white-space: nowrap;
                }

                .close-icon {
                    margin-left: 5px;
                    visibility: hidden;
                }
            }

            .header-nav:hover {
                background-color: #f5f5f5;

                .close-icon {
                    visibility: visible;
                }
            }
            .header-nav.active{
                color: #409eff;
            }
        }
    }
    .header-right {
        .username {
            margin-left: 10px;
            font-size: 18px;
            color: #333;
        }
    }
}
</style>