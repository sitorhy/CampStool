# PopoverArrow 指针箭头

## 设计思路

- **四子元素拼装**（均为绝对定位 `<i>`）：
  1. `.popover-arrow-divider`：分割线，与弹出内容相距 `--arrow-divider-gap`（3px）；
  2. `.popover-arrow-tip--a / --b`：分割线两端等腰三角形，底边宽 = 分割线宽，`clip-path` 裁出尖角；
  3. `.popover-arrow-pointer`：带孔等腰三角形，底边贴在分割线上、顶点指向触发元素；圆孔用 `mask: radial-gradient(...)` 真镂空（透出页面背景），孔心位于距底边约 10% 指针高处。
- **方向适配**：按 placement 方向分四组布局规则——left/right 为竖直分割线 + 水平指向；top/bottom 为水平分割线 + 竖直指向。
- **分割线拉伸（auto）**：`dividerHeight='auto'` 时消费 Popover 实测的 `--popover-panel-cross`，分割线范围与弹出内容交叉轴尺寸一致；auto 且 start/end 对齐时整个箭头跟随面板边缘（`--stretch` 类），居中对齐时居中于触发元素。数字模式则固定高度并居中于触发元素中心线。
- **尺寸约束**：`minDividerHeight` / `maxDividerHeight` 通过 `clamp()` 约束分割线高度，auto 与数字模式均生效。
- **两端淡出**：容器整体 `mask: linear-gradient(...)`，两端各 `fadeSize` 范围渐隐，尖角端柔和消失；方向与 MenuContainer 淡出方向一致。
- **投影**：部件为 `clip-path` 裁剪、容器带 `mask`，`box-shadow` 会被裁掉；改用容器级 `filter: drop-shadow()`，阴影跟随裁剪后的实际轮廓；淡出 mask 同时作用于阴影，端部过渡一致。可用 `shadow` 开关关闭。
- **独立样式变量**：所有尺寸/颜色为 CSS 变量，未设置时跟随 Popover 同名变量（如 `--arrow-color` 跟随 `--popover-arrow-bg`）。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placement` | `[方向]` 或 `[方向]-start/end` | `'right'` | 决定箭头朝向与拉伸基准 |
| `dividerHeight` | `number \| 'auto'` | `'auto'` | 分割线高度；auto 跟随内容尺寸 |
| `tipHeight` | `number` | `40` | 两端等腰三角形的高（px） |
| `pointerWidth` | `number` | `30` | 指向三角形底边宽（px） |
| `pointerHeight` | `number` | `30` | 指向三角形的高（底边到顶点，px） |
| `minDividerHeight` | `number` | `0` | 分割线最小高度（px） |
| `maxDividerHeight` | `number` | `150` | 分割线最大高度（px） |
| `fadeSize` | `number` | `50` | 容器两端淡出范围（px） |
| `shadow` | `boolean` | `true` | 是否添加投影（跟随裁剪轮廓） |
| `shadowColor` | `string` | `rgb(0 0 0 / 0.35)` | 投影颜色 |
| `shadowBlur` | `number` | `4` | 投影模糊半径（px） |

## CSS 变量（声明于 `.popover-arrow`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--arrow-color` | `var(--popover-arrow-bg, #f5f5f5)` | 整体填充色 |
| `--arrow-divider-width` | `4px` | 分割线宽 |
| `--arrow-divider-gap` | `3px` | 分割线与弹出内容距离 |
| `--arrow-pointer-height` | `30px` | 指向三角形高 |
| `--arrow-pointer-width` | `30px` | 指向三角形底边宽 |
| `--arrow-hole-size` | `8px` | 镂空圆孔直径 |
| `--arrow-divider-height` | `var(--popover-panel-cross, 60px)` | 分割线高（props 覆盖） |
| `--arrow-tip-height` | `60px` | 两端尖角高（props 覆盖） |
| `--arrow-fade-size` | `10px` | 两端淡出范围（props 覆盖） |
| `--arrow-shadow-color` | `rgb(0 0 0 / 0.35)` | 投影颜色（props 覆盖） |
| `--arrow-shadow-blur` | `4px` | 投影模糊半径（props 覆盖） |

## 结构示意（right 方向）

```
        tip-a ▲
   触发元素 ◁ pointer ┃ divider   ┊ 3px ┊ 面板内容
        tip-b ▼
   （容器上下两端 fadeSize 范围淡出）
```

## 使用示例

通常由 Popover 内部引用并透传 placement，无需直接使用：

```vue
<PopoverArrow :placement="placement" />
```

## 注意事项

- 单独使用时父级必须是「与触发元素同尺寸的已定位容器」（如 Popover 的 `.popover-layer`），定位百分比才正确。
- 箭头 `pointer-events: none`，不拦截交互。
- 修改 `--popover-gap` 时需保证大于 `pointerHeight + divider-gap`，否则指针压到触发元素。
