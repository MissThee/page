<template>
  <div class="date-selector" v-if="dateBtnDataForShow?.length">
    <div class="btn-wrapper" v-if="props.showType==='button'">
      <div
          class="active-gb"
          :class="{
          'active-gb--no-trans':dateBtnActiveIndexPre===null,
          'active-gb--inactive':dateBtnActiveIndex===null
        }"
          :style="{left:`${dateBtnActiveLeftPx}px`}"
      >
      </div>
      <span v-for="(dateBtn,index) in dateBtnDataForShow"
            :key="index"
            class="date-btn"
            :class="{'date-btn--active':dateBtnActiveIndex===index}"
            @click="dateBtnClickHandler(dateBtn,index)">
          {{ dateBtn.name }}
      </span>
    </div>
    <div class="selector-wrapper" v-else-if="props.showType==='select'">
      <span class="label">时间单位:</span>
      <el-select v-model="dateBtnActiveIndex"
                 @change="dateBtnClickHandler(dateBtnDataForShow[dateBtnActiveIndex],dateBtnActiveIndex)">
        <el-option v-for="(item,index) in dateBtnDataForShow" :key="index" :label="item.name" :value="index"/>
      </el-select>
    </div>
    <div class="selector-wrapper">
      <span v-if="props.showType==='select'" class="label">选择时间:</span>
      <div class="date-picker">
        <el-popover ref="quarterPopoverRef" v-if="activeBtn.type===DateType.quarter" placement="bottom-end" :width="335"
                    trigger="click" popper-class="dateSelectorPopover">
          <el-card class="box-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-link icon="DArrowLeft"
                         @click="dateSelected=dayjs(dateSelected).add(-1,'year').format(dateSelectorValueFormat)"/>
                <div>{{ dateSelected.substring(0, 4) }}年</div>
                <el-link icon="DArrowRight"
                         @click="dateSelected=dayjs(dateSelected).add(1,'year').format(dateSelectorValueFormat)"/>
              </div>
            </template>
            <div class="item">
              <el-button v-for="i in 4"
                         link
                         :key="i"
                         class="quarter-item"
                         :disabled="disableQuarters(i)"
                         :class="{
                        'quarter-item--active': Math.floor((Number(dateSelected?.split?.('-')[1]-1))/3)+1===i,
                        'quarter-item--disable': disableQuarters(i)
                       }"
                         @click="()=> { dateChangeHandler(dateSelected.substring(0,4)+'-'+ (i*3-2)+'-01') }">
                {{ `Q${i}` }}
              </el-button>
            </div>
          </el-card>
          <template #reference>
            <el-input :value="dateShowText" readonly prefix-icon="Calendar"/>
          </template>
        </el-popover>
        <div v-else>
          <el-date-picker ref="dateSelectorRef" :type="activeBtn.pickerType" :clearable="false"
                          :value-format="dateSelectorValueFormat" v-model="dateSelected" @change="dateChangeHandler"
                          :disabled-date="disabledDateForReport"/>
          <el-input :value="dateShowText" style="position: absolute;left: 0" readonly prefix-icon="Calendar"
                    @click="weekSelectStartHandler"/>
        </div>
      </div>
    </div>
  </div>
</template>/home/mt/ActivePython-2.7
<script lang="ts">

export default {
  name: 'DateSelector'
}

// 时间选择，change事件，用户点选时间触发，返回选择结果
// 日 {time_cycle: 1, time_value: '2023-05-11'}
// 周 {time_cycle: 2, time_value: '2023-19'}
// 月 {time_cycle: 3, time_value: '2023-5'}
// 季 {time_cycle: 4, time_value: '2023-Q2'}
// 年 {time_cycle: 5, time_value: '2023'}

// 直接获取组件默认值 可使用组件暴露的getParam方法获取当前值
// 或使本组件export 的 getParamByDateType方法产生指定维度默认值

</script>
<script lang="ts" setup>
import {ref, watch} from "vue"
import {DateType, btnDate, BtnData, getParamByDateType, dateSelectorValueFormat} from "./DateSelectorStatic.ts";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import {disabledDateForReport} from "@/utils/utils.ts";

dayjs.extend(advancedFormat)

const props = withDefaults(defineProps<{
  showType?: "select" | 'button'
  enableBtn?: DateType[] // 哪些按钮是可用的，无此参数则都可用
}>(), {
  showType: 'select'
})

const getYesterday = () => dayjs().add(-1, 'day')

const dateBtnDataForShow = ref<BtnData[]>([])
watch(() => props.enableBtn, () => {
  dateBtnDataForShow.value = btnDate.filter(e => props.enableBtn ? props.enableBtn.includes(e.type) : true) || []
}, {immediate: true, deep: true})
const emits = defineEmits(["change", "reset"])
// 按钮激活背景位置辅助参数
const dateBtnActiveIndexPre = ref<number | null>(0)
const dateBtnActiveIndex = ref<number | null>(0)
const dateBtnActiveLeftPx = ref<number | null>(0)

