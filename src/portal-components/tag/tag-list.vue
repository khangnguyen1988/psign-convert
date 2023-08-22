<template>
  <div>
    <div class="tag-header">
      <!-- <span class="tag-text">Nhãn</span> -->
      <app-search-box
        v-model="filterText"
        :placeholder="$t('tag.search')"
        @clear="resetFilter"
        @search="doFilter"
      />
      <span>
        <a @click="onClickAddTag" href="javascript:" class="tag-icon">
          <i class="fal fa-plus"></i>
        </a>
      </span>
    </div>
    <div class="tag-list">
      <router-link
        v-for="tag in tags"
        :key="tag.value"
        class="tag-item"
        :class="{ active: !!activeTag && tag.value === activeTag.id }"
        :to="{ name: 'document-tagging', params: { tag: tag.value } }"
        title="Văn bản gắn nhãn"
      >
        <svg
          width="18"
          height="13"
          viewBox="0 0 18 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :fill="getColor(tag.text)"
            d="M0.798359 11.007C0.881292 11.2026 1.00127 11.3803 1.15169 11.5303C1.30626 11.6864 1.49033 11.8103 1.69318 11.8947C1.89604 11.9791 2.11364 12.0224 2.33336 12.022H12.3334C12.5809 12.022 12.815 11.912 12.9742 11.7228L17.1409 6.7228C17.3984 6.41364 17.3984 5.96447 17.1409 5.6553L12.9742 0.655301C12.815 0.465302 12.5809 0.355301 12.3334 0.355301H2.33336C2.11515 0.354298 1.89891 0.396656 1.6972 0.479914C1.49549 0.563172 1.31233 0.685673 1.15836 0.840302C1.00221 0.994874 0.878338 1.17894 0.793934 1.38179C0.70953 1.58465 0.666279 1.80225 0.666693 2.02197V10.3553C0.666693 10.577 0.710026 10.7928 0.798359 11.007Z"
          />
        </svg>
        <span>{{ tag.text }}</span>
        <b-dropdown
          v-if="!readonly"
          size="sm"
          offset="-110"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template #button-content>
            <i class="fal fa-ellipsis-v"></i>
          </template>
          <b-dropdown-item href="#" @click="onClickEdit(tag)">
            <i class="far fa-edit pr-2"></i
            >{{ $t("app.edit") }}</b-dropdown-item
          >
          <b-dropdown-item href="#" @click="onClickDelete(tag)"
            ><i class="fal fa-trash pr-2"></i
            >{{ $t("app.delete") }}</b-dropdown-item
          >
        </b-dropdown>
      </router-link>
      <!--    <div @click="onClick(tag)" v-for="tag in tags" :key="tag.value" :class="{'active': !!activeTag && tag.value === activeTag.id}"  class="tag-item">

    </div>-->
    </div>
  </div>
</template>

<script>
import { getColor } from '@/utils/document'
import { mapActions } from 'vuex'
import AppSearchBox from '@/components/app-search-box'

export default {
  name: 'TagList',
  components: {
    AppSearchBox
  },
  props: {
    tags: Array,
    activeTag: {},
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterText: ''
    }
  },
  computed: {},
  methods: {
    ...mapActions(['deleteTag']),
    onClick (tag) {
      if (this.activeTag && tag.value === this.activeTag.id) {
        return
      }
      this.$emit('on-click', tag)
    },
    getColor (tagName) {
      return getColor(tagName)
    },
    onClickEdit (tag) {
      this.$modal.show('tag-modal', {
        model: { id: tag.value, name: tag.text }
      })
    },
    onClickDelete (tag) {
      this.$modal.show('dialog', {
        title: this.$t('tag.deleteTag'),
        text: this.$t('tag.deleteTagConfirmMsg'),
        okText: this.$t('app.delete'),
        okClass: 'btn-danger',
        onOk: () => {
          this.deleteTag(tag.value)
        }
      })
    },
    onClickAddTag () {
      this.$modal.show('tag-modal', { model: {} })
    },
    doFilter (filterText) {
      this.$emit('filter-set-tag', filterText)
    },
    resetFilter () {
      this.$emit('filter-reset-tag')
    }
  }
}
</script>
