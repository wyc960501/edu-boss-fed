<template>
  <div class="alloc-menu">
    <div class="page-header">
      <el-page-header @back="goBack" content="分配权限"></el-page-header>
    </div>
    <el-card style="margin-top:20px;">
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree
        node-key="id"
        ref="menu-tree"
        :default-checked-keys="checkedKeys"
        :data="menus"
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
import { getMenuNodeList, allocateRoleMenu, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  async created () {
    await this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    // eslint-disable-next-line
    getCheckedKeys (menus: any) {
      // eslint-disable-next-line
      menus.forEach((menu: any) => {
        if (menu.selected && menu.level !== 0) {
          // eslint-disable-next-line
          this.checkedKeys = [ ... this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      try {
        const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
        // 拿到选中节点的数据 id 列表
        // 请求提交保存
        await allocateRoleMenu({
          roleId: this.roleId,
          menuIdList
        })
        this.$message.success('操作成功')
        this.$router.back()
      } catch (err) {
        console.log(err)
      }
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    },
    goBack () {
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
