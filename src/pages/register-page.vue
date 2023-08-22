<template>
  <div class="full-screen-container d-flex justify-content-center">
    <div class="register-container">
      <div v-if="!isSuccess" class="row">
        <div class="col-12 text-center mb-5">
          <img class="logo" src="/images/logo.png" alt="PVS Logo">
        </div>
        <div class="col-12">
          <div class="card login-card">
            <div class="card-body">
              <h3 class="mb-4">{{$t('user.createNewAcc')}}</h3>
              <b-alert :show="!!serverErrors" variant="danger">
                <ul>
                  <li>{{serverErrors}} </li>
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
                  <button class="btn btn-primary" @click="onClickRegister()">{{$t('user.register')}}</button>
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
              <h3>{{$t('user.accCreated')}}</h3>
<!--              <p>{{$t('user.checkEmailActiveAcc')}}</p>-->
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
  name: 'RegisterPage',
  data () {
    return {
      isSuccess: false,
      layout: {
        'div.row': {
          'div.col-md-6': {
            'div.row': {
              'div.col-md-12': {
                field: 'email'
              },
              'div.col-md-12:1': {
                field: 'password'
              }
            }
          },
          'div.col-md-6:1': {
            'div.row': {
              'div.col-md-12:2': {
                field: 'tax_code'
              },
              'div.col-md-12:3': {
                field: 'phone'
              }
            }
          }
        }
      },
      schema: [
        {
          name: 'email',
          label: this.$t('user.email'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.email')}`,
          type: 'input',
          validation: 'required|email'
        },
        {
          name: 'password',
          label: this.$t('user.password'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.password')}`,
          type: 'input',
          inputType: 'password',
          validation: 'required'
        },
        {
          name: 'phone',
          label: this.$t('user.phone'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.phone')}`,
          type: 'input',
          validation: 'required'
        },
        {
          name: 'tax_code',
          label: this.$t('user.taxCode'),
          placeholder: `${this.$t('app.enter')} ${this.$t('user.taxCode')}`,
          type: 'input',
          validation: 'required'
        }
      ],
      formModel: {
        email: '',
        password: '',
        name: '',
        phone: '',
        company_name: '',
        company_full_name: '',
        tax_code: '',
        company_address: ''
      },
      serverErrors: ''
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    onClickRegister () {
      this.$refs.form.submit()
    },
    onSubmit (formData) {
      this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.serverErrors = ''
          this.register(formData).then(() => {
            this.isSuccess = true
            setTimeout(() => {
              this.$router.push({
                name: 'login'
              })
            }, 3000)
          }).catch((e) => {
            this.serverErrors = e.detail
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
.register-container {
  width: 800px;
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
