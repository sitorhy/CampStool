<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog, ConfirmDialog } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const dialogVisible = ref(false)
const confirmVisible = ref(false)
</script>

<template>
  <div class="demo-page">
    <h1>Dialog 对话框</h1>
    <p class="page-desc">模态对话框，teleport 到 body 居中显示，支持显隐渐显渐隐与三段式插槽。</p>

    <DemoBlock title="通用对话框 Dialog" desc="默认插槽为内容区，footer 插槽放操作按钮，点击遮罩可关闭。">
      <div class="demo-row">
        <Button type="primary" @click="dialogVisible = true">打开对话框</Button>
      </div>
      <Dialog v-model:visible="dialogVisible" :width="360" :body-height="180">
        <p>这里是对话框内容区域，可放任意自定义内容。</p>
        <template #footer>
          <Button @click="dialogVisible = false">关闭</Button>
        </template>
      </Dialog>
    </DemoBlock>

    <DemoBlock title="确认对话框 ConfirmDialog" desc="带标题与确认 / 取消操作的语义化对话框。">
      <div class="demo-row">
        <Button type="danger" @click="confirmVisible = true">删除条目</Button>
      </div>
      <ConfirmDialog v-model:visible="confirmVisible" title="Confirm">
        <p>确定要删除该条目吗？此操作不可撤销。</p>
      </ConfirmDialog>
    </DemoBlock>
  </div>
</template>
