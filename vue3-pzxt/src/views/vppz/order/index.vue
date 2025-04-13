<script setup>
import panelHead from '@/components/panelHead.vue';
import { getOrderList } from '@/api/user';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
const route = useRoute()
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})
const orderListData = ref({
  list: [],
  total: 0
})
const getTagType = (state) => {
  switch (state) {
    case '待服务','待支付':
      return 'primary';
    case '已完成':
      return 'success';
    case '已取消':
      return 'info';
  }
}
const searchForm = ref({
  out_trade_no: ''
})
const getorder = () => {
  
}
const getorderList = async () => {
  const { data: { data: { list, total } } } = await getOrderList(paginationData.value)
  orderListData.value.list = list
  orderListData.value.total = total
  // const res = await getOrderList(paginationData.value)
  console.log(orderListData.value.list);
}
getorderList()
const handlePay = (row) => {
  row.trade_state = '已完成'
  getorderList()
}
</script>

<template>
  <panelHead :route="route"></panelHead>
  <div class="form">
    <el-form inline="true" :model="searchForm">
      <el-form-item prop="put_trade_no">
        <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" />      
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="getorder">搜索</el-button>

      </el-form-item>
    </el-form>

  </div>
  <el-table :data="orderListData.list" style="width: 100%">
    <el-table-column prop="out_trade_no" label="订单号" width="150"/>
    <el-table-column prop="hospital_name" label="就诊医院" />
    <el-table-column prop="service_name" label="陪诊服务" width="140"/>
    <el-table-column prop="serveiceImg" label="陪护师">
      <template #default="{ row }">
        <el-image :src="row.companion.avatar" style="width: 50px; height: 50px" />
      </template>
    </el-table-column>
    <el-table-column prop="companion.mobile" label="陪护师手机号" />
    <el-table-column prop="price" label="总价" width="80"/>
    <el-table-column prop="paidPrice" label="已付" width="80"/>
    <el-table-column prop="order_start_time" label="下单时间">
      <template #default="{ row }">
        {{ dayjs(row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column prop="trade_state" label="订单状态">
      <template #default="{ row }">
        <el-tag :type="getTagType(row.trade_state)">{{ row.trade_state }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态" />
    <el-table-column prop="tel" label="联系人手机号" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-popconfirm v-if="row.trade_state === '待服务'" title="确定完成吗?" @confirm="handlePay(row)">
          <template #reference>
            <el-button type="primary" size="small">服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="info" size="small">已完成</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style  scoped>
.form{
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
