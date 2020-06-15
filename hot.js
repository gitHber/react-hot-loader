import React from "react";
import ReactDOM from "react-dom";
import { hotModule } from "./modules";
import { createQueue } from "./queue";
import hoistNonReactStatic from "hoist-non-react-statics";
import reactHotLoader from "./reactHotLoader";

/* eslint-disable camelcase, no-undef */
const requireIndirect =
  typeof __webpack_require__ !== "undefined" ? __webpack_require__ : require;
/* eslint-enable */
reactHotLoader.patch(React, ReactDOM);

const createHoc = (SourceComponent, TargetComponent) => {
  hoistNonReactStatic(TargetComponent, SourceComponent);
  TargetComponent.displayName = `HotExported_${SourceComponent.name}`;
  return TargetComponent;
};

const runInRequireQueue = createQueue();
// 更新队列
const runInRenderQueue = createQueue((cb) => {
  if (ReactDOM.unstable_batchedUpdates) {
    ReactDOM.unstable_batchedUpdates(cb);
  } else {
    cb();
  }
});

const makeHotExport = (sourceModule, moduleId) => {
  // 热更新react
  const updateInstances = () => {
    const module = hotModule(moduleId);
    const deepUpdate = () => {
      // 源码
      runInRenderQueue(() => {
        module.instances.forEach((inst) => inst.forceUpdate());
      });
    };
    runInRequireQueue(() => {
      try {
        requireIndirect(moduleId);
      } catch (e) {
        console.log("require new module failed!");
      }
    }).then(deepUpdate);
  };
  if (sourceModule.hot) {
    // 阻塞更新传递
    sourceModule.hot.accept(updateInstances);
    if (sourceModule.hot.addStatusHandler) {
      if (sourceModule.hot.status() === "idle") {
        sourceModule.hot.addStatusHandler((status) => {
          if (status === "apply") {
            console.log(sourceModule);
            updateInstances();
          }
        });
      }
    }
  }
};
export const hot = (sourceModule) => {
  if (!sourceModule) {
    throw new Error("sourceModule is not provide");
  }
  const moduleId = sourceModule.id || sourceModule.i;
  if (!moduleId) {
    throw new Error("sourceModule is a invalid module");
  }
  const module = hotModule(moduleId);
  let firstHotRegistered = false;
  makeHotExport(sourceModule, moduleId);
  return (WrappedComponent) => {
    const Hoc = createHoc(
      WrappedComponent,
      class Hoc extends React.Component {
        componentDidMount() {
          module.instances.push(this);
        }
        componentWillUnmount() {
          module.instances = module.instances.filter((a) => a !== this);
        }
        render() {
          return <WrappedComponent {...this.props} />;
        }
      }
    );
    if (!firstHotRegistered) {
      firstHotRegistered = true;
      reactHotLoader.register(
        WrappedComponent,
        WrappedComponent.displayName || WrappedComponent.name,
        moduleId
      );
    }
    return Hoc;
  };
};
