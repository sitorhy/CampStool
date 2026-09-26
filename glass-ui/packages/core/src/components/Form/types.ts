import type { InjectionKey } from 'vue'

/** 标签位置：左 / 右（配合 label-width 两栏排布）/ 上（独占一行） */
export type FormLabelPosition = 'left' | 'right' | 'top'

/**
 * 单条校验规则（自研轻量引擎，语义对齐 async-validator 的常用子集）。
 * 命中第一条失败的规则即中止并展示其 message。
 */
export interface FormItemRule {
  /** 是否必填 */
  required?: boolean
  /** 失败提示文案；缺省时按规则类型生成默认文案 */
  message?: string
  /** 触发时机：'input' / 'blur' / 'change'；缺省仅在整表校验时执行 */
  trigger?: string | string[]
  /** 最小值（number 比较数值本身）或最小长度（string / array 比较长度） */
  min?: number
  /** 最大值 / 最大长度 */
  max?: number
  /** 精确长度 */
  len?: number
  /** 正则匹配（string 会被编译为 RegExp） */
  pattern?: string | RegExp
  /** 基础类型检查 */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'email'
  /** 枚举白名单 */
  enum?: unknown[]
  /**
   * 自定义校验器：
   *  - 返回 true / undefined 视为通过
   *  - 返回 false 视为失败（用 message 或默认文案）
   *  - 返回字符串视为失败且以该字符串为提示文案
   *  - 支持 async / Promise 版本
   */
  validator?: (
    value: unknown,
    rule: FormItemRule,
  ) => boolean | string | void | Promise<boolean | string | void>
}

/** 整表校验配置：key 为 model 上的字段路径（支持 'a.b.0' 点路径） */
export type FormRules = Record<string, FormItemRule | FormItemRule[]>

/** FormItem 暴露给 Form 的上下文字段（注册进 Form 的字段表） */
export interface FormItemContext {
  /** 字段路径；无 prop 的纯布局项为空串 */
  getPath: () => string
  /** 根元素，用于 scroll-to-error 定位 */
  getRootEl: () => HTMLElement | undefined
  /** 当前校验状态 */
  getState: () => FormItemState
  /** 校验本字段；trigger 传入时仅执行匹配该触发时机的规则。失败时 reject */
  validate: (trigger?: string) => Promise<void>
  /** 复位到挂载时捕获的初始值并清除校验态 */
  resetField: () => void
  /** 仅清除校验态，不动值 */
  clearValidate: () => void
}

export type FormItemState = '' | 'validating' | 'success' | 'error'

/** Form 通过 provide 注入的配置视图，FormItem 只读取不修改 */
export interface FormContextProps {
  model?: Record<string, unknown>
  rules?: FormRules
  inline: boolean
  labelPosition: FormLabelPosition
  labelWidth: string | number
  labelSuffix: string
  hideRequiredAsterisk: boolean
  requireAsteriskPosition: 'left' | 'right'
  showMessage: boolean
  inlineMessage: boolean
  disabled: boolean
}

export interface FormContext {
  props: FormContextProps
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  /** 字段校验完成回调，Form 据此对外发 validate 事件 */
  onFieldValidated: (prop: string, isValid: boolean, message?: string) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('GlassForm')
