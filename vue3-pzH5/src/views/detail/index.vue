<script setup>
import progressBar from '@/components/progressBar.vue';
import { getOrderDetails } from '@/api/order';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import QRcode from 'qrcode'
const route = useRoute()
const detailData = ref({})
const state = {
    '待支付': 10,
    '待服务': 20,
    '已完成': 30,
    '已取消': 40
}
const showcode = ref(false)
const code = ref('')
const closeCode = async () => {
    showcode.value = false
}
onMounted(async () => {
    const { data } = await getOrderDetails({ oid: route.query.oid });
    if (data.code === 10000) {
        detailData.value = data.data
        console.log(detailData.value);
        QRcode.toDataURL(data.data.code_url).then(url => {
            code.value = url
        })
    }
})
const makeInfo = ref({
    service_name: "预约服务",
    hospital_name: "就诊医院",
    starttime: "期望就诊时间",
    "client.name": "就诊人",
    "client.mobile": "就诊人电话",
    receiveAddress: "接送地址",
    demand: "其他需求",
});
const orderInfo = ref({
    tel: "联系电话",
    order_start_time: "下单时间",
    price: "应付金额",
    out_trade_no: "订单编号",
});
const formatData = (key) => {
    if (key.indexOf(".") === -1) {
        if (key === "order_start_time") {
            return formatTimestamp(detailData.value[key]);
        }
        return detailData.value[key];
    }
    let arr = key.split(".").reduce((o, p) => {
        return (o || {})[p];
    }, detailData.value);
    return arr;
}
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

</script>

<template>
    <div class="container">
        <div class="header">
            <van-icon @click="$router.go(-1)" name="arrow-left" class="header-left" size="30" />
            订单详情
        </div>
        <progressBar :item="state[detailData.trade_state]"></progressBar>
        <div class="tips">
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">请在30分钟内完成支付,否则订单将自动取消</div>
                <div class="text3">
                    <van-button size="large" type="success" @click="showcode = true">立即支付{{
                        detailData.price }}元</van-button>
                </div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员</div>
                <div class="text2">请保持手机畅通,稍后会有服务专员联系您</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用,如有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为你服务,如需帮助可咨询客服</div>
            </div>
            <van-cell-group class="card">
                <div class="header-text">预约信息</div>
                <van-cell v-for="(item, key) in makeInfo" :title="item" :key="key" :value="formatData(key)" />
            </van-cell-group>
            <van-cell-group class="card">
                <div class="header-text">订单信息</div>
                <van-cell v-for="(item, key) in orderInfo" :title="item" :key="key" :value="formatData(key)" />
                <van-cell title="联系客服" value="疑问或投诉" />
            </van-cell-group>
        </div>
        <van-dialog :show-confirm-button="false" v-model:show="showcode">
            <van-icon name="cross" @click="closeCode" class="close" />
            <div>微信支付</div>
            <van-image height="150" width="150" :src="code" />
            <div>请使用本人微信扫描二维码</div>
        </van-dialog>
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

    .header-left {
        float: left;
    }
}

.card {
    margin: 15px 0;
    padding: 10px;

    .header-text {
        padding-left: 5px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-left: 4px solid red;
    }
}

.dzf {
    padding: 20px;

    .text1 {
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        color: #666;
    }

    .text2 {
        font-size: 14px;
        color: #666;
    }

    .text3 {
        text-align: center;

        .van-button {
            margin-top: 10px;
            margin-left: 10px;
            width: 80%;
            font-weight: bold;
        }
    }
}

::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
        position: absolute;
        left: 20px;
    }
}
</style>