<template>
  <span v-if="direction === 'vertical'" class="glass-divider-vertical" role="separator"></span>
  <div v-else-if="!!$slots.default" class="glass-divider-with-text" role="separator">
    <span class="divider-text-content">
      <slot></slot>
    </span>
  </div>
  <hr v-else class="glass-divider">
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** 分割线方向 */
  direction?: 'horizontal' | 'vertical'
}>(), {
  direction: 'horizontal',
})
</script>

<style scoped>
/* 1. 基础横向渐变发光分割线 */
.glass-divider {
  width: 100%;
  height: 1.5px;
  border: none;
  margin: 12px 0;
  /* 两端淡出、中间亮白的霓虹渐变 */
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.6) 20%,
          #60a5fa 50%,
          rgba(255, 255, 255, 0.6) 80%,
          rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
}

/* 2. 带文字/图标的分割线容器 */
.glass-divider-with-text {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 12px 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  font-weight: 500;
}

/* 文字两侧的发光线条 */
.glass-divider-with-text::before,
.glass-divider-with-text::after {
  content: "";
  flex: 1;
  height: 1.5px;
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5)
  );
}

.glass-divider-with-text::after {
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.5),
          rgba(255, 255, 255, 0)
  );
}

/* 中间文字卡片 */
.divider-text-content {
  padding: 4px 14px;
  margin: 0 12px;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

/* 3. 垂直分割线 */
.glass-divider-vertical {
  width: 1.5px;
  height: 18px;
  display: inline-block;
  background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.1) 0%,
          #60a5fa 50%,
          rgba(255, 255, 255, 0.1) 100%
  );
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.5);
}
</style>
