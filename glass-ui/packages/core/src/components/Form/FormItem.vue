<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formContextKey, type FormItemContext, type FormItemRule, type FormItemState, type FormLabelPosition } from './types'
import { cloneValue, filterByTrigger, getFieldValue, normalizeRules, runRule, setFieldValue } from './validate'

interface FormItemProps {
  /** model 上的字段路径（'a.b.0' 或 ['a','b','0']）；validate / resetFields 必需 */
  prop?: string | string[]
  /** 标签文本 */
  label?: string
  /** 覆盖 Form 的标签位置 */
  labelPosition?: FormLabelPosition
  /** 覆盖 Form 的标签宽度 */
  labelWidth?: string | number
  /** 是否必填；缺省时由校验规则推断 */
  required?: boolean
  /** 本字段的校验规则，与 Form 级规则合并执行 */
  rules?: FormItemRule | FormItemRule[]
  /** 外部受控错误信息：设置后立即进入错误态并展示该文案 */
  error?: string
  /** 是否显示错误提示（与 Form 级取与） */
  showMessage?: boolean
  /** 错误提示与输入区同行（覆盖 Form 级设置） */
  inlineMessage?: boolean
  /** 同原生 label 的 for，指向控件 id */
  for?: string
  /** 受控校验状态 */
  validateStatus?: 'validating' | 'success' | 'error'
}

const props = withDefaults(defineProps<FormItemProps>(), {
  prop: undefined,
  label: '',
  labelPosition: undefined,
  labelWidth: undefined,
  required: undefined,
  rules: undefined,
  error: '',
  showMessage: true,
  inlineMessage: undefined,
  for: '',
  validateStatus: undefined,
})

const formCtx = inject(formContextKey, undefined)

/** 字段路径：数组形式按点拼接 */
const path = computed(() => (Array.isArray(props.prop) ? props.prop.join('.') : props.prop ?? ''))

const rootEl = ref<HTMLElement>()
const validateState = ref<FormItemState>('')
const validateMessage = ref('')

/** Form 级 + Item 级规则合并 */
const mergedRules = computed<FormItemRule[]>(() => {
  const fromForm = formCtx?.props.rules?.[path.value]
  return [...normalizeRules(fromForm), ...normalizeRules(props.rules)]
})

/** 必填态：显式 required 优先，否则由规则推断 */
const isRequired = computed(() => props.required ?? mergedRules.value.some((r) => r.required))

/** 派生自 Form 的配置在模板里逐一取别名，避免嵌套可选链可读性差 */
const labelPosition = computed<FormLabelPosition>(() => props.labelPosition ?? formCtx?.props.labelPosition ?? 'right')
const labelStyleWidth = computed(() => {
  const raw = props.labelWidth ?? formCtx?.props.labelWidth ?? ''
  if (raw === '' || raw == null) return undefined
  return typeof raw === 'number' || /^\d+$/.test(String(raw)) ? `${raw}px` : String(raw)
})
const labelStyle = computed(() =>
  labelPosition.value === 'top' || !labelStyleWidth.value ? undefined : { width: labelStyleWidth.value },
)
const labelSuffixText = computed(() => formCtx?.props.labelSuffix ?? '')
const showAsterisk = computed(() => isRequired.value && !formCtx?.props.hideRequiredAsterisk)
const asteriskOnLeft = computed(() => formCtx?.props.requireAsteriskPosition !== 'right')
const errorVisible = computed(() => validateState.value === 'error' && !!validateMessage.value && props.showMessage && (formCtx?.props.showMessage ?? true))
const inlineMsg = computed(() => props.inlineMessage ?? formCtx?.props.inlineMessage ?? false)
const itemDisabled = computed(() => formCtx?.props.disabled ?? false)
/** label 的 for：显式传入优先 */
const labelFor = computed(() => props.for || undefined)

/** 读取当前 model 中本字段的值 */
function fieldValue(): unknown {
  return getFieldValue(formCtx?.props.model, path.value)
}

/**
 * 校验本字段。
 * - 不传 trigger：执行全部规则（整表校验路径）
 * - 传 trigger：仅执行显式声明该时机的规则
 * 失败时 reject Error(message)。
 */
function validate(trigger?: string): Promise<void> {
  if (!path.value) return Promise.resolve()
  const rules = filterByTrigger(mergedRules.value, trigger)
  if (!rules.length) return Promise.resolve()

  validateState.value = 'validating'
  const label = props.label || path.value
  const value = fieldValue()

  return (async () => {
    for (const rule of rules) {
      const message = await runRule(value, rule, label)
      if (message) throw new Error(message)
    }
  })()
    .then(() => {
      validateState.value = 'success'
      validateMessage.value = ''
      formCtx?.onFieldValidated(path.value, true)
    })
    .catch((e: Error) => {
      validateState.value = 'error'
      validateMessage.value = e.message
      formCtx?.onFieldValidated(path.value, false, e.message)
      throw e
    })
}

