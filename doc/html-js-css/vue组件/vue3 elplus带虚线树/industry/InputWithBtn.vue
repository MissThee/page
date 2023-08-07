<template>
  <div style="display: flex;width: 100%" v-if="isEditing">
    <el-input style="flex:1;margin-right: 10px;" :placeholder="`请输入${ props.name }名称`" clearable v-model.trim="editValue"></el-input>
    <el-button type="primary" @click="isEditing=false" plain>取消</el-button>
    <el-button type="primary" @click="submitHandler">确定</el-button>
  </div>
  <el-button v-else @click="isEditing=true" plain :icon="Plus" type="primary" style="width: 100%;">添加{{ props.name }}</el-button>
</template>

<script lang="ts">
export default {
  name: "InputWithBtn"
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

const isEditing = ref(false);
const editValue = ref("");
const emits = defineEmits(["submit"]);
const submitHandler = () => {
  emits("submit", editValue.value);
};
</script>

<style scoped lang="scss">

</style>