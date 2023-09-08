<template>
  <div class="source-text-table">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
      <div class="operation">
        <span style="margin-right: 10px;margin-left: 6px;color:#4E5969">体验效果: </span>
        <el-select size="small" v-model="paramInner.type" @change="typeChangeHandler">
          <el-option v-for="item in btnData" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>
    </div>
    <div class="bottom">

      <el-table v-loading="isLoading" :data="data" border>
        <el-table-column v-for="c in columns" :key="c.prop" :prop="c.prop" :label="c.label"
                         header-align="center"
                         align="center"
                         label-class-name="table-label"
                         :min-width="c.minWidth||''"
                         :width="c.width||''"
        >
          <template v-if="c.hasPopover" #default="{row,$index,column}">
            <el-popover :width="column.realWidth+30" placement="right-center"
                        :disabled="!isCellTextOverflow[getRefKey(c.prop,$index)]"
                        transition="none"
                        trigger="hover"
                        :persistent="false"
                        popper-class="source-text-popover-panel"
                        :showArrow="false">
              <template v-slot:reference>
                <div class="detail-text" :style="{height: `calc( ${lineHeight}px * 4 )`,lineHeight: `${lineHeight}px`}">
                  <div v-html="c.hasHighlight ? getTextWithHighlight(row,c.prop) : row[c.prop]" class="node-data-target" :node-prop="c.prop" :node-index="$index"/>
                </div>
              </template>
              <el-scrollbar style="position: relative;height: 140px;">
                <div class="detail-text" style="padding-right: 10px">
                  <div v-if="c.hasHighlight" v-html="getTextWithHighlight(row,c.prop)"/>
                  <div v-else>{{ row[c.prop] }}</div>
                </div>
              </el-scrollbar>
            </el-popover>
            <div style="position: absolute;bottom:6px;right:4px;" v-if="isCellTextOverflow[getRefKey(c.prop,$index)]">...</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pager"
          background
          :current-page.sync="paramInner.page"
          :page-size.sync="paramInner.size"
          :total="total"
          layout="->, total, prev, pager, next, sizes, jumper"
          @currentChange="paramChangeHandler"
          @sizeChange="paramChangeHandler"
      />
    </div>
  </div>
</template>
<script>
import {colorNegative, colorNeutral, colorPositive} from "../ChartColors.js";

const lineHeight = 20
const btnData = [
  {id: 'P', name: '正面体验', color: colorPositive},
  {id: 'N', name: '负面体验', color: colorNegative},
  {id: 'M', name: '中立体验', color: colorNeutral}
]

export default {
  name: 'chartSourceTextTable',
  props: {
    title: String,
    columns: Array,// { label: string, prop: string, width?: number, minWidth?: number, hasPopover?: boolean, hasHighlight?: boolean }[]
    param: {
      type: Object,
      default() {
        return {
          type: 'N', //'P' | 'N' | 'M'
          page: 1,
          size: 10,
        }
      }
    },
    isLoading: Boolean,
    data: {
      type: Array,
      default() {
        return []
      },
    },
    total: Number
  },
  data() {
    return {
      paramInner: this.param,
      isCellTextOverflow: {},
      lineHeight,
      btnData
    }
  },
  methods: {
    getRefKey(prop, index) {
      return prop + ',' + index
    },
    updateTableOverflow() {
      this.isCellTextOverflow = {}
      setTimeout(() => {
        Array.from(document.getElementsByClassName('node-data-target')).forEach(el => {
          const key = this.getRefKey(el.getAttribute('node-prop'), el.getAttribute('node-index'))
          // this.isCellTextOverflow[key] = el.clientHeight > lineHeight * 4
          this.$set(this.isCellTextOverflow, key, el.clientHeight > lineHeight * 4)
        })
      })
    },
    typeChangeHandler(id) {
      this.paramInner.type = id
      this.paramChangeHandler()
    },
    getTextWithHighlight(item, prop) {
      let result = ''
      if (item && item[prop] && item.keyword) {
        result = item[prop];
        item.keyword.forEach((hitSentence) => {
          let temp = ''
          if (hitSentence.length === 0) return ''
          temp = hitSentence.replace(/&/g, '&amp;')
          temp = temp.replace(/</g, '&lt;')
          temp = temp.replace(/>/g, '&gt;')
          temp = temp.replace(/\s/g, '&nbsp;')
          temp = temp.replace(/'/g, '&#39;')
          temp = temp.replace(/"/g, '&quot;')
          result = result.replace(hitSentence, `<span class="highlight-text" style="background-color: ${btnData.find(e => e.id === this.param?.type)?.color}" >${temp}</span>`)
        })
      }
      return result
    },
    paramChangeHandler() {
      const tmp = JSON.parse(JSON.stringify(this.param))
      this.$emit('update:param', tmp)
      this.$emit('change', tmp)
    }
  },
  mounted() {
    this.updateTableOverflow()
  },
  watch: {
    param: {
      handler(newVal) {
        this.paramInner = {...this.paramInner, ...newVal || {}}
      },
      deep: true
    },
    data: {
      handler() {
        this.updateTableOverflow()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.source-text-table {
  text-align: left;
  overflow: hidden;
  position: relative;

  .header {
    position: relative;
    padding: 8px 10px;
    white-space: nowrap;
    display: flex;
    align-items: center;

    .operation {
      font-size: 14px;
      display: flex;
      align-items: center;
      vertical-align: bottom;
      margin-left: 10px;

      .select-button {
        user-select: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        margin-right: 24px;

        &__dot {
          display: inline-block;
          width: 14px;
          height: 14px;
          outline: 1px solid #333333;
          border-radius: 50%;
          border: 2px solid white;
          background: #ECB73F;
          margin-right: 4px;
        }

        &__text {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }

  .bottom {
    ::v-deep .table-label {
      color: black;
      font-size: 14px;
      background-color: #F4F6F9 !important;
      border: none;
    }

    .pager {
      margin-top: 5px;
      font-size: 12px;
    }


  }
}

.detail-text {
  text-align: left;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: PingFangSC-Regular, PingFang SC, sans-serif;
  font-weight: 400;
  color: #333333;
  font-size: 15px;
  line-height: 19px;
  position: relative;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}

::v-deep img {
  display: block;
  max-height: 100px !important;
}

::v-deep .highlight-text {
  display: inline;
  padding: 0 3px;
  font-weight: bold;
  line-height: 16px;
  color: white;
  background-color: gray;
}

::v-deep .is-scrolling-none, .el-table {
  overflow: visible;
}
</style>
<style lang="scss">
.source-text-popover-panel {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
