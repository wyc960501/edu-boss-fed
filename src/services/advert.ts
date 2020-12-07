/**
 * 广告相关请求模块
 */

import request from '@/utils/request'

export const getAdList = () => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList'
  })
}

export const getAdvertById = (advertId: string | number) => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params: {
      id: advertId
    }
  })
}
// eslint-disable-next-line
export const createOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}
// eslint-disable-next-line
export const updateStatus = (id: string | number, status: string | number) => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params: {
      id,
      status
    }
  })
}

// eslint-disable-next-line
export const uploadAdvertImage = (data: any, onUploadProgress?: (ProgressEvent: ProgressEvent) => void ) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件： progress
    onUploadProgress
  })
}
