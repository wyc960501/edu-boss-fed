<template>
  <div>
    <el-form ref="form" :model="role" :rules="rules" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px; text-align: right;">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    // 如果是编辑操作，则根据角色 ID 加载显示角色信息
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    },
    async onSubmit () {
      try {
        // 验证表单
        await (this.$refs.form as Form).validate()
        this.loading = true

        await createOrUpdate(this.role)
        this.$message.success('操作成功')
        this.$emit('success')
      } catch (err) {
        console.log('操作失败', err)
      }
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
