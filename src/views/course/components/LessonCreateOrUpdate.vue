<template>
  <div class="section-create-or-update">
    <el-form ref="form" :model="lesson" :rules="rules" label-width="120px">
      <el-form-item label="课程名称">
        <el-input v-model="courseName" disabled></el-input>
      </el-form-item>
      <el-form-item label="章节名称">
        <el-input v-model="sectionName" disabled></el-input>
      </el-form-item>
      <el-form-item label="课时名称" prop="theme">
        <el-input v-model="lesson.theme"></el-input>
      </el-form-item>
      <el-form-item label="时长">
        <el-input v-model="lesson.duration">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开放试听">
        <el-switch
          v-model="lesson.isFree"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="lesson.orderNum"></el-input-number>
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
import { getLessonById, saveOrUpdateLesson } from '@/services/course-lesson'
import { Form } from 'element-ui'
import { getSectionById } from '@/services/course-section'

export default Vue.extend({
  name: 'LessonCreateOrEdit',
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
    lessonId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sectionName: '',
      lesson: {
        courseId: '',
        sectionId: '',
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      },
      rules: {
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    this.loadSection()
    // 如果是编辑操作，则根据章节 ID 加载显示课时信息
    if (this.isEdit) {
      this.loadLesson()
    } else {
      this.lesson.courseId = this.courseId as string
    }
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionById(this.sectionId)
      this.lesson.sectionId = data.data.id
      this.sectionName = data.data.sectionName
    },
    async loadLesson () {
      const { data } = await getLessonById(this.lessonId)
      this.lesson = data.data
    },
    async onSubmit () {
      try {
        // 验证表单
        await (this.$refs.form as Form).validate()
        this.loading = true
        await saveOrUpdateLesson(this.lesson)
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
