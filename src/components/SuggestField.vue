<template>
  <div class="suggest-field">
    <label for="suggest">sss</label>
    <div class="suggest-field__wrap">
      <input type="text" v-model="search" class="suggest-field__input" id="suggest">
    </div>

    <DropList v-if="suggests.length">
      <AccountInfo v-for="(suggest, i) in suggests" :key="i" :account="suggest" />
    </DropList>
  </div>
</template>

<script>
import api from '../api';
import DropList from './DropList.vue';
import AccountInfo from './AccountInfo.vue';

export default {
  name: 'UserInput',
  components: {
    DropList,
    AccountInfo,
  },
  data() {
    return {
      search: '',
      suggests: [],
    };
  },
  watch: {
    search() {
      if (this.search.length >= 3) {
        this.fetchSuggests();
      }
    },
  },
  methods: {
    async fetchSuggests() {
      const result = await api.getSuggests(this.search);
      this.suggests = result;
    },
  },
};
</script>

<style lang="less" scoped>
.suggest-field {
  position: relative;

  &__wrap {
    width: 100%;
    padding: 2px;
    border: 1px solid lightgrey;
  }
}
</style>
