<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      // eslint-disable-next-line
      const editor = new E(this.$refs.editor as any)
      // 事件监听必须在 create 之前
      editor.config.onchange = (value: string) => {
        this.$emit('input', value)
      }
      editor.create()
      editor.txt.html(this.value)
      // eslint-disable-next-line
      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        // 1、把用户选择的 resultFiles 上传到服务端
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)

        // 2、insertImgFn('图片地址') 根据图片地址生成 img 标签插入富文本编辑器内容中
        insertImgFn(data.data.name)
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
