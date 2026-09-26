<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, CheckboxGroup } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const applyNow = ref(false)
const agree = ref(false)
const features = ref<string[]>(['cloud'])
</script>

<template>
  <div class="demo-page">
    <h1>Checkbox 复选框</h1>
    <p class="page-desc">独立复选框与多选组，多选组通过 provide/inject 自动接管子项。</p>

    <DemoBlock title="独立使用" desc="v-model 绑定布尔值。">
      <div class="demo-row">
        <Checkbox v-model="applyNow" label="立即应用" />
        <Checkbox v-model="agree" label="同意条款" disabled />
      </div>
    </DemoBlock>

    <DemoBlock title="多选组 CheckboxGroup" desc="子项声明 value，选中值汇聚为数组。">
      <div class="demo-col">
        <CheckboxGroup v-model="features" label="启用功能" name="features">
          <Checkbox value="cloud" label="云端同步" />
          <Checkbox value="offline" label="离线缓存" />
          <Checkbox value="beta" label="测试版功能" disabled />
        </CheckboxGroup>
        <span>已选：{{ features.join(', ') || '（空）' }}</span>
      </div>
    </DemoBlock>
  </div>
</template>
