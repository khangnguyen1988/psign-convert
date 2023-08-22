<template>
    <header class="app-header">
      <span class="title">{{companyName}}</span>
      <a id="btn-notification" class="app-functions no-background" title="Notification" href="javascript:">
        <i class="far fa-bell">
          <span v-if="unreadNotification > 0" class="badge badge-light">{{unreadNotification}}</span>
        </i>
      </a>
      <b-popover
        custom-class="notification-container-popover"
        target="btn-notification"
        placement="bottom"
        triggers="click focus"
      >
        <div class="notification-container">
          <div class="notification-item" :class="{'unread': !notification.read}"  v-for="(notification, index) in notifications" @click="onClickNotificationItem(notification)">
            <div class="d-flex">
              <div class="content">
                <h5 class="title">{{notification.title === 'NOTIFICATION_CONFIRM_PAID' ? $t('invoice.invoicePayout'): $t('invoice.invoiceSharing')}}</h5>
                <p class="desc">{{notification.title}}</p>
              </div>
              <div class="actions">
                <i v-if="notification.read" @click="markAsNotificationItem($event, {notification_id: notification.id, value: false})" class="fal fa-check-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </b-popover>

      <b-dropdown size="sm" offset="-170"  variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <a class="app-functions" href="javascript:"><i class="fas fa-user"></i></a>
        </template>
        <b-dropdown-item href="#" @click="openModal('user-profile-modal')"><i class="far fa-user-circle"></i> {{$t('user.userProfile')}}</b-dropdown-item>
        <b-dropdown-item href="#" @click="openModal('user-list-modal')"><i class="fal fa-user-cog"></i>  {{$t('user.userManagement')}}</b-dropdown-item>
        <b-dropdown-item href="#" @click="openModal('group-list-modal')"><i class="fal fa-users"></i>  {{$t('group.group')}}</b-dropdown-item>
        <!-- <b-dropdown-item href="#" @click="openModal('digital-certificate-modal')"><i class="fal fa-file-certificate"></i>Chứng thư số</b-dropdown-item> -->
        <b-dropdown-item href="#" @click="onChangeLanguage()"><i class="fal fa-language"></i>{{langText}}</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item href="#" @click="logout()"><i class="fal fa-sign-out-alt"></i>{{$t('app.logout')}}</b-dropdown-item>
      </b-dropdown>
    </header>
</template>

<script>
import AppAutoComplete from '@/components/app-autocomplete/'
import AppForm from '@/components/app-form/'

import AppSearchBox from '@/components/app-search-box/'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AppHeader',
  data () {
    return {
      schema: [
        {
          name: 'text',
          placeholder: `${this.$t('app.enter')} ${this.$t('text')}`,
          fetchSuggestions: searchText => new Promise((resolve) => {
            setTimeout(() => {
              resolve([
                { name: `${searchText} 1`, value: '1' },
                { name: `${searchText} 2`, value: '2' },
                { name: `${searchText} 2`, value: '3' },
                { name: `${searchText} 4`, value: '4' },
                { name: `${searchText} 5`, value: '5' }
              ])
            }, 500)
          }),
          type: 'autocomplete'
        }
      ],
      formModel: {
        text: ''
      },
      searchText: '',
      isDisplayNavBar: false,
      selectedItem: null,
      leftToRight: true,
      companyName: 'My Company'
    }
  },
  created () {
    const body = document.querySelector('body')
    body.removeEventListener('click', this.onClickBody)
    body.addEventListener('click', this.onClickBody)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      this.companyName = currentUser.company.name
    }
    this.getNotifications()
  },
  computed: {
    langText () {
      return this.$i18n.locale === 'vi' ? this.$t('app.english') : this.$t('app.vietnamese')
    },
    ...mapState([
      'unreadNotification',
      'notifications',
      'appNavbarDisplay',
      'selectedDirectories'
    ])
  },
  methods: {

    onClickBody (event) {
      const isClickOnPopover = event.target.closest('.notification-container-popover')
      const isClickOnNotificationIcon = event.target.closest('#btn-notification')
      if (isClickOnPopover || isClickOnNotificationIcon) {
        return
      }
      this.$root.$emit('bv::hide::popover', 'btn-notification')
    },
    ...mapActions(['setState', 'getNotifications', 'markAsRead']),
    markAsNotificationItem ($event, payload) {
      $event.preventDefault()
      $event.stopPropagation()
      this.markAsRead(payload)
    },
    onChangeLanguage () {
      this.$i18n.locale = this.$i18n.locale === 'vi' ? 'en' : 'vi'
      localStorage.setItem('lang', this.$i18n.locale)
      window.location.reload()
    },
    onClickNotificationItem () {

    },
    onClickBar () {
      this.setState({
        appNavbarDisplay: !this.appNavbarDisplay
      })
    },
    onClickReport () {
      this.$modal.show('report-statistics-modal', { model: { selectedDirectories: this.selectedDirectories } })
    },
    onClickDirectory () {
      this.$modal.show('app-directory-modal', { model: {} })
    },
    openListRuleModal () {
      this.$modal.show('rule-list-modal', { model: {} })
    },
    openModal (modalName, params) {
      this.$modal.show(modalName, { model: params })
    },
    doSearch () {
      // console.log(searchText);
    },
    onSubmit () {

    },
    logout () {
      this.$store.dispatch('auth/logout')
      window.location.reload()
    },
    onClear () {

    }
  },
  components: {
    AppSearchBox,
    AppForm,
    AppAutoComplete
  }
}
</script>

<style>
  .app-header .dropdown-menu .dropdown-item {
    display: flex;
    align-items: center;
  }
</style>
