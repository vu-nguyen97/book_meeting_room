import request from '../index'

export default {
  getRoomsInfo() {
    return request('get', '/room')
  },
}