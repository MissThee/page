<template>
  <div style="margin:10px 10%;text-align: center">
    <div style="max-width: 1000px;display: inline-block;width: 100%">
      <mark-down-area :file-path="filePath"></mark-down-area>
    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/views/common/MarkDownArea';

  export default {
    name: 'HomePage',
    components: {
      MarkDownArea
    },
    data() {
      return {
        filePath: '/home/home.md',
      };
    },
  };
</script>

<style scoped>
</style>
