<script setup lang="ts">
import { ref } from 'vue'
import { NavMenu, NavItem, NavSubItem } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const activeName = ref('home')
const lastClick = ref('')

function onClick(name: string) {
  activeName.value = name
  lastClick.value = name
}
</script>

<template>
  <div class="demo-page">
    <h1>NavMenu 导航菜单</h1>
    <p class="page-desc">
      毛玻璃横向导航：NavItem 提供 #submenu 插槽时自动渲染下拉箭头，悬停展开二级菜单（纯 CSS 动效）；NavSubItem 支持 NEW / HOT 徽标。
    </p>

    <DemoBlock title="基础用法" desc="点击顶级项切换激活态；悬停「组件库」「主题风格」展开下拉。">
      <div class="nav-demo-stage">
        <NavMenu>
          <NavItem :active="activeName === 'home'" @click="onClick('home')">🏠 首页</NavItem>
          <NavItem :active="activeName === 'components'" @click="onClick('components')">
            🧩 组件库
            <template #submenu>
              <NavSubItem @click="onClick('buttons')">按钮组 (Buttons)</NavSubItem>
              <NavSubItem @click="onClick('select')">下拉选择器 (Select)</NavSubItem>
              <NavSubItem @click="onClick('tabs')">标签页 (Tabs)</NavSubItem>
              <NavSubItem tag="NEW" @click="onClick('pagination')">分页 (Pagination)</NavSubItem>
            </template>
          </NavItem>
          <NavItem :active="activeName === 'theme'" @click="onClick('theme')">
            🎨 主题风格
            <template #submenu>
              <NavSubItem @click="onClick('sunset')">Sunset Cafe 晚霞</NavSubItem>
              <NavSubItem @click="onClick('midnight')">Midnight 深蓝</NavSubItem>
              <NavSubItem tag="HOT" tag-type="warning" @click="onClick('cyberpunk')">Cyberpunk 赛博</NavSubItem>
            </template>
          </NavItem>
          <NavItem :active="activeName === 'design'" @click="onClick('design')">📖 设计规范</NavItem>
        </NavMenu>
      </div>
    </DemoBlock>

    <DemoBlock title="click 事件" desc="顶级项与二级项点击均抛出 click(event)，此处记录最近一次点击。">
      <p class="click-hint">最近点击：{{ lastClick || '（暂无）' }}</p>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 深色渐变舞台：还原设计稿背景，突出毛玻璃质感 */
.nav-demo-stage {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 20px 60px;
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
}

.click-hint {
  margin: 0;
  font-size: 13px;
  color: rgba(31, 41, 51, 0.7);
}
</style>
