<script setup lang="ts">
import { Button } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <div class="demo-page">
    <h1>Button 按钮</h1>
    <p class="page-desc">菜单项按钮，支持常规 / 主操作 / 危险 / 图标等多种形态。</p>

    <DemoBlock title="类型 Type" desc="通过 type 指定语义：默认、primary、danger。">
      <div class="demo-row">
        <Button>常规按钮</Button>
        <Button type="primary">确认保存</Button>
        <Button type="danger">取消</Button>
      </div>
    </DemoBlock>

    <DemoBlock title="图标按钮 Icon" desc="type=icon 配合 icon 类名渲染纯图标按钮。">
      <div class="demo-row">
        <Button type="icon" icon="i-mono-setting" />
        <Button type="icon" icon="i-mono-circle" />
        <Button type="icon" icon="i-mono-cross" />
      </div>
    </DemoBlock>
  </div>
</template>
