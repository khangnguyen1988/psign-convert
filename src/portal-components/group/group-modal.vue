<template>
  <app-modal name="group-modal" :submit-on-enter="false" :title="title" @before-open="beforeOpen" @before-close="beforeClose"  width="30%" @on-ok="onOk">
    <app-form
      ref="formGroup"
      @on-submit="onSubmit"
      @on-input="onInput"
      :schema="schema"
      :layout="layout"
      :data="formModel"
    >
      <div slot="filter-users">
        <div class="form-group">
          <app-search-box
            :placeholder="$t('group.searchMember')"
            v-model="searchText"
            @clear="clear"
            @search="search"
            :size="'M'"
          ></app-search-box>
        </div>
      </div>

      <div slot="selected-users">
        <div class="form-group">
          <label>{{$t('group.member')}} ({{selectedUsers.length}})</label>
          <div style="height: 300px; overflow-y: auto" class="form-control">
            <div v-for="user in selectedUsers" :key="user.value" class="selected-user-item">
              <span>
                 <i v-if="user.role ==='ADMIN'" class="far fa-key pr-2"></i> {{user.text}}
              </span>
              <b-dropdown  size="sm" offset="-110"  variant="link" toggle-class="text-decoration-none" no-caret>
                <template #button-content>
                  <i class="fal fa-ellipsis-v"></i>
                </template>
                <b-dropdown-item  href="#" @click="onToggleRole(user)">
                  <i :class="{'fa-user': user.role === 'ADMIN', 'fa-key': user.role !== 'ADMIN' }" class="far fa-key pr-2"></i>
                  {{user.role ==='ADMIN' ?  $t('group.admin') : $t('group.member') }}
                </b-dropdown-item>
                <b-dropdown-item   href="#" @click="removeUser(user)"><i class="fal fa-trash pr-2"></i>{{$t('app.delete')}}</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>

      </div>
    </app-form>
  </app-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
import AppModal from '@/components/app-modal/'
import AppForm from '@/components/app-form/'
import AppSearchBox from '@/components/app-search-box/index'
import ToastUtils from '@/utils/toast'

export default {
  name: 'GroupModal',
  components: {
    AppSearchBox,
    AppForm,
    AppModal
  },
  data () {
    return {
      title: 'Tạo nhóm',
      searchText: '',
      schema: {
        name: {
          label: this.$t('group.name'),
          type: 'input',
          validation: 'required',
          placeholder: `${this.$t('app.enter')} ${this.$t('group.name')}`
        },
        user_id: {
          className: 'group-users',
          label: this.$t('document.addUserToGroup'),
          type: 'multi-checkbox',
          options: this.users,
          validation: 'required',
          placeholder: `${this.$t('app.enter')} ${this.$t('document.addUserToGroup')}`,
          itemDisplayBlock: true
        }
      },
      layout: {
        'div.row': {
          'div.col-md-12:0': {
            field: 'name'
          },
          'div.col-md-12:2': {
            slot: 'filter-users'
          },
          'div.col-md-12:1': {
            'div.row': {
              'div.col-md-6:1': {
                field: 'user_id'
              },
              'div.col-md-6:2': {
                slot: 'selected-users'
              }
            }
          }
        }
      },
      formModel: {
        name: '',
        user_id: []
      },
      selectedUsers: [],
      userRole: {}
    }
  },
  computed: {
    ...mapState([
      'users'
    ]),
    filteredUsers () {
      const searchText = this.searchText.toLowerCase()
      if (searchText && searchText.length > 2) {
        return this.users.filter(u => u.text.toLowerCase().indexOf(searchText) > -1)
      }
      return this.users
    }
  },
  methods: {
    ...mapActions(['getUsers', 'updateGroup', 'createGroup']),
    onSubmit (formModel) {
      const vm = this
      this.$refs.formGroup.validate().then(isValid => {
        if (!isValid) {
          return
        }
        if (this.selectedUsers.every(u => u.role === 'MEMBER')) {
          ToastUtils.showToast('error', 'Chọn người dùng làm quản trị nhóm!')
        } else {
          const members = this.users.filter(u => formModel.user_id.indexOf(u.value) > -1).map(u => ({ id: u.value, role: u.role }))
          const payload = {
            id: this.formModel.id,
            name: formModel.name,
            user_id: members
          }

          const action = this.formModel.id ? this.updateGroup : this.createGroup
          action(payload).then(() => {
            vm.$bus.emit('close-group-modal')
            vm.$modal.hide('group-modal', { isOk: true })
          })
        }
      })
    },
    onInput ($event, fieldChanged) {
      if (fieldChanged.name === 'user_id') {
        const SET_1ST_USER_AS_ADMIN = this.selectedUsers.length === 0
        this.selectedUsers = this.getSelectedUsers(fieldChanged.value, this.userRole)
        if (SET_1ST_USER_AS_ADMIN && this.selectedUsers.length > 0) {
          this.selectedUsers[0].role = 'ADMIN'
          this.userRole[this.selectedUsers[0].value] = 'ADMIN'
        }
      }
    },
    onToggleRole (user) {
      user.role = user.role === 'ADMIN' ? 'MEMBER' : 'ADMIN'
      this.userRole[user.value] = user.role
      this.selectedUsers = [
        ...this.selectedUsers
      ]
    },
    onOk () {
      this.$refs.formGroup.submit()
    },
    clear () {
      Vue.set(this.schema.user_id, 'options', this.filteredUsers)
    },
    search () {
      Vue.set(this.schema.user_id, 'options', this.filteredUsers)
    },
    removeUser (user) {
      const userIds = this.selectedUsers.filter(u => u.value !== user.value).map(u => u.value)
      this.$refs.formGroup.setFieldValue('user_id', userIds)
    },
    beforeClose () {
      this.formModel = {
        name: null,
        user_id: []
      }
      this.selectedUsers = []
    },
    getSelectedUsers (selectedIds, userRole) {
      const selectedUsers = this.users.filter(u => selectedIds.indexOf(u.value) > -1)
      selectedUsers.forEach(user => {
        user.role = userRole[user.value] || 'MEMBER'
      })
      return selectedUsers
    },
    beforeOpen (params) {
      this.title = params.model.id ? this.$t('document.editGroup') : this.$t('group.createGroup')
      this.getUsers().then(() => {
        Vue.set(this.schema.user_id, 'options', this.users)
        if (params.model.user_id) {
          params.model.user_id.forEach(u => {
            this.userRole[u.ID] = u.Role
          })
          const selectedUserIds = params.model.user_id.map(u => u.ID)
          this.formModel = {
            id: params.model.id,
            name: params.model.name,
            user_id: selectedUserIds
          }
          this.selectedUsers = this.getSelectedUsers(selectedUserIds, this.userRole)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .group-users .multi-checkbox{
    height: 300px;
    overflow-y: auto;
  }
  .selected-user-item {
    display: flex;
    align-items: center;
    background: #E6ECF4;
    margin-bottom: 12px;
    padding: 0 12px;
    border-radius: 16px;
    .dropdown-item {
      align-items: center;
      padding: .5rem .5rem .5rem 1rem;
    }
    span {
      font-size: 13px;
      color: #003A8C;
    }
    i {
      color: #003A8C;
    }
    .btn-group {
      margin-left: auto;
    }
  }
</style>