let activeBtn = ref<BtnData>(dateBtnDataForShow.value[0])

const initValue = getParamByDateType(activeBtn.value.type, undefined, true)
const dateSelected = ref<string>(initValue.valueForComponent as string)
const dateShowText = ref<string>(initValue.textForComponent as string)
let dateSelectedForRequest = initValue.time_value

const disableQuarters = (quarterNum: 1 | 2 | 3 | 4) => {// 季度按钮禁用
  const quarterMonth = (quarterNum - 1) * 3 + 1
  const quarterDate= dayjs(dateSelected.value.substring(0, 4) + '-' + quarterMonth + '-01').toDate()
  return disabledDateForReport(quarterDate)
}

// 按钮切换事件
const dateBtnClickHandler = (dateBtn: BtnData, index) => {
  dateBtnActiveIndexPre.value = dateBtnActiveIndex.value
  dateBtnActiveIndex.value = index
  dateBtnActiveLeftPx.value = 52 * index
  activeBtn.value = dateBtn
  dateSelected.value = getYesterday().format(dateSelectorValueFormat)
  if (!activeBtn.value) {
    return
  }
  const dateTmp = getParamByDateType(activeBtn.value.type, undefined, true)
  dateSelectedForRequest = dateTmp.time_value
  dateShowText.value = dateTmp.textForComponent as string
  changeEmit()
}

// 时间选择事件（除季度
const dateChangeHandler = (date: string) => {
  if (!activeBtn.value) {
    return
  }
  dateSelected.value = date

  const dateTmp = getParamByDateType(activeBtn.value.type, new Date(date), true)
  dateSelectedForRequest = dateTmp.time_value
  dateShowText.value = dateTmp.textForComponent as string
  changeEmit()
}

// 时间选择事件（季度
const quarterPopoverRef = ref()


// 时间选择(周
const dateSelectorRef = ref()
const weekSelectStartHandler = () => {
  dateSelectorRef.value.handleOpen()
}

const changeEmit = () => {
  emits('change', {time_cycle: activeBtn.value.type, time_value: dateSelectedForRequest})
}

// 重置为第一个可用按钮的默认值
const reset = () => {
  dateBtnActiveIndexPre.value = dateBtnActiveIndex.value
  dateBtnActiveIndex.value = 0
  dateBtnActiveLeftPx.value = 0
  activeBtn.value = dateBtnDataForShow.value[0]
  dateSelected.value = getYesterday().format(dateSelectorValueFormat)
  if (!activeBtn.value) {
    return
  }
  const dateTmp = getParamByDateType(activeBtn.value.type, undefined, true)
  dateSelectedForRequest = dateTmp.time_value
  dateShowText.value = dateTmp.textForComponent as string
  emits('reset', {time_cycle: activeBtn.value.type, time_value: dateSelectedForRequest})
}

const getParams = () => ({time_cycle: activeBtn.value.type, time_value: dateSelectedForRequest})
defineExpose({getParams, reset})

</script>
<style scoped lang="less">
.date-selector {
  text-align: left;
  display: flex;
  align-items: center;

  .label {
    white-space: nowrap;
    margin-right: 5px;
  }

  .selector-wrapper {
    display: flex;
    margin-right: 10px;
    align-items: center;
    white-space: nowrap;
  }

  .btn-wrapper {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    display: inline-block;
    margin-right: 10px;
    white-space: nowrap;
    background-color: white;
    border-radius: 6px;
    position: relative;

    .active-gb {
      pointer-events: none;
      width: calc(52px - 2px);
      margin-top: 1px;
      margin-left: 1px;
      height: calc(var(--el-component-size) - 2px);
      position: absolute;
      background: #ECF3FF;
      border-radius: 6px;
      transition: all 0.3s ease-in-out;

      &--inactive {
        opacity: 0;
      }

      &--no-trans {
        transition: opacity 0.3s ease-in-out;
      }
    }

    .date-btn {
      user-select: none;
      display: inline-block;
      text-align: center;
      width: 52px;
      height: var(--el-component-size);
      font-size: 13px;
      line-height: var(--el-component-size);
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.3s ease-in-out;
      position: relative;
      font-family: PingFangSC-Medium, PingFang SC, "Microsoft YaHei", sans-serif;

      &:hover {
        color: var(--el-color-primary)
      }

      &--active {
        color: var(--el-color-primary);
        pointer-events: none;
      }
    }
  }

  .date-picker {
    position: relative;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      width: 100%;
    }

    &--button {
      :deep(.el-input) {
        width: 160px;
      }
    }
  }
}

.box-card {
  :deep(.el-card__header) {
    padding: 10px 15px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
  }

  .item {
    display: flex;
    justify-content: space-around;

    .quarter-item {
      color: #606266;
      font-size: 12px;

      &--active {
        color: var(--el-color-primary) !important;
      }

      &--disable {
        cursor: not-allowed;
        color: var(--el-disabled-text-color) !important;
      }
    }

  }
}
</style>