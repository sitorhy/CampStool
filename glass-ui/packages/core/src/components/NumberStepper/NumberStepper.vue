<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  /** 原生属性透传给内部 <input>，避免根容器与 input 重复挂载同名属性 */
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  /** 当前数值，支持 v-model；undefined 表示空态 */
  modelValue?: number
  /** 允许的最小值 */
  min?: number
  /** 允许的最大值 */
  max?: number
  /** 步长（同时决定默认精度：小数位数） */
  step?: number
  /** 强制小数位数；未指定时按 step 推导 */
  precision?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读：可聚焦、可选中复制，但不可修改 */
  readonly?: boolean
  /** 空态占位符 */
  placeholder?: string
  /** 是否显示加减按钮，false 时退化为纯数字输入框 */
  controls?: boolean
  /** 长按按钮时的连击间隔（毫秒），设为 0 关闭连击 */
  repeatInterval?: number
  /** 触发连击前的长按阈值（毫秒） */
  holdDelay?: number
  /** 输入名 */
  name?: string
}>(), {
  modelValue: undefined,
  min: -Infinity,
  max: Infinity,
  step: 1,
  precision: undefined,
  disabled: false,
  readonly: false,
  placeholder: '',
  controls: true,
  repeatInterval: 80,
  holdDelay: 400,
  name: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
  change: [value: number | undefined, oldValue: number | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

/** 由 step 推导出的默认精度：step=0.1 → 1 位小数 */
const derivedPrecision = computed(() => {
  const s = String(props.step)
  const dot = s.indexOf('.')
  return dot === -1 ? 0 : s.length - dot - 1
})

/** 生效精度：显式 precision 优先，否则按 step 推导 */
const effectivePrecision = computed(() => props.precision ?? derivedPrecision.value)

/** 数值 → 展示字符串（按精度补零，NaN/undefined 走空串） */
function formatValue(v: number | undefined): string {
  if (v === undefined || Number.isNaN(v)) return ''
  const p = effectivePrecision.value
  return p > 0 ? v.toFixed(p) : String(v)
}

/** 夹取到 [min, max] 并按精度四舍五入 */
function clampAndRound(v: number): number {
  const clamped = Math.min(Math.max(v, props.min), props.max)
  const factor = Math.pow(10, effectivePrecision.value)
  return Math.round(clamped * factor) / factor
}

/** 输入框内的原始字符串，允许中间态（如 "1." 或 ""） */
const textValue = ref(formatValue(props.modelValue))

/**
 * 本地同步的"当前值"：emit 之后 props 要到父组件下一帧才更新，
 * 长按连击若读 props 会滞后一帧，导致边界判断错误。
 * 用这个变量在 stepBy / commitInput 内即时更新，watch 里再从 props 兜底同步。
 */
let lastEmitted: number | undefined = props.modelValue

/** 边界禁用态：即使当前值为空也允许点击按钮，此时按钮以 min 为起点 */
const minusDisabled = computed(() => {
  if (props.disabled || props.readonly) return true
  const v = props.modelValue
  if (v === undefined) return props.min === -Infinity && props.max === -Infinity
  return v - props.step < props.min || v <= props.min
})

const plusDisabled = computed(() => {
  if (props.disabled || props.readonly) return true
  const v = props.modelValue
  if (v === undefined) return props.min === -Infinity && props.max === -Infinity
  return v + props.step > props.max || v >= props.max
})

/** 从当前值出发步进；空态时 + 落到 min（无 min 则 0），- 落到 max（无 max 则 0） */
function stepBy(delta: number) {
  if (props.disabled || props.readonly) return
  const base = lastEmitted
  let next: number
  if (base === undefined) {
    const seed = delta > 0
      ? (Number.isFinite(props.min) ? props.min : 0)
      : (Number.isFinite(props.max) ? props.max : 0)
    next = clampAndRound(seed)
  } else {
    next = clampAndRound(base + delta)
  }
  if (next !== base) {
    lastEmitted = next
    emit('update:modelValue', next)
    emit('change', next, base)
  }
  textValue.value = formatValue(next)
}

/** 提交输入框内容：解析 → 夹取 → 回写；非法或空则回退到当前值 */
function commitInput() {
  const raw = textValue.value.trim()
  const old = lastEmitted

  if (raw === '' || raw === '-' || raw === '.') {
    textValue.value = formatValue(old)
    if (old !== undefined) {
      lastEmitted = undefined
      emit('update:modelValue', undefined)
      emit('change', undefined, old)
    }
    return
  }

  const parsed = Number(raw)
  if (Number.isNaN(parsed)) {
    textValue.value = formatValue(old)
    return
  }

  const next = clampAndRound(parsed)
  textValue.value = formatValue(next)
  if (next !== old) {
    lastEmitted = next
    emit('update:modelValue', next)
    emit('change', next, old)
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value
  // 过滤非法字符：只留数字、正负号、小数点
  const cleaned = raw.replace(/[^\d.\-]/g, '')
  if (cleaned !== raw) {
    target.value = cleaned
  }
  textValue.value = cleaned
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      stepBy(props.step)
      break
    case 'ArrowDown':
      event.preventDefault()
      stepBy(-props.step)
      break
    case 'Enter':
      event.preventDefault()
      commitInput()
      break
  }
}

function onFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  isFocused.value = false
  commitInput()
  emit('blur', event)
}

// ==================== 长按连击 ====================
let holdTimer: ReturnType<typeof setTimeout> | null = null
let repeatTimer: ReturnType<typeof setInterval> | null = null

function startHold(direction: 1 | -1) {
  if (props.disabled || props.readonly) return
  stepBy(direction * props.step)
  if (props.repeatInterval <= 0) return
  holdTimer = setTimeout(() => {
    repeatTimer = setInterval(() => {
      const before = lastEmitted
      stepBy(direction * props.step)
      // 到达边界后 stepBy 内部不会更新 lastEmitted，此时停止连击避免定时器空转
      if (lastEmitted === before) stopHold()
    }, props.repeatInterval)
  }, props.holdDelay)
}

function stopHold() {
  if (holdTimer !== null) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (repeatTimer !== null) {
    clearInterval(repeatTimer)
    repeatTimer = null
  }
}

onBeforeUnmount(stopHold)

// 外部 modelValue 变化时同步显示与本地缓存（用户正在输入时不打断文本）
watch(
  () => props.modelValue,
  (v) => {
    lastEmitted = v
    if (!isFocused.value) textValue.value = formatValue(v)
  },
)

// 精度变化时重排显示
watch(effectivePrecision, () => {
  if (!isFocused.value) textValue.value = formatValue(props.modelValue)
})

defineExpose({
  /** 命令式聚焦输入框 */
  focus: () => inputRef.value?.focus(),
  /** 命令式失焦 */
  blur: () => inputRef.value?.blur(),
  /** 命令式 +1 步 */
  increment: () => stepBy(props.step),
  /** 命令式 -1 步 */
  decrement: () => stepBy(-props.step),
})
</script>

<template>
  <div
    class="glass-number-stepper"
    :class="{
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-focused': isFocused,
      'has-controls': controls,
    }"
    role="group"
  >
    <button
      v-if="controls"
      type="button"
      class="step-btn step-btn-minus"
      :disabled="minusDisabled"
      :aria-label="'减少'"
      :aria-controls="name || undefined"
      tabindex="-1"
      @pointerdown.prevent="startHold(-1)"
      @pointerup="stopHold"
      @pointerleave="stopHold"
      @pointercancel="stopHold"
      @contextmenu.prevent
    >−</button>

    <input
      ref="inputRef"
      class="glass-number-input"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      spellcheck="false"
      role="spinbutton"
      :id="name || undefined"
      :value="textValue"
      :min="Number.isFinite(min) ? min : undefined"
      :max="Number.isFinite(max) ? max : undefined"
      :step="step"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :aria-valuenow="modelValue ?? undefined"
      :aria-valuemin="Number.isFinite(min) ? min : undefined"
      :aria-valuemax="Number.isFinite(max) ? max : undefined"
      :aria-disabled="disabled || undefined"
      :aria-readonly="readonly || undefined"
      v-bind="$attrs"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    />

    <button
      v-if="controls"
      type="button"
      class="step-btn step-btn-plus"
      :disabled="plusDisabled"
      :aria-label="'增加'"
      tabindex="-1"
      @pointerdown.prevent="startHold(1)"
      @pointerup="stopHold"
      @pointerleave="stopHold"
      @pointercancel="stopHold"
      @contextmenu.prevent
    >+</button>
  </div>
