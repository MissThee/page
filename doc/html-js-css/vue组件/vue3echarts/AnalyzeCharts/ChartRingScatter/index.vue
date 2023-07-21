<template>
  <div class="chart-ring-scatter">
    <div class="header">
      <div class="charts-title">{{ props.title }}</div>
      <div class="legend-wrapper">
        <div class="legend" v-for="item in settingData" :key="item.name">
          <div class="legend__dot" :style="{backgroundColor:item.color}"/>
          <div class="legend__text">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="body" :style="{height: totalHeight +'px'}">
      <!--  <div style="position: absolute;left:50%;height: 100px;border: 1px solid red"/>-->
      <div class="side"/>
      <div class="dot-line"/>
      <div class="dot-line dot-line--top"/>
      <div class="dot-line dot-line--bottom"/>
      <div class="panel" ref="panelRef">
        <div class="ring-wrapper"
             :class="{'ring-wrapper--active':props.activeId!==null&&props.activeId===item.id}"
             @mousemove="e=>ringEnterHandler(item,e)"
             @mouseenter="e=>ringEnterHandler(item,e)"
             @mouseleave="popoverPosition = {...popoverPosition,x:null,y:null}"
             @click="ringClickHandler(item)"
             v-for="item in dataForShow"
             :key="item.id"
             :style="{
                height:(item.r-minGap)*2+'px',
                width:(item.r-minGap)*2+'px',
                top:-item.y+'px',
                left:item.x+'px'
              }"
        >
          <SingleRing class="chart" :props="settingData" :data="item"/>
          <div class="info" :style="{transform:`translate(0%,-50%) scale(${ Math.min(item.r/(totalHeight/2/2),1)})`}">
            <div class="name">{{ item.name }}</div>
            <!--            <div class="percent">正面:{{ percentDigitalFormatter(item.positivePercent) }}%</div>-->
            <!--            <div class="percent">负面:{{ percentDigitalFormatter(item.negativePercent) }}%</div>-->
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
              <td>{{ dataForHover.name }}</td>
              <td>{{ dataForHover.total }}</td>
              <td v-if="dataForHover.percent">{{ percentDigitalFormatter(dataForHover.percent) || 0 }}%</td>
            </tr>
            <tr class="split"/>
            <template v-for="p in settingData" :key="p.key">
              <tr>
                <td>
                  <div :style="{backgroundColor:p.color}" style="width: 8px;height:8px;display: inline-block;margin-right: 5px;"/>
                  <span>{{ p.name }}</span>
                </td>
                <td>{{ dataForHover[p.key] }}</td>
                <td>
                  <span>{{ percentDigitalFormatter(dataForHover[p.key + 'Percent']) }}</span>
                  <span v-if="dataForHover[p.key + 'Percent'] !== undefined">%</span>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ChartRingScatter',
}
</script>
<script lang="ts" setup>
import SingleRing from "./SingleRing.vue";
import {percentDigitalFormatter} from "../NumFormatter";
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import setBubbleInRect from "./setBubbleInRect.ts";
import {colorNegative, colorNeutral, colorPositive} from "@/components/AnalyzeCharts/ChartColors.ts";

const settingData: { key: string, name: string, color: string }[] = [
  {key: 'positive', name: '正面体验', color: colorPositive},
  {key: 'neutral', name: '中立体验', color: colorNeutral},
  {key: 'negative', name: '负面体验', color: colorNegative},
]
const props = withDefaults(defineProps<{
  title?: string,
  data: ChartRingScatterData[],
  activeId?: number | null
}>(), {
  data: () => [],
  activeId: null
})

const totalHeight = 300
const minGap = 1

const panelRef = ref()
const popoverRef = ref()
const dataForShow = ref<ChartRingScatterDataForShow[]>([])


const emits = defineEmits(['click'])

watch(() => props.data, () => {
  setDataForShow()
}, {deep: true})

onMounted(() => {
  setDataForShow()
  window.addEventListener('resize', setDataForShow)
})

onUnmounted(() => {
  window.removeEventListener('resize', setDataForShow)
})

