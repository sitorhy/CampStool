<template>
  <span class="glass-tag" :class="tagClassList">
    <span v-if="dot" class="tag-dot"></span>
    <slot></slot>
    <span v-if="closable" class="tag-close-btn" role="button" title="移除" @click="emit('close')">✕</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TagType = 'default' | 'blue' | 'green' | 'orange' | 'red' | 'glow'
type TagSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  /** 色彩变体：默认白 / 天蓝 / 翡翠绿 / 琥珀橙 / 霓虹红 / 炫彩发光 */
  type?: TagType
  /** 尺寸档位 */
  size?: TagSize
  /** 是否显示状态小圆点（颜色跟随文字色） */
  dot?: boolean
  /** 是否可关闭，点击叉号触发 close 事件 */
  closable?: boolean
}>(), {
  type: 'default',
  size: 'md',
  dot: false,
  closable: false,
})

const emit = defineEmits<{
  close: []
}>()

const tagClassList = computed(() => {
  const classes: string[] = []
  if (props.type !== 'default') classes.push(`tag-${props.type}`)
  if (props.size !== 'md') classes.push(`tag-${props.size}`)
  return classes
})
</script>

<style scoped>
/* 基础 Tag 元素 */
.glass-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  user-select: none;
  box-sizing: border-box;

  /* 核心质感：半透明白光与细高光边框 */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.15);

  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 悬停微动与发光 */
.glass-tag:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 色彩变体 */
.glass-tag.tag-blue {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
  color: #93c5fd;
}
.glass-tag.tag-blue:hover {
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.glass-tag.tag-green {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(52, 211, 153, 0.6);
  color: #6ee7b7;
}
.glass-tag.tag-green:hover {
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.glass-tag.tag-orange {
  background: rgba(245, 158, 11, 0.25);
  border-color: rgba(251, 191, 36, 0.6);
  color: #fde047;
}
.glass-tag.tag-orange:hover {
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
}

.glass-tag.tag-red {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(248, 113, 113, 0.6);
  color: #fca5a5;
}
.glass-tag.tag-red:hover {
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
}

/* 状态小圆点 */
.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

/* 可关闭叉号按钮 */
.tag-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: -2px;
}

.tag-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: scale(1.1);
}

/* 炫彩高亮标签 */
.glass-tag.tag-glow {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%);
  border-color: rgba(244, 114, 182, 0.8);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 0 14px rgba(236, 72, 153, 0.5);
}

/* 尺寸规范 */
.glass-tag.tag-sm {
  height: 22px;
  padding: 0 8px;
  font-size: 11.5px;
  border-radius: 6px;
}

.glass-tag.tag-lg {
  height: 34px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 10px;
}
</style>