/** 复位到挂载时捕获的初始值并清除校验态 */
function resetField() {
  if (!path.value) return
  setFieldValue(formCtx?.props.model, path.value, cloneValue(initialValue))
  clearValidate()
}

/** 仅清除校验态与提示 */
function clearValidate() {
  validateState.value = ''
  validateMessage.value = ''
}

const ctx: FormItemContext = {
  getPath: () => path.value,
  getRootEl: () => rootEl.value,
  getState: () => validateState.value,
  validate,
  resetField,
  clearValidate,
}

/** 挂载瞬间的字段快照，resetFields 的回退基准 */
let initialValue: unknown

onMounted(() => {
  initialValue = cloneValue(fieldValue())
  formCtx?.addField(ctx)
})

onBeforeUnmount(() => formCtx?.removeField(ctx))

/* 事件冒泡驱动触发校验：focusout→blur / change / input，无需侵入子控件实现 */
function onContentEvent(name: 'blur' | 'change' | 'input') {
  if (itemDisabled.value || !path.value) return
  void validate(name).catch(() => {})
}

/* 外部受控 error：设置即显示，清空即恢复（immediate 覆盖初始值场景） */
watch(
  () => props.error,
  (msg) => {
    if (msg) {
      validateState.value = 'error'
      validateMessage.value = msg
    } else if (validateState.value === 'error') {
      clearValidate()
    }
  },
  { immediate: true },
)

/* 外部受控 validate-status */
watch(
  () => props.validateStatus,
  (status) => {
    if (status) validateState.value = status
  },
  { immediate: true },
)

defineExpose({
  validate,
  resetField,
  clearValidate,
  validateState,
  validateMessage,
})
</script>

<template>
  <div
    ref="rootEl"
    class="glass-form-item"
    :class="[
      `glass-form-item--label-${labelPosition}`,
      { 'is-error': validateState === 'error', 'is-success': validateState === 'success', 'is-required': showAsterisk },
    ]"
  >
    <label
      v-if="label || $slots.label"
      class="glass-form-item__label"
      :style="labelStyle"
      :for="labelFor"
    >
      <slot name="label" :required="isRequired">
        <span v-if="showAsterisk && asteriskOnLeft" class="glass-form-item__asterisk">*</span>
        <span class="glass-form-item__label-text">{{ label }}{{ labelSuffixText }}</span>
        <span v-if="showAsterisk && !asteriskOnLeft" class="glass-form-item__asterisk">*</span>
      </slot>
    </label>

    <!-- fieldset[disabled] 原生禁用内部全部控件，实现 Form 级 disabled 一键置灰 -->
    <fieldset
      class="glass-form-item__content"
      :class="{ 'is-inline-message': inlineMsg }"
      :disabled="itemDisabled"
      @focusout="onContentEvent('blur')"
      @change="onContentEvent('change')"
      @input="onContentEvent('input')"
    >
      <slot></slot>
      <Transition name="glass-form-error">
        <div v-if="errorVisible" class="glass-form-item__error" :class="{ 'is-inline': inlineMsg }" role="alert">
          <slot name="error" :message="validateMessage">{{ validateMessage }}</slot>
        </div>
      </Transition>
    </fieldset>
  </div>
</template>

<style scoped>
.glass-form-item {
  display: flex;
  margin-bottom: 16px;
}

/* 标签居上：两栏变单栏纵向 */
.glass-form-item--label-top {
  flex-direction: column;
  align-items: stretch;
}

.glass-form-item__label {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  line-height: 40px;
  color: var(--text-body);
  box-sizing: border-box;
}

.glass-form-item--label-right .glass-form-item__label {
  justify-content: flex-end;
  padding-right: 12px;
}

.glass-form-item--label-left .glass-form-item__label {
  justify-content: flex-start;
  padding-left: 12px;
}

.glass-form-item--label-top .glass-form-item__label {
  justify-content: flex-start;
  line-height: 22px;
  margin-bottom: 6px;
}

.glass-form-item__asterisk {
  color: var(--text-danger);
}

.glass-form-item__content {
  flex: 1 1 auto;
  min-width: 0;
  /* fieldset 默认样式归零 + min-inline-size 防止内容撑破容器 */
  display: flex;
  flex-direction: column;
  border: none;
  margin: 0;
  padding: 0;
  min-inline-size: 0;
  /* 错误提示的绝对定位基准：消息挂在内容区底部，不撑开布局 */
  position: relative;
}

.glass-form-item__content.is-inline-message {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.glass-form-item__error {
  position: absolute;
  top: 100%;
  left: 0;
  height: 14px;
  line-height: 14px;
  font-size: 12px;
  white-space: nowrap;
  color: var(--text-danger);
  padding-top: 2px;
}

.glass-form-item__error.is-inline {
  position: static;
}

/* 校验消息淡入淡出 */
.glass-form-error-enter-active,
.glass-form-error-leave-active {
  transition: opacity 0.2s ease;
}

.glass-form-error-enter-from,
.glass-form-error-leave-to {
  opacity: 0;
}
</style>
