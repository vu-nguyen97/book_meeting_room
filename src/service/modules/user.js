import request from '../index'

export default {
  getAllMeetingsOfUser(params) {
    return request('get', '/user/meetings', params)
  },

  getUser() {
    return request('get', '/user')
  },
}