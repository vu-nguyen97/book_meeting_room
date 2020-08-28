<template>
  <div class="Login">
    <div class="Login-layout">
      <div class="Login-layout-wrapper">
        <div class="Login-content">
          <div class="header">Sign in</div>

          <div class="Login-content-line">
            <i class="fas fa-user fa-3x custom-fa"></i>
            <input
              type="text"
              placeholder="Username" 
            >
          </div>
          <div class="Login-content-line">
            <i class="fas fa-lock fa-3x custom-fa"></i>
            <input
              type="text"
              placeholder="Password" 
            >
          </div>
          <div class="Login-content-loginWithAdminBtn u-marginTopXLarge">
            <input type="checkbox" id="remember" :checked="this.$store.state.isAdmin" @click="toggleAdmin">
            <label for="remember">Login with admin</label>
          </div>
          <!-- <b-button pill variant="primary" class="u-marginTop btnLogin" @click="loginRequest">Login</b-button> -->
          <router-link :to="{ name: 'home', path:'/', params: {} }">
            <!-- <b-button pill variant="primary" class="u-marginTop btnLogin">Login</b-button> -->
            <v-btn
              class="mt-7 pl-14 pr-14"
              large
              color="primary"
            >Login</v-btn>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
    msg: String,
  },
  methods: {
    toggleAdmin() {
      this.$store.commit('toggleAdmin');
    },
    // loginRequest() {
    //   return this.$router.push({ name: 'home', path: '/home', params: {isAdmin: this.$store.isAdmin } });
    // }
  },
  data() {
    return {
      rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters',
    ],
    }
  },
}
</script>

<style scoped lang="scss">
  .Login {
    position: absolute;
    top: -64px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;

    &-layout {
      position: relative;
      height: 100%;
      width: 100%;
      &::before {
        content: '';
        background-image: url('../assets/log_in_background.png');
        background-size: cover;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

      }
      &-wrapper {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }

    &-content {
      margin-right: 5%;
      width: 40%;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-line {
        display: flex;
        align-items: center;
        margin-bottom: 1.6rem;
        @media (min-width: 998px) {
          input {
            min-width: 480px;
          }
        }
      }

      &-loginWithAdminBtn {
        display: flex;
        justify-content: center;
      }

      .header {
        font-size: 3rem;
        font-weight: 600;
        margin-bottom: 4rem;
      }
      .btnLogin {
        padding: 0.7rem 4.5rem;
        margin-bottom: 5rem;
      }
    }
  }

  .custom-fa {
    margin-right: -3rem;
    color: rgb(65, 63, 63) !important;
    z-index: 1;
  }
  
  input[type=text] {
    border-bottom: 1px solid #616161;
  }
</style>
