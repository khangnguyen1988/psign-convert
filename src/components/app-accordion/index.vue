<template>
  <div :class="{'open': isOpen}" class="collapsible-list">
    <header @click="isOpen = !isOpen">
      <strong>
        {{ title }}
      </strong>
      <i :class="{'fa-chevron-up': isOpen, 'fa-chevron-down': !isOpen }" class="fa"></i>
    </header>
    <div class="content">
      <ul>
        <li @click="$emit('on-click-item', {item, index})" :class="{'selected' : selectedIndex === index}" v-for="(item, index) in items">
          <slot name="item-template" v-bind="{item, index}"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AppAccordion',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    selectedIndex: {
      type: Number,
      default: 0,
      required: false
    },
    items: {
      type: Array,
      default: [],
      required: true
    }
  },
  computed: {
    displayText () {
      return this.value || this.textDescription
    }
  },
  data () {
    return {
      isOpen: true
    }
  },
  created () {
    this.value = this.text
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.collapsible-list {
  width: 100%;

  header {
    padding: .25rem .5rem;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--gray-100);
    &:hover {
      cursor: pointer;
    }
  }

  .content {
    display: none;

    ul, li {
      margin: 0;
    }

    ul {
      padding: 0;
    }

    li {
      padding: 0.25rem 0.5rem;
      border-bottom: 1px solid var(--gray-50);
      border-left: 1px solid var(--gray-50);
      border-right: 1px solid var(--gray-50);
      list-style: none;
      &:hover, &.selected {
        background: var(--gray-50);
        cursor: pointer;
      }
    }
  }

  &.open {
    .content {
      display: block;
    }
  }
}

</style>
