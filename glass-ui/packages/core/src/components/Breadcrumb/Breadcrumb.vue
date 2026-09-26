<template>
  <nav>
    <ol class="glass-breadcrumb">
      <slot></slot>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

const props = withDefaults(defineProps<{
  /** 分隔符字符，子项可通过自身的 separator 覆盖 */
  separator?: string
}>(), {
  separator: '/',
})

provide('breadcrumb-separator', computed(() => props.separator))
</script>

<style scoped>
/* 面包屑外层容器 */
.glass-breadcrumb {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(15, 23, 42, 0.35); /* 略微加深底色以提高路径文字层级 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15);
  list-style: none;
  margin: 0;
  user-select: none;
}

/* 末项无需尾部分隔符 */
.glass-breadcrumb > :last-child :deep(.breadcrumb-separator) {
  display: none;
}
</style>
