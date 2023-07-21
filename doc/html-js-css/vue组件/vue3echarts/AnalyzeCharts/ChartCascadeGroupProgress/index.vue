<template>
  <div class="chart-cascade-group-progress">
    <div v-for="(column,columnIndex) in dataForShow" :key="columnIndex"
         class="column"
         :style="{
           zIndex:dataForShow.length-columnIndex
         }"
    >
      <div class="header">
        <div>
          <div class="charts-title">{{ column.title }}</div>
          <template v-if="showTrendColumnIndex===columnIndex">
            <img class="charts-icon"
                 style="margin-left: 10px"
                 @click="showTrendColumnIndex=undefined"
                 :src="Assets.showBar"
                 alt="showBar"
            />
            <slot name="trendSelectList" v-if="showTrendColumnIndex===columnIndex"/>
          </template>
          <template v-else>
            <img class="charts-icon"
                 :class="{
                  'charts-icon--disabled':!column.activeId,
               }"
                 v-if="getHasTrend(column,columnIndex)"
                 style="margin-left: 10px"
                 @click="trendHandler(!column.activeId,column, columnIndex)"
                 :src="Assets.trend"
                 alt="trend"
            />
            <img class="charts-icon"
                 :class="{
                  'charts-icon--disabled':columnIndex===0? !column.listData?.length : !column.parentId,
             }"
                 v-if="getHasDownload(column,columnIndex)"
                 @click="downloadHandler(columnIndex===0? !column.listData?.length : !column.parentId,column, columnIndex)"
                 :src="Assets.download"
                 alt="download"/>
          </template>
        </div>
      </div>
      <div class="body">
        <slot name="trendBody" v-if="showTrendColumnIndex===columnIndex"/>
        <GroupProgress
          v-else
          class="progress-wrapper"
          :setting="settingData"
          :clickable="props.clickableIndex===undefined || columnIndex<=props.clickableIndex"
          :data="column.listData"
          :activeId="column.activeId"
          :useArrow="columnIndex<(props.forceColumnNum===undefined?maxLevel:props.forceColumnNum-1)"
          :showType="props.showType"
          :scrollHeight="getScrollHeight()"
          @click="(row,rowIndex)=> clickHandler(row, rowIndex, column, columnIndex)"
          @mouseover="rowHoverHandler"
          @mousemove="rowHoverHandler"
          @mouseleave="rowLeaveHandler"
        />
      </div>
    </div>
    <div class="popover" ref="popoverRef"
         :class="{
                'popover--show':popoverPosition.x && popoverPosition.y,
                'popover--left':popoverPosition.isLeftSide
             }"
         :style="{left:popoverPosition.x+'px',top:popoverPosition.y+'px'}"
    >
      <table v-if="dataForHover">
        <tr>
          <td colspan="3">{{ dataForHover.name }}</td>
        </tr>
        <tr class="split"/>
        <tr v-for="item in settingData" :key="item.key">
          <td>
            <div :style="{backgroundColor:item.color}" style="width: 8px;height:8px;display: inline-block;margin-right: 5px;"/>
            <span>{{ item.name }}</span>
          </td>
          <td>{{ dataForHover[item.key] }}</td>
          <td>{{ dataForHover[item.key + 'Percent'] }}%</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ChartCascadeGroupProgress'
}
</script>
<script lang="ts" setup>
import * as Assets from './assets'
import GroupProgress from "./component/GroupProgress/index.vue";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorNegative, colorNeutral, colorPositive} from "@/components/AnalyzeCharts/ChartColors.ts";

export type ChartCascadeGroupProgressData = {
  id: number,
  name: string,
  [key: string]: number,

  parentId?: number,
  children?: ChartCascadeGroupProgressData[]
}

type DataForShow = {
  title: string,
  activeId?: number,
  parentId?: number,
  listData: Omit<ChartCascadeGroupProgressData, 'children'>[]
}
type BoolReturnFunc = (columnData: DataForShow, columnIndex: number) => boolean
const emits = defineEmits(['click', 'trend', 'download', 'update:activeIds'])

const settingData: { key: string, name: string, color: string }[] = [
  {key: 'positive', name: '正面体验', color: colorPositive},
  {key: 'neutral', name: '中立体验', color: colorNeutral},
  {key: 'negative', name: '负面体验', color: colorNegative},
]

