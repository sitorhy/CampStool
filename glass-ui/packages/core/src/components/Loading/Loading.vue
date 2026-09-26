<template>
  <div
    class="glass-loading-mask"
    :class="{ active: visible, 'is-fullscreen': fullscreen }"
    role="alert"
    aria-busy="true"
  >
    <slot>
      <div class="loading-spinner-wrapper">
        <div class="spinner-ring"></div>
        <div class="spinner-ring-inner"></div>
        <div class="spinner-core"></div>
      </div>
    </slot>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** 是否显示遮罩 */
  visible?: boolean
  /** 全屏模式：position fixed 铺满视口 */
  fullscreen?: boolean
  /** 加载文案，置空则不显示 */
  text?: string
}>(), {
  visible: false,
  fullscreen: false,
  text: '资源加载中...',
})
</script>

<style scoped>
/* 遮罩层基底层：局部遮罩依赖父元素相对定位 */
.glass-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

  /* 核心毛玻璃与高暗对比度背景 */
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: inherit; /* 自动继承父元素的圆角 */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 全局遮罩扩展类 */
.glass-loading-mask.is-fullscreen {
  position: fixed;
  border-radius: 0;
}

/* 显隐控制 */
.glass-loading-mask.active {
  opacity: 1;
  visibility: visible;
}

/* 核心双环发光 Spinner：霓虹双轨旋转 */
.loading-spinner-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 外层蓝色轨道弧线条 */
.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #60a5fa;
  border-right-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  animation: spin 1s linear infinite;
}

/* 内层粉紫色反向轨道 */
.spinner-ring-inner {
  position: absolute;
  width: 65%;
  height: 65%;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-bottom-color: #f472b6;
  border-left-color: rgba(244, 114, 182, 0.3);
  box-shadow: 0 0 10px rgba(244, 114, 182, 0.6);
  animation: spin-reverse 0.75s linear infinite;
}

/* 中心发光核心点 */
.spinner-core {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffffff, 0 0 20px #60a5fa;
  animation: pulse 1.5s ease-in-out infinite;
}

/* 加载文字 */
.loading-text {
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}
</style>
