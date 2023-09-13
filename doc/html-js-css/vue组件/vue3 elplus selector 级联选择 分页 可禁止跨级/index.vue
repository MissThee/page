<template>
  <el-select ref="selectRef"
             v-model="activeId"
             :teleported="props.teleported"
             popper-class="cascader-selector cascader-selector--custom-width"
             :clearable="props.clearable"
             collapse-tags
             :popper-options="{
                modifiers: [
                  {
                    name: 'flip',
                    options: {
                      fallbackPlacements: props.forcePopperPlace||['bottom'],
                    },
                  },
                ],
             }"
             :collapse-tags-tooltip="false"
             :placeholder="props.placeholder"
             @removeTag="removeTagHandler"
             @clear="treeClearHandler"
             :filterable='props.filterable'
             :filterMethod="filterMethod"
             :multiple="props.multiple"
             :suffix-icon="(props.clearable && (Array.isArray(activeId)?activeId.length:activeId))?CircleClose:ArrowDown"
             :suffix-transition="false"
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
            <el-icon class="row__tick" v-if="dataForColumns?.length>1">
              <Check/>
            </el-icon>
          </div>
        </el-scrollbar>
        <el-pagination
            v-if="getIsShowPagerInColumn(column,columnIndex) &&cascadePageInfo[columnIndex] && cascadePageInfo[columnIndex].total && cascadePageInfo[columnIndex].total>cascadePageInfo[columnIndex].size"
            class="pager"
            layout="prev,slot,next"
            v-model:current-page="cascadePageInfo[columnIndex].page"
            :page-size="cascadePageInfo[columnIndex].size"
            :total="cascadePageInfo[columnIndex].total"
            @current-change="pageChangeHandler(column,columnIndex)"
        >
          <div>{{
              cascadePageInfo[columnIndex].page
            }}/{{ Math.ceil(cascadePageInfo[columnIndex].total / cascadePageInfo[columnIndex].size) }}
          </div>
        </el-pagination>
      </div>
      <div v-if="filterStr&&!dataForColumns?.[0]?.length" class="tip-text">无匹配数据</div>
    </div>
    <!--  站位，el-selet组件无任何el-option时，下拉不显示内容，用此站位  -->
    <el-option value="" label="" v-if="filterStr || dataForColumns?.[0]?.length" style="display: none !important;"
               v-show="false"/>
    <!--  将选中的选项加入到原列表，并隐藏下拉选项，让原选择组件可现实选中项目名称。(最优解是完全不渲染这些节点，但现在没找到方法，只能将选中的一部分渲染)  -->
    <el-option
        v-for="item in dataPlain.filter(e=>Array.isArray(activeId) ? activeId.includes(e.id) : activeId === e.id)"
        :key="item.id" :value="item.id" :label="item.name" style="display: none !important;" v-show="false"/>
  </el-select>
  <!--  <el-tree :data="props.data" ref="treeRef" show-checkbox node-key="id" :props="{ label: 'name'}"/>-->
</template>
<script lang="ts">

