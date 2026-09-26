<script setup lang="ts">
defineOptions({
  /** 关闭自动透传：原生属性统一交给内部 <input>，避免根容器与 input 重复挂载同名属性 */
  inheritAttrs: false,
})

defineProps<{
  /** 输入框值，与 v-model 配合使用 */
  modelValue?: string
  /** 输入框类型 */
  type?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否必填 */
  required?: boolean
  /** 最大长度 */
  maxlength?: number
  /** 正则表达式验证 */
  pattern?: string
  /** 是否自动完成 */
  autocomplete?: string
  /** 是否自动聚焦 */
  autofocus?: boolean
  /** 输入名 */
  name?: string
  /** 整体宽度（含前置 / 后置区域） */
  style?: Record<string, string | number>
}>()

const slots = defineSlots<{
  /** 前置内容，紧贴输入框左侧 */
  prepend?: () => any
  /** 后置内容，紧贴输入框右侧 */
  append?: () => any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [event: InputEvent]
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  focusin: [event: FocusEvent]
  focusout: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
  keypress: [event: KeyboardEvent]
}>()

function onUpdate(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', event as InputEvent)
}
</script>

<template>
  <div
    class="glass-input-wrapper"
    :class="{
      'has-prepend': !!slots.prepend,
      'has-append': !!slots.append,
      'is-disabled': disabled,
    }"
    :style="style"
  >
    <!-- 前置区域：仅在真的传入插槽时渲染容器，避免空容器撑出一道多余边框 -->
    <div v-if="slots.prepend" class="glass-input-affix glass-input-prepend">
      <slot name="prepend"></slot>
    </div>

    <input
      class="glass-input"
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxlength"
      :pattern="pattern"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :name="name"
      v-bind="$attrs"
      @input="onUpdate"
      @change="emit('change', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
      @focusin="emit('focusin', $event)"
      @focusout="emit('focusout', $event)"
      @keydown="emit('keydown', $event)"
      @keyup="emit('keyup', $event)"
      @keypress="emit('keypress', $event)"
    />

    <!-- 后置区域 -->
    <div v-if="slots.append" class="glass-input-affix glass-input-append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<style scoped>
/* ===== 整组容器 =====
   阴影与描边发光统一画在容器上：前置 / 后置与输入框相接处不会出现重影缝隙。
   毛玻璃的「模糊」也只画在这一层：三个子块各自持有 backdrop-filter 时，每块只模糊
   自己盒子背后的内容，拼接处会跳出一道明暗台阶；交给容器统一模糊一次，
   子块只做半透明白着色，整条控件共享同一份模糊底，接缝在照片背景上也才连得起来。 */
.glass-input-wrapper {
  display: inline-flex;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: box-shadow 0.25s ease-in-out;
}

/* ===== 输入框本体 ===== */
.glass-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-body);
  border-radius: 12px;
  outline: none;
  box-sizing: border-box;

  /* 玻璃着色层：模糊由外层容器统一提供，这里只叠白 */
  background: rgba(255, 255, 255, 0.35);

  /* 基础微光描边 */
  border: 1.5px solid rgba(255, 255, 255, 0.7);

  /* 平滑过渡动画 */
  transition: all 0.25s ease-in-out;
}

/* ===== 前置 / 后置区域：与输入框共用同一套毛玻璃语言 ===== */
.glass-input-affix {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  height: 40px;
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  color: var(--text-body);

  /* 与输入框一致的玻璃着色层（模糊由容器统一提供） */
  background: rgba(255, 255, 255, 0.35);
  border: 1.5px solid rgba(255, 255, 255, 0.7);

  transition: all 0.25s ease-in-out;
}

/* 外侧保留圆角，内侧（与输入框相接的一边）去掉边框，拼成一条完整控件 */
.glass-input-prepend {
  border-right: 0;
  border-radius: 12px 0 0 12px;
}
.glass-input-append {
  border-left: 0;
  border-radius: 0 12px 12px 0;
}

/* 区域内的图标跟随文字色号，避免图标与文本深浅不一 */
.glass-input-affix :deep(svg) {
  display: block;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

/* 1. 静止 / 悬停状态 (Idle & Hover State) */
.glass-input::placeholder {
  color: var(--text-muted);
}
.glass-input-wrapper:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.glass-input-wrapper:hover .glass-input:not(:disabled),
.glass-input-wrapper:hover .glass-input-affix {
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(255, 255, 255, 0.9);
}

/* 2. 聚焦 / 激活状态 (Active State)
   用 focus-within 让整组一起点亮：焦点落在后置按钮里时前置区也不会掉色 */
.glass-input-wrapper:focus-within {
  /* 荧光蓝高亮边框与外发光 */
  box-shadow:
      0 0 0 1px #3b82f6,
      0 0 12px rgba(59, 130, 246, 0.5);
}
.glass-input-wrapper:focus-within .glass-input:not(:disabled),
.glass-input-wrapper:focus-within .glass-input-affix {
  background: rgba(255, 255, 255, 0.55);
  border-color: #3b82f6;
}
.glass-input-wrapper:focus-within .glass-input:not(:disabled) {
  box-shadow: inset 0 0 6px rgba(59, 130, 246, 0.2);
}

/* 3. 拼接缝隙：与相邻区域共享的那条边直接不画边框，
      这样悬停 / 聚焦改 border-color 时也不会在接缝处渗出蓝线 */
.glass-input-wrapper.has-prepend > .glass-input {
  border-left-width: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.glass-input-wrapper.has-append > .glass-input {
  border-right-width: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/* 两端都有时圆角完全交给前置 / 后置区域绘制 */
.glass-input-wrapper.has-prepend.has-append > .glass-input {
  border-radius: 0;
}

/* 4. 禁用状态 (Disabled State) */
.glass-input:disabled {
  background: rgba(180, 190, 200, 0.25);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-disabled);
  cursor: not-allowed;
}
.glass-input-wrapper.is-disabled {
  box-shadow: none;
}
.glass-input-wrapper.is-disabled .glass-input-affix {
  background: rgba(180, 190, 200, 0.25);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-disabled);
}
</style>
