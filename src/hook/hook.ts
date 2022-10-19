import { type ComponentPublicInstance, getCurrentInstance } from "vue";
import { type ElMessageBoxShortcutMethod } from "element-plus";

type customtComponentInternalInstance = {
  useDict: void;
  download: void;
  parseTime: void;
  resetForm: void;
  handleTree: void;
  addDateRange: void;
  selectDictLabel: void;
  selectDictLabels: void;
  $tab: any;
  $auth: any;
  $cache: any;
  $modal: {
    alert: ElMessageBoxShortcutMethod;
  };
  $download: any;
};

// get compoments instance
export function useInstance() {
  const { appContext, proxy } = getCurrentInstance();
  const globalProperties = appContext.config.globalProperties;
  return {
    globalProperties,
    proxy: proxy as customtComponentInternalInstance & ComponentPublicInstance
  };
}
