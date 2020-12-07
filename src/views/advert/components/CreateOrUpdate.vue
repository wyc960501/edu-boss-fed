<template>
  <div class="create-or-update-advert">
    <div class="page-header">
      <el-page-header @back="goBack" :content="isEdit ? '编辑广告' : '添加广告'"></el-page-header>
    </div>
    <el-card style="margin-top: 20px;">
      <el-form label-width="120px" :rules="rules" ref="advert" :model="advert">
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="advert.name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置" prop="spaceId">
          <el-select v-model="advert.spaceId" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in advertSpaces" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="advert.startTime"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="endTime">
          <el-date-picker
            v-model="advert.endTime"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下线/上线" prop="status">
          <el-radio v-model="advert.status" :label=0>下线</el-radio>
          <el-radio v-model="advert.status" :label=1>上线</el-radio>
        </el-form-item>
        <el-form-item label="广告图片" prop="img">
         <advert-image v-model="advert.img" />
          <el-tag type="info">建议尺寸：230*300px，JPG、PNG格式，图片小于150K</el-tag>
        </el-form-item>
        <el-form-item label="广告链接" prop="link">
          <el-input v-model="advert.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注" prop="text">
          <el-input type="textarea" v-model="advert.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSave"
          >保存</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getAdvertById } from '@/services/advert'
import { getAdSpace } from '@/services/advert-space'
import { Form } from 'element-ui'
import AdvertImage from './AdvertImage.vue'

export default Vue.extend({
  name: 'CreateOrUpdateAdvert',
  components: {
    AdvertImage
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      advert: {
        name: '',
        spaceId: 1,
        text: '',
        img: '',
        link: '',
        startTime: '',
        endTime: '',
        status: 0
      },
      advertSpaces: [],
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 加载广告位
    this.loadAdvertSpace()
    if (this.isEdit) {
      this.loadAdvert()
    }
  },
  methods: {
    async loadAdvert () {
      const { data } = await getAdvertById(this.$route.params.id)
      this.advert = data.content
    },
    async loadAdvertSpace () {
      const { data } = await getAdSpace()
      this.advertSpaces = data.content
    },
    async handleSave () {
      // 验证表单
      await (this.$refs.advert as Form).validate()
      this.loading = true
      try {
        await createOrUpdate(this.advert)
        this.$message.success('保存成功')
        this.$router.push('/advert')
      } catch (err) {
        console.log(err)
        this.$message.error('保存失败')
      }
      this.loading = false
    },
    onReset () {
      ;(this.$refs.advert as Form).resetFields()
    },
    goBack () {
      this.$router.push('/advert')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
