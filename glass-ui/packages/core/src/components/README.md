# 组件库文档索引

本目录包含导航客户端的可复用 Vue 组件，各组件的设计思路与使用文档见对应 Markdown 文件。

| 组件 | 职责 | 文档 |
| --- | --- | --- |
| `PopupMenu/MenuButton.vue` | 圆形菜单按钮（圆圈 + 可选外围圆环 + 图标） | [MenuButton.md](PopupMenu/MenuButton.md) |
| `Popover/Popover.vue` | 弹出层容器：12 种 placement 定位、显隐控制、外部点击关闭 | [Popover.md](Popover/Popover.md) |
| `Popover/PopoverArrow.vue` | 弹出层指针箭头：分割线 + 两端尖角 + 带孔指向三角形 | [PopoverArrow.md](Popover/PopoverArrow.md) |
| `PopupMenu/MenuContainer.vue` | 配置化菜单容器：流向/淡出/尺寸约束/滚动 | [MenuContainer.md](PopupMenu/MenuContainer.md) |
| `Button/Button.vue` | 菜单项按钮（可选圆形徽章图标 + 标签） | [Button.md](PopupMenu/MenuContainerButton.md) |
| `PopupMenu/ScrollContainer.vue` | 通用滚动容器：套住任意内容即获得美化滚动条 | [ScrollContainer.md](PopupMenu/ScrollContainer.md) |
| `Dialog/Dialog.vue` | 通用模态对话框：teleport 遮罩居中、显隐渐显渐隐、尺寸与遮罩关闭可控 | [Dialog.md](Dialog/Dialog.md) |
| `Select/Select.vue` | 下拉选择器：v-model、占位文本、整组禁用、键盘/外部点击收起，选项通过 slot 注入 | 见下方用法 |
| `Select/SelectOption.vue` | Select 的子选项：value/label/disabled，注册到父 Select 用于回显与联动 | 见下方用法 |
| `NumberStepper/NumberStepper.vue` | 数字步进器：v-model、min/max/step、精度自动推导、长按连击、键盘上下键、边界禁用 | 见下方用法 |
| `Checkbox/CheckboxGroup.vue` + `Checkbox/Checkbox.vue` | 多选组：provide/inject 下发选中集合与整组禁用 | 见下方用法 |
| `Radio/RadioGroup.vue` + `Radio/Radio.vue` | 单选组：provide/inject 下发选中值与整组禁用 | 见下方用法 |
| `Pagination/Pagination.vue` | 分页：v-model 页码、total/pageSize 推导页数、省略号折叠、快速跳转、整组禁用 | 见下方用法 |
| `NavMenu/NavMenu.vue` + `NavItem.vue` + `NavSubItem.vue` | 毛玻璃导航菜单：顶级项、悬停展开二级下拉、激活态、NEW/HOT 徽标，纯 CSS 动效 | 见下方用法 |

## 组件组合关系

```
Popover（定位 / 显隐 / 面板无装饰）
├── trigger 插槽 ──────── MenuButton（触发元素）
├── PopoverArrow（指针箭头，内部引用，接收 placement）
└── 默认插槽（作用域：{ placement }）
    └── MenuContainer（菜单内容，自行决定面板装饰）
        ├── ScrollContainer（滚动与滚动条样式）
        └── Button（菜单项按钮，可选图标徽章 + 标签）
```

典型用法见 `src/view/HomeView.vue`：MenuButton 触发 Popover，Popover 默认插槽内放置 MenuContainer。

## 组合式组件用法

### Select + SelectOption

选项以子组件形式声明（对齐 Element Plus 的 `el-select` + `el-option` 模式），父组件通过 `provide/inject` 与子组件通信，子组件挂载时向父级注册 `{ value, label, disabled }`，用于回显 label 与联动选中态。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Select from '@/components/Select.vue'
import SelectOption from '@/components/SelectOption.vue'

