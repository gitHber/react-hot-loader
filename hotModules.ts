import React from "react";
// 保存hotModules
interface Modules {
  instances: React.Component[];
  updateTimeout: number;
  moduleId: string;
}

const hotModules: { [key: string]: Modules } = {};

(<any>window).hotModules = hotModules;
// 获取hotModule，不存在则创建
export const hotModule = (moduleId: string): [Modules, boolean] => {
  if (!hotModules[moduleId]) {
    hotModules[moduleId] = { instances: [], updateTimeout: 0, moduleId };
    return [hotModules[moduleId], true];
  }
  return [hotModules[moduleId], false];
};
