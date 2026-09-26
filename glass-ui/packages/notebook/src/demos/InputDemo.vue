<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const query = ref('')
const email = ref('')
</script>

<template>
  <div class="demo-page">
    <h1>Input 输入框</h1>
    <p class="page-desc">基础文本输入，支持 v-model 双向绑定、原生属性透传与前后缀插槽。</p>

    <DemoBlock title="双向绑定" desc="v-model 绑定输入内容。">
      <div class="demo-row">
        <Input v-model="query" placeholder="搜索..." />
        <span>当前值：{{ query || '（空）' }}</span>
      </div>
    </DemoBlock>

    <DemoBlock title="原生属性透传" desc="type / pattern / aria-* 等原生属性直接透传到内部 input。">
      <div class="demo-row">
        <Input type="email" pattern="[a-z]+" aria-label="邮箱" placeholder="user@example" />
      </div>
    </DemoBlock>

    <DemoBlock title="前后缀插槽" desc="通过 prepend / append 插槽添加固定前后缀。">
      <div class="demo-row">
        <Input v-model="email" placeholder="name">
          <template #prepend>
            <span>https://</span>
          </template>
          <template #append>
            <span>.com</span>
          </template>
        </Input>
      </div>
    </DemoBlock>
  </div>
</template>
