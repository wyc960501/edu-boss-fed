<template>
  <div class="resource-category-list">
    <el-card>
      <div>
        <el-button @click="handleAdd">添加分类</el-button>
      </div>
      <el-table
        :data="categories"
        v-loading="isLoading"
        :stripe="true"
      >
        <el-table-column
          prop="id"
          label="编号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑分类' : '添加分类'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :category-id="categoryId"
        :category-name="categoryName"
        :category-sort="categorySort"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import CreateOrEdit from './CreateOrEdit.vue'
import { getResourceCategories, deleteCategoryById } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceCategoryList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      categories: [],
      categoryId: null,
      categoryName: '',
      categorySort: 0,
      isEdit: false,
      dialogVisible: false,
      isLoading: true // 加载状态
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourceCategories()
      // eslint-disable-next-line
      data.data.forEach((item: any) => {
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.categories = data.data
      this.isLoading = false // 关闭加载中状态
    },
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    },
    // eslint-disable-next-line
    handleEdit (category: any) {
      this.dialogVisible = true
      this.categoryId = category.id
      this.categoryName = category.name
      this.categorySort = category.sort
      this.isEdit = true
    },
    // eslint-disable-next-line
    handleDelete (category: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => { // 确认执行这里
          // 请求删除操作
          const { data } = await deleteCategoryById(category.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadResourceCategories() // 更新数据列表
          }
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadResourceCategories() // 重新加载数据列表
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
