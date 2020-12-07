<template>
  <div class="section-create-or-update">
    <el-form ref="form" :model="section" :rules="rules" label-width="80px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="courseName" disabled></el-input>
      </el-form-item>
      <el-form-item label="章节名称" prop="sectionName">
        <el-input v-model="section.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="章节描述" prop="description">
        <el-input type="textarea" v-model="section.description"></el-input>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="section.orderNum"></el-input-number>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;text-align:right;">
        <span class="dialog-footer">
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">确定</el-button>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionById, saveOrUpdateSection } from '@/services/course-section'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'SectionCreateOrEdit',
  props: {
    courseId: {
      type: [String, Number]
    },
    courseName: {
      type: String
    },
    sectionId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      section: {
        courseId: '',
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      },
      rules: {
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    // 如果是编辑操作，则根据章节 ID 加载显示章节信息
    if (this.isEdit) {
      this.loadSection()
    }
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionById(this.sectionId)
      this.section = data.data
    },
    async onSubmit () {
      try {
        // 验证表单
        await (this.$refs.form as Form).validate()
        this.loading = true
        if (!this.isEdit) {
          this.section.courseId = this.courseId as string
          this.section.courseName = this.courseName
        }
        await saveOrUpdateSection(this.section)
        this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
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
