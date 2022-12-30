<template>

</template>
<script setup lang="ts">
const worker1 = new Worker('./workerThread1.js', {name: 'worker1'})
worker1.onmessage = (event) => {
  console.log('worker1 message callback', event.data)
}
worker1.postMessage({name: '张三'})
</script>
