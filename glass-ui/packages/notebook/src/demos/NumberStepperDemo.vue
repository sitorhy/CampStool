<script setup lang="ts">
import { ref } from 'vue'
import { NumberStepper } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const basic = ref(1)
const decimal = ref(0.3)
const empty = ref<number | undefined>(undefined)
const disabled = ref(5)
const readonly = ref(42)
const atMax = ref(5)
</script>

<template>
  <div class="demo-page">
    <h1>NumberStepper 数字步进器</h1>
    <p class="page-desc">支持 min/max/step、精度自动推导、长按连击、键盘上下键与边界禁用。</p>

    <DemoBlock title="多种形态" desc="覆盖整数、小数步长、空态、禁用、只读与边界场景。">
      <div class="demo-col">
        <div class="stepper-row"><span class="stepper-label">基础 0-10</span><NumberStepper v-model="basic" :min="0" :max="10" /></div>
        <div class="stepper-row"><span class="stepper-label">步长 0.1</span><NumberStepper v-model="decimal" :min="0" :max="1" :step="0.1" /></div>
        <div class="stepper-row"><span class="stepper-label">空态</span><NumberStepper v-model="empty" :min="1" :max="99" placeholder="未填" /></div>
        <div class="stepper-row"><span class="stepper-label">禁用</span><NumberStepper v-model="disabled" disabled /></div>
        <div class="stepper-row"><span class="stepper-label">只读</span><NumberStepper v-model="readonly" readonly /></div>
        <div class="stepper-row"><span class="stepper-label">边界</span><NumberStepper v-model="atMax" :min="1" :max="5" /></div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.stepper-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stepper-label {
  width: 96px;
  font-size: 13px;
  color: rgba(31, 41, 51, 0.7);
}
</style>
