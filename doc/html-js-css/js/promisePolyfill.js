'use strict';
// 兼容chrome 36-85 的浏览器可以使用以下函数
if (Object.prototype.toString.call(Promise.any) !== '[object Function]') {
  const reverse = (promise) => new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));
  Promise.any = (iterable) => {
    return reverse(Promise.all([...iterable].map(reverse)));
  }
}

if (Object.prototype.toString.call(Promise.allSettled) !== '[object Function]') {
  const rejectHandler = reason => ({status: 'rejected', reason});
  const resolveHandler = value => ({status: 'fulfilled', value});
  Promise.allSettled = (promises) => {
    const convertedPromises = promises.map(p => Promise.resolve(p).then(resolveHandler, rejectHandler));
    return Promise.all(convertedPromises);
  };
}
