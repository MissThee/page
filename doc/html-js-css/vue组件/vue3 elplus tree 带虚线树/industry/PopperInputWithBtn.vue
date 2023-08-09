<template>
  <el-popover trigger="click" width="250" :teleported="false">
    <div style="display: flex">
      <el-input style="flex:1;margin-right: 10px;" :placeholder="`请输入${ props.name }名称`" clearable v-model.trim="editValue"></el-input>
      <el-button type="primary" @click="submitHandler">确定</el-button>
    </div>
    <template #reference>
      <el-button type="primary" :icon="Plus" size="small" plain title="添加子级" style="margin-right: 10px">{{ props.name }}</el-button>
    </template>
  </el-popover>
</template>

<script lang="ts">
export default {
  name: "PopperInputWithBtn"
};
</script>

<script setup lang="ts">

import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";

const props = withDefaults(defineProps<{
  name?: string
}>(), {
  name: ""
});

const editValue = ref("");
const emits = defineEmits(["submit"]);
const submitHandler = () => {
  emits("submit", editValue.value);
};
</script>

<style scoped lang="scss">

</style>