<script setup lang="ts">
import { computed, inject } from 'vue'
import { RADIO_GROUP_KEY } from './RadioGroup.vue'

const props = withDefaults(defineProps<{
  /** 选项值，在 RadioGroup 内使用时必填 */
  value?: string
  /** 显示标签文本 */
  label?: string
  /** 选中的值，独立使用时与 v-model 配合；在 RadioGroup 内由组接管 */
  modelValue?: string | boolean
  /** 选项名称（用于表单分组），未设置时继承 RadioGroup 的 name */
  name?: string
  /** 是否禁用，未设置时继承 RadioGroup 的 disabled */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否必填 */
  required?: boolean
  /** 输入名 */
  id?: string
}>(), {
  value: '',
  label: '',
  modelValue: '',
  name: '',
  disabled: false,
  readonly: false,
  required: false,
  id: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | boolean]
  change: [event: Event]
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

/** 可选注入：存在时表示当前 Radio 位于 RadioGroup 内 */
const group = inject(RADIO_GROUP_KEY, undefined)

/** 选中态：组内比对组的选中值，独立时比对自身 modelValue */
const isChecked = computed(() => {
  if (group) return group.selected.value === props.value
  return props.modelValue === props.value
})

/** 实际生效的 name：自身优先，否则继承组 */
const resolvedName = computed(() => props.name || group?.name.value || undefined)

/** 实际生效的禁用态：自身或组任一为真即禁用 */
const resolvedDisabled = computed(() => props.disabled || !!group?.disabled.value)

function onChange(event: Event) {
  if (group) {
    /* 组内模式：交由 RadioGroup 统一维护选中值 */
    group.select(props.value)
  } else {
    /* 独立模式：直接同步选中值 */
    emit('update:modelValue', props.value)
  }

  emit('change', event)
}

function onClick(event: MouseEvent) {
  if (resolvedDisabled.value) return

  /* 浏览器不为 radio 提供原生 readonly，需拦截默认激活行为避免选中态变化 */
  if (props.readonly) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <label
    class="glass-radio"
    :class="{
      'glass-radio--disabled': resolvedDisabled,
      'glass-radio--readonly': readonly && !resolvedDisabled,
    }"
    :for="id || undefined"
  >
    <input
      type="radio"
      class="glass-radio-input"
      :checked="isChecked"
      :name="resolvedName"
      :value="value"
      :disabled="resolvedDisabled"
      :readonly="readonly"
      :required="required"
      :id="id"
      v-bind="$attrs"
      @click="onClick"
      @change="onChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="emit('keydown', $event)"
    />
    <span class="glass-radio-dot"></span>
    <span class="glass-label-text">{{ label }}</span>
  </label>
</template>

<style scoped>
/* 隐藏原生 Radio */
.glass-radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* 标签包裹容器 */
.glass-radio {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-body);
}

/* 自定义圆点 - 静止/默认状态 */
.glass-radio-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;

  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* 微光边框 */
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  transition: all 0.25s ease;
  position: relative;
}

/* 中心小白点/小白环 */
.glass-radio-dot::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  transform: translate(-50%, -50%) scale(0); /* 默认缩小隐藏 */
  transition: transform 0.2s ease-in-out;
}

/* 悬停 (Hover) */
.glass-radio:hover .glass-radio-dot {
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(255, 255, 255, 0.9);
}

/* 选中状态 (Checked) */
.glass-radio-input:checked + .glass-radio-dot {
  background: rgba(59, 130, 246, 0.85); /* 对应截图里的蓝色确定按钮色调 */
  border-color: #60a5fa;
  box-shadow:
      0 0 12px rgba(59, 130, 246, 0.6),
      inset 0 0 4px rgba(255, 255, 255, 0.4);
}
.glass-radio-input:checked + .glass-radio-dot::after {
  transform: translate(-50%, -50%) scale(1); /* 放大显示白点 */
}

/* 禁用状态 (Disabled) */
.glass-radio-input:disabled + .glass-radio-dot,
.glass-radio--disabled .glass-radio-dot {
  background: rgba(150, 150, 150, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.glass-radio--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 只读状态 (Readonly)：展示选中态但不可交互，仅取消手型指针 */
.glass-radio--readonly {
  cursor: default;
}
</style>