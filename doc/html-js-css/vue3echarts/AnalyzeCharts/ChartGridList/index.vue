<template>
  <div class="grid-list">
    <div class="header">
      <span class="charts-title">{{ textOptionByType.title }}</span>
    </div>
    <div class="container">
      <el-scrollbar class="full-height">
        <table class="table">
          <tr class="head">
            <th style="min-width: 45px;width:60px">序号</th>
            <th style="min-width: 60px;width:200px">{{ textOptionByType.name.text }}</th>
            <th style="min-width: 70px;width:100px">{{ textOptionByType.num.text }}</th>
            <th style="min-width: 70px;width:100px">{{ textOptionByType.percent.text }}</th>
            <th style="min-width: 80px;width:200px">{{ textOptionByType.belong.text }}</th>
          </tr>
          <tr class="row"
              v-for="(row,index) in buildDataForShow(data)"
              :key="index"
              @click="rowClickHandler(row)">
            <td class="row__index">
              <div class="row__index__text">{{ index + 1 }}</div>
            </td>
            <td class="row__name">{{ row.name }}</td>
            <td>{{ row.num }}</td>
            <td>
              <div>
                <span>{{ percentDigitalFormatter(row.percent) }}</span>
                <span>{{ row.percent === null || row.percent === undefined ? '' : '%' }}</span>
              </div>
              <div class="progress" :class="{'progress--empty':row.percent===undefined}">
                <div class="progress__bar" :class="{'progress__bar--full':row.percent===100}" :style="{width:!maxPercent?0:((row.percent||0)*100/maxPercent)+'%'}"/>
              </div>
            </td>
            <td class="row__belong">
              <div class="row__belong__text" :title="row.belong">{{ row.belong }}</div>
            </td>
          </tr>
        </table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartGridList',
}
</script>
<script lang="ts" setup>
import {percentDigitalFormatter} from "../NumFormatter.ts";
import {ref, watch} from "vue";

export type ChartGridListData = {
  id: number,
  name: string,
  num: number,
  percent: number,
  belong: string,
}

const props = withDefaults(defineProps<{
  type?: 'interest' | 'painSpot'
  data?: ChartGridListData[],
}>(), {
  data: () => [],
})

const textOptionByType = ref({
  title: '',
  name: {text: '', width: ''},
  num: {text: '', width: ''},
  percent: {text: '', width: ''},
  belong: {text: '', width: ''},
})
const themeColor = ref('gray')

watch(() => props.type, () => {
  switch (props.type) {
    case'interest':
      themeColor.value = '#006ab6'
      textOptionByType.value = {
        title: '客户关注TOP10',
        name: {text: '热点', width: '20%'},
        num: {text: '数量', width: '20%'},
        percent: {text: '占比', width: '15%'},
        belong: {text: '归属类型', width: ''},
      }
      break
    case'painSpot':
      themeColor.value = '#ECB73F'
      textOptionByType.value = {
        title: '客户痛点TOP10',
        name: {text: '痛点', width: '20%'},
        num: {text: '负面体验数量', width: '20%'},
        percent: {text: '负面体验占比', width: '15%'},
        belong: {text: '归属环节', width: ''},
      }
      break
  }
}, {immediate: true})
const emits = defineEmits(['click'])

const maxPercent = ref(0)
const rowClickHandler = (row) => {
  emits('click', row)
}

const buildDataForShow = (data) => {
  const result: (ChartGridListData | Record<string, never>)[] = []
  for (let i = 0; i < 10; i++) {
    const currentData = data[i]
    if (currentData) {
      maxPercent.value = Math.max(maxPercent.value, currentData.percent)
      result.push(currentData)
    } else {
      result.push({})
    }
  }
  return result
}

</script>

<style lang="less" scoped>
.grid-list {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
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
        height: 40px;
        background: v-bind(themeColor);
        width: 48px;
        font-size: 13px;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 1.1em;
      }

      .row {
        font-size: 12px;
        font-weight: 400;

        td {
          border: 1px solid #D8E1E5;
          position: relative;
          white-space: nowrap;

          &:last-child {
            white-space: normal;
            padding: 0 5px;
            border: 1px solid #D8E1E5;
          }
        }

        &:hover {
          background-color: var(--el-color-primary-light-9);
        }

        &__name {
          font-family: "PingFang SC", "黑体", "Microsoft YaHei", sans-serif;
          font-weight: bold;
          font-size: 13px;
          white-space: normal !important;
          line-height: 1.2em;
        }

        &__index {
          text-align: center;

          &__text {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: v-bind(themeColor);
            border-radius: 50%;
            width: 22px;
            height: 22px;
            color: white
          }
        }

        &__belong {
          text-align: left;
          position: relative;

          &__text {
            white-space: normal !important;
            overflow: hidden;
            //text-overflow: ellipsis;
            //display: -webkit-box;
            //-webkit-box-orient: vertical;
            //-webkit-line-clamp: 2; /* 这里是超出几行省略 */
          }
        }
      }

      .progress {
        overflow: hidden;
        height: 4px;
        background: #dddddd;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        &--empty {
          background: transparent;
        }

        &__bar {
          height: 100%;
          background: v-bind(themeColor);
          border-radius: 0 4px 4px 0;
          transition: width 0.5s ease-out;

          &--full {
            border-radius: 0;
          }
        }
      }


    }
  }
}

.full-height {
  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}

</style>
