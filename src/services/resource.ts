/**
 * 资源相关请求模块
 */

import request from '@/utils/request'
// eslint-disable-next-line
export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getResourceNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

// eslint-disable-next-line
export const allocateRoleReource = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

// eslint-disable-next-line
export const saveOrUpdateResource = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const getResourceById = (id: string | number) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

export const deleteResourceById = (id: string | number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
