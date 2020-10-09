<template>
  <div class="FilterMeeting mt-4">
    <div class="FilterMeeting-filtering">
      <h4>Filter by:</h4>
      <div class="ml-4">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo"
              outlined
              dark
              v-bind="attrs"
              v-on="on"
            >
              Day
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-row>
                <v-col>
                  <v-menu
                    ref="startMenu"
                    v-model="startMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    min-width="290px"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="startDay"
                        class="mt-5"
                        label="Choose start day"
                        dense
                        readonly
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDay"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="startMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="filterByStartDay(startDay)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col>
                  <v-menu
                    ref="endMenu"
                    v-model="endMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    min-width="290px"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="endDay"
                        class="mt-5"
                        label="Choose end day"
                        dense
                        readonly
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDay"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="endMenu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="filterByEndDay(endDay)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="ml-6">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo"
              outlined
              dark
              v-bind="attrs"
              v-on="on"
            >
              Room
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group
              v-model="groupByActiveId"
              color="primary"
            >
              <v-list-item
                v-for="(room, index) in roomNames"
                @click="filterRoom(room)"
                :key="index"
              >
                {{room}}
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>

      <div class="ml-6">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="indigo"
              outlined
              dark
              v-bind="attrs"
              v-on="on"
            >
              Meeting type
              <v-icon class="ml-1">keyboard_arrow_down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group
              v-model="groupByActiveId"
              color="primary"
            >
              <v-list-item
                v-for="(meetingType, index) in meetingTypes"
                @click="filterMeetingType(meetingType)"
                :key="index"
              >
                {{meetingType}}
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="FilterMeeting-grouping ml-6">
      <h4 class="mr-4">Group by:</h4>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            outlined
            dark
            v-bind="attrs"
            v-on="on"
          >
            Choose
            <v-icon class="ml-1">keyboard_arrow_down</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group
            v-model="groupByActiveId"
            color="primary"
          >
            <v-list-item
              @click="option.handleClick"
              v-for="(option, index) in groupByOptions"
              :key="index"
            >
              {{option.name}}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import userRequest from '../service/modules/user'
  import roomRequest from '../service/modules/room'
  import meetingRequest from '../service/modules/meeting'

  export default {
    name: 'FilterMeeting',
    props: {
      meetings: Array,
      updateMeetings: {
        type: Function
      },
    },
    watch: {
      groupByActiveId(newValue) {
        if (newValue === undefined) {
          this.updateMeetings(this.defaultMeetings)
        }
      }
    },
    data() {
      return {
        hasMeeting: false,
        endMenu: false,
        startMenu: false,
        startDay: moment().format('YYYY-MM-DD'),
        endDay: moment().add(7, 'days').format('YYYY-MM-DD'),

        roomNames: [],
        meetingTypes: [],
        groupByActiveId: null,
        groupByOptions: [
          { name: 'Meeting Type', handleClick: this.groupByMeetingType },
          { name: 'Room name', handleClick: this.groupByRoomName },
        ],
        defaultMeetings: this.meetings,
      }
    },
    created () {
      roomRequest.getRoomsInfo().then(res => {
        res.data.forEach(
          room => this.roomNames.push(room.name)
        )
        this.roomNames.sort()
      })
      meetingRequest.getMeetingTypesInfo().then(res => {
        res.data.forEach(
          meetingType => this.meetingTypes.push(meetingType.type)
        )
        this.meetingTypes.sort()
      })
    },
    methods: {
      getGroupByActivedId(name) {
        this.groupByOptions.forEach((option, index) => {
          if (option.name == name) {
            this.groupByActiveId = index
          }
        })
      },
      groupByMeetingType() {
        this.getGroupByActivedId('Meeting Type')
        let meetings = {}
        this.meetings.forEach(userMeeting => {
          const meetingTypeId = userMeeting.meeting.meeting_type_id

          if (Object.keys(meetings).indexOf(meetingTypeId.toString()) == -1) {
            const groupingMeeting = []
            groupingMeeting.push(userMeeting)

            meetings = Object.assign({}, meetings, {
              [meetingTypeId]: [...groupingMeeting]
            })
          } else {
            meetings[meetingTypeId].push(userMeeting)
          }
        })

        const groupingMeetings = []
        const meetingTypes = Object.keys(meetings).sort()
        meetingTypes.forEach(meetingTypeId => {
          meetings[meetingTypeId].map(meeting => groupingMeetings.push(meeting))
        })
        this.updateMeetings(groupingMeetings)
      },
      groupByRoomName() {
        this.getGroupByActivedId('Room name')
        let rooms = {}
        this.meetings.forEach(userMeeting => {
          const roomName = userMeeting.meeting.room.name

          if (Object.keys(rooms).indexOf(roomName) === -1) {
            const groupingMeeting = []
            groupingMeeting.push(userMeeting)

            rooms = Object.assign({}, rooms, {
              [roomName]: [...groupingMeeting]
            })
          } else {
            rooms[roomName].push(userMeeting)
          }
        })

        const groupingMeetings = []
        this.roomNames = Object.keys(rooms).sort()
        this.roomNames.forEach(roomName => {
          rooms[roomName].map(meeting => groupingMeetings.push(meeting))
        })
        this.updateMeetings(groupingMeetings)
      },
      filterByStartDay(startDay) {
        this.$refs.startMenu.save(startDay)
        userRequest.getAllMeetingsOfUser({start_time: startDay})
          .then(res => this.updateMeetings(res.data))
      },
      filterByEndDay(endDay) {
        this.$refs.startMenu.save(endDay)
        userRequest.getAllMeetingsOfUser({end_time: endDay})
          .then(res => this.updateMeetings(res.data))
      },
      filterRoom(room) {
        const filteringMeetings = this.defaultMeetings.filter(
          userMeeting => userMeeting.meeting.room.name == room
        )
        this.updateMeetings(filteringMeetings)
      },
      filterMeetingType(meetingType) {
        const filteringMeetings = this.defaultMeetings.filter(
          userMeeting => userMeeting.meeting.meetingType.type === meetingType
        )
        this.updateMeetings(filteringMeetings)
      }
    },
  }
</script>

<style lang="scss" scoped>
.FilterMeeting {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-filtering {
    display: flex;
    align-items: center;
    flex-grow: 2;
  }

  &-grouping {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
}
</style>