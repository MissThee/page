<template>
  <div class='aside'>
    <div class="header">
      <router-link :to='{path: "/hello"}' class="title">
        <img :src='Assets.logo' class="title__logo" alt=''/>
      </router-link>
    </div>
    <div class="side-menu">
      <el-scrollbar>
        <div style="height: 18px"></div>
        <el-menu ref='menuRef' :default-active='defaultActive' router unique-opened>
          <SubMenu v-for="item in menuDataShow" :data="item" :key="item.path"/>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SideBar",
}
</script>
<script lang="ts" setup>
import {MenuDataItem} from "../../typings";

import {nextTick, ref, watch} from "vue";
import * as Assets from './assets'
import SubMenu from "home/layouts/BasicLayout/components/SideMenu/SubMenu.vue";
import {useRoute} from "vue-router";

const route = useRoute()
const props = withDefaults(defineProps<{
  menuData: MenuDataItem[],
}>(), {
  menuData: () => [],
})
const menuRef = ref()
const menuDataShow = ref<MenuDataItem[]>([])
const defaultActive = ref<string>(route.path);

watch(route, (newVal) => {
  defaultActive.value = newVal.path
}, {immediate: true})

watch(() => props.menuData, ()=>{
  menuDataShow.value = JSON.parse(JSON.stringify(props.menuData))
}, {immediate: true})


</script>
<style scoped lang="less">
.aside {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 210px;
  overflow: hidden;

  &--collapse {
    width: 64px;
  }

  .header {
    .title {
      font-size: 20px;
      font-weight: 500;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;

      &__logo {
        margin: 15px 24px;
      }

      &__text {
        margin-left: 8px;

        &--collapse {
          display: none;
        }
      }
    }
  }

  :deep(.side-menu) {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .icon {
      display: inline-block;
      width: 17px;
      margin-right: 13px;
    }
  }

  :deep(.el-menu) {
    border-right: none;

    .level2-dot {
      display: inline-block;
      flex-shrink: 0;
      width: 4px;
      height: 4px;
      background-color: #666666;
      border-radius: 50%;
      margin-right: 8px
    }

    .el-sub-menu {
      // ----- 写死的三级菜单 背景色 -----
      .el-menu-item {
        background-color: #eef2f7;
      }

      .el-sub-menu {
        .el-sub-menu__title {
          background-color: #eef2f7;
        }

        .el-menu-item {
          background-color: #dbe4ef
        }
      }

      // ---------------------------------

      & .is-active { //有选中的节点，父级颜色改变
        .el-sub-menu__title {
          color: #054A9A;
          font-weight: bold;

          .level2-dot {
            background-color: #054A9A;
          }
        }
      }
    }

    .el-menu-item {
      margin-left: 0;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #666666;

      &.is-active {
        background-color: var(--el-color-primary) !important;
        color: #fff;

        .level2-dot {
          background-color: white;
        }
      }
    }

    .el-sub-menu__title {
      font-weight: 500;
      height: 47px;
      line-height: 47px;
      color: #333333;
      font-size: 14px;
    }
  }

}
</style>
