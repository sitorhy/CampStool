<script setup lang="ts">
import type { StyleValue } from 'vue'

const props = withDefaults(defineProps<{
  /** 徽标文本（如 NEW / HOT），不传则不渲染 */
  tag?: string
  /** 徽标配色：danger 红色（默认）、warning 橙色 */
  tagType?: 'danger' | 'warning'
  /** 徽标内联样式覆盖 */
  tagStyle?: StyleValue
  /** 链接地址；不传且无 to 时点击仅触发 click 事件并阻止默认跳转 */
  href?: string
  /** 路由地址（vue-router RouterLink 的 to） */
  to?: string | Record<string, unknown>
}>(), {
  tagType: 'danger',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const onLinkClick = (event: MouseEvent) => {
  if (!props.href && !props.to) event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <li role="none">
    <component
      :is="to ? 'RouterLink' : 'a'"
      class="sub-menu-link"
      role="menuitem"
      :href="href"
      :to="to"
      @click="onLinkClick"
    >
      <slot />
      <span
        v-if="tag || $slots.tag"
        class="menu-tag"
        :class="tagType === 'warning' ? 'menu-tag--warning' : undefined"
        :style="tagStyle"
      >
        <slot name="tag">{{ tag }}</slot>
      </span>
    </component>
  </li>
</template>

<style scoped>
/* 二级菜单单项 */
.sub-menu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* 二级菜单 Hover 效果：右平移动画 + 蓝色高亮 */
.sub-menu-link:hover {
  color: #ffffff;
  background: rgba(59, 130, 246, 0.5);
  padding-left: 16px;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

/* 徽标 Tag (例如：Hot / New) */
.menu-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.8);
  color: #fff;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
}

.menu-tag--warning {
  background: rgba(245, 158, 11, 0.8);
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.8);
}
</style>
