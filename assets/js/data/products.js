export const products = Object.freeze([
  {
    id: "dvstudio",
    name: "DvStudio",
    description: Object.freeze({
      zh: "ArcGIS Pro 工具套件",
      en: "ArcGIS Pro toolkit"
    }),
    icon: "layers",
    pageUrl: null,
    downloadUrl: null
  },
  {
    id: "gdb-previewer",
    name: "GDB Previewer",
    description: Object.freeze({
      zh: "查看 GDB · SHP · MDB",
      en: "Inspect GDB · SHP · MDB"
    }),
    icon: "database",
    pageUrl: "products/gdb-previewer/",
    downloadUrl: null
  },
  {
    id: "dem-studio",
    name: "DEM Studio",
    description: Object.freeze({
      zh: "数字高程模型工具",
      en: "Digital elevation model tools"
    }),
    icon: "terrain",
    pageUrl: "https://github.com/SpDDoggy/DemStudio",
    external: true,
    downloadUrl: null
  }
]);
