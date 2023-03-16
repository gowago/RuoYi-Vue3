import * as components from "@element-plus/icons-vue";

export default {
  install: app => {
    for (const key in components) {
      const componentConfig = components[key];
      console.log(componentConfig.name, componentConfig);
      app.component(componentConfig.name, componentConfig);
    }
  }
};
