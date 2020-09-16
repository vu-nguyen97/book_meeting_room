<template>
  <v-container>
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
          :items="typesOfMeeting"
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
          class="mt-5"
          color="primary"
          block
          @click="onAddMeeting"
          :disabled="isDisableAddMeetingBtn"
        >
          Add
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
  import axios from 'axios'

  const meetingType = {
    0: "Meeting",
    1: "Event",
    2: "Birthday",
    3: "Conference",
    4: "Party",
  }
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
      typesOfMeeting: Object.values(meetingType),
      categories: [],
      rooms: []
    }),
    computed: {
      isDisableAddMeetingBtn: function() {
        let isDisable = true
        if (this.startTime && this.endTime && this.selectedRoom) {
          isDisable = false
        }
        return isDisable
      }
    },
    methods: {
      onAddMeeting() {
        const indexOfTypeMeeting = this.typesOfMeeting.indexOf(this.activedType)
        const indexOfRoom = this.categories.indexOf(this.selectedRoom)
        const room_id = this.rooms[indexOfRoom].id

        axios.post(`${process.env.VUE_APP_HOST_URL}/meeting`, {
          type: indexOfTypeMeeting,
          start_time: `${this.meetingDay} ${this.startTime}:00`,
          end_time: `${this.meetingDay} ${this.endTime}:00`,
          room_id: room_id,
          user_id: this.$store.state.userId
        })
          .then(() => {
            this.events.push({ 
              name: this.activedType,
              start: `${this.meetingDay} ${this.startTime}:00`,
              end: `${this.meetingDay} ${this.endTime}:00`,
              color: this.colors[indexOfTypeMeeting],
              category: this.selectedRoom,
            })
            this.startTime = null
            this.endTime = null
            this.selectedRoom = null
          })
      },
      exit() {
        this.modal = false
        this.modal2 = false
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      // eslint-disable-next-line no-unused-vars
      fetchEvents ({ start, end }) {
        axios.get(`${process.env.VUE_APP_HOST_URL}/room-list`, {
          params: { date: start.date }
        })
          .then((res) => {
            const roomData = res.data
            const events = []
            const rooms = []

            roomData.forEach(room => {
              rooms.push({
                id: room.id,
                name: room.name,
                address: room.address
              })
              const { meetings } = room

              meetings.forEach(meeting => {
                events.push({
                  name: this.typesOfMeeting[meeting.type],
                  start: moment(meeting.start_time).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment(meeting.end_time).format('YYYY-MM-DD HH:mm:ss'),
                  color: this.colors[meeting.type],
                  category: room.name
                })
              })
            })

            this.rooms = rooms
            this.categories = rooms.map(room => room.name)
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