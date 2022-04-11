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
        :placeholder="placeholder"
        type="text"
        class="suggest-field__input"
        id="suggest"
        @keydown.down="downHandler"
      >
    </div>

    <DropList v-if="suggests.length && !selectedMaxCount">
      <component
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

export default {
  name: 'UserInput',
  components: {
    DropList,
  },
  props: {
    label: String,
    placeholder: String,
    suggestComponent: { type: Object, required: true },
    aliasKey: { type: String, default: 'alias' },
    maxCount: { type: Number, default: Infinity },
  },
  data() {
    return {
      searchSubstr: '',
      suggests: [],
      selectedSuggests: [{ alias: 'test' }],
      debouncedFetchSuggests: () => {},
    };
  },
  computed: {
    selectedMaxCount() {
      return this.selectedSuggests.length >= this.maxCount;
    },
  },
  watch: {
    searchSubstr() {
      if (this.searchSubstr.length >= MIN_CHARS_FOR_REQUEST) {
        this.debouncedFetchSuggests();
      }
    },
  },
  methods: {
    async fetchSuggests() {
      const result = await api.getSuggests(this.searchSubstr);
      this.suggests = result;
    },
    selectSuggest(suggest) {
      if (this.selectedSuggests.includes(suggest)) return;

      this.selectedSuggests.push(suggest);
      this.$emit('selected', suggest);

      if (this.selectedMaxCount) {
        this.searchSubstr = '';
      }
    },
    downHandler() {
      console.log('te');
      this.$refs.suggests?.[0]?.$el.focus();
    },
  },
  created() {
    this.debouncedFetchSuggests = debounce(this.fetchSuggests, 500);
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
