# Popover 弹出层容器

## 设计思路

- **触发元素同尺寸定位层**：根节点 `.popover-root` 与触发元素同尺寸（inline-block），内部 `.popover-layer` 以 `inset: 0` 覆盖触发盒；面板与箭头均相对该层定位，12 种 placement 规则全部基于触发盒纯 CSS 完成，无需 JS 计算坐标。
- **placement 语义**：`[方向]-[对齐位置]`。方向决定面板在触发元素哪一侧；对齐决定交叉轴对齐方式（start / end / 省略居中）。例：`left-end` = 面板在左侧且底边与触发元素底边对齐。
- **显隐控制**：`visible` prop + `update:visible` 事件（`v-model:visible`）。触发元素点击切换（`@click.stop`）；document 点击监听实现外部点击关闭；面板内部点击不关闭（`@click.stop`）。
- **面板无装饰**：面板不带背景/边框/圆角/阴影，外观完全由插槽内容组件决定（如 MenuContainer 自带背景与边框）。
- **作用域默认插槽**：`<slot :placement="placement" />` 暴露 placement，内容组件据此判断流向/淡出方向，无需外部重复传参。
- **内容尺寸测量**：ResizeObserver 实测面板交叉轴尺寸（left/right 取高、top/bottom 取宽）写入 `--popover-panel-cross`，供 PopoverArrow 分割线 `auto` 拉伸；方向切换时重新同步。
- **动效**：`<Transition name="popover">` + `v-show`，0.15s 透明度淡入淡出。
- **事件隔离**：layer 为 `pointer-events: none`、面板为 `auto`，隐藏时不遮挡页面交互。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` 及 `-start` / `-end` 变体 | `'right'` | 弹出框位置 |
| `visible` | `boolean` | `false` | 是否显示，支持 `v-model:visible` |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:visible` | `(value: boolean)` | 显隐变化（触发点击 / 外部点击） |

## Slots

| 插槽 | 作用域参数 | 说明 |
| --- | --- | --- |
| `trigger` | 无 | 触发元素（如 MenuButton） |
| 默认 | `{ placement }` | 弹出内容 |

## CSS 变量（声明于 `.popover-root`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--popover-bg` | `#f5f5f5` | 箭头颜色来源（`--popover-arrow-bg` 跟随它） |
| `--popover-gap` | `40px` | 触发元素与面板间距，需容纳箭头指针高 + 分割线间距 |
| `--popover-panel-cross` | `60px`（实测覆盖） | 面板交叉轴尺寸，ResizeObserver 写入 |
| `--popover-arrow-bg` | `var(--popover-bg)` | 箭头颜色，由 PopoverArrow 消费 |

## 使用示例

```vue
<Popover v-model:visible="menuVisible" placement="right">
  <template #trigger>
    <MenuButton icon="i-mono-setting" />
  </template>
  <template #default="{ placement }">
    <MenuContainer :placement="placement" :items="menuItems" :max-size="200" />
  </template>
</Popover>
```

## 注意事项

- `--popover-gap` 必须大于箭头 `pointerHeight + 分割线间距`，否则指针三角形会压到触发元素。
- 面板隐藏时为 `display: none`，ResizeObserver 在显示瞬间补测尺寸。
- 外部点击关闭依赖 document 冒泡监听，组件卸载时自动移除。
