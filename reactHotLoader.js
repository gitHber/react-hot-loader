const proxies = new Map();
const types = new Map();

const resolveType = (type) => {
  if (type["PROXY_KEY"]) {
    // 已经代理了
    return proxies.get(type["PROXY_KEY"]);
  }
  return type;
};

const reactHotLoader = {
  register(type, name, id) {
    if (!type["PROXY_KEY"]) {
      const key = `id-${name}`;
      type["PROXY_KEY"] = key;
      types.set(key, type);
      if (!proxies.get(key)) {
        proxies.set(
          key,
          new Proxy(type, {
            apply: function (target, thisBinding, args) {
              const id = target["PROXY_KEY"];
              const latestTarget = types.get(id);
              return latestTarget(...args);
            },
          })
        );
      }
    }
  },
  // 代理react的某些方法
  patch(React, ReactDOM) {
    if (!React.createElement.isPatchd) {
      const origin = React.createElement;
      React.createElement = (type, ...args) =>
        origin(resolveType(type), ...args);
      React.createElement.isPatchd = true;
    }
  },
};
export default reactHotLoader;
