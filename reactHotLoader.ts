export type ReactType = React.FunctionComponent & {
  PROXY_KEY: string;
};

const proxies = new Map<string, ProxyConstructor>();
const types = new Map<string, ReactType>();

const resolveType = (type: ReactType) => {
  if (type["PROXY_KEY"]) {
    // 已经代理了
    return proxies.get(type["PROXY_KEY"]);
  }
  return type;
};

const reactHotLoader = {
  register(type: ReactType, name: string, id: string) {
    if (!type["PROXY_KEY"]) {
      const key = `${id}-${name}`;
      type["PROXY_KEY"] = key;
      types.set(key, type);
      if (!proxies.get(key)) {
        proxies.set(
          key,
          new Proxy<any>(type, {
            apply: function (target, thisBinding, args: [any, any]) {
              const id = target["PROXY_KEY"];
              const latestTarget = types.get(id);
              return latestTarget!(...args);
            },
          })
        );
      }
    }
  },
  // 代理react的某些方法
  patch(React: any, ReactDOM: any) {
    if (!React.createElement.isPatchd) {
      const origin = React.createElement;
      React.createElement = (type: any, ...args: any[]) =>
        origin(resolveType(type), ...args);
      React.createElement.isPatchd = true;
    }
  },
};
export default reactHotLoader;
