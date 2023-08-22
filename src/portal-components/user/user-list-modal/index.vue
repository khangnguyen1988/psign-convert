<template>
  <app-modal name="user-list-modal"
             @before-open="beforeOpen"
             :title="title"
             width="70%"
             hide-footer>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 mb-4 text-right">
          <button class="btn btn-primary" @click="createUser()">{{$t('user.createUser')}}</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <app-table
            :filter="true"
            :pagination="true"
            ref="table"
            :api-mode="false"
            :data="users"
            :fields="fields"
          >
            <div slot="action" slot-scope="props">

              <button class="btn btn-outline-primary btn-sm pb-0 pt-0 mr-1"
                      :title="'Edit'"
                      @click="onClickEdit(props.rowData)">
                <i class="fal fa-pen" aria-hidden="true"></i>
              </button>
              <button v-if="currentUser.user_id !== props.rowData.user.id" class="btn btn-danger btn-sm pb-0 pt-0"
                      :title="'Delete'"
                      @click="onClickDelete(props.rowData)">
                <i class="fal fa-fw fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </app-table>
          <user-modal  name="robotics-user-modal" @on-ok="onOk"></user-modal>
        </div>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapState } from 'vuex'
import EsignUserProxy from '@/store/proxies/e-sign-user-proxy'
import AppModal from '@/components/app-modal/'
import AppTable from '@/components/app-table/'
import UserModal from './robotics-user-modal'

export default {
  name: 'UserListModal',
  components: {
    AppModal,
    AppTable,
    UserModal
  },
  data () {
    return {
      users: [],
      title: null,
      fields: [
        {
          name: 'user.id',
          title: 'user.id'
        },
        {
          name: 'name',
          title: 'user.name'
        },
        {
          name: 'phone',
          title: 'user.phone'
        },
        {
          name: 'user.email',
          title: 'user.email'
        },
        {
          name: 'esignrole.role',
          title: 'user.role',
          callback: (role) => {
            if (role === 'ESIGN_ROLE_ADMIN') {
              return 'Quản trị viên'
            }
            if (role === 'ESIGN_ROLE_GENERAL') {
              return 'Nhân viên'
            }
            return role
          }
        },
        {
          name: '__slot:action',
          titleClass: 'text-sm-right',
          dataClass: 'text-sm-right',
          title: 'app.action'
        }
      ]
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    beforeOpen () {
      this.title = this.$t('user.roboticUsers')
      new EsignUserProxy().getUsers().then((response) => {
        this.users = response
      })
    },
    createUser () {
      this.$modal.show('robotics-user-modal', {
        model: {}
      })
    },
    onClickEdit (user) {
      this.$modal.show('robotics-user-modal', {
        model: user
      })
    },
    onClickDelete (model) {
      const vm = this
      this.$modal.show('dialog', {
        title: this.$t('app.delete'),
        text: this.$t('app.areyousure'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          new EsignUserProxy().deleteUser({ id: model.user.id }).then(() => {
            vm.users = vm.users.filter(u => u.user.id !== model.user.id)
          })
        }
      })
    },
    onOk () {
      new EsignUserProxy().getUsers().then((response) => {
        this.users = response
        this.$refs.table.reload()
      })
    }
  }
}
</script>
