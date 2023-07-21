<template>
  <div class="group-progress">
    <div class="main-panel" :style="{height:getScrollHeight()+'px'}" ref="mainPanelRef">
      <el-scrollbar v-if="dataForShow&&dataForShow.length">
        <div v-for="(item,index) in dataForShow" :key="index"
             class="row"
             :class="{
               'row--clickable':props.clickable,
               'row--active':props.clickable && activeId&&activeId===item.id,
             }"
             :style="{height:rowHeight+'px'}"
             @click="clickHandler(item,index)"
             @mouseover="(e)=>emits('mouseover',e,item,index)"
             @mousemove="(e)=>emits('mousemove',e,item,index)"
             @mouseleave="(e)=>emits('mouseleave',e,item,index)"
        >
          <div class="wrapper">
            <div :style="{width: checkBoxWidth+'px'}">
              <el-radio-group :modelValue="!!(props.clickable && activeId&&activeId===item.id)">
                <el-radio :label="true" style="margin-left: 12px">{{''}}</el-radio>
              </el-radio-group>
            </div>
            <div class="label" ref="labelRef" :style="{width:`${labelWidth}px`}">{{ item.name }}</div>
            <div class="line-list"
                 :style="{
                    margin:`${lineMargin}px`,
                    marginLeft:`${lineMarginLeft}px`,
                    marginRight:`${lineMarginRight}px`,
                    width:`calc((100% - ${labelWidth + checkBoxWidth + percentWidth + lineMargin + lineMarginLeft + lineMarginRight}px))`
                 }">
              <div class="line"
                   v-for="settingItem in props.setting.map(e=> ({...e, key:e.key +(props.showType==='num'?'':'Percent')}) )"
                   :key="settingItem.key"
                   :style="{width:`${(maxValue?item[settingItem.key]/maxValue:0)*100}%`, backgroundColor:settingItem.color}">
                <div class="percent" :style="{width:percentWidth+'px',right:-(lineMargin)+'px'}">
                  <AnimateNumber :duration="300" :num="item[settingItem.key]" :formatter="percentDigitalFormatter"/>
                  <span v-if="props.showType!=='num'">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div v-else :style="{backgroundImage:`url('${Assets.emptyData}')`}" class="empty-data"/>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GroupProgress"
}
</script>

<script lang="ts" setup>
import AnimateNumber from "@/components/AnimateNum.vue";
import * as Assets from './assets'
import {percentDigitalFormatter} from "../../../NumFormatter";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorNegative, colorNeutral, colorPositive} from "@/components/AnalyzeCharts/ChartColors.ts";

export type GroupProgressData = {
  id: number,
  name: string,
  [key: string]: number
}


const props = withDefaults(defineProps<{
  setting: { key: string, name: string, color: string }[],
  activeId?: number,
  data: GroupProgressData[]
  useArrow?: boolean
  showType?: 'percent' | 'num',
  clickable?: boolean,
  scrollHeight?: number | { min: number, max: number, rowNum?: number }
}>(), {
  data: () => [],
  setting: () => [],
  clickable: true,
  scrollHeight: undefined
})
const rowHeight = 73
const labelWidthMin = 60
const labelWidthMax = 120
const labelWidth = ref(labelWidthMin)
const checkBoxWidth = 26
const percentWidth = 35
const lineMargin = 4
const lineMarginLeft = lineMargin
const lineMarginRight = 14

const maxValue = ref(8)
const dataForShow = ref([])
let dataOldLength = 0
let setDataTimer = null
const mainPanelRef = ref()

const getMaxLineValue = (dataArr: GroupProgressData[]) => {
  return dataArr.reduce((m, item) => Math.max(...props.setting.map(e => item[e.key + (props.showType === 'num' ? '' : 'Percent')]), m), 0)
}
const emits = defineEmits(['click', 'mouseover', 'mouseleave', 'mousemove'])
const clickHandler = (item, index) => {
  if (props.clickable) {
    emits('click', item, index)
  }
}
const updateLabelWidth = () => {
  nextTick(() => {
    labelWidth.value = 0
    props.data.forEach(e => {
      let labelLength = 0
      for (let i = 0; i < e.name.length; i++) {
        if (encodeURI(e.name.charAt(i)).length === 9) {
          labelLength += 18 // 中文宽度
        } else {
          labelLength += 11
        }
      }
      labelWidth.value = Math.max(labelWidth.value, labelLength)
    })
    labelWidth.value = Math.min(labelWidth.value, (mainPanelRef.value.getBoundingClientRect().width / 5 * 2) || labelWidthMax)
    labelWidth.value = Math.max(labelWidthMin, labelWidth.value)
  })
}

