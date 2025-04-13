<script setup>
import { ref, nextTick } from 'vue'
import { usestaffAvatar, updateStaff, getstaffList,deletaStaff } from '@/api/avatar'
import { Check, InfoFilled, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import panelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const dialogVisible = ref(false)
const dialogImgVisible = ref(false)
const staffForm = ref({
  id: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  name: '',
  sex: ''
})
const staffFormRef = ref()
const rules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请选择头像', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
}
const selectIndex = ref(0)
const confirmImg = () => {
  staffForm.value.avatar = avatarList.value[selectIndex.value].url
  dialogImgVisible.value = false
  // 手动触发头像校验
  staffFormRef.value.validateField('avatar')
}
const avatarList = ref([])
const getAvatarList = async () => {
  const { data } = await usestaffAvatar()
  avatarList.value = data.data

}
getAvatarList()
// 提交表单
const handleSubmit = async () => {
  const loading = ref(false)
  try {
    loading.value = true

    // 执行表单校验
    await staffFormRef.value.validate()

    // 转换数据类型（确保年龄为数字）
    const formData = {
      ...staffForm.value,
      age: Number(staffForm.value.age),
      active: Number(staffForm.value.active)
    }

    // 调用提交API
    const res = await updateStaff(formData)

    if (res.data.code === 10000) {
      ElMessage.success('创建成功')
      dialogVisible.value = false
      // 重置表单
      staffFormRef.value.resetFields()
      // 这里可以添加刷新列表等后续操作
      getStaffList()
    }
  } catch (error) {
    if (error?.errors) return // 校验失败不重复提示
    ElMessage.error(error.message || '提交失败')
  } finally {
    loading.value = false
  }
}


const staffListData = ref({
  list: [],
  total: 0
})
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})
const getStaffList = async () => {
  const { data } = await getstaffList(paginationData.value)
  // console.log(res)
  staffListData.value.list = data.data.list
  staffListData.value.total = data.data.total
}
getStaffList()

const handleEdit = (row) => {
  // 打开编辑弹窗
  dialogVisible.value = true
  // 填充表单
  nextTick(() => {
    if (row) {
      Object.assign(staffForm.value, row)
    }
  })
}
const selectTab = ref([])
const handleSelectionChange = (val) => {
  selectTab.value = val
}
const confirmDelete = async () => { 
  if (!selectTab.value.length) {
    return ElMessage.warning('请至少选择一个陪护师')
  }
  const loading = ref(false)
  try {
    loading.value = true
    const res = await deletaStaff({ id : selectTab.value })  
    if (res.data.code === 10000) {
      ElMessage.success('删除成功')
      getStaffList()
    }
  } catch (error) {
    ElMessage.error(error.message || '删除失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <panelHead :route="route"></panelHead>
  <div class="btns">
    <el-button type="primary" @click="dialogVisible = true">添加陪护师</el-button>

    <el-popconfirm width="150" 
    :icon="InfoFilled" 
    icon-color="#626AEF" 
    title="是否删除?" 
    confirm-button-text="确定" 
    cancel-button-text="取消" 
    @confirm="confirmDelete">
      <template #reference>
        <el-button :icon="Delete" type="danger">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-dialog v-model="dialogVisible" title="添加陪护师" label-position="left" width="500px">
    <el-form ref="staffFormRef" :model="staffForm" :rules="rules">
      <el-form-item label="ID" v-show="false">
        <el-input v-model="staffForm.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="staffForm.name" placeholder="请输入昵称" style="margin-left: 15px;" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button type="primary" v-if="!staffForm.avatar" style="margin-left: 15px;"
          @click="dialogImgVisible = true">上传头像</el-button>
        <el-image v-else :src="staffForm.avatar" alt="" style="margin-left: 15px; width :100px; height:100px" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="staffForm.sex" placeholder="请选择性别" style="margin-left: 15px;">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age" style="margin-left: 10px;">
        <el-input-number v-model="staffForm.age" :min="18" :max="50" style="margin-left: 15px;" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="staffForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="staffForm.active">
          <el-radio label="1">生效</el-radio>
          <el-radio label="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog title="选择图片" v-model="dialogImgVisible" width="680">
    <div class="image-list">
      <div v-for="(item, index) in avatarList" :key="item.name" class="img-box" @click="selectIndex = index">
        <div v-if="selectIndex === index" class="select">
          <el-icon>
            <Check />
          </el-icon>
        </div>
        <el-image :src="item.url" width="148px" height="148px" />
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="confirmImg">确定</el-button>
      <el-button @click="dialogImgVisible = false">取消</el-button>
    </template>
  </el-dialog>

  <!-- 陪护师信息列表 -->
  <el-table :data="staffListData.list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="{ row }">
        <el-image :src="row.avatar" style="width: 50px; height: 50px" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="{ row }">
        {{ row.sex === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="age" label="年龄" />
    <el-table-column prop="active" label="状态">
      <template #default="{ row }">
        <el-tag type="success" v-if="row.active === 1">生效</el-tag>
        <el-tag type="danger" v-else>失效</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="{ row }">
        {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="primary" plain @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .img-box {
    position: relative;

    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
