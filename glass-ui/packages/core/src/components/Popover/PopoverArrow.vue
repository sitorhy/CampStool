<script setup lang="ts">
import { computed } from 'vue'

type Direction = 'top' | 'bottom' | 'left' | 'right'
type Alignment = 'start' | 'end' | 'center'

const props = withDefaults(defineProps<{
  /** 弹出框位置，格式 [方向]-[对齐位置]，决定箭头朝向与分割线拉伸基准 */
  placement?: Direction | `${Direction}-start` | `${Direction}-end`
  /** 分割线高度：数字为固定 px；'auto' 跟随弹出内容的高度/宽度 */
  dividerHeight?: number | 'auto'
  /** 分割线两端等腰三角形的高(px) */
  tipHeight?: number
  /** 指向三角形的底边宽(px) */
  pointerWidth?: number
  /** 指向三角形的高(px，底边到顶点) */
  pointerHeight?: number
  /** 分割线最小高度(px) */
  minDividerHeight?: number
  /** 分割线最大高度(px) */
  maxDividerHeight?: number
  /** 容器两端淡出范围(px) */
  fadeSize?: number
  /** 是否添加投影（跟随裁剪轮廓） */
  shadow?: boolean
  /** 投影颜色 */
  shadowColor?: string
  /** 投影模糊半径(px) */
  shadowBlur?: number
}>(), {
  placement: 'right',
  dividerHeight: 'auto',
  tipHeight: 40,
  pointerWidth: 30,
  pointerHeight: 30,
  minDividerHeight: 0,
  maxDividerHeight: 150,
  fadeSize: 50,
  shadow: true,
  shadowColor: 'rgb(0 0 0 / 0.35)',
  shadowBlur: 1,
})

const direction = computed<Direction>(() => props.placement.split('-')[0] as Direction)
const alignment = computed<Alignment>(() => (props.placement.split('-')[1] as Alignment) ?? 'center')
/* auto 时分割线范围跟随弹出内容，并受最小/最大高度约束 */
const stretch = computed(() => props.dividerHeight === 'auto')
const dividerHeightValue = computed(() => {
  const base = props.dividerHeight === 'auto'
    ? 'var(--popover-panel-cross, 60px)'
    : `${props.dividerHeight}px`
  return `clamp(${props.minDividerHeight}px, ${base}, ${props.maxDividerHeight}px)`
})
</script>

<template>
  <span
    class="popover-arrow"
    :class="[
      `popover-arrow--${direction}`,
      `popover-arrow--${alignment}`,
      { 'popover-arrow--stretch': stretch, 'popover-arrow--no-shadow': !shadow },
    ]"
    :style="{
      '--arrow-divider-height': dividerHeightValue,
      '--arrow-tip-height': `${tipHeight}px`,
      '--arrow-pointer-width': `${pointerWidth}px`,
      '--arrow-pointer-height': `${pointerHeight}px`,
      '--arrow-fade-size': `${fadeSize}px`,
      '--arrow-shadow-color': shadowColor,
      '--arrow-shadow-blur': `${shadowBlur}px`,
    }"
  >
    <i class="popover-arrow-tip popover-arrow-tip--a" />
    <i class="popover-arrow-divider" />
    <i class="popover-arrow-tip popover-arrow-tip--b" />
    <!-- 带孔等腰三角形，孔为镂空 -->
    <i class="popover-arrow-pointer" />
  </span>
</template>

<style scoped>
.popover-arrow {
  /* 独立样式变量，未设置时跟随 Popover 的同名变量 */
  --arrow-color: var(--popover-arrow-bg, #f5f5f5);
  --arrow-divider-width: 3px;
  /* 分割线与弹出内容的距离 */
  --arrow-divider-gap: 3px;
  /* 指向三角形的高（底边到顶点） */
  --arrow-pointer-height: 30px;
  /* 指向三角形的底边宽 */
  --arrow-pointer-width: 30px;
  /* 镂空圆孔直径 */
  --arrow-hole-size: 8px;
  --arrow-divider-height: var(--popover-panel-cross, 60px);
  --arrow-tip-height: 60px;
  /* 容器两端淡出范围 */
  --arrow-fade-size: 10px;
  /* 投影（drop-shadow 跟随 clip-path/mask 后的轮廓） */
  --arrow-shadow-color: rgb(0 0 0 / 0.35);
  --arrow-shadow-blur: 4px;
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 0 var(--arrow-shadow-blur) var(--arrow-shadow-color));
}

.popover-arrow--no-shadow {
  filter: none;
}

.popover-arrow > i {
  position: absolute;
  background-color: var(--arrow-color);
}

/* 容器两端淡出效果 */
.popover-arrow--left,
.popover-arrow--right {
  mask: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--arrow-fade-size),
    #000 calc(100% - var(--arrow-fade-size)),
    transparent 100%
  );
}

.popover-arrow--top,
.popover-arrow--bottom {
  mask: linear-gradient(
    to right,
    transparent 0,
    #000 var(--arrow-fade-size),
    #000 calc(100% - var(--arrow-fade-size)),
    transparent 100%
  );
}

/* ---- right：弹出框在右侧，分割线竖直、指向左 ---- */
.popover-arrow--right {
  left: calc(100% + var(--popover-gap) - var(--arrow-divider-gap));
  top: 50%;
  width: calc(var(--arrow-pointer-height) + var(--arrow-divider-width));
  height: calc(var(--arrow-divider-height) + var(--arrow-tip-height) * 2);
  transform: translate(-100%, -50%);
}

.popover-arrow--right .popover-arrow-divider {
  right: 0;
  top: var(--arrow-tip-height);
  width: var(--arrow-divider-width);
  height: var(--arrow-divider-height);
}

.popover-arrow--right .popover-arrow-tip {
  right: 0;
  width: var(--arrow-divider-width);
  height: var(--arrow-tip-height);
}

