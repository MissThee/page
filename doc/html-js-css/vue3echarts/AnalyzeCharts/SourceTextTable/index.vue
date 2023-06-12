<template>
  <div class="source-text-table">
    <div class="header">
      <div class="operation">
        <div class="select-button" @click="typeClickHandler(btnItem)" v-for="btnItem in btnData" :key="btnItem.id">
          <div class="select-button__dot" :style="{backgroundColor:param.type === btnItem.id? btnItem.color:'transparent'}"/>
          <span class="select-button__text">{{ btnItem.name }}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-table row-key="id" v-loading="props.isLoading" :data="props.data" border>
        <el-table-column label="呼叫ID" header-align="center" align="center" label-class-name="table-label" prop="callId" width="200"/>
        <el-table-column label='会话内容示例' header-align="center" label-class-name="table-label" prop="content">
          <template #default="{row,$index}">
            <div style="position:relative">
              <el-scrollbar :ref="setScrollbarRef">
                <div class="detail-text" :style="{height: isOpenRow[String($index)]?'': (19 * 7+ 'px')}">
                  <div v-html="getTextWithHighlight(row)"/>
                </div>
              </el-scrollbar>
              <div class="switch-row-btn" :class="{'switch-row-btn--open':isOpenRow[String($index)]}" @click="openRowHandler($index)"/>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        background
        small
        v-model:current-page="param.page"
        v-model:page-size="param.size"
        :total="props.total"
        layout="slot, sizes, ->, prev, pager, next"
        @currentChange="paramChangeHandler"
        @sizeChange="paramChangeHandler"
      >
        <div style="font-size: inherit">显示第{{ (param.page - 1) * param.size + 1 }}-{{ param.page * param.size }}项结果，共{{ props.total }}项&nbsp;</div>
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SourceTextTable'
}
</script>
<script setup lang="ts">

import {computed, nextTick, ref, watch} from "vue";

const scrollbarRef = ref([])

export type SourceTextTableData = {
  callId: string,
  content: string,
  keyword: string[]
}
export type SourceTextParams = {
  type: 'p' | 'n' | 'm'
  page: number,
  size: number,
}
const props = withDefaults(defineProps<{
  param: SourceTextParams,
  isLoading?: boolean
  data: SourceTextTableData[]
  total?: number
}>(), {
  param: () => ({
    type: 'p',
    page: 1,
    size: 10,
  })
})
const isOpenRow = ref<Record<string, boolean>>({})
const btnData = [
  {id: 'p', name: '正面体验', color: '#466AF2'},
  {id: 'n', name: '负面体验', color: '#ECB73F'},
  {id: 'm', name: '中立体验', color: '#999999'}
]
const emits = defineEmits(['change', 'update:param'])

const param = ref(props.param)

watch(() => props.param, (newVal) => {
  param.value = JSON.parse(JSON.stringify(newVal))
}, {deep: true})

const setScrollbarRef = (el) => {
  scrollbarRef.value.push(el)
}

watch(() => props.data, () => {
  isOpenRow.value = {}
  scrollbarRef.value = []
  nextTick(() => {
    scrollbarRef.value.forEach(scrollbarEl => {
      if (scrollbarEl) {
        scrollbarEl.setScrollTop(scrollbarEl.$el.getElementsByClassName('highlight-text')[0]?.offsetTop - 19 * 3 || 0)
      }
    })
  })
}, {deep: true})
const typeClickHandler = (btnItem) => {
  param.value.type = btnItem.id
  paramChangeHandler()
}

const activeColor = computed(() => btnData.find(e => e.id === param.value.type)?.color || 'gray')
const htmlEncodeByRegExp = (str: string) => {
  let temp = ''
  if (str.length === 0) return ''
  temp = str.replace(/&/g, '&amp;')
  temp = temp.replace(/</g, '&lt;')
  temp = temp.replace(/>/g, '&gt;')
  temp = temp.replace(/\s/g, '&nbsp;')
  temp = temp.replace(/'/g, '&#39;')
  temp = temp.replace(/"/g, '&quot;')
  return temp
}
const getTextWithHighlight = (item: SourceTextTableData) => {
  let result = ''
  if (item && item.content && item.keyword) {
    result = item.content
    item.keyword.forEach((hitSentence) => {
      result = result.replace(hitSentence, `<span class="highlight-text">${htmlEncodeByRegExp(hitSentence)}</span>`)
    })
  }
  return result
}

const paramChangeHandler = () => {
  const tmp = JSON.parse(JSON.stringify(param.value))
  emits('update:param', tmp)
  emits('change', tmp)
}

const openRowHandler = (index) => {
  isOpenRow.value[String(index)] = !isOpenRow.value[String(index)]
}

</script>
<style scoped lang="less">
.source-text-table {
  text-align: left;
  overflow: hidden;
  position: relative;

  .header {
    position: relative;
    padding: 8px 0;
    white-space: nowrap;

    .operation {
      display: inline-block;
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
    :deep(.table-label) {
      color: white;
      background-color: v-bind(activeColor) !important;
    }

    //:deep(.el-scrollbar) {
    //  width: 100%;
    //  position: relative;
    //  overflow: hidden;
    //
    //  &__view {
    //    vertical-align: top;
    //  }
    //}
    .pager {
      margin-top: 5px;
      font-size: 12px;
    }

    .detail-text {
      white-space: pre-wrap;
      word-break: break-all;
      font-family: PingFangSC-Regular, PingFang SC, sans-serif;
      font-weight: 400;
      color: #333333;
      font-size: 15px;
      line-height: 19px;
      text-overflow: ellipsis;
      display: -webkit-box;
      position: relative;
      transition: height 0.3s ease-in-out;
    }

    .switch-row-btn {
      position: absolute;
      right: -10px;
      bottom: 2px;

      &:after {
        transition: transform 0.3s ease-out;
        content: '';
        display: block;
        border: 6px solid transparent;
        border-top: 11px solid transparent;
        border-bottom: 11px solid rgba(170, 170, 170, 0.8);
        transform-origin: 50% 70%;
        transform: rotateX(180deg);
        cursor: pointer;
      }

      &--open {
        &:after {
          transform: rotateX(0deg);
        }
      }
    }

    :deep {
      img {
        display: block;
        max-height: 100px !important;
      }
    }

    :deep(.highlight-text) {
      display: inline;
      padding: 0 3px;
      font-weight: bold;
      line-height: 16px;
      color: white;
      background-color: v-bind(activeColor);
    }
  }
}

</style>
