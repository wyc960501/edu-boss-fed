<template>
  <div class="adveret-list">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'advert-create'
        })">添加广告</el-button>
      </div>
      <el-table
        :data="adverts"
        v-loading="isLoading"
        :stripe="true"
        style="width: 100%;margin-bottom:20px"
      >
        <el-table-column
          prop="id"
          label="id"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="space"
          label="广告位置"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="广告图片"
          align="center"
        >
          <template slot-scope="scope">
            <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.img"
            :lazy="true"
            fit="cover">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>开始时间：{{ scope.row.startTimeFormatString }}</span><br/>
            <span>结束时间：{{ scope.row.endTimeFormatString }}</span>
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="上线/下线"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'advert-edit',
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
import { getAdList, updateStatus } from '@/services/advert'
import { getAdSpace } from '@/services/advert-space'

export default Vue.extend({
  name: 'AdvertList',
  data () {
    return {
      adverts: [],
      space: [],
      isLoading: false
    }
  },
  created () {
    this.loadAdSpace()
    this.loadAdverts()
  },
  methods: {
    async loadAdSpace () {
      const { data } = await getAdSpace()
      this.space = data.content
    },
    async loadAdverts () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getAdList()
      const space = this.space
      // eslint-disable-next-line
      data.content.forEach((item: any) => {
        item.isStatusLoading = false
        // eslint-disable-next-line
        space.forEach((sp: any) => {
          if (item.spaceId === sp.id) {
            item.space = sp.name
          }
        })
      })
      this.adverts = data.content
      this.isLoading = false // 关闭加载中状态
    },
    // eslint-disable-next-line
    async onStateChange (advert: any) {
      advert.isStatusLoading = true
      try {
        await updateStatus(advert.id, advert.status)
        this.$message.success(`${advert.status === 0 ? '下线' : '上线'}成功`)
      } catch (err) {
        console.log(err)
      }
      advert.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
