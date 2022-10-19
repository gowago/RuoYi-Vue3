import autoImport from "unplugin-auto-import/vite";

export default function createAutoImport() {
  return autoImport({
    imports: [
      "vue",
      "vue-router",
      "pinia",
      {
        "@/hook/hook": ["useInstance"]
      }
    ],
    dts: "./auto-imports.d.ts",
    dirs: ["/src/hook"]
  });
}
