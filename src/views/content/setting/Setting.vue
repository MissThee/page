<template>
  <div style="text-align: center">
    <a :href="'https://github.com/login/oauth/authorize?client_id='+client_id+'&scope='+scope" target="_self">
      <el-button>登录github</el-button>
    </a>
  </div>
</template>

<script>
  import Global from 'src/utils/global';

  export default {
    name: 'Setting',
    data() {
      return {
        client_id: Global.APP.client_id,
        scope: Global.APP.scope,
      };
    }
  };
</script>

<style scoped>

</style>
