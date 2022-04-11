<template>
  <div class="drop-list">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DropList',
};
</script>

<style lang="less" scoped>
.drop-list {
  position: absolute;
  top: calc(100% + 4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid lightgrey;
  background-color: #fff;
  border-radius: 4px;
}
</style>
