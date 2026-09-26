<script setup lang="ts">
import { ref } from 'vue'
import { Select, SelectOption } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const theme = ref('glass')
const themeOptions = [
  { label: 'Default 经典白', value: 'default' },
  { label: 'Sunset Cafe 主题', value: 'glass' },
  { label: 'Neon Cyber 赛博朋克', value: 'cyber' },
  { label: 'Locked 不可选', value: 'locked', disabled: true },
]
</script>

<template>
  <div class="demo-page">
    <h1>Select 选择器</h1>
    <p class="page-desc">
      下拉选择器，选项以子组件 SelectOption 声明（对齐 Element Plus 模式），父级通过 provide/inject 联动。
    </p>

    <DemoBlock title="基础用法" desc="v-model 绑定选中值，placeholder 为占位文本。">
      <div class="demo-row">
        <Select v-model="theme" placeholder="请选择主题" style="width: 240px">
          <SelectOption
            v-for="item in themeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </Select>
        <span>已选：{{ theme }}</span>
      </div>
    </DemoBlock>
  </div>
</template>
