<template>
  <v-container>
    <v-row>
      <v-col
        v-for="meeting in meetings"
        v-bind:key="meeting.id"
        lg="3"
        md="4"
        sm="6"
        xs="12"
      >
        <card v-bind:color="colors[meeting.id]" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Card from './Card'

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
      meetings: [
        { id: 0, name: 'Meeting name' },
        { id: 1, name: 'Meeting name' },
        { id: 2, name: 'Meeting name' },
        { id: 3, name: 'Meeting name' },
        { id: 4, name: 'Meeting name' },
        { id: 5, name: 'Meeting name' },
        { id: 6, name: 'Meeting name' },
        { id: 7, name: 'Meeting name' },
      ]
    }
  },
  props: {
    msg: String,
    isAdmin: Boolean
  },
  components: {
    Card
  },
  created () {
    const totalMeetings = this.meetings.length;
    const totalBaseColors = Object.keys(this.colors).length;
    if (totalMeetings <= totalBaseColors) {
      return;
    }
    for (let i = totalBaseColors; i <= totalMeetings; i++) {
      let indexOfColor = i % totalBaseColors;
      this.colors = Object.assign({}, this.colors, {
        [i]: this.colors[indexOfColor]
      });
    }
  },
}
</script>

<style scoped lang="scss">
</style>
