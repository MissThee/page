<template>
  <div class="chart-cascade-group-progress">
    <div class="content">
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
                   :class="{'charts-icon--disabled':columnIndex===0? !(column.listData&&column.listData.length) : !column.parentId}"
                   v-if="getHasDownload(column,columnIndex)"
                   @click="downloadHandler(columnIndex===0? !(column.listData&&column.listData.length) : !column.parentId,column, columnIndex)"
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
              :clickable="clickableIndex===undefined || columnIndex<=clickableIndex"
              :data="column.listData"
              :activeId="column.activeId"
              :showType="showType"
              :scrollHeight="getScrollHeight()"
              @click="(row,rowIndex)=> clickHandler(row, rowIndex, column, columnIndex)"
              @mouseover="rowHoverHandler"
              @mousemove="rowHoverHandler"
              @mouseleave="rowLeaveHandler"
          />
        </div>
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
<script>
import * as Assets from './assets'
import GroupProgress from "./component/GroupProgress/index.vue";
import {colorNegative, colorNeutral, colorPositive} from "..//ChartColors.js";

const settingData = [
  {key: 'positive', name: '正面体验', color: colorPositive},
  {key: 'neutral', name: '中立体验', color: colorNeutral},
  {key: 'negative', name: '负面体验', color: colorNegative},
]
const getTreeIds = (currentNode, index = 0, activeIdsTmp = []) => {
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

export default {
  name: 'chartCascadeGroupProgress',
  components:{GroupProgress},
  props: {
    activeIds: Array,// 当前各级激活的数据id
    clickableIndex: Number, // 限定前几个列的数据，是可以选中的。不填则没限制
    forceColumnNum: Number, // 强制保持显示列数。不填则根据返回的数据最大深度显示列数
    title: String,  // 第一列数据的title
    parentId: Number, // 第一列数据的parentId
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showType: String, // 'num' | 'percent'
    hasDownload: [Boolean, Function],
    hasTrend: [Boolean, Function],
    noAutoActiveFirstRow: Boolean,
    scrollHeight: [Number, Object], //number | { min: number, max: number }
    pathTitleSplit: String
  },
  data() {
    return {
      dataForShow: [],
      maxRowCount: 0,
      firstTitleSuffix: '详情',
      showTrendColumnIndex: null,
      maxLevel: 0,
      dataForHover: {},
      popoverPosition: {
        x: null,
        y: null,
        isLeftSide: false
      },
      settingData,
      Assets
    }
  },
  methods: {
    getHasTrend(column, columnIndex) {
      if (typeof this.hasTrend === 'function') {
        return this.hasTrend.call(null, column, columnIndex)
      } else {
        return this.hasTrend
      }
    },
    getHasDownload(column, columnIndex) {
      if (typeof this.hasDownload === 'function') {
        return this.hasDownload.call(null, column, columnIndex)
      } else {
        return this.hasDownload
      }
    },
    buildDataForShow(cascadeData, level = 0) {
      const dataTmp = {
        title: '',
        activeId: undefined,
        parentId: undefined,
        listData: []
      }
      this.maxRowCount = Math.max(this.maxRowCount, cascadeData?.length || 0)

      dataTmp.listData = cascadeData
      if (level === 0) {
        dataTmp.title = (this.title || '') + this.firstTitleSuffix;
      } else {
        dataTmp.title = this.dataForShow[level - 1]?.listData.find?.(e => this.dataForShow[level - 1]?.activeId === e.id)?.name || '';
        if (this.pathTitleSplit !== undefined) {
          const preTitle = (this.dataForShow[level - 1]?.title || '')
          dataTmp.title = preTitle + (preTitle ? this.pathTitleSplit : '') + dataTmp.title
        }
      }
      const activeRow = cascadeData.find(e => e.id === this.activeIds[level]) // || cascadeData[0] //注释部分为 自动高亮子级本列第一个
      dataTmp.activeId = activeRow?.id
      if (level === 0) {
        dataTmp.parentId = this.parentId;
      } else {
        dataTmp.parentId = this.dataForShow[level - 1]?.activeId;
      }
      this.dataForShow[level] = dataTmp

      if (activeRow?.children) {
        this.buildDataForShow(activeRow.children, level + 1)
      } else {
        if (level < (this.forceColumnNum ? this.forceColumnNum - 1 : this.maxLevel)) {
          this.buildDataForShow([], level + 1)
        }
      }
    },
    getMaxLevel(cascadeData, level = 0) {
      this.maxLevel = Math.max(level, this.maxLevel)
      cascadeData.forEach(e => {
        if (e.children?.length) {
          this.getMaxLevel(e.children, level + 1)
        }
      })
    },
    trendHandler(disabled, column, columnIndex) {
      if (!disabled) {
        this.showTrendColumnIndex = columnIndex
        this.$emit('trend', column, columnIndex)
      }
    },
    downloadHandler(disabled, column, columnIndex) {
      if (!disabled) {
        this.$emit('download', column, columnIndex)
      }
    },
    clickHandler(row, rowIndex, column, columnIndex) {
      const activeIdsNow = getTreeIds(row, columnIndex, [...this.activeIds || []])
      this.$emit('update:activeIds', activeIdsNow)
      this.$emit('click', activeIdsNow, row, rowIndex, column, columnIndex)
    },
    getScrollHeight() {
      if (this.scrollHeight === undefined) {
        return
      }
      if (typeof this.scrollHeight === 'number') {
        return this.scrollHeight
      }
      if (this.scrollHeight?.min !== undefined && this.scrollHeight?.max !== undefined) {
        const tmp = this.scrollHeight
        return {...tmp, rowNum: this.maxRowCount}
      }
    },
    rowHoverHandler(e, item, index) {
      this.dataForHover = item
      this.$nextTick(() => {
        const popoverRect = this.$refs.popoverRef.getBoundingClientRect()
        this.popoverPosition = {
          x: e.x,
          y: Math.min(e.y, window.innerHeight - popoverRect.height - 50),
          isLeftSide: window.innerWidth - popoverRect.width - 50 < e.x,
        }
      })
    },
    rowLeaveHandler() {
      this.popoverPosition = {...this.popoverPosition, x: null, y: null}
    }
  },
  mounted() {
    window.addEventListener('wheel', this.rowLeaveHandler)
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.rowLeaveHandler)
  },
  watch: {
    activeIds: {
      handler() {
        this.maxRowCount = 0
        this.showTrendColumnIndex = undefined
        this.buildDataForShow(this.data)
      },
      deep: true
    },
    data: {
      handler() {
        this.dataForShow = []
        this.maxLevel = 0
        this.getMaxLevel(this.data)
        this.maxRowCount = 0
        this.showTrendColumnIndex = undefined
        this.buildDataForShow(this.data)
        if (!this.noAutoActiveFirstRow) {
          this.$emit('update:activeIds', getTreeIds(this.dataForShow?.[0]?.listData[0]))
        }
      },
      immediate: true,
      deep: true
    },
    parentId() {
      const columnFirst = this.dataForShow?.[0]
      if (columnFirst) {
        columnFirst.parentId = this.parentId
      }
    }
  }

}
</script>

<style scoped lang="scss">
.chart-cascade-group-progress {
  height: 100%;
  width: 100%;

  .content {
    display: flex;
    flex: 1;
  }

  .column {
    padding: 10px;
    position: relative;
    white-space: nowrap;
    height: 100%;
    flex: 33.33% 1 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    min-width: 0;

    &:nth-child(2) {
      flex: 35.33% 1 1;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      right: 0;
      background: #ccc;
      background-size: 100% 50px;
    }

    &:last-child {
      padding-right: 0;

      &:after {
        display: none !important;
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

  ::v-deep .el-scrollbar__bar.is-vertical {
    display: block !important;
    transition: none;
    opacity: 1 !important;
  }
}
</style>
