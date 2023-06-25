<!--让数字变化有过程的组件-->
<template>
  <span class="animate-number">{{ formatter ? formatter(currentNumber) : defaultFormatter(currentNumber) }}</span>
</template>

<script lang="ts">
export default {
  name: 'AnimateNum',
}
</script>
<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = withDefaults(defineProps<{
    num: number | string, // 数字
    duration?: number, // 持续时间
    formatter?: ((value: string | number) => string | number) | undefined // 自定义格式化结果。默认带逗号格式
  }>(), {
    num: '',
    duration: 500,
    formatter: undefined
  }
)

let startTimeStamp = 0
let timeout: any = null
let currentNumber = ref<string | number>(0)
let oldNumber = 0
let finalNumber = 0
let fixNumber = 0

const requestAnimFrame = window.requestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).oRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 30);
  }


const defaultFormatter = (value: string | number) => {
  if (Object.prototype.toString.call(value) !== '[object Number]') {
    return value
  }
  const [intPart, floatPart] = String(value).split('.')
  return (intPart || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (floatPart ? '.' : '') + (floatPart || '')
}
const clearTimer = () => {
  if (timeout) {
    clearTimeout(timeout)
    cancelAnimationFrame?.(timeout)
    timeout = null
  }
}
const updateNumber = () => {
  clearTimer()
  if (typeof props.num !== 'number') {
    oldNumber = 0
    finalNumber = 0
    currentNumber.value = props.num
  } else {
    finalNumber = props.num
    if (typeof currentNumber.value !== 'number') {
      oldNumber = 0
      currentNumber.value = 0
    }
    fixNumber = (finalNumber.toString()).split('.')[1]?.length || 0
    if (currentNumber.value !== finalNumber) {
      startTimeStamp = performance.now()
      animateNumber()
    }
  }
}
const animateNumber = () => {
  clearTimer()
  requestAnimFrame(() => {
    if (performance.now() < startTimeStamp + props.duration) {
      const numTmp = oldNumber + (finalNumber - oldNumber) * (performance.now() - startTimeStamp) / props.duration
      currentNumber.value = Number(numTmp.toFixed(fixNumber))
      animateNumber()
    } else {
      const numTmp = Number(finalNumber.toFixed(fixNumber))
      currentNumber.value = numTmp
      oldNumber = numTmp
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    updateNumber()
  })
})

watch(() => props.num, () => {
  updateNumber()
})
onBeforeUnmount(() => {
  clearTimer()
})
</script>
<style scoped>
.animate-number {
  margin: 0;
  padding: 0;
}
</style>
