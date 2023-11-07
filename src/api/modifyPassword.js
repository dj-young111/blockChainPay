import request from '@/utils/request'

const api = {
  modify: '/user/editPassword',
}

export function setModifyPassword(data) {
    return request({
        url: api.modify,
        method: 'post',
        data
    })
}

