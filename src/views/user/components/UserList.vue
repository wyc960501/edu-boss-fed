<template>
  <el-card>
    <div slot="header">
      <el-form :model="filterParams" ref="filterParams" :inline="true" label-width="80px" class="demo-form-inline">
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="filterParams.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <div class="block" >
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange"
              >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="users"
      v-loading="loading"
      :stripe="true"
      style="width: 100%;margin-bottom:20px;">
      <el-table-column
        prop="id"
        label="用户ID"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="头像"
        align="center"
      >
        <template slot-scope="scope">
          <el-avatar shape="circle" :size="40" :src="scope.row.portrait || require('@/assets/default-user-avatar.jpg')" style="border"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'ENABLE' ? 'success' : 'danger'"
            effect="dark"
            size="mini"
          >
            {{ scope.row.status === 'ENABLE' ? '启用' : '封禁' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleSelectRole(scope.row)">分配角色</el-button>
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

    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%">
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { Form } from 'element-ui'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import moment from 'moment'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      filterParams: {
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1,
        pageSize: 20
      },
      dateRange: '',
      users: [],
      totalCount: 0,
      loading: true,
      dialogVisible: false,
      roleIdList: [],
      roles: [],
      currentUser: null // 分配角色的当前用户
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      this.loading = true // 展示加载中状态
      const { data } = await getUserPages(this.filterParams)
      const users = data.data.records
      // eslint-disable-next-line
      users.forEach((item: any) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.users = users
      this.totalCount = data.data.total
      this.loading = false // 关闭加载中状态
    },
    onSubmit () {
      this.filterParams.currentPage = 1 // 筛选查询从第 1 页开始
      this.loadUsers()
    },
    onReset () {
      this.filterParams.startCreateTime = ''
      this.filterParams.endCreateTime = ''
      this.dateRange = ''
      ;(this.$refs.filterParams as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    dateChange () {
      this.filterParams.startCreateTime = this.dateRange[0]
      this.filterParams.endCreateTime = moment(this.dateRange[1]).add(1, 'd').format('YYYY-MM-DD')
    },
    handleSizeChange (val: number) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.filterParams.currentPage = val // 修改要查询的页码
      this.loadUsers()
    },
    // eslint-disable-next-line
    async handleSelectRole (role: any) {
      this.currentUser = role
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data
      // eslint-disable-next-line
      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      // eslint-disable-next-line
      this.roleIdList = userRoles.map((item: any) => item.id)
      // 展示对话框
      this.dialogVisible = true
    },
    async handleAllocRole () {
      try {
        await allocateUserRoles({
          // eslint-disable-next-line
          userId: (this.currentUser as any).id,
          roleIdList: this.roleIdList
        })
        this.$message.success('操作成功')
        this.dialogVisible = false
      } catch (err) {
        console.log(err)
      }
    }
  }
})
</script>

<style>

</style>
