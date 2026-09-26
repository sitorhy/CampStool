<script setup lang="ts">
import { ref } from 'vue'
import {
  MenuButton,
  GlassMenuButton,
  MenuContainer,
  MenuContainerButton,
  PopupMenu,
  Popover,
} from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const menuVisible = ref(false)
const popupVisible = ref(false)
const popupX = ref(0)
const popupY = ref(0)

const menuItems = [
  { id: 'items', icon: 'i-mdi-shopping-outline', label: 'Items', onClick: () => console.log('items') },
  { id: 'skills', icon: 'i-mdi-account', label: 'Skills', onClick: () => console.log('skills') },
  { id: 'quests', icon: 'i-mdi-scroll-outline', label: 'Quests', onClick: () => console.log('quests') },
  { id: 'map', icon: 'i-mdi-map-outline', label: 'Map', onClick: () => console.log('map') },
  { id: 'friends', icon: 'i-mdi-account-group-outline', label: 'Friends', onClick: () => console.log('friends') },
  { id: 'settings', icon: 'i-mdi-cog-outline', label: 'Settings', onClick: () => console.log('settings') },
  { id: 'logout', icon: 'i-mdi-power-outline', label: 'Logout', onClick: () => console.log('logout') },
]

const popupItems = [
  { id: 'new', icon: 'i-mdi-file-plus-outline', label: 'New' },
  { id: 'open', icon: 'i-mdi-folder-outline', label: 'Open' },
  { id: 'save', icon: 'i-mdi-content-save-outline', label: 'Save' },
  { id: 'print', icon: 'i-mdi-printer-outline', label: 'Print' },
]

const onContextMenu = (e: MouseEvent) => {
  popupX.value = e.x
  popupY.value = e.y
  popupVisible.value = true
}
</script>

<template>
  <div class="demo-page">
    <h1>Menu 菜单族</h1>
    <p class="page-desc">圆形菜单按钮、配置化菜单容器、菜单容器按钮与坐标弹出菜单的组合演示。</p>

    <DemoBlock title="MenuButton 菜单按钮" desc="默认配色与自定义配色（bg / icon-color / hover-*）。">
      <div class="demo-row">
        <MenuButton icon="i-mono-setting" />
        <MenuButton
          icon="i-mono-setting"
          bg="#1e293b"
          icon-color="#f59e0b"
          hover-bg="#334155"
          hover-icon-color="#fbbf24"
        />
        <MenuButton icon="i-mono-circle" />
        <MenuButton icon="i-mono-cross" />
      </div>
    </DemoBlock>

    <DemoBlock title="GlassMenuButton 质感圆环按钮" desc="同心双环 + 水晶玻璃卡盘的高质感版：主色派生环色与光晕，悬停上浮扩环，按压回缩。配色面向深色背景。">
      <div class="gmb-stage">
        <div class="demo-row">
          <!-- 琥珀橙主题 -->
          <GlassMenuButton icon="i-mono-setting" />
          <!-- 暗夜反色：深蓝盘 + 发光橙图标 -->
          <GlassMenuButton
            icon="i-mono-setting"
            bg="#1e293b"
            icon-color="#fbbf24"
            hover-bg="#334155"
            hover-icon-color="#fde68a"
          />
          <!-- 翡翠绿成功 -->
          <GlassMenuButton icon="i-mono-circle" bg="#34d399" hover-bg="#059669" />
          <!-- 霓虹红危险 -->
          <GlassMenuButton icon="i-mono-cross" bg="#f87171" hover-bg="#dc2626" />
        </div>
        <div class="demo-row">
          <!-- 纯白水晶默认款：蓝黑图标高对比 -->
          <GlassMenuButton
            icon="i-mono-setting"
            bg="rgba(255, 255, 255, 0.4)"
            icon-color="#1e293b"
            hover-bg="rgba(255, 255, 255, 0.7)"
          />
          <GlassMenuButton
            icon="i-mono-circle"
            bg="rgba(255, 255, 255, 0.4)"
            icon-color="#d97706"
            hover-bg="rgba(255, 255, 255, 0.7)"
          />
          <GlassMenuButton
            icon="i-mono-cross"
            bg="rgba(255, 255, 255, 0.4)"
            icon-color="#dc2626"
            hover-bg="rgba(255, 255, 255, 0.7)"
          />
          <!-- 无副环 + 自定义尺寸 -->
          <GlassMenuButton icon="i-mono-setting" :ring="false" :size="40" :icon-size="18" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="MenuContainer 菜单容器" desc="以 MenuButton 触发 Popover，内容区渲染配置化 MenuContainer。">
      <div class="demo-row">
        <Popover v-model:visible="menuVisible" placement="right">
          <template #trigger>
            <MenuButton icon="i-mono-setting" />
          </template>
          <template #default="{ placement }">
            <MenuContainer :placement="placement" :items="menuItems" :max-size="220" />
          </template>
        </Popover>
      </div>
    </DemoBlock>

    <DemoBlock title="MenuContainerButton 容器按钮" desc="图标徽章 + 文本标签的菜单项按钮。">
      <div class="demo-row">
        <MenuContainerButton icon="i-mdi-cog-outline">设置</MenuContainerButton>
        <MenuContainerButton icon="i-mdi-export-variant">导出</MenuContainerButton>
      </div>
    </DemoBlock>

    <DemoBlock title="PopupMenu 坐标弹出菜单" desc="点击下方区域，菜单在鼠标位置弹出。">
      <div class="popup-field" @click="onContextMenu">点击此区域任意位置弹出菜单</div>
      <PopupMenu v-model:visible="popupVisible" :items="popupItems" :x="popupX" :y="popupY" />
    </DemoBlock>
  </div>
</template>

<style scoped>
.popup-field {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.18);
  color: rgba(31, 41, 51, 0.7);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

/* 质感圆环按钮演示台：还原设计稿深色发光背景 */
.gmb-stage {
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.gmb-stage .demo-row {
  display: flex;
  align-items: center;
  gap: 28px;
}
</style>
