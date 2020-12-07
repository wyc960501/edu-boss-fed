<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix query-or-addrole">
        <el-form :inline="true" :model="filterParams" ref="filterParams" class="demo-form-inline">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="filterParams.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading">查询搜索</el-button>
            <el-button @click="onReset" :disabled="loading">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button style="margin-bottom:20px;" @click="handleAdd">添加角色</el-button>
      </div>
      <el-table
      :data="roles"
      v-loading="loading"
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
          label="角色名称"
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
            <div>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-resource',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配资源</el-button>
            </div>
            <div>
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="loading"
        :current-page="filterParams.current"
        :page-sizes="[5, 10, 20]"
        :page-size="filterParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :role-id="roleId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRolePages, deleteRole } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'
import moment from 'moment'

export default Vue.extend({
  name: 'RolesList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [], // 角色列表
      filterParams: {
        name: '',
        current: 1,
        size: 20
      },
      loading: false, // 加载状态
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      roleId: null, // 编辑角色 ID
      isEdit: false,
      totalCount: 0
    }
  },
  created () {
    this.loadRole()
  },
  methods: {
    async loadRole () {
      this.loading = true // 展示加载中状态
      const { data } = await getRolePages(this.filterParams)
      const roles = data.data.records
      // eslint-disable-next-line
      roles.forEach((role: any) => {
        role.createdTime = moment(role.createdTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.roles = roles
      this.totalCount = data.data.total
      this.loading = false // 关闭加载中状态
    },
    onSubmit () {
      this.filterParams.current = 1 // 筛选查询从第 1 页开始
      this.loadRole()
    },
    // eslint-disable-next-line
    handleEdit (role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },
    // eslint-disable-next-line
    handleDelete (role: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => { // 确认执行这里
          // 请求删除操作
          const { data } = await deleteRole(role.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.filterParams.current = 1
            this.loadRole() // 更新数据列表
          }
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange (val: number) {
      this.filterParams.size = val
      this.filterParams.current = 1
      this.loadRole()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.filterParams.current = val // 修改要查询的页码
      this.loadRole()
    },
    onReset () {
      this.filterParams.current = 1
      ;(this.$refs.filterParams as Form).resetFields()
      this.loadRole()
    },
    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadRole() // 重新加载数据列表
    },
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    }
  }
})
</script>

<style lang="scss" scoped>
.query-or-addrole {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}
</style>
