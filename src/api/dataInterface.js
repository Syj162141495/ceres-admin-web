import request from '@/utils/request'

export function getDataInterfaceList(data) {
  return request({
    url: '/dataInterface/getDataInterfaceList',
    method: 'post',
    data
  })
}

export function insertDataInterface(data) {
  return request({
    url: '/dataInterface/insertDataInterface',
    method: 'post',
    data
  })
}

export function updateDataInterface(data) {
  return request({
    url: '/dataInterface/updateDataInterface',
    method: 'post',
    data
  })
}

export function deleteDataInterface(data) {
  return request({
    url: '/dataInterface/deleteDataInterface',
    method: 'delete',
    data
  })
}
