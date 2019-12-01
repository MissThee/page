<template>
  <div style="position:absolute;height: 100%;width:100%;min-width: 650px;">
      <NavBar style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box" ref="NavBar"></NavBar>
      <div style="position:absolute;top:50px;bottom:0;left:0;right:0;overflow-x: hidden" ref="Content">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
  </div>
</template>

<script>
  import NavBar from 'src/docviewer/views/layout/NavBar/index';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Home',
    components: {
      NavBar,
    },
    data() {
      return {
        timer: true,
        repositoryInfo: this.getUser,
      };
    },
    created() {
      this.$nextTick(() => {//初始化时设置高度
        this.setHeightAndWidth();
        this.initCurrentUserInfo();
      });
      window.onresize = () => {//窗口大小改变设置高度，限制更新频率
        if (this.timer) {
          this.setHeightAndWidth();
          this.timer = false;
          setTimeout(() => {
            this.timer = true;
          }, 16);
        }
      };
    },
    methods: {
      initCurrentUserInfo() {
        this.$refs.NavBar.setGithubUserInfo(this.getUser);
      },
      setHeightAndWidth() {
        // console.log('不用nameSpace', this.$store.getters.getText);//module不配置nameSpace:true时可使用此属性，配置后不能再这样调用，属性变为user/getText
        // console.log('使用nameSpace', this.$store.getters['user/getText']);
        this.setContentHeight(window.innerHeight - this.$refs.NavBar.$el.offsetHeight);
        this.setContentWidth(window.innerWidth);
      },
      ...mapActions({
        setContentHeight: 'layout/setContentHeight',//区分module需要在module中配置nameSpace:true
        setContentWidth: 'layout/setContentWidth'
      })
    },
    computed: {
      ...mapGetters({
        getContentHeight: 'layout/getContentHeight',//区分module需要在module中配置nameSpace:true
        getContentWidth: 'layout/setContentWidth',
        getUser: 'user/getUser',
        getText: 'user/getText'
      }),
    },
    watch: {
      getUser(value) {
        this.$refs.NavBar.setGithubUserInfo(value);
      }
    }
  };
</script>

<style scoped>


  /*切换效果fade-xxx*/
  .fade-enter {
    opacity: 0;
    transform: translateX(10px);
  }

  .fade-enter-active {
    transition: all .3s;
  }

  .fade-leave-active {
    transition: all .3s;
    opacity: 0;
    transform: translateX(10px);
  }

</style>
