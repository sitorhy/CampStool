<script setup lang="ts">
import { ref } from 'vue'
import { Breadcrumb, BreadcrumbItem } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const lastClicked = ref('')

function onNavigate(name: string) {
  lastClicked.value = name
}
</script>

<template>
  <div class="demo-page">
    <h1>Breadcrumb 面包屑</h1>
    <p class="page-desc">毛玻璃路径导航，深色底块凸显路径文字，末项为当前页高亮态。</p>

    <DemoBlock title="标准斜线分隔符 + 图标" desc="icon 传入 emoji 或自定义字符，末项设置 current。">
      <Breadcrumb>
        <BreadcrumbItem icon="🏠" to="#/">首页</BreadcrumbItem>
        <BreadcrumbItem icon="⚙️" to="#/button">设置中心</BreadcrumbItem>
        <BreadcrumbItem to="#/input">界面偏好</BreadcrumbItem>
        <BreadcrumbItem current>毛玻璃主题 (Glassmorphism)</BreadcrumbItem>
      </Breadcrumb>
    </DemoBlock>

    <DemoBlock title="箭头分隔符" desc="通过 separator 更换分隔符字符，无图标即极简样式。">
      <Breadcrumb separator="›">
        <BreadcrumbItem to="#/">工作台</BreadcrumbItem>
        <BreadcrumbItem to="#/button">组件库</BreadcrumbItem>
        <BreadcrumbItem current>面包屑组件 (Breadcrumb)</BreadcrumbItem>
      </Breadcrumb>
    </DemoBlock>

    <DemoBlock title="点击事件" desc="非 current 项点击触发 click 事件，可自行接管路由跳转。">
      <div class="click-demo">
        <Breadcrumb>
          <BreadcrumbItem :to="undefined" @click="onNavigate('home')">首页</BreadcrumbItem>
          <BreadcrumbItem :to="undefined" @click="onNavigate('button')">按钮</BreadcrumbItem>
          <BreadcrumbItem current>当前页</BreadcrumbItem>
        </Breadcrumb>
        <span v-if="lastClicked" class="action-tip">最近点击：{{ lastClicked }}</span>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.click-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-tip {
  font-size: 13px;
  opacity: 0.8;
}
</style>
