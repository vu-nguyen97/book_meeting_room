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
          <div class="u-flexCenter u-marginTopXLarge">
            <input type="checkbox" id="remember" :checked="this.$store.state.isAdmin" @click="toggleAdmin">
            <label for="remember">Login with admin</label>
          </div>
          <!-- <b-button pill variant="primary" class="u-marginTop btnLogin" @click="loginRequest">Login</b-button> -->
          <router-link :to="{ name: 'home', path:'/', params: {} }">
            <v-btn
              class="mt-7 pl-16 pr-16"
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
  $app-header-height: 64px;
  .Login {
    position: absolute;
    top: -$app-header-height;
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
  }

  input[type=text] {
    padding-left: 4rem;
    font-size: 1.5rem;
    height: 3.6rem !important;
    border-bottom: 1px solid #616161;

    &:focus{
      outline: 1px solid #2c97fa;
      border: 0;

      &::placeholder {
        font-size: 1rem;
      }
    }
  }

  input[type=checkbox] {
    zoom: 1.8;
  }

</style>