export default {
  name: 'CascaderSelector'
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";
import {Check, ArrowRight, CircleClose, ArrowDown} from '@element-plus/icons-vue'
import {addArrUnique, findRelationNodeId, removeArr} from "./utils.ts";
// "element-plus": "^2.3.4",
// const treeRef = ref()
const props = withDefaults(defineProps<{
  data: CascaderSelectorData[]
  modelValue?: number | number[], // 选中值
  placeholder?: string
  clearable?: boolean,
  multiple?: boolean, // 是否多选
  forceSelectSameLevel?: boolean // true点击选中时，选中内容仅保留同级选中项
  multipleTargetChildMode?: boolean // 点击时选中当前节点的子级
  multipleLimit?: number | number[] | ((column: CascaderSelectorData[], columnIndex: number) => number) // multiple 为true时，限制某层级可选中的个数；若forceSelectSameLevel也为true，则限定
  pager?: boolean | boolean[] | ((column: CascaderSelectorData[], columnIndex: number) => boolean)
  filterable?: boolean
  teleported?: boolean //原下拉组件teleported，默认true
  forcePopperPlace?: string[]
  // leafOnly?: boolean
}>(), {
  data: () => [],
  // multiple: true,
  // multipleLimit: 2
  // filterable: true
  // leafOnly: true,
  teleported: true
})
const emits = defineEmits(['update:modelValue', 'change', 'clear', 'removeTag', 'submit'])
const selectRef = ref()
const dataForColumns = ref<CascaderSelectorData[][]>([])
const activeId = ref<number | number[] | undefined>(props.multiple ? [] : undefined)

let currentActivePid: number | undefined = undefined

const expandIds = ref<number[]>([]) // 记录每列展开的id

const defaultPageSize = 20 // 分页参数
const cascadePageInfo = ref<{
  parentId?: number,
  page: number,
  size: number,
  total: number
}[]>([]) // 依据parentId, 记录其子级分页状况

const dataPlain = ref<CascaderSelectorDataInitialed[]>([]) // 给原下拉列表用，生成选项

const highlightIds = ref<{
  parent: number[],
  active: number[],
  child: number[]
}>({parent: [], active: [], child: []})
// 初始化后的树数据
let initialedData: CascaderSelectorDataInitialed[] = []
// 初始化给树数据增加一些辅助参数
const initTreeData = (data: CascaderSelectorData[], level = 0, parent?: CascaderSelectorData) => {
  data.forEach(e => {
    e._level = level
    e._pid = parent?.id
    e._idPath = [...parent?._idPath || [], e.id]
    e._namePath = [...parent?._namePath || [], e.name]
    addArrUnique(dataPlain.value, e)// 平铺数据
    if (currentActivePid === undefined && Array.isArray(activeId.value) && activeId.value.includes(e.id)) {
      currentActivePid = e._pid
    }
    if (e.children?.length) {
      initTreeData(e.children, level + 1, e)
    }
  })
}

watch(() => props.modelValue, () => { // 绑定值改变时触发
  activeId.value = props.modelValue
}, {immediate: true, deep: true})

watch(() => JSON.stringify(props.data || []), (val) => { // 数据改变时触发
  dataPlain.value = []
  expandIds.value.length = 0
  { // 初始化数据
    initialedData = JSON.parse(val) as CascaderSelectorDataInitialed[]
    initTreeData(initialedData)
    dataForColumns.value = [initialedData].filter(e => e?.length)
  }
  cascadePageInfo.value = [{page: 1, size: defaultPageSize, total: dataForColumns.value[0]?.length || 0}]
  highlightIds.value = findRelationNodeId(dataForColumns.value[0], (Array.isArray(activeId.value) ? activeId.value : [activeId.value]).filter(e => e) as number[])
}, {immediate: true})

watch(() => activeId.value, () => {
  highlightIds.value = findRelationNodeId(dataForColumns.value[0], (Array.isArray(activeId.value) ? activeId.value : [activeId.value]).filter(e => e) as number[])
}, {immediate: true, deep: true})

const getActiveRow = (): CascaderSelectorDataInitialed | CascaderSelectorDataInitialed[] | undefined => {
  let result
  if (props.multiple) {
    result = []
    if (Array.isArray(activeId.value)) {
      for (const e of dataPlain.value) {
        if (activeId.value.includes(e.id)) {
          addArrUnique(result, e)
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
const hoverHandler = (row?: CascaderSelectorDataInitialed, columnIndex?: number, immediate = false, forceUpdateExpandState = false) => {
  const trigger = () => {
    if (row && columnIndex !== undefined) {
      if (!forceUpdateExpandState && expandIds.value[columnIndex] === row.id) {
        return
      }
      // 展开行标记
      expandIds.value[columnIndex] = row.id
      expandIds.value.length = columnIndex + 1
      if (row.children?.length) {
        // 展开数据
        dataForColumns.value[columnIndex + 1] = row?.children || []
        dataForColumns.value.length = columnIndex + 2
        // 展开列分页信息
        cascadePageInfo.value[columnIndex + 1] = {
          page: 1,
          size: defaultPageSize,
          total: row.children?.length || 0,
          parentId: row.id
        }
        cascadePageInfo.value.length = columnIndex + 2
      } else {
        // 展开数据
        dataForColumns.value.length = columnIndex + 1
        // 展开列分页信息
        cascadePageInfo.value.length = columnIndex + 1
      }
      // 更新下拉框位置
      selectRef.value?.tooltipRef?.updatePopper?.()
    }
  }

  if (immediate) {
    trigger()
  } else {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
    hoverTimer = setTimeout(trigger, 50)
  }
}
const removeTagHandler = (id: number) => {
  if (Array.isArray(activeId.value)) {
    removeArr(activeId.value, id)
    treeChangeHandler()
  }
  emits('removeTag', id)
}

const treeClearHandler = () => {
  treeChangeHandler()
  emits('clear', activeId.value)
}

const treeChangeHandler = (row?: CascaderSelectorDataInitialed, rowIndex?: number, column?: CascaderSelectorDataInitialed[], columnIndex?: number) => {
  if (row?.stopClick) {
    return
  }
  if (props.multiple) { // 多选时
    if (!Array.isArray(activeId.value)) {
      activeId.value = []
    }
    if (row) {
      // if (props.leafOnly) {
      // 增加或删除选项
      // treeRef.value.setChecked(row.id, !treeRef.value.getCheckedKeys().includes(row.id), true)
      // activeId.value = treeRef.value.getCheckedKeys(true)
      // } else {
      if (props.forceSelectSameLevel) { // 保持多选的内容在同一层级
        if (currentActivePid !== row._pid) {
          if (activeId.value.length) {
            ElMessage.warning('不可跨级多选')
            return
          } else {
            currentActivePid = row._pid
          }
          // activeId.value.length = 0
          // currentActivePid = row?._pid
        }
      } else {
        currentActivePid = undefined
      }
      // 增加或删除选项
      const existIndex = activeId.value.indexOf(row.id)
      if (existIndex === -1) {
        const limitNum = getMultipleLimit(column, columnIndex)
        if (limitNum === undefined) {
          addArrUnique(activeId.value, row.id)
        } else if (limitNum === 0) { // 如果此列最多选0个，则不可选择
          ElMessage.warning(`此层级不可选择`)
          removeArr(activeId.value, row.id)
          return
        } else if (limitNum === 1) { // 如果此列最多选1个，则直接切换到点击值
          activeId.value.length = 0
          addArrUnique(activeId.value, row.id)
        } else if (limitNum === 0 || limitNum > activeId.value.length) {// 如果此列最多选大于1个，数量到达后，禁止再增加选中值
          addArrUnique(activeId.value, row.id)
        } else {
          ElMessage.warning(`此层级最多可选择${limitNum}个`)
        }
      } else {
        removeArr(activeId.value, row.id)
      }
      updateActiveIdRelation(row)
      // }
    }
  } else {
    currentActivePid = row?._pid
    activeId.value = row?.id
    selectRef.value?.$refs?.tooltipRef?.hide?.()
  }
  emits('update:modelValue', activeId.value)
  // change事件返回参数：
  // activeId.value 当前所有激活的id
  // getActiveRow() 当前所有激活的id对应row数据
  // row 本次点击行数据
  // rowIndex 本次点击行序号
  // column 本次点击行所在的列数据
  // columnIndex 本次点击行所在的列序号
  emits('change', activeId.value, getActiveRow(), row, rowIndex, column, columnIndex)
}
// 多选（且可跨级时），处理层级选中联动
const updateActiveIdRelation = (row?: CascaderSelectorDataInitialed) => {
  if (!Array.isArray(activeId.value) || !row || !row._idPath) {
    return
  }

  if (activeId.value.includes(row.id)) { // 选中节点
    let activeAncestorNode: { id: number, _level: number } | null = null

    for (let i = 0; i < row._idPath.length - 1; i++) {
      if (activeId.value.includes(row._idPath[i])) {
        activeAncestorNode = {_level: i, id: row._idPath[i]}
        break
      }
    }
    console.log('activeParentLevel', activeAncestorNode)
    if (activeAncestorNode === null) {// 点击的节点无激活的高层点。将其激活的子节点全部取消，激活自己
      const activeIdTmp: number[] = []
      for (const e of dataPlain.value) {
        if (e._idPath.length > (row._level || 0) + 1) {
          if (e._idPath?.[row._level] === row.id) { // 属于同一激活搞成节点
            addArrUnique(activeIdTmp, e.id)
          }
        }
      }
      removeArr(activeId.value, ...activeIdTmp)
    } else { // 点击的节点有激活的高层节点。将其激活的高层节点取消，自己取消，激活自己的同层，属于高层节点的所有节点
      const activeIdTmp: number[] = []
      for (const e of dataPlain.value) {
        if (e._idPath.length === row._level + 1) { // 与点击节点同级
          if (e._idPath[activeAncestorNode._level] === activeAncestorNode.id) { // 属于同一激活搞成节点
            addArrUnique(activeIdTmp, e.id)
          }
        }
      }
      addArrUnique(activeId.value, ...activeIdTmp)// 添加点击节点的兄弟节点
      removeArr(activeId.value, row.id)// 不选中点击的节点
      removeArr(activeId.value, activeAncestorNode.id) // 不选中点击之前对应激活的高层节点
    }
  }
}


// 列内数据翻页
const getColumnPageData = (column: CascaderSelectorDataInitialed[], columnIndex: number) => {
  if (getIsShowPagerInColumn(column, columnIndex)) {
    cascadePageInfo.value[columnIndex].page = cascadePageInfo.value[columnIndex].page || 1
    cascadePageInfo.value[columnIndex].size = defaultPageSize
    cascadePageInfo.value[columnIndex].total = column?.length || 0
    const sliceStart = (cascadePageInfo.value[columnIndex].page - 1) * cascadePageInfo.value[columnIndex].size
    return column.slice(sliceStart, sliceStart + cascadePageInfo.value[columnIndex].size) || []
  } else {
    return column
  }
}

// 翻页时关闭下级
const pageChangeHandler = (_: CascaderSelectorDataInitialed[], columnIndex: number) => {
  dataForColumns.value.length = columnIndex + 1
}

const getIsShowPagerInColumn = (column: CascaderSelectorDataInitialed[], columnIndex: number) => {
  if (Array.isArray(props.pager)) {
    return props.pager[columnIndex]
  }
  if (typeof props.pager === 'function') {
    return props.pager(column, columnIndex)
  }
  return props.pager
}

const getMultipleLimit = (column?: CascaderSelectorDataInitialed[], columnIndex?: number) => {
  let result = undefined
  if (!column || columnIndex === undefined) {
    // empty
  } else if (Array.isArray(props.multipleLimit)) {
    result = props.multipleLimit[columnIndex]
  } else if (typeof props.multipleLimit === 'number') {
    result = props.multipleLimit
  } else if (typeof props.multipleLimit === 'function') {
    result = props.multipleLimit(column, columnIndex)
  }
  return result
}

// 模糊搜索
let filterTimer: NodeJS.Timeout | null = null

const filterStr = ref('')
const filterMethod = (val: string) => {
  if (filterTimer !== null) {
    clearTimeout(filterTimer)
    filterTimer = null
  }
  filterTimer = setTimeout(() => {
    filterStr.value = val
  }, 300)
  return true
}

const filterDataByStr = (data: CascaderSelectorData[], keyword = '', result: CascaderSelectorData[] = []) => {
  if (!keyword) {
    return data
  }
  for (const e of data || []) {
    if (e.name.toLowerCase().includes(keyword.toLowerCase())) {
      result.push(e)
    } else if (e.children?.length) {
      const children = filterDataByStr(e.children, keyword)
      if (children?.length) {
        e.children = children
        result.push(e)
      }
    }
  }
  return result
}

watch(() => filterStr.value, (val) => {
  if (!val) {
    dataForColumns.value = [JSON.parse(JSON.stringify(initialedData))]
  } else {
    dataForColumns.value = [filterDataByStr(JSON.parse(JSON.stringify(initialedData)), val)].filter(e => e?.length)
    let columnIndex = 0
    while (dataForColumns.value[columnIndex]?.[0]?.children?.length) {
      hoverHandler(dataForColumns.value[columnIndex]?.[0], columnIndex, true, true)
      columnIndex++
    }
  }
  // 更新下拉框位置
  selectRef.value?.tooltipRef?.updatePopper?.()
}, {immediate: true})

const enterHandler = () => {
  console.log('zxczxc')
  emits('enter')
}
</script>

<style scoped lang="less">
.cascader-selector {
  position: relative;

  .select-wrapper {
    cursor: auto;
    padding: 0 !important;
    max-height: 274px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    display: flex;

    .column {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      border-left: 1px solid #eee;
      flex: 1;

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
          user-select: none;
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

    .tip-text {
      user-select: none;
      margin: auto;
      color: var(--el-text-color-secondary);
      text-align: center;
      line-height: 26px;
    }
  }
}

:deep(.el-select__tags) {
  display: flex;
  flex-wrap: nowrap;

  .el-select-tags-wrapper {
    display: flex !important;
    flex-wrap: nowrap;
    align-items: center;
    min-width: 0;
    max-width: 70%;
    position: relative;
    //overflow: hidden;

    .el-tag.is-closable {
      padding: 0 2px;
      min-width: calc(2em + 14px);
      flex-shrink: 1;
      display: inline-flex;
      white-space: nowrap;

      .el-tag__content {
        width: calc(100% - 14px);

        .el-select__tags-text {
          font-weight: bold;
          display: block;
        }
      }
    }
  }

  .el-select__input {
    flex: 1;
    min-width: 0;
    margin-left: 5px;
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
    }
  }
}
</style>