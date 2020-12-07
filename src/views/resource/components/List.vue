<template>
  <div class="resource-list">
    <el-card class="box-card" style="margin-bottom: 15px;">
      <div class="clearfix">
        <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
              <el-option v-for="item in resourceCategories" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'resource-create' })">添加资源</el-button>
        <el-button @click="$router.push({ name: 'resource-category' })">资源分类</el-button>
      </div>
      <el-table
      :data="resources"
      v-loading="isLoading"
      :stripe="true"
      style="width: 100%;margin-bottom:20px">
        <el-table-column
          prop="id"
          label="编号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'resource-edit',
                params: {
                  id: scope.row.id
                }
              })">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, deleteResourceById } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'
import moment from 'moment'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 20, // 每页大小
        categoryId: null
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true // 加载状态
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategory()
  },
  methods: {
    async loadResources () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      const resources = data.data.records
      // eslint-disable-next-line
      resources.forEach((item: any) => {
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.resources = resources
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    async loadResourceCategory () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadResources()
    },
    handleDelete (val: number) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          // 请求删除操作val
          const { data } = await deleteResourceById(val)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.form.current = 1
            this.loadResources() // 更新数据列表
          }
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    },
    onReset () {
      this.form.current = 1
      ;(this.$refs.form as Form).resetFields()
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