const theme = ref('glass')
const themeOptions = [
  { label: 'Default 经典白', value: 'default' },
  { label: 'Sunset Cafe 主题', value: 'glass' },
  { label: 'Locked 不可选', value: 'locked', disabled: true },
]
</script>

<template>
  <Select v-model="theme" placeholder="请选择主题">
    <SelectOption
      v-for="item in themeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </Select>
</template>
```

**Select Props / Events**：`modelValue`、`placeholder`、`disabled`；`update:modelValue`、`change`、`focus`、`blur`、`update:visible`。暴露 `open()` / `close()` 方法。

**SelectOption Props / Slots**：`value`（必填）、`label`、`disabled`；默认插槽可自定义选项内容（如带图标），未提供插槽时回退到 `label` 文本。

### RadioGroup + Radio / CheckboxGroup + Checkbox

同样采用 `provide/inject` 模式，父组下发 `selected` / `disabled`，子项注册自身值。

### NumberStepper

数字步进器，支持长按连击、键盘上下键、精度自动推导。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NumberStepper from '@/components/NumberStepper.vue'

const qty = ref(1)
const price = ref(0.3)
</script>

<template>
  <!-- 基础：整数 0-10，步长 1 -->
  <NumberStepper v-model="qty" :min="0" :max="10" />

  <!-- 小数：步长 0.1 自动推导 1 位小数精度 -->
  <NumberStepper v-model="price" :min="0" :max="1" :step="0.1" />

  <!-- 空态：v-model 传 undefined 时显示 placeholder，首次点击 + 落到 min -->
  <NumberStepper v-model="qty" :min="1" :max="99" placeholder="未填" />

  <!-- 禁用 / 只读 -->
  <NumberStepper v-model="qty" disabled />
  <NumberStepper v-model="qty" readonly />
</template>
```

**Props**：`modelValue`、`min`、`max`、`step`、`precision`、`disabled`、`readonly`、`placeholder`、`controls`（是否显示加减按钮）、`repeatInterval`（连击间隔 ms）、`holdDelay`（长按阈值 ms）、`name`。

**Events**：`update:modelValue`、`change(value, oldValue)`、`focus`、`blur`。

**暴露方法**：`focus()` / `blur()` / `increment()` / `decrement()`。

**关键设计**：
- **精度自动推导**：未显式传 `precision` 时按 `step` 的小数位数决定，避免 `0.1 + 0.2 = 0.30000000000000004` 类浮点误差。
- **`lastEmitted` 本地缓存**：长按连击时 `props.modelValue` 因 Vue 异步刷新滞后一帧，直接读会误判边界；用本地变量在 `stepBy` 内即时更新，watch 里再从 props 兜底同步。
- **空态首次点击语义**：`v-model` 为 `undefined` 时，点 `+` 跳到 `min`（非 `min + step`），点 `-` 跳到 `max`，符合"从空态进入有效值"的直觉。
- **边界禁用按钮**：`minusDisabled` / `plusDisabled` 独立于整组 `disabled`，仅在当前值到达边界时禁用对应按钮。
- **输入过滤**：`type="text"` + `inputmode="decimal"`，`onInput` 只保留数字/小数点/负号；失焦时解析并夹取，非法输入回退到上一次有效值。

### Pagination

分页条：`v-model` 绑定当前页码，页数可由 `total`/`pageSize` 推导或直接指定。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Pagination from '@/components/Pagination/Pagination.vue'

const page = ref(1)
</script>

<template>
  <!-- 由条目数推导页数，并显示快速跳转 -->
  <Pagination v-model="page" :total="96" :page-size="10" jumper />

  <!-- 直接指定页数；中间页码组只保留 5 个按钮 -->
  <Pagination v-model="page" :page-count="20" :pager-count="5" />

  <!-- 禁用 -->
  <Pagination v-model="page" :total="50" disabled />
