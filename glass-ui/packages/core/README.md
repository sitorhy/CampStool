# @glass-ui/core

Vue 3 毛玻璃组件库。产物为按组件拆分的 ESM + 按组件拆分的 CSS，支持单组件引用。

## 构建

```bash
pnpm --filter @glass-ui/core build:lib   # 产出 dist/es（JS+CSS）与 dist/types（.d.ts）
pnpm --filter @glass-ui/core dev         # 本地 demo 站点（index.html + src/view）
pnpm --filter @glass-ui/core build       # demo 站点产物，输出 dist-playground
```

入口清单由 `src/components/*/index.ts` 自动发现：新增组件只需建目录并补 `index.ts`，
`vite.lib.config.ts` 与 `package.json` 的 `exports` 都无需改动。

## 单组件引用

```ts
import '@glass-ui/core/styles/style.css'   // 全局文本 token（--text-*），整站引入一次即可
import Button from '@glass-ui/core/Button'
import '@glass-ui/core/Button/style.css'
```

- JS 子路径与组件目录同名（`@glass-ui/core/NumberStepper`、`@glass-ui/core/PopupMenu`）。
- 每个 `style.css` 自包含其依赖组件的样式：引 `@glass-ui/core/Dialog/style.css`
  即已含内部使用的 MenuButton 样式，无需再引 PopupMenu 的。
- `Dialog`、`PopupMenu` 这类含多个同级组件的目录，一并从同一路径具名导出
  （`import { MenuButton, MenuContainer } from '@glass-ui/core/PopupMenu'`）。
- 组件源码里的 `*.vue` 深路径不在 `exports` 中，属内部实现，外部引用会解析失败。

## 整包引用

```ts
import '@glass-ui/core/styles/style.css'
import '@glass-ui/core/index/style.css'
import { Button, Form, type FormRules } from '@glass-ui/core'
```

## 消费方前置条件

组件用 UnoCSS 的 `preset-icons` 渲染图标，且图标类名以**字符串 props** 传入
（如 `<MenuButton icon="i-mono-setting" />`）。按 README 约定，图标类必须以字面量出现在
被扫描的源码里才会生成规则，因此消费方需自行配置 UnoCSS 的 `mdi` / `mono` / `color` 图标集合
（`mono`、`color` 指向本仓库 `src/icons/*`，或改用 `mdi` 集合）。

例外：`ConfirmDialog` 内部硬编码了 `i-mono-circle` / `i-mono-cross`，
消费方若用到该组件需保证 `mono` 集合可被扫到。
