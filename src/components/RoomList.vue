<template>
  <v-container>
    <v-row class="fill-height">
      <v-col
        v-if="isShowAddCategoriesForm"
        sm="12"
        lg="3"
        class="mb-4 controls"
      >
        <v-btn
          fab
          small
          color="primary"
          @click="isShowAddCategoriesForm = false"
        >
          <v-icon dark>mdi-chevron-right</v-icon>
        </v-btn>
        <br><br><br>
        <v-select
          :items="categories"
          label="Categories"
          hide-details
          outlined
          dense
        ></v-select>
        <v-menu
          ref="startMenu"
          v-model="startMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="start"
          transition="scale-transition"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="start"
              class="mt-5"
              label="Start Date"
              prepend-icon="fas fa-calendar-alt fa-2x"
              dense
              readonly
              outlined
              hide-details
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="start"
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
              @click="$refs.startMenu.save(start)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-menu
          ref="nowMenu"
          v-model="nowMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="now"
          transition="scale-transition"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-5"
              label="Time"
              prepend-icon="fas fa-clock"
              dense
              readonly
              outlined
              hide-details
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="now"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="nowMenu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.nowMenu.save(now)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-btn
          class="mt-5"
          color="primary"
          block
          @click="isShowAddCategoriesForm = false"
        >
          Add
        </v-btn>
      </v-col>
      <v-btn
        v-if="!isShowAddCategoriesForm"
        fab
        small
        color="primary"
        @click="isShowAddCategoriesForm = true"
      >
        <i class="fa fa-plus" aria-hidden="true"></i>
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
      now: null, //fix
      nowMenu: false,
      startMenu: false, //fix
      start: moment().format('YYYY-MM-DD'),
      focus: '',
      events: [],
      colors: ['blue', 'indigo', 'cyan', 'green', 'grey darken-1'],
      names: ['Meeting', 'Event', 'Birthday', 'Conference', 'Party'],
      categories: ['Conference room 1', 'Conference room 2', 'Conference room 3', 'Conference room 4'],
    }),
    created () {
      console.log('refs:',this.$refs);
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
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
        const names = [0, 1, 3, 2, 4]
        const categories = [0, 2, 1, 4, 1]
        for (let i = 0; i < 5; i++) {
          events.push({
            name: this.names[names[i]],
            start: first[i],
            end: second[i],
            color: this.colors[names[i]],
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