const setDataForShow = () => {
  const dataLength = props.data.filter(e => e.total).length || props.data.length
  if (!dataLength) {
    dataForShow.value = []
    return
  }
  let dataForShowTmp = setBubbleInRect(props.data, totalHeight / 2 / 2, totalHeight, panelRef.value.clientWidth)
  const allBubbleRect = {
    left: panelRef.value.clientWidth,
    right: 0,
    top: 0,
    bottom: 0,
  }
  let allBubbleWidth = 0
  let allBubbleHeight = 0
  let verticalSideBubbleMaxDistance = 0
  let bubbleMaxY = 0
  dataForShowTmp.forEach((e, i) => {
    allBubbleRect.left = Math.min(allBubbleRect.left, e.x - e.r)
    allBubbleRect.right = Math.max(allBubbleRect.right, e.x + e.r)
    allBubbleRect.top = Math.max(allBubbleRect.top, e.y + e.r)
    allBubbleRect.bottom = Math.min(allBubbleRect.bottom, e.y - e.r)
    verticalSideBubbleMaxDistance = Math.max(verticalSideBubbleMaxDistance, Math.abs(e.y) + e.r)
    bubbleMaxY = Math.max(bubbleMaxY, Math.abs(e.y))
  })
  allBubbleWidth = Math.max(0, allBubbleRect.right - allBubbleRect.left)
  allBubbleHeight = Math.max(0, allBubbleRect.top - allBubbleRect.bottom)

  // 总高度不够时，按比例纵向移动
  const yMoveDistanceMax = totalHeight / 2 - verticalSideBubbleMaxDistance
  dataForShowTmp.forEach(e => {
    e.y = e.y + (bubbleMaxY ? yMoveDistanceMax * e.y / bubbleMaxY : 0)
  })

  // 总宽度超出时，按比例减小圆半径
  if (allBubbleWidth > panelRef.value.clientWidth) {
    const scaleRate = panelRef.value.clientWidth / allBubbleWidth
    dataForShowTmp.forEach(e => {
      if (e.y > 0) {
        e.y = e.y + e.r * (1 - scaleRate)
      } else if (e.y < 0) {
        e.y = e.y - e.r * (1 - scaleRate)
      }
      e.x = panelRef.value.clientWidth / 2 + (e.x - panelRef.value.clientWidth / 2) * scaleRate
      e.r = e.r * scaleRate
    })
  }
  const scaleRate = panelRef.value.clientWidth / allBubbleWidth
  if (allBubbleWidth < panelRef.value.clientWidth) {
    dataForShowTmp.forEach(e => {
      e.x = panelRef.value.clientWidth / 2 + (e.x - panelRef.value.clientWidth / 2) * scaleRate
    })
  }
  // 修正中心对齐
  dataForShowTmp.forEach(e => {
    e.x = e.x - (Math.abs(allBubbleRect.right - panelRef.value.clientWidth / 2) - Math.abs(panelRef.value.clientWidth / 2 - allBubbleRect.left)) / 2 * scaleRate
  })
  dataForShow.value = dataForShowTmp
}
// ----------------- 悬浮窗 ----------------

const dataForHover = ref<ChartRingScatterDataForShow>()
const popoverPosition = ref<{ x: number | null, y: number | null, isLeftSide: boolean }>({x: null, y: null, isLeftSide: false})
const ringEnterHandler = (item, e: MouseEvent) => {
  dataForHover.value = item
  nextTick(() => {
    if (e) {
      const popoverRect = popoverRef.value.getBoundingClientRect()
      const panelRect = panelRef.value.getBoundingClientRect()
      popoverPosition.value = {
        x: item.x + e.offsetX - item.r,
        y: Math.min(-item.y + e.offsetY - item.r, totalHeight / 2 - popoverRect.height),
        isLeftSide: false,
      }
      popoverPosition.value.isLeftSide = panelRect.width - popoverPosition.value.x < popoverRect.width
    }
  })
}


const ringClickHandler = (item) => {
  emits('click', item)
}

</script>

<style lang="less" scoped>
.chart-ring-scatter {
  height: 100%;
  position: relative;

  .header {
    left: 0;
    margin: 0 30px 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9;

    .legend-wrapper {
      display: flex;
      align-items: center;
      white-space: nowrap;

      .legend {
        display: flex;
        align-items: center;
        white-space: nowrap;

        &__dot {
          width: 10px;
          height: 10px;
          //border-radius: 50%;
        }

        &__text {
          margin-left: 5px;
          font-size: 14px;
          color: #4E5969;
        }
      }

      .legend + .legend {
        margin-left: 30px;
      }
    }
  }

  .body {
    position: relative;

    .dot-line {
      z-index: 1;
      position: absolute;
      height: 2px;
      top: 50%;
      left: 0;
      right: 0;
      //background-image: linear-gradient(to right, #f6f3f3 0%, #f6f3f3 70%, transparent 70%);
      //background-size: 30px;
      //background-repeat: repeat-x;
      background-color: #F2F3F5;

      &--top {
        top: 0;
      }

      &--bottom {
        top: 100%
      }
    }

    .side {
      z-index: 2;
      position: absolute;
      left: 0;
      top: 0;
      width: 8px;
      height: 100%;
      background: linear-gradient(180deg, #165DFF 0%, rgba(22, 93, 255, 0.4) 20%, #FFFFFF 50%, rgba(242, 127, 66, 0.4) 80%, #F27F42 100%);
    }

    .panel {
      position: absolute;
      top: 50%;
      left: 10px;
      right: 10px;
      z-index: 10;

      .ring-wrapper {
        transition: transform 0.3s ease-out, box-shadow 0.2s 0.1s ease-out;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: 1;
        color: inherit;

        &--active {
          z-index: 2;
          color: #333;
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        &:hover {
          color: #333;
          z-index: 2;
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        }

        &:active {
          color: #333;
          z-index: 2;
          transform: translate(-50%, -50%) scale(1.03);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        }

        .chart {
          pointer-events: none;
          z-index: 1;
        }

        .info {
          line-height: 1.2em;
          pointer-events: none;
          z-index: 2;
          position: absolute;
          margin-left: 5%;
          width: 90%;
          top: 50%;
          font-size: 17px;
          color: inherit;
          text-align: center;
          transform: translate(0, -50%);
          text-shadow: 0 0 5px white;

          .name {
            word-break: break-all;
            white-space: normal;
            margin-bottom: 2px;
            font-weight: 500;
          }

          .percent {
            white-space: nowrap;
            font-size: 16px;
          }
        }


      }
    }

    .popover {
      transition: opacity 0.3s ease-out;
      position: absolute;
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
  }
}
</style>
