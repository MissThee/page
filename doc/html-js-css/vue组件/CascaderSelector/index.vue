<template>
  <el-select ref="selectRef"
             v-model="activeId"
             :teleported="true"
             popper-class="cascader-selector cascader-selector--custom-width"
             :clearable="props.clearable"
             collapse-tags
             collapse-tags-tooltip
             @clear="treeClearHandler"
             :multiple="props.multiple"
  >
    <div class="select-wrapper">
      <div v-for="(column,columnIndex) in dataForColumns" class="column" :key="columnIndex">
        <el-scrollbar class="scroll-panel">
          <div v-for="(row,rowIndex) in getColumnPageData(column,columnIndex)"
               :key="row.id"
               class="row"
               :class="{
                   'row--expand': expandIds.includes(row.id),
                   'row--highlight row--highlight--child': highlightIds.child.includes(row.id),
                   'row--highlight row--highlight--parent': highlightIds.parent.includes(row.id),
                   'row--active': Array.isArray(activeId)?activeId.includes(row.id) : activeId===row.id,
               }"
               :title="row.name"
               @mouseenter="hoverHandler(row,columnIndex)"
               @mouseleave="hoverHandler()"
               @click="treeChangeHandler(row,rowIndex,column,columnIndex)"
          >
            <span class="text">{{ row.name }}</span>
            <el-icon v-if="row.children?.length">
              <ArrowRight/>
            </el-icon>
            <el-icon class="row__tick">
              <Check/>
            </el-icon>
          </div>
        </el-scrollbar>
        <el-pagination v-if="getIsShowPagerInColumn(column,columnIndex) && cascadePageInfo[columnIndex].total"
                       class="pager"
                       layout="prev,slot,next"
                       v-model:current-page="cascadePageInfo[columnIndex].page"
                       :page-size="cascadePageInfo[columnIndex].size"
                       :total="cascadePageInfo[columnIndex].total"
                       @current-change="pageChangeHandler(column,columnIndex)"
        >
          <div>{{ cascadePageInfo[columnIndex].page }}/{{ Math.ceil(cascadePageInfo[columnIndex].total / cascadePageInfo[columnIndex].size) }}</div>
        </el-pagination>
      </div>
    </div>
    <!--  将其余的选型隐藏掉  -->
    <el-option v-for="item in dataPlain" :key="item.id" :value="item.id" :label="item.name" v-show="false"/>
  </el-select>
