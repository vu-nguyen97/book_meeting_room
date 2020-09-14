<template>
  <div class="Login">
    <div class="Login-layout">
      <div class="Login-layout-wrapper">
        <form class="Login-content">
          <div class="header">Sign in</div>

          <div class="u-flexCenter u-flexCol">
            <div class="Login-content-line">
              <i class="fas fa-user fa-3x custom-fa"></i>
              <input
                v-model="email"
                type="text"
                placeholder="Username or email" 
              >
            </div>
            <div class="Login-content-line">
              <i class="fas fa-lock fa-3x custom-fa"></i>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                autocomplete="on"
              >
            </div>
            <div v-if="errorRequest" class="errorRequest u-width100">
              <i class="fas fa-exclamation-circle"></i>  
              {{errorRequest}}
            </div>
            <v-btn
              class="mt-7 pl-16 pr-16"
              large
              color="primary"
              @click="loginRequest"
            >Login</v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  props: {
    msg: String,
  },
  methods: {
    loginRequest() {
      const isEmail = this.validateEmail(this.email)
      let fieldName = 'email'
      if (!isEmail) {
        fieldName = 'username'
      }
      axios.post(`${process.env.VUE_APP_HOST_URL}/login`, {
        [fieldName]: this.email,
        password: this.password
      }).then(
        () => {
          axios.get(`${process.env.VUE_APP_HOST_URL}/user`, {
            params: {
              [fieldName]: this.email
            }
          })
          .then(res => {
            const userId = res.data.id
            this.$store.commit('login', userId)
          })
          .then(() => {
            this.$router.push({ name: 'home', path: '/home' })
          })

        }, (err) => {
          this.errorRequest = JSON.parse(err.request.responseText)[0].message
      })
    },
    validateEmail(email) {
      // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  data() {
    return {
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      errorRequest: '',
      email: '',
      password: ''
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

  .errorRequest {
    color: red;
    font-size: 0.77rem;
  }

  .custom-fa {
    margin-right: -3rem;
    color: rgb(65, 63, 63) !important;
    z-index: 1;
  }

  input[type=text], input[type=password] {
    padding-left: 4rem;
    font-size: 0.9rem;
    height: 3.6rem !important;
    border-bottom: 1px solid #616161;

    &:focus{
      outline: 1px solid #2c97fa;
      border: 0;
    }
  }

  input[type=checkbox] {
    zoom: 1.8;
  }

</style>
