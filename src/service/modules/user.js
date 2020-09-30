import request from '../index'

export default {
  getAllMeetingsOfUser() {
    return request('get', '/user/meetings')
  },

  getUser() {
    return request('get', '/user')
  },
}