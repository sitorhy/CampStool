<script setup lang="ts">
withDefaults(defineProps<{
  /** 图标类名，如 i-mono-setting */
  icon: string
  /** 卡盘基底色（双层主题共用），外环 / 光晕由此色派生 */
  bg?: string
  /** 图标颜色 */
  iconColor?: string
  /** 悬停时卡盘底色 */
  hoverBg?: string
  /** 悬停时图标颜色 */
  hoverIconColor?: string
  /** 外围同心副环与主环的间距(px)，对应 outline-offset */
  gap?: number
  /** 是否显示外围副环（outline 轨道） */
  ring?: boolean
  /** 卡盘直径(px) */
  size?: number
  /** 图标尺寸(px) */
  iconSize?: number
  /** 主环粗细(px) */
  ringWidth?: number
}>(), {
  bg: '#f59e0b',
  iconColor: '#ffffff',
  hoverBg: '#d97706',
  hoverIconColor: '#ffffff',
  gap: 4,
  ring: true,
  size: 56,
  iconSize: 22,
  ringWidth: 1.5,
})
</script>

<template>
  <button
    type="button"
    class="glass-menu-btn"
    :class="{ 'glass-menu-btn--no-ring': !ring }"
    :style="{
      '--gmb-bg': bg,
      '--gmb-icon': iconColor,
      '--gmb-bg-hover': hoverBg,
      '--gmb-icon-hover': hoverIconColor,
      '--gmb-gap': `${gap}px`,
      '--gmb-size': `${size}px`,
      '--gmb-icon-size': `${iconSize}px`,
      '--gmb-ring-width': `${ringWidth}px`,
    }"
  >
    <span class="glass-menu-btn-inner">
      <span class="glass-menu-btn-icon" :class="icon" />
    </span>
  </button>
</template>

<style scoped>
.glass-menu-btn {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --gmb-bg: #f59e0b;
  --gmb-icon: #ffffff;
  --gmb-bg-hover: #d97706;
  --gmb-icon-hover: #ffffff;
  --gmb-gap: 4px;
  --gmb-size: 56px;
  --gmb-icon-size: 22px;
  --gmb-ring-width: 1.5px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  outline: none;
  user-select: none;

  /* 第一重主环：半透明高光，颜色自主色派生 */
  border: var(--gmb-ring-width) solid color-mix(in srgb, var(--gmb-bg) 65%, transparent);

  /* 主色光晕 */
  box-shadow: 0 0 12px color-mix(in srgb, var(--gmb-bg) 45%, transparent);
  /* 第二重同心副环：outline + offset 轨道 */
  outline: var(--gmb-ring-width) solid color-mix(in srgb, var(--gmb-bg) 28%, transparent);
  outline-offset: var(--gmb-gap);

  transition: all 0.32s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 内部水晶玻璃卡盘：径向高光渐变 + 内阴影立体折射 */
.glass-menu-btn-inner {
  width: var(--gmb-size);
  height: var(--gmb-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* mono 图标为 currentColor，颜色随 color 变化 */
  color: var(--gmb-icon);
  background-color: var(--gmb-bg);
  background-image: radial-gradient(
          circle at 30% 30%,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 100%
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.glass-menu-btn-icon {
  width: var(--gmb-icon-size);
  height: var(--gmb-icon-size);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  transition: all 0.3s ease;
}

/* 悬停：上浮放大、光晕扩展、副环外推 */
.glass-menu-btn:hover {
  transform: translateY(-3px) scale(1.05);
  border-color: color-mix(in srgb, var(--gmb-bg) 85%, white);
  outline-color: color-mix(in srgb, var(--gmb-bg) 45%, transparent);
  outline-offset: calc(var(--gmb-gap) + 2px);
  box-shadow: 0 0 20px color-mix(in srgb, var(--gmb-bg) 75%, transparent);
}

.glass-menu-btn:hover .glass-menu-btn-inner {
  background-color: var(--gmb-bg-hover);
  color: var(--gmb-icon-hover);
}

.glass-menu-btn:hover .glass-menu-btn-icon {
  transform: scale(1.1);
}

/* 点击按压：缩回凹陷反馈 */
.glass-menu-btn:active {
  transform: translateY(0) scale(0.95);
  outline-offset: calc(var(--gmb-gap) - 2px);
  box-shadow: 0 0 10px color-mix(in srgb, var(--gmb-bg) 40%, transparent);
}

/* 不显示副环时去掉 outline 轨道 */
.glass-menu-btn--no-ring {
  outline: none;
}
</style>
