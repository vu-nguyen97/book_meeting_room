<template>
  <div class="Card u-marginTopLarge">
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Thêm nhân viên cho cuộc họp</v-card-title>
        <v-autocomplete
          class="Card-searchUserMenu mx-5 mt-4"
          v-model="activedValues"
          :items="items"
          :height=50
          dense
          chips
          small-chips
          label="Search..."
          multiple
          solo
        ></v-autocomplete>
        <div v-if="formatedUsers" class="px-5 mt-2">
          <h4 class="ma-1">Thành viên tham dự:</h4>
          <ul
            class="pl-3"
            v-for="(user, index) in formatedUsers"
            :key="index"
          >
            <li class="Card-searchUserMenu-user pl-2 pr-4">
              <span>{{user}}</span>
              <span @click="removeUser(user)">
                <i class="Card-searchUserMenu-user-removeBtn fas fa-times" />
              </span>
            </li>
          </ul>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Hủy</v-btn>
          <v-btn color="green darken-1" text @click="inviteEmployee">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="Card-coloredDiv" v-bind:style="{'background-color': color}"></div>
    <div class="Card-wrapper">
      <div class="Card-upper">
        <div class="Card-upper-icons mb-5">
          <input type="checkbox" :checked="false">
          <div class="u-flexCenter">
            <i class="fas fa-cog fa-2x"></i>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >keyboard_arrow_down</v-icon>
              </template>
              <v-list v-if="isOwner">
                <v-list-item
                  v-for="(option, index) in options"
                  :key="index"
                  @click="handleMeetingSeeting(option)"
                >
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-list v-else><v-list-item>No option</v-list-item></v-list>
            </v-menu>
          </div>
        </div>
        <div>
          <h4 class="mb-2">{{meetingName}}</h4>
          <div>{{formatTime(meeting.start_time, 'hour')}} - {{formatTime(meeting.end_time, 'hour')}}, {{totalPersons}} persons</div>
        </div>
      </div>
      <div class="Card-low">
        <div class="u-textPrimary">{{formatTime(meeting.start_time, 'day')}}</div>
        <div
          class="u-textSmall"
          :title="meeting.room.address"
        >
          <i class="fas fa-map-marker-alt mr-1"></i>
          {{meeting.room.name}}
        </div>
        <v-menu offset-y
          v-if="!isOwner"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              Options
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              option
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="isOwner"
          color="primary"
          outlined
          @click="editMeeting"
        >
          Edit
          <v-icon class="ml-1">keyboard_arrow_right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import api from '../api'

const MEETING_TYPES = {
  0: "Meeting",
  1: "Event",
  2: "Birthday",
  3: "Conference",
  4: "Party",
}
const DEPARTMENTS = ['D2', 'D6', 'D9']

export default {
  name: 'Card',
  props: {
    color: String,
    meeting: Object,
    users: Array,
    isOwner: Number
  },
  data() {
    return {
      options: ['Thêm thành viên'],
      meetingName: MEETING_TYPES[this.meeting.meeting_type_id],
      dialog: false,
      joinedUserIds: [],
      formatedUsers: [],
      totalPersons: 1,

      items: [],
      activedValues: [],

      invitedUsers: []
    }
  },
  created () {
    if (this.users.length === 0) {
      return
    }
    this.users.forEach(user => {
      this.joinedUserIds.push(user.id)
      this.formatedUsers.push(`${user.username} - ${DEPARTMENTS[user.department_id - 1]}`)
    })
    this.totalPersons = this.users.length
  },
  methods: {
    handleMeetingSeeting(option) {
      if (option === 'Thêm thành viên') {
        api.get('/user', {
          params: {
            meeting_id: this.meeting.id
          }
        })
        .then(res => {
          let allUsers = res.data
          const filteredUsers = allUsers.filter(user => {
            if (this.joinedUserIds.indexOf(user.id) != -1 || user.role_id == 1) {
              return false
            }
            return true
          }).sort((user1, user2) => user1.department_id > user2.department_id ? 1 : -1)

          const fomattedUsers = filteredUsers.map(user => {
            return {
              id: user.id,
              name: `${user.username} - ${DEPARTMENTS[user.department_id - 1]}`
            }
          })
          
          this.invitedUsers = fomattedUsers
          this.items = fomattedUsers.map(user => user.name)
          this.dialog = true
        })
      }
    },
    inviteEmployee() {
      let userIdArray = []
      if(this.activedValues.length == 0) {
        this.dialog = false
      }
      this.activedValues.forEach(value => {
        this.invitedUsers.forEach(user => {
          if (user.name == value) {
            userIdArray.push(user.id)
          }
        })
      })

      const dataRequest = userIdArray.map(userId => {
        return {
          user_id: userId,
          meeting_id: this.meeting.id,
          is_created_user: false
        }
      })

      api.post('/meeting/add-person', {
        data: dataRequest
      })
        .then(() => {
          this.activedValues.forEach(value => {
            this.items = this.items.filter(item => item !== value)
            this.formatedUsers.push(value)

            this.invitedUsers.forEach(user => {
              if (user.name == value) {
                this.joinedUserIds.push(user.id)
              }
            })
          })
          this.totalPersons += this.activedValues.length
          this.activedValues = []
        })
    },
    removeUser(user) {
      const indexOfUserInArr = this.formatedUsers.indexOf(user)
      const user_id = this.joinedUserIds[indexOfUserInArr]

      api.delete('/meeting/add-person', {
        params: {
          meeting_id: this.meeting.id,
          user_id
        }
      }).then(() => {
        this.formatedUsers.splice(indexOfUserInArr, 1)
        this.joinedUserIds.splice(indexOfUserInArr, 1)
        this.totalPersons -= 1
        this.items.push(user)
      })
    },
    formatTime: function(time, type) {
      if (type == 'hour') {
        return moment(time).format('LT')
      }
      if (type == 'day') {
        return moment(time).format('/ddd, DD.MM.GG')
      }
    },
    editMeeting() {
      this.$router.push({
        path: `/room-list/meeting/${this.meeting.id}`
      })
    }
  },
}
</script>

<style scoped lang="scss">
  .Card {
    $colored-div-height: 8px;

    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    // padding-bottom: calc( 19 / 30 * 100% );
    border-radius: 0.5rem;

    &-wrapper {
      // position: absolute;
      // width: 100%;
      // height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-coloredDiv {
      height: $colored-div-height;
      border-top-left-radius: $colored-div-height;
      border-top-right-radius: $colored-div-height;
      opacity: 0.6;
    }

    &-upper {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &-icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    &-searchUserMenu {
      &-user {
        $root: &;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-removeBtn {
          display: none;
          cursor: pointer;
        }
        &:hover {
          background-color: #f1f1f1;
          #{$root}-removeBtn {
            display: block;
          }
        }
      }
    }

    &-low {
      border-top: 1px solid #e1e1e1;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  input[type=checkbox] {
    zoom: 1.5;
  }
</style>
