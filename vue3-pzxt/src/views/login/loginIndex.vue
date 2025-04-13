<script setup>
import { ref, onBeforeUnmount, toRaw } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { getValidCode, userRegister, userLogin, userMenuPermission } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const formType = ref(false)
const formRef = ref(null)
const totalSecond = ref(60)
const currentTime = ref(totalSecond.value)
const timer = ref(false)
let intervalId = null

const rules = {
    username: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
    ],
    validCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
}

const loginForm = ref({
    username: '',
    password: '',
    validCode: ''
})

const submitting = ref(false)
const changeType = () => {
    formType.value = !formType.value
}
const getValidcode = async () => {
    try {
        await formRef.value.validateField('username');
    } catch (error) {
        ElMessage.warning(error)
    }

    if (timer.value) return;

    timer.value = true;
    intervalId = setInterval(() => {
        currentTime.value--;
        if (currentTime.value <= 0) {
            clearInterval(intervalId);
            timer.value = false;
            currentTime.value = totalSecond.value;
        }
    }, 1000);

    const res = await getValidCode(loginForm.value.username);
    if (res.data.code === 10000) {
        ElMessage.success('验证码已发送');
    }
}

const userHandle = async () => {
    if (submitting.value) return;
    submitting.value = true;

    try {
        await formRef.value.validate();

        if (formType.value) {
            if (!loginForm.value.validCode?.trim()) {
                ElMessage.error('验证码不能为空');
                return;
            }

            const res = await userRegister({
                userName: loginForm.value.username,
                passWord: loginForm.value.password,
                validCode: loginForm.value.validCode
            });
            if (res.data.code === 10000) {
                ElMessage.success('注册成功');
                formType.value = false;
            }
        } else {
            const res = await userLogin({
                userName: loginForm.value.username,
                passWord: loginForm.value.password
            });
            if (res.data.code === 10000) {
                ElMessage.success('登录成功');
                const userStore = useUserStore()
                userStore.setToken(res.data.data.token)
                // userStore.setUserInfo(res.data.data.userInfo)

                // 处理菜单权限
                const menuData = await userMenuPermission();
                console.log("后端返回的菜单数据:", menuData.data.data);

                if (menuData.data && menuData.data.code === 10000) {
                    userStore.setPermissions(menuData.data.data);
                    toRaw(userStore.routerList).forEach(item => {
                        router.addRoute('main',item);
                    });

                    console.log("当前路由列表:", router.getRoutes()); // ✅ 确保路由已注册
                }
                router.push('/')
            }
        }

    } catch (error) {
        let errorMessage = '操作失败';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        ElMessage.error(errorMessage);
    } finally {
        submitting.value = false;
    }
}

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px; ">
            <template #header>
                <div class="card-header">
                    <img src="@/assets/photo/login-head.png" alt="" />
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="changeType">
                    {{ formType ? '返回登录' : '注册账号' }}
                </el-link>
            </div>
            <el-form v-if="!formType" ref="formRef" :model="loginForm" :rules="rules" label-width="auto"
                class="demo-ruleForm" status-icon>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入手机号" :prefix-icon="User" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" :prefix-icon="Lock" />
                </el-form-item>
            </el-form>
            <el-form v-else ref="formRef" :model="loginForm" :rules="rules" label-width="auto" class="demo-ruleForm"
                status-icon>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入手机号" :prefix-icon="User" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" :prefix-icon="Lock" />
                </el-form-item>
                <el-form-item label="验证码" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="请输入验证码" :prefix-icon="Lock"
                        style="width: 70%" />
                    <el-button type="info" style="width: 30%" @click="getValidcode"
                        :disabled="totalSecond !== currentTime">
                        {{ totalSecond === currentTime ? '获取验证码' : currentTime + '秒后重试' }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-button v-if="!formType" type="primary" @click="userHandle">登录</el-button>
            <el-button v-else type="primary" @click="userHandle">注册账号</el-button>
        </el-card>
    </el-row>
</template>

<style scoped>
:deep(.el-card__header) {
    padding: 0;
}

:deep(.el-card__body) {
    display: flex;
    flex-direction: column;
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        align-self: flex-end;
        text-align: center;
        margin-bottom: 10px;

    }
}
</style>