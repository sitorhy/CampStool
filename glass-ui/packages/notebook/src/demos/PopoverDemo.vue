<script setup lang="ts">
import { ref } from 'vue'
import { Popover, PopoverArrow, MenuButton } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const visible = ref(false)
const placements = ['top', 'right', 'bottom', 'left'] as const
const active = ref<(typeof placements)[number]>('right')
</script>

<template>
  <div class="demo-page">
    <h1>Popover 弹出层</h1>
    <p class="page-desc">
      弹出层容器，支持 12 种 placement、显隐控制与外部点击关闭；面板无装饰，外观由内容决定，内部自动渲染 PopoverArrow 指针箭头。
    </p>

    <DemoBlock title="四个方向" desc="点击触发元素切换弹出方向，箭头始终指向触发元素中心。">
      <div class="pop-stage">
        <Popover v-model:visible="visible" :placement="active">
          <template #trigger>
            <MenuButton icon="i-mono-setting" />
          </template>
          <template #default="{ placement }">
            <div class="pop-panel">我是弹出内容（placement: {{ placement }}）</div>
          </template>
        </Popover>
      </div>
      <div class="demo-row" style="margin-top: 90px">
        <button v-for="p in placements" :key="p" class="seg" :class="{ 'seg--on': active === p }" @click="active = p">
          {{ p }}
        </button>
      </div>
    </DemoBlock>

    <DemoBlock title="指针箭头 PopoverArrow" desc="箭头组件（分割线 + 两端尖角 + 指向三角），通常由 Popover 内部引用。">
      <div class="arrow-stage">
        <div class="pop-panel">内容面板</div>
        <PopoverArrow placement="right" />
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.pop-stage {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.arrow-stage {
  position: relative;
  display: inline-flex;
}

.pop-panel {
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(245, 245, 245, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  color: #1f2933;
  font-size: 13px;
  white-space: nowrap;
}

.seg {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 13px;
}

.seg--on {
  background: rgba(255, 255, 255, 0.75);
  font-weight: 600;
}
</style>
