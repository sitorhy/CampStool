<script setup lang="ts">
import { ref } from 'vue'
import { TabPane, Tabs } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const basic = ref('general')

const dynamicTabs = ref([
  { name: 'tab1', label: '动态标签 1' },
  { name: 'tab2', label: '动态标签 2' },
])
const dynamicActive = ref('tab1')
let seq = 2
function addTab() {
  seq += 1
  const name = `tab${seq}`
  dynamicTabs.value.push({ name, label: `动态标签 ${seq}` })
  dynamicActive.value = name
}
function removeTab(name: string | number) {
  const index = dynamicTabs.value.findIndex((t) => t.name === name)
  if (index === -1) return
  dynamicTabs.value.splice(index, 1)
}
</script>

<template>
  <div class="demo-page">
    <h1>Tabs 标签页</h1>
    <p class="page-desc">
      Tabs + TabPane 组合，光晕滑块随选中项滑动；支持禁用、可关闭、动态增删、键盘左右方向键切换。
    </p>

    <DemoBlock title="基础用法" desc="v-model 绑定激活面板 name，缺省时自动激活第一个可用面板。">
      <Tabs v-model="basic" style="max-width: 480px">
        <TabPane name="general" label="常规设置">
          包含系统基础偏好、画面分辨率与显示模式设置。
        </TabPane>
        <TabPane name="sound" label="声音风格">
          音频输出设备选择、背景音乐音量与音效均衡器调节。
        </TabPane>
        <TabPane name="advanced" label="高级选项">
          开发者选项、网络延迟优化与缓存清理。
        </TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock title="禁用 / 等分宽度" desc="TabPane 传 disabled 禁用标签；stretch 让标签等分导航条宽度。">
      <Tabs v-model="basic" stretch style="max-width: 480px">
        <TabPane name="general" label="常规设置">常规设置内容区。</TabPane>
        <TabPane name="sound" label="声音风格">声音风格内容区。</TabPane>
        <TabPane name="advanced" label="高级选项">高级选项内容区。</TabPane>
        <TabPane name="lab" label="实验室（禁用）" disabled>不可用内容区。</TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock title="自定义标签插槽" desc="TabPane 的 #label 插槽内容会渲染进导航标签，可放图标等节点。">
      <Tabs v-model="basic" style="max-width: 480px">
        <TabPane name="general">
          <template #label>⚙ 常规设置</template>
          自定义标签渲染的内容区。
        </TabPane>
        <TabPane name="sound">
          <template #label>♪ 声音风格</template>
          声音风格内容区。
        </TabPane>
        <TabPane name="advanced">
          <template #label>★ 高级选项</template>
          高级选项内容区。
        </TabPane>
      </Tabs>
    </DemoBlock>

    <DemoBlock title="动态增删" desc="closable 标签悬停显示关闭按钮；addable 在末尾追加新增按钮。">
      <Tabs v-model="dynamicActive" addable style="max-width: 560px" @tab-add="addTab" @tab-remove="removeTab">
        <TabPane
          v-for="tab in dynamicTabs"
          :key="tab.name"
          :name="tab.name"
          :label="tab.label"
          closable
        >
          {{ tab.label }} 的内容区域。
        </TabPane>
      </Tabs>
    </DemoBlock>
  </div>
</template>
