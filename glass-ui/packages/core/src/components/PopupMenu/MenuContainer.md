# MenuContainer 菜单容器

## 设计思路

- **配置化渲染**：`items` 数组驱动菜单项（圆形徽章图标 + 标签），点击调用项内 `onClick` 回调；`id` 作为渲染 key。
- **流向与淡出方向跟随 placement**：left/right → 纵向流（列排布、上下两端淡出）；top/bottom → 横向流（行排布、左右两端淡出），与 PopoverArrow 淡出方向保持一致。配合 Popover 作用域插槽可直接获取 placement。
- **三层结构**：
  1. 外层 `.menu-container`：尺寸约束（min/maxSize）、两端淡出 mask、面板装饰（背景 + 边框）；
  2. 中层 `ScrollContainer.menu-scroller`：承接溢出与滚动条美化（`flex: 1 1 auto; min-height/min-width: 0` 保证可收缩）；
  3. 内层 `div.menu-list > Button`：排布容器与菜单项，每项抽离为独立 `Button` 组件（可选圆形徽章图标 + 标签）。
- **溢出提示**：超过 `maxSize` 时内部滚动，淡出 mask 作用于外层可视盒，滚动时两端内容柔和渐隐。
- **装饰归属**：Popover 面板无装饰后，本组件自行持有背景 `#f5f5f5` 与边框 `#f59e0b`。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | 必填 | 菜单项配置 |
| `placement` | `[方向]` 或 `[方向]-start/end` | `'right'` | 决定流向与淡出方向 |
| `minSize` | `number` | `0` | 容器流向最小尺寸（px） |
| `maxSize` | `number` | `99999` | 容器流向最大尺寸（px） |
| `fadeSize` | `number` | `50` | 容器两端淡出范围（px） |

`MenuItem` 结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 唯一标识（渲染 key） |
| `icon` | `string`（可选） | 图标类名，如 `i-mdi-sword`；不传则不显示图标徽章 |
| `label` | `string` | 显示文本 |
| `onClick` | `() => void`（可选） | 点击回调 |

## CSS 变量（声明于 `.menu-container`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--menu-min-size` | `0px` | 流向最小尺寸 |
| `--menu-max-size` | `99999px` | 流向最大尺寸 |
| `--menu-fade-size` | `10px` | 两端淡出范围（props 覆盖） |

## 使用示例

```vue
const menuItems = [
  { id: 'items', icon: 'i-mdi-shopping-outline', label: 'Items', onClick: () => {} },
  { id: 'skills', icon: 'i-mdi-account', label: 'Skills', onClick: () => {} },
]

<!-- 配合 Popover 作用域插槽，方向自动一致 -->
<Popover v-model:visible="visible" placement="right">
  <template #trigger><MenuButton icon="i-mono-setting" /></template>
  <template #default="{ placement }">
    <MenuContainer :placement="placement" :items="menuItems" :max-size="200" />
  </template>
</Popover>
```

## 注意事项

- 图标类名须以字面量出现在源码中（配置数组中的字符串即可被 UnoCSS 收集）。
- `fadeSize` 过大时首尾菜单项会被明显渐隐，按视觉需要调整。
- 横向流（top/bottom placement）下菜单项行排布，分隔线为左边框。
