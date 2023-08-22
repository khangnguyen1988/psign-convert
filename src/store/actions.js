import DocumentProxy from '@/store/proxies/document-proxy'
import TagProxy from '@/store/proxies/tag-proxy'
import EsignUserProxy from '@/store/proxies/e-sign-user-proxy'
import GroupProxy from '@/store/proxies/group-proxy'
import * as types from './mutation-types'

const onSuccess = (commit, resolve, actionType) => (result) => {
  commit(actionType, result)
  resolve(result)
}

export const setState = ({ commit }, payload) => {
  commit(types.SET_STATE, payload)
}

export const toggleNavbar = ({ commit }) => {
  commit(types.TOGGLE_NAVBAR)
}
export const hideSidebar = ({ commit }) => {
  commit(types.HIDE_SIDEBAR)
}

export const activeNavbarGroup = ({ commit }, payload) => {
  commit(types.ACTIVE_NAVBAR_GROUP, payload)
}

export const toggleNavbarGroupItems = ({ commit }, payload) => {
  commit(types.TOGGLE_NAVBAR_GROUP_ITEMS, payload)
}

export const setAutoCompletedOptions = ({ commit }, payload) => {
  commit('SET_AUTOCOMPLETE_OPTIONS', payload)
}

export const createDocument = ({ commit }, payload) => {
  commit('DOCUMENT_CREATE', payload)
}

export const countDocument = ({ commit }) => {
  new DocumentProxy().countByUser().then((res) => {
    commit('DOCUMENT_COUNT', res)
  })
}

export const getTags = ({ commit }) =>
  new Promise((resolve) => {
    new TagProxy().getTags().then(onSuccess(commit, resolve, types.GET_TAGS))
  })
export const deleteTag = ({ commit }, id) =>
  new Promise((resolve) => {
    new TagProxy().deleteTag(id).then(() => {
      commit(types.DELETE_TAG, id)
      resolve(id)
    })
  })

export const updateTag = ({ commit }, payload) =>
  new Promise((resolve) => {
    new TagProxy()
      .updateTag(payload)
      .then(onSuccess(commit, resolve, types.UPDATE_TAG))
  })
export const createTag = ({ commit }, payload) =>
  new Promise((resolve) => {
    new TagProxy()
      .createTag(payload)
      .then(onSuccess(commit, resolve, types.CREATE_TAG))
  })

export const getUsers = ({ commit }) =>
  new Promise((resolve) => {
    new EsignUserProxy().getUsers().then(onSuccess(commit, resolve, types.GET_USERS))
  })

export const getGroups = ({ commit }) =>
  new Promise((resolve) => {
    new GroupProxy().getGroups().then(onSuccess(commit, resolve, types.GET_GROUPS))
  })
export const updateGroup = ({ commit }, payload) =>
  new Promise((resolve) => {
    new GroupProxy()
      .updateGroup(payload)
      .then(onSuccess(commit, resolve, types.UPDATE_GROUP))
  })
export const createGroup = ({ commit }, payload) =>
  new Promise((resolve) => {
    new GroupProxy()
      .createGroup(payload)
      .then(onSuccess(commit, resolve, types.CREATE_GROUP))
  })

export const deleteGroup = ({ commit }, id) =>
  new Promise((resolve) => {
    new GroupProxy().deleteGroup(id).then(() => {
      commit(types.DELETE_GROUP, id)
      resolve(id)
    })
  })

export default {
  createDocument,
  setState,
  toggleNavbar,
  hideSidebar,
  toggleNavbarGroupItems,
  activeNavbarGroup,
  setAutoCompletedOptions,
  countDocument,
  createTag,
  updateTag,
  deleteTag,
  getTags,
  getUsers,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup
}