.popover-arrow--right .popover-arrow-tip--a {
  top: 0;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.popover-arrow--right .popover-arrow-tip--b {
  bottom: 0;
  clip-path: polygon(50% 100%, 100% 0, 0 0);
}

.popover-arrow--right .popover-arrow-pointer {
  right: 0;
  top: 50%;
  width: 100%;
  height: var(--arrow-pointer-width);
  transform: translateY(-50%);
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
  mask: radial-gradient(
    circle calc(var(--arrow-hole-size) / 2)
    at calc(100% - var(--arrow-divider-width) - var(--arrow-pointer-height) * 0.1) 50%,
    transparent 99%, #000 100%
  );
}

/* ---- left：弹出框在左侧，分割线竖直、指向右 ---- */
.popover-arrow--left {
  left: calc((var(--popover-gap) - var(--arrow-divider-gap)) * -1);
  top: 50%;
  width: calc(var(--arrow-pointer-height) + var(--arrow-divider-width));
  height: calc(var(--arrow-divider-height) + var(--arrow-tip-height) * 2);
  transform: translate(0, -50%);
}

.popover-arrow--left .popover-arrow-divider {
  left: 0;
  top: var(--arrow-tip-height);
  width: var(--arrow-divider-width);
  height: var(--arrow-divider-height);
}

.popover-arrow--left .popover-arrow-tip {
  left: 0;
  width: var(--arrow-divider-width);
  height: var(--arrow-tip-height);
}

.popover-arrow--left .popover-arrow-tip--a {
  top: 0;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.popover-arrow--left .popover-arrow-tip--b {
  bottom: 0;
  clip-path: polygon(50% 100%, 100% 0, 0 0);
}

.popover-arrow--left .popover-arrow-pointer {
  left: 0;
  top: 50%;
  width: 100%;
  height: var(--arrow-pointer-width);
  transform: translateY(-50%);
  clip-path: polygon(100% 50%, 0 0, 0 100%);
  mask: radial-gradient(
    circle calc(var(--arrow-hole-size) / 2)
    at calc(var(--arrow-divider-width) + var(--arrow-pointer-height) * 0.1) 50%,
    transparent 99%, #000 100%
  );
}

/* ---- top：弹出框在上方，分割线水平、指向下 ---- */
.popover-arrow--top {
  left: 50%;
  top: calc(var(--arrow-divider-gap) * -1);
  width: calc(var(--arrow-divider-height) + var(--arrow-tip-height) * 2);
  height: calc(var(--arrow-pointer-height) + var(--arrow-divider-width));
  transform: translate(-50%, -100%);
}

.popover-arrow--top .popover-arrow-divider {
  top: 0;
  left: var(--arrow-tip-height);
  height: var(--arrow-divider-width);
  width: var(--arrow-divider-height);
}

.popover-arrow--top .popover-arrow-tip {
  top: 0;
  height: var(--arrow-divider-width);
  width: var(--arrow-tip-height);
}

.popover-arrow--top .popover-arrow-tip--a {
  left: 0;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}

.popover-arrow--top .popover-arrow-tip--b {
  right: 0;
  clip-path: polygon(100% 50%, 0 0, 0 100%);
}

.popover-arrow--top .popover-arrow-pointer {
  top: 0;
  left: 50%;
  height: 100%;
  width: var(--arrow-pointer-width);
  transform: translateX(-50%);
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  mask: radial-gradient(
    circle calc(var(--arrow-hole-size) / 2)
    at 50% calc(var(--arrow-divider-width) + var(--arrow-pointer-height) * 0.1),
    transparent 99%, #000 100%
  );
}

/* ---- bottom：弹出框在下方，分割线水平、指向上 ---- */
.popover-arrow--bottom {
  left: 50%;
  top: calc(100% + var(--popover-gap) - var(--arrow-divider-gap));
  width: calc(var(--arrow-divider-height) + var(--arrow-tip-height) * 2);
  height: calc(var(--arrow-pointer-height) + var(--arrow-divider-width));
  transform: translate(-50%, -100%);
}

.popover-arrow--bottom .popover-arrow-divider {
  bottom: 0;
  left: var(--arrow-tip-height);
  height: var(--arrow-divider-width);
  width: var(--arrow-divider-height);
}

.popover-arrow--bottom .popover-arrow-tip {
  bottom: 0;
  height: var(--arrow-divider-width);
  width: var(--arrow-tip-height);
}

.popover-arrow--bottom .popover-arrow-tip--a {
  left: 0;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}

.popover-arrow--bottom .popover-arrow-tip--b {
  right: 0;
  clip-path: polygon(100% 50%, 0 0, 0 100%);
}

.popover-arrow--bottom .popover-arrow-pointer {
  bottom: 0;
  left: 50%;
  height: 100%;
  width: var(--arrow-pointer-width);
  transform: translateX(-50%);
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
  mask: radial-gradient(
    circle calc(var(--arrow-hole-size) / 2)
    at 50% calc(100% - var(--arrow-divider-width) - var(--arrow-pointer-height) * 0.1),
    transparent 99%, #000 100%
  );
}

/* ---- stretch：分割线跟随弹出内容范围，start/end 对齐时跟随面板边缘 ---- */
.popover-arrow--right.popover-arrow--stretch.popover-arrow--start {
  top: calc(var(--arrow-tip-height) * -1);
  transform: translate(-100%, 0);
}

.popover-arrow--right.popover-arrow--stretch.popover-arrow--end {
  top: auto;
  bottom: calc(var(--arrow-tip-height) * -1);
  transform: translate(-100%, 0);
}

.popover-arrow--left.popover-arrow--stretch.popover-arrow--start {
  top: calc(var(--arrow-tip-height) * -1);
  transform: translate(0, 0);
}

.popover-arrow--left.popover-arrow--stretch.popover-arrow--end {
  top: auto;
  bottom: calc(var(--arrow-tip-height) * -1);
  transform: translate(0, 0);
}

.popover-arrow--top.popover-arrow--stretch.popover-arrow--start,
.popover-arrow--bottom.popover-arrow--stretch.popover-arrow--start {
  left: calc(var(--arrow-tip-height) * -1);
  transform: translate(0, -100%);
}

.popover-arrow--top.popover-arrow--stretch.popover-arrow--end,
.popover-arrow--bottom.popover-arrow--stretch.popover-arrow--end {
  left: auto;
  right: calc(var(--arrow-tip-height) * -1);
  transform: translate(0, -100%);
}
</style>
