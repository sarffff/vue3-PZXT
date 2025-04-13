<script setup>
import { ref, nextTick } from 'vue'
import { userGetMenu, userSetmenu, userGetMenulist } from '@/api/user'
import { ElMessage } from 'element-plus'
import panelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const dialogVisible = ref(false)
const isEditMode = ref(false)
const groupForm = ref({
  name: '',
  permissions: '',
  id: ''
})
const groupFormRef = ref()
const treeRef = ref()
const menuList = ref([])
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})
const menuListData = ref({
  list: [],
  total: 0
})
const rules = ref({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
const userGetMenuList = async () => {
  const res = await userGetMenu()
  if (res.data.code === 10000) {
    menuList.value = res.data.data
  }
  getListData()
}
userGetMenuList()

const handleFormError = (error) => {
  // 表单验证错误
  if (error?.fields) {
    const errorMsg = Object.values(error.fields)
      .flatMap(field => field)
      .join('；')
    ElMessage.error(`表单校验失败：${errorMsg}`)
    return
  }

  // 网络错误
  if (error.message?.includes('Network Error')) {
    ElMessage.error('网络异常，请检查网络连接')
    return
  }

  // 服务端错误（需根据实际接口结构调整）
  if (error.response?.data) {
    const { code, message } = error.response.data
    ElMessage.error(`[${code}] ${message}`)
    return
  }

  // 未知错误
  console.error('未知错误:', error)
  ElMessage.error('系统异常，请稍后重试')
}
const confirm = async (formEl) => {
  // 状态管理：防止重复提交
  const loading = ref(false)
  try {
    // 1. 表单实例校验
    if (!formEl) {
      console.error('表单实例未找到')
      return
    }
    // 2. 启动加载状态
    loading.value = true
    // 3. 执行表单验证（Element Plus 推荐写法）
    const valid = await formEl.validate()
    if (!valid) return // 理论上不会进入，因验证失败会抛出异常
    // 4. 业务数据校验
    // 4.1 用户组名称校验
    if (!groupForm.value.name?.trim()) {
      ElMessage.error('用户组名称不能为空')
      return
    }

    // 4.2 权限选择校验
    const checkedKeys = treeRef.value?.getCheckedKeys() || []
    if (checkedKeys.length === 0) {
      ElMessage.error('请至少选择一项权限')
      return
    }
    // 5. 数据格式处理
    const permissions = JSON.stringify(checkedKeys)
    // 6. 提交请求
    const res = await userSetmenu({
      name: groupForm.value.name.trim(),
      permissions,
      id: groupForm.value.id
    })
    if (res.data.code === 10000) {
      ElMessage.success('权限设置成功')
      dialogVisible.value = false
      userGetMenuList()
    }

  } catch (error) {
    // 8. 错误处理
    handleFormError(error)
  } finally {
    // 9. 重置加载状态
    loading.value = false
  }
}
const getListData = async () => {
  const res = await userGetMenulist(paginationData.value)
  menuListData.value.list = res.data.data.list
  menuListData.value.total = res.data.data.total
}
const loadFormData = async (row) => {

  Object.assign(groupForm.value, {
    id: row.id,
    name: row.name || ''
  });
  await nextTick();
  if (treeRef.value) {
    treeRef.value.setCheckedKeys(row.permission);
  } else {
    console.error("treeRef is not properly bound or not available.");
  }

};
const resetForm = () => {
  Object.assign(groupForm.value, {
    id: null,
    name: '',
    permissions: []
  });
  if (groupFormRef.value) {
    groupFormRef.value.resetFields();
  }
};
const handleMenu = (row) => {
  // 判断是否为空对象（兼容性写法）
  const isEmptyObj = Object.keys(row).length === 0 && row.constructor === Object;

  // 设置操作模式
  isEditMode.value = !isEmptyObj;

  // 重置表单（新增模式）
  if (isEmptyObj) {
    resetForm();
  } else { // 填充数据（编辑模式）
    loadFormData(row);
  }
  // 打开对话框
  dialogVisible.value = true;
};

const handleSizeChange = (val) => {
  console.log(val)
} 
const handleCurrentChange = (val) => { 
  paginationData.value.pageNum = val
  userGetMenulist(paginationData.value)
}
</script>


<template>
  <panel-head :route="route" />
  <el-button type="primary" @click="handleMenu({})">添加权限</el-button>
  <el-table :data="menuListData.list" style="width: 100%">
    <el-table-column prop="id" label="ID" width="300" />
    <el-table-column prop="name" label="昵称" width="400" />
    <el-table-column prop="permissionName" label="菜单权限" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button type="primary" @click="handleMenu(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
 <div class="pagination">
  <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      layout="total, prev, pager, next"
      :total="menuListData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
 </div>
  <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑权限' : ' 添加权限'" width="450">
    <el-form ref="groupFormRef" :model="groupForm" class="demo-groupForm" :rules="rules">
      <el-form-item v-show="false" label="ID" prop="id">
        <el-input v-model="groupForm.id" placeholder="请输入ID" style="width: 95%; margin-left: 20px;" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="groupForm.name" placeholder="请输入权限名称" style="width: 95%; margin-left: 20px;" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree ref="treeRef" :data="menuList" show-checkbox node-key="id" :default-expanded-keys="[2]"
          :default-checked-keys="[4, 5]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm(groupFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.pagination{
  float: right;
  margin-right: 1vw;
}
</style>
