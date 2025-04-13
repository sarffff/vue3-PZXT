<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores';
const userStore = useUserStore();
const userInfo = userStore.userInfo;
import { useRouter } from 'vue-router';

const router = useRouter();
const goOrder = (type) => {
    router.push(`/order?active=${type}`)
}
const showLogout = ref(false)
const logout = () => {
    showLogout.value = true
}
const confirmLogout = () => {
    localStorage.removeItem('h5-token');
    localStorage.removeItem('h5-userInfo');
    router.push('/login')
}
</script>

<template>
    <div class="container">
        <div class="user">
            <van-image class="img" width="100" height="100" :src="userInfo.avatar" />
            <div class="text">{{ userInfo.name }}</div>
        </div>
        <div class="order">
            <div class="top">
                <div class="text1">我的订单</div>
                <div class="text2">查看全部</div>
            </div>
            <div class="bottom">
                <div @click="goOrder(1)" class="item">
                    <van-image width="40" height="40" src="/static/od_10.png" />
                    <div>待支付</div>
                </div>
                <div @click="goOrder(2)" class="item">
                    <van-image width="40" height="40" src="/static/od_20.png" />
                    <div>待服务</div>
                </div>
                <div @click="goOrder(3)" class="item">
                    <van-image width="40" height="40" src="/static/od_30.png" />
                    <div>已完成</div>
                </div>
                <div @click="goOrder(4)" class="item">
                    <van-image width="40" height="40" src="/static/od_40.png" />
                    <div>已取消</div>
                </div>
            </div>
            <div class="foot">
                <div class="foot1">
                    <div class="text1">
                        <van-image width="30" height="30" src="/static/ic_clients.png" />
                        服务对象管理
                    </div>
                    <div class="text2">
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="foot2">
                    <div class="text1">
                        <van-image width="30" height="30" src="/static/ic_share.png" />
                        分享转发
                    </div>
                    <div class="text2">
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
            <van-button @click="logout" type="danger" class="quit" round size="large">退出登录</van-button>
            <van-dialog v-model:show="showLogout" title="提示" @cancel="showLogout = false" @confirm="confirmLogout" show-cancel-button>
                <div class="quit_text">确定退出登录吗?</div>
            </van-dialog>
        </div>
    </div>
</template>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
    overflow: hidden;

    .user {
        width: 95%;
        height: 200px;
        background-color: #fff;
        text-align: center;
        border-radius: 10px;
        margin: 10px;

        .img {
            margin-top: 30px;
        }

        .text {
            line-height: 30px;
            font-weight: bold;
        }
    }

    .order {
        width: 90%;
        margin: 10px;
        border-radius: 5px;
        background-color: #fff;
        padding: 10px;

        .top {
            margin: 10px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;

            .text1 {
                color: #333;
            }

            .text2 {
                color: #999;
            }

            border-bottom: 0.5px solid #f5f5f5;
        }

        .bottom {
            padding: 10px;
            display: flex;
            justify-content: space-around;

            .item {
                font-size: 14px;
                color: #999;
            }
        }
    }

    .foot {
        padding: 10px 10px 0 10px;
        line-height: 30px;
        background-color: #fff;

        .foot1,
        .foot2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #555;
            margin-top: 10px;

            .text1,
            .text2 {
                display: flex;
                align-items: center;
            }

            .text1 van-image,
            .text2 van-icon {
                margin-right: 5px;
                /* 可以根据需要调整图标和文字之间的间距 */
                vertical-align: middle;
            }
        }

        .foot1 {
            border-bottom: 0.5px solid #f5f5f5;
        }
    }

    .quit {
        width: 90%;
        margin: 20px;
    }

    .quit_text {
        margin: 20px 0;
        text-align: center;
    }
}
</style>