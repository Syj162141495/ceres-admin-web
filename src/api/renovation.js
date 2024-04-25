import request from '@/utils/request'

// 平台装修

// ******商品类别******
// 商品类别管理查询
export function commdityClassGetAll(data) {
  return request({
    url: '/classify/getAll',
    method: 'post',
    data
  })
}

// 添加商品类别
export function commdityClassAdd(data) {
  return request({
    url: '/classify/save',
    method: 'post',
    data
  })
}
// 编辑商品类别
export function commdityClassgetById(data) {
  return request({
    url: '/classify/getById',
    method: 'post',
    data
  })
}
// 修改商品类别
export function commdityClassUpdate(data) {
  return request({
    url: '/classify/update',
    method: 'post',
    data
  })
}
// 删除商品类别
export function commdityClassDelete(data) {
  return request({
    url: '/classify/delete',
    method: 'post',
    data
  })
}

// 选择链接查询
export function getSelect(data) {
  return request({
    url: '/dict/getSelect',
    method: 'post',
    data
  })
}

// ******自定义页面******
// 自定义页面查询
export function selectCanvasCustomList(data) {
  return request({
    url: '/canvas/selectCanvasCustomList',
    method: 'post',
    data
  })
}

// 添加修改自定义页面
export function saveCanvasCustom(data) {
  return request({
    url: '/canvas/saveCanvasCustom',
    method: 'post',
    data
  })
}
// 删除自定义页面
export function delCanvasCustom(data) {
  return request({
    url: '/canvas/delCanvasCustom',
    method: 'post',
    data
  })
}
