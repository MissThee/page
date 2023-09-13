<template>
  <div class="cascader-selector">
    <el-cascader ref='row1CascaderRef'
                 v-model="activeId"
                 :teleported="false"
                 :options="props.data"
                 :clearable="props.clearable"
                 :filterable="props.filterable"
                 :show-all-levels="false"
                 :placeholder="placeholder"
                 collapse-tags
                 :props="cascaderProps"
                 @expand-change="changeHandler"
    >
      <template #default="{ data,node }">
        <div style="padding:0" :class="{'checked-node':node.indeterminate||node.checked}" @click="clickHandler(data,node)">
          <div class="check-tick">
            <el-icon v-if="node.checked">
              <Check/>
            </el-icon>
          </div>
          <span>{{ data.name }}</span>
        </div>
      </template>
    </el-cascader>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CascaderSelector'
}
</script>
<script setup lang="ts">
import {ref, watch} from "vue";
import {Check} from '@element-plus/icons-vue'

type CascaderSelectorData = {
  id: number,
  name: string,
  children?: CascaderSelectorData[]
}
const props = withDefaults(defineProps<{
  data: CascaderSelectorData[]
  multiple?: boolean
  modelValue?: any,
  placeholder?: string
  clearable?: boolean,
  filterable?: boolean,
}>(), {
  data: () => []
})
const cascaderProps = ref<any>({
      multiple: props.multiple,
      emitPath: false,
      checkStrictly: !props.multiple,
      expandTrigger: 'hover',
      label: 'name',
      value: 'id'
    }
)
const activeId = ref<any>(props.multiple ? [] : undefined)

const findCheckedNodeAllChildId = (data: CascaderSelectorData[], activeIds: number[] = [], parentId?: number) => {
  data.forEach(e => {
    if (parentId && activeIds.includes(parentId)) {
      activeIds.push(e.id)
    }
    if (e.children?.length) {
      findCheckedNodeAllChildId(e.children, activeIds, e.id)
    }
  })
  return activeIds
}

watch(() => JSON.stringify(props.modelValue || {}), () => {
  if (props.multiple) {
    activeId.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue]
  } else {
    activeId.value = props.modelValue
  }
})


const row1CascaderRef = ref()
const emits = defineEmits(['update:modelValue', 'change'])

const changeHandler = (val: any) => {
  if (Array.isArray(val) && !val.length) {
    if (props.multiple) {
      emits('update:modelValue', [])
      emits('change', [])
    } else {
      emits('update:modelValue', val)
      emits('change', val)
    }
  }
}
const clickHandler = (nodeData: any, node: any) => {
  if (props.multiple) {
    row1CascaderRef.value.cascaderPanelRef.handleCheckChange(node, !node.checked, false)
    const resultTmp = row1CascaderRef.value.getCheckedNodes().map((e: any) => e.data.id)
    emits('update:modelValue', resultTmp)
    emits('change', resultTmp)
  } else {
    emits('update:modelValue', nodeData.id)
    emits('change', nodeData.id)
    row1CascaderRef.value.togglePopperVisible(false);
  }
}

</script>

<style scoped lang="less">
.cascader-selector {

  .checked-node {
    color: var(--el-color-primary) !important;
  }

  .check-tick {
    display: inline-block;
    width: 20px;
  }

  :deep(.el-cascader-node) {
    padding-left: 5px;
  }

  :deep(.el-cascader-node.is-selectable.in-checked-path) {
    color: var(--el-color-primary-light-3) !important;
  }

  :deep(.el-cascader-node > .el-radio) {
    display: none !important;
  }

  :deep(.el-popper) {
    max-width: none !important;
  }

  :deep(.el-checkbox) {
    display: none;
  }

  :deep(.el-cascader__tags) {
    flex-wrap: nowrap;

    .el-tag.is-closable {
      max-width: 50%;
      min-width: 10px;
    }
  }

  :deep(.el-cascader__search-input) {
    margin-left: 0;
    min-width: 20px;
  }

  :deep(.in-active-path) {
    color: inherit;
  }
}
</style>