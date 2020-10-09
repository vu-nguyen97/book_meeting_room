<template>
  <v-app-bar
    color="indigo lighten-3"
    class="Header"
    app
    dark
  >
    <div class="Header-wrapper u-width100">
      <router-link to="/home"
        class="Header-link"
        :class="[ activePage == 'home' ? 'active' : '' ]"
      >
        Home
      </router-link>
      <router-link to="/room-list"
        class="Header-link"
        :class="[ activePage == 'room-list' ? 'active' : '' ]"
      >
        Room list
      </router-link>
      <div
        class="Header-link u-pointerCursor"
        @click="logoutRequest"
      >
        Log out
      </div>
    </div>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
        activePage: null
      }
    },
    methods: {
      logoutRequest() {
        localStorage.removeItem('access_token')
        this.$store.commit('logout')
        this.$router.push({ path: '/login' })
      }
    },
    created () {
      const hashUrl = window.location.hash
      const activePage = hashUrl.split('/')[1]
      this.activePage = activePage ? activePage : 'home'
    },
    watch: {
      $route(to) {
        const activePage = to.name
        this.activePage = activePage
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
      color: black !important;

      &:last-child {
        margin-right: 5%;
      }

      &:hover {
        opacity: 0.8;
      }
    }
    .active {
      color: darken(#007bff, 25) !important;
    }
  }
</style>