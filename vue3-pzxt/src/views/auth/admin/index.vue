<script setup>
import { authAdmin, userMenuSelect, userUpdate } from '@/api/user';
import panelHead from '@/components/panelHead.vue';
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
const route = useRoute();
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
});
const adminListData = ref({
  list: [],
  total: 0,
})
const getAdminList = async () => {
  const { data: { data: { list, total } } } = await authAdmin(paginationData.value)
  adminListData.value.list = list
  adminListData.value.total = total
}
const options = ref([])
onMounted(async () => {
  // 先加载权限选项
  const { data } = await userMenuSelect()
  options.value = data.data
  // 加载管理员列表
  getAdminList()
})
// 权限匹配方法
const matchPermission = (row) => {
  const id = row.permissions_id

  // 防御性编程
  if (!Array.isArray(options.value)) return '-'
  if (options.value.length === 0) return '加载中...'

  const target = options.value.find(item => item.id === id)
  return target?.name || '未分配权限'
}

const formatTime = (row) => {
  return dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss')
}

const adminForm = ref({
  name: '',
  mobile: '',
  permissions_id: '',
})
const adminFormRef = ref()
const dialogVisible = ref(false)
const rules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  permissions_id: [
    {
      required: true,
      message: '请选择一个菜单权限',
      trigger: 'blur',
    },
  ],
}
const handleMenu = (row) => {
  // 打开对话框
  dialogVisible.value = true
  adminForm.value.mobile = row.mobile
}
const confirm = async (formEl) => {
  // 状态管理：防止重复提交
  const loading = ref(false)
  try {
    // 表单实例校验
    if (!formEl) {
      console.error('表单实例未找到')
      return
    }
    //  启动加载状态
    loading.value = true
    // 执行表单验证（Element Plus 推荐写法）
    const valid = await formEl.validate()
    if (!valid) return // 理论上不会进入，因验证失败会抛出异常
    // 发送请求
    const { data } = await userUpdate(adminForm.value)
    if (data.code === 10000) {
      // 成功提示
      ElMessage.success('修改成功')
      // 关闭对话框
      dialogVisible.value = false
      // 刷新列表
      getAdminList()
    }
  } catch (error) {
    // 错误处理
    ElMessage.warning(error)
  } finally {
    // 重置加载状态
    loading.value = false
  }
}
const handleSizeChange = (val) => {
  console.log(val)
} 
const handleCurrentChange = (val) => { 
  paginationData.value.pageNum = val
  authAdmin(paginationData.value)
}
</script>

<template>
  <panel-head :route="route" />
  <el-table :data="adminListData.list" style="width: 100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ matchPermission(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="{ row }">
        {{ formatTime(row) }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button type="primary" @click="handleMenu(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
      :background="false" layout="total, prev, pager, next" :total="adminListData.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
  <!-- 编辑权限 -->
  <el-dialog v-model="dialogVisible" title=" 编辑权限" width="450">
    <el-form ref="adminFormRef" :model="adminForm" :rules="rules">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="adminForm.mobile" disabled style="width: 300px; margin-left: 1.3vw;" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="adminForm.name" style="width: 300px; margin-left: 1.5vw;" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select v-model="adminForm.permissions_id" placeholder="请选择菜单权限" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm(adminFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.pagination {
  float: right;
  margin-right: 1vw;
}
</style>
