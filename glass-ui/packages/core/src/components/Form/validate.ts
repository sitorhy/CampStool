import type { FormItemRule } from './types'

/** 沿点路径（'a.b.0'）读取 model 上的字段值 */
export function getFieldValue(model: unknown, path: string): unknown {
  if (!model || !path) return undefined
  return path.split('.').reduce<unknown>(
    (obj, key) => (obj == null ? undefined : (obj as Record<string, unknown>)[key]),
    model,
  )
}

/** 沿点路径写回 model 上的字段值；中间节点缺失时静默放弃 */
export function setFieldValue(model: unknown, path: string, value: unknown): void {
  if (!model || !path) return
  const keys = path.split('.')
  const last = keys.pop() as string
  let target = model as Record<string, unknown>
  for (const key of keys) {
    target = target?.[key] as Record<string, unknown>
    if (target == null) return
  }
  target[last] = value
}

/** 空值判定：undefined / null / 空串 / 空数组 */
export function isEmptyValue(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

/** 规则归一化：单对象与数组两种书写均可 */
export function normalizeRules(rules?: FormItemRule | FormItemRule[]): FormItemRule[] {
  if (!rules) return []
  return Array.isArray(rules) ? rules : [rules]
}

/** 按触发时机过滤规则：仅执行显式声明了该 trigger 的规则 */
export function filterByTrigger(rules: FormItemRule[], trigger?: string): FormItemRule[] {
  if (!trigger) return rules
  return rules.filter((rule) => {
    const ruleTrigger = Array.isArray(rule.trigger) ? rule.trigger : rule.trigger ? [rule.trigger] : []
    return ruleTrigger.includes(trigger)
  })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ruleLabel(label?: string): string {
  return label || '该字段'
}

/** 浅复制初始值：数组复制一份，标量原样保留，避免 reset 后仍被外部引用联动 */
export function cloneValue(value: unknown): unknown {
  return Array.isArray(value) ? [...value] : value
}

/**
 * 执行单条规则。
 * 返回 null 表示通过，字符串表示失败原因（提示文案）。
 */
export async function runRule(
  value: unknown,
  rule: FormItemRule,
  label?: string,
): Promise<string | null> {
  if (rule.required) {
    if (isEmptyValue(value)) return rule.message || `${ruleLabel(label)}不能为空`
    // required 规则本身通过后不再叠加其他检查（除非该规则同时声明了其它约束）
  }

  // 非必填字段为空时跳过其余规则
  if (!rule.required && isEmptyValue(value)) return null

  if (rule.type) {
    const ok =
      rule.type === 'email'
        ? typeof value === 'string' && EMAIL_RE.test(value)
        : rule.type === 'array'
          ? Array.isArray(value)
          : typeof value === rule.type
    if (!ok) return rule.message || `${ruleLabel(label)}类型应为 ${rule.type}`
  }

  if (rule.enum && !rule.enum.includes(value)) {
    return rule.message || `${ruleLabel(label)}取值不在允许范围内`
  }

  if (rule.pattern) {
    const re = rule.pattern instanceof RegExp ? rule.pattern : new RegExp(rule.pattern)
    if (!re.test(String(value))) return rule.message || `${ruleLabel(label)}格式不正确`
  }

  const length = typeof value === 'number' ? value : (value as { length?: number })?.length
  if (typeof length === 'number') {
    if (rule.min !== undefined && length < rule.min) {
      return rule.message || `${ruleLabel(label)}长度或数值不得小于 ${rule.min}`
    }
    if (rule.max !== undefined && length > rule.max) {
      return rule.message || `${ruleLabel(label)}长度或数值不得大于 ${rule.max}`
    }
  }
  if (rule.len !== undefined && typeof length === 'number' && length !== rule.len) {
    return rule.message || `${ruleLabel(label)}长度应为 ${rule.len}`
  }

  if (rule.validator) {
    const result = await rule.validator(value, rule)
    if (result === false) return rule.message || `${ruleLabel(label)}校验不通过`
    if (typeof result === 'string') return result
  }

  return null
}