</template>
<script lang="ts">
export default {
  name: 'CascaderSelector'
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";
import {Check, ArrowRight} from '@element-plus/icons-vue'
import {findRelationNodeId} from "@/components/CascaderSelector/utils.ts";

const props = withDefaults(defineProps<{
  data: CascaderSelectorData[]
  modelValue?: number | number[], // 选中值
  placeholder?: string
  clearable?: boolean,
  multiple?: boolean, // 是否多选
  forceSelectSameLevel?: boolean // true点击选中时，选中内容仅保留同级选中项
  multipleLimit?: number | number[] | ((column: CascaderSelectorData[], columnIndex: number) => number) // multiple 为true时，限制某层级可选中的个数；若forceSelectSameLevel也为true，则限定
  pager?: boolean | boolean[] | ((column: CascaderSelectorData[], columnIndex: number) => boolean)
}>(), {
  data: () => [],
  // multiple: true,
  // multipleLimit: 2
})
const emits = defineEmits(['update:modelValue', 'change', 'clear'])
const selectRef = ref()

const dataForColumns = ref<CascaderSelectorData[][]>([])
const activeId = ref<number | number[] | undefined>(props.multiple ? [] : undefined)

let currentActiveLevel: number | undefined = undefined
const expandIds = ref<number[]>([]) // 记录每列展开的id

const pageDefaultParam = {page: 1, size: 20} // 分页参数
const cascadePageInfo = ref<{ parentId?: number, page: number, size: number, total: number }[]>([]) // 依据parentId, 记录其子级分页状况

const dataPlain = ref<CascaderSelectorData[]>([]) // 给下拉列表，生成选项

const highlightIds = ref<{ parent: number[], active: number[], child: number[] }>({parent: [], active: [], child: []})

let dataDeal = []

const treeDataDeal = (data: CascaderSelectorData[], level = 0, pid?: number) => {
  data.forEach(e => {
    e._level = level
    e._pid = pid
    dataPlain.value.push(e) // 平铺数据
    if (e.children?.length) {
      treeDataDeal(e.children, level + 1, e.id)
    }
  })
}

watch(() => props.modelValue, () => { // 绑定值改变时触发
  activeId.value = props.modelValue
  highlightIds.value = findRelationNodeId(props.data, (Array.isArray(activeId.value) ? activeId.value : [activeId.value]).filter(e => e) as number[])
}, {immediate: true, deep: true})

watch(() => props.data, () => { // 数据改变时触发
  dataDeal = JSON.parse(JSON.stringify(props.data)) as CascaderSelectorData[]
  dataPlain.value = []
  treeDataDeal(dataDeal)
  dataForColumns.value = [dataDeal]
  cascadePageInfo.value = [{...pageDefaultParam, total: dataDeal?.length || 0}]
  highlightIds.value = findRelationNodeId(props.data, (Array.isArray(activeId.value) ? activeId.value : [activeId.value]).filter(e => e) as number[])
}, {immediate: true, deep: true})


const getActiveRow = (): CascaderSelectorData | CascaderSelectorData[] | undefined => {
  let result
  if (props.multiple) {
    result = []
    if (Array.isArray(activeId.value)) {
      for (const e of dataPlain.value) {
        if (activeId.value.includes(e.id)) {
          result.push(e)
        }
      }
    }
  } else {
    result = dataPlain.value.find(e => e.id === activeId.value)
  }
  return result
}

let hoverTimer: NodeJS.Timer | null = null

// 行hover事件，触发展开下级内容
const hoverHandler = (row?: CascaderSelectorData, columnIndex?: number) => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  if (row && columnIndex !== undefined) {
    hoverTimer = setTimeout(() => {
      if (row.children?.length) {
        // 展开行标记
        expandIds.value[columnIndex] = row.id
        expandIds.value.length = columnIndex + 1
        // 展开数据
        dataForColumns.value[columnIndex + 1] = row.children
        dataForColumns.value.length = columnIndex + 2
        // 展开列分页信息
        cascadePageInfo.value[columnIndex + 1] = {
          ...pageDefaultParam,
          total: row.children.length,
          parentId: row.id
        }
        cascadePageInfo.value.length = columnIndex + 2
        // 更新下拉框位置
        selectRef.value.tooltipRef.updatePopper()
      }
    }, 50)
  }
}

const treeClearHandler = () => {
  emits('update:modelValue')
  emits('clear')
  treeChangeHandler()
}

const treeChangeHandler = (row?: CascaderSelectorData, rowIndex?: number, column?: CascaderSelectorData[], columnIndex?: number) => {
  if (props.multiple) { // 多选时
    if (!Array.isArray(activeId.value)) {
      activeId.value = []
    }
    if (props.forceSelectSameLevel) { // 保持多选的内容在同一层级
      if (currentActiveLevel !== columnIndex) {
        activeId.value = []
        currentActiveLevel = columnIndex
      }
    } else {
      currentActiveLevel = undefined
    }
    if (row) {
      const existIndex = activeId.value.indexOf(row?.id)
      if (existIndex === -1) {
        if (props.multipleLimit !== undefined) {
          const limitNum = getMultipleLimit(column, columnIndex)
          if (limitNum === 0 || limitNum > activeId.value.length) {
            activeId.value.push(row?.id)
          }
        } else {
          activeId.value.push(row?.id)
        }
      } else {
        activeId.value.splice(existIndex, 1)
      }
    }
  } else {
    currentActiveLevel = columnIndex
    activeId.value = row?.id
  }

  emits('update:modelValue', activeId.value)
  // change事件返回参数
  // activeId.value 当前所有激活的id
  // getActiveRow() 当前所有激活的id对应row数据
  // row 本次点击行数据
  // rowIndex 本次点击行序号
  // column 本次点击行所在的列数据
  // columnIndex 本次点击行所在的列序号
  emits('change', activeId.value, getActiveRow(), row, rowIndex, column, columnIndex)
}


