// 保存hotModules
const hotModules = {};
window.hotModules = hotModules;
// 获取hotModule，不存在则创建
export const hotModule = (moduleId) => {
  if (!hotModules[moduleId]) {
    hotModules[moduleId] = { instances: [], updateTimeout: 0, moduleId };
  }
  return hotModules[moduleId];
};
