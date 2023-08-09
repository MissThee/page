<template>
  <div class="chart-cascade-progress">
    <div v-for="(column,columnIndex) in dataForShow" :key="columnIndex"
         class="column"
         :style="{
           zIndex:dataForShow.length-columnIndex
         }"
    >
      <div class="header">
        <div>
          <div class="charts-title">{{ props.titleFormatter?.(column.title, column, columnIndex, dataForShow) || column.title }}</div>
          <img class="charts-icon"
               :class="{
                  'charts-icon--disabled':!column.activeId,
               }"
               v-if="!getNoTrend(column,columnIndex)"
               style="margin-left: 10px"
               @click="trendHandler(!column.activeId,column, columnIndex)"
               :src="HomeAssets.trend"
               alt="trend"
          />
        </div>
        <img class="charts-icon"
             :class="{
                  'charts-icon--disabled':columnIndex===0? !column.listData?.length : !column.parentId,
             }"
             v-if="!getNoDownload(column,columnIndex)"
             @click="downloadHandler(columnIndex===0? !column.listData?.length : !column.parentId,column, columnIndex)"
             :src="HomeAssets.download"
             alt="download"/>
      </div>
      <div class="bottom">
        <ListProgress
          class="progress-wrapper"
          :clickable="props.clickableIndex===undefined || columnIndex<=props.clickableIndex"
          :data="column.listData"
          :active-id="column.activeId"
          :useArrow="columnIndex<(props.forceColumnNum===undefined?maxLevel:props.forceColumnNum-1)"
          :mainProp="props.mainProp"
          :showNumAndPercent="props.showNumAndPercent"
          :scrollHeight="getScrollHeight()"
          @click="(row,rowIndex)=> clickHandler(row, rowIndex, column, columnIndex)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ChartCascadeProgress'
}
</script>
<script lang="ts" setup>
import * as HomeAssets from 'home/assets'
import ListProgress from "./component/ListProgress/index.vue";
import {ref, watch} from "vue";
import GroupProgress from "@/components/AnalyzeCharts/ChartCascadeGroupProgress/component/GroupProgress/index.vue";

export type ChartCascadeProgressData = {
  id: number,
  name: string,
  value: number,
  percent: number,

  parentId?: number,
  children?: ChartCascadeProgressData[]
}

type DataForShow = {
  title: string,
  activeId?: number,
  parentId?: number,
  listData: Omit<ChartCascadeProgressData, 'children'>[]
}
type BoolReturnFunc = (columnData: DataForShow, columnIndex: number) => boolean
const emits = defineEmits(['click', 'trend', 'download', 'update:activeIds'])

const props = withDefaults(defineProps<{
  activeIds?: number[], // 当前各级激活的数据id
  clickableIndex?: number, // 限定前几个列的数据，是可以选中的。不填则没限制
  forceColumnNum?: number, // 强制保持显示列数。不填则根据返回的数据最大深度显示列数
  title?: string, // 第一列数据的title
  parentId?: number, // 第一列数据的parentId
  data: ChartCascadeProgressData[]
  mainProp?: 'value' | 'percent' // 条形以value 还是percent为依据显示长度
  showNumAndPercent?: boolean,
  noDownload?: boolean | BoolReturnFunc
  noTrend?: boolean | BoolReturnFunc
  noAutoActiveFirstRow?: boolean
  scrollHeight?: number | { min: number, max: number }
  pathTitleSplit?: string
  titleFormatter?: (title: string, column: DataForShow, columnIndex: number, dataForShow: DataForShow[]) => string
}>(), {
  data: () => [],
  activeIds: () => [],
  noTrend: false,
  noDownload: false,
})
const dataForShow = ref<DataForShow[]>([])
const maxRowCount = ref(0)

const maxLevel = ref(0)
const getNoTrend: BoolReturnFunc = (column: DataForShow, columnIndex: number) => {
  if (typeof props.noTrend === 'function') {
    return props.noTrend.call(null, column, columnIndex)
  } else {
    return props.noTrend
  }
}

const getNoDownload: BoolReturnFunc = (column: DataForShow, columnIndex: number) => {
  if (typeof props.noDownload === 'function') {
    return props.noDownload.call(null, column, columnIndex)
  } else {
    return props.noDownload
  }
}
const buildDataForShow = (cascadeData: ChartCascadeProgressData[], level = 0) => {
  const dataTmp: DataForShow = {
    title: '',
    activeId: undefined,
    parentId: undefined,
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
  const activeRow = cascadeData?.find?.(e => e.id === props.activeIds[level]) // || cascadeData[0] //注释部分为 自动高亮子级本列第一个
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
const getMaxLevel = (cascadeData: ChartCascadeProgressData[], level = 0) => {
  maxLevel.value = Math.max(level, maxLevel.value)
  cascadeData?.forEach?.(e => {
    if (e.children?.length) {
      getMaxLevel(e.children, level + 1)
    }
  })
}

const trendHandler = (disabled: boolean, column: DataForShow, columnIndex: number) => {
  if (!disabled) {
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

watch(() => JSON.stringify(props.activeIds || []), () => {
  maxRowCount.value = 0
  buildDataForShow(props.data)
})

watch(() => props.data, () => {
  dataForShow.value = []
  maxLevel.value = 0
  getMaxLevel(props.data)
  maxRowCount.value = 0
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
</script>

<style scoped lang="less">
.chart-cascade-progress {
  display: flex;

  .column {
    position: relative;
    white-space: nowrap;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 6px;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 50px;
      bottom: 20px;
      width: 2px;
      right: 0;
      background: linear-gradient(to bottom, #eee, #eee 60%, transparent 60%, transparent);
      background-size: 100% 50px;
    }

    &:last-child {
      &:after {
        display: none;
      }
    }

    .header {
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

    .bottom {
      position: relative;
      overflow: hidden;
      display: flex;
      flex: 1;

      .progress-wrapper {
        flex: 1;
        border-radius: 6px;
      }
    }
  }
}
</style>
