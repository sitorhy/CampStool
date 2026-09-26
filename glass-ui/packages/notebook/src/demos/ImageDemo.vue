<script setup lang="ts">
import { ref } from 'vue'
import { Button, Image } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const switchSrc = ref('https://picsum.photos/600/400?random=1')

function nextImage() {
  switchSrc.value = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`
}
</script>

<template>
  <div class="demo-page">
    <h1>Image 图片</h1>
    <p class="page-desc">
      毛玻璃图片包装组件：加载占位旋转圈、完成渐现、失败退回卡片、悬停上浮放大与高光扫过、底栏渐变标题。组件配色面向深色背景，演示置于深色舞台中。
    </p>

    <DemoBlock title="正常加载 + 悬浮标题" desc="title / desc 渲染悬停底栏，加载完成后占位淡出、图片渐现。">
      <div class="image-stage">
        <Image
          src="https://picsum.photos/600/400?random=1"
          alt="壁纸"
          title="星海晚霞 (Sunset Beach)"
          desc="尺寸: 1920x1080 • 动漫壁纸画廊"
        />
      </div>
    </DemoBlock>

    <DemoBlock title="加载失败退回" desc="无效地址触发 error 态，展示失败占位卡片，可用 error 插槽自定义。">
      <div class="image-stage">
        <Image src="https://invalid-image-url-test.com/404.jpg" alt="失效图片" />
      </div>
    </DemoBlock>

    <DemoBlock title="切换图源" desc="更换 src 自动回到加载态并重新走占位渐现流程。">
      <div class="image-stage">
        <div class="switch-row">
          <Image :src="switchSrc" alt="随机壁纸" title="随机壁纸" :width="300" :height="200" />
          <Button type="primary" @click="nextImage">换一张</Button>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 模拟组件设计稿的深色发光背景 */
.image-stage {
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  justify-content: center;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 24px;
}
</style>
