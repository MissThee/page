<template>
  <div class="group-progress">
    <div class="main-panel" :style="{height:getScrollHeight()+'px'}" ref="mainPanelRef">
      <el-scrollbar v-if="dataForShow&&dataForShow.length">
        <div v-for="(item,index) in dataForShow" :key="index"
             class="row"
             :class="{
               'row--clickable':clickable,
               'row--active':clickable && activeId&&activeId===item.id,
             }"
             :style="{height:rowHeight+'px'}"
             @click="clickHandler(item,index)"
             @mouseover="(e)=>$emit('mouseover',e,item,index)"
             @mousemove="(e)=>$emit('mousemove',e,item,index)"
             @mouseleave="(e)=>$emit('mouseleave',e,item,index)"
        >
          <div class="wrapper">
            <div :style="{width: checkBoxWidth+'px'}">
              <el-radio-group :value="!!(clickable && activeId&&activeId===item.id)">
                <el-radio :label="true" style="margin-left: 12px">{{ '' }}</el-radio>
              </el-radio-group>
            </div>
            <div class="label" ref="labelRef" :style="{width:`${labelWidth}px`}">{{ item.name }}</div>
            <div class="line-list"
                 :style="{
                    margin:`${lineMargin}px`,
                    marginLeft:`${lineMarginLeft}px`,
                    marginRight:`${lineMarginRight}px`,
                    width:`calc((100% - ${labelWidth + checkBoxWidth + percentWidth + lineMargin + lineMarginLeft + lineMarginRight}px))`
                 }">
              <div class="line"
                   v-for="settingItem in setting.map(e=> ({...e, key:e.key +(showType==='num'?'':'Percent')}) )"
                   :key="settingItem.key"
                   :style="{width:`${(maxValue?item[settingItem.key]/maxValue:0)*100}%`, backgroundColor:settingItem.color}">
                <div class="percent" :style="{width:percentWidth+'px',right:-(lineMargin)+'px'}">
                  {{ percentDigitalFormatter(item[settingItem.key]) || '' }}
                  <span v-if="showType!=='num'">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div v-else :style="{backgroundImage:`url('${Assets.emptyData}')`}" class="empty-data"/>
    </div>
  </div>
</template>
<script>
import * as Assets from './assets'
import {percentDigitalFormatter} from "index/views/customerVoice/components/NumFormatter";

const rowHeight = 73
const labelWidthMin = 60
const labelWidthMax = 120
const checkBoxWidth = 26
const percentWidth = 35
const lineMargin = 4
const lineMarginLeft = lineMargin
const lineMarginRight = 14

export default {
  name: "GroupProgress",
  props: {
    setting: {
      type: Array,
      default() {
        return []
      }
    },
    activeId: [Number, String],
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showType: String,// 'percent' | 'num',
    clickable: Boolean,
    scrollHeight: Number
  },
  data() {
    return {
      labelWidth: labelWidthMin,
      maxValue: 8,
      dataForShow: [],
      checkBoxWidth, percentWidth, lineMarginLeft, lineMarginRight, lineMargin, rowHeight,
      Assets
    }
  },
  methods: {
    percentDigitalFormatter,
    getMaxLineValue(dataArr) {
      return dataArr.reduce((m, item) => Math.max(...this.setting.map(e => item[e.key + (this.showType === 'num' ? '' : 'Percent')]), m), 0)
    },
    clickHandler(item, index) {
      if (this.clickable) {
        this.$emit('click', item, index)
      }
    },
    updateLabelWidth() {
      this.$nextTick(() => {
        this.labelWidth = 0
        this.data.forEach(e => {
          let labelLength = 0
          for (let i = 0; i < e.name.length; i++) {
            if (encodeURI(e.name.charAt(i)).length === 9) {
              labelLength += 18 // 中文宽度
            } else {
              labelLength += 11
            }
          }
          this.labelWidth = Math.max(this.labelWidth, labelLength)
        })
        this.labelWidth = Math.min(this.labelWidth, (this.$refs.mainPanelRef.getBoundingClientRect().width / 5 * 2) || labelWidthMax)
        this.labelWidth = Math.max(labelWidthMin, this.labelWidth)
      })
    },
    updateDataForShow() {
      this.maxValue = this.getMaxLineValue(this.data)
      this.dataForShow = this.data
    },
    getScrollHeight() {
      if (typeof this.scrollHeight === 'number') {
        return this.scrollHeight
      }
      if (this.scrollHeight?.min !== undefined && this.scrollHeight?.max !== undefined) {
        const tmp = this.scrollHeight
        const realTotalHeight = (tmp?.rowNum || this.data.length) * rowHeight
        return Math.max(Math.min(realTotalHeight, tmp.max), tmp.min)
      }
    }
  },
  mounted() {
    this.updateDataForShow()
    this.updateLabelWidth()
    window.addEventListener('resize', this.updateLabelWidth)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateLabelWidth)
  },
  watch: {
    activeId() {
      this.updateDataForShow()
    },
    data: {
      handler() {
        this.updateDataForShow()
        this.updateLabelWidth()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.group-progress {
  height: 100%;
  position: relative;

  .empty-data {
    position: absolute;
    top: 0;
    left: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    bottom: 0;
    right: 0;
    opacity: 0.7
  }

  .main-panel {
    position: relative;
    display: flex;
    flex-direction: column;

    ::v-deep .el-scrollbar {
      width: 100%;
      position: relative;
      overflow: hidden;

      &__view {
        overflow: hidden;
        position: relative;
        min-height: 100%;
        padding: 0;
        margin: 0;
      }

      &__bar {
        display: none;
      }

      &__wrap {
        overflow-x: hidden;
        margin-bottom: 0 !important;
      }
    }

    .row {
      margin-right: 10px;
      position: relative;
      white-space: nowrap;
      text-align: left;
      display: flex;
      align-items: center;
      border: 2px solid transparent;

      &--clickable {
        cursor: pointer;
      }

      &:hover {
        background-color: #F5F7FC;
      }

      &--active {
        background-color: #F5F7FC;
      }

      .wrapper {
        position: relative;
        min-height: 40px;
        width: 100%;
        height: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;

        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4px 6px;
          min-height: 2em;
          word-break: break-all;
          vertical-align: middle;
          white-space: normal;
          position: relative;
          font-size: inherit;
          //font-weight: 600;
          color: #333;
          line-height: 1.2em;
          //background-color: #f3f3f3;
          border-radius: 6px;
        }

        .line-list {
          display: inline-block;

          .line {
            width: 0;
            transition: all 0.3s ease-out;
            position: relative;
            height: 16px;
            vertical-align: middle;
            font-size: inherit;
            margin-bottom: 2px;
            //border-radius: 0 10px 10px 0;

            &:last-child {
              margin: 0;
            }

            .percent {
              white-space: nowrap;
              font-size: 12px;
              font-weight: normal;
              position: absolute;
              top: 50%;
              transform: translate(100%, -50%);
            }
          }
        }
      }
    }
  }
}
</style>
