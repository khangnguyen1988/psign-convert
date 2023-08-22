<template>
  <span :class="{
    'dark-red': document.status === 'CANCELLED',
    'green': document.status === 'DONE',
    'light-blue': document.status === 'NEW',
    'orange': waitingForMyTurn,
  }" class="document-status">
     <span v-if="document.status === 'CANCELLED'">
        {{$t('document.canceledDocument')}}
    </span>
    <span v-if="document.status === 'DONE'">
        {{$t('document.completedDocument')}}
    </span>
    <span v-if="document.status === 'NEW'">
        {{$t('document.draft')}}
    </span>
    <span v-if="waitingForMyTurn">
        {{$t('document.documentWaitingForSigning')}}
    </span>
    <span v-if="(document.status === 'IN_PROGRESS' || document.status === 'SUBMIT') && !waitingForMyTurn">
        {{$t('document.documentWaitingForAnotherToSign')}}
    </span>
  </span>
</template>
<script>

export default {
  name: 'DocumentStatus',
  props: {
    document: {
      type: Object
    }
  },
  computed: {
    iHaveSigned () {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      let idx = -1
      if (currentUser && this.document.signed_persons) {
        idx = this.document.signed_persons.findIndex(p => p && p.user_id && p.user_id.user && p.user_id.user.id === currentUser.user_id && p.signed_at)
      }
      return idx > -1
    },
    waitingForMyTurn () {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      let isMyTurn = false
      if (currentUser && this.document.signed_persons) {
        const currentIndex = this.document.current_index
        const currentSignedPerson = this.document.signed_persons[currentIndex - 1]
        isMyTurn = currentSignedPerson && currentSignedPerson.user_id && currentSignedPerson.user_id.user &&
          currentSignedPerson.user_id.user.id === currentUser.user_id && !currentSignedPerson.signed_at
      }
      return (this.document.status === 'IN_PROGRESS' || this.document.status === 'SUBMIT') && isMyTurn
    }
  },
  mounted () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      const companyId = currentUser.company.company_id || currentUser.company.id
      this.appendParams = {
        user_id: currentUser.user_id,
        company_id: companyId,
        status_doc_array: status
      }
    }
  }
}
</script>

<style lang="scss">
.document-status {
  border-radius: 4px;
  padding: 0.25rem 1.5em .25rem 1.25rem;
  background: #CAE0FF;
  display: inline-block;
  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #063F8F;
    margin-right: 4px;
  }
}
.document-status.green {
  background: #DFF3E7;
  &:before {
    background: #49BF7A;
  }
}
.document-status.orange {
  background: #FAEEED;
  &:before {
    background: #F97567;
  }
}
.document-status.dark-red {
  background: #FAEEED;
  &:before {
    background: #B06DB1;
  }
}
.document-status.light-blue {
  background: #EFF8FE;
  &:before {
    background: #8EB1C9;
  }
}
</style>
