<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

/** 子选项向父 Select 注册的元信息 */
export interface SelectOptionMeta {
  value: string | number
  label: string
  disabled?: boolean
}

/** Select 向子 SelectOption 注入的上下文 */
export interface SelectContext {
  /** 当前选中的值 */
  selected: Readonly<Ref<string | number>>
  /** 组级禁用状态 */
  disabled: Readonly<Ref<boolean>>
  /** 下拉面板是否可见（子选项可用于键盘高亮等） */
  visible: Readonly<Ref<boolean>>
  /** 子选项点击时调用：更新 modelValue 并收起下拉 */
  select: (value: string | number) => void
  /** 子选项挂载时注册自身，用于父级回显标签 */
  registerOption: (option: SelectOptionMeta) => void
  /** 子选项卸载或 value 变化时注销 */
  unregisterOption: (value: string | number) => void
}

export const SELECT_KEY: InjectionKey<SelectContext> = Symbol('select')
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, toRef } from 'vue'

const props = withDefaults(defineProps<{
  /** 选中的值，支持 v-model */
  modelValue?: string | number
  /** 占位文本，未选中时显示 */
  placeholder?: string
  /** 是否禁用整个选择器 */
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '请选择',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  blur: []
  focus: []
  'update:visible': [visible: boolean]
}>()

const visible = ref(false)
const focused = ref(false)
const containerRef = ref<HTMLElement | null>(null)

/** 已注册选项：value → meta，用于回显 label 与判断空态 */
const optionMap = ref(new Map<string | number, SelectOptionMeta>())

/** 触发器显示文本：优先展示选中项的 label，否则展示 placeholder */
const displayLabel = computed(() => {
  const meta = optionMap.value.get(props.modelValue)
  if (meta) return meta.label
  // 兜底：如果 modelValue 是字符串且没有对应选项，展示原值
  return props.placeholder
})

/** 是否有任何已注册选项 */
const hasOptions = computed(() => optionMap.value.size > 0)

function registerOption(option: SelectOptionMeta) {
  // 替换整个 Map 以触发响应式
  const next = new Map(optionMap.value)
  next.set(option.value, option)
  optionMap.value = next
}

function unregisterOption(value: string | number) {
  if (!optionMap.value.has(value)) return
  const next = new Map(optionMap.value)
  next.delete(value)
  optionMap.value = next
}

function setVisible(next: boolean) {
  if (visible.value === next) return
  visible.value = next
  emit('update:visible', next)
}

function select(value: string | number) {
  if (props.disabled) return
  if (props.modelValue !== value) {
    emit('update:modelValue', value)
    emit('change', value)
  }
  setVisible(false)
  removeOutsideListener()
}

function toggleVisible() {
  if (props.disabled) return
  if (visible.value) {
    setVisible(false)
    removeOutsideListener()
  } else {
    setVisible(true)
    focused.value = true
    nextTick(addOutsideListener)
  }
}

function addOutsideListener() {
  document.addEventListener('mousedown', handleOutsideMouseDown)
}

function removeOutsideListener() {
  document.removeEventListener('mousedown', handleOutsideMouseDown)
}

function handleOutsideMouseDown(e: MouseEvent) {
  const root = containerRef.value
  if (root && !root.contains(e.target as Node)) {
    setVisible(false)
    focused.value = false
    removeOutsideListener()
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Enter':
    case ' ':
      if (!visible.value) {
        e.preventDefault()
        setVisible(true)
        focused.value = true
        nextTick(addOutsideListener)
      }
      break
    case 'Escape':
      if (visible.value) {
        e.preventDefault()
        setVisible(false)
        removeOutsideListener()
      }
      break
    case 'Tab':
      if (visible.value) {
        setVisible(false)
        removeOutsideListener()
      }
      break
  }
}

function handleFocus() {
  focused.value = true
  emit('focus')
}

function handleBlur() {
  focused.value = false
  emit('blur')
}

provide(SELECT_KEY, {
  selected: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  visible,
  select,
  registerOption,
  unregisterOption,
})

onBeforeUnmount(() => {
  removeOutsideListener()
})

defineExpose({
  /** 命令式展开下拉 */
  open: () => {
    if (props.disabled) return
    setVisible(true)
    nextTick(addOutsideListener)
  },
  /** 命令式收起下拉 */
  close: () => {
    setVisible(false)
    removeOutsideListener()
  },
})
</script>

<template>
  <div
    ref="containerRef"
    class="glass-select-container"
    :class="{ open: visible, focused, disabled }"
  >
    <div
      class="glass-select-trigger"
      :class="{ 'glass-select-trigger--placeholder': !optionMap.has(modelValue) }"
      tabindex="0"
      role="combobox"
      :aria-expanded="visible"
      :aria-haspopup="true"
      :aria-disabled="disabled || undefined"
      @click="toggleVisible"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <span class="glass-select-label">{{ displayLabel }}</span>
      <div class="arrow-icon" aria-hidden="true"></div>
    </div>

    <Transition name="dropdown">
      <div
        v-show="visible"
        class="glass-select-dropdown"
        role="listbox"
      >
        <slot />
        <div v-if="!hasOptions" class="glass-select-empty">暂无选项</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ================= 外层容器 ================= */
.glass-select-container {
  position: relative;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
}

/* ================= Trigger 主框 ================= */
.glass-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  min-width: 160px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-heading);
  text-shadow: var(--text-heading-shadow);
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
  outline: none;
}

.glass-select-trigger:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(255, 255, 255, 0.3);
}

.glass-select-trigger--placeholder .glass-select-label {
  color: var(--text-muted);
  text-shadow: none;
}

/* 禁用态 */
.glass-select-container.disabled .glass-select-trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.1);
}

.glass-select-container.disabled .glass-select-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 展开/聚焦激活态 */
.glass-select-container.open .glass-select-trigger,
.glass-select-container.focused .glass-select-trigger {
  border-color: #60a5fa;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.7), inset 0 0 4px rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.35);
}

/* ================= 箭头指示器 ================= */
.arrow-icon {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-bottom: 2px;
  opacity: 0.85;
}

.glass-select-container.open .arrow-icon {
  transform: rotate(-135deg);
  margin-bottom: -2px;
}

/* ================= Dropdown 面板 ================= */
.glass-select-dropdown {
  /* 面板/选项表面 token：light 为默认，dark 主题在下方覆盖；
     自定义属性沿 DOM 继承给插槽内的 SelectOption */
  --select-panel-bg: rgba(255, 255, 255, 0.96);
  --select-panel-border: rgba(15, 23, 42, 0.1);
  --select-panel-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
  --select-option-hover-bg: rgba(37, 99, 235, 0.12);
  --select-option-active-bg: rgba(37, 99, 235, 0.85);
  --select-option-active-color: #ffffff;
  --select-option-active-shadow: 0 0 10px rgba(37, 99, 235, 0.35);

  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 1000;
  min-width: 160px;
  max-height: 300px;
  padding: 6px;
  border-radius: 12px;
  border: 1.5px solid var(--select-panel-border);
  background: var(--select-panel-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--select-panel-shadow);
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

[data-theme='dark'] .glass-select-dropdown {
  --select-panel-bg: rgba(20, 25, 40, 0.7);
  --select-panel-border: rgba(255, 255, 255, 0.5);
  --select-panel-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
  --select-option-hover-bg: rgba(59, 130, 246, 0.45);
  --select-option-active-bg: rgba(59, 130, 246, 0.75);
  --select-option-active-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
}

/* 下拉框动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 空态 */
.glass-select-empty {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-muted);
}
</style>
