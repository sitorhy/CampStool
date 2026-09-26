<script setup lang="ts"></script>

<template>
  <div class="demo-page">
    <h1>Glass UI 组件库</h1>
    <p class="page-desc">
      一套面向导航客户端的玻璃拟态（Glassmorphism）Vue 3 组件库。 从左侧目录选择组件即可查看演示与用法。
    </p>

    <div class="home-grid">
      <p class="home-hint">
        💡 本手册通过 Vite <code>alias</code> 直接引用
        <code>@glass-ui/core</code> 源码运行：修改 core 目录下任一组件，页面会即时热更新（HMR）。
      </p>
    </div>
  </div>
</template>

<style scoped>
.home-grid {
  padding: 20px 22px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.home-hint {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
}

.home-hint code {
  padding: 1px 6px;
  border-radius: 6px;
  background: rgba(31, 41, 51, 0.08);
  font-family: 'JetBrains Mono', Consolas, monospace;
}
</style>
