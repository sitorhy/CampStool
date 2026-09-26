<template>
  <div
    class="glass-card"
    :style="{
      '--card-padding': px(padding, paddingMap),
      '--card-margin': px(margin, marginMap),
      '--card-radius': `${radius}px`,
      '--card-width': width === undefined ? '' : `${width}px`,
    }"
  >
    <!-- 标题头：title / subtitle / extra / header 插槽任一存在时渲染 -->
    <div v-if="hasHeader" class="glass-card-header">
      <slot name="header">
        <div>
          <h3 v-if="title" class="glass-card-title">{{ title }}</h3>
          <p v-if="subtitle" class="glass-card-subtitle">{{ subtitle }}</p>
        </div>
        <slot name="extra"></slot>
      </slot>
    </div>

    <!-- 主体内容 -->
    <div class="glass-card-body">
      <slot></slot>
    </div>

    <!-- 页脚：footer 插槽存在时渲染 -->
    <div v-if="$slots.footer" class="glass-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Spacing = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  /** 标题，置空且无 header 插槽时不渲染标题头 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 圆角(px) */
  radius?: number
  /** 宽度(px)，置空则交由外部 flex/grid 控制 */
  width?: number
  /** 内边距档位或像素值 */
  padding?: Spacing | number
  /** 外边距档位或像素值 */
  margin?: Spacing | number
}>(), {
  title: '',
  subtitle: '',
  radius: 20,
  width: undefined,
  padding: 'md',
  margin: 0,
})

const slots = useSlots()

const hasHeader = computed(() =>
  !!(props.title || props.subtitle || slots.header || slots.extra)
)

const paddingMap: Record<Spacing, number> = { sm: 14, md: 22, lg: 32 }
const marginMap: Record<Spacing, number> = { sm: 8, md: 16, lg: 24 }

function px(value: Spacing | number, fallback: Record<Spacing, number>) {
  return typeof value === 'number' ? `${value}px` : `${fallback[value]}px`
}
</script>

<style scoped>
.glass-card {
  position: relative;
  box-sizing: border-box;
  margin: var(--card-margin);
  width: var(--card-width, 360px);

  display: flex;
  flex-direction: column;

  /* 核心毛玻璃与高光质感 */
  background: radial-gradient(
          circle at 20% 20%,
          rgba(255, 255, 255, 0.22) 0%,
          rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  /* 边框与内影折射 */
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: var(--card-radius);
  box-shadow:
          inset 0 1px 1px rgba(255, 255, 255, 0.6), /* 顶部白亮线 */
          0 12px 32px rgba(0, 0, 0, 0.25);          /* 沉底发光投影 */

  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden; /* 防止内部子元素圆角溢出 */
}

/* 悬停微浮效果 */
.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, 0.8),
          0 16px 40px rgba(0, 0, 0, 0.35),
          0 0 20px rgba(255, 255, 255, 0.15);
}

/* 标题头 */
.glass-card-header {
  padding: var(--card-padding) var(--card-padding) 12px var(--card-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.glass-card-subtitle {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

/* 主体内容 */
.glass-card-body {
  padding: var(--card-padding);
  flex: 1; /* 自动撑开填充高度 */
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
}

/* 页脚 */
.glass-card-footer {
  padding: 12px var(--card-padding) var(--card-padding) var(--card-padding);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(15, 23, 42, 0.15); /* 底部微加深，强化区分度 */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
