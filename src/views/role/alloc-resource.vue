<template>
  <div class="alloc-resource">
    <div class="page-header">
      <el-page-header @back="goBack" content="分配资源"></el-page-header>
    </div>
    <el-card style="margin-top:20px;">
      <div slot="header">
        <span>分配资源</span>
      </div>
      <el-tree
        node-key="id"
        ref="resource-tree"
        :default-checked-keys="checkedKeys"
        :data="resourceNodeList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="text-align:center">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceNodeList, getRoleResources, allocateRoleReource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      categories: [],
      resources: [],
      resourceNodeList: [],
      defaultProps: {
        children: 'resourceList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadCategories()
    this.loadResources()
    this.loadRoleCategories()
  },
  methods: {
    async loadCategories () {
      const { data } = await getResourceCategories()
      this.categories = data.data
    },
    async loadResources () {
      const { data } = await getResourceNodeList()
      const resource = data.data
      const resourceNodeList = this.categories
      // eslint-disable-next-line
      this.categories.forEach((item: any) => {
        // eslint-disable-next-line
        const resourceList: any[] = []
        // eslint-disable-next-line
        resource.forEach((resource: any) => {
          if (resource.categoryId === item.id) {
            resourceList.push(resource)
          }
        })
        item.id = item.id + '-1'
        if (resourceList) {
          item.resourceList = resourceList
        }
      })
      this.resourceNodeList = resourceNodeList
    },
    async loadRoleCategories () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedKeys(data.data)
    },
    // eslint-disable-next-line
    getCheckedKeys (resource: any) {
      // eslint-disable-next-line
      resource.forEach((item: any) => {
        if (item.selected && item.categoryId) {
          // eslint-disable-next-line
          this.checkedKeys = [ ... this.checkedKeys, item.id] as any
        }
        if (item.resourceList) {
          this.getCheckedKeys(item.resourceList)
        }
      })
    },
    async onSave () {
      try {
        const resourceIdList = (this.$refs['resource-tree'] as Tree).getCheckedKeys()
        // 拿到选中节点的数据 id 列表
        // 请求提交保存
        console.log(resourceIdList)
        await allocateRoleReource({
          roleId: this.roleId,
          resourceIdList
        })
        this.$message.success('操作成功')
        this.$router.back()
      } catch (err) {
        console.log(err)
      }
    },
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    },
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
