<template>
  <div class="group-progress">
    <div class="main-panel" :style="{height:getScrollHeight()+'px'}" ref="mainPanelRef">
      <el-scrollbar v-if="dataForShow&&dataForShow.length">
        <div v-for="(item,index) in dataForShow" :key="index"
             class="row"
             :class="{
               'row--clickable':props.clickable,
               'row--active':props.clickable && activeId&&activeId===item.id,
               'row--active--arrow':props.clickable && props.useArrow,
             }"
             :style="{height:rowHeight+'px'}"
             @click="clickHandler(item,index)"
        >
          <div class="wrapper">
            <div class="label" ref="labelRef" :style="{width:`${labelWidth}px`}">{{ item.name }}</div>
            <div class="line-list"
                 :style="{
                    margin:`${lineMargin}px`,
                    marginLeft:`${lineMarginLeft+splitLineWidth}px`,
                    marginRight:`${lineMarginRight}px`,
                    width:`calc((100% - ${labelWidth + splitLineWidth + percentWidth + lineMargin + lineMarginLeft + lineMarginRight}px))`
                 }">
              <div class="line"
                   v-for="key in props.showType==='num'?['positive','neutral','negative']: ['positivePercent','neutralPercent','negativePercent']"
                   :key="key"
                   :style="{width:`${(maxValue?item[key]/maxValue:0)*100}%`, backgroundColor:lineColors[key]}">
                <div class="percent" :style="{width:percentWidth+'px',right:-(lineMargin)+'px'}">
                  <AnimateNumber :duration="300" :num="item[key]" :formatter="percentDigitalFormatter"/>
                  <span v-if="props.showType!=='num'">%</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="props.useArrow" class="active-arrow"/>
        </div>
        <div v-if="splitLineWidth" style="position: absolute;top:0;bottom:0;overflow: hidden" :style="{left: labelWidth+'px',width:splitLineWidth+'px'}">
          <div style="position: absolute;top:0;bottom:0;right:0;background-color: rgba(0,72,255,0.1);width: 2px"/>
          <div style="position: absolute;top:0;bottom:0;right:2px;background-color: rgba(0,236,255,0.1);width: 3px"/>
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

export type GroupProgressData = {
  id: number,
  name: string,
  positive: number,
  positivePercent: number,
  negative: number,
  negativePercent: number,
  neutral: number,
  neutralPercent: number,
}

const props = withDefaults(defineProps<{
  activeId?: number,
  data: GroupProgressData[]
  useArrow?: boolean
  showType?: 'percent' | 'num',
  clickable?: boolean,
  scrollHeight?: number | { min: number, max: number, rowNum?: number }
}>(), {
  data: () => [],
  clickable: true,
  scrollHeight: undefined
})
const splitLineWidth = 0
const rowHeight = 44
const labelWidth = ref(72)
const percentWidth = 35
const lineMargin = 4
const lineMarginLeft = lineMargin
const lineMarginRight = 14

const maxValue = ref(8)
const dataForShow = ref([])
let dataOldLength = 0
let setDataTimer = null
const mainPanelRef = ref()

const lineColors = {
  negative: '#ECB73F',
  negativePercent: '#ECB73F',
  positive: '#466AF2',
  positivePercent: '#466AF2',
  neutral: '#CFCFCF',
  neutralPercent: '#CFCFCF',
}

const getMaxLineValue = (dataArr: GroupProgressData[]) => {
  if (props.showType === 'num') {
    return dataArr.reduce((m, item) => Math.max(item.negative, item.positive, item.neutral, m), 0)
  } else {
    return dataArr.reduce((m, item) => Math.max(item.negativePercent, item.positivePercent, item.neutralPercent, m), 0)
  }
}
const emits = defineEmits(['click'])
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
          labelLength += 10
        }
      }
      labelWidth.value = Math.max(labelWidth.value, labelLength)
    })
    labelWidth.value = Math.min(labelWidth.value, (mainPanelRef.value.getBoundingClientRect().width / 5 * 2) || 120)
    labelWidth.value = Math.max(100, labelWidth.value)
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
        justify-content: space-around;
      }
    }

    .row {
      border-radius: 6px;
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
        background-color: var(--el-color-primary-light-9);

        .active-arrow {
          &:before, &:after {
            background-color: var(--el-color-primary-light-9);
          }
        }
      }

      &--active {
        @active-border-color: rgba(0, 117, 255, 0.4);
        border: 2px solid @active-border-color;
        box-shadow: 0 0 6px 0 rgba(48, 48, 48, 0.2);
        border-radius: 6px;

        &--arrow {
          border-radius: 6px 2px 2px 6px;
        }

        .active-arrow {
          width: 0;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;

          &:before {
            box-shadow: 4px 0 5px 0 rgba(66, 99, 221, 0.18);
            top: -1px;
            right: -2px;
            position: absolute;
            content: ' ';
            display: inline-block;
            border-right: 2px solid @active-border-color;
            height: 60%;
            width: 15px;
            background-color: white;
            transform-origin: 100% 0;
            transform: rotate(-20deg);
            border-radius: 0 0 4px 100%;
          }

          &:after {
            box-shadow: 4px 0 5px 0 rgba(66, 99, 221, 0.18);
            bottom: -1px;
            right: -2px;
            position: absolute;
            content: ' ';
            display: inline-block;
            border-right: 2px solid @active-border-color;
            height: 60%;
            width: 15px;
            background-color: white;
            transform-origin: 100% 100%;
            transform: rotate(20deg);
            border-radius: 100% 8px 0 0;
          }
        }
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
          background-color: #f3f3f3;
          border-radius: 6px;
        }

        .line-list {
          display: inline-block;

          .line {
            width: 0;
            transition: all 0.3s ease-out;
            position: relative;
            height: 9px;
            vertical-align: middle;
            font-size: inherit;
            margin-bottom: 2px;
            border-radius: 0 10px 10px 0;

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
