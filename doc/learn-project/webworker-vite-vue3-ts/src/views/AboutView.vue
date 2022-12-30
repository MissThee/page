<template>

</template>

<script lang="ts" setup>

function work() {
  onmessage = ({data: {content, TASK_ID}}) => {
    console.log('worker receive:', content);
    let result = null
    if (content.param?.length) {
      switch (content.method) {
        case 'sum':
          result = content.param?.reduce((sum: number, item: number) => item + sum, 0)
          break;
        case 'avg':
          result = content.param?.reduce((sum: number, item: number) => item + sum, 0)
          result /= content.param.length
          break;
      }
    }
    postMessage({result, TASK_ID});
  };
}

const makeWorker = (f: Function, message: any) => {
  const worker = new Worker(URL.createObjectURL(new Blob([`(${f.toString()})()`])));
  let resolveMap = new Map<any, (value: unknown) => void>()

  worker.onmessage = ({data: {result, TASK_ID}}) => {
    resolveMap.get(TASK_ID)?.(result);
  };

  return new Promise(resolve => {
    const TASK_ID = Date.now() + Math.random()
    resolveMap.set(TASK_ID, resolve)
    worker.postMessage({content: message, TASK_ID});
  });

};


makeWorker(work, {name: 'thread1', method: 'avg', param: [1, 2, 3, 4]}).then(res => {
  console.log('Thread end:', res);
});


</script>

<style>

</style>