const props = withDefaults(defineProps<{
  activeIds?: number[], // 当前各级激活的数据id
  clickableIndex?: number, // 限定前几个列的数据，是可以选中的。不填则没限制
  forceColumnNum?: number, // 强制保持显示列数。不填则根据返回的数据最大深度显示列数
  title?: string,  // 第一列数据的title
  parentId?: number, // 第一列数据的parentId
  data: ChartCascadeGroupProgressData[]
  showType?: 'num' | 'percent'
  hasDownload?: boolean | BoolReturnFunc
  hasTrend?: boolean | BoolReturnFunc
  noAutoActiveFirstRow?: boolean
  scrollHeight?: number | { min: number, max: number }
  pathTitleSplit?: string

}>(), {
  data: () => [],
  activeIds: () => [],
  hasTrend: false,
  hasDownload: false,
})
const dataForShow = ref<DataForShow[]>([])
const maxRowCount = ref(0)

const showTrendColumnIndex = ref<number>()//正在展示趋势的列

const maxLevel = ref(0)


const getHasTrend: BoolReturnFunc = (column: DataForShow, columnIndex: number) => {
  if (typeof props.hasTrend === 'function') {
    return props.hasTrend.call(null, column, columnIndex)
  } else {
    return props.hasTrend
  }
}

const getHasDownload: BoolReturnFunc = (column: DataForShow, columnIndex: number) => {
  if (typeof props.hasDownload === 'function') {
    return props.hasDownload.call(null, column, columnIndex)
  } else {
    return props.hasDownload
  }
}
const buildDataForShow = (cascadeData: ChartCascadeGroupProgressData[], level = 0) => {
  const dataTmp: DataForShow = {
    title: '',
    activeId: undefined,
    listData: []
  }
  maxRowCount.value = Math.max(maxRowCount.value, cascadeData?.length || 0)

  dataTmp.listData = cascadeData
  if (level === 0) {
    dataTmp.title = props.title || '';
  } else {
    dataTmp.title = dataForShow.value[level - 1]?.listData.find?.(e => dataForShow.value[level - 1]?.activeId === e.id)?.name || '';
    if (props.pathTitleSplit !== undefined) {
      const preTitle = (dataForShow.value[level - 1]?.title || '')
      dataTmp.title = preTitle + (preTitle ? props.pathTitleSplit : '') + dataTmp.title
    }
  }
  const activeRow = cascadeData.find(e => e.id === props.activeIds[level]) // || cascadeData[0] //注释部分为 自动高亮子级本列第一个
  dataTmp.activeId = activeRow?.id
  if (level === 0) {
    dataTmp.parentId = props.parentId;
  } else {
    dataTmp.parentId = dataForShow.value[level - 1]?.activeId;
  }
  dataForShow.value[level] = dataTmp

  if (activeRow?.children) {
    buildDataForShow(activeRow.children, level + 1)
  } else {
    if (level < (props.forceColumnNum ? props.forceColumnNum - 1 : maxLevel.value)) {
      buildDataForShow([], level + 1)
    }
  }
}
const getMaxLevel = (cascadeData: ChartCascadeGroupProgressData[], level = 0) => {
  maxLevel.value = Math.max(level, maxLevel.value)
  cascadeData.forEach(e => {
    if (e.children?.length) {
      getMaxLevel(e.children, level + 1)
    }
  })
}

const trendHandler = (disabled: boolean, column: DataForShow, columnIndex: number) => {
  if (!disabled) {
    showTrendColumnIndex.value = columnIndex
    emits('trend', column, columnIndex)
  }
}
const downloadHandler = (disabled: boolean, column: DataForShow, columnIndex: number) => {
  if (!disabled) {
    emits('download', column, columnIndex)
  }
}
const clickHandler = (row, rowIndex, column, columnIndex) => {
  const activeIdsNow = getTreeIds(row, columnIndex, [...props.activeIds])
  emits('update:activeIds', activeIdsNow)
  emits('click', activeIdsNow, row, rowIndex, column, columnIndex)
}

