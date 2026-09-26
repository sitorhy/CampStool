<template>
  <teleport to="body">
    <Transition
        name="dialog-fade"
        @after-enter="onFadeAfterEnter"
        @after-leave="onFadeAfterLeave"
    >
      <div
          v-show="visible"
          class="dialog-overlay"
          :style="{
          '--dialog-width': `${width}px`,
          '--dialog-body-height': `${bodyHeight}px`,
          '--dialog-fade-duration': `${fadeDuration}ms`,
          '--dialog-body-duration': `${bodyDuration}ms`,
        }"
          @click.self="onMaskClick"
      >
        <div class="dialog">
          <!-- 顶部标题栏 -->
          <div class="dialog-header">
            <span class="title">Theme</span>
          </div>

          <!-- 中间主图与导航区 -->
          <div
              class="dialog-body"
              :class="{ 'dialog-body--collapsed': !bodyExpanded }"
          >
            <template v-if="slotShown">
              <slot></slot>
            </template>
          </div>

          <!-- 底部操作栏 -->
          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, watch} from 'vue'

const props = withDefaults(defineProps<{
  /** 是否显示，支持 v-model:visible */
  visible?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 对话框宽度(px) */
  width?: number
  /** 主体区域高度(px) */
  bodyHeight?: number
  /** 显隐渐显 / 渐隐时长(ms) */
  fadeDuration?: number
  /** 主体区展开过渡时长(ms) */
  bodyDuration?: number
  /** 动画未完成时是否显示插槽内容 */
  showContentDuringAnimation?: boolean
}>(), {
  visible: false,
  maskClosable: true,
  width: 348,
  bodyHeight: 196,
  fadeDuration: 300,
  bodyDuration: 300,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

/* 仅点击遮罩自身关闭，点击对话框本体不触发 */
function onMaskClick() {
  if (props.maskClosable) emit('update:visible', false)
}

/** 主体区是否展开：渐显完成前保持 height 0 折叠 */
const bodyExpanded = ref(false)
/** 默认插槽是否显示：主体区过渡完成后恢复 */
const slotShown = ref(false)

let bodyTimer: number | undefined

watch(() => props.visible, (show) => {
  window.clearTimeout(bodyTimer)
  if (show) {
    /* 打开时重置为折叠态，待渐显完成后依序展开 */
    bodyExpanded.value = false
    slotShown.value = props.showContentDuringAnimation;
  }
})

/* 渐显完毕：移除高度 0 限制，主体区过渡回设定高度 */
function onFadeAfterEnter() {
  bodyExpanded.value = true
  if (!props.showContentDuringAnimation) {
    bodyTimer = window.setTimeout(() => {
      slotShown.value = true
    }, props.bodyDuration)
  }
}

/* 渐隐完毕：复原折叠态与插槽隐藏，保证下次打开重放序列 */
function onFadeAfterLeave() {
  window.clearTimeout(bodyTimer)
  bodyExpanded.value = false
  slotShown.value = false
}

onBeforeUnmount(() => {
  window.clearTimeout(bodyTimer)
})
</script>

<style scoped>
/* 遮罩层，用于居中对话框 */
.dialog-overlay {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --dialog-width: 348px;
  --dialog-body-height: 196px;
  --dialog-fade-duration: 200ms;
  --dialog-body-duration: 200ms;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 禁止选区/原生拖拽：点击产生的 selection 变更会触发重绘，
     使 header/footer 的 backdrop-filter 对大面积背景重模糊，连续点击可致页面假死 */
  user-select: none;
}

/* 对话框主容器 */
.dialog {
  /* 固定浅色 Windows 风格面板：就地锁定文本 token 为深色文字配色，
     即使页面切到 data-theme="dark"（白字）标题也不会变白 */
  --text-heading: #0f172a;
  --text-heading-shadow: none;
  width: var(--dialog-width);
  border: 2px solid #ccc;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
}

/* 标题栏 */
.dialog-header {
  background-color: rgba(245, 245, 245, 0.618);
  backdrop-filter: blur(8px); /* 还原原图中透出底层UI的效果 */
  text-align: center;
  padding: 16px 0;
  border-bottom: 2px solid #dedede;
  user-select: none;
}

.dialog-header .title {
  font-family: "Arial Narrow", sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--text-heading);
  text-shadow: var(--text-heading-shadow);
}

/* 主体图片区域 */
.dialog-body {
  position: relative;
  width: 100%;
  height: var(--dialog-body-height);
  background: #EEEEEE;
  background: linear-gradient(180deg, rgba(195, 195, 195, 1.0) 0%, rgba(225, 225, 225, 1.0) 10%, rgba(225, 225, 225, 1.0) 90%, rgba(195, 195, 195, 1.0) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height var(--dialog-body-duration) ease;
}

/* 折叠态：渐显完成前高度为 0，默认插槽不渲染 */
.dialog-body--collapsed {
  height: 0;
}

/* 插槽图片禁止原生拖拽，避免拖拽快照与选区重绘 */
.dialog-body :slotted(img) {
  -webkit-user-drag: none;
}

/* 底部操作区 (带毛玻璃半透明效果) */
.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  background: rgba(245, 245, 245, 0.618);
  backdrop-filter: blur(8px); /* 还原原图中透出底层UI的效果 */
  border-top: 2px solid #dedede;
}

/* ---- 显隐过渡：透明度渐显 / 渐隐 ---- */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity var(--dialog-fade-duration) ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>