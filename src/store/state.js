export default {
  appLoaded: false,
  appNavbarDisplay: true,
  navbar: {
    isCollapsed: false,
    myDocuments: {
      isCollapsed: false,
      isActive: true
    },
    managedDocuments: {
      isCollapsed: false,
      isActive: true
    },
    documents: {
      isCollapsed: false,
      isActive: true
    },
    signatures: {
      isCollapsed: true,
      isActive: false
    },
    customers: {
      isCollapsed: true,
      isActive: false
    },
    vendors: {
      isCollapsed: true,
      isActive: false
    }
  },
  autoCompleteSearchResult: {
    isMultiSelect: false,
    activeIndex: -1,
    selectedItems: [],
    collection: [],
    renderItemText: item => item.text
  },
  notifications: [],
  unreadNotification: 0,
  documentCount: {
    total_itsturn: 0,
    total_signed: 0,
    total_all: 0,
    total_added_persons: 0,
    total_not_added_persons: 0,
    total_draft: 0
  },
  tags: [],
  users: [],
  groups: []
}
