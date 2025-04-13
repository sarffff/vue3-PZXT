<script setup>
import { ref, onMounted } from 'vue'
import { getIndexInfo } from '@/api/user';
import { useRouter } from 'vue-router';
const router = useRouter()
const searchValue = ref('')
const homeData = ref({
    hospitals: [],
    nav2s: [],
    navs: [],
    now: '',
    slides: []
})
const getindexInfo = async () => {
    const { data } = await getIndexInfo()
    if (data.code === 10000) {
        Object.assign(homeData.value, data.data)
    }
}
onMounted(() => {
    getindexInfo()
})
//跳转到对应订单
const getOrderTwo = (index) => {
    router.push(`/createorder?id=${homeData.value.hospitals[index].id}`)
}
const goOrder = (item) => { 
    router.push(`/createorder?id=${item.id}`)
}
</script>

<template>
    <div class="header">
        <div class="header-left">
            中部地区
            <van-icon name="arrow" />
        </div>
        <van-search v-model="searchValue" shape="round" placeholder="请输入搜索关键词" />
    </div>
    <van-swipe class="my-swiper" :autoplay="3000" indicator-color="white" height="170">
        <van-swipe-item v-for="item in homeData.slides" :key="item.id">
            <van-image :src="item.pic_image_url" fit="cover" radius="5" />
        </van-swipe-item>
    </van-swipe>
    <van-row justify="space-around">
        <van-col v-for="(item, index) in homeData.nav2s" :key="item.id" class="center-img" @click="getOrderTwo(index)"
            span="11">
            <van-image :src="item.pic_image_url" fit="cover" />
        </van-col>
    </van-row>
    <van-row @click="goOrder(item)" v-for="item in homeData.hospitals" :key="item.id" class="yy-list" justify="space-around">
        <van-col span="6">
            <van-image :src="item.avatar_url" height="90" width="100"></van-image>
        </van-col>
        <van-col class="yy" span="15">
            <div class="yy-name">{{ item.name }}</div>
            <div class="yy-type">
                <span>{{item.rank }}</span>
                &nbsp;
                <span>{{item.label }}</span>
            </div>
            <div class="yy-text">{{ item.intro }}</div>
        </van-col>
    </van-row>
</template>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin: 5px;
    line-height: 54px;

    .header-left {
        padding-left: 22px;
        background: url(@/assets/bgImg.jpg) no-repeat left center;
        background-size: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #666666;
    }
}

.my-swiper {
    margin: 5px;
}

.yy-list {
    padding-bottom: 10px;
    margin: 20px 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 6px 0 rgba(0, 0, 0, 0.04);

    .yy {
        .yy-name {
            font-size: 20px;
            line-height: 30px;
            font-weight: bold;
        }

        .yy-type {
            font-weight: bold;
            line-height: 25px;
            font-size: 15px;
            color: #0ca7ae;
        }

        .yy-text {
            font-size: 14px;
            color: #999999;
        }
    }
}

.bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
}
</style>