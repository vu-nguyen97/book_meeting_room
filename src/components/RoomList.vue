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
          :return-value.sync="meetingDay"
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
          :return-value.sync="startTime"
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
          :return-value.sync="endTime"
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
      colors: ['blue', 'indigo', 'cyan', 'green', 'grey darken-1'],
      typesOfMeeting: ['Meeting', 'Event', 'Birthday', 'Conference', 'Party'],
      categories: ['Conference room 1', 'Conference room 2', 'Conference room 3', 'Conference room 4'],
    }),
    created () {
      // console.log('refs:',this.$refs);
    },
    mounted () {
      // this.$refs.calendar.checkChange()
    },
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
        this.events.push({
          name: this.activedType,
          start: `${this.meetingDay}T${this.startTime}:00`,
          end: `${this.meetingDay}T${this.endTime}:00`,
          color: this.colors[indexOfTypeMeeting],
          text: {
            color: 'red'
          },
          category: this.selectedRoom,
        })
        this.startTime = null
        this.endTime = null
        this.selectedRoom = null
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
        const events = []

        const first = ['2020-8-27T09:00:00','2020-8-27T10:00:00','2020-8-28T09:00:00','2020-8-27T16:00:00','2020-8-27T17:00:00']
        const second = ['2020-8-27T11:00:00','2020-8-27T11:00:00','2020-8-28T09:30:00','2020-8-27T17:00:00','2020-8-27T17:30:00']
        const indexOfTypeMeeting = [0, 1, 3, 2, 4]
        const categories = [0, 2, 1, 4, 1]
        for (let i = 0; i < 5; i++) {
          events.push({
            name: this.typesOfMeeting[indexOfTypeMeeting[i]],
            start: first[i],
            end: second[i],
            color: this.colors[indexOfTypeMeeting[i]],
            text: {
              color: 'red'
            },
            category: this.categories[categories[i]],
          })
        }

        this.events = events
      },
    },
  }
</script>

<style scoped>
.controls {
  position: relative;
}
</style>