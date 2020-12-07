<template>
  <div class="create-or-update-course">
    <div class="page-header">
      <el-page-header @back="goBack" :content="isEdit ? '编辑课程' : '添加课程'"></el-page-header>
    </div>
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            :title="item.title"
            :icon="item.icon"
            v-for="(item, index) in steps"
            :key="index"
            @click.native="activeStep = index"
          ></el-step>
        </el-steps>
      </div>
      <el-form label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="courses.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="courses.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              style="margin-bottom: 10px"
              v-model="courses.previewFirstField"
              placeholder="概述1"
            ></el-input>
            <el-input
              v-model="courses.previewSecondField"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="courses.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="courses.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="courses.sortNum"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="courses.courseListImg" />
          </el-form-item>
          <el-form-item label="介绍封面">
            <course-image v-model="courses.courseImgUrl" />
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model="courses.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="courses.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model='courses.sales'>
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model='courses.discountsTag'></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="courses.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="courses.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model='courses.activityCourseDTO.beginTime'
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model='courses.activityCourseDTO.endTime'
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model='courses.activityCourseDTO.amount'>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input v-model="courses.activityCourseDTO.stock">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <!-- <el-input v-model="courses.courseDescriptionMarkDown" type="textarea"></el-input> -->
            <text-editor
              v-model="courses.courseDescriptionMarkDown"
            />
          </el-form-item>
          <el-form-item label="是否发布">
            <el-switch
              v-model="courses.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep >= 0 && activeStep < 4">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
// import moment from 'moment'

export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      imageUrl: '', // 预览图片地址
      courses: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      // const { activityCourseDTO } = data.data
      // activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
      // activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
      this.courses = data.data
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.courses)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.push('/course')
      } else {
        this.$message.error('保存失败')
      }
    },
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step{
  cursor: pointer;
}
</style>
