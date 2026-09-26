<script setup lang="ts">
withDefaults(defineProps<{
  /** 滚动方向 */
  direction?: 'vertical' | 'horizontal' | 'both'
  /** 滚动条粗细(px) */
  thickness?: number
  /** 滑块颜色 */
  thumbColor?: string
  /** 滑块悬停颜色 */
  thumbHoverColor?: string
  /** 轨道颜色 */
  trackColor?: string
  /** 滑块圆角(px) */
  radius?: number
}>(), {
  direction: 'vertical',
  thickness: 6,
  thumbColor: 'rgb(0 0 0 / 0.3)',
  thumbHoverColor: 'rgb(0 0 0 / 0.45)',
  trackColor: 'transparent',
  radius: 3,
})
</script>

<template>
  <div
    class="scroll-container"
    :class="`scroll-container--${direction}`"
    :style="{
      '--scroll-thickness': `${thickness}px`,
      '--scroll-thumb': thumbColor,
      '--scroll-thumb-hover': thumbHoverColor,
      '--scroll-track': trackColor,
      '--scroll-radius': `${radius}px`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-container {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --scroll-thickness: 6px;
  --scroll-thumb: rgb(0 0 0 / 0.3);
  --scroll-thumb-hover: rgb(0 0 0 / 0.45);
  --scroll-track: transparent;
  --scroll-radius: 3px;
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
}

.scroll-container--vertical {
  overflow: hidden auto;
}

.scroll-container--horizontal {
  overflow: auto hidden;
}

.scroll-container--both {
  overflow: auto;
}

/* ---- WebKit ---- */
.scroll-container::-webkit-scrollbar {
  width: var(--scroll-thickness);
  height: var(--scroll-thickness);
}

.scroll-container::-webkit-scrollbar-track {
  background: var(--scroll-track);
  border-radius: var(--scroll-radius);
}

.scroll-container::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb);
  border-radius: var(--scroll-radius);
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--scroll-thumb-hover);
}
</style>
