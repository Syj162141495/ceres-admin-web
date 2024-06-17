import request from '@/utils/request'

export function insertServiceRecommendation(data) {
  return request({
    url: '/serviceRecommendation/insertServiceRecommendation',
    method: 'post',
    data
  })
}

export function updateServiceRecommendation(data) {
  return request({
    url: '/serviceRecommendation/updateServiceRecommendation',
    method: 'post',
    data
  })
}

export function deleteServiceRecommendation(data) {
  return request({
    url: '/serviceRecommendation/deleteServiceRecommendation',
    method: 'delete',
    data
  })
}

export function recommendationBuyerList() {
  return request({
    url: '/serviceRecommendation/getAllBuyer',
    method: 'get'
  })
}

export function recommendationProductList(data) {
  return request({
    url: '/serviceRecommendation/serviceRecommendationProducts',
    method: 'post',
    data
  })
}

export function getServiceRecommendationList(data) {
  return request({
    url: '/serviceRecommendation/selectServiceRecommendation',
    method: 'post',
    data
  })
}

export function detectZoom() {
  let ratio = 0
  const screen = window.screen
  const ua = navigator.userAgent.toLowerCase()

  if (window.devicePixelRatio !== undefined) {
    // 高DPI设备上，devicePixelRatio可以表示缩放比例
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    // 对于IE，可以通过zoom属性来检测
    if (document.body.parentElement && document.body.parentElement.style.zoom != null) {
      ratio = parseFloat(document.body.parentElement.style.zoom)
    }
  } else if (window.outerWidth !== undefined && screen.width !== window.outerWidth) {
    // 对于其他浏览器，可以通过窗口尺寸与屏幕尺寸的比较来近似计算缩放比例
    ratio = window.outerWidth / screen.width
  }
  return ratio
}
