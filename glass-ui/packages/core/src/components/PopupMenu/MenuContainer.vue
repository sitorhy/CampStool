<script setup lang="ts">
import { computed } from 'vue'
import ScrollContainer from './ScrollContainer.vue'
import MenuContainerButton from './MenuContainerButton.vue'

interface MenuItem {
  id: string
  icon?: string
  label: string
  onClick?: () => void
}

type Direction = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(defineProps<{
  /** 菜单项配置 */
  items: MenuItem[]
  /** 同 Popover 的 placement，决定菜单流向与淡出方向 */
  placement?: Direction | `${Direction}-start` | `${Direction}-end`
  /** 容器流向最小尺寸(px) */
  minSize?: number
  /** 容器流向最大尺寸(px) */
  maxSize?: number
  /** 容器两端淡出范围(px) */
  fadeSize?: number
}>(), {
  placement: 'right',
  minSize: 0,
  maxSize: 99999,
  fadeSize: 50,
})

/* left/right → 纵向流向（上下淡出），top/bottom → 横向流向（左右淡出），与 PopoverArrow 一致 */
const flow = computed(() => {
  const direction = props.placement.split('-')[0]
  return direction === 'left' || direction === 'right' ? 'vertical' : 'horizontal'
})
</script>

<template>
  <div
    class="menu-container"
    :class="`menu-container--${flow}`"
    :style="{
      '--menu-min-size': `${minSize}px`,
      '--menu-max-size': `${maxSize}px`,
      '--menu-fade-size': `${fadeSize}px`,
    }"
  >
    <ScrollContainer :direction="flow" class="menu-scroller">
      <div class="menu-list">
        <MenuContainerButton
          v-for="item in items"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          @click="item.onClick?.()"
        />
      </div>
    </ScrollContainer>
  </div>
</template>

<style scoped>
.menu-container {
  /* 默认值声明，实际值由 props 内联样式覆盖 */
  --menu-min-size: 0px;
  --menu-max-size: 99999px;
  --menu-fade-size: 10px;
  display: flex;
}

/* 滚动区填满容器并承接溢出，滚动条样式由 ScrollContainer 提供 */
.menu-scroller {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
}

.menu-list {
  display: flex;
  gap: 3px;
  font-family: "Arial Narrow", sans-serif;
}

/* 容器两端淡出，方向与 PopoverArrow 淡出方向一致 */
.menu-container--vertical {
  flex-direction: column;
  min-height: var(--menu-min-size);
  max-height: var(--menu-max-size);
  mask: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--menu-fade-size),
    #000 calc(100% - var(--menu-fade-size)),
    transparent 100%
  );
}

.menu-container--vertical .menu-list {
  flex-direction: column;
}

.menu-container--horizontal {
  flex-direction: row;
  min-width: var(--menu-min-size);
  max-width: var(--menu-max-size);
  mask: linear-gradient(
    to right,
    transparent 0,
    #000 var(--menu-fade-size),
    #000 calc(100% - var(--menu-fade-size)),
    transparent 100%
  );
}

.menu-container--horizontal .menu-list {
  flex-direction: row;
}
</style>
