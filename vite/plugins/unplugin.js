import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// your plugin installation
export default function createUnPlugin() {
  return Components({
    resolvers: [ElementPlusResolver()]
  });
}
