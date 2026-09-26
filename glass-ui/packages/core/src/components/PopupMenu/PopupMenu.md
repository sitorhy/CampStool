# PopupMenu 弹出菜单

## 设计思路

- **触发 + 列表一体化**：组件内含触发按钮与菜单列表，点击触发按钮切换菜单显隐，无需外部管理状态。
- **菜单项由 MenuButton 组成**：每个菜单项是一个无圆环的 MenuButton（`ring=false`），垂直排列在触发按钮下方（或上方），按钮尺寸可配。
- **placement 控制呼出方向**：`bottom`（默认）菜单列表在触发按钮下方，`top` 时列表在上方。列表定位通过 flex `order: -1` 实现，无需绝对定位。
- **切入动画**：菜单按钮以 `ease-out`（减加速）曲线做渐显 + 位移过渡，初始偏移量由 `offsetY` 控制。`placement=top` 时配合 `column-reverse` 倒序排列，使偏移方向与切入方向一致。
- **交错延迟自适应**：每个按钮按索引递增延迟，`top` 时自动反转延迟顺序，保证靠近触发按钮的按钮始终最先出现。
- **点击外部关闭**：通过 `document` 级 `pointerdown` 监听实现，菜单显示时注册、关闭时移除，组件卸载时兜底清理。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `PopupMenuItem[]` | 必填 | 菜单项配置 |
| `triggerIcon` | `string` | 必填 | 触发按钮图标类名 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 菜单呼出位置（相对于触发按钮） |
| `offsetY` | `number` | `12` | 入场初始 Y 轴偏移量（px），方向由 placement 决定 |
| `itemSize` | `number` | `36` | 菜单项按钮直径（px） |
| `itemIconSize` | `number` | `20` | 菜单项图标尺寸（px） |
| `staggerDelay` | `number` | `50` | 各项交错延迟（ms） |

### PopupMenuItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 唯一标识，作为 `v-for` 的 `key` |
| `icon` | `string` | 图标类名 |
| `label` | `string` | 菜单项文本 |
| `onClick` | `() => void` | 可选，点击回调 |

## CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--popup-offset-y` | `12px` | 入场 Y 轴偏移量，由 `offsetY` prop 通过内联样式注入 |

## 动画参数

| 阶段 | 缓动 | 时长 | 效果 |
| --- | --- | --- | --- |
| 入场 | `ease-out` | `0.35s` | 透明度 0→1 + `translateY(offsetY)` → 0 |
| 离场 | `ease-in` | `0.2s` | 透明度 1→0 + `translateY(0)` → `translateY(4px)` |
| 交错延迟 | — | `staggerDelay × index` | 靠近触发按钮的按钮先出现 |

## 使用示例

```vue
<script setup lang="ts">
import PopupMenu from './components/PopupMenu.vue'

const menuItems = [
  { id: 'new', icon: 'i-mdi-file-plus-outline', label: 'New' },
  { id: 'open', icon: 'i-mdi-folder-outline', label: 'Open' },
  { id: 'save', icon: 'i-mdi-content-save-outline', label: 'Save' },
]
</script>

<template>
  <!-- 默认：菜单在触发按钮下方，偏移 12px -->
  <PopupMenu :items="menuItems" trigger-icon="i-mdi-menu-open" />

  <!-- 菜单在触发按钮上方呼出，偏移 20px -->
  <PopupMenu
    :items="menuItems"
    trigger-icon="i-mdi-menu-open"
    placement="top"
    :offset-y="20"
  />

  <!-- 自定义按钮尺寸与交错节奏 -->
  <PopupMenu
    :items="menuItems"
    trigger-icon="i-mdi-menu-open"
    :item-size="40"
    :item-icon-size="22"
    :stagger-delay="80"
  />
</template>
```

## 注意事项

- `triggerIcon` 与 `items[*].icon` 的类名字符串必须以字面量形式出现在源码中，否则 UnoCSS 构建期无法收集生成对应图标 CSS。
- 组件内部管理显隐状态（`visible`），不对外暴露 `v-model`；外部如需控制可通过 `key` 强制重建。
- `placement` 当前仅 `top` 与 `bottom` 有差异化行为（列表定位与切入方向），`left` / `right` 等效于 `bottom`。
