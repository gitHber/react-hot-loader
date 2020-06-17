export const createQueue = (runner = (a: Function) => a()) => {
  let promise: Promise<any>;
  let queue: Function[] = [];
  const runAll = () => {
    const oldQueue = queue;
    oldQueue.forEach((cb) => cb());
    queue = [];
  };
  const add = (cb: Function) => {
    if (queue.length === 0) {
      // 添加微任务执行队列， 不阻塞任务添加
      promise = Promise.resolve().then(() => runner(runAll));
    }
    queue.push(cb);
    return promise;
  };
  return add;
};
