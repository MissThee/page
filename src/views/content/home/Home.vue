<template>
  <div style="margin:10px 10%;text-align: center">
    <div style="max-width: 1000px;display: inline-block;width: 100%">
      <mark-down-area v-if="canShow" :file-url="fileUrl"></mark-down-area>
    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/views/common/MarkDownArea';
  import HomeApi from 'src/api/home-api';
  import Global from 'src/utils/global';

  export default {
    name: 'HomePage',
    components: {
      MarkDownArea
    },
    data() {
      return {
        canShow: false,
        fileUrl: '',
      };
    },
    created() {
      HomeApi.getFileFromGithub({ url: Global.GITHUB_API_HOST + '/repos/' + Global.USER + '/' + Global.REPOSITORY + '/contents' + Global.HOME_PAGE })
        .then(({ data }) => {
          this.fileUrl = data.download_url;
          this.canShow = true;
        });
    }
  };
</script>

<style scoped>
</style>
