<script setup lang="ts">
import { ref } from 'vue'
import MenuButton from '../components/PopupMenu/MenuButton.vue'
import MenuContainer from '../components/PopupMenu/MenuContainer.vue'
import Popover from '../components/Popover/Popover.vue'
import PopupMenu from '../components/PopupMenu/PopupMenu.vue'

import ConfirmDialog from "../components/Dialog/ConfirmDialog.vue";
import MenuContainerButton from "../components/PopupMenu/MenuContainerButton.vue";
import Input from "../components/Input/Input.vue";
import Checkbox from "../components/Checkbox/Checkbox.vue";
import CheckboxGroup from "../components/Checkbox/CheckboxGroup.vue";
import Radio from "../components/Radio/Radio.vue";
import RadioGroup from "../components/Radio/RadioGroup.vue";
import Select from "../components/Select/Select.vue";
import SelectOption from "../components/Select/SelectOption.vue";
import Button from "../components/Button/Button.vue";
import NumberStepper from "../components/NumberStepper/NumberStepper.vue";

withDefaults(defineProps<{
  /** 容器宽度(px) */
  width?: number
  /** 容器高度(px) */
  height?: number
}>(), {
  width: 1024,
  height: 600
})

const menuVisible = ref(false)
const dialogVisible = ref(false)
const popupMenuVisible = ref(false)
const popupMenuX = ref(0)
const popupMenuY = ref(0)
const query = ref('')
const email = ref('')

const storage = ref('')
const option = ref('')
const applyNow = ref(false)
const agree = ref(false)
/** RadioGroup 单选组选中值 */
const theme = ref('glass')
const themeOptions = [
  { label: 'Default 经典白', value: 'default' },
  { label: 'Sunset Cafe 主题', value: 'glass' },
  { label: 'Neon Cyber 赛博朋克', value: 'cyber' },
  { label: 'Midnight Blue 深海亮蓝', value: 'blue' },
  { label: 'Locked 不可选', value: 'locked', disabled: true },
]
const sync = ref('manual')
const advanced = ref('ultra')
/** CheckboxGroup 多选组选中值 */
const features = ref<string[]>(['cloud'])
/** NumberStepper 示例值 */
const stepperBasic = ref(1)
const stepperDecimal = ref(0.3)
const stepperEmpty = ref<number | undefined>(undefined)
const stepperDisabled = ref(5)
const stepperReadonly = ref(42)
const stepperAtMax = ref(5)

const onMenuOpenClick = (event: MouseEvent) => {
  const {x, y} = event

  popupMenuVisible.value = true
  popupMenuX.value = x
  popupMenuY.value = y
}

const menuItems = [
  {id: 'items', icon: 'i-mdi-shopping-outline', label: 'Items', onClick: () => console.log('click: items')},
  {id: 'skills', icon: 'i-mdi-account', label: 'Skills', onClick: () => console.log('click: skills')},
  {id: 'equipment', icon: 'i-mdi-sword', label: 'Equipment', onClick: () => console.log('click: equipment')},
  {id: 'quests', icon: 'i-mdi-scroll-outline', label: 'Quests', onClick: () => console.log('click: quests')},
  {id: 'map', icon: 'i-mdi-map-outline', label: 'Map', onClick: () => console.log('click: map')},
  {id: 'shop', icon: 'i-mdi-store-outline', label: 'Shop', onClick: () => console.log('click: shop')},
  {id: 'settings', icon: 'i-mdi-cog-outline', label: 'Settings', onClick: () => console.log('click: settings')},
]

/** 弹出菜单项配置 */
const popupMenuItems = [
  {id: 'new', icon: 'i-mdi-file-plus-outline', label: 'New'},
  {id: 'open', icon: 'i-mdi-folder-outline', label: 'Open'},
  {id: 'save', icon: 'i-mdi-content-save-outline', label: 'Save'},
  {id: 'export', icon: 'i-mdi-export-variant', label: 'Export'},
  {id: 'print', icon: 'i-mdi-printer-outline', label: 'Print'},
]
</script>

