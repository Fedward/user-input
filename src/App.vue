<template>
  <div id="app">
    <SuggestField
      :suggest-component="AccountInfo"
    />
  </div>
</template>

<script>
import SuggestField from './components/SuggestField.vue';
import AccountInfo from './components/AccountInfo.vue';

export default {
  name: 'App',
  components: {
    SuggestField,
  },
  data() {
    return {
      AccountInfo,
    };
  },
};
</script>

<style lang="less">
#app {
  max-width: 600px;
  margin-top: 60px;
  margin-right: auto;
  margin-left: auto;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
