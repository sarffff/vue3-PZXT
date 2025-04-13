<script setup>


</script>

<template>
    <RouterView />
    <van-tabbar route>
        <van-tabbar-item icon="home-o" to='/home'>首页</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/order">订单</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
</template>

<style scoped></style>