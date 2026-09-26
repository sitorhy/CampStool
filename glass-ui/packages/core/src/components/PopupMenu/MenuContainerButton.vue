<script setup lang="ts">
withDefaults(defineProps<{
  /** 显示文本 */
  label?: string
  /** 图标类名，如 i-mdi-sword；不传则不显示图标徽章 */
  icon?: string
}>(), {
  label: '',
  icon: '',
})
</script>

<template>
  <button type="button" class="button">
    <span v-if="icon" class="button-badge">
      <span class="button-glyph" :class="icon" />
    </span>
    <span class="button-label">
      {{ label }}
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.button {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  border: none;
  font-family: inherit;
  font-weight: 700;
  /* 固定浅色 Windows 风格面板：就地锁定文本 token 为浅色配色，不随页面深浅主题切换 */
  --text-heading: #0f172a;
  --text-body: #334155;
  --text-heading-shadow: none;
  color: var(--text-heading);
  background-color: #f5f5f5;
  cursor: pointer;
  flex: none;
}

.button:hover {
  background-color: #e7e7e7;
}

.button-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #1e293b;
  color: #ffffff;
}

.button-glyph {
  width: 18px;
  height: 18px;
}
</style>
