# Dialog 通用对话框

## 设计思路

- **Teleport 模态遮罩**：组件整体 `teleport` 到 `body`，`.dialog-overlay` 固定全屏并 flex 居中承载对话框；`v-show` 控制显隐，外包 `Transition` 实现透明度渐显 / 渐隐，时长由 `fadeDuration` 控制（默认 200ms）。
- **分段开启序列**：隐藏态与渐显期间 `.dialog-body` 保持 `height: 0` 折叠且默认插槽不渲染（对话框仅显头尾两栏）；渐显完毕（`@after-enter`）移除折叠类，主体区经 `height` 过渡回设定高度；`bodyDuration` 定时后恢复默认插槽渲染。渐隐完毕（`@after-leave`）复原折叠态，保证下次打开重放序列。
- **三段结构**：`.dialog` 主容器纵向排列标题栏 `.dialog-header`（当前硬编码 "Theme"）、主体区 `.dialog-body`（默认插槽）、底部操作栏 `.dialog-footer`（footer 插槽）；对话框宽度与主体区高度由 props 控制。
- **毛玻璃视觉**：header / footer 半透明背景 + `backdrop-filter: blur(8px)`，还原参考图中透出底层 UI 的效果；主体区为纵向渐变底色，插槽内容覆盖其上。
- **遮罩关闭**：`@click.self` 仅响应遮罩自身点击，`maskClosable` 为真时 emit 关闭；点击对话框本体不触发。
- **Props → CSS 变量**：`width` / `bodyHeight` / `fadeDuration` / `bodyDuration` 经内联样式注入 `--dialog-width` / `--dialog-body-height` / `--dialog-fade-duration` / `--dialog-body-duration`，CSS 根规则 `.dialog-overlay` 声明同值默认兜底。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | 是否显示，支持 `v-model:visible` |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否关闭 |
| `width` | `number` | `348` | 对话框宽度（px） |
| `bodyHeight` | `number` | `196` | 主体区域高度（px） |
| `fadeDuration` | `number` | `200` | 显隐渐显 / 渐隐时长（ms） |
| `bodyDuration` | `number` | `200` | 渐显完毕后主体区展开过渡时长（ms） |

## Emits

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:visible` | `[value: boolean]` | 显隐变更（遮罩点击时触发） |

## Slots

| 插槽 | 说明 |
| --- | --- |
| 默认 | 主体区内容（如主题主图与导航）；渐显完毕且主体区展开后才渲染 |
| `footer` | 底部操作区（如确认 / 取消按钮） |

## CSS 变量（声明于 `.dialog-overlay`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--dialog-width` | `348px` | 对话框宽度（props 覆盖） |
| `--dialog-body-height` | `196px` | 主体区域高度（props 覆盖） |
| `--dialog-fade-duration` | `200ms` | 显隐渐显 / 渐隐时长（props 覆盖） |
| `--dialog-body-duration` | `200ms` | 主体区展开过渡时长（props 覆盖） |

## 使用示例

```vue
<Dialog v-model:visible="dialogVisible" :fade-duration="300">
  <!-- 主体区内容任意 -->
  <template #footer>
    <div class="my-dialog-footer">
      <MenuButton icon="i-mdi-circle-outline" bg="#3b82f6" @click="dialogVisible = false" />
      <MenuButton icon="i-mdi-close" bg="#ef4444" @click="dialogVisible = false" />
    </div>
  </template>
</Dialog>
```

## 注意事项

- 标题栏当前硬编码 "Theme"，未开放插槽；如需自定义标题需修改组件模板。
- 显隐为纯透明度渐显 / 渐隐，无位移 / 缩放；渐隐过渡结束后 `v-show` 才置 `display: none`，期间遮罩仍覆盖页面。
- 打开时序为「渐显 → 主体区展开 → 插槽渲染」三段，关闭时不逆序回放（整体渐隐后于 `@after-leave` 重置折叠态）；`bodyDuration` 与 CSS 过渡时长同源，由 prop 注入。
- 遮罩不带背景色，隐藏时为 `display: none`，不阻挡页面交互。
- `backdrop-filter` 毛玻璃效果依赖底层存在可透出的内容，对话框叠在其他 UI 上时效果明显。
- **假死陷阱**：点击 img 等可选中元素会产生 selection 变更触发重绘，使 header/footer 的 `backdrop-filter` 对大面积背景（如 4K 图）重栅格重模糊，连续点击可致页面假死；组件已在 `.dialog-overlay` 声明 `user-select: none` 并对插槽 img 加 `-webkit-user-drag: none` 切断触发链，背景资源也应避免超大尺寸。
