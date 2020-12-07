<template>
  <div class="course-section">
    <div class="page-header">
      <el-page-header @back="goBack" :content="courses.courseName"></el-page-header>
      <el-button type="primary" @click="handleAdd"><i class="el-icon-plus"></i> 添加阶段</el-button>
    </div>
    <el-card>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div slot-scope="{ node, data }" class="inner">
          <span>{{ node.label }}</span>
          <!-- section -->
          <span v-if="data.sectionName" class="actions">
            <el-button size="mini" @click="handleEdit(data.id)">编辑</el-button>
            <el-button type="primary" size="mini" @click="addLesson(data.id)">添加课时</el-button>
            <el-select size="mini" v-model="data.status" @change="sectionStatusChange(data)" class="select-status" placeholder="请选择">
              <el-option label="隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已发布" :value="2"></el-option>
            </el-select>
          </span>
          <!-- lession -->
          <span v-else class="actions">
            <el-button size="mini" @click="editLesson(data.sectionId, data.id,)">编辑</el-button>
            <el-button type="success" size="mini" @click="$router.push({
              name: 'course-video',
              params: {
                courseId: courseId
              },
              query: {
                sectionId: node.parent.id,
                lessonId: data.id
              }
            })">上传视频</el-button>
            <el-select size="mini" v-model="data.status" @change="lessonStatusChange(data)" class="select-status" placeholder="请选择">
              <el-option label="隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已发布" :value="2"></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>

    <el-dialog
      title="章节信息"
      :visible.sync="sectionDialogVisible"
      width="50%"
    >
      <section-create-or-edit
        v-if="sectionDialogVisible"
        :course-id="courseId"
        :course-name="courses.courseName"
        :section-id="sectionId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="sectionDialogVisible = false"
      />
    </el-dialog>

    <el-dialog
      title="课时基本信息"
      :visible.sync="lessonDialogVisible"
      width="50%"
    >
      <lesson-create-or-edit
        v-if="lessonDialogVisible"
        :course-id="courseId"
        :course-name="courses.courseName"
        :section-id="sectionId"
        :lesson-id="lessonId"
        :is-edit="isEdit"
        @success="onSuccessLesson"
        @cancel="lessonDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SectionCreateOrEdit from './components/SectionCreateOrUpdate.vue'
import LessonCreateOrEdit from './components/LessonCreateOrUpdate.vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
import { getCourseById } from '@/services/course'

export default Vue.extend({
  name: 'CourseSection',
  components: {
    SectionCreateOrEdit,
    LessonCreateOrEdit
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      courses: [],
      defaultProps: {
        children: 'lessonDTOS',
        // eslint-disable-next-line
        label (data: any) {
          return data.sectionName || data.theme
        }
      },
      sectionDialogVisible: false,
      lessonDialogVisible: false,
      sectionId: '',
      lessonId: '',
      isEdit: false
    }
  },
  created () {
    this.loadSections()
    this.loadCourse()
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.courses = data.data
    },
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    goBack () {
      this.$router.push('/course')
    },
    onSuccess () {
      this.sectionDialogVisible = false // 关闭对话框
      this.loadSections() // 重新加载数据列表
    },
    handleAdd () {
      this.isEdit = false
      this.sectionDialogVisible = true
    },
    // eslint-disable-next-line
    handleEdit (sectionId: String | Number) {
      this.sectionDialogVisible = true
      this.sectionId = sectionId as string
      this.isEdit = true
    },
    // eslint-disable-next-line
    addLesson (sectionId: any) {
      this.lessonDialogVisible = true
      this.sectionId = sectionId as string
      this.isEdit = false
    },
    // eslint-disable-next-line
    editLesson (sectionId: String | Number, lessonId: String | Number) {
      this.lessonDialogVisible = true
      this.sectionId = sectionId as string
      this.lessonId = lessonId as string
      this.isEdit = true
    },
    onSuccessLesson () {
      this.lessonDialogVisible = false // 关闭对话框
      this.loadSections() // 重新加载数据列表
    },
    // eslint-disable-next-line
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      // draggingNode 拖动的节点
      // dropNode 放置的目标节点
      // type: 'prev'、'inner'、'next'，分别表示放置在目标节点前、插入至目标节点、放置在目标节点后
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    // eslint-disable-next-line
    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        // eslint-disable-next-line
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (err) {
        console.log(err)
        this.$message.error('排序失败')
      }
    },
    // eslint-disable-next-line
    async sectionStatusChange (data: any) {
      try {
        await saveOrUpdateSection(data)
        this.$message.success('操作成功')
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    },
    // eslint-disable-next-line
    async lessonStatusChange (data: any) {
      try {
        await saveOrUpdateLesson(data)
        this.$message.success('操作成功')
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>

.course-section {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }

  .el-card {
    margin-top: 20px;
  }
}

.inner {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;

  .inner {
    font-size: 16px;
  }
}

::v-deep .select-status {
  .el-input__inner {
    width: 120px;
    margin-left: 10px;
  }
}
</style>
