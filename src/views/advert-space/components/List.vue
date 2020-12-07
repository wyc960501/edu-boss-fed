<template>
  <div class="advert-space-list">
    <el-card>
      <div slot="header">
        <el-button @click="$router.push({
          name: 'space-create'
        })">添加广告位</el-button>
      </div>
      <el-table
        :data="advertSpaces"
        v-loading="loading"
        :stripe="true"
        style="width: 100%;margin-bottom:20px"
      >
        <el-table-column
          prop="spaceKey"
          label="spaceKey"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告位名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'space-edit',
                params: {
                  id: scope.row.id
                }
              })"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAdSpace } from '@/services/advert-space'
import moment from 'moment'

export default Vue.extend({
  name: 'AdvertSpaceList',
  data () {
    return {
      advertSpaces: [],
      loading: false
    }
  },
  created () {
    this.loadAdvertSpaces()
  },
  methods: {
    async loadAdvertSpaces () {
      this.loading = true
      const { data } = await getAdSpace()
      const spaces = data.content
      // eslint-disable-next-line
      spaces.forEach((item: any) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
      })
      this.advertSpaces = spaces
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
