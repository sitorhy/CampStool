<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Button, Loading } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const localVisible = ref(false)
const fullscreenVisible = ref(false)

let localTimer: number | undefined
let fullscreenTimer: number | undefined

/* 模拟加载请求，2.5 秒后自动关闭 */
function showLocalLoading() {
  window.clearTimeout(localTimer)
  localVisible.value = true
  localTimer = window.setTimeout(() => (localVisible.value = false), 2500)
}

function showFullscreenLoading() {
  window.clearTimeout(fullscreenTimer)
  fullscreenVisible.value = true
  fullscreenTimer = window.setTimeout(() => (fullscreenVisible.value = false), 2500)
}

onBeforeUnmount(() => {
  window.clearTimeout(localTimer)
  window.clearTimeout(fullscreenTimer)
})
</script>

<template>
  <div class="demo-page">
    <h1>Loading 加载遮罩</h1>
    <p class="page-desc">
      毛玻璃加载遮罩，霓虹双环反向旋转 Spinner + 脉冲核心点；局部模式依赖父容器相对定位并继承圆角，全屏模式 fixed 铺满视口。
    </p>

    <DemoBlock title="局部遮罩与全屏遮罩" desc="局部遮罩覆盖示例卡片；全屏遮罩 teleport 到 body 覆盖整个视口，2.5 秒后自动关闭。">
      <div class="loading-card">
        <div>
          <h3 class="card-title">数据分析面板</h3>
          <p class="card-desc">点击下方按钮体验卡片局部加载遮罩。</p>
        </div>
        <div class="card-actions">
          <Button type="primary" @click="showLocalLoading">模拟局部加载</Button>
          <Button @click="showFullscreenLoading">模拟全屏加载</Button>
        </div>

        <!-- 局部 Loading 遮罩 -->
        <Loading :visible="localVisible" text="资源加载中..." />
      </div>

      <!-- 全屏 Loading 遮罩 -->
      <Teleport to="body">
        <Loading fullscreen :visible="fullscreenVisible" text="全局资源加载中..." />
      </Teleport>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 示例卡片容器：局部遮罩依赖相对定位 */
.loading-card {
  position: relative;
  width: 380px;
  height: 240px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  overflow: hidden;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.card-actions {
  display: flex;
  gap: 12px;
}
</style>
