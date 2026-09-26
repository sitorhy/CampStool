<template>
  <div
    class="glass-image-wrapper"
    :style="{ width: px(width), height: px(height) }"
  >
    <!-- 加载占位 -->
    <Transition name="image-placeholder-fade">
      <div v-if="status === 'loading'" class="image-placeholder">
        <slot name="placeholder">
          <div class="placeholder-spinner"></div>
          <span class="placeholder-text">{{ loadingText }}</span>
        </slot>
      </div>
    </Transition>

    <!-- 图片主体 -->
    <img
      v-if="status !== 'error'"
      ref="imgRef"
      :src="src"
      :alt="alt"
      class="glass-image"
      :class="{ loaded: status === 'loaded' }"
      @load="status = 'loaded'"
      @error="status = 'error'"
    >

    <!-- 失败退回卡片 -->
    <div v-if="status === 'error'" class="image-error-fallback">
      <slot name="error">
        <span class="error-icon">🖼️</span>
        <span class="error-text">{{ errorText }}</span>
      </slot>
    </div>

    <!-- 悬停渐变信息遮罩 -->
    <div v-if="title || $slots.caption" class="image-caption">
      <slot name="caption">
        <h4 class="caption-title">{{ title }}</h4>
        <p v-if="desc" class="caption-desc">{{ desc }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 图片地址 */
  src?: string
  /** 无障碍替代文本 */
  alt?: string
  /** 容器宽度(px) */
  width?: number
  /** 容器高度(px) */
  height?: number
  /** 悬浮底栏标题，置空且无 caption 插槽时不显示 */
  title?: string
  /** 悬浮底栏描述 */
  desc?: string
  /** 加载占位文案 */
  loadingText?: string
  /** 失败占位文案 */
  errorText?: string
}>(), {
  src: '',
  alt: '',
  width: 300,
  height: 200,
  title: '',
  desc: '',
  loadingText: '加载中...',
  errorText: '图片加载失败',
})

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const imgRef = ref<HTMLImageElement>()

onMounted(() => {
  /* 缓存图可能在监听器挂载前已完成加载，读取 complete 兜底 */
  const img = imgRef.value
  if (img?.complete) status.value = img.naturalWidth > 0 ? 'loaded' : 'error'
})

/* 换源后重置为加载态 */
watch(() => props.src, () => {
  status.value = 'loading'
})

function px(value: number) {
  return `${value}px`
}
</script>

<style scoped>
/* 外层外壳容器 */
.glass-image-wrapper {
  position: relative;
  border-radius: 18px;
  overflow: hidden; /* 裁剪放大的图片与遮罩 */

  /* 毛玻璃边框与浮空投影 */
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  cursor: pointer;
  user-select: none;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 悬停时整个组件上浮并增加深色发光 */
.glass-image-wrapper:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(96, 165, 250, 0.4);
}

/* 真实图片元素 */
.glass-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保证宽高比充盈容器 */
  display: block;
  opacity: 0; /* 默认隐藏，加载完成后渐现 */
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 图片加载完成 */
.glass-image.loaded {
  opacity: 1;
}

/* 悬停时图片缓慢平滑放大 */
.glass-image-wrapper:hover .glass-image.loaded {
  transform: scale(1.1);
}

/* 高光扫过动画 */
.glass-image-wrapper::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 50%;
  height: 200%;
  background: linear-gradient(
          60deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.25) 50%,
          rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(25deg);
  pointer-events: none;
  transition: all 0.6s ease;
  opacity: 0;
}

.glass-image-wrapper:hover::after {
  left: 130%;
  opacity: 1;
}

/* 加载中骨架屏与 Spinner */
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.4);
  z-index: 2;
}

.placeholder-spinner {
  width: 32px;
  height: 32px;
  border: 2.5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.placeholder-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.5px;
}

/* 占位淡出过渡 */
.image-placeholder-fade-leave-active {
  transition: opacity 0.4s ease;
}

.image-placeholder-fade-leave-from,
.image-placeholder-fade-leave-to {
  opacity: 0;
}

/* 图片加载失败占位 */
.image-error-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(20, 25, 40, 0.8);
  color: rgba(255, 255, 255, 0.7);
  z-index: 3;
}

.error-icon {
  font-size: 24px;
  opacity: 0.8;
}

.error-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* 悬停渐变信息遮罩 */
.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 16px 12px 16px;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0) 100%);
  z-index: 4;
  pointer-events: none;

  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.glass-image-wrapper:hover .image-caption {
  transform: translateY(0);
}

.caption-title {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.caption-desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
