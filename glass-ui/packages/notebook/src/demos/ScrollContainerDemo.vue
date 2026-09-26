<script setup lang="ts">
import { ScrollContainer } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const rows = Array.from({ length: 30 }, (_, i) => `列表行 ${i + 1}`)
</script>

<template>
  <div class="demo-page">
    <h1>ScrollContainer 滚动容器</h1>
    <p class="page-desc">套住任意内容即可获得美化滚动条，可配置方向、粗细与颜色。</p>

    <DemoBlock title="纵向滚动" desc="默认 vertical，自定义滑块颜色与粗细。">
      <ScrollContainer direction="vertical" :thickness="8" thumb-color="rgb(30 41 59 / 0.45)" style="height: 220px">
        <div class="list">
          <div v-for="row in rows" :key="row" class="list__item">{{ row }}</div>
        </div>
      </ScrollContainer>
    </DemoBlock>

    <DemoBlock title="横向滚动" desc="direction=horizontal，内容超宽时出现横向滚动条。">
      <ScrollContainer direction="horizontal" :thickness="10" thumb-color="rgb(30 41 59 / 0.4)">
        <div class="track">
          <div v-for="n in 20" :key="n" class="track__cell">{{ n }}</div>
        </div>
      </ScrollContainer>
    </DemoBlock>
  </div>
</template>

<style scoped>
.list__item {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.track {
  display: flex;
  gap: 12px;
  padding-bottom: 6px;
}

.track__cell {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  font-size: 15px;
  font-weight: 600;
}
</style>
