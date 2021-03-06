<template>
  <div class="suggest-field">
    <label for="suggest">{{ label }}</label>
    <div class="suggest-field__wrap">
      <div v-for="(item, i) in selectedSuggests" :key="i" class="suggest-field__selected-item">
        @{{ item[aliasKey] }}
        <button class="suggest-field__remove-btn">
          <img src="/icons/close.png" alt="">
        </button>
      </div>
      <input
        v-if="!selectedMaxCount"
        v-model="searchSubstr"
        ref="input"
        :placeholder="placeholder"
        type="text"
        class="suggest-field__input"
        id="suggest"
      >
    </div>

    <template v-if="selectedMaxCount && maxCount > 1">Выбрано макс. кол-во элементов</template>
    <template v-if="error">{{ error }}</template>

    <DropList v-if="dropOpened || loading">
      <template v-if="loading">Загрузка...</template>
      <component
        v-else
        :is="suggestComponent"
        ref="suggests"
        v-for="suggest in suggests"
        :key="suggest[aliasKey]"
        v-bind="suggest"
        @click.native="selectSuggest(suggest)"
        tabindex="0"
      />
    </DropList>
  </div>
</template>

<script>
import debounce from 'lodash-es/debounce';
import api from '../api';
import DropList from './DropList.vue';

const MIN_CHARS_FOR_REQUEST = 3;
const canAbort = typeof AbortController === 'function';

export default {
  name: 'SuggestField',
  components: {
    DropList,
  },
  props: {
    label: String,
    placeholder: String,
    suggestComponent: { type: Object, required: true },
    aliasKey: { type: String, default: 'alias' },
    maxCount: { type: Number, default: Infinity },
    urlTemplate: {
      type: String,
      default: 'https://habr.com/kek/v2/publication/suggest-mention?q={{substr}}',
    },
  },
  data() {
    return {
      searchSubstr: '',
      suggests: [],
      selectedSuggests: [{ alias: 'test' }],
      highlightedEl: null,
      dropOpened: false,
      debouncedFetchSuggests: () => {},
      apiController: null,
      loading: false,
      error: '',
    };
  },
  computed: {
    selectedMaxCount() {
      return this.selectedSuggests.length >= this.maxCount;
    },
  },
  watch: {
    searchSubstr() {
      this.error = '';

      if (this.searchSubstr.length >= MIN_CHARS_FOR_REQUEST) {
        this.debouncedFetchSuggests();
        return;
      }

      this.apiController?.abort();
      this.debouncedFetchSuggests.cancel();
    },
  },
  methods: {
    async fetchSuggests() {
      if (canAbort) {
        this.apiController?.abort();
        this.apiController = new AbortController();

        const result = await api.get(
          this.urlTemplate.replace('{{substr}}', this.searchSubstr),
          { signal: this.apiController.signal },
        );

        this.parseResponse(result);
        return;
      }

      const result = await api.get(this.urlTemplate.replace('{{substr}}', this.searchSubstr));
      this.parseResponse(result);
    },
    parseResponse(result) {
      if (!Array.isArray(result)) {
        this.error = result.name === 'AbortError' ? '' : result.message;
        return;
      }

      this.suggests = result;
      this.openDrop();
    },
    openDrop() {
      if (!this.suggests.length || this.selectedMaxCount) return;

      this.dropOpened = true;
      document.addEventListener('keydown', this.keydownHandler);
    },
    closeDrop() {
      this.dropOpened = false;
      document.removeEventListener('keydown', this.keydownHandler);
    },
    selectSuggest(suggest) {
      if (this.selectedSuggests.includes(suggest)) return;

      this.selectedSuggests.push(suggest);
      this.$emit('change', this.selectedSuggests);

      if (this.selectedMaxCount) {
        this.searchSubstr = '';
      }
    },
    keydownHandler(e) {
      const keys = ['ArrowDown', 'ArrowUp', 'Enter'];
      if (!keys.includes(e.key)) return;

      if (!this.highlightedEl) {
        this.highlightedEl = this.$refs.suggests?.[0]?.$el;
        this.highlightedEl.focus();
        return;
      }

      if (e.key === 'ArrowDown') {
        const nextEl = this.highlightedEl.nextElementSibling;

        if (!nextEl) return;

        this.highlightedEl = nextEl;
        nextEl.focus();
      }

      if (e.key === 'ArrowUp') {
        const prevEl = this.highlightedEl.previousElementSibling;

        if (!prevEl) {
          e.preventDefault();
          this.$refsinput.focus();
          return;
        }

        this.highlightedEl = prevEl;
        prevEl.focus();
      }

      if (e.key === 'Enter') {
        this.highlightedEl.click();
      }
    },
  },
  created() {
    this.debouncedFetchSuggests = debounce(this.fetchSuggests, 300);
  },
};
</script>

<style lang="less" scoped>
.suggest-field {
  position: relative;

  &__wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    width: 100%;
    padding: 4px;
    border: 1px solid lightgrey;
    border-radius: 4px;
  }

  &__selected-item {
    display: flex;
    align-items: center;
    padding: 4px 0px 4px 6px;
    color: #484848;
    background-color: lightblue;
    border-radius: 2px;
    cursor: default;
  }

  &__remove-btn {
    display: flex;
    padding: 4px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
    }
  }

  &__input {
    flex-grow: 1;
    padding: 8px;
    border: none;
    outline: none;
  }
}
</style>
