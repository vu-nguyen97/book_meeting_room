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
                        v-model="filters.startDate"
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
                      v-model="filters.startDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="startMenu = false"
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
                        v-model="filters.endDate"
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
                      v-model="filters.endDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="endMenu = false"
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
              v-model="filters.room"
              color="primary"
            >
              <v-list-item
                v-for="(room, index) in roomNames"
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
              v-model="filters.meetingType"
              color="primary"
            >
              <v-list-item
                v-for="(meetingType, index) in meetingTypes"
                :key="index"
              >
                {{meetingType}}
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="FilterMeeting-sorting ml-6">
      <h4 class="mr-4">Sort by:</h4>
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
            v-model="activedSortType"
            color="primary"
          >
            <v-list-item
              @click="option.handleClick"
              v-for="(option, index) in sortByOptions"
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
      defaultMeetings: Array,
      updateMeetings: {
        type: Function
      },
    },
    data() {
      return {
        hasMeeting: false,
        endMenu: false,
        startMenu: false,

        roomNames: [],
        meetingTypes: [],
        activedSortType: null,
        
        filters: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
          room: null,
          meetingType: null
        },
        sortByOptions: [
          { name: 'Meeting Type', handleClick: () => this.sortMeeting('Meeting Type') },
          { name: 'Room name', handleClick: () => this.sortMeeting('Room name') },
        ],
      }
    },
    watch: {
      activedSortType(newValue) {
        if (newValue === undefined) {
          this.sortMeeting()
        }
      },
      filters: {
        deep: true,
        async handler(val) {
          let filteredMeetings = this.defaultMeetings
          if (
            val.startDate != moment().format('YYYY-MM-DD') ||
            val.endDate != moment().add(7, 'days').format('YYYY-MM-DD')
          ) {
            const responseData = await userRequest.getAllMeetingsOfUser({ start_time: val.startDate, end_time: val.endDate })
            filteredMeetings = responseData.data
          }
          if (typeof val.room == "number") {
            filteredMeetings = filteredMeetings.filter(userMeeting => {
              if (userMeeting.meeting) {
                return userMeeting.meeting.room.name == this.roomNames[val.room]
              }
            })
          }
          if (typeof val.meetingType == "number") {
            filteredMeetings = filteredMeetings.filter(userMeeting => {
              if (userMeeting.meeting) {
                return userMeeting.meeting.meetingType.type == this.meetingTypes[val.meetingType]
              }
            })
          }
          this.sortMeeting('', filteredMeetings)
        }
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
      this.sortMeeting()
    },
    methods: {
      setActivedSortType(name) {
        this.sortByOptions.forEach((option, index) => {
          if (option.name == name) {
            this.activedSortType = index
          }
        })
      },
      sortMeeting(sortName, filteredMeetings) {
        let fieldData = null
        if (sortName == 'Meeting Type') {
          fieldData = this.meetingTypes
        } else if (sortName == 'Room name') {
          fieldData = this.roomNames
        } else {
          let userMeetings = filteredMeetings || this.meetings
          userMeetings.sort((userMeeting1, userMeeting2) => 
            userMeeting1.meeting.start_time > userMeeting2.meeting.start_time ? 1 : -1
          )
          return this.updateMeetings(userMeetings)
        }

        let meetingMap = {}
        fieldData.forEach(field => {
          meetingMap = Object.assign({}, meetingMap, {
            [field]: []
          })
        })

        this.meetings.forEach(userMeeting => {
          let field_name = null
          if (sortName == 'Meeting Type') {
            field_name = userMeeting.meeting.meetingType.type
          } else {
            field_name = userMeeting.meeting.room.name
          }
          meetingMap[field_name].push(userMeeting)
        })

        const sortingMeetings = []
        Object.values(meetingMap).forEach(meeting_arr => {
          if (meeting_arr.length == 0) { return }
          meeting_arr.forEach(userMeeting => sortingMeetings.push(userMeeting))
        })
        this.updateMeetings(sortingMeetings)
        this.setActivedSortType(sortName)
      },
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
    flex-grow: 1;
  }

  &-sorting {
    display: flex;
    align-items: center;
    flex-grow: 2;
  }
}
</style>