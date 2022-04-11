<template>
  <div class="account-info">
    <img :src="account.avatar || '/assets/icons/close.png'" alt="" class="account-info__avatar">
    <div class="account-info__info">
      <div class="account-info__title">
        {{ account.name || account.alias }}
      </div>

      <div v-if="account.name || isCompany" class="account-info__subtitle">
        {{ isCompany ? 'Компания' : `@${account.alias}` }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo',
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isCompany() {
      return this.account.type === 'company';
    },
  },
};
</script>

<style lang="less" scoped>
.account-info {
  display: flex;
  gap: 4px;
  align-items: center;

  &__avatar {
    width: 30px;
    height: 30px;
  }
}
</style>
