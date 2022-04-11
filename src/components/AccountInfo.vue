<template>
  <div class="account-info">
    <div class="account-info__avatar-wrap">
      <img
        :src="account.avatar || '/icons/no-photo.png'"
        alt=""
        class="account-info__avatar"
      >
    </div>
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
  gap: 8px;
  align-items: center;
  padding: 16px;

  &__avatar-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
  }

  &__avatar {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
