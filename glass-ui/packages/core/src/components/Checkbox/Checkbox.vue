<script setup lang="ts">
import { computed, inject } from 'vue'
import { CHECKBOX_GROUP_KEY } from './CheckboxGroup.vue'

const props = withDefaults(defineProps<{
  /** 选项值，在 CheckboxGroup 内使用时必填 */
  value?: string
  /** 选中状态，独立使用时与 v-model 配合 */
  modelValue?: boolean
  /** 显示标签文本 */
  label?: string
  /** 选项名称（用于表单分组），未设置时继承 CheckboxGroup 的 name */
  name?: string
  /** 是否禁用，未设置时继承 CheckboxGroup 的 disabled */
  disabled?: boolean
  /** 是否必填 */
  required?: boolean
  /** 输入 id */
  id?: string
}>(), {
  modelValue: false,
  value: '',
  label: '',
  name: '',
  disabled: false,
  required: false,
  id: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [event: Event]
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

/** 可选注入：存在时表示当前 Checkbox 位于 CheckboxGroup 内 */
const group = inject(CHECKBOX_GROUP_KEY, undefined)

/** 选中态：组内查数组，独立时看 modelValue */
const isChecked = computed(() => {
  if (group) return group.selected.value.includes(props.value)
  return !!props.modelValue
})

/** 实际生效的 name：自身优先，否则继承组 */
const resolvedName = computed(() => props.name || group?.name.value || undefined)

/** 实际生效的禁用态：自身或组任一为真即禁用 */
const resolvedDisabled = computed(() => props.disabled || !!group?.disabled.value)

function onUpdate(event: Event) {
  const checked = (event.target as HTMLInputElement).checked

  if (group) {
    /* 组内模式：交由 CheckboxGroup 统一维护选中数组 */
    group.toggle(props.value, checked)
  } else {
    /* 独立模式：直接同步布尔值 */
    emit('update:modelValue', checked)
  }

  emit('change', event)
}

function onClick(event: MouseEvent) {
  if (!resolvedDisabled.value) {
    emit('click', event)
  }
}
</script>

<template>
  <label
    class="glass-checkbox"
    :class="{ 'glass-checkbox--disabled': resolvedDisabled }"
    :for="id || undefined"
  >
    <input
      type="checkbox"
      class="glass-checkbox-input"
      :checked="isChecked"
      :name="resolvedName"
      :disabled="resolvedDisabled"
      :required="required"
      :id="id"
      v-bind="$attrs"
      @change="onUpdate"
      @click="onClick"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="emit('keydown', $event)"
    />
    <span class="glass-checkbox-box"></span>
    <span class="glass-label-text">{{ label }}</span>
  </label>
</template>

<style scoped>
/* 隐藏原生 Checkbox */
.glass-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* 标签包裹容器 */
.glass-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-body);
}

/* 自定义方框 - 静止/默认状态 */
.glass-checkbox-box {
  width: 20px;
  height: 20px;
  border-radius: 6px;

  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* 微光边框与发光 */
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  transition: all 0.25s ease;
  position: relative;
}

/* 内部白色对勾 (Checkmark) */
.glass-checkbox-box::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0); /* 默认隐藏 */
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.27); /* 带弹性的出现动画 */
}

/* 悬停 (Hover) */
.glass-checkbox:hover .glass-checkbox-box {
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(255, 255, 255, 0.9);
}

/* 选中状态 (Checked) */
.glass-checkbox-input:checked + .glass-checkbox-box {
  background: rgba(59, 130, 246, 0.85); /* 霓虹蓝底色 */
  border-color: #60a5fa;
  box-shadow:
      0 0 12px rgba(59, 130, 246, 0.6),
      inset 0 0 4px rgba(255, 255, 255, 0.4);
}
.glass-checkbox-input:checked + .glass-checkbox-box::after {
  transform: rotate(45deg) scale(1); /* 显示对勾 */
}

/* 禁用状态 (Disabled) */
.glass-checkbox-input:disabled + .glass-checkbox-box,
.glass-checkbox--disabled .glass-checkbox-box {
  background: rgba(150, 150, 150, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.glass-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>