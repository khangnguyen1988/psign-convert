<template>
  <div>
    <main id="main-container" :class="{'sidebar-collapsed': navbar.isCollapsed}">
      <app-sidebar />
      <div class="right-main-content" >
        <div @click="toggleNavbar" :class="{'isCollapsed': navbar.isCollapsed}" class="expand-collapse-sidebar">
          <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_192_3268)">
              <circle cx="33" cy="28" r="17" fill="white"/>
            </g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.4115 22L29 28.2222L35.4115 34.4444L37 32.9028L32.1771 28.2222L37 23.5417L35.4115 22Z" fill="#003A8C"/>
            <defs>
              <filter id="filter0_d_192_3268" x="0" y="0" width="58" height="58" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-4" dy="1"/>
                <feGaussianBlur stdDeviation="6"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.4 0 0 0 0 0.537255 0 0 0 0 0.729412 0 0 0 0.7 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_192_3268"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_192_3268" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>
        <app-header />
        <div class="main-content">
          <router-view />
        </div>
      </div>
    </main>
    <app-autocomplete-search-result></app-autocomplete-search-result>

    <view-document-modal></view-document-modal>
    <document-upload-modal></document-upload-modal>
    <document-review-modal></document-review-modal>
    <document-approval-modal></document-approval-modal>
    <document-comment-modal></document-comment-modal>
    <document-checklist-modal></document-checklist-modal>
    <add-signed-person-modal></add-signed-person-modal>
    <add-signed-vendor-modal></add-signed-vendor-modal>
    <user-list-modal></user-list-modal>
    <user-profile-modal></user-profile-modal>
    <company-profile-modal></company-profile-modal>
    <signature-modal></signature-modal>
    <digital-signature-modal></digital-signature-modal>
    <digital-certificate-modal></digital-certificate-modal>
    <tag-modal></tag-modal>
    <group-list-modal></group-list-modal>
    <group-modal></group-modal>
    <user-subscription-modal></user-subscription-modal>

    <app-dialog></app-dialog>
    <div v-show="appLoaded" class="overlay">
      <div class="row">
        <div class="col-12 text-center">
          <i class="fal fa-spin">
            <i class="fal fa-circle-notch"></i>
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppHeader from '@/layouts/app-header'
import AppSidebar from '@/layouts/app-sidebar'
import AppFooter from '@/layouts/app-footer'
import AppDialog from '@/components/app-modal/confirm-dialog'
import AppAutocompleteSearchResult from '@/components/app-autocomplete/search-result'
import ViewDocumentModal from '@/portal-components/documents/view/view-document-modal'
import DocumentUploadModal from '@/portal-components/documents/create/document-upload-modal'
import DocumentReviewModal from '@/portal-components/documents/review/document-review-modal'
import DocumentApprovalModal from '@/portal-components/documents/document-approval-modal'
import DocumentCommentModal from '@/portal-components/documents/review/document-comment-modal'
import DocumentChecklistModal from '@/portal-components/documents/review/document-checklist-modal'
import AddSignedPersonModal from '@/portal-components/documents/create/add-signed-person-modal'
import AddSignedVendorModal from '@/portal-components/documents/create/add-signed-vendor-modal'
import UserListModal from '@/portal-components/user/user-list-modal'
import UserProfileModal from '@/portal-components/user/user-profile-modal'
import CompanyProfileModal from '@/portal-components/user/company-profile-modal'
import SignatureModal from '@/portal-components/signature/signature-modal'
import DigitalSignatureModal from '@/portal-components/signature/digital-signature-modal'
import DigitalCertificateModal from '@/portal-components/signature/digital-certificate-modal'
import TagModal from '@/portal-components/tag/tag-modal'
import GroupListModal from '@/portal-components/group/group-list'
import GroupModal from '@/portal-components/group/group-modal'
import UserSubscriptionModal from '@/portal-components/user/user-subscription-modal'

export default {
  name: 'AppLayout',
  data () {
    return {}
  },
  methods: {
    ...mapActions(['toggleNavbar']),
    logout () {
      this.$store.dispatch('auth/logout')
    }
  },
  mounted () {
    document.querySelector('body').focus()
    this.$bus.on('show-license', () => {
      this.$modal.show('user-subscription-modal', { model: {} })
    })
  },
  computed: {
    ...mapState([
      'navbar',
      'appLoaded'
    ])
  },
  components: {
    AppHeader,
    AppFooter,
    AppSidebar,
    AppDialog,
    AppAutocompleteSearchResult,
    DocumentUploadModal,
    DocumentReviewModal,
    DocumentApprovalModal,
    DocumentCommentModal,
    DocumentChecklistModal,
    AddSignedPersonModal,
    AddSignedVendorModal,
    UserListModal,
    UserProfileModal,
    CompanyProfileModal,
    SignatureModal,
    DigitalSignatureModal,
    ViewDocumentModal,
    DigitalCertificateModal,
    TagModal,
    GroupListModal,
    GroupModal,
    UserSubscriptionModal
  }
}
</script>
<style scoped lang="scss">
#main-container {
  display: flex;
}
.main-content {
  padding: 0 1rem 0 1.5rem;
  height: 92vh;
  overflow-y: scroll;
  @media screen and (max-width: 576px) {
    padding: 1rem .5rem;
  }
}
</style>
