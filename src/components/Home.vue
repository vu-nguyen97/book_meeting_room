<template>
  <v-container>
    <v-row class="mt-12">
      <v-col v-if="meetings.length == 0"
        class="u-textCenter"
      >
        You haven't meeting at the moment.
      </v-col>
      <v-col
        v-for="(meeting, index) in meetings"
        v-bind:key="meeting.id"
        lg="3"
        md="4"
        sm="6"
        xs="12"
      >
        <card
          v-if="meetings"
          :color="colors[index]"
          :meeting="meeting.meeting"
          :isOwner="meeting.is_created_user"
        />
      </v-col>
    </v-row>
    <div v-if="isShowSpinner" class="Spinner"></div>
  </v-container>
</template>

<script>
import Card from './Card'
import axios from 'axios'

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
      isAdmin: false,
      isShowSpinner: true
    }
  },
  components: {
    Card
  },
  created () {
    const userId = this.$store.state.userId
    // axios.get(`${process.env.VUE_APP_HOST_URL}/user`, {
    //   params: {
    //     id: userId
    //   }
    // })
    // .then((res) => {
    //   if(res.data.role_id === 1) {
    //     this.isAdmin = true
    //   }
    // })

    axios.get(`${process.env.VUE_APP_HOST_URL}/user/meetings`, {
      params: {
        id: userId
      }
    })
    .then((res) => {
      const meetings = res.data
      this.meetings = [...meetings]

      const totalMeetings = meetings.length;
      const totalBaseColors = Object.keys(this.colors).length;
      if (totalMeetings > totalBaseColors) {
        for (let i = totalBaseColors; i <= totalMeetings; i++) {
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
