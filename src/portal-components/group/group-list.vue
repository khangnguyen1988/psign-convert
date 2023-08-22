<template>
  <app-modal name="group-list-modal"
             @before-open="beforeOpen"
             :title="title"
             width="70%"
             hide-footer>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 mb-4 text-right">
          <button class="btn btn-primary" @click="create()">{{$t('group.createGroup')}}</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <app-table
            :filter="true"
            :pagination="true"
            ref="table"
            :api-mode="false"
            :data="groups"
            :fields="fields"
          >
            <template v-slot:member="props">
              {{props.rowData.user_id.length}}
            </template>
            <template v-slot:action="props">
              <button class="btn btn-outline-primary btn-sm pb-0 pt-0"
                      :title="'Edit'"
                      @click="onClickEdit(props.rowData)">
                <i class="fal fa-pen" aria-hidden="true"></i>
              </button>
              <button class="btn btn-danger btn-sm pb-0 pt-0"
                      :title="'Delete'"
                      @click="onClickDelete(props.rowData)">
                <i class="fal fa-fw fa-trash" aria-hidden="true"></i>
              </button>
            </template>
          </app-table>
        </div>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppModal from '@/components/app-modal/'
import AppTable from '@/components/app-table/'

export default {
  name: 'GroupListModal',
  components: {
    AppModal,
    AppTable
  },
  data () {
    return {
      title: null,
      fields: [
        {
          name: 'id',
          title: 'group.id'
        },
        {
          name: 'name',
          title: 'group.name'
        },
        {
          name: '__slot:member',
          title: 'group.member'
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
    ...mapState([
      'groups'
    ])
  },
  beforeDestroy () {
    this.$bus.off('close-group-modal', this.onCloseGroupModal)
  },
  created () {
    this.$bus.on('close-group-modal', this.onCloseGroupModal)
  },
  methods: {
    ...mapActions(['getGroups', 'updateGroup', 'createGroup', 'deleteGroup']),
    beforeOpen () {
      this.title = this.$t('group.group')
      this.getGroups()
    },
    create () {
      this.$modal.show('group-modal', {
        model: {}
      })
    },
    onClickEdit (group) {
      this.$modal.show('group-modal', {
        model: group
      })
    },
    onClickDelete (model) {
      this.$modal.show('dialog', {
        title: this.$t('app.delete'),
        text: this.$t('app.areyousure'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          this.deleteGroup(model.id).then(() => {
            this.$refs.table.reload()
          })
        }
      })
    },
    onCloseGroupModal () {
      this.getGroups().then(() => {
        this.$refs.table.reload()
      })
    }
  }
}
</script>
