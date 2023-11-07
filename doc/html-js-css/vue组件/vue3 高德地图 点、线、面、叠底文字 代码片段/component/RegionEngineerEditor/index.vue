<template>
  <el-drawer class="region-editor" v-model="isShow" :size="600" :show-close="false" destroy-on-close @close="emits('close')" :close-on-click-modal="!isLoading" :close-on-press-escape="false">
    <template #header>
      <el-tabs v-model="activeTabId" :class="{'global-is-busy':isLoading}">
        <el-tab-pane v-for="item in tabData" :key="item.id" :label="item.name" :name="item.id"/>
      </el-tabs>
    </template>
    <div v-if="activeTabId==='engineer'">
      <RegionEngineer v-if="!isDefaultEngineerPanel"
                      :regionShow="regionShow"
                      :params="regionEngineerParams"
                      @jump="isDefaultEngineerPanel=true"
                      @loading="formLoadingHandler"/>
      <RegionEngineerDefault v-else
                             :regionShow="regionShow"
                             :params="regionEngineerParams"
                             @jump="isDefaultEngineerPanel=false"
                             @loading="formLoadingHandler"/>
    </div>
    <div v-if="activeTabId==='overview'">
      <RegionOverview
          :regionShow="regionShow"
          :params="overviewParams"/>
    </div>
  </el-drawer>
</template>

<script lang="ts">
export default {
  name: "RegionEditor"
}
</script>

<script setup lang="ts">
import {ref, defineExpose, defineEmits} from "vue";
import RegionEngineer from "./RegionEngineer.vue";
import RegionEngineerDefault from "./RegionEngineerDefault.vue";
import RegionOverview from "./RegionOverview.vue";

const isDefaultEngineerPanel = ref(false)
const tabData = [
  {id: 'engineer', name: '区域工程师'},
  {id: 'overview', name: '区域概览'},
]
const activeTabId = ref(tabData[0]?.id)
const isShow = ref(false)
const isLoading = ref(false)
const regionShow = ref('')
const formLoadingHandler = (val: boolean) => {
  isLoading.value = val
}
const show = (data: { regionNo: any, chooseDate: any, cityCode: any, recommendLogId: any, regionShow: string }) => {
  isShow.value = true
  regionShow.value = data.regionShow
  isDefaultEngineerPanel.value = false
  regionEngineerParams.value = {
    city_code: data.cityCode,
    choose_date: data.chooseDate,
    region_no: data.regionNo,
  }
  overviewParams.value = {
    city_code: data.cityCode,
    choose_date: data.chooseDate,
    region_no: data.regionNo,
    id: data.recommendLogId
  }
}
const regionEngineerParams = ref<any>({})
const overviewParams = ref<any>({})

const emits = defineEmits(['emits'])
defineExpose({show})
</script>
<style scoped lang="scss">
.region-editor {

}
</style>
<style lang="scss">
.region-editor {
  .el-drawer__header {
    margin-bottom: 0 !important;
  }
}

.region-table-header {
  background-color: #f0f0f0 !important;
  color: #333;
  padding: 3px !important;
  font-weight: bold;
}

.region-table-cell {
  padding: 3px !important;
  position: relative;

  .cell {
    //min-height: 32px !important;
    width: 100%;
    padding: 0 !important;
    height: 100%;
  }
}
</style>