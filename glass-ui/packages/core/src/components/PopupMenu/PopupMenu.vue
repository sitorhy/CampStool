<script setup lang="ts">
import {ref, watch, nextTick, onBeforeUnmount} from 'vue'
import MenuButton from './MenuButton.vue'

interface PopupMenuItem {
  id: string
  icon: string
  label: string
  onClick?: () => void
}

const props = withDefaults(defineProps<{
  /** 菜单项配置 */
  items: PopupMenuItem[]
  /** 弹出位置 X 坐标(px，视口坐标) */
  x?: number
  /** 弹出位置 Y 坐标(px，视口坐标) */
  y?: number
  /** 入场初始 Y 轴偏移量(px) */
  offsetY?: number
  /** 菜单项按钮直径(px) */
  itemSize?: number
  /** 菜单项图标尺寸(px) */
  itemIconSize?: number
  /** 各项交错延迟(ms) */
  staggerDelay?: number
}>(), {
  x: 0,
  y: 0,
  offsetY: 12,
  itemSize: 36,
  itemIconSize: 20,
  staggerDelay: 50,
})

const visible = defineModel<boolean>('visible', {
  default: false,
});

const rootRef = ref<HTMLElement>()

/** 交错延迟 */
function itemDelay(index: number): string {
  return `${index * props.staggerDelay}ms`
}

/* 点击外部关闭 */
function onDocumentPointerDown(e: PointerEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    visible.value = false
  }
}

watch(visible, (v) => {
  if (v) {
    nextTick(() => document.addEventListener('pointerdown', onDocumentPointerDown))
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <!-- teleport 到 body：脱离带 transform 的祖先（如 TestView），使 position: fixed 真正相对视口，x/y 与 clientX/clientY 对齐 -->
  <teleport to="body">
    <div :style="{
        left: `${x}px`,
        top: `${y}px`,
        position: 'fixed'
  }">
    <div
        ref="rootRef"
        class="popup-menu"
        :style="{
        '--popup-offset-y': `${offsetY}px`,
      }"
    >
      <TransitionGroup
          name="popup-item"
          tag="div"
          class="popup-menu-list"
          :appear="true"
      >
        <MenuButton
            v-for="(item, index) in items"
            v-show="visible"
            :key="item.id"
            :icon="item.icon"
            :ring="false"
            :size="itemSize"
            :icon-size="itemIconSize"
            :style="{ transitionDelay: visible ? itemDelay(index) : '0ms' }"
            @click="item.onClick?.()"
        />
      </TransitionGroup>
    </div>
    </div>
  </teleport>
</template>

<style scoped>
.popup-menu {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --popup-offset-y: 12px;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.popup-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 渐显 + 减加速位移过渡（ease-out） */
.popup-item-enter-active {
  transition: opacity 0.35s ease-out, transform 0.35s ease-out;
}

.popup-item-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

/* 初始状态：透明 + 沿切入方向偏移 */
.popup-item-enter-from {
  opacity: 0;
  transform: translateY(var(--popup-offset-y));
}

/* 离场终态：透明 + 微移 */
.popup-item-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
