<template>
  <div class="course-list">
    <el-card>
      <div slot="header" class="header">
        <el-form :model="filterParams" ref="filterParams" :inline="true" label-width="80px" class="demo-form-inline" >
          <el-form-item prop="courseName" label="课程名称">
            <el-input v-model="filterParams.courseName" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select v-model="filterParams.status" placeholder="请选择">
              <el-option
                v-for="item in courseStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="$router.push({ name: 'course-create' })"
          style="margin-bottom: 22px;"
        >
          <i class="el-icon-plus"></i>
          添加课程
        </el-button>
      </div>
      <el-table
        :data="courses"
        v-loading="loading"
        style="width: 100%;margin-bottom:20px;">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称">
        </el-table-column>
        <el-table-column
          label="价格">
          <template slot-scope="scope">
            <span>¥ {{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width=“180
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filterParams.currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="filterParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCoursePages, changeState } from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        couseName: '',
        status: '',
        currentPage: 1,
        pageSize: 20
      },
      courses: [],
      totalCount: 0,
      loading: true,
      courseStatusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '下架'
      }, {
        value: '1',
        label: '上架'
      }]
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.loading = true // 展示加载中状态
      const { data } = await getCoursePages(this.filterParams)
      // eslint-disable-next-line
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.loading = false // 关闭加载中状态
    },
    onSubmit () {
      this.filterParams.currentPage = 1 // 筛选查询从第 1 页开始
      this.loadCourses()
    },
    handleSizeChange (val: number) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.filterParams.currentPage = val // 修改要查询的页码
      this.loadCourses()
    },
    // eslint-disable-next-line
    async onStateChange (course: any) {
      course.isStatusLoading = true
      try {
        await changeState({
          courseId: course.id,
          status: course.status
        })
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      } catch (err) {
        console.log(err)
      }
      course.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.course-list {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
}
</style>
