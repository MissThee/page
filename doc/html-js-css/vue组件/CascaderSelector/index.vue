<template>
  <div class="cascader-selector">
    <el-select v-if="isTree"
               ref="selectRef"
               v-model="activeId"
               :teleported="true"
               popper-class="cascader-selector"
               :clearable="props.clearable"
               collapse-tags
               collapse-tags-tooltip
               :popperOptions="{
                 // placement:'bottom',
               }"
               :multiple="props.multiple"
    >
      <div class="select-wrapper">
        <div v-for="(column,columnIndex) in dataForColumnsShow" class="column" :key="columnIndex">
          <el-scrollbar class="scroll-panel">
            <div v-for="(row,rowIndex) in getColumnPageData(column,columnIndex)"
                 :key="row.id"
                 class="row"
                 :class="{
                   'row--expand': expandIds.includes(row.id),
                   'row--highlight': allHighLightIds.includes(row.id),
                   'row--active': Array.isArray(activeId)?activeId.includes(row.id) : activeId===row.id
                 }"
                 :title="row.name"
                 @mouseenter="hoverHandler(row,columnIndex)"
                 @mouseleave="leaveHandler"
                 @click="clickHandler(row.id,row._level)"
            >
              <span class="text">{{ row.name }}</span>
              <el-icon v-if="row.children?.length">
                <ArrowRight/>
              </el-icon>
              <el-icon style="position: absolute;top:50%;transform: translateY(-50%);left: 5px" v-if="allHighLightIds.includes(row.id)">
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
      <el-option v-for="item in dataPlain"
                 style="display: none"
                 :key="item.id"
                 :value="item.id"
                 :label="item.name"
                 v-show="false"
      />
    </el-select>
    <el-select v-else
               class="cascader-selector"
               collapse-tags
               collapse-tags-tooltip
               v-model="activeId"
               :clearable="props.clearable"
               :filterable="props.filterable"
               :placeholder="placeholder"
               :multiple="props.multiple"
               @change="clickHandler">
      <el-option v-for="e in dataForUse" :key="e.id" :label="e.name" :value="e.id"/>
    </el-select>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CascaderSelector'
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";
import {Check, ArrowRight} from '@element-plus/icons-vue'

type CascaderSelectorData = {
  id: number,
  name: string,
  children?: CascaderSelectorData[],
  _level?: number
}
const props = withDefaults(defineProps<{
  data: CascaderSelectorData[]
  forceTree?: boolean, // true强制使用树形样式;false实际数据都没有children时，会自动使用普通下拉
  modelValue?: number, // 选中值
  placeholder?: string
  clearable?: boolean,
  filterable?: boolean, // 暂时仅普通下拉有效
  multiple?: boolean, // 是否多选
  forceSelectSameLevel?: boolean // true点击选中时，选中内容仅保留同级选中项
  cascaderPager?: boolean | ((column: CascaderSelectorData, columnIndex: number) => boolean)
}>(), {
  data: () => [],
})
const emits = defineEmits(['update:modelValue', 'change'])

let currentActiveLevel = null
const pageDefaultParam = {page: 1, size: 20}
const cascadePageInfo = ref<{ page: number, size: number, total: number, parentId?: number }[]>([])

const dataForColumnsShow = ref<CascaderSelectorData[][]>([])
const expandIds = ref<number[]>([])

const dataForUse = ref<CascaderSelectorData[]>([])
const dataPlain = ref<CascaderSelectorData[]>([])

const treeDataDeal = (data: CascaderSelectorData[], level = 0) => {
  data.forEach(e => {
    e._level = level // 级联各层深度辅助字段
    dataPlain.value.push(e) // 平铺数据
    if (e.children?.length) {
      treeDataDeal(e.children, level + 1)
    }
  })
}

const isTree = ref(props.forceTree)
const activeId = ref<number | number[] | null>(props.multiple ? [] : null)
const allHighLightIds = ref<number[]>([])

watch(() => props.modelValue, () => {
  activeId.value = props.modelValue
}, {immediate: true, deep: true})

watch(() => props.data, () => {
  isTree.value = isTree.value || !!props.data?.some(e => e.children?.length)
  // 设置下拉数据
  dataForUse.value = JSON.parse(JSON.stringify(props.data))
  dataPlain.value = []
  treeDataDeal(dataForUse.value)
  dataForColumnsShow.value = [dataForUse.value]
  cascadePageInfo.value = [{...pageDefaultParam, total: dataForUse.value?.length || 0}]
}, {immediate: true, deep: true})


