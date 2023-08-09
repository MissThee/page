<template>
  <div class="chart-grid">
    <div class="header">
      <span class="charts-title">{{ props.title }}</span>
      <slot name="header"/>
    </div>
    <div class="container">
      <table class="table">
        <tr class="head">
          <th style="min-width: 35px;width:60px">序号</th>
          <th v-for="header in props.columns.filter(e=>e.type!=='hover')" :key="header.prop" :style="{width:header.width+'px',minWidth:header.minWidth+'px'}">{{ header.label }}</th>
        </tr>
        <tr class="row"
            @mouseenter="hoverRowIndex=index"
            @mouseleave="hoverRowIndex=null"
            v-for="(row,index) in dataForShow"
            :key="index"
            @click="rowClickHandler(row)">
          <td class="row__index">
            <div class="row__index__text"
                 :style="{
                   backgroundColor:props.isNegative?colorNegative:colorPositive,
                   opacity:1-index*0.1
                 }"
            >
              {{ index + 1 }}
            </div>
          </td>
          <template v-for="(column,columnIndex) in props.columns" :key="column.prop+'_'+columnIndex">
            <template v-if="column.type==='hover'">
              <div v-if="hoverRowIndex===index" class="pop-panel">
                {{ column.label + ': ' + getFormattedValue(row[column.prop], column.formatter) }}
              </div>
            </template>
            <td v-else>
              {{ getFormattedValue(row[column.prop], column.formatter) }}
            </td>
          </template>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartGrid',
}
</script>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {colorNegative, colorPositive} from "@/components/AnalyzeCharts/ChartColors.ts";

const props = withDefaults(defineProps<{
  isNegative?: boolean
  title?: string
  data?: Record<string, any>[],
  columns: {
    prop: string,
    label: string,
    value: any,
    formatter: (value: any) => any,
    minWidth?: number,
    width?: number,
    type?: 'hover'
  }[]
}>(), {
  data: () => [],
  columns: () => []
})

const getFormattedValue = (value: any, formatter?: (value: any) => any) => {
  if (formatter) {
    return formatter(value) || ''
  } else {
    return value || ''
  }
}

const dataForShow = ref<Record<string, any>[]>([])
const hoverRowIndex = ref<number | null>(null)
const buildDataForShow = (data: Record<string, any>) => {
  const result: (Record<string, any>)[] = []
  for (let i = 0; i < 10; i++) {
    const currentData = data[i]
    result.push(currentData || {})
  }
  return result
}

watch(() => props.data, () => {
  dataForShow.value = buildDataForShow(props.data)
}, {deep: true, immediate: true})

const emits = defineEmits(['click'])

const rowClickHandler = (row) => {
  emits('click', row)
}


</script>

<style lang="less" scoped>
.chart-grid {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #4E5969;

  .header {
    line-height: 32px;
    height: 32px;
    display: flex;
    text-align: left;
    align-items: center;
    margin-bottom: 10px;
  }

  .container {
    margin-top: 10px;
    flex: 1;

    &::-webkit-scrollbar {
      height: 14px;
    }

    .table {
      border-collapse: collapse;
      width: 100%;
      height: 100%;
      text-align: center;
      position: relative;

      .head {
        font-weight: 500;
        height: 54px;
        background: #F4F6F9;
        width: 48px;
        color: #1D2129;
        line-height: 1.1em;
      }

      .row {
        font-weight: 400;
        height: 54px;
        position: relative;


        td {
          box-shadow: inset 0px -1px 0px 0px rgba(242, 243, 245, 1);
          position: relative;
          white-space: nowrap;

          &:last-child {
            white-space: normal;
            padding: 0 5px;
          }
        }

        &:hover {
          background-color: var(--el-color-primary-light-9);
        }

        &__name {
          font-family: "PingFang SC", "黑体", "Microsoft YaHei", sans-serif;
          font-weight: bold;
          white-space: normal !important;
          line-height: 1.2em;
        }

        &__index {
          text-align: center;

          &__text {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            width: 32px;
            height: 32px;
            color: white;
          }
        }
      }

      .pop-panel {
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
  }
}

</style>
