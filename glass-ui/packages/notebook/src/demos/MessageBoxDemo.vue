<script setup lang="ts">
import { ref } from 'vue'
import { Button, MessageBox } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const basicVisible = ref(false)
const infoVisible = ref(false)
const customVisible = ref(false)
const lastAction = ref('')

function onConfirm() {
  lastAction.value = 'confirm'
}

function onCancel() {
  lastAction.value = 'cancel'
}
</script>

<template>
  <div class="demo-page">
    <h1>MessageBox 消息框</h1>
    <p class="page-desc">
      毛玻璃风格消息确认弹窗，teleport 到 body 居中显示，遮罩渐显、面板回弹缩放，底部复用 Button 组件。
    </p>

    <DemoBlock title="基础用法" desc="默认警告图标与取消 / 确认按钮，点击遮罩或右上角关闭视为取消。">
      <div class="demo-row">
        <Button type="primary" @click="basicVisible = true">弹出 MessageBox</Button>
      </div>
      <MessageBox
        v-model:visible="basicVisible"
        title="系统提示"
        message="您修改的配置参数尚未保存。如果现在离开，未保存的数据将会丢失，是否确认继续操作？"
        confirm-button-text="确认离开"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </DemoBlock>

    <DemoBlock title="自定义图标与信息态" desc="通过 icon 传入任意字符，置空且不用 icon 插槽时隐藏图标块。">
      <div class="demo-row">
        <Button @click="infoVisible = true">信息提示</Button>
      </div>
      <MessageBox
        v-model:visible="infoVisible"
        title="温馨提示"
        icon="💡"
        message="组件演示统一维护在 notebook 子项目中。"
        :show-cancel-button="false"
        confirm-button-text="知道了"
      />
    </DemoBlock>

    <DemoBlock title="插槽自定义内容" desc="默认插槽可放入任意内容，title / icon 插槽支持更丰富的定制。">
      <div class="demo-row">
        <Button type="danger" @click="customVisible = true">自定义内容</Button>
        <span v-if="lastAction" class="action-tip">最近操作：{{ lastAction }}</span>
      </div>
      <MessageBox v-model:visible="customVisible" title="订阅通知" icon="🔔" @confirm="onConfirm" @cancel="onCancel">
        <p class="custom-body">选择需要接收的通知类型：</p>
        <ul class="custom-list">
          <li>版本更新日志</li>
          <li>组件破坏性变更提醒</li>
        </ul>
      </MessageBox>
    </DemoBlock>
  </div>
</template>

<style scoped>
.action-tip {
  font-size: 13px;
  opacity: 0.8;
}

.custom-body {
  margin: 0 0 8px;
}

.custom-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
}
</style>
