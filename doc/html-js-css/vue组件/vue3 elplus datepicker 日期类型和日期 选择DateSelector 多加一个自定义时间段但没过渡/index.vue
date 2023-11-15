<template>
  <div class="date-selector" v-if="dateBtnDataForShow?.length">
    <div class="btn-wrapper">
      <span v-for="(dateBtn,index) in dateBtnDataForShow"
            :key="index"
            class="date-btn"
            :class="{'date-btn--active':dateBtnActiveIndex===index}"
            @click="dateBtnClickHandler(dateBtn,index)">
          {{ dateBtn.name }}
      </span>
    </div>
    <div class="date-picker">
      <el-popover ref="quarterPopoverRef" v-if="activeBtn.type===DateType.quarter" placement="bottom" :width="335" trigger="click" popper-class="dateSelectorPopover">
        <el-card class="box-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-link icon="DArrowLeft" @click="dateSelected=dayjs(dateSelected).add(-1,'year').format(dateSelectorValueFormat)"/>
              <div>{{ dateSelected.substring(0, 4) }}年</div>
              <el-link icon="DArrowRight" @click="dateSelected=dayjs(dateSelected).add(1,'year').format(dateSelectorValueFormat)"/>
            </div>
          </template>
          <div class="item">
            <el-button v-for="i in 4"
                       link
                       :key="i"
                       class="quarter-item"
                       :disabled="disableQuarters(i)"
                       :class="{
                        'quarter-item--active': Math.floor((Number(dateSelected?.split?.('-')[1]||0)-1)/3)+1===i,
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
      <div v-else-if="activeBtn.type===DateType.custom">
        <el-date-picker ref="dateSelectorRef" :type="activeBtn.pickerType" :clearable="false" style="width: 300px" @calendar-change="customDatePickHandler" :value-format="dateSelectorValueFormat" v-model="dateSelected" @change="dateChangeHandler" :disabled-date="(e:any)=>disabledDateForReport(e) || disabledDateForCustom(e)"/>
        <el-input :value="dateShowText" style="position: absolute;left: 0;width: 300px" readonly prefix-icon="Calendar" @click="weekSelectStartHandler"/>
      </div>
      <div v-else>
        <el-date-picker ref="dateSelectorRef" :type="activeBtn.pickerType" :clearable="false" :value-format="dateSelectorValueFormat" v-model="dateSelected" @change="dateChangeHandler" :disabled-date="disabledDateForReport"/>
        <el-input :value="dateShowText" style="position: absolute;left: 0" readonly prefix-icon="Calendar" @click="weekSelectStartHandler"/>
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
import {DateType, btnDate, BtnData, getParamByDateType, dateSelectorValueFormat, disabledDateForReport} from "./DateSelectorStatic.ts";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

const props = defineProps<{
  enableBtn?: DateType[] // 哪些按钮是可用的，无此参数则都可用
}>()

const getYesterday = () => dayjs().add(-1, 'day')

const dateBtnDataForShow = ref<BtnData[]>([])
watch(() => props.enableBtn, () => {
  dateBtnDataForShow.value = btnDate.filter(e => props.enableBtn ? props.enableBtn.includes(e.type) : true) || []
}, {immediate: true, deep: true})
const emits = defineEmits(["change"])
// 按钮激活背景位置辅助参数
const dateBtnActiveIndex = ref<number | null>(0)

let activeBtn = ref<BtnData>(dateBtnDataForShow.value[0])

const initValue = getParamByDateType(activeBtn.value.type, undefined, true)
const dateSelected = ref<string>(initValue.valueForComponent as string)
const dateShowText = ref<string>(initValue.textForComponent as string)
let dateSelectedForRequest = initValue.time_value

// const disableQuarters = (index: number) => {// 季度按钮禁用
//   const dateTmp = getYesterday().toDate()
//   const yearActive = Number(dateSelected.value.substring(0, 4))
//   if (yearActive < dateTmp.getFullYear()) {
//     return false
//   }
//   if (yearActive === dateTmp.getFullYear()) {
//     return index > Math.ceil((dateTmp.getMonth() + 1) / 3)
//   }
//   if (yearActive > dateTmp.getFullYear()) {
//     return true
//   }
// }

const disableQuarters = (quarterNum: 1 | 2 | 3 | 4) => {// 季度按钮禁用
  const quarterMonth = (quarterNum - 1) * 3 + 1
  const quarterDate = dayjs(dateSelected.value.substring(0, 4) + '-' + quarterMonth + '-01').toDate()
  return disabledDateForReport(quarterDate)
}

// 按钮切换事件
const dateBtnClickHandler = (dateBtn: BtnData, index: number) => {
  dateBtnActiveIndex.value = index
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
  console.log('zzzzzzzzzzzz', date)
  if (!activeBtn.value) {
    return
  }
  dateSelected.value = date

  const dateTmp = getParamByDateType(activeBtn.value.type, activeBtn.value.type === DateType.custom ? [new Date(date[0]), new Date(date[1])] : new Date(date), true)
  console.log('aaaaa', dateTmp)
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

// custom时间模式下，限制跨度为100天
let customDateCurrent: [null | Date, null | Date] = [null, null]
const customDatePickHandler = (date: [Date, null | Date]) => {
  customDateCurrent = date
}
const disabledDateForCustom = (date: Date) => {
  if (customDateCurrent[0] !== null && customDateCurrent[1] === null) {
    if (date.getTime() <= dayjs(customDateCurrent[0]).add(-100, "day").toDate().getTime() || date.getTime() >= dayjs(customDateCurrent[0]).add(100, "day").toDate().getTime()) {
      return true
    }
  }

}

const getParams = () => ({time_cycle: activeBtn.value.type, time_value: dateSelectedForRequest})
defineExpose({getParams})


</script>
<style scoped lang="less">
.date-selector {
  text-align: left;
  display: flex;
  align-items: center;

  .btn-wrapper {
    //box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    display: inline-block;
    margin-right: 10px;
    white-space: nowrap;
    background-color: white;
    //border-radius: 6px;
    position: relative;


    .date-btn {
      user-select: none;
      display: inline-block;
      text-align: center;
      width: 52px;
      height: var(--el-component-size);
      font-size: 13px;
      line-height: var(--el-component-size);
      cursor: pointer;
      //border-radius: 6px;
      transition: background-color 0.2s ease-in-out;
      position: relative;
      font-family: PingFangSC-Regular, "PingFang SC", 'Microsoft YaHei', Helvetica, Arial, sans-serif;
      background-color: #F3F3F3;
      margin-right: 1px;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        color: var(--el-color-primary);
        box-shadow: 0 0 1px 1px var(--el-color-primary) inset;
      }

      &--active {
        background: #054A9A;
        pointer-events: none;
        color: white;
      }
    }
  }

  .date-picker {
    position: relative;

    :deep(.el-input) {
      width: 160px;
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