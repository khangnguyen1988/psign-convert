<template>
  <div :id="autoCompleteContainerId" class="autocomplete-container" :class="{'size-s': inputSize.toLowerCase() === 's'}">
    <app-search-box
      :id="appSearchBoxId"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="searchText"
      @clear="clear"
      @search="search"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      :size="inputSize"
    ></app-search-box>
    <div class="autocomplete-loading-bar" :class="{'loading-bar' : loading}"></div>
    <div style="display: flex; position: absolute; top: 3px;  width:100%; left: 2px; justify-content: center; align-items: center" v-if="localValue">
      <div @click="setFocus" class="autocomplete-value">
        <span>
             {{renderItemText(localValue)}}
        </span>
        <i v-if="!disabled" @click="clear" class="fal fa-times-circle"></i>
      </div>
    </div>
  </div>

</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppSearchBox from '@/components/app-search-box'

export default {
  name: 'AppAutocomplete',
  props: {
    value: [Object, String],
    placeholder: String,
    renderItemText: {
      type: Function,
      default: item => item.text
    },
    fetchSuggestions: Function,
    displayAttribute: {
      type: String,
      default: 'text'
    },
    suggestions: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minSearchTextLength: {
      type: Number,
      default: 1
    },
    maxSuggestionItems: {
      type: Number,
      default: 25
    },
    inputSize: {
      type: String,
      default: 'S'
    }
  },
  computed: {
    deplay () {
      return typeof this.fetchSuggestions === 'function' ? 250 : 50
    },
    ...mapState({
      activeIndex: state => state.autoCompleteSearchResult.activeIndex
    })
  },
  data () {
    return {
      loading: false,
      autoCompleteContainerId: '',
      appSearchBoxId: '',
      searchText: '',
      localSuggestions: [],
      localValue: null,
      searchTimeout: null
    }
  },
  created () {
    const id = Math.floor(Math.random() * 10000) + 1
    this.autoCompleteContainerId = `autocomplete-container-${id}`
    this.appSearchBoxId = `app-search-box-${id}`
    this.localSuggestions = this.suggestions
    this.localValue = this.value
    this.setAutoCompletedOptions({
      collection: this.localSuggestions
    })
    this.$bus.on('autocomplete-select-item', this.selectItem)
  },
  beforeDestroy () {
    this.$bus.off('autocomplete-select-item', this.selectItem)
  },
  methods: {
    ...mapActions(['setAutoCompletedOptions']),
    setFocus () {
      document.querySelector(`#${this.appSearchBoxId}`).focus()
    },
    selectItem ({ $event, item, targetElement }) {
      if (targetElement !== this.autoCompleteContainerId) {
        return
      }
      this.$emit('selected', $event, item)
      this.$emit('input', item)
      this.localValue = item
      this.$bus.emit('close-autocomplete-search-result')
      document.querySelector(`#${this.appSearchBoxId}`).focus()
    },
    onKeydown ($event) {
      if ($event.key === 'Tab') {
        this.blur()
      }
      if (this.localValue) {
        $event.preventDefault()
        $event.stopPropagation()
      }
    },
    onKeyup ($event) {
      if ($event.key === 'Backspace' && this.localValue) {
        this.clear()
      }
      if ($event.key === 'ArrowDown') {
        if (this.activeIndex < this.localSuggestions.length - 1) {
          this.setAutoCompletedOptions({
            activeIndex: this.activeIndex + 1
          })
        }
      }
      if ($event.key === 'ArrowUp') {
        if (this.activeIndex > 0) {
          this.setAutoCompletedOptions({
            activeIndex: this.activeIndex - 1
          })
        }
      }
      if ($event.key === 'Enter') {
        this.$emit('enter', $event, this.localSuggestions[this.activeIndex])
        this.selectItem({
          $event,
          item: this.localSuggestions[this.activeIndex],
          index: this.activeIndex,
          targetElement: this.autoCompleteContainerId
        })
      }
      this.$emit('keyup', $event, this.localSuggestions[this.activeIndex])
    },
    blur () {
      this.$bus.emit('close-autocomplete-search-result')
      document.querySelector(`#${this.appSearchBoxId}`).blur()
    },
    search (searchText) {
      this.setAutoCompletedOptions({
        activeIndex: -1
      })
      this.$emit('input', null)
      if (typeof this.fetchSuggestions === 'function') {
        this.handleRemoteSearch(searchText)
      } else {
        // eslint-disable-next-line no-useless-escape
        const standalizeSearchText = text => text.replace(/[-:\[\];\(\)]/g, '').replace(/\s+/g, ' ')
        this.localSuggestions = this.suggestions.filter(i => new RegExp(standalizeSearchText(searchText), 'i').test(standalizeSearchText(i[this.displayAttribute])))
          .slice(0, this.maxSuggestionItems)
        this.setAutoCompletedOptions({
          collection: this.localSuggestions
        })
      }
    },
    handleRemoteSearch (searchText) {
      if (!searchText) {
        this.clear()
        return
      }
      if (searchText.length < this.minSearchTextLength) {
        this.$nextTick(() => {
          this.clear()
        })
        return
      }
      this.loading = true
      this.fetchSuggestions(searchText).then((suggestions) => {
        this.$nextTick(() => {
          this.localSuggestions = suggestions.slice(0, this.maxSuggestionItems)
          let collection = suggestions.slice(0, this.maxSuggestionItems)
          if (collection.length === 0) {
            collection = [{ isEmpty: true }]
          }
          this.setAutoCompletedOptions({
            collection
          })
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
      })
    },
    clear () {
      this.$emit('input', null)
      this.searchText = ''
      this.localSuggestions = this.suggestions || []
      this.localValue = null
      this.setAutoCompletedOptions({
        activeIndex: -1,
        collection: this.localSuggestions || []
      })
    },
    onFocusIn () {
      this.setAutoCompletedOptions({
        activeIndex: -1,
        collection: this.localSuggestions || []
      })
      this.showSearchResult()
    },
    onFocusOut ($event) {
      this.$bus.emit('close-autocomplete-search-result')
      this.$emit('focusout', $event)
    },
    showSearchResult () {
      this.$bus.emit('show-autocomplete-search-result', {
        domRect: this.$el.getClientRects()[0],
        targetElement: this.autoCompleteContainerId
      })
      this.setAutoCompletedOptions({
        renderItemText: this.renderItemText
      })
    }
  },
  components: {
    AppSearchBox
  },
  watch: {
    suggestions (newVal) {
      this.localSuggestions = newVal
    },
    localValue (newVal) {
      if (!newVal) {
        if (document.activeElement === document.getElementById(this.appSearchBoxId)) {
          this.showSearchResult()
        }
      } else {
        this.$bus.emit('close-autocomplete-search-result')
      }
    }
  }
}
</script>

<style scoped>

  .suggestion-list .nav-item {
    cursor: pointer;
    font-size: 0.9rem;
    color: #009fe3;
    width: 100%;
    padding: 0.3rem;
  }
  .suggestion-list .nav-item.selected, .suggestion-list .nav-item:hover{
    border-radius: 4px;
    box-shadow: 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
    color: #fff;
  }
  .suggestion-list .nav-item:hover{
    background: rgba(0, 159, 227, 0.7);
  }
  .suggestion-list .nav-item.selected{
    background: #009fe3;
  }
</style>
