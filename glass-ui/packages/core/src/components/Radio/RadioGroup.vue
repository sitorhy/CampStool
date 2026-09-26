<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

/** RadioGroup 向子 Radio 注入的上下文 */
export interface RadioGroupContext {
  /** 当前选中的值 */
  selected: Readonly<Ref<string>>
  /** 组 name，下发给子选项用于原生单选分组 */
  name: Readonly<Ref<string>>
  /** 组级禁用状态 */
  disabled: Readonly<Ref<boolean>>
  /** 选中指定值 */
  select: (value: string) => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> =
  Symbol('radioGroup')
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'

const props = withDefaults(defineProps<{
  /** 选中的值，支持 v-model */
  modelValue?: string
  /** 选项名称，自动下发给所有子 Radio */
  name?: string
  /** 是否禁用整组 */
  disabled?: boolean
  /** 组标签文本 */
  label?: string
  /** 子选项排列方向 */
  direction?: 'vertical' | 'horizontal'
}>(), {
  modelValue: '',
  name: '',
  disabled: false,
  label: '',
  direction: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

/** 单选语义：只记录新值，不允许取消选中 */
function select(value: string) {
  if (props.disabled || props.modelValue === value) return

  emit('update:modelValue', value)
  emit('change', value)
}

provide(RADIO_GROUP_KEY, {
  selected: toRef(props, 'modelValue'),
  name: toRef(props, 'name'),
  disabled: toRef(props, 'disabled'),
  select,
})
</script>

<template>
  <div
    class="radio-group"
    :class="[
      `radio-group--${direction}`,
      { 'radio-group--disabled': disabled },
    ]"
    role="radiogroup"
    :aria-label="label || undefined"
    :aria-disabled="disabled || undefined"
  >
    <span v-if="label" class="radio-group-label">{{ label }}</span>
    <slot />
  </div>
</template>

<style scoped>
.radio-group {
  display: inline-flex;
  gap: 10px;
  align-items: flex-start;
}

/* 纵向排列：标签在上，选项依次向下 */
.radio-group--vertical {
  flex-direction: column;
}

/* 横向排列：标签与选项同行 */
.radio-group--horizontal {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.radio-group-label {
  font-size: 14px;
  color: var(--text-body);
  font-weight: 500;
}

.radio-group--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
