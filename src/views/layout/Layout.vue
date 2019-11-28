<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <el-container>
      <NavBar style="position:absolute;top:0;left:0;width:100%;height: 50px;border-bottom:1px solid #BFBFBF;overflow: hidden;box-sizing: border-box" ref="NavBar"></NavBar>
      <TagsBar v-show="isShowNavBar" style="position:absolute;top:50px;left:0;right:0;height: 30px" v-if="true" ref="TagsBar"></TagsBar>
      <div style="position:absolute;top:50px;bottom:0;left:0;right:0;overflow-x: hidden" ref="Content">
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
  import AuthApi from 'src/api/auth-api';
  import { setToken } from 'src/utils/cookies';

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
        this.setHeightAndWidth();
        {
          let code = this.getAllUrlParams().code;
          console.log("code  code code",code)
          if (code) {
            AuthApi.getAccessToken({ code: code })
              .then((result) => {
                console.log("result result ",result)
                setToken(result.access_token);
              });
          }
        }
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
      setHeightAndWidth() {
        if (this.isShowNavBar) {
          this.$refs.Content.style.top = Number(this.$refs.Content.style.top.replace('px', '')) + this.$refs.TagsBar.$el.offsetHeight + 'px';
        }
        this.setContentHeight(window.innerHeight - this.$refs.NavBar.$el.offsetHeight - this.$refs.TagsBar.$el.offsetHeight);
        this.setContentWidth(window.innerWidth);
      },
      ...mapMutations({
        setContentHeight: mutation.SET_CONTENT_HEIGHT,
        setContentWidth: mutation.SET_CONTENT_WIDTH,
      }),
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
      }
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