const updateDataForShow = () => {
  // 设置值的方法
  const setNewVal = () => {
    maxValue.value = getMaxLineValue(props.data);
    dataForShow.value = props.data;
    dataOldLength = props.data.length;
  }
  // 设置值并保留过渡的方法
  if (setDataTimer) {
    clearTimeout(setDataTimer)
    setDataTimer = null
  }

  if (props.data.length) {
    if (!dataOldLength) {
      // 从空数据到有数据的过渡
      dataForShow.value = Array.from({length: props.data.length}, () => ({
        id: null,
        positive: 0,
        positivePercent: 0,
        negative: 0,
        negativePercent: 0,
        neutral: 0,
        neutralPercent: 0
      }))
      setDataTimer = setTimeout(setNewVal)
    } else {
      setNewVal()
    }
  } else {
    setNewVal()
  }
}
const getScrollHeight = () => {
  if (typeof props.scrollHeight === 'number') {
    return props.scrollHeight
  }
  if ((props.scrollHeight as any)?.min !== undefined && (props.scrollHeight as any)?.max !== undefined) {
    const tmp = props.scrollHeight as { min: number, max: number, rowNum?: number }
    const realTotalHeight = (tmp?.rowNum || props.data.length) * rowHeight
    return Math.max(Math.min(realTotalHeight, tmp.max), tmp.min)
  }
}

onMounted(() => {
  updateDataForShow()
  updateLabelWidth()
})
watch(() => props.activeId, () => {
  updateDataForShow()
})
watch(() => props.data, () => {
  updateDataForShow()
  updateLabelWidth()
}, {
  deep: true,
})

onMounted(() => {
  updateLabelWidth()
  window.addEventListener('resize', updateLabelWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLabelWidth)
})
</script>

<style scoped lang="less">
.group-progress {
  height: 100%;
  position: relative;

  .empty-data {
    position: absolute;
    top: 0;
    left: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    bottom: 0;
    right: 0;
    opacity: 0.7
  }

  .main-panel {
    position: relative;
    display: flex;
    flex-direction: column;

    :deep(.el-scrollbar) {
      width: 100%;
      position: relative;
      overflow: hidden;

      &__view {
        overflow: hidden;
        position: relative;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center; // 未填满时，行的分布方式
      }
    }

    .row {
      margin-right: 10px;
      position: relative;
      white-space: nowrap;
      text-align: left;
      display: flex;
      //height: 48px;
      align-items: center;
      border: 2px solid transparent;

      &--clickable {
        cursor: pointer;
      }

      &:hover {
        background-color: #F5F7FC;
      }

      &--active {
        background-color: #F5F7FC;
      }

      .wrapper {
        position: relative;
        min-height: 40px;
        width: 100%;
        height: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;

        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4px 6px;
          min-height: 2em;
          word-break: break-all;
          vertical-align: middle;
          white-space: normal;
          position: relative;
          font-size: inherit;
          //font-weight: 600;
          color: #333;
          line-height: 1.2em;
          //background-color: #f3f3f3;
          border-radius: 6px;
        }

        .line-list {
          display: inline-block;

          .line {
            width: 0;
            transition: all 0.3s ease-out;
            position: relative;
            height: 16px;
            vertical-align: middle;
            font-size: inherit;
            margin-bottom: 2px;
            //border-radius: 0 10px 10px 0;

            &:last-child {
              margin: 0;
            }

            .percent {
              white-space: nowrap;
              font-size: 12px;
              font-weight: normal;
              position: absolute;
              top: 50%;
              transform: translate(100%, -50%);
            }
          }
        }
      }
    }
  }
}
</style>
