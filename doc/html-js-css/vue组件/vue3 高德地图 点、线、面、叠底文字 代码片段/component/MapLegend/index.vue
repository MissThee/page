<template>
  <div class="map-legend">
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.circle,color:'#333'}).imgUrl" alt=""/>
      虫拜服务单
    </div>
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.triangle,color:'#333'}).imgUrl" alt=""/>
      星火服务单
    </div>
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.circle,color:'#333',icon:SVGIconPart.star}).imgUrl" alt=""/>
      工程师的家
    </div>
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.circle,color:'#333',icon:SVGIconPart.edit}).imgUrl" alt=""/>
      修改过的服务单
    </div>
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.circle,color:'#333',icon:SVGIconPart.person}).imgUrl" alt=""/>
      虫拜本人单
    </div>
    <div>
      <img class="icon" :src="buildIcon({bg:SVGBgPart.triangle,color:'#333',icon:SVGIconPart.person}).imgUrl" alt=""/>
      星火指定单
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "MapLegend"
}
</script>

<script setup lang="ts">

import {buildIcon, SVGBgPart, SVGIconPart} from "@/views/admin/wayMap/intelliScheduling/component/EditMap/svgIconBuilder";
</script>

<style scoped lang="scss">
.map-legend {
  display: flex;
  font-size: 14px;

  .icon {
    width: 1.3em;
    height: 1.3em;
  }

  & > * {
    margin-left: 10px;
  }
}
</style>