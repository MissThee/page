"use strict";
// @ts-ignore
self.onmessage = (event) => {
    console.log('worker1 message', event.data);
    doSth();
};
const doSth = () => {
    setTimeout(() => {
        self.postMessage({ state: 'ok', msg: 'done' });
    }, 1000);
};
