<script setup lang="ts">
import { useSlots } from 'vue'

const props = withDefaults(defineProps<{
  /** 是否处于选中/激活态 */
  active?: boolean
  /** 链接地址；不传时点击仅触发 click 事件并阻止默认跳转 */
  href?: string
  /** 路由地址（vue-router RouterLink 的 to）；与 href 二选一 */
  to?: string | Record<string, unknown>
}>(), {
  active: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

const onLinkClick = (event: MouseEvent) => {
  if (!props.href && !props.to) event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <li class="nav-menu-item" :class="{ active }">
    <component
      :is="to ? 'RouterLink' : 'a'"
      class="nav-menu-link"
      :href="href"
      :to="to"
      @click="onLinkClick"
    >
      <slot />
      <div v-if="slots.submenu" class="dropdown-arrow" aria-hidden="true"></div>
    </component>
    <!-- 悬停父级项时展开二级菜单（纯 CSS 动效） -->
    <ul v-if="slots.submenu" class="sub-menu" role="menu">
      <slot name="submenu" />
    </ul>
  </li>
</template>

<style scoped>
/* 顶级菜单项 */
.nav-menu-item {
  position: relative;
}

/* 顶级菜单链接按钮 */
.nav-menu-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
  user-select: none;
}

/* 悬停态：背景升亮并带有微闪光 */
.nav-menu-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
}

/* 选中/激活态：发光亮蓝 */
.nav-menu-item.active .nav-menu-link {
  color: #ffffff;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.65);
  border: 1px solid rgba(147, 197, 253, 0.8);
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

/* 含有二级菜单的箭头指示 */
.dropdown-arrow {
  width: 6px;
  height: 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.25s ease;
  margin-left: 2px;
  margin-bottom: 2px;
}

.nav-menu-item:hover .dropdown-arrow {
  transform: rotate(-135deg);
  margin-bottom: -2px;
}

/* 二级下拉子菜单 (Submenu Dropdown) */
.sub-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  min-width: 170px;
  padding: 8px;
  background: rgba(20, 25, 40, 0.75); /* 暗色半透明保证清晰度 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  list-style: none;

  /* 隐藏与显示动效 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.96);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 100;
}

/* 悬停父级项时展开二级菜单 */
.nav-menu-item:hover .sub-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}
</style>
