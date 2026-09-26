/**
 * @glass-ui/core 组件统一导出入口。
 *
 * notebook 在开发期通过 Vite alias 直接引用该源码入口，
 * 使得修改任一组件都能被模块图追踪并触发跨包 HMR。
 */

/** 文本样式全局 token：随组件入口一并引入，保证 var(--text-*) 可用 */
import './styles/text.scss'

export { default as Button } from './components/Button/Button.vue'

export { default as Breadcrumb } from './components/Breadcrumb/Breadcrumb.vue'
export { default as BreadcrumbItem } from './components/Breadcrumb/BreadcrumbItem.vue'

export { default as Card } from './components/Card/Card.vue'

export { default as Checkbox } from './components/Checkbox/Checkbox.vue'
export { default as CheckboxGroup } from './components/Checkbox/CheckboxGroup.vue'

export { default as Dialog } from './components/Dialog/Dialog.vue'
export { default as ConfirmDialog } from './components/Dialog/ConfirmDialog.vue'

export { default as Divider } from './components/Divider/Divider.vue'

import Form from './components/Form/Form.vue'

export { Form }
export { default as FormItem } from './components/Form/FormItem.vue'
export type { FormItemRule, FormRules, FormLabelPosition } from './components/Form/types'

/** Form 组件实例类型：notebook / 业务侧 ref 标注用，暴露 validate 等方法 */
export type FormInstance = InstanceType<typeof Form>

export { default as MessageBox } from './components/MessageBox/MessageBox.vue'

export { default as Input } from './components/Input/Input.vue'

export { default as Image } from './components/Image/Image.vue'

export { default as Loading } from './components/Loading/Loading.vue'

export { default as NumberStepper } from './components/NumberStepper/NumberStepper.vue'

export { default as NavMenu } from './components/NavMenu/NavMenu.vue'
export { default as NavItem } from './components/NavMenu/NavItem.vue'
export { default as NavSubItem } from './components/NavMenu/NavSubItem.vue'

export { default as Pagination } from './components/Pagination/Pagination.vue'

export { default as Popover } from './components/Popover/Popover.vue'
export { default as PopoverArrow } from './components/Popover/PopoverArrow.vue'

export { default as MenuButton } from './components/PopupMenu/MenuButton.vue'
export { default as GlassMenuButton } from './components/PopupMenu/GlassMenuButton.vue'
export { default as MenuContainer } from './components/PopupMenu/MenuContainer.vue'
export { default as MenuContainerButton } from './components/PopupMenu/MenuContainerButton.vue'
export { default as PopupMenu } from './components/PopupMenu/PopupMenu.vue'
export { default as ScrollContainer } from './components/PopupMenu/ScrollContainer.vue'

export { default as Radio } from './components/Radio/Radio.vue'
export { default as RadioGroup } from './components/Radio/RadioGroup.vue'

export { default as Select } from './components/Select/Select.vue'
export { default as SelectOption } from './components/Select/SelectOption.vue'

import Tabs from './components/Tabs/Tabs.vue'

export { Tabs }
export { default as TabPane } from './components/Tabs/TabPane.vue'

/** Tabs 组件实例类型：暴露滑块重定位等方法 */
export type TabsInstance = InstanceType<typeof Tabs>

export { default as Tag } from './components/Tag/Tag.vue'
