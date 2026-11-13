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
    name: "GeoPreviewer",
    description: Object.freeze({
      zh: "查看 GIS 与 CAD 数据",
      en: "Inspect GIS and CAD data"
    }),
    icon: "database",
    pageUrl: "products/gdb-previewer/",
    downloadUrl: null
  },
  {
    id: "dem-studio",
    name: "DEMStudio",
    description: Object.freeze({
      zh: "地形渲染与地理参考出图",
      en: "Terrain rendering and georeferenced output"
    }),
    icon: "terrain",
    pageUrl: "products/dem-studio/",
    downloadUrl: null
  }
]);
