<template>
  <div class="chart-grid">
    <div class="header">
      <span class="charts-title">{{ title }}</span>
      <img class="charts-icon" :class="{'charts-is-busy':isDownloadLoading}" @click="downloadHandler" :src="Assets.download" alt="download" v-if="hasDownload"/>
      <slot name="header"/>
    </div>
    <div class="container">
      <el-table :data="dataForShow" @cell-mouse-enter="cellEnterHandler" @cell-mouse-leave="cellLeaveHandler">
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center" header-align="center">
          <template #default="{$index}">
            <div class="index-num"
                 :style="{
                   backgroundColor:isNegative?colorNegative:colorPositive,
                   opacity:1-$index*0.1
                 }"
            >
              {{ $index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="c in columns.filter(e=>e.type!=='hover')" align="left" header-align="left" v-bind="c" :key="c.prop">
          <template #default="{row}">
            <span :title="getFormattedValue(row, c)">{{ getFormattedValue(row, c) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isPopperShow && popperContent" class="pop-panel" :style="{top:popperTop+'px'}" @mouseover="popperShowHandler">
        {{ popperContent }}
      </div>
    </div>
  </div>
</template>

<script>
import {colorNegative, colorPositive} from "../ChartColors.js";
import * as Assets from '../assets'

const getFormattedValue = (row, column) => {
  const val = row?.[column.prop]
  if (column.formatter) {
    // console.log('eeee',row, column, val)
    return column.formatter(row, column, val) || ''
  } else {
    return val || ''
  }
}
export default {
  name: "chartGrid",
  props: {
    isNegative: Boolean,
    title: String,
    data: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    hasDownload: Boolean,
    isDownloadLoading: Boolean,
  },
  data() {
    return {
      dataForShow: [],
      popperContent: '',
      popperTop: 0,
      isPopperShow: false,
      popperHideTimer: null,
      Assets,
      colorNegative,
      colorPositive,
      getFormattedValue,
    }
  },
  watch: {
    data: {
      handler() {
        this.dataForShow = [...this.data || [], ...Array.from({length: 10}, () => ({_empty: true}))].slice(0, 10).map((e, i) => ({...e, _rowIndex: i}))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    downloadHandler() {
      if (!this.isDownloadLoading) {
        this.$emit('download')
      }
    },
    cellEnterHandler(row, column, cell) {
      this.updatePopperContent(row, column, cell)
      if (!row._empty) {
        this.popperShowHandler()
      } else {
        this.popperHideHandler(true)
      }
    },
    cellLeaveHandler() {
      this.popperHideHandler()
    },
    updatePopperContent(row, column, cell) {
      let result = []
      if (row) {
        this.columns.forEach(c => {
          if (c.type === 'hover') {
            result.push(c.label + ': ' + (row[c.prop] || ''))
          }
        })
        this.popperTop = (row._rowIndex + 1 + 0.95) * cell.clientHeight
        this.popperContent = result.join('\n')
      }
    },
    popperShowHandler() {
      if (this.popperHideTimer) {
        clearTimeout(this.popperHideTimer)
        this.popperHideTimer = null
      }
      this.isPopperShow = true
    },
    popperHideHandler(immediate) {
      if (this.popperHideTimer) {
        clearTimeout(this.popperHideTimer)
        this.popperHideTimer = null
      }
      if (immediate) {
        this.isPopperShow = false
      } else {
        this.popperHideTimer = setTimeout(() => {
          this.isPopperShow = false
        }, 100)
      }
    }
  },

}
</script>


<style scoped lang="scss">
.chart-grid {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #4E5969;

  .header {
    margin: 10px 0 10px 10px;
    line-height: 16px;
    height: 16px;
    display: flex;
    text-align: left;
    align-items: center;
  }

  .container {
    position: relative;

    .index-num {
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .pop-panel {
      white-space: pre-wrap;
      position: absolute;
      left: 50%;
      top: 80%;
      background-color: white;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      transform: translateX(-50%);
      z-index: 10;
      max-width: 15em;
      border-radius: 4px;
      text-align: left;

      &:after {
        content: '';
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: white;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
        top: 0;
        left: 50%;
        transform-origin: 50% 50%;
        transform: translate(-100%, -50%) rotate(-135deg);
      }
    }
  }

  ::v-deep .el-table__header {
    th {
      height: 44px;
      background: #F4F6F9;
      font-weight: 500;
      color: #1D2129;
      line-height: 1.1em;
    }
  }

  ::v-deep .el-table__body {
    td {
      padding-top: 0;
      padding-bottom:0;
      height: 50px;
      font-weight: 500;
      color: #1D2129;
      line-height: 1.1em;
    }
  }

  ::v-deep th .cell {
    //white-space: nowrap;
    display: block;
    line-height: 1.2em;
    overflow: hidden !important;
    //text-overflow: ellipsis !important;
  }

  ::v-deep td .cell {
    white-space: nowrap;
    display: block;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  //::v-deep .el-table__row:last-child {
  //  td {
  //    border-bottom: none;
  //  }
  //}
  //
  //::v-deep .el-table{
  //  &:before {
  //    display: none;
  //  }
  //}
  //::v-deep .el-table__fixed{
  //  &:before {
  //    display: none;
  //  }
  //}
  //:deep(.el-scrollbar__bar.is-horizontal) {
  //  opacity: 1 !important;
  //  display: block !important;
  //}
}

</style>
