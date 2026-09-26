<template>
  <ul class="glass-nav-menu">
    <slot />
  </ul>
</template>

<style scoped>
.glass-nav-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(15, 23, 42, 0.45); /* 提升文字层级对比度 */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  list-style: none;
  margin: 0;
}
</style>
