<script lang="ts">
import type { InjectionKey, VNode } from 'vue'

/** TabPane 向 Tabs 注册的元信息 */
export interface TabPaneMeta {
  /** 面板标识，与 v-model 比对 */
  name: string | number
  /** 标签文本；未提供 label prop 时由标签插槽渲染 */
  label: string
  /** 是否禁用该标签 */
  disabled?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** TabPane 的 #label 插槽，存在时优先于 label 文本渲染 */
  labelSlot?: () => VNode[]
}

/** Tabs 向子 TabPane 注入的上下文 */
export interface TabsContext {
  /** 面板是否处于激活态 */
  isActive: (name: string | number) => boolean
  /** 面板挂载时注册自身 */
  registerPane: (pane: TabPaneMeta) => void
  /** 面板卸载或 name 变化时注销 */
  unregisterPane: (pane: TabPaneMeta) => void
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol('tabs')
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 激活面板的 name，支持 v-model */
  modelValue?: string | number
  /** 是否显示添加按钮 */
  addable?: boolean
  /** 标签是否等分容器宽度 */
  stretch?: boolean
}>(), {
  modelValue: '',
  addable: false,
  stretch: false,
})

const emit = defineEmits<{
  'update:modelValue': [name: string | number]
  tabClick: [name: string | number]
  tabChange: [name: string | number]
  tabRemove: [name: string | number]
  tabAdd: []
}>()

const navRef = ref<HTMLElement | null>(null)
/** 注册表用 shallowRef：meta 内含插槽函数，深层代理会破坏其调用 */
const panes = shallowRef<TabPaneMeta[]>([])

/** 滑块（glider）几何：宽度 + 水平位移 */
const gliderStyle = ref<{ width: string; transform: string }>({
  width: '0px',
  transform: 'translateX(0)',
})

const activePane = computed(
  () => panes.value.find((p) => p.name === props.modelValue) ?? null,
)

function updateGlider() {
  const nav = navRef.value
  if (!nav) return
  const el = nav.querySelector<HTMLElement>(
    `.glass-tab-button[data-name="${CSS.escape(String(props.modelValue))}"]`,
  )
  if (!el) {
    gliderStyle.value = { ...gliderStyle.value, width: '0px' }
    return
  }
  gliderStyle.value = {
    width: `${el.offsetWidth}px`,
    transform: `translateX(${el.offsetLeft - 4}px)`,
  }
}

function scheduleGliderUpdate() {
  nextTick(() => {
    updateGlider()
    // 字体/插槽内容可能延迟改变标签宽度，下一帧再校准一次
    requestAnimationFrame(updateGlider)
  })
}

function registerPane(pane: TabPaneMeta) {
  // 同一 name 重复注册视为更新（props 变更时子组件会重建 meta）
  const index = panes.value.findIndex((p) => p.name === pane.name)
  if (index === -1) {
    panes.value = [...panes.value, pane]
  } else {
    const next = [...panes.value]
    next[index] = pane
    panes.value = next
  }
  scheduleGliderUpdate()
}

function unregisterPane(pane: TabPaneMeta) {
  const index = panes.value.indexOf(pane)
  if (index === -1) return
  const next = [...panes.value]
  next.splice(index, 1)
  panes.value = next
  scheduleGliderUpdate()
}

/** v-model 为空时自动激活第一个可用面板 */
function ensureActive() {
  if (panes.value.length === 0) return
  const exists = panes.value.some((p) => p.name === props.modelValue && !p.disabled)
  if (exists) return
  const first = panes.value.find((p) => !p.disabled)
  if (first) {
    emit('update:modelValue', first.name)
    emit('tabChange', first.name)
  }
}

function handleClick(pane: TabPaneMeta) {
  emit('tabClick', pane.name)
  if (pane.disabled || pane.name === props.modelValue) return
  emit('update:modelValue', pane.name)
  emit('tabChange', pane.name)
}

function handleRemove(pane: TabPaneMeta) {
  emit('tabRemove', pane.name)
  if (pane.name !== props.modelValue) return
  // 关闭当前激活标签时顺延到相邻标签，避免 v-model 悬空
  const index = panes.value.findIndex((p) => p.name === pane.name)
  const next = panes.value[index + 1] ?? panes.value[index - 1]
  if (next) {
    emit('update:modelValue', next.name)
    emit('tabChange', next.name)
  }
}

