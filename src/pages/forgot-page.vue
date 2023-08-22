<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="container">
      <div v-if="!isSuccess" class="row">
        <div class="col-12 text-center mb-5">
          <img class="logo" src="/images/logo.png" alt="PVS Logo">
        </div>
        <div class="col-12">
          <div class="card login-card">
            <div class="card-body">
              <h3 class="mb-4">{{$t('user.forgotPassword')}}</h3>
              <b-alert :show="serverErrors.length" variant="danger">
                <ul>
                  <li> {{serverErrors}} </li>
                </ul>
              </b-alert>
              <app-form
                ref="form"
                @on-submit="onSubmit"
                :schema="schema"
                :layout="layout"
                :data="formModel"
              />
              <div class="row">
                <div class="col-12 d-flex justify-content-md-between">
                  <router-link to="login">
                    <i class="fal fa-arrow-left pr-1"></i> {{$t('user.loginPage')}}
                  </router-link>
                  <button class="btn btn-primary" @click="onClickReset()">{{$t('app.reset')}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isSuccess" class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h3>{{$t('user.passwordHasReset')}}</h3>
              <p>{{$t('user.checkEmailForNewPass')}}</p>
              <div class="text-center">
                <router-link to="login">
                  <button class="btn btn-primary">{{$t('user.backToLoginPage')}}</button>
                </router-link>
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
  name: 'ForgotPage',
  data () {
    return {
      isSuccess: false,
      schema: [
        {
          name: 'email',
          label: 'Email',
          placeholder: `${this.$t('app.enter')} ${this.$t('user.email')}`,
          type: 'input',
          validation: 'required|email'
        }
      ],
      formModel: {
        email: ''
      },
      serverErrors: []
    }
  },
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    onClickReset () {
      this.$refs.form.submit()
    },
    onSubmit (formData) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.forgotPassword(formData.email).then(() => {
            this.isSuccess = true
          })
        }
      })
    }
  },
  components: {
    AppForm
  }
}
</script>
<style scoped>
.container {
  width: 600px;
  margin-top: 5rem;
}
.logo {
  height: 80px;
}
.card-body {
  padding: 1.5rem 2rem 2rem 2rem;
}
.btn {
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
