/**
 * 广告位相关请求模块
 */

import request from '@/utils/request'

export const getAdSpace = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

export const getAdSpaceById = (id: string | number) => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getSpaceById',
    params: {
      id
    }
  })
}
// eslint-disable-next-line
export const createOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}
