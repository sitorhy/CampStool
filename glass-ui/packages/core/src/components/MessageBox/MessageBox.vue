<template>
  <Teleport to="body">
    <Transition name="glass-msgbox">
      <div v-if="visible" class="glass-msgbox-overlay" @click.self="onMaskClick">
        <div class="glass-msgbox" :style="{ width: `${width}px` }">
          <!-- 顶部标题栏 -->
          <div class="msgbox-header">
            <h4 class="msgbox-title">
              <slot name="title">{{ title }}</slot>
            </h4>
            <button
              v-if="showCloseButton"
              class="msgbox-close-btn"
              type="button"
              title="关闭"
              @click="handleCancel"
            >
              ✕
            </button>
          </div>

          <!-- 内容消息区 -->
          <div class="msgbox-body">
            <div v-if="icon || $slots.icon" class="msgbox-icon">
              <slot name="icon">{{ icon }}</slot>
            </div>
            <div class="msgbox-message">
              <slot>{{ message }}</slot>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div class="msgbox-footer">
            <Button v-if="showCancelButton" @click="handleCancel">
              {{ cancelButtonText }}
            </Button>
            <Button v-if="showConfirmButton" type="primary" @click="handleConfirm">
              {{ confirmButtonText }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '../Button/Button.vue'

const props = withDefaults(defineProps<{
  /** 是否可见，支持 v-model:visible */
  visible?: boolean
  /** 标题 */
  title?: string
  /** 消息正文，也可用默认插槽传入自定义内容 */
  message?: string
  /** 状态图标字符（emoji / 文本），置空且无 icon 插槽时不显示图标块 */
  icon?: string
  /** 确认按钮文字 */
  confirmButtonText?: string
  /** 取消按钮文字 */
  cancelButtonText?: string
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean
  /** 是否显示取消按钮 */
  showCancelButton?: boolean
  /** 是否显示右上角关闭按钮 */
  showCloseButton?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 弹窗宽度(px) */
  width?: number
}>(), {
  visible: false,
  title: '系统提示',
  message: '',
  icon: '⚠️',
  confirmButtonText: '确认',
  cancelButtonText: '取消',
  showConfirmButton: true,
  showCancelButton: true,
  showCloseButton: true,
  maskClosable: true,
  width: 400,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  emit('update:visible', false)
}

function handleConfirm() {
  emit('confirm')
  close()
}

function handleCancel() {
  emit('cancel')
  close()
}

/* 仅点击遮罩自身关闭，点击弹窗本体不触发 */
function onMaskClick() {
  if (props.maskClosable) handleCancel()
}
</script>

<style scoped>
/* 全屏遮罩背景 */
.glass-msgbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 14, 26, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  /* 禁止选区/原生拖拽，避免大面积 backdrop-filter 重模糊导致卡顿 */
  user-select: none;
}

/* 弹窗主体面板 */
.glass-msgbox {
  position: relative;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

/* 顶部 Header */
.msgbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.msgbox-title {
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 右上角关闭按钮 */
.msgbox-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #fca5a5;
  background: rgba(239, 68, 68, 0.35);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  outline: none;
}

.msgbox-close-btn:hover {
  background: rgba(239, 68, 68, 0.85);
  border-color: #f87171;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
  transform: scale(1.08);
}

/* 内容区：图标 + 正文 */
.msgbox-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.msgbox-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(255, 152, 0, 0.35);
  border: 1.5px solid #ffb74d;
  box-shadow: 0 0 12px rgba(255, 152, 0, 0.4);
}

.msgbox-message {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
}

/* 底部按钮组 */
.msgbox-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* ---- 显隐过渡：遮罩渐显渐隐 + 面板回弹缩放 ---- */
.glass-msgbox-overlay {
  transition: opacity 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.glass-msgbox {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-msgbox-enter-from,
.glass-msgbox-leave-to {
  opacity: 0;
}

.glass-msgbox-enter-from .glass-msgbox,
.glass-msgbox-leave-to .glass-msgbox {
  transform: scale(0.85) translateY(20px);
}
</style>
