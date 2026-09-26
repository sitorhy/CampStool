<template>
  <li class="breadcrumb-item" :class="{ current }">
    <a
      v-if="!current"
      class="breadcrumb-link"
      :href="to || undefined"
      @click="onClick"
    >
      <span v-if="icon || $slots.icon" class="breadcrumb-icon">
        <slot name="icon">{{ icon }}</slot>
      </span>
      <slot></slot>
    </a>
    <template v-else>
      <span v-if="icon || $slots.icon" class="breadcrumb-icon">
        <slot name="icon">{{ icon }}</slot>
      </span>
      <slot></slot>
    </template>

    <span class="breadcrumb-separator">{{ displaySeparator }}</span>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'

const props = withDefaults(defineProps<{
  /** 图标字符（emoji / 文本），置空且无 icon 插槽时不显示 */
  icon?: string
  /** 链接地址，置空则渲染无 href 的链接 */
  to?: string
  /** 是否为当前页（终点项，不可点击） */
  current?: boolean
  /** 分隔符，覆盖父级 Breadcrumb 的统一设置 */
  separator?: string
}>(), {
  icon: '',
  to: '',
  current: false,
  separator: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const parentSeparator = inject<ComputedRef<string> | null>('breadcrumb-separator', null)
/** 自身 separator 优先，其次父级 Breadcrumb 统一设置 */
const displaySeparator = computed(() => props.separator ?? parentSeparator?.value ?? '/')

function onClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
/* 面包屑单项 */
.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 13.5px;
}

/* 可点击的路径链接 */
.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 链接 Hover 态：提升透明度、发光并上浮 */
.breadcrumb-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* 当前页（终点项）：天蓝色亮体 + 微弱阴影 */
.breadcrumb-item.current {
  color: #60a5fa;
  font-weight: 600;
  padding: 4px 8px;
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
  cursor: default;
}

/* 分隔符 */
.breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
}

/* 图标调柔 */
.breadcrumb-icon {
  font-size: 14px;
  opacity: 0.85;
}
</style>