<template>
  <div
      class="test-view"
      :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div class="flex gap-4 p-4">
      <!-- 默认配色 -->
      <MenuButton icon="i-mono-setting"/>
      <!-- 自定义配色 -->
      <MenuButton
          icon="i-mono-setting"
          bg="#1e293b"
          icon-color="#f59e0b"
          hover-bg="#334155"
          hover-icon-color="#fbbf24"
      />
      <!-- 以 MenuButton 为触发元素的弹出菜单 -->
      <Popover v-model:visible="menuVisible" placement="right">
        <template #trigger>
          <MenuButton icon="i-mono-setting"/>
        </template>
        <template #default="{ placement }">
          <MenuContainer :placement="placement" :items="menuItems" :max-size="200"/>
        </template>
      </Popover>

      <!-- 通用对话框：三段插槽 + 从中间展开的弹入动效 -->
      <MenuButton icon="i-mdi-help-circle-outline" @click="dialogVisible = true"/>

      <!-- 弹出菜单：点击捕获鼠标坐标，菜单在点击位置出现 -->
      <MenuButton icon="i-mdi-menu-open" @click="onMenuOpenClick"/>
      <PopupMenu
          v-model:visible="popupMenuVisible"
          :items="popupMenuItems"
          :x="popupMenuX"
          :y="popupMenuY"
      />

      <MenuContainerButton icon="i-mdi-stopwatch-tick-outline">按钮</MenuContainerButton>

      <Select
        v-model="theme"
        placeholder="请选择主题"
      >
        <SelectOption
          v-for="item in themeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </Select>
    </div>

    <ConfirmDialog v-model:visible="dialogVisible" :show-content-during-animation="true" title="Theme">
      <p>测试</p>
    </ConfirmDialog>

    <div class="flex gap-4 p-4">
      <!-- v-model 双向绑定 -->
      <Input v-model="query" placeholder="搜索..." />

      <!-- 任意原生属性透传 -->
      <Input type="email" pattern="[a-z]+" aria-label="邮箱" />

      <Input v-model="email">
        <template #prepend>
          <span>https://</span>
        </template>
        <template #append>
          <span>.com</span>
        </template>
      </Input>
    </div>

    <div class="flex gap-4 p-4">
      <!-- 独立使用：v-model 双向绑定 + 多选项 -->
      <Radio v-model="storage" value="cloud" label="保存到云端" />
      <Radio v-model="storage" value="local" label="保存到本地" />

      <!-- disabled / readonly / 自定义 aria -->
      <Radio v-model="option" value="a" label="选项 A" disabled aria-describedby="help-text" />
      <Radio v-model="option" value="b" label="选项 B（只读）" readonly />
    </div>

    <div class="flex gap-4 p-4">
      <!-- 单选组：子 Radio 通过注入自动接管，无需逐个绑定 -->
      <RadioGroup v-model="theme" label="界面主题" name="theme">
        <Radio value="glass" label="毛玻璃" />
        <Radio value="neon" label="霓虹" />
        <Radio value="classic" label="经典" disabled />
      </RadioGroup>

      <!-- 横向排列 -->
      <RadioGroup v-model="sync" label="同步频率" name="sync" direction="horizontal">
        <Radio value="realtime" label="实时" />
        <Radio value="manual" label="手动" />
      </RadioGroup>

      <!-- 整组禁用 -->
      <RadioGroup v-model="advanced" label="高级选项" name="advanced" disabled>
        <Radio value="pro" label="专业版" />
        <Radio value="ultra" label="旗舰版" />
      </RadioGroup>
    </div>

    <div class="flex gap-4 p-4">
      <!-- v-model 双向绑定 -->
      <Checkbox v-model="applyNow" label="立即应用"  />

      <!-- disabled / 自定义 aria -->
      <Checkbox v-model="agree" label="同意条款" disabled />
    </div>

    <div class="flex gap-4 p-4">
      <!-- 多选组：子 Checkbox 通过注入自动接管，无需逐个绑定 -->
      <CheckboxGroup v-model="features" label="启用功能" name="features">
        <Checkbox value="cloud" label="云端同步" />
        <Checkbox value="offline" label="离线缓存" />
        <Checkbox value="beta" label="测试版功能" disabled />
      </CheckboxGroup>

      <Button>常规按钮</Button>

      <!-- 主操作高亮按钮 -->
      <Button type="primary">确认保存</Button>

      <!-- 危险/取消按钮 -->
      <Button type="danger">取消</Button>

      <!-- 侧边栏图标按钮 -->
      <Button type="icon" icon="i-mono-setting"/>

      <div>
        <!-- NumberStepper 多态示例 -->
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">基础</span>
          <NumberStepper v-model="stepperBasic" :min="0" :max="10" />
        </div>
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">步长 0.1</span>
          <NumberStepper v-model="stepperDecimal" :min="0" :max="1" :step="0.1" />
        </div>
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">空态</span>
          <NumberStepper v-model="stepperEmpty" :min="1" :max="99" placeholder="未填" />
        </div>
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">禁用</span>
          <NumberStepper v-model="stepperDisabled" disabled />
        </div>
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">只读</span>
          <NumberStepper v-model="stepperReadonly" readonly />
        </div>
        <div class="stepper-demo-row">
          <span class="stepper-demo-label">边界</span>
          <NumberStepper v-model="stepperAtMax" :min="1" :max="5" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-view {
  padding: 24px;
  box-sizing: border-box;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
}

.stepper-demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.stepper-demo-label {
  min-width: 72px;
  font-size: 13px;
  color: var(--text-body);
  text-align: right;
}
</style>
