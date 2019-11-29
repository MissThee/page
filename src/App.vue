<template>
  <div id="app" style="height: 100%;">
      <transition :name="transitionName" mode="in-out">
        <router-view/>
      </transition>
    </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        transitionName: ''
      };
    },
    created() {
      console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    },
    watch: {
      $route(to, from) {
        if (to.path === '/' && from.path === '/') {
          this.transitionName = 'show-animate';
        } else if (to.path === '/home' && from.path === '/') {
          this.transitionName = 'login-animate';
        } else if (to.path === '/') {
          this.transitionName = 'logout-animate';
        } else {
          this.transitionName = '';
        }
      }
    }
  };
</script>
<style scoped>
  .login-animate-leave-active {
    animation: fade-in 0.4s reverse;
  }

  .logout-animate-enter-active {
    animation: fade-in 0.4s;
  }

  .show-animate-enter-active {
    animation: fade-in 0.4s;
  }

  /*@keyframes slide-up {*/
  /*  0% {*/
  /*    transform: translateY(0)*/
  /*  }*/
  /*  100% {*/
  /*    transform: translateY(-100%)*/
  /*  }*/
  /*}*/

  @keyframes fade-in {
    0% {
      opacity: 0.0;
      transform: scale(1.2)
    }
    100% {
      opacity: 1;
      transform: scale(1)
    }
  }
</style>
