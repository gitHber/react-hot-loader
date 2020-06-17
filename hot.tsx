import React from "react";
import { hotModule } from "./hotModules";
import hoistNonReactStatic from "hoist-non-react-statics";
import reactHotLoader, { ReactType } from "./reactHotLoader";
import { reactRerender } from "./hmr";

const createHoc = (
  SourceComponent: ReactType,
  TargetComponent: React.ComponentType
) => {
  hoistNonReactStatic(TargetComponent, SourceComponent, { PROXY_KEY: true });
  TargetComponent.displayName = `HotExported_${SourceComponent.name}`;
  return TargetComponent;
};

export const hot = (meta: { url: string }, WrappedComponent: ReactType) => {
  if (!meta) {
    throw new Error("meta is not provide");
  }

  const url = new URL(meta.url);
  const moduleId = url.origin + url.pathname;
  const [module] = hotModule(moduleId);

  reactHotLoader.register(
    WrappedComponent,
    WrappedComponent.displayName || WrappedComponent.name,
    moduleId
  );
  Promise.resolve().then(() => reactRerender(moduleId));
  return createHoc(
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
};