const findCheckedNodeAllChildId = (data: CascaderSelectorData[] | undefined, ids: number[] = [], path: number[] = []) => {
  data?.forEach(e => {
    if (ids.includes(e.id)) {
      ids.push(...(e.children?.map(item => item.id) || []))
      ids.push(...path)
    }
    findCheckedNodeAllChildId(e.children, ids, [...path, e.id])
  })
  return ids
}

watch(() => props.modelValue, () => {
  // activeId.value = props.modelValue
}, {immediate: true, deep: true})
const selectRef = ref()

let hoverTimer: number | null = null
const leaveHandler = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}
// 行hover事件，触发展开下级内容
const hoverHandler = (row: CascaderSelectorData, index) => {
  leaveHandler()
  hoverTimer = setTimeout(() => {
    if (row.children?.length) {
      // 展开行标记
      expandIds.value[index] = row.id
      expandIds.value.length = index + 1
      // 展开数据
      dataForColumnsShow.value[index + 1] = row.children
      dataForColumnsShow.value.length = index + 2
      // 展开列分页信息
      cascadePageInfo.value[index + 1] = {
        ...pageDefaultParam,
        total: row.children.length,
        parentId: row.id
      }
      cascadePageInfo.value.length = index + 2
      // 更新下拉框位置
      selectRef.value.tooltipRef.updatePopper()
      // setTimeout(() => {
      //   const popperRect = selectRef.value.tooltipRef.contentRef.contentRef.popperContentRef.getBoundingClientRect()
      //   if (popperRect.x + popperRect.width > window.innerWidth) {
      //     selectRef.value.tooltipRef.updatePopper()
      //   }
      // })
    }
  }, 100)
}
const clickHandler = (id, level) => {
  if (isTree.value && props.multiple) {
    if (!Array.isArray(activeId.value)) {
      activeId.value = []
    }
    if (props.forceSelectSameLevel) {
      if (currentActiveLevel !== level) {
        activeId.value = []
        currentActiveLevel = level
      }
    } else {
      currentActiveLevel = null
    }
    if (Array.isArray(activeId.value)) {
      const existIndex = activeId.value.indexOf(id)
      if (existIndex === -1) {
        activeId.value.push(id)
      } else {
        activeId.value.splice(existIndex, 1)
      }
    }
  } else {
    currentActiveLevel = 0
    activeId.value = id
  }

  emits('update:modelValue', activeId.value)
  emits('change', activeId.value, currentActiveLevel)
}

watch(activeId, () => {
  allHighLightIds.value = findCheckedNodeAllChildId(props.data, Array.isArray(activeId.value) ? [...activeId.value] : [activeId.value])
}, {immediate: true, deep: true})


// 列内数据翻页
const getColumnPageData = (column, columnIndex) => {
  if (getIsShowPagerInColumn(column, columnIndex)) {
    const {page = pageDefaultParam.page, size = pageDefaultParam.size} = cascadePageInfo.value[columnIndex] || {}
    return column.slice((page - 1) * size, page * size)
  } else {
    return column
  }
}

// 翻页时关闭下级
const pageChangeHandler = (column, columnIndex) => {
  dataForColumnsShow.value.length = columnIndex + 1
}

const getIsShowPagerInColumn = (column, columnIndex) => {
  if (typeof props.cascaderPager === 'function') {
    return props.cascaderPager(column, columnIndex)
  }
  return props.cascaderPager
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

    .column {
      position: relative;
      height: 100%;
      display: inline-flex;
      flex-direction: column;
      border-left: 1px solid #eee;

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
        padding: 0 5px 0 20px;
        font-size: var(--el-font-size-base);
        color: var(--el-text-color-regular);
        justify-content: space-between;
        max-width: 250px;
        min-width: 150px;

        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        &:hover, &--expand {
          background-color: var(--el-fill-color-light);
        }

        &--highlight {
          color: var(--el-color-primary-light-3);
        }

        &--active {
          font-weight: bold;
          color: var(--el-color-primary);
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
  .el-select-dropdown__wrap {
    max-height: none !important;
    min-height: 0 !important;
  }

  .el-select-dropdown {
    max-width: none !important;
    min-width: 0 !important;
  }
}
</style>