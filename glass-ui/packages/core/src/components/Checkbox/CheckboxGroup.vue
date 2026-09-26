<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

/** CheckboxGroup 向子 Checkbox 注入的上下文 */
export interface CheckboxGroupContext {
  /** 当前选中的值数组 */
  selected: Readonly<Ref<string[]>>
  /** 组 name，下发给子选项用于表单分组 */
  name: Readonly<Ref<string>>
  /** 组级禁用状态 */
  disabled: Readonly<Ref<boolean>>
  /** 切换指定值的选中状态 */
  toggle: (value: string, checked: boolean) => void
}

export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> =
  Symbol('checkboxGroup')
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'

const props = withDefaults(defineProps<{
  /** 选中的值列表，支持 v-model */
  modelValue?: string[]
  /** 选项名称，自动下发给所有子 Checkbox */
  name?: string
  /** 是否禁用整组 */
  disabled?: boolean
  /** 组标签文本 */
  label?: string
  /** 子选项排列方向 */
  direction?: 'vertical' | 'horizontal'
}>(), {
  modelValue: () => [],
  name: '',
  disabled: false,
  label: '',
  direction: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

function toggle(value: string, checked: boolean) {
  if (props.disabled) return

  const current = props.modelValue
  const next = checked
    ? current.includes(value)
      ? current
      : [...current, value]
    : current.filter((v) => v !== value)

  emit('update:modelValue', next)
  emit('change', next)
}

provide(CHECKBOX_GROUP_KEY, {
  selected: toRef(props, 'modelValue'),
  name: toRef(props, 'name'),
  disabled: toRef(props, 'disabled'),
  toggle,
})
</script>

<template>
  <div
    class="checkbox-group"
    :class="[
      `checkbox-group--${direction}`,
      { 'checkbox-group--disabled': disabled },
    ]"
    role="group"
    :aria-label="label || undefined"
    :aria-disabled="disabled || undefined"
  >
    <span v-if="label" class="checkbox-group-label">{{ label }}</span>
    <slot />
  </div>
</template>

<style scoped>
.checkbox-group {
  display: inline-flex;
  gap: 10px;
  align-items: flex-start;
}

/* 纵向排列：标签在上，选项依次向下 */
.checkbox-group--vertical {
  flex-direction: column;
}

/* 横向排列：标签与选项同行 */
.checkbox-group--horizontal {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.checkbox-group-label {
  font-size: 14px;
  color: var(--text-body);
  font-weight: 500;
}

.checkbox-group--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
