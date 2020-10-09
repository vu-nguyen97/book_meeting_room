<template>
  <v-container>
    <Spinner :isShowSpinner="isShowSpinner"></Spinner>
    <v-alert :value="alert ? true : false" :type="$store.state.typeAlert" dismissible outlined>
      {{alert}}
    </v-alert>
    <v-row class="fill-height">
      <v-col
        v-if="isShowAddCategoriesForm"
        sm="12"
        lg="2"
        class="mb-4 controls"
      >
        <v-btn
          class="mt-2"
          fab
          small
          color="primary"
          @click="isShowAddCategoriesForm = false"
        >
          <v-icon dark>mdi-chevron-right</v-icon>
        </v-btn>
        <br><br>
        <v-select
          :items="categories"
          v-model="selectedRoom"
          label="Choose room"
          hide-details
          outlined
          dense
        >
        </v-select>

        <v-select
          class="mt-5"
          :items="meetingTypes"
          v-model="activedType"
          label="Choose type"
          hide-details
          outlined
          dense
        >
        </v-select>

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
              v-model="meetingDay"
              class="mt-5"
              label="Choose day"
              prepend-icon="event"
              dense
              readonly
              outlined
              hide-details
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="meetingDay"
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
              @click="$refs.startMenu.save(meetingDay)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-dialog
          ref="dialog"
          v-model="modal"
          @keydown.esc="exit"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startTime"
              label="Start time"
              prepend-icon="access_time"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modal"
            v-model="startTime"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(startTime)">OK</v-btn>
          </v-time-picker>
        </v-dialog>

        <v-dialog
          ref="dialog2"
          v-model="modal2"
          persistent
          @keydown.esc="exit"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endTime"
              label="End time"
              prepend-icon="access_alarms"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modal2"
            v-model="endTime"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog2.save(endTime)">OK</v-btn>
          </v-time-picker>
        </v-dialog>

        <v-btn
          v-if="!meeting"
          class="mt-5"
          color="primary"
          block
          @click="onAddMeeting"
          :disabled="isDisableAddMeetingBtn"
        >
          Add
        </v-btn>
        <v-btn
          v-else
          class="mt-5"
          color="primary"
          block
          @click="onEditMeeting"
          :disabled="isDisableEditMeetingBtn"
        >
          Edit
        </v-btn>
      </v-col>
      <v-btn
        v-if="!isShowAddCategoriesForm"
        class="mt-5 ml-3"
        fab
        small
        color="primary"
        @click="isShowAddCategoriesForm = true"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="$refs.calendar.prev()">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="$refs.calendar.next()">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="800">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="category"
            category-show-all
            :interval-minutes=30
            :first-interval=16
            :interval-count=20

            :categories="categories"
            :events="events"
            :event-color="getEventColor"
            @change="fetchEvents"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import roomRequest from '../service/modules/room_list'
  import meetingRequest from '../service/modules/meeting'
  import Spinner from './Spinner'

  const colors = ['blue', 'indigo', 'cyan', 'green', 'grey darken-1']

  export default {
    data: () => ({
      isShowAddCategoriesForm: true,
      startTime: null,
      endTime: null,
      selectedRoom: null,
      modal: false,
      modal2: false,
      startMenu: false,
      activedType: 'Meeting',
      meetingDay: moment().format('YYYY-MM-DD'),
      focus: '',
      events: [],
      colors: colors,

      categories: [],
      meetingTypes: [],
      rooms: [],
      meeting: null,
      isShowSpinner: true,
    }),
    components: {
      Spinner,
    },
    computed: {
      isDisableAddMeetingBtn: function() {
        let isDisable = true
        if (this.startTime && this.endTime && this.selectedRoom) {
          isDisable = false
        }
        return isDisable
      },
      isDisableEditMeetingBtn: function() {
        let isDisable = true
        const meeting_type_id = this.meetingTypes.indexOf(this.activedType) + 1
        const room_id = this.getRoomId()
        const startTime = moment(this.meeting.start_time).format('hh:mm')
        const endTime = moment(this.meeting.end_time).format('hh:mm')
        const dayTime = moment(this.meeting.start_time).format('YYYY-MM-DD')

        if (
          this.startTime != startTime ||
          this.endTime != endTime ||
          this.meeting.meeting_type_id != meeting_type_id ||
          this.meeting.room_id != room_id ||
          this.meetingDay != dayTime
        ) {
          isDisable = false
        }
        return isDisable
      },
      alert: function () {
        return this.$store.state.alert
      },
    },
    created () {
      let meeting_id = null
      if (this.$route.params) {
        meeting_id = this.$route.params.meeting_id
      }
      roomRequest.getMeetingData(meeting_id)
        .then(res => {
          const data = res.data
          const { meeting, rooms, meetingTypes } = data
          
          this.rooms = rooms
          this.categories = rooms.map(room => room.name)
          this.meetingTypes = meetingTypes.map(meetingType => meetingType.type)

          if (meeting) {
            meetingTypes.forEach(typeObj => {
              if (typeObj.id == meeting.meeting_type_id) {
                this.activedType = typeObj.type
              }
            })

            this.startTime = moment(meeting.start_time).format('hh:mm')
            this.endTime = moment(meeting.end_time).format('hh:mm')
            this.selectedRoom = meeting.room.name
            this.meetingDay = moment(meeting.start_time).format('YYYY-MM-DD')
            this.meeting = meeting
          }
          this.isShowSpinner = false
        })
    },
    methods: {
      onAddMeeting() {
        const meeting_type_id = this.meetingTypes.indexOf(this.activedType) + 1
        const room_id = this.getRoomId()

        meetingRequest.addNewMeeting({
          meeting_type_id: meeting_type_id,
          start_time: `${this.meetingDay} ${this.startTime}:00`,
          end_time: `${this.meetingDay} ${this.endTime}:00`,
          room_id: room_id
        })
          .then(() => {
            this.events.push({ 
              name: this.activedType,
              start: `${this.meetingDay} ${this.startTime}:00`,
              end: `${this.meetingDay} ${this.endTime}:00`,
              color: this.colors[meeting_type_id - 1],
              category: this.selectedRoom,
            })
            this.$store.dispatch('setAlertAsync', {type: 'info', message: 'Add meeting success!'})
            this.resetForm()
          })
      },
      onEditMeeting () {
        const { meeting } = this
        const room_id = this.getRoomId()

        meetingRequest.updateMeeting({
          id: meeting.id,
          start_time: `${this.meetingDay} ${this.startTime}:00`,
          end_time: `${this.meetingDay} ${this.endTime}:00`,
          room_id: room_id,
          meeting_type_id: this.meetingTypes.indexOf(this.activedType) + 1
        })
          .then((res) => {
            if (res && res.status == 200) {
              this.$store.dispatch('setAlertAsync', {type: 'info', message: 'Edit meeting success!'})
              this.resetForm()
              this.$router.push({ path: '/room-list' })
            }
          })
      },
      exit() {
        this.modal = false
        this.modal2 = false
      },
      getEventColor (event) {
        return event.color
      },
      getRoomId () {
        let room_id = null
        this.rooms.forEach(room => {
          if (room.name == this.selectedRoom) {
            room_id = room.id
          }
        })
        return room_id
      },
      setToday () {
        this.focus = ''
      },
      resetForm () {
        this.startTime = null
        this.endTime = null
        this.selectedRoom = null
        this.meeting = null
        this.activedType = 'Meeting'
      },
      // eslint-disable-next-line no-unused-vars
      fetchEvents ({start, end}) {
        if(this.isShowSpinner) {
          setTimeout(() => {
            this.fetchEvents({start, end})
          }, 1000);
          return
        }

        roomRequest.getMeetingsByRooms(start.date)
          .then((res) => {
            const roomData = res.data
            const events = []

            roomData.forEach(room => {
              const { meetings } = room
              if (meetings.length == 0) {
                return
              }
              meetings.forEach(meeting => {
                events.push({
                  name: this.meetingTypes[meeting.meeting_type_id - 1],
                  start: moment(meeting.start_time).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment(meeting.end_time).format('YYYY-MM-DD HH:mm:ss'),
                  color: this.colors[meeting.meeting_type_id - 1],
                  category: room.name
                })
              })
            })
            this.events = events
          })
      },
    },
  }
</script>

<style scoped>
.controls {
  position: relative;
}
</style>