import type Form from './Form.vue'

export { default, default as Form } from './Form.vue'
export { default as FormItem } from './FormItem.vue'
export type { FormItemRule, FormRules, FormLabelPosition } from './types'

/** Form 组件实例类型：调用方 ref 标注用，暴露 validate 等方法 */
export type FormInstance = InstanceType<typeof Form>
