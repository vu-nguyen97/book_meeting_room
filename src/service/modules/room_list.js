import request from '../index'

export default {
  getMeeting(start_date) {
    return request('get', '/room-list', { date: start_date })
  },
}