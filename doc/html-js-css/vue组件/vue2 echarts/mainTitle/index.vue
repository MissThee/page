<template>
  <div class="main-title">
    <div v-if="line" class="main-title__line"/>
    <div class="main-title__title">{{ title }}</div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "mainTitle",
  props: {
    title: String,
    line: Boolean
  }
}
</script>


<style scoped lang="scss">
.main-title {
  display: flex;
  align-items: center;
  color: #687284;
  font-size: 16px;
  font-weight: bold;
  font-family: "PingFang SC", PingFangSC-Regular, SimHei, 'HeiTi', '黑体', "Microsoft YaHei", sans-serif;

  &__line {
    width: 3px;
    min-height: 1.1em;
    margin-right: 0.5em;
    flex-shrink: 0;
    background-color: #687284;
  }

  &__title {

  }
}
</style>