// 列内数据翻页
const getColumnPageData = (column: CascaderSelectorData[], columnIndex: number) => {
  if (getIsShowPagerInColumn(column, columnIndex)) {
    const {page = pageDefaultParam.page, size = pageDefaultParam.size} = cascadePageInfo.value[columnIndex] || {}
    return column.slice((page - 1) * size, page * size)
  } else {
    return column
  }
}

// 翻页时关闭下级
const pageChangeHandler = (_: CascaderSelectorData[], columnIndex: number) => {
  dataForColumns.value.length = columnIndex + 1
}

const getIsShowPagerInColumn = (column: CascaderSelectorData[], columnIndex: number) => {
  if (Array.isArray(props.pager)) {
    return props.pager[columnIndex]
  }
  if (typeof props.pager === 'function') {
    return props.pager(column, columnIndex)
  }
  return props.pager
}

const getMultipleLimit = (column?: CascaderSelectorData[], columnIndex?: number) => {
  if (!column || columnIndex === undefined) {
    return 0
  }
  let result
  if (Array.isArray(props.multipleLimit)) {
    result = props.multipleLimit[columnIndex]
  } else if (typeof props.multipleLimit === 'number') {
    result = props.multipleLimit
  } else if (typeof props.multipleLimit === 'function') {
    result = props.multipleLimit(column, columnIndex)
  }
  return result || 0
}
</script>

<style scoped lang="less">
.cascader-selector {
  position: relative;

  .select-wrapper {
    cursor: auto;
    padding: 0 !important;
    height: 274px;
    overflow: hidden;
    white-space: nowrap;
    display: flex; // 行充满 1/3

    .column {
      position: relative;
      height: 100%;
      display: inline-flex;
      flex-direction: column;
      border-left: 1px solid #eee;
      flex: 1; // 行充满 2/3

      &:first-child {
        border: none;
      }

      .scroll-panel {
        flex: 1;
      }

      .row {
        position: relative;
        cursor: pointer;
        height: 34px;
        display: flex;
        align-items: center;
        padding: 0 8px 0 20px;
        font-size: var(--el-font-size-base);
        color: var(--el-text-color-regular);
        justify-content: space-between;
        max-width: 250px;
        min-width: 100px;

        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        &__tick {
          display: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 5px
        }

        &:hover, &--expand {
          background-color: var(--el-fill-color-light);
        }

        &--highlight {
          color: var(--el-color-primary-light-3);

          &--parent {

          }

          &--child {
            .row__tick {
              display: block !important;
            }
          }
        }

        &--active {
          font-weight: bold;
          color: var(--el-color-primary);

          .row__tick {
            display: block !important;
          }
        }

      }

      .pager {
        padding: 3px 0 0 0;
        justify-content: center;

        :deep(.btn-prev), :deep(.btn-next) {
          height: 1.5em;
          width: 1.5em;
          min-width: 1.5em;
          padding: 0;
          margin: 0 10px
        }
      }
    }
  }
}
</style>
<style lang="less">
.cascader-selector {
  &--custom-width {
    .el-select-dropdown__wrap {
      max-height: none !important;
      min-height: 0 !important;
    }

    .el-select-dropdown {
      max-width: none !important;
      //min-width: 0 !important; // 行充满 3/3
    }
  }
}
</style>