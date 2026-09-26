<script setup lang="ts">
import { provide, shallowRef, watch } from 'vue'
import { formContextKey, type FormItemContext, type FormLabelPosition, type FormRules } from './types'

interface FormProps {
  /** 表单数据对象 */
  model?: Record<string, unknown>
  /** 整表校验规则，key 为字段路径（如 name、user.age、list.0.title） */
  rules?: FormRules
  /** 是否行内（水平排列）表单 */
  inline?: boolean
  /** 标签位置；left / right 需配合 label-width 使用 */
  labelPosition?: FormLabelPosition
  /** 标签宽度，如 '80px' / 'auto'；数字按 px 处理 */
  labelWidth?: string | number
  /** 标签后缀 */
  labelSuffix?: string
  /** 隐藏必填项的红色星号 */
  hideRequiredAsterisk?: boolean
  /** 必填星号位置 */
  requireAsteriskPosition?: 'left' | 'right'
  /** 是否显示校验错误提示 */
  showMessage?: boolean
  /** 错误提示与输入区同行显示 */
  inlineMessage?: boolean
  /** rules 变更时是否自动重校验已出错字段 */
  validateOnRuleChange?: boolean
  /** 禁用整张表单内所有控件 */
  disabled?: boolean
  /** 整表校验失败时滚动到第一个错误字段 */
  scrollToError?: boolean
}

const props = withDefaults(defineProps<FormProps>(), {
  model: undefined,
  rules: undefined,
  inline: false,
  labelPosition: 'right',
  labelWidth: '',
  labelSuffix: '',
  hideRequiredAsterisk: false,
  requireAsteriskPosition: 'left',
  showMessage: true,
  inlineMessage: false,
  validateOnRuleChange: true,
  disabled: false,
  scrollToError: false,
})

const emit = defineEmits<{
  /** 任一字段校验完成时触发 */
  validate: [prop: string, isValid: boolean, message?: string]
}>()

const fields = shallowRef<FormItemContext[]>([])

function addField(field: FormItemContext) {
  fields.value = [...fields.value, field]
}

function removeField(field: FormItemContext) {
  fields.value = fields.value.filter((f) => f !== field)
}

provide(formContextKey, {
  props,
  addField,
  removeField,
  onFieldValidated: (prop, isValid, message) => emit('validate', prop, isValid, message),
})

/** 匹配目标字段：不传 props 时为全部字段 */
function pickFields(names?: string | string[]): FormItemContext[] {
  const all = fields.value
  if (!names) return all
  const wanted = Array.isArray(names) ? names : [names]
  return all.filter((f) => wanted.includes(f.getPath()))
}

interface FieldOutcome {
  field: FormItemContext
  error: string
}

/** 并行校验一组字段，返回失败项（不抛出） */
async function runValidate(targets: FormItemContext[]): Promise<FieldOutcome[]> {
  const results = await Promise.all(
    targets.map(async (field): Promise<FieldOutcome | null> => {
      try {
        await field.validate()
        return null
      } catch (e) {
        return { field, error: e instanceof Error ? e.message : String(e) }
      }
    }),
  )
  return results.filter((r): r is FieldOutcome => r !== null)
}

/** 校验结果统一出口：回调 + scroll-to-error */
function settle(
  invalid: FieldOutcome[],
  callback?: (isValid: boolean, invalidFields: Record<string, string>) => void,
): boolean {
  const isValid = invalid.length === 0
  const invalidFields: Record<string, string> = {}
  invalid.forEach(({ field, error }) => {
    invalidFields[field.getPath()] = error
  })
  callback?.(isValid, invalidFields)
  if (!isValid && props.scrollToError) {
    invalid[0].field.getRootEl()?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return isValid
}

/**
 * 校验整表。结果经 Promise resolve(true/false) 与可选回调双通道返回，不 reject。
 */
function validate(
  callback?: (isValid: boolean, invalidFields: Record<string, string>) => void,
): Promise<boolean> {
  return runValidate(fields.value).then((invalid) => settle(invalid, callback))
}

/** 校验指定字段 */
function validateField(
  names: string | string[],
  callback?: (isValid: boolean, invalidFields: Record<string, string>) => void,
): Promise<boolean> {
  return runValidate(pickFields(names)).then((invalid) => settle(invalid, callback))
}

/** 将指定字段复位为挂载时捕获的初始值，并清除校验态 */
function resetFields(names?: string | string[]) {
  pickFields(names).forEach((f) => f.resetField())
}

/** 仅清除校验态与提示，不重置值 */
function clearValidate(names?: string | string[]) {
  pickFields(names).forEach((f) => f.clearValidate())
}

/** 滚动到指定字段 */
function scrollToField(name: string) {
  fields.value
    .find((f) => f.getPath() === name)
    ?.getRootEl()
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/* rules 热更新：默认对已出错的字段重跑校验 */
watch(
  () => [props.rules],
  () => {
    if (!props.validateOnRuleChange) return
    fields.value.filter((f) => f.getState() === 'error').forEach((f) => void f.validate().catch(() => {}))
  },
)

defineExpose({ validate, validateField, resetFields, clearValidate, scrollToField })
</script>

<template>
  <form class="glass-form" :class="{ 'glass-form--inline': inline }" @submit.prevent>
    <slot></slot>
  </form>
</template>

<style scoped>
.glass-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.glass-form--inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}
</style>
