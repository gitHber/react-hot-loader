declare interface Window {
  __ReactHMR__: {
    fullReload: () => void;
    reactRerender: (moduleId: string) => void;
  };
}
