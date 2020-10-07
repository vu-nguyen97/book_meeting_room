<template>
  <v-container>
    <div v-if="isShowSpinner" class="Spinner"></div>
    <div v-if="!hasMeeting"
      class="u-textCenter mt-10"
    >
      You haven't meeting at the moment.
    </div>

    <div v-else>
      <FilterMeeting
        :updateMeetings="updateMeetings"
        :meetings="meetings"
      />
      <div v-if="meetings.length === 0"
        class="u-textCenter u-noData mt-10"
      >
        No meeting in this time.
      </div>

      <v-row class="mt-8">
        <v-col
          v-for="(meeting, index) in meetingsByPage"
          v-bind:key="meeting.id"
          lg="3"
          md="4"
          sm="6"
          xs="12"
        >
          <card
            v-if="meetingsByPage"
            :color="colors[index]"
            :meeting="meeting.meeting"
            :users="meeting.meeting.users"
            :isOwner="meeting.is_created_user"
          />
        </v-col>
      </v-row>

      <template>
        <div class="text-center mt-5"
          v-if="totalPage > 1"
        >
          <v-pagination
            v-model="page"
            :length="totalPage"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
      </template>
    </div>
  </v-container>
</template>

<script>
import Card from './Card'
import FilterMeeting from './FilterMeeting'
import userRequest from '../service/modules/user'

export default {
  name: 'Home',
  data: function() {
    return {
      colors: {
        0: '#ffc211',
        1: '#51c360',
        2: '#1eebff',
        3: '#ff1515',
        4: '#6a18e2',
      },
      meetings: [],
      hasMeeting: false,
      isShowSpinner: true,

      page: 1,
      totalPage: 1,
      totalMeetingInAPage: 12,
      meetingsByPage: []
    }
  },
  components: {
    Card,
    FilterMeeting
  },
  watch: {
    page(newValue) {
      this.pagniatePage(newValue)
    }
  },
  methods: {
    pagniatePage(pageNum) {
      const totalMeeting = this.meetings.length
      const start = this.totalMeetingInAPage * (pageNum - 1)
      let end = this.totalMeetingInAPage * pageNum
      if (end > totalMeeting) {
        end = totalMeeting
      }
      this.meetingsByPage = this.meetings.slice(start, end)
    },
    updateMeetings(userMeetings) {
      const meetings = []
      userMeetings.map(userMeeting => {
        if (userMeeting.meeting != null) {
          meetings.push(userMeeting)
        }
      })
      this.meetings = [...meetings]
      this.totalPage = Math.ceil(this.meetings.length / this.totalMeetingInAPage)
      this.page = 1
      this.pagniatePage(this.page)
    }
  },
  created () {
    userRequest.getAllMeetingsOfUser()
    .then((res) => {
      const userMeetings = res.data
      this.hasMeeting = userMeetings.length > 0 ? true : false
      this.updateMeetings(userMeetings)

      const totalMeeting = this.meetings.length
      const totalBaseColors = Object.keys(this.colors).length;
      if (totalMeeting > totalBaseColors) {
        for (let i = totalBaseColors; i <= totalMeeting; i++) {
          let indexOfColor = i % totalBaseColors;
          this.colors = Object.assign({}, this.colors, {
            [i]: this.colors[indexOfColor]
          });
        }
      }

      this.isShowSpinner = false
    })
  },
}
</script>

<style scoped lang="scss">
.u-noData {
  font-size: 1.2rem;
  font-style: oblique;
}
.Spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  border: 5px solid #eee;
  display: inline-block;
  
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  &:after, &:before {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  &:after {
    position: absolute;
    top: -5px;
    left: -5px;
    border: 5px solid transparent;
    border-top-color: #928a8a;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
}
</style>
