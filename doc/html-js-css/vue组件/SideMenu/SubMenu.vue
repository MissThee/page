<template>
  <div class="sub-menu">
    <template v-if="data?.children">
      <!--     本菜单 没有 重定向，则为普通展开菜单       -->
      <el-sub-menu v-if="!data.redirect" :key="data.name" :index='data.path'>
        <template #title>
          <template v-if="data._level===1">
            <div class="level2-dot"/>
          </template>
          <template v-else-if="data.meta.icon">
            <img v-if="Assets[data.meta.icon]" class="icon" :src='Assets[data.meta.icon]' alt=''/>
          </template>
          <div v-else class="icon"/>
          <span>{{ data.meta?.title }}</span>
        </template>

        <!-- 递归创建子级内容 -->
        <SubMenu v-for="child in data.children" :data="{...child||{},_level:(data._level||0)+1}" :key="child.path"/>
      </el-sub-menu>
      <!--     本菜单 有 重定向，则为跳转菜单，无法展开       -->
      <template v-else>
        <el-menu-item :key="data.name" :index="data.redirect">
          <template v-if="data._level===1">
            <div class="level2-dot"/>
          </template>
          <template v-else-if="data.meta.icon">
            <img v-if="Assets[data.meta.icon]" class="icon" :src='Assets[data.meta.icon]' alt=''/>
          </template>
          <div v-else class="icon"/>
          <span>{{ data.meta?.title }}</span>
        </el-menu-item>
      </template>
    </template>
    <!--     无子菜单       -->
    <el-menu-item v-else :key="data.name" :index="data.path">
      <template v-if="data._level===1">
        <div class="level2-dot"/>
      </template>
      <div v-else-if="!data._level" class="icon"/>
      {{ data.meta?.title }}
    </el-menu-item>
  </div>
</template>

<script setup lang="ts">

import * as Assets from "home/layouts/BasicLayout/components/SideMenu/assets";
import {MenuDataItem} from "home/layouts/BasicLayout/typings";

const props = withDefaults(defineProps<{
  data?: MenuDataItem
}>(), {})
</script>

<style scoped lang="less">
.sub-menu {

}
</style>