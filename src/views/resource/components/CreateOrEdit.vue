<template>
  <div class="create-or-edit">
    <div class="page-header">
      <el-page-header @back="goBack" :content="isEdit ? '编辑资源' : '添加资源'"></el-page-header>
    </div>
    <el-card style="margin-top:20px;">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑资源' : '添加资源'}}</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item prop="name" label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类">
          <el-select v-model="form.categoryId" placeholder="请选择资源分类">
            <el-option :label="item.name" :value="item.id" v-for="item in resourceCategories" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="loading">保存</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceCategories } from '@/services/resource-category'
import { saveOrUpdateResource, getResourceById } from '@/services/resource'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        categoryId: 1,
        url: '',
        description: ''
      },
      resourceCategories: [],
      loading: false // 加载状态
    }
  },
  created () {
    this.loadResourceCategories()
    if (this.isEdit) {
      this.loadResource()
    }
  },
  methods: {
    async loadResource () {
      const { data } = await getResourceById(this.$route.params.id)
      this.form = data.data
    },
    async loadResourceCategories () {
      // 获取资源分类
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    onReset () {
      ;(this.$refs.form as Form).resetFields()
    },
    async onSubmit () {
      this.loading = true
      try {
        await saveOrUpdateResource(this.form)
        this.$message.success('保存成功')
        this.$router.push('/resource')
      } catch (err) {
        console.log(err)
        this.$message.error('保存失败')
      }
      this.loading = false
    },
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
