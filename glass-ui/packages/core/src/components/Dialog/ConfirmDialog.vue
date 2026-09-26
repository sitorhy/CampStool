<template>
  <Dialog
    v-model:visible="dialogVisible"
    :mask-closable="maskClosable"
    :show-content-during-animation="showContentDuringAnimation"
    :width="width"
    :body-height="bodyHeight"
    :fade-duration="fadeDuration"
    :body-duration="bodyDuration"
  >
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <slot>
        <div class="confirm-dialog-content">
          <span v-if="message">{{ message }}</span>
        </div>
      </slot>
    </template>

    <template #footer>
      <div class="confirm-dialog-footer">
        <slot name="footer" :confirm="handleConfirm" :cancel="handleCancel">
          <div v-if="showFooter" class="confirm-dialog-actions">
            <slot name="cancel-btn" :click="handleCancel">
              <MenuButton
                v-if="showCancelButton"
                icon="i-mono-circle"
                bg="#3b82f6"
                :size="28"
                :ring-width="2"
                hover-bg="#2563eb"
                @click="handleCancel"
              />
            </slot>
            <slot name="confirm-btn" :click="handleConfirm">
              <MenuButton
                v-if="showConfirmButton"
                icon="i-mono-cross"
                bg="#ef4444"
                hover-bg="#dc2626"
                :size="28"
                :ring-width="2"
                @click="handleConfirm"
              />
            </slot>
          </div>
        </slot>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from './Dialog.vue'
import MenuButton from '../PopupMenu/MenuButton.vue'

const props = withDefaults(defineProps<{
  /** 是否可见 */
  visible?: boolean
  /** 对话框标题 */
  title?: string
  /** 对话框消息内容 */
  message?: string
  /** 确认按钮文字 */
  confirmButtonText?: string
  /** 取消按钮文字 */
  cancelButtonText?: string
  /** 是否显示取消按钮 */
  showCancelButton?: boolean
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean
  /** 是否显示底部操作区 */
  showFooter?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 动画期间是否显示内容 */
  showContentDuringAnimation?: boolean
  /** 对话框宽度(px) */
  width?: number
  /** 主体区域高度(px) */
  bodyHeight?: number
  /** 显隐渐显/渐隐时长(ms) */
  fadeDuration?: number
  /** 主体区展开过渡时长(ms) */
  bodyDuration?: number
}>(), {
  visible: false,
  title: '确认',
  message: '',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  showCancelButton: true,
  showConfirmButton: true,
  showFooter: true,
  maskClosable: true,
  showContentDuringAnimation: false,
  width: 348,
  bodyHeight: 196,
  fadeDuration: 100,
  bodyDuration: 100,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

const dialogVisible = ref(props.visible)
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

function handleConfirm() {
  emit('confirm')
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.confirm-dialog-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.confirm-dialog-content p {
  margin: 0;
  text-align: center;
}

.confirm-dialog-footer {
  width: 100%;
}

.confirm-dialog-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 24px;
}
</style>
