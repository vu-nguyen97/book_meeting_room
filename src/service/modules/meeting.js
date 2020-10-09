import request from '../index'

export default {
  addUsersToMeeting(userMeetings) {
    return request('post', '/meeting/add-person', { data: userMeetings })
  },

  deleteUserInMeeting(meeting_id, user_id) {
    return request('delete', '/meeting/add-person', {
      meeting_id,
      user_id
    })
  },

  updateMeeting(meeting) {
    return request('put', '/meeting', meeting )
  },
  
  addNewMeeting(meeting) {
    return request('post', '/meeting', meeting)
  },

  getMeetingById(meeting_id) {
    return request('get', `/meeting/${meeting_id}`)
  },

  getMeetingTypesInfo() {
    return request('get', '/meeting_type')
  }
}