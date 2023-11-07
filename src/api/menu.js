import request from '@/utils/request'

const api = {
  list: '/menu/authMenulist',
}

export default api

export function getMenuList (data) {
  return request({
    url: `${api.list}`,
    method: 'post',
    data
  })
}