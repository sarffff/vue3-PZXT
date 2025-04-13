<script setup>
import { ref, onMounted } from 'vue'
import { getOrderList } from '@/api/order';
import { useRoute,useRouter } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const active = ref('')
const orderList = ref()
const getOrderListData = async (state) => {
    const { data } = await getOrderList({ state })
    data.data.forEach(item => {
        item.timer = item.order_start_time + 7200000 - Date.now()
    })
    orderList.value = data.data
    // console.log(orderList.value);
}
const clickTab = async (item) => {
    getOrderListData(item.name)
}
const formatTime = (time) => {
    return dayjs(time).format('YYYY-MM-DD')
}
onMounted(() => {
    if (route.query.active) {
        active.value = route.query.active;
    }
    getOrderListData()
})
const colorMap = ref({
    '待支付': '#ffa200',
    '待服务': '#1da6fd',
    '已完成': '#21c521',
})
const goOrderDetail = (item) => {
    router.push(`/detail?oid=${item.out_trade_no}`)
}
</script>

<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs v-model:active="active" @click-tab="clickTab">
            <van-tab title="全部" name="" />
            <van-tab title="待支付" name="1" />
            <van-tab title="待服务" name="2" />
            <van-tab title="已完成" name="3" />
            <van-tab title="已取消" name="4" />
        </van-tabs>
        <van-row v-for="item in orderList" :key="item.out_trade_no" @click="goOrderDetail(item)">
            <van-col span="5">
                <van-image :src="item.serviceImg" width="60" height="65" radius="5" />
            </van-col>
            <van-col span="14">
                <div class="text1">{{ item.service_name }}</div>
                <div class="text2">{{ item.hospital_name }}</div>
                <div class="text2">预约时间:{{ formatTime(item.order_start_time) }}</div>
            </van-col>
            <van-col class="text2" span="5" :style="{ color: colorMap[item.trade_state] }">
                {{ item.trade_state }}
            </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}

.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
}

.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;

  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }

  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}

.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>