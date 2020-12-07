<template>
  <div class="create-or-edit-category">
    <el-form ref="form" :model="category" :rules="rules" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="category.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="category.sort"></el-input-number>
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
import { saveOrderUpdate } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditCategory',
  props: {
    categoryId: {
      type: [String, Number]
    },
    categoryName: {
      type: String
    },
    categorySort: {
      type: Number
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.isEdit) {
      this.category.id = this.categoryId as string
      this.category.name = this.categoryName
      this.category.sort = this.categorySort
    }
  },
  data () {
    return {
      category: {
        id: '',
        name: '',
        sort: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 验证表单
        await (this.$refs.form as Form).validate()
        this.loading = true

        await saveOrderUpdate(this.category)
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
