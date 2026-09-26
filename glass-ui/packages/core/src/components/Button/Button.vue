<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['default', 'primary', 'icon', 'danger'].includes(value)
    }
  },
  icon: {
    type: String,
    default: ''
  }
})

const buttonTypeClassList = computed(() => {
  switch (props.type) {
    case 'primary':
      return [`glass-btn`, `glass-btn-primary`];
    case 'icon':
      return [`glass-btn`, `glass-btn-icon`];
    case 'danger':
      return [`glass-btn`, `glass-btn-danger`];
    default:
      return [`glass-btn`];
  }
});
</script>

<template>
  <button :class="buttonTypeClassList">
    <slot></slot>
    <slot v-if="type === 'icon'">
      <i :class="icon"/>
    </slot>
  </button>
</template>

<style scoped lang="scss">
/* 模拟弹窗面板 */
.glass-panel {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 30px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.title {
  color: var(--text-heading);
  margin: 0 0 10px 0;
  font-size: 18px;
  letter-spacing: 1px;
  text-shadow: var(--text-heading-shadow);
}

.btn-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* ================= 按钮 CSS 规范 ================= */
.glass-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-heading);
  text-shadow: var(--text-heading-shadow);
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(255, 255, 255, 0.4);
}

/* 1. 蓝色高亮主按钮 (匹配弹窗蓝色应用按钮) */
.glass-btn-primary {
  background: rgba(59, 130, 246, 0.4);
  border-color: #60a5fa;
}

.glass-btn-primary:hover {
  background: rgba(59, 130, 246, 0.8);
  border-color: #93c5fd;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.7), inset 0 0 6px rgba(255, 255, 255, 0.3);
}

/* 2. 橙色侧边栏圆按钮 (匹配左侧侧边栏齿轮) */
.glass-btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 152, 0, 0.35);
  border: 2px solid #ffb74d;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.3);
}

.glass-btn-icon:hover {
  background: rgba(255, 152, 0, 0.7);
  border-color: #ffe082;
  box-shadow: 0 0 16px rgba(255, 152, 0, 0.8);
}

/* 3. 红色危险/取消按钮 (匹配弹窗底部的红叉) */
.glass-btn-danger {
  background: rgba(239, 68, 68, 0.35);
  border: 1.5px solid #fca5a5;
}

.glass-btn-danger:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: #f87171;
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.7);
}
</style>