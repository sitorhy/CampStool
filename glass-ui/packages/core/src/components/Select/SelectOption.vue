<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { SELECT_KEY } from './Select.vue'

const props = withDefaults(defineProps<{
  /** 选项值，选中时通过父级 v-model 抛出 */
  value: string | number
  /** 选项显示文本；也可通过默认插槽自定义渲染 */
  label?: string
  /** 是否禁用该选项 */
  disabled?: boolean
}>(), {
  label: '',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/** 必须位于 Select 内部；未注入时给出开发期告警并降级为静态展示 */
const select = inject(SELECT_KEY, undefined)

if (!select && import.meta.env?.DEV) {
  console.warn('[SelectOption] 必须作为 <Select> 的子组件使用，否则无法响应选中状态')
}

/** 选中态：与父级 modelValue 比对 */
const isSelected = computed(() => select?.selected.value === props.value)

/** 禁用态：自身禁用 或 父级整组禁用 */
const isDisabled = computed(() => props.disabled || !!select?.disabled.value)

/** 悬停高亮：仅在下拉展开时展示（保留视觉聚焦） */
const isHoverable = computed(() => !isDisabled.value)

function register() {
  select?.registerOption({
    value: props.value,
    label: props.label,
    disabled: props.disabled,
  })
}

function handleClick(event: MouseEvent) {
  emit('click', event)
  if (isDisabled.value) return
  select?.select(props.value)
}

onMounted(register)

onBeforeUnmount(() => {
  select?.unregisterOption(props.value)
})

// props 变化时同步注册表；value 变化需要注销旧值
watch(
  () => [props.value, props.label, props.disabled] as const,
  ([newValue, , ], [oldValue]) => {
    if (oldValue !== undefined && oldValue !== newValue) {
      select?.unregisterOption(oldValue)
    }
    register()
  },
)
</script>

<template>
  <div
    class="glass-select-option"
    :class="{
      'glass-select-option--selected': isSelected,
      'glass-select-option--disabled': isDisabled,
      'glass-select-option--hoverable': isHoverable,
    }"
    role="option"
    :aria-selected="isSelected"
    :aria-disabled="isDisabled || undefined"
    @click="handleClick"
  >
    <span class="glass-option-label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="isSelected" class="glass-option-check" aria-hidden="true">✓</span>
  </div>
</template>

<style scoped>
.glass-select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 14px;
  font-size: 14px;
  color: var(--text-body);
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s ease;
  user-select: none;
}

.glass-select-option--hoverable {
  cursor: pointer;
}

/* 悬停：蓝色微光 + 微微右移 */
.glass-select-option--hoverable:hover {
  background: var(--select-option-hover-bg, rgba(37, 99, 235, 0.12));
  color: var(--text-heading);
  padding-left: 18px;
}

/* 当前选中项高亮 */
.glass-select-option--selected {
  background: var(--select-option-active-bg, rgba(37, 99, 235, 0.85));
  color: var(--select-option-active-color, #ffffff);
  font-weight: 500;
  box-shadow: var(--select-option-active-shadow, 0 0 10px rgba(37, 99, 235, 0.35));
}

/* 禁用态：视觉灰化，取消悬停/选中样式干扰 */
.glass-select-option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.glass-select-option--disabled:hover {
  background: transparent;
  padding-left: 14px;
}

.glass-option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.glass-option-check {
  font-size: 14px;
  color: currentColor;
  margin-left: 8px;
  flex-shrink: 0;
}
</style>
