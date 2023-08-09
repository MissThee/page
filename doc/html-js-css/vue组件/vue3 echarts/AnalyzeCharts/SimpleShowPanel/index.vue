<template>
  <div v-if="hasShown||isSHow" v-show="isSHow">
    <slot/>
  </div>
</template>

<script lang="ts">
export default {
  name: "SimpleShowPanel"
}
</script>
<!-- 首次判断使用v-if隐藏组件，不渲染。 当渲染过一次后，之后使用v-show隐藏 -->
<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = withDefaults(defineProps<{
  value?: boolean
}>(), {
  value: false
})

const hasShown = ref(false)
const isSHow = ref(false)
let needEmitResizeNextShow = false

watch(() => props.value, () => {
  isSHow.value = props.value
  if (isSHow.value) {
    hasShown.value = true
    if (needEmitResizeNextShow) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      })
      needEmitResizeNextShow = false
    }
  }
}, {
  immediate: true
})

const updateNeedEmitResizeNextShow = () => {
  needEmitResizeNextShow = true
}

onMounted(() => {
  window.addEventListener('resize', updateNeedEmitResizeNextShow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateNeedEmitResizeNextShow)
})
</script>

<style scoped lang="less">

</style>