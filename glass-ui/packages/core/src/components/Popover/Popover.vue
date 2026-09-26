<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PopoverArrow from './PopoverArrow.vue'

type Direction = 'top' | 'bottom' | 'left' | 'right'
/** 格式：[方向]-[对齐位置]，对齐位置可选 start / end，省略时居中 */
type PopoverPlacement = Direction | `${Direction}-start` | `${Direction}-end`

const props = withDefaults(defineProps<{
  /** 弹出框位置，如 left-end：显示在触发元素左侧且底部对齐 */
  placement?: PopoverPlacement
  /** 是否显示，支持 v-model:visible */
  visible?: boolean
}>(), {
  placement: 'right',
  visible: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const root = ref<HTMLElement>()
const panel = ref<HTMLElement>()

/* placement 的方向部分，决定箭头朝向 */
const direction = computed<Direction>(() => props.placement.split('-')[0] as Direction)

/* 同步弹出内容交叉轴尺寸到 --popover-panel-cross，供分割线 auto 拉伸 */
let observer: ResizeObserver | undefined

function syncPanelCross() {
  if (!panel.value || !root.value) return
  const cross = direction.value === 'left' || direction.value === 'right'
    ? panel.value.offsetHeight
    : panel.value.offsetWidth
  root.value.style.setProperty('--popover-panel-cross', `${cross}px`)
}

function toggle() {
  emit('update:visible', !props.visible)
}

/* 点击组件外部时关闭 */
function onDocumentClick(e: MouseEvent) {
  if (props.visible && root.value && !root.value.contains(e.target as Node)) {
    emit('update:visible', false)
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  observer = new ResizeObserver(syncPanelCross)
  if (panel.value) observer.observe(panel.value)
  syncPanelCross()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  observer?.disconnect()
})
watch(direction, syncPanelCross)
</script>

<template>
  <div ref="root" class="popover-root">
    <span class="popover-trigger" @click.stop="toggle">
      <slot name="trigger" />
    </span>
    <Transition name="popover">
      <div v-show="visible" class="popover-layer" :class="`popover--${placement}`">
        <div ref="panel" class="popover-panel" @click.stop>
          <!-- 作用域插槽暴露 placement，供内容组件判断方向 -->
          <slot :placement="placement" />
        </div>
        <!-- 箭头始终指向触发元素中心 -->
        <PopoverArrow :placement="placement" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.popover-root {
  --popover-bg: #f5f5f5;
  /* 需容纳箭头指向三角形的高 + 分割线间距 */
  --popover-gap: 40px;
  /* 弹出内容交叉轴尺寸，由 ResizeObserver 实测写入 */
  --popover-panel-cross: 60px;
  /* 箭头颜色，由 PopoverArrow 消费 */
  --popover-arrow-bg: var(--popover-bg);
  position: relative;
  display: inline-block;
}

.popover-trigger {
  display: inline-block;
  cursor: pointer;
}

/* 与触发元素同尺寸的定位层，弹层与箭头均相对它定位 */
.popover-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 30;
}

/* 面板不带背景与边框，由内容组件自行决定 */
.popover-panel {
  position: absolute;
  pointer-events: auto;
}

/* ---- top：弹出框在上方 ---- */
.popover--top .popover-panel {
  bottom: calc(100% + var(--popover-gap));
  left: 50%;
  transform: translateX(-50%);
}

.popover--top-start .popover-panel {
  bottom: calc(100% + var(--popover-gap));
  left: 0;
}

.popover--top-end .popover-panel {
  bottom: calc(100% + var(--popover-gap));
  right: 0;
}

/* ---- bottom：弹出框在下方 ---- */
.popover--bottom .popover-panel {
  top: calc(100% + var(--popover-gap));
  left: 50%;
  transform: translateX(-50%);
}

.popover--bottom-start .popover-panel {
  top: calc(100% + var(--popover-gap));
  left: 0;
}

.popover--bottom-end .popover-panel {
  top: calc(100% + var(--popover-gap));
  right: 0;
}

/* ---- left：弹出框在左侧 ---- */
.popover--left .popover-panel {
  right: calc(100% + var(--popover-gap));
  top: 50%;
  transform: translateY(-50%);
}

.popover--left-start .popover-panel {
  right: calc(100% + var(--popover-gap));
  top: 0;
}

.popover--left-end .popover-panel {
  right: calc(100% + var(--popover-gap));
  bottom: 0;
}

/* ---- right：弹出框在右侧 ---- */
.popover--right .popover-panel {
  left: calc(100% + var(--popover-gap));
  top: 50%;
  transform: translateY(-50%);
}

.popover--right-start .popover-panel {
  left: calc(100% + var(--popover-gap));
  top: 0;
}

.popover--right-end .popover-panel {
  left: calc(100% + var(--popover-gap));
  bottom: 0;
}

/* ---- 显隐过渡 ---- */
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}
</style>
