import React from "react";
import ReactDOM from "react-dom";
import reactHotLoader from "./reactHotLoader";

export { hot } from "./hot";
export * from "./hmr";

reactHotLoader.patch(React, ReactDOM);
