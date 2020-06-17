import ReactDOM from "react-dom";
import { createQueue } from "./queue";
import { hotModule } from "./hotModules";

// 更新队列
const runInRenderQueue = createQueue((cb) => {
  if (ReactDOM.unstable_batchedUpdates) {
    ReactDOM.unstable_batchedUpdates(cb as any);
  } else {
    cb();
  }
});

export const reactRerender = (moduleId: string) => {
  // 热更新react
  const [module, firstRegister] = hotModule(moduleId);
  if (!firstRegister) {
    runInRenderQueue(() => {
      module.instances.forEach((inst) => inst.forceUpdate());
    });
  }
};

export const fullReload = () => {
  location.reload();
};

window.__ReactHMR__ = {
  fullReload,
  reactRerender,
};
