<template>
  <div class="app-autocomplete-search-result">
    <ul>
      <li v-if="state.collection.length === 0">
        {{ $t("app.emptyResult") }}
      </li>
      <template v-if="state.collection.length !== 0">
        <li

          :class="{
          selected: isSelectedItem(item),
          active: index === state.activeIndex
        }"
          v-for="(item, index) in state.collection"
          @click="selectItem($event, item, index)"
        >
          {{ state.renderItemText(item) }}
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'

let closeSearchResultTimeout = null

export default {
  name: 'AppAutocompleteSearchResult',
  props: {},
  computed: {
    ...mapState({
      state: state => state.autoCompleteSearchResult
    })
  },
  data () {
    return {
      currentTargetElement: null
    }
  },
  created () {
    const body = document.querySelector('body')
    body.removeEventListener('click', this.onClickBody)
    body.addEventListener('click', this.onClickBody)
    this.$bus.on('close-autocomplete-search-result', this.hideSearchResult)
    this.$bus.on('show-autocomplete-search-result', this.showSearchResult)
  },
  methods: {
    hideSearchResult () {
      closeSearchResultTimeout = setTimeout(() => {
        const searchResultBox = document.querySelector(
          '.app-autocomplete-search-result'
        )
        searchResultBox.style.display = 'none'
      }, 250)
    },
    showSearchResult ({ domRect, targetElement }) {
      const top = domRect.top + domRect.height + 5
      const left = domRect.left
      const width = domRect.width - 2
      const searchResultBox = document.querySelector(
        '.app-autocomplete-search-result'
      )
      searchResultBox.setAttribute('target-element', targetElement)
      searchResultBox.style.display = 'inline-block'
      searchResultBox.style.top = `${top}px`
      searchResultBox.style.left = `${left}px`
      searchResultBox.style.width = `${width}px`
      this.currentTargetElement = targetElement
    },
    onClickBody (event) {
      const isClickOnSearchResultControl = event.target.closest(
        '.app-autocomplete-search-result'
      )
      const isClickOnAutoCompleteControl = event.target.closest(
        `#${this.currentTargetElement}`
      )
      if (
        isClickOnSearchResultControl ||
        isClickOnAutoCompleteControl ||
        document.activeElement ===
          document.querySelector(`#${this.currentTargetElement} input`)
      ) {
        clearTimeout(closeSearchResultTimeout)
        return
      }

      this.hideSearchResult()
    },
    isSelectedItem (item) {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        return false
      }
      // eslint-disable-next-line eqeqeq
      return (
        this.selectedItems.findIndex(
          selectedItem =>
            selectedItem.id === item.id || selectedItem.value === item.value
        ) > -1
      )
    },
    selectItem ($event, item, index) {
      this.$bus.emit('autocomplete-select-item', {
        $event,
        item,
        index,
        targetElement: this.currentTargetElement
      })
    }
  },
  components: {}
}
</script>
