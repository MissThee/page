<template>
  <div class="source-text-table">
    <div class="header">
      <div class="charts-title">{{ props.title }}</div>
      <div class="operation">
        <span style="margin-right: 10px;margin-left: 6px;color:#4E5969">体验效果: </span>
        <el-select v-model="param.type" @change="typeChangeHandler">
          <el-option v-for="item in btnData" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>
    </div>
    <div class="bottom">
      <el-table v-loading="props.isLoading" :data="props.data" border>
        <el-table-column v-for="c in props.columns" :key="c.prop" :prop="c.prop" :label="c.label"
                         header-align="center"
                         align="center"
                         label-class-name="table-label"
                         :min-width="c.minWidth||''"
                         :width="c.width||''"
        >
          <template v-if="c.hasPopover" #default="{row,$index,column}">
            <el-popover :width="column.realWidth+30" placement="right" :disabled="!isCellTextOverflow[c.prop+','+$index]" :persistent="false" :offset="-(column.realWidth)" :showArrow="false">
              <template #reference>
                <div class="detail-text" :style="{height: `calc( ${lineHeight}px * 4 )`,lineHeight: `${lineHeight}px`}">
                  <div v-if="c.hasHighlight" v-html="getTextWithHighlight(row)" :ref="(el)=>setContentRef(c.prop,$index,el)"/>
                  <div v-else :ref="(el)=>setContentRef(c.prop,$index,el)">{{ row[c.prop] }}</div>
                </div>
              </template>
              <div style="position: relative;overflow: hidden;height: 112px">
                <el-scrollbar>
                  <div class="detail-text" style="padding-right: 10px">
                    <div v-if="c.hasHighlight" v-html="getTextWithHighlight(row,c.prop)"/>
                    <div v-else>{{ row[c.prop] }}</div>
                  </div>
                </el-scrollbar>
              </div>
            </el-popover>
            <div style="position: absolute;bottom:6px;right:4px;" v-if="isCellTextOverflow[c.prop+','+$index]">...</div>
          </template>
        </el-table-column>
      </el-table>
      <el-config-provider :locale="pagerConfig">
        <el-pagination
          class="pager"
          background
          v-model:current-page="param.page"
          v-model:page-size="param.size"
          :total="props.total"
          layout="->, slot, prev, pager, next, sizes, jumper"
          @currentChange="paramChangeHandler"
          @sizeChange="paramChangeHandler"
        >
          <div style="font-size: inherit">共{{ props.total }}条&nbsp;</div>
        </el-pagination>
      </el-config-provider>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SourceTextTable'
}
</script>
<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {ElConfigProvider} from "element-plus";

const contentRef = ref<Record<string, any>>({})
const isCellTextOverflow = ref<Record<string, boolean>>({})

export type SourceTextParams = {
  type: 'p' | 'n' | 'm'
  page: number,
  size: number,
}
const props = withDefaults(defineProps<{
  title: string,
  columns: { label: string, prop: string, width?: number, minWidth?: number, hasPopover?: boolean, hasHighlight?: boolean }[]
  param: SourceTextParams,
  isLoading?: boolean
  data: Record<string, any>[]
  total?: number
}>(), {
  param: () => ({
    type: 'N',
    page: 1,
    size: 10,
  })
})

const lineHeight = 19
const btnData = [
  {id: 'P', name: '正面体验', color: '#165DFF'},
  {id: 'N', name: '负面体验', color: '#F27F42'},
  {id: 'M', name: '中立体验', color: '#719595'}
]
const emits = defineEmits(['change', 'update:param'])

const param = ref(props.param)

watch(() => props.param, (newVal) => {
  param.value = {...param.value, ...newVal || {}}
}, {deep: true})

const setContentRef = (columnProp: string, index: number, el) => {
  contentRef.value[columnProp + ',' + index] = el
}

watch(() => props.data, () => {
  contentRef.value = {}
  isCellTextOverflow.value = {}
  setTimeout(() => {
    Object.keys(contentRef.value).forEach(k => {
      isCellTextOverflow.value[k] = contentRef.value[k].clientHeight > lineHeight * 4
    })
  })
}, {immediate: true, deep: true})

const typeChangeHandler = (id) => {
  param.value.type = id
  paramChangeHandler()
}

const activeColor = computed(() => btnData.find(e => e.id === param.value.type)?.color || 'gray')
const getTextWithHighlight = (item: Record<string, any>,prop:string) => {
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
      result = result.replace(hitSentence, `<span class="highlight-text highlight-text--${props.param?.type?.toLocaleLowerCase()}" >${temp}</span>`)
    })
  }
  return result
}

const paramChangeHandler = () => {
  const tmp = JSON.parse(JSON.stringify(param.value))
  emits('update:param', tmp)
  emits('change', tmp)
}

const pagerConfig: any = {
  el: {
    pagination: {
      pagesize: '条/页',
      total: '共 {total} 条',
      goto: '跳至',
      pageClassifier: '页'
    }
  }
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
    :deep(.table-label) {
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

:deep(img) {
  display: block;
  max-height: 100px !important;
}

:deep(.highlight-text) {
  display: inline;
  padding: 0 3px;
  font-weight: bold;
  line-height: 16px;
  color: white;
  background-color: v-bind(activeColor);

  &--p {
    background-color: #165DFF;
  }

  &--n {
    background-color: #F27F42;
  }

  &--m {
    background-color: #719595;
  }

}
</style>
<style lang="less">

</style>