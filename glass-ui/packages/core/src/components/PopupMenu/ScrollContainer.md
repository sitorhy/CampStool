# ScrollContainer 通用滚动容器

## 设计思路

- **套牢即用**：单根 div 包裹默认插槽，提供 `overflow` 与全套滚动条美化样式，任意内容套进去即生效。
- **双引擎适配**：WebKit/Blink 走 `::-webkit-scrollbar` 系列伪元素（粗细、轨道、滑块、圆角、hover 色）；Firefox 走 `scrollbar-width: thin` + `scrollbar-color`。
- **外观全变量化**：所有滚动条外观经 props → 内联 CSS 变量注入，根规则保留默认值声明作兜底。
- **方向控制**：`direction` 决定溢出轴（vertical / horizontal / both）。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | 滚动方向 |
| `thickness` | `number` | `6` | 滚动条粗细（px） |
| `thumbColor` | `string` | `rgb(0 0 0 / 0.3)` | 滑块颜色 |
| `thumbHoverColor` | `string` | `rgb(0 0 0 / 0.45)` | 滑块悬停颜色 |
| `trackColor` | `string` | `transparent` | 轨道颜色 |
| `radius` | `number` | `3` | 滑块圆角（px） |

## CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--scroll-thickness` | `6px` | 粗细 |
| `--scroll-thumb` | `rgb(0 0 0 / 0.3)` | 滑块色 |
| `--scroll-thumb-hover` | `rgb(0 0 0 / 0.45)` | 滑块 hover 色 |
| `--scroll-track` | `transparent` | 轨道色 |
| `--scroll-radius` | `3px` | 滑块圆角 |

## 使用示例

```vue
<ScrollContainer direction="vertical" :thickness="4" thumb-color="#f59e0b">
  <!-- 任意可溢出内容 -->
</ScrollContainer>
```

## 注意事项

- 在 flex 父容器内作为滚动区时，需配合 `flex: 1 1 auto; min-height: 0; min-width: 0` 才能正确收缩产生滚动（参见 MenuContainer 的 `.menu-scroller`）。
- `::-webkit-scrollbar` 仅 WebKit/Blink 生效；Firefox 下粗细固定为 `thin`，颜色跟随 `scrollbar-color`。
- 组件根节点会透传 class / style，可直接在外层加类名定制布局。
