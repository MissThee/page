<template>
  <div id="app" style="height: 100%;">
    <div>
      <div>HOME PAGE TEST!!!</div>
      <a href="/docviewer" target="_blank">docviewer</a>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {};
        },
        created() {
            console.log('process.env.NODE_ENV', process.env.NODE_ENV);
        },
    };
</script>
<style scoped>

</style>
