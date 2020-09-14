<template>
  <v-app-bar
    color="indigo lighten-3"
    class="Header"
    app
    dark
  >
    <div class="Header-wrapper u-width100">
      <router-link to="/home" class="Header-link Header-link-blackColor">Home</router-link>
      <router-link to="/room-list" class="Header-link">Room list</router-link>
      <div @click="logoutRequest" class="Header-link Header-link-blackColor u-pointerCursor">Log out</div>
    </div>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'Header',
    methods: {
      logoutRequest() {
        this.$store.commit('logout')
        this.$router.push({ path: '/login' })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .Header {
    &-wrapper {
      display: flex;
      justify-content: flex-end;
    }

    &-link {
      font-size: 1.6rem;
      font-weight: 700;
      margin-right: 8%;
      opacity: 0.6;

      &-blackColor {
        color: black !important;
      }

      &:last-child {
        margin-right: 5%;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
</style>