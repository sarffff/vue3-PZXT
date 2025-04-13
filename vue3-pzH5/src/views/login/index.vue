<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '@/api/user'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const Form = ref({
    username: '',
    password: ''
})

// 表单提交
const onSubmit = async() => {
    const {data} = await userLogin({
        userName: Form.value.username,
        passWord: Form.value.password
    })
    if (data.code === 10000) {
        userStore.setToken(data.data.token)
        userStore.setUserInfo(data.data.userInfo)
        router.replace('/home')
    }
}


</script>

<template>
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
        <van-field v-model="Form.username" name="用户名" label="用户名" placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="Form.password" type="password" name="密码" label="密码" placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">提交</van-button>
        </div>
    </van-form>
</template>

<style lang="less" scoped>
h1 {
    text-align: center;
}
</style>