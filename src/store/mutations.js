import {
  TOGGLE_NAVBAR,
  HIDE_SIDEBAR,
  ACTIVE_NAVBAR_GROUP,
  TOGGLE_NAVBAR_GROUP_ITEMS,
  SET_STATE,
  GET_NOTIFICATIONS,
  MARK_READ_NOTIFICATION,
  GET_TAGS,
  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG, GET_USERS,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  GET_GROUPS
} from './mutation-types'

export default {
  [TOGGLE_NAVBAR] (state) {
    state.navbar.isCollapsed = !state.navbar.isCollapsed
  },
  [HIDE_SIDEBAR] (state) {
    state.navbar.isCollapsed = true
  },
  [ACTIVE_NAVBAR_GROUP] (state, selectedGroup) {
    Object.keys(state.navbar).forEach((k) => {
      const group = state.navbar[k]
      if (typeof group === 'object') {
        group.isActive = false
      }
    })
    state.navbar[selectedGroup].isActive = true
    state.navbar[selectedGroup].isCollapsed = false
    state.navbar = {
      ...state.navbar
    }
  },
  [TOGGLE_NAVBAR_GROUP_ITEMS] (state, selectedGroup) {
    state.navbar[selectedGroup].isCollapsed = !state.navbar[selectedGroup].isCollapsed
  },
  [SET_STATE] (state, payload) {
    Object.keys(payload).forEach((k) => {
      state[k] = payload[k]
    })
  },
  [GET_NOTIFICATIONS] (state, payload) {
    state.notifications = payload
    state.unreadNotification = state.notifications.filter(n => n.read === 0).length
  },
  SET_AUTOCOMPLETE_OPTIONS (state, payload) {
    state.autoCompleteSearchResult = Object.assign(state.autoCompleteSearchResult, payload)
  },
  [MARK_READ_NOTIFICATION] (state, payload) {
    const idx = state.notifications.findIndex(n => n.id === payload.notification_id)
    state.notifications[idx].read = payload.value
    state.unreadNotification = state.notifications.filter(n => !n.read).length
  },
  DOCUMENT_COUNT (state, payload) {
    state.documentCount = {
      ...payload
    }
  },
  [GET_TAGS] (state, payload) {
    state.tags = payload.map(i => ({ text: i.name, value: i.id }))
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  [GET_USERS] (state, payload) {
    state.users = payload.map(i => ({ text: i.name, value: i.user.id }))
    localStorage.setItem('users', JSON.stringify(state.users))
  },
  [CREATE_TAG] (state, payload) {
    state.tags = [
      ...state.tags,
      { text: payload.name, value: payload.id }
    ]
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  [GET_GROUPS] (state, payload) {
    state.groups = payload
    localStorage.setItem('groups', JSON.stringify(state.groups))
  },
  [CREATE_GROUP] (state, payload) {
    state.groups = [
      ...state.groups,
      payload
    ]
    localStorage.setItem('groups', JSON.stringify(state.groups))
  },
  [UPDATE_TAG] (state, payload) {
    const idx = state.tags.findIndex(t => t.id === payload.id)
    if (idx > -1) {
      state.tags[idx] = payload
      state.tags = [
        ...state.tags
      ]
      localStorage.setItem('tags', JSON.stringify(state.tags))
    }
  },
  [UPDATE_GROUP] (state, payload) {
    const idx = state.groups.findIndex(t => t.id === payload.id)
    if (idx > -1) {
      state.groups[idx] = payload
      state.groups = [
        ...state.groups
      ]
      localStorage.setItem('groups', JSON.stringify(state.groups))
    }
  },
  [DELETE_TAG] (state, id) {
    state.tags = state.tags.filter(t => t.id !== id)
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  [DELETE_GROUP] (state, id) {
    state.groups = state.groups.filter(t => t.id !== id)
    localStorage.setItem('groups', JSON.stringify(state.groups))
  }
}