</template>

<style scoped>
/* 1. 隐藏浏览器原生 number 控件的辅助 UI（若上游使用 type=number 也不冲突） */
.glass-number-input::-webkit-inner-spin-button,
.glass-number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 2. 整体组合框（毛玻璃容器） */
.glass-number-stepper {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
  user-select: none;
  transition: all 0.25s ease;
}

.glass-number-stepper:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(255, 255, 255, 0.25);
}

.glass-number-stepper.is-focused {
  border-color: #60a5fa;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.7), inset 0 0 4px rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.35);
}

/* 3. 输入框纯文本区 */
.glass-number-input {
  width: 52px;
  height: 32px;
  padding: 0 4px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: var(--text-body);
  outline: none;
  user-select: text;
  font-variant-numeric: tabular-nums;
}

.glass-number-input::placeholder {
  color: var(--text-muted);
  font-weight: normal;
}

/* 4. 加/减毛玻璃小按钮 */
.step-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
  color: var(--text-heading);
  font-size: 18px;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
  touch-action: none;
}

/* 悬停亮蓝发光 */
.step-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.8);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
  transform: scale(1.05);
}

/* 按下反馈 */
.step-btn:active:not(:disabled) {
  transform: scale(0.95);
  background: rgba(59, 130, 246, 0.95);
}

/* 到达边界 / 整组禁用时按钮变灰 */
.step-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* 5. 整组禁用 */
.glass-number-stepper.is-disabled {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 0.55;
  cursor: not-allowed;
}
.glass-number-stepper.is-disabled .glass-number-input {
  cursor: not-allowed;
  color: var(--text-disabled);
}

/* 6. 只读：保留按钮视觉禁用，输入框仍可选中复制 */
.glass-number-stepper.is-readonly .glass-number-input {
  cursor: default;
}
</style>
