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
