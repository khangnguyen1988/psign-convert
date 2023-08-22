<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="login-container">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <img class="logo" src="/images/logo.png" alt="PVS Logo">
        </div>
        <div class="col-12">
          <div class="card login-card">
            <div class="card-body">
              <h3>{{$t('user.signIn')}}</h3>
              <b-alert :show="serverErrors.length" variant="danger">
                <ul>
                  <li> {{serverErrors}} </li>
                </ul>
              </b-alert>
              <app-form
                ref="form"
                @on-submit="onSubmit"
                :schema="schema"
                :data="formModel"
              />
              <div class="row">
                <div class="col-12 d-flex">
                  <router-link to="register">{{$t('user.register')}}</router-link>
                  <router-link class="ml-3 mr-auto" to="forgot">{{$t('user.forgotPassword')}}</router-link>
                  <button class="btn btn-primary" @click="onClickLogin()">{{$t('app.login')}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppForm from '@/components/app-form/'
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data () {
    return {
      schema: [
        {
          name: 'user_name',
          placeholder: `${this.$t('app.enter')} ${this.$t('user.userName')}`,
          type: 'input',
          validation: 'required'
        },
        {
          name: 'password',
          placeholder: `${this.$t('app.enter')} ${this.$t('user.password')}`,
          type: 'input',
          inputType: 'password',
          validation: 'required'
        }
      ],
      formModel: {
        user_name: '',
        password: ''
      },
      serverErrors: []
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    onClickLogin () {
      this.$refs.form.submit()
    },
    onSubmit (formData) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.login(formData)
        }
      })
    }
  },
  components: {
    AppForm
  }
}
</script>
<style scoped lang="scss">
.login-container {
  width: 500px;
  margin-top: 10rem;
}
.card-body {
  padding: 1.5rem 2rem 2rem 2rem;
}
.logo {
  height: 7rem;
}
.btn {
  width: 8rem;
}
.login-card {
  @media screen and (max-width: 576px) {
    box-shadow: none;
  }
}
</style>
