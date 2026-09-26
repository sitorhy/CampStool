# Button 按钮

## 设计思路

- **最小可复用菜单项按钮**：渲染为一个原生 `<button>`，包含可选的圆形徽章图标与文本标签，点击事件由父组件通过原生 `@click` 透传（绑定到根 `button` 元素）。
- **图标可选**：`icon` 为空时整个圆形徽章（`.button-badge`）不渲染，仅显示标签。
- **样式自治**：背景、悬停色、徽章配色等装饰样式内置于组件，`font-family: inherit` 以继承父容器（如 MenuContainer）字体。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | `''` | 显示文本 |
| `icon` | `string` | `''` | 图标类名，如 `i-mdi-sword`；为空则不显示图标徽章 |

## 使用示例

```vue
<!-- 带图标 -->
<Button icon="i-mdi-shopping-outline" label="Items" @click="onItems" />

<!-- 仅文本，不显示图标徽章 -->
<Button label="More" @click="onMore" />
```

## 注意事项

- 图标类名须以字面量出现在源码中，才能被 UnoCSS 收集。
