<template>
  <div class="engineer-list">
    <div class="header">
      <div class="title">工程师列表</div>
      <el-button @click="hideSwitchHandler" type="text" class="switch-btn">{{ isHideAll ? '全部隐藏' : '全部展示' }}</el-button>
    </div>
    <div class="list">
      <table style="width: 100%">
        <tr class="item"
            v-for="item in data"
            :key="item.id"
            @click="engineerClickHandler(item.id)"
            :class="{ 'item--active': modelValue.includes(item.id)}">
          <td class="name">
            <div class="name-icon" :style="{background: item.color}"/>
            <span>{{ item.name }}</span>
          </td>
          <td class="region">
            <span v-if="item.region">{{ item.region }}</span>
          </td>
          <td class="value" v-if="!props.hideOrderCount">{{ item.order_count }}单</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "EngineerList"
}
</script>

<script setup lang="ts">
import {withDefaults, defineProps, ref, defineEmits} from 'vue'

const props = withDefaults(defineProps<{
  data: any[],
  modelValue: any[]
  hideOrderCount?:boolean
}>(), {
  data: () => [],
  modelValue: () => []
})

const isHideAll = ref(true)
const emits = defineEmits(['update:modelValue'])
const hideSwitchHandler = () => {
  emits('update:modelValue', isHideAll.value ? [] : (props.data?.map((e: any) => e.id) || []))
  isHideAll.value = !isHideAll.value
}
const engineerClickHandler = (id: any) => {
  const existIndex = props.modelValue?.indexOf(id)
  if (existIndex === -1) {
    emits('update:modelValue', [...props.modelValue, id])
  } else {
    emits('update:modelValue', props.modelValue.filter(e => e !== id))
  }
}
</script>

<style scoped lang="scss">
.engineer-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding: 0px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    justify-items: center;

    .title {
      line-height: 50px;
    }
  }

  .switch-btn {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }

  .list {
    flex: 1;
    overflow-y: auto;
    height: 100%;
    background: #fff;

    .item {
      td {
        cursor: pointer;
        height: 24px;
        line-height: 24px;
        padding: 0 3px;
        font-size: 12px;
        border-bottom: 1px solid #F5F5F5;
      }

      .name {
        color: #333333;

        .name-icon {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
        }
      }

      .value {
        color: #999999;
        font-weight: 400;
        text-align: right;
      }

      &--active {
        background: rgba(27, 94, 255, 0.09)
      }
    }

  }
}
</style>