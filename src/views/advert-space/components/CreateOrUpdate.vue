<template>
  <div class="create-or-update-space">
    <el-page-header @back="$router.push('/advert-space')" :content="isEdit ? '编辑广告位' : '添加广告位'"></el-page-header>
    <el-card style="margin-top: 20px;">
      <el-form label-width="120px" :rules="rules" ref="space" :model="space">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="space.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSave"
          >保存</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAdSpaceById, createOrUpdate } from '@/services/advert-space'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrUpdateSpace',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      space: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.isEdit) {
      this.loadAdvertSpace()
    }
  },
  methods: {
    async loadAdvertSpace () {
      const { data } = await getAdSpaceById(this.$route.params.id)
      this.space = data.content
    },
    onReset () {
      (this.$refs.space as Form).resetFields()
    },
    async handleSave () {
      // 验证表单
      await (this.$refs.space as Form).validate()
      this.loading = true
      try {
        await createOrUpdate(this.space)
        this.$message.success('保存成功')
        this.$router.push('/advert-space')
      } catch (err) {
        console.log(err)
        this.$message.error('保存失败')
      }
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