function showClose(pane: TabPaneMeta): boolean {
  return (pane.closable ?? false) && !pane.disabled
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  const enabled = panes.value.filter((p) => !p.disabled)
  if (enabled.length === 0) return
  const current = enabled.findIndex((p) => p.name === props.modelValue)
  const step = event.key === 'ArrowRight' ? 1 : -1
  const next = enabled[(current + step + enabled.length) % enabled.length]
  event.preventDefault()
  if (next) {
    emit('update:modelValue', next.name)
    emit('tabChange', next.name)
  }
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  ensureActive()
  scheduleGliderUpdate()
  if (navRef.value) {
    resizeObserver = new ResizeObserver(() => updateGlider())
    resizeObserver.observe(navRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  () => props.modelValue,
  scheduleGliderUpdate,
)

watch(
  () => panes.value.map((p) => `${p.name}:${p.label}:${p.disabled}`).join('|'),
  () => {
    ensureActive()
    scheduleGliderUpdate()
  },
)

/** 激活项变化后其节点才渲染，需等渲染完成再测量 */
watch(activePane, scheduleGliderUpdate)

provide(TABS_KEY, {
  isActive: (name) => name === props.modelValue,
  registerPane,
  unregisterPane,
})

defineExpose({
  /** 重新测量激活标签并校正滑块位置（外部容器尺寸变化后调用） */
  resize: updateGlider,
})
</script>

<template>
  <div class="glass-tabs-root" :class="{ 'glass-tabs-root--stretch': stretch }">
    <div ref="navRef" class="glass-tabs" role="tablist" @keydown="handleKeyDown">
      <!-- 选中指示光晕滑块 -->
      <div class="tab-glider" :style="gliderStyle" aria-hidden="true"></div>

      <button
        v-for="pane in panes"
        :key="pane.name"
        class="glass-tab-button"
        :class="{ active: pane.name === modelValue, disabled: pane.disabled }"
        :data-name="pane.name"
        type="button"
        role="tab"
        :aria-selected="pane.name === modelValue"
        :aria-disabled="pane.disabled || undefined"
        :disabled="pane.disabled"
        @click="handleClick(pane)"
      >
        <span class="glass-tab-label">
          <component :is="pane.labelSlot" v-if="pane.labelSlot" />
          <template v-else>{{ pane.label }}</template>
        </span>
        <span
          v-if="showClose(pane)"
          class="glass-tab-close"
          role="button"
          aria-label="关闭"
          @click.stop="handleRemove(pane)"
        >&times;</span>
      </button>

      <button
        v-if="addable"
        class="glass-tab-button glass-tab-add"
        type="button"
        aria-label="添加"
        @click="emit('tabAdd')"
      >+</button>
    </div>

    <div class="glass-tabs-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ================= 根容器 ================= */
.glass-tabs-root {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ================= Tab 导航条 ================= */
.glass-tabs {
  position: relative;
  display: inline-flex;
  align-self: flex-start;
  background: var(--tabs-bar-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 4px;
  border-radius: 12px;
  border: 1.5px solid var(--tabs-bar-border);
  box-shadow: var(--tabs-bar-shadow);
}

.glass-tabs-root--stretch .glass-tabs {
  align-self: stretch;
}

.glass-tabs-root--stretch .glass-tab-button {
  /* min-width:0 取消内容撑开的下限，标签才能真正做到等分 */
  flex: 1 1 0;
  min-width: 0;
  justify-content: center;
}

.glass-tabs-root--stretch .glass-tab-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ================= 单个 Tab 按钮 ================= */
.glass-tab-button {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: var(--tabs-item-color);
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
  border-radius: 8px;
  transition: color 0.3s ease;
  user-select: none;
}

.glass-tab-button:hover:not(.disabled):not(.active) {
  color: var(--tabs-item-hover-color);
}

/* 选中态：主文字 + 光晕；不改变字重，避免滑块测量抖动 */
.glass-tab-button.active {
  color: var(--tabs-item-active-color);
  text-shadow: var(--tabs-item-active-glow);
}

.glass-tab-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.glass-tab-label {
  white-space: nowrap;
}

/* 关闭按钮：hover 时浮现 */
.glass-tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.glass-tab-button:hover .glass-tab-close {
  opacity: 0.8;
}

.glass-tab-close:hover {
  opacity: 1;
  background: var(--tabs-close-hover-bg);
}

/* 添加按钮 */
.glass-tab-add {
  padding: 8px 14px;
}

/* ================= 动态滑块光晕 ================= */
.tab-glider {
  position: absolute;
  top: 4px;
  left: 4px;
  height: calc(100% - 8px);
  background: var(--tabs-glider-bg);
  border: 1px solid var(--tabs-glider-border);
  border-radius: 8px;
  z-index: 1;
  box-shadow: var(--tabs-glider-shadow);
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform, width;
}

/* ================= 内容区 ================= */
.glass-tabs-content {
  margin-top: 20px;
}

/* ================= 主题 token：light 为默认 ================= */
.glass-tabs {
  --tabs-bar-bg: rgba(15, 23, 42, 0.06);
  --tabs-bar-border: rgba(15, 23, 42, 0.1);
  --tabs-bar-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.06);
  --tabs-glider-bg: rgba(37, 99, 235, 0.85);
  --tabs-glider-border: rgba(37, 99, 235, 0.9);
  --tabs-glider-shadow: 0 2px 10px rgba(37, 99, 235, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  --tabs-item-color: var(--text-muted);
  --tabs-item-hover-color: var(--text-heading);
  --tabs-item-active-color: #ffffff;
  --tabs-item-active-glow: 0 0 8px rgba(255, 255, 255, 0.4);
  --tabs-close-hover-bg: rgba(15, 23, 42, 0.15);
}

[data-theme='dark'] .glass-tabs {
  --tabs-bar-bg: rgba(15, 23, 42, 0.4);
  --tabs-bar-border: rgba(255, 255, 255, 0.4);
  --tabs-bar-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  --tabs-glider-bg: rgba(59, 130, 246, 0.65);
  --tabs-glider-border: rgba(147, 197, 253, 0.8);
  --tabs-glider-shadow: 0 0 12px rgba(59, 130, 246, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.5);
  --tabs-item-color: rgba(255, 255, 255, 0.65);
  --tabs-item-hover-color: rgba(255, 255, 255, 0.95);
  --tabs-item-active-color: #ffffff;
  --tabs-item-active-glow: 0 0 8px rgba(255, 255, 255, 0.6);
  --tabs-close-hover-bg: rgba(255, 255, 255, 0.2);
}
</style>
