<template>
  <div class="date-selector" v-if="dateBtnDataForShow&&dateBtnDataForShow.length">
    <div class="btn-wrapper">
      <span v-for="(dateBtn,index) in dateBtnDataForShow"
            :key="index"
            class="date-btn"
            :class="{'date-btn--active':dateBtnActiveIndex===index}"
            @click="dateBtnClickHandler(dateBtn,index)">
          {{ dateBtn.name }}
      </span>
    </div>
    <div class="selector-wrapper">
      <div class="date-picker">
        <el-popover v-if="activeBtn.type===DateType.quarter" placement="bottom-start" :width="335"
                    trigger="click" popper-class="dateSelectorPopover">
          <div class="box-card">
            <div class="card-header">
              <el-link icon="el-icon-d-arrow-left"
                       @click="dateSelected=dayjs(dateSelected).add(-1,'year').format(formatStrForDayJs)"/>
              <div>{{ dateSelected.substring(0, 4) }}年</div>
              <el-link icon="el-icon-d-arrow-right"
                       @click="dateSelected=dayjs(dateSelected).add(1,'year').format(formatStrForDayJs)"/>
            </div>
            <div class="item">
              <el-button v-for="i in 4"
                         link
                         :key="i"
                         class="quarter-item"
                         :disabled="disableQuarters(i)"
                         :class="{
                        'quarter-item--active': Math.floor((Number(dateSelected.split('-')[1]-1))/3)+1===i,
                        'quarter-item--disable': disableQuarters(i)
                       }"
                         @click="()=> { dateChangeHandler(dateSelected.substring(0,4)+'-'+ (i*3-2)+'-01') }">
                {{ `Q${i}` }}
              </el-button>
            </div>
          </div>
          <template v-slot:reference>
            <el-input size="small" :value="dateShowText" readonly prefix-icon="Calendar"/>
          </template>
        </el-popover>
        <div v-else>
          <el-date-picker size="small" ref="dateSelectorRef" :type="activeBtn.pickerType" :key="activeBtn.pickerType" :clearable="false"
                          :value-format="formatStrForComponent" v-model="dateSelected" @change="dateChangeHandler"
                          :picker-options="{disabledDate:disabledDateForReport}"/>
          <el-input :value="dateShowText" size="small" style="position: absolute;left: 0" readonly prefix-icon="Calendar"
                    @click.native="weekSelectStartHandler"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {DateType, btnDate, getParamByDateType, formatStrForComponent, formatStrForDayJs} from "./DateSelectorStatic.js";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export default {
  name: "DateSelector",
  data() {
    return {
      dateBtnDataForShow: btnDate,
      dateBtnActiveIndex: 0,
      activeBtn: btnDate[0],
      dateSelected: '',
      dateShowText: '',
      dateSelectedForRequest: '',
      DateType,
      dayjs,
      formatStrForComponent,
      formatStrForDayJs
    }
  },
  created() {
    this.updateSelectedVal()
  },
  methods: {
    // 按钮切换事件
    dateBtnClickHandler(dateBtn, index) {
      this.dateBtnActiveIndex = index
      this.activeBtn = dateBtn
      if (!this.activeBtn) {
        return
      }
      this.updateSelectedVal()
      this.changeEmit()
    },
    dateChangeHandler(dateStr) {
      if (!this.activeBtn) {
        return
      }
      this.updateSelectedVal(new Date(dateStr))
    },
    weekSelectStartHandler() {
      console.log('zzz', this.$refs.dateSelectorRef)
      this.$refs.dateSelectorRef.handleFocus()
    },
    reset() {
      this.dateBtnActiveIndex = 0
      this.activeBtn = this.dateBtnDataForShow[0]
      if (!this.activeBtn) {
        return
      }
      this.updateSelectedVal()
      this.$emit('reset', {time_cycle: this.activeBtn.type, time_value: this.dateSelectedForRequest})
    },
    updateSelectedVal(date = undefined) {
      const dateTmp = getParamByDateType(this.activeBtn.type, date, true)
      this.dateSelected = dateTmp.valueForComponent
      this.dateSelectedForRequest = dateTmp.time_value
      this.dateShowText = dateTmp.textForComponent
    },
    changeEmit() {
      this.$emit('change', {time_cycle: this.activeBtn.type, time_value: this.dateSelectedForRequest})
    },
    getParam() {
      return {time_cycle: this.activeBtn.type, time_value: this.dateSelectedForRequest}
    },
    disableQuarters(quarterNum) {
      const quarterMonth = (quarterNum - 1) * 3 + 1
      const quarterDate = dayjs(this.dateSelected.substring(0, 4) + '-' + quarterMonth + '-01').toDate()
      return this.disabledDateForReport(quarterDate)
    },
    disabledDateForReport(date) {
      return date.getTime() > dayjs().toDate().getTime()
    }
  }

}
</script>

<style scoped lang="scss">
.date-selector {
  text-align: left;
  display: flex;
  align-items: center;

  .label {
    white-space: nowrap;
    margin-right: 5px;
  }

  .selector-wrapper {
    height: 32px;
    white-space: nowrap;
  }

  .btn-wrapper {
    display: inline-block;
    margin-right: 10px;
    white-space: nowrap;
    border-radius: 6px;
    position: relative;
    background-color: #f0f0f0;

    .date-btn {
      user-select: none;
      font-weight: bold;
      display: inline-block;
      text-align: center;
      width: 70px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
      font-family: PingFangSC-Medium, PingFang SC, SimHei, "黑体", "Microsoft YaHei", sans-serif;
      color: #666;

      &:hover {
        color: #0075FF;
      }

      &--active {
        background: #0075FF;
        color: white;
        pointer-events: none;
      }
    }
  }

  .date-picker {
    position: relative;
    display: flex;
    align-items: center;

    ::v-deep .el-input {
      width: 100%;
    }

    ::v-deep .el-input__prefix {
      display: none;
    }

    ::v-deep .el-input__inner {
      padding-left: 10px;
      font-size: 14px;
      width: 100%;
    }
  }
}

.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px
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
