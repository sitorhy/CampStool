# MenuButton 圆形菜单按钮

## 设计思路

- **三层结构**：外层 `<button>` 提供外围圆环（`border`）与圆圈-圆环间距（`padding`）；中层 `.menu-btn-circle` 为实心圆圈；内层图标 span。
- **圆环颜色跟随圆圈**：圆环 `border-color` 与圆圈 `background-color` 绑定同一组变量（`--menu-btn-bg` / `--menu-btn-bg-hover`），hover 时同步变色。
- **动态颜色方案**：背景色、图标色及其 hover 态全部由 props 注入内联 CSS 变量，scoped 样式消费变量实现 hover 动态变色（运行时 props 无法生成 UnoCSS 原子类）。
- **图标颜色**：mono 图标集合为 `currentColor`，按钮 `color` 即图标色，hover 时随 `--menu-btn-icon-hover` 切换。
- **圆环开关**：`ring=false` 时通过修饰类 `.menu-btn--no-ring` 去掉边框与间距，退化为纯圆圈。
- **尺寸可配**：圆圈直径、图标尺寸、圆环粗细分别由 `size` / `iconSize` / `ringWidth` 控制，经内联 CSS 变量注入 scoped 样式，与 `gap` 一致保持三层结构比例可独立调节。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `string` | 必填 | 图标类名，如 `i-mono-setting` |
| `bg` | `string` | `#f59e0b` | 圆圈与圆环背景色 |
| `iconColor` | `string` | `#ffffff` | 图标颜色 |
| `hoverBg` | `string` | `#d97706` | 悬停时背景色 |
| `hoverIconColor` | `string` | `#ffffff` | 悬停时图标颜色 |
| `gap` | `number` | `3` | 圆圈与圆环间距（px） |
| `ring` | `boolean` | `true` | 是否显示外围圆环 |
| `size` | `number` | `40` | 圆圈直径（px） |
| `iconSize` | `number` | `24` | 图标尺寸（px） |
| `ringWidth` | `number` | `2` | 外围圆环粗细（px） |

## CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--menu-btn-bg` | `#f59e0b` | 背景色 |
| `--menu-btn-icon` | `#ffffff` | 图标色 |
| `--menu-btn-bg-hover` | `#d97706` | 悬停背景色 |
| `--menu-btn-icon-hover` | `#ffffff` | 悬停图标色 |
| `--menu-btn-gap` | `3px` | 圆圈-圆环间距 |
| `--menu-btn-size` | `40px` | 圆圈直径 |
| `--menu-btn-icon-size` | `24px` | 图标尺寸 |
| `--menu-btn-ring-width` | `2px` | 外围圆环粗细 |

## 使用示例

```vue
<!-- 默认配色 + 圆环 -->
<MenuButton icon="i-mono-setting" />

<!-- 自定义配色、无圆环 -->
<MenuButton
  icon="i-mono-setting"
  bg="#1e293b"
  icon-color="#f59e0b"
  hover-bg="#334155"
  hover-icon-color="#fbbf24"
  :ring="false"
/>

<!-- 小尺寸按钮：圆圈 28px、图标 16px、圆环 1px、间距 2px -->
<MenuButton icon="i-mono-setting" :size="28" :icon-size="16" :ring-width="1" :gap="2" />
```

## 注意事项

- `icon` 的类名字符串必须以字面量形式出现在源码中（如模板属性值），否则 UnoCSS 构建期无法收集生成对应图标 CSS。
- 作为 Popover 触发元素时放入 `trigger` 插槽即可，点击切换由 Popover 处理。
