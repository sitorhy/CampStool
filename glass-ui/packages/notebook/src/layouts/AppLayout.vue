<script setup lang="ts">
import SideNav from '../components/SideNav.vue'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <span class="app-header__brand">🫧 Glass&nbsp;UI</span>
      <span class="app-header__subtitle">组件演示手册 · Component Notebook</span>
    </header>

    <div class="app-body">
      <!-- 左侧：组件导航 -->
      <aside class="app-sider">
        <SideNav />
      </aside>

      <!-- 右侧：组件演示 -->
      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(8px);
}

.app-header__brand {
  font-size: 20px;
  font-weight: 700;
}

.app-header__subtitle {
  font-size: 13px;
  color: rgba(31, 41, 51, 0.6);
}

.app-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.app-sider {
  width: 240px;
  flex-shrink: 0;
  padding: 20px 14px;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.45);
}

.app-main {
  flex: 1;
  padding: 28px 36px 60px;
  overflow-y: auto;
}
</style>
