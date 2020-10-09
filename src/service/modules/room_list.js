import request from '../index'

export default {
  getMeetingData(meeting_id) {
    if (meeting_id) {
      return request('get', `/room-list/${ meeting_id }`)
    } else {
      return request('get', '/room-list')
    }
  },
  getMeetingsByRooms(date) {
    return request('get', '/room-list', { date })
  }
}