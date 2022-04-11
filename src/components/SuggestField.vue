<template>
  <div class="suggest-field">
    <label for="suggest">sss</label>
    <div class="suggest-field__wrap">
      <input type="text" v-model="search" class="suggest-field__input" id="suggest">
    </div>

    <DropList>

    </DropList>
  </div>
</template>

<script>
import DropList from './DropList.vue';

export default {
  name: 'UserInput',
  components: {
    DropList,
  },
  data() {
    return {
      search: '',
    };
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
