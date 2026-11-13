# DEMStudio 0.2.0

## 导出与预览

- PNG / TIFF 与当前视图、原图正射取景独立选择。
- 所有支持的输入格式均可导出 TIFF，支持 8-bit / 16-bit、倍率及独立自定义宽高。
- 原图正射支持可选地理信息，源自带坐标系时可用；PNG 与 TIFF 均支持。
- 两种格式的原图正射均支持透明阴影外扩，输出坐标随尺寸与边距同步调整。
- 修复 PNG / JPEG 源在页面与源精度导出中地形起伏不一致的问题。
- 改善导出取景快照、预览刷新、取消恢复和最终结果缩略显示。

## 地形与渲染

- 支持源精度、1/2、1/4 及预览精度导出；大图使用有界分页几何。
- 提供完整 Rust / OpenGL / GLSL 渲染核心、栅格读取与影像输出源码。

## 下载

- `DEMStudio-0.2.0-windows-x64-setup.exe`：Windows x64 安装包。
- `DEMStudio-0.2.0-windows-x64-portable.zip`：解压后运行 `DEMStudio.exe`。
- `SHA256SUMS.txt`：下载校验值。

运行需要支持 OpenGL 3.3 Compatibility Profile 的显卡驱动与 Microsoft Edge WebView2 Runtime。安装包会检查并引导安装 WebView2；便携版需系统已有该运行时。

PNG 的地理定位保存在同名 `.png.aux.xml` 文件中；部分自定义坐标系 TIFF 也附带 `.tif.aux.xml`，请与影像一起保留。
