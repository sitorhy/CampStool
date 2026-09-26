<script setup lang="ts">
withDefaults(defineProps<{
  /** 图标类名，如 i-mono-setting */
  icon: string
  /** 按钮背景色 */
  bg?: string
  /** 图标颜色 */
  iconColor?: string
  /** 悬停时按钮背景色 */
  hoverBg?: string
  /** 悬停时图标颜色 */
  hoverIconColor?: string
  /** 圆圈与外围圆环的间距(px) */
  gap?: number
  /** 是否显示外围圆环 */
  ring?: boolean
  /** 圆圈直径(px) */
  size?: number
  /** 图标尺寸(px) */
  iconSize?: number
  /** 外围圆环粗细(px) */
  ringWidth?: number
}>(), {
  bg: '#f59e0b',
  iconColor: '#ffffff',
  hoverBg: '#d97706',
  hoverIconColor: '#ffffff',
  gap: 3,
  ring: true,
  size: 40,
  iconSize: 24,
  ringWidth: 2,
})
</script>

<template>
  <button
    type="button"
    class="menu-btn"
    :class="{ 'menu-btn--no-ring': !ring }"
    :style="{
      '--menu-btn-bg': bg,
      '--menu-btn-icon': iconColor,
      '--menu-btn-bg-hover': hoverBg,
      '--menu-btn-icon-hover': hoverIconColor,
      '--menu-btn-gap': `${gap}px`,
      '--menu-btn-size': `${size}px`,
      '--menu-btn-icon-size': `${iconSize}px`,
      '--menu-btn-ring-width': `${ringWidth}px`,
    }"
  >
    <span class="menu-btn-circle">
      <span class="menu-btn-icon" :class="icon" />
    </span>
  </button>
</template>

<style scoped>
.menu-btn {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --menu-btn-bg: #f59e0b;
  --menu-btn-icon: #ffffff;
  --menu-btn-bg-hover: #d97706;
  --menu-btn-icon-hover: #ffffff;
  --menu-btn-gap: 3px;
  --menu-btn-size: 40px;
  --menu-btn-icon-size: 24px;
  --menu-btn-ring-width: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 内边距即圆圈与圆环的间距 */
  padding: var(--menu-btn-gap);
  /* 外围圆环，颜色跟随圆圈背景色 */
  border: var(--menu-btn-ring-width) solid var(--menu-btn-bg);
  border-radius: 50%;
  background-color: transparent;
  /* mono 图标为 currentColor，颜色随 color 变化 */
  color: var(--menu-btn-icon);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.menu-btn:hover {
  border-color: var(--menu-btn-bg-hover);
  color: var(--menu-btn-icon-hover);
}

/* 不显示圆环时去掉边框与间距 */
.menu-btn--no-ring {
  padding: 0;
  border: none;
}

.menu-btn-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--menu-btn-size);
  height: var(--menu-btn-size);
  border-radius: 50%;
  background-color: var(--menu-btn-bg);
  transition: background-color 0.2s ease;
}

.menu-btn:hover .menu-btn-circle {
  background-color: var(--menu-btn-bg-hover);
}

.menu-btn-icon {
  width: var(--menu-btn-icon-size);
  height: var(--menu-btn-icon-size);
}
</style>
