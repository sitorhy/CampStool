<script setup lang="ts">
import { Divider } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <div class="demo-page">
    <h1>Divider 分割线</h1>
    <p class="page-desc">
      霓虹渐变发光分割线，支持基础横线、带文字横线和竖线三种形态。组件配色面向深色背景，故演示置于深色舞台中。
    </p>

    <DemoBlock title="基础用法" desc="两端淡出、中间天蓝高亮的横向渐变发光线。">
      <div class="divider-stage">
        <p class="stage-text">上方内容区域，用于展示常规文本或卡片元素。</p>
        <Divider />
        <p class="stage-text">下方内容区域，展示基础渐变发光分割线效果。</p>
      </div>
    </DemoBlock>

    <DemoBlock title="带文字" desc="默认插槽内容渲染为居中毛玻璃文字卡片，两侧渐变线条。">
      <div class="divider-stage">
        <Divider>或通过以下方式登录</Divider>
      </div>
    </DemoBlock>

    <DemoBlock title="垂直分割线" desc="direction=vertical 渲染竖线，适合行内操作链接分组。">
      <div class="divider-stage">
        <div class="vertical-container">
          <a href="#" class="action-link" @click.prevent>忘记密码</a>
          <Divider direction="vertical" />
          <a href="#" class="action-link" @click.prevent>注册新账号</a>
          <Divider direction="vertical" />
          <a href="#" class="action-link" @click.prevent>帮助中心</a>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 模拟组件设计稿的深色发光背景 */
.divider-stage {
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
  padding: 24px 28px;
}

.stage-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  margin: 0;
}

.vertical-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.action-link:hover {
  color: #60a5fa;
}
</style>
