import vue from "@vitejs/plugin-vue";

import createAutoImport from "./auto-import";
import createSvgIcon from "./svg-icon";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";
import createUnPlugin from "./unplugin";
import vueJsx from "@vitejs/plugin-vue-jsx";
export default function createVitePlugins(viteEnv, isBuild = false) {
  console.log("🚀 ~ file: index.js ~ line 9 ~ createVitePlugins ~ isBuild", isBuild);
  const vitePlugins = [
    vue(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ];
  vitePlugins.push(createAutoImport());
  // vitePlugins.push(createUnPlugin());

  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
