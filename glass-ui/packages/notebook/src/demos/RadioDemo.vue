<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const storage = ref('cloud')
const theme = ref('glass')
const sync = ref('manual')
const advanced = ref('ultra')
</script>

<template>
  <div class="demo-page">
    <h1>Radio 单选框</h1>
    <p class="page-desc">独立单选框与单选组，单选组自动接管子项的选中态与整组禁用。</p>

    <DemoBlock title="独立使用" desc="共享同一个 v-model，通过 value 区分选项。">
      <div class="demo-row">
        <Radio v-model="storage" value="cloud" label="保存到云端" />
        <Radio v-model="storage" value="local" label="保存到本地" />
        <Radio v-model="storage" value="none" label="不可选" disabled />
      </div>
    </DemoBlock>

    <DemoBlock title="单选组 · 纵向" desc="RadioGroup 下发选中值，子项无需逐个绑定。">
      <RadioGroup v-model="theme" label="界面主题" name="theme">
        <Radio value="glass" label="毛玻璃" />
        <Radio value="neon" label="霓虹" />
        <Radio value="classic" label="经典" disabled />
      </RadioGroup>
    </DemoBlock>

    <DemoBlock title="横向 / 整组禁用" desc="direction=horizontal 横向排列；disabled 禁用整组。">
      <div class="demo-row">
        <RadioGroup v-model="sync" label="同步频率" name="sync" direction="horizontal">
          <Radio value="realtime" label="实时" />
          <Radio value="manual" label="手动" />
        </RadioGroup>
        <RadioGroup v-model="advanced" label="高级选项" name="advanced" disabled>
          <Radio value="pro" label="专业版" />
          <Radio value="ultra" label="旗舰版" />
        </RadioGroup>
      </div>
    </DemoBlock>
  </div>
</template>
