import request from '@/utils/request'

// 平台装修

// ******商品类别******
// 添加商品类别
export function commdityClassAdd(data) {
  return request({
    url: '/classify/add',
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

// 修改商品类别
export function commdityClassUpdate(data) {
  return request({
    url: '/classify/update',
    method: 'post',
    data
  })
}

// 通过ID查询商品
export function commdityClassgetById(data) {
  return request({
    url: '/classify/getById',
    method: 'post',
    data
  })
}

// 通过ID查询商品
export function getCommdityClassByPid(data) {
  return request({
    url: '/classify/getByPid',
    method: 'post',
    data
  })
}

// 商品类别管理查询
export function commdityClassGetAll(data) {
  return request({
    url: '/classify/getAll',
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

// ******服务商分类******
// 添加服务商分类
export function providerClassAdd(data) {
  return request({
    url: 'providerClassify/add',
    method: 'post',
    data
  })
}
// 删除服务商分类
export function providerClassDelete(data) {
  return request({
    url: '/providerClassify/delete',
    method: 'post',
    data
  })
}
// 修改服务商分类
export function providerClassUpdate(data) {
  return request({
    url: '/providerClassify/update',
    method: 'post',
    data
  })
}
// 获取服务商分类（通过ID)
export function getProviderClassById(data) {
  return request({
    url: '/providerClassify/getById',
    method: 'post',
    data
  })
}
// 获取服务商分类（通过PID）
export function getProviderClassByPid(data) {
  return request({
    url: '/providerClassify/getByPid',
    method: 'post',
    data
  })
}

// ******客户分类******
// 添加客户分类
export function customerClassAdd(data) {
  return request({
    url: '/customerClassify/add',
    method: 'post',
    data
  })
}
// 删除客户分类
export function customerClassDelete(data) {
  return request({
    url: '/customerClassify/delete',
    method: 'post',
    data
  })
}
// 修改客户分类
export function customerClassUpdate(data) {
  return request({
    url: '/customerClassify/update',
    method: 'post',
    data
  })
}
// 获取客户分类（通过ID)
export function getCustomerClassById(data) {
  return request({
    url: '/customerClassify/getById',
    method: 'post',
    data
  })
}
// 获取客户分类（通过PID）
export function getCustomerClassByPid(data) {
  return request({
    url: '/customerClassify/getByPid',
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
