var hot = require("./hot").hot;
let parent;
if (module.hot) {
  const cache = require.cache;
  if (!module.parents || module.parents.length === 0) {
    throw new Error("no parents!!");
  }
  parent = cache[module.parents[0]];
  delete cache[module.id];
}
export default hot(parent);