const getScrollHeight = () => {
  if (props.scrollHeight === undefined) {
    return
  }
  if (typeof props.scrollHeight === 'number') {
    return props.scrollHeight
  }
  if ((props.scrollHeight as any)?.min !== undefined && (props.scrollHeight as any)?.max !== undefined) {
    const tmp = props.scrollHeight as { min: number, max: number }
    return {...tmp, rowNum: maxRowCount.value}
  }
}
// 将 currentNode 和其每层子级id，依次覆盖到 activeIdsTmp 的下标 index 及之后
const getTreeIds = (currentNode?: { id: number, children?: any }, index = 0, activeIdsTmp: number[] = []) => {
  if (!currentNode?.id) {
    activeIdsTmp.length = index
    return activeIdsTmp
  }
  activeIdsTmp[index] = currentNode.id
  if (currentNode?.children?.length) {
    getTreeIds(currentNode.children[0], index + 1, activeIdsTmp)
  } else {
    activeIdsTmp.length = index + 1
  }
  return activeIdsTmp
}

watch(() => props.activeIds, () => {
  maxRowCount.value = 0
  showTrendColumnIndex.value = undefined
  buildDataForShow(props.data)
}, {deep: true})

watch(() => props.data, () => {
  dataForShow.value = []
  maxLevel.value = 0
  getMaxLevel(props.data)
  maxRowCount.value = 0
  showTrendColumnIndex.value = undefined
  buildDataForShow(props.data)
  if (!props.noAutoActiveFirstRow) {
    emits('update:activeIds', getTreeIds(dataForShow.value?.[0]?.listData[0]))
  }
}, {immediate: true, deep: true})

watch(() => props.title, () => {
  const columnFirst = dataForShow.value?.[0]
  if (columnFirst) {
    columnFirst.title = props.title || ''
  }
})
watch(() => props.parentId, () => {
  const columnFirst = dataForShow.value?.[0]
  if (columnFirst) {
    columnFirst.parentId = props.parentId
  }
})
defineExpose({getTreeIds})

// ----------------- 悬浮窗 ----------------
const dataForHover = ref<ChartRingScatterDataForShow>()
const popoverPosition = ref<{ x: number | null, y: number | null, isLeftSide: boolean }>({
  x: null,
  y: null,
  isLeftSide: false
})
const popoverRef = ref()
const rowHoverHandler = (e, item, index) => {
  dataForHover.value = item
  nextTick(() => {
    const popoverRect = popoverRef.value.getBoundingClientRect()
    popoverPosition.value = {
      x: e.x,
      y: Math.min(e.y, window.innerHeight - popoverRect.height - 50),
      isLeftSide: window.innerWidth - popoverRect.width - 50 < e.x,
    }
  })
}
const rowLeaveHandler = () => {
  popoverPosition.value = {...popoverPosition.value, x: null, y: null}
}
onMounted(() => {
  window.addEventListener('wheel', rowLeaveHandler)
})
onBeforeUnmount(() => {
  window.removeEventListener('wheel', rowLeaveHandler)
})
</script>

<style scoped lang="less">
.chart-cascade-group-progress {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;

  .column {
    padding: 20px 23px 0;
    position: relative;
    white-space: nowrap;
    height: 100%;
    flex: 33.33% 1 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    min-width: 0;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      right: 0;
      background: #F2F3F5;
      background-size: 100% 50px;
    }

    &:last-child {
      padding-right: 0;

      &:after {
        display: none;
      }
    }

    &:first-child {
      padding-left: 0;
    }

    .header {
      height: 32px;
      margin: 0 15px 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > * {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .body {
      position: relative;
      overflow: hidden;
      display: flex;
      flex: 1;
      border-radius: 6px;

      .progress-wrapper {
        flex: 1;
        border-radius: 6px;
      }
    }


  }

  .popover {
    transition: opacity 0.3s ease-out;
    position: fixed;
    z-index: 100;
    pointer-events: none;
    font-size: 12px;
    min-width: 150px;
    padding: 10px;
    background-color: white;
    border-radius: 6px;
    white-space: nowrap;
    transform: translateX(15px);
    opacity: 0;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);

    &--show {
      opacity: 1;
    }

    &--left {
      transform: translateX(calc(-100% - 15px))
    }

    .split {
      height: 10px;
    }

    tr {
      text-align: left;

      td {
        padding-right: 15px;
        text-align: right;
        color: #1D2129;
        white-space: nowrap;

        &:last-child {
          padding-right: 0;
        }

        &:first-child {
          padding-right: 20px;
          color: #86909C;
          font-weight: bold;
          text-align: left;
        }

      }

    }
  }
:deep(.el-scrollbar__bar.is-vertical){
  display: block !important;
  transition: none;
  opacity: 1 !important;
}
}
</style>
