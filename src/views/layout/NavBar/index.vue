<template>
  <el-header ref="header">
    <div style="float:left;">
      <breadcrumb></breadcrumb>
    </div>
    <div style="float:right;margin-top: 5px">
      <div title="前往github" style="height: 40px;background-color:#FFFFFF;border:1px solid #CCCCCC;cursor:pointer;border-radius: 4px;overflow: hidden">
        <a :href="'https://github.com/'+Global.USER+'/'+Global.REPOSITORY">
          <div style="float: left;height: 40px">
            <img v-show="shouldShowUserAvatar" :src="repositoryInfo.owner.avatar_url" height="40" width="40" alt="头像">
            <svg v-show="!shouldShowUserAvatar" height="40" width="40" viewBox="0 0 16 16" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </div>
          <div style="float: right;font-weight: bold;line-height:40px;height: 40px;font-size: 15px;padding:0 5px;color:black">{{repositoryInfo.owner.login}}</div>
        </a>
      </div>
    </div>
    <div style="float:right;margin: 5px 20px 0 0;">
      <router-link class="link-button" to="/home">
        <el-button>主页</el-button>
      </router-link>
      <router-link class="link-button" to="/">
        <el-button>文档</el-button>
      </router-link>
    </div>
  </el-header>
</template>

<script>
  import LayoutApi from 'src/api/layout-api';
  import Breadcrumb from 'src/views/layout/NavBar/Breadcrumb';
  import Global from 'src/utils/global';

  export default {
    name: 'NavBar',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        Global: Global,
        shouldShowUserAvatar: false,
        repositoryInfo: {
          owner: {
            avatar_url: '',
            login: '',
          },
        },
      };
    },
    created() {
      this.initRepositoryInfo();
    },
    methods: {
      initRepositoryInfo() {
        LayoutApi.getRepositoryInfo()
          .then(({ data }) => {
            this.repositoryInfo = data;
            if (data.owner && data.owner.avatar_url) {
              this.shouldShowUserAvatar = true;
            }
          });
      },
    }
  };
</script>

<style scoped>
  .link-button {
    margin-right: 5px;
  }
</style>