</template>
```

**Props**：`modelValue`（当前页，v-model）、`total`、`pageSize`、`pageCount`（优先于 total/pageSize 推导）、`pagerCount`（5–13 的奇数，默认 7）、`disabled`、`jumper`。

**Events**：`update:modelValue`、`change(newPage, oldPage)`。

**关键设计**：
- **`pagerCount` 只数数字按钮**：省略号额外占位，不挤占页码位；传入偶数时向上取奇数，避免中间窗口左右不对称。
- **靠边折叠**：当前页距首/尾不超过 `radius + 2` 页时，折叠为一侧省略号（`1 2 3 4 5 6 … 10`），中间窗口则两侧都出省略号。
- **页数收缩回正**：`total`/`pageCount` 变化导致总页数变小时，`watch` 会回发 `update:modelValue`，避免调用方的页码悬空在越界值。
- **跳转输入框**：`type="text"` + `inputmode="numeric"`，输入期只保留数字；回车或失焦提交，越界/非法值回弹到当前页显示。

### NavMenu + NavItem + NavSubItem

毛玻璃导航菜单（设计稿：`doc/导航菜单.html`）。`NavItem` 提供 `#submenu` 插槽时自动渲染下拉箭头与二级菜单，悬停展开为纯 CSS 动效；`NavSubItem` 支持 `tag` / `tag-type` 徽标。

```vue
<script setup lang="ts">
import { NavMenu, NavItem, NavSubItem } from '@glass-ui/core'
</script>

<template>
  <NavMenu>
    <NavItem active>🏠 首页</NavItem>
    <NavItem>
      🧩 组件库
      <template #submenu>
        <NavSubItem>按钮组 (Buttons)</NavSubItem>
        <NavSubItem tag="NEW">分页 (Pagination)</NavSubItem>
      </template>
    </NavItem>
    <NavItem>
      🎨 主题风格
      <template #submenu>
        <NavSubItem tag="HOT" tag-type="warning">Cyberpunk 赛博</NavSubItem>
      </template>
    </NavItem>
  </NavMenu>
</template>
```

**NavItem Props / Events / Slots**：`active`、`href`（不传且无 `to` 时点击自动 `preventDefault`）、`to`（vue-router RouterLink）；`click(event)`；默认插槽为菜单文本，`#submenu` 放二级菜单。

**NavSubItem Props / Events / Slots**：`href` / `to`（同 NavItem）、`tag`（徽标文本）、`tag-type`（`danger` 红 / `warning` 橙，默认 `danger`）、`tag-style`；`click(event)`；默认插槽为条目文本，`#tag` 可自定义徽标内容。



1. **Props → CSS 变量模式**：运行时的颜色/尺寸 props 通过内联 style 注入 CSS 自定义属性，scoped 样式消费变量实现（含 hover 态）；UnoCSS 无法为运行时 props 生成原子类。每个组件在根规则中声明变量默认值，既作 CSS 兜底，也消除 IDE「无法解析自定义属性」告警。
2. **placement 格式**：`[方向]-[对齐位置]`。方向：`top` / `bottom` / `left` / `right`；对齐：`start` / `end`，省略时居中（null）。例：`left-end` = 弹层在触发元素左侧且底边对齐。Popover、PopoverArrow、MenuContainer 共用该格式。
3. **图标规范**：UnoCSS `preset-icons`，类名 `i-{collection}-{name}`（如 `i-mono-setting`、`i-mdi-account`）。`mono` 集合强制 `currentColor`，颜色由所在元素 CSS `color` 控制；图标类名须以字面量形式出现在源码中才能被构建期收集。
4. **面板装饰归属**：Popover 面板不带背景/边框/阴影，外观由内容组件（如 MenuContainer）自行决定。
5. **淡出效果**：PopoverArrow 与 MenuContainer 容器两端均有 `mask: linear-gradient(...)` 淡出，方向由 placement 的方向决定（left/right → 纵向淡出，top/bottom → 横向淡出），两者保持一致。
6. **尺寸测量**：Popover 通过 ResizeObserver 实测面板交叉轴尺寸写入 `--popover-panel-cross`，供 PopoverArrow 分割线 `auto` 拉伸消费。
