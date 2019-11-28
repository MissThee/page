<template>

  <div style="text-align: center">
    <el-form style="width: 400px;text-align: left;margin:10px auto;padding:10px;border:1px solid #cccccc;border-radius: 5px">
      <el-form-item>
        <el-button type="primary" size="mini" plain @click="loginGithubHandler">登录github</el-button>
        <span>（跨域问题不能使用）</span>
      </el-form-item>
    </el-form>
    <el-form style="width: 400px;text-align: left;margin:10px auto;padding:10px;border:1px solid #cccccc;border-radius: 5px">
      <el-form-item label="手动设置token">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" plain @click="loginGithubHandler(false)">1、获取code</el-button>
      </el-form-item>
      <el-form-item>
        <a :href="getTokenUrl" target="_blank">
          <el-button type="primary" size="mini" plain>2、获取token</el-button>
        </a>
        <el-input v-model="getTokenUrl" placeholder="url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" plain @click="setAuthToken">3、设置access_token值</el-button>
        <el-input v-model="token" :placeholder="tokenPlaceHolder"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="false" style="width: 400px;text-align: left;margin:10px auto;padding:10px;border:1px solid #cccccc;border-radius: 5px">
      <el-form-item>
        <el-button type="danger" size="mini" plain @click="delCookie">清除授权信息</el-button>
      </el-form-item>
    </el-form>
    <el-form inline style="width: 400px;text-align: left;margin:10px auto;padding:10px;border:1px solid #cccccc;border-radius: 5px">
      <el-form-item>
        <el-button type="primary" size="mini" plain @click="setRepository">设置仓库</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="repository" :placeholder="repositoryPlaceHolder"></el-input>
      </el-form-item>
    </el-form>
    <el-form inline style="width: 400px;text-align: left;margin:10px auto;padding:10px;border:1px solid #cccccc;border-radius: 5px">
      <el-form-item>
        <el-button type="primary" size="mini" plain @click="setDocRoot">设置根目录</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="docRoot" :placeholder="docRootPlaceHolder"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Global from 'src/utils/global';
  import AuthApi from 'src/api/auth-api';
  import Cookie from 'src/utils/cookies';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Setting',
    data() {
      return {
        client_id: Global.APP.client_id,
        scope: Global.APP.scope,
        getTokenUrl: '',
        token: '',
        tokenPlaceHolder: 'access_token 值',
        repository: '',
        repositoryPlaceHolder: Global.DEFAULT_REPOSITORY,
        docRoot: '',
        docRootPlaceHolder: Global.DEFAULT_DOC_ROOT,
      };
    },
    created() {
      if (Cookie.isManualLogin.getIsManualLogin() !== 'true') {
        this.getAuthToken();
      } else {
        this.getTokenUrl = 'https://github.com/login/oauth/access_token?client_id=' + Global.APP.client_id + '&client_secret=' + Global.APP.client_secret + '&code=' + this.getAllUrlParams().code;
      }
    },
    activated() {
      this.initSavedValue();
    },
    methods: {
      loginGithubHandler(autoLogin) {
        Cookie.isManualLogin.setIsManualLogin(autoLogin ? 'false' : 'true');
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + this.client_id + '&scope=' + this.scope;
      },
      initSavedValue() {
        this.tokenPlaceHolder = Cookie.token.getTokenValue();
        this.repositoryPlaceHolder = Cookie.repository.getRepositoryValue();
        this.docRootPlaceHolder = Cookie.docRoot.getDocRootValue();
      },
      setAuthToken() {
        this.setUser({});

        let value = this.token === '' ? this.tokenPlaceHolder : this.token;
        Cookie.token.setTokenValue(value);
        AuthApi.getUserInfo()
          .then(({ data }) => {
            this.setUser(data);
            this.$notify({
              type: 'success',
              title: '设置成功',
            });
            this.tokenPlaceHolder = Cookie.token.getTokenValue();
            // window.location.href = window.location.href.split('?')[0];
          });
      },
      setRepository() {
        let value = this.repository === '' ? this.repositoryPlaceHolder : this.repository;
        Cookie.repository.setRepositoryValue(value);
        this.$notify({
          type: 'success',
          title: '设置成功',
        });
      },
      setDocRoot() {
        let value = this.docRoot === '' ? this.docRootPlaceHolder : this.docRoot;
        Cookie.docRoot.setDocRootValue(value);
        this.$notify({
          type: 'success',
          title: '设置成功',
        });
      },
      getAuthToken() {
        let code = this.getAllUrlParams().code;
        if (code) {
          AuthApi.getAccessToken({ code: code })
            .then((result) => {
              if (result && result.access_token) {
                Cookie.token.setTokenValue(result.access_token);
                window.location.href = window.location.search.slice(1)
                  .split('?')[0];
              }
            })
            .catch((error) => {
              Cookie.isManualLogin.setIsManualLogin('true');
              this.$notify({
                type: 'warning',
                title: '因跨域问题，需手动设置token'
              });
              // if (error.response) {
              //   // The request was made and the server responded with a status code
              //   // that falls out of the range of 2xx
              //   console.log(error.response.data);
              //   console.log(error.response.status);
              //   console.log(error.response.headers);
              // } else if (error.request) {
              //   // The request was made but no response was received
              //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              //   // http.ClientRequest in node.js
              //   console.log('request', error.request);
              // } else {
              //   // Something happened in setting up the request that triggered an Error
              //   console.log('Error', error.message);
              // }
              // console.log('config', error.config);
            });
        }
      },
      getAllUrlParams(url) {
        // 用JS拿到URL，如果函数接收了URL，那就用函数的参数。如果没传参，就使用当前页面的URL
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        // 用来存储我们所有的参数
        var obj = {};
        // 如果没有传参，返回一个空对象
        if (!queryString) {
          return obj;
        }
        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];
        // 将参数分成数组
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
          // 分离成key:value的形式
          var a = arr[i].split('=');
          // 将undefined标记为true
          var paramName = a[0];
          var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
          // 如果调用对象时要求大小写区分，可删除这两行代码
          paramName = paramName.toLowerCase();
          if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
          // 如果paramName以方括号结束, e.g. colors[] or colors[2]
          if (paramName.match(/\[(\d+)?\]$/)) {
            // 如果paramName不存在，则创建key
            var key = paramName.replace(/\[(\d+)?\]/, '');
            if (!obj[key]) obj[key] = [];
            // 如果是索引数组 e.g. colors[2]
            if (paramName.match(/\[\d+\]$/)) {
              // 获取索引值并在对应的位置添加值
              var index = /\[(\d+)\]/.exec(paramName)[1];
              obj[key][index] = paramValue;
            } else {
              // 如果是其它的类型，也放到数组中
              obj[key].push(paramValue);
            }
          } else {
            // 处理字符串类型
            if (!obj[paramName]) {
              // 如果如果paramName不存在，则创建对象的属性
              obj[paramName] = paramValue;
            } else if (obj[paramName] && typeof obj[paramName] === 'string') {
              // 如果属性存在，并且是个字符串，那么就转换为数组
              obj[paramName] = [obj[paramName]];
              obj[paramName].push(paramValue);
            } else {
              // 如果是其它的类型，还是往数组里丢
              obj[paramName].push(paramValue);
            }
          }
        }
        return obj;
      },
      delCookie() {
        var keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
          for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); // 清除当前域名下的,例如：m.ratingdog.cn
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString(); // 清除当前域名下的，例如 .m.ratingdog.cn
            document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString(); // 清除一级域名下的或指定的，例如 .ratingdog.cn
          }
        }
        Cookie.token.removeTokenValue();
      },
      ...mapActions(['setUser'])
    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
        contentWidth: 'getContentWidth',
        getUser: 'getUser'
      }),
    },
  };
</script>

<style scoped>

</style>
