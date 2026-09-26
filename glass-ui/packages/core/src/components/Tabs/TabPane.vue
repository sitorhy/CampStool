<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue'
import { TABS_KEY, type TabPaneMeta } from './Tabs.vue'

const props = withDefaults(defineProps<{
  /** 面板标识，与 Tabs 的 v-model 比对；缺省时使用插槽内容做匹配无意义，建议显式传入 */
  name: string | number
  /** 标签文本；也可通过 #label 插槽自定义渲染 */
  label?: string
  /** 是否禁用该标签 */
  disabled?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
}>(), {
  label: '',
  disabled: false,
  closable: false,
})

/** 必须位于 Tabs 内部；未注入时给出开发期告警并降级为静态面板 */
const tabs = inject(TABS_KEY, undefined)
const slots = useSlots()

if (!tabs && import.meta.env?.DEV) {
  console.warn('[TabPane] 必须作为 <Tabs> 的子组件使用，否则无法响应激活状态')
}

const isActive = computed(() => tabs?.isActive(props.name) ?? false)

/** 由当前 props 构造注册元信息 */
function buildMeta(): TabPaneMeta {
  return {
    name: props.name,
    label: props.label,
    disabled: props.disabled,
    closable: props.closable,
    labelSlot: slots.label as TabPaneMeta['labelSlot'],
  }
}

/** 当前登记在 Tabs 里的实例：注销必须复用同一引用 */
let registered: TabPaneMeta | null = null

function register() {
  const meta = buildMeta()
  tabs?.registerPane(meta)
  registered = meta
}

onMounted(register)

onBeforeUnmount(() => {
  if (registered) tabs?.unregisterPane(registered)
})

// props 变化时同步注册表；name 变化需要注销旧项
watch(
  () => [props.name, props.label, props.disabled, props.closable] as const,
  ([newName, , , ], [oldName]) => {
    if (registered && oldName !== undefined && oldName !== newName) {
      tabs?.unregisterPane(registered)
      registered = null
    }
    register()
  },
)
</script>

<template>
  <div
    class="glass-tab-pane"
    :class="{ 'is-active': isActive }"
    role="tabpanel"
    :aria-hidden="!isActive"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-tab-pane {
  --tab-pane-bg: rgba(15, 23, 42, 0.04);
  --tab-pane-border: rgba(15, 23, 42, 0.08);

  /* display 切换会让 CSS animation 重新触发，故不需要 JS 过渡钩子 */
  display: none;
  padding: 16px;
  border-radius: 12px;
  background: var(--tab-pane-bg);
  border: 1px solid var(--tab-pane-border);
  color: var(--text-body);
  font-size: 14px;
  line-height: 1.6;
}

.glass-tab-pane.is-active {
  display: block;
  animation: glass-tab-fade-in 0.3s ease;
}

[data-theme='dark'] .glass-tab-pane {
  --tab-pane-bg: rgba(255, 255, 255, 0.1);
  --tab-pane-border: rgba(255, 255, 255, 0.3);
}

@keyframes glass-tab-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
