<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <el-container>
      <NavBar style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box" ref="NavBar"></NavBar>
      <TagsBar v-show="isShowNavBar" style="position:absolute;top:50px;left:0;right:0;height: 30px" v-if="true" ref="TagsBar"></TagsBar>
      <div style="position:absolute;top:50px;left:0;right:0;bottom: 0;overflow-x: hidden" ref="Content">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </el-container>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import TagsBar from 'src/views/layout/TagsBar';
  import NavBar from 'src/views/layout/NavBar';
  import mutation from 'src/store/mutation-types';

  export default {
    name: 'Home',
    components: {
      TagsBar,
      NavBar,
    },
    data() {
      return {
        timer: true,
        isShowNavBar: false,
      };
    },
    created() {
      this.$nextTick(() => {//初始化时设置高度
        if (this.isShowNavBar) {
          this.$refs.Content.style.top = Number(this.$refs.Content.style.top.replace('px', '')) + this.$refs.TagsBar.$el.offsetHeight + 'px';
        }
        this.setContentHeight(window.innerHeight - this.$refs.NavBar.$el.offsetHeight - this.$refs.TagsBar.$el.offsetHeight);
        this.setContentWidth(window.innerWidth);
      });
      window.onresize = () => {//窗口大小改变设置高度，限制更新频率
        if (this.timer) {
          if (isShowNavBar) {
            this.$refs.Content.style.top = Number(this.$refs.Content.style.top.replace('px', '')) + this.$refs.TagsBar.$el.offsetHeight + 'px';
          }
          this.setContentHeight(window.innerHeight - this.$refs.NavBar.$el.offsetHeight - this.$refs.TagsBar.$el.offsetHeight);
          this.setContentWidth(window.innerWidth);
          setTimeout(() => {
            this.timer = true;
          }, 16);
        }
      };
    },
    methods: {
      ...mapMutations({
        setContentHeight: mutation.SET_CONTENT_HEIGHT,
        setContentWidth: mutation.SET_CONTENT_WIDTH,
      }),
    },

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
