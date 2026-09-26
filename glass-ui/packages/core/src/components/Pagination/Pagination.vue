<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/** 页码条渲染项：数字按钮或省略号占位 */
type PagerItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; side: 'left' | 'right' }

const props = withDefaults(defineProps<{
  /** 当前页码，支持 v-model；越界时按 [1, totalPages] 夹取 */
  modelValue?: number
  /** 总条目数，与 pageSize 一起推导总页数 */
  total?: number
  /** 每页条目数 */
  pageSize?: number
  /** 显式总页数；提供时优先于 total / pageSize 推导 */
  pageCount?: number
  /** 中间页码组的按钮个数，取 5-13 的奇数 */
  pagerCount?: number
  /** 是否禁用整个分页条 */
  disabled?: boolean
  /** 是否显示「跳至 N 页」输入框 */
  jumper?: boolean
}>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  pageCount: undefined,
  pagerCount: 7,
  disabled: false,
  jumper: false,
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number, oldPage: number]
}>()

/** 总页数：显式 pageCount 优先，否则按条目数推导，且至少保留 1 页 */
const totalPages = computed(() => {
  if (props.pageCount !== undefined) return Math.max(1, Math.floor(props.pageCount))
  const size = props.pageSize > 0 ? props.pageSize : 1
  return Math.max(1, Math.ceil(Math.max(0, props.total) / size))
})

/** 生效的页码组容量：夹到 [5, 13] 并强制奇数，偶数会让中间窗口左右不对称 */
const effectivePagerCount = computed(() => {
  const raw = Math.max(5, Math.min(13, Math.trunc(props.pagerCount) || 7))
  return raw % 2 === 0 ? Math.min(13, raw + 1) : raw
})

/** 夹取后的当前页，模板与交互一律以此为准 */
const activePage = computed(() => clampPage(props.modelValue))

function clampPage(page: number): number {
  const raw = Number.isFinite(page) ? Math.trunc(page) : 1
  return Math.min(Math.max(raw, 1), totalPages.value)
}

/**
 * 页码组布局（与 pagerCount 语义一致：数字按钮总数 = pagerCount，省略号额外占位）
 * 1 … c-2 c-1 c c+1 c+2 … N  /  靠边时折叠为一侧省略号
 */
const pagerItems = computed<PagerItem[]>(() => {
  const total = totalPages.value
  const count = effectivePagerCount.value
  const current = activePage.value

  if (total <= count) return buildRange(1, total)

  const radius = Math.floor((count - 2) / 2)
  /** 距首/尾多少页以内进入「靠边折叠」分支 */
  const boundary = radius + 2
  const ellipsis = (side: 'left' | 'right'): PagerItem => ({ type: 'ellipsis', side })

  if (current <= boundary) {
    return [...buildRange(1, count - 1), ellipsis('left'), { type: 'page', page: total }]
  }
  if (current >= total - boundary) {
    return [{ type: 'page', page: 1 }, ellipsis('right'), ...buildRange(total - count + 2, total)]
  }
  return [
    { type: 'page', page: 1 },
    ellipsis('left'),
    ...buildRange(current - radius, current + radius),
    ellipsis('right'),
    { type: 'page', page: total },
  ]
})

function buildRange(from: number, to: number): PagerItem[] {
  const items: PagerItem[] = []
  for (let page = from; page <= to; page += 1) items.push({ type: 'page', page })
  return items
}

function goto(page: number) {
  if (props.disabled) return
  const target = clampPage(page)
  if (target === activePage.value) return
  emit('update:modelValue', target)
  emit('change', target, activePage.value)
}

const prevDisabled = computed(() => props.disabled || activePage.value <= 1)
const nextDisabled = computed(() => props.disabled || activePage.value >= totalPages.value)

// ==================== 快速跳转 ====================
const jumperFocused = ref(false)
const jumperText = ref(String(activePage.value))

function onJumperInput(event: Event) {
  const target = event.target as HTMLInputElement
  const cleaned = target.value.replace(/\D/g, '')
  if (cleaned !== target.value) target.value = cleaned
  jumperText.value = cleaned
}

/** 回车 / 失焦提交：非法或越界则回弹到当前页 */
function commitJump() {
  const parsed = Number.parseInt(jumperText.value, 10)
  if (!Number.isNaN(parsed)) goto(parsed)
  jumperText.value = String(activePage.value)
}

watch(activePage, (page) => {
  if (!jumperFocused.value) jumperText.value = String(page)
})

// 条目数变化导致总页数收缩时，把页码回正给外部，避免 v-model 悬空
watch(totalPages, () => {
  const clamped = clampPage(props.modelValue)
  if (clamped !== props.modelValue) emit('update:modelValue', clamped)
})
</script>

<template>
  <nav
    class="glass-pagination"
    :class="{ 'is-disabled': disabled }"
    aria-label="分页导航"
  >
    <button
      type="button"
      class="page-btn page-nav"
      aria-label="上一页"
      :disabled="prevDisabled"
      @click="goto(activePage - 1)"
    >‹</button>

    <template v-for="item in pagerItems" :key="item.type === 'page' ? item.page : item.side">
      <span v-if="item.type === 'ellipsis'" class="page-ellipsis" aria-hidden="true">•••</span>
      <button
        v-else
        type="button"
        class="page-btn page-number"
        :class="{ active: item.page === activePage }"
        :aria-current="item.page === activePage ? 'page' : undefined"
        :disabled="disabled"
        @click="goto(item.page)"
      >{{ item.page }}</button>
    </template>

    <button
      type="button"
      class="page-btn page-nav"
      aria-label="下一页"
      :disabled="nextDisabled"
      @click="goto(activePage + 1)"
    >›</button>

    <div v-if="jumper" class="page-jumper">
      <span class="page-jumper-text">跳至</span>
      <input
        class="page-jumper-input"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        aria-label="跳转页码"
        :value="jumperText"
        :disabled="disabled"
        @input="onJumperInput"
        @focus="jumperFocused = true"
        @blur="jumperFocused = false; commitJump()"
        @keydown.enter.prevent="commitJump()"
      />
      <span class="page-jumper-text">页</span>
    </div>
  </nav>
</template>

<style scoped>
/* ================= 分页条容器 ================= */
.glass-pagination {
  /* 表面 token：light 为默认，dark 主题在下方覆盖为设计稿的毛玻璃配色 */
  --pagination-item-bg: rgba(255, 255, 255, 0.7);
  --pagination-item-border: rgba(15, 23, 42, 0.12);
  --pagination-item-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  --pagination-hover-bg: rgba(37, 99, 235, 0.12);
  --pagination-hover-border: rgba(37, 99, 235, 0.45);
  --pagination-hover-color: var(--text-link-hover);
  --pagination-hover-shadow: 0 6px 16px rgba(37, 99, 235, 0.18);
  --pagination-active-bg: rgba(37, 99, 235, 0.9);
  --pagination-active-border: rgba(37, 99, 235, 0.95);
  --pagination-active-shadow: 0 0 14px rgba(37, 99, 235, 0.35);
  --pagination-jumper-input-bg: rgba(255, 255, 255, 0.7);
  --pagination-jumper-input-focus-bg: rgba(255, 255, 255, 0.95);

  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

/* ================= 页码 / 方向按钮 ================= */
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  color: var(--text-body);
  text-shadow: var(--text-heading-shadow);
  background: var(--pagination-item-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid var(--pagination-item-border);
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: var(--pagination-item-shadow);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Hover：变亮并上浮 */
.page-btn:hover:not(:disabled):not(.active) {
  background: var(--pagination-hover-bg);
  border-color: var(--pagination-hover-border);
  color: var(--pagination-hover-color);
  transform: translateY(-2px);
  box-shadow: var(--pagination-hover-shadow);
}

/* 点击按压 */
.page-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
}

/* 当前页：蓝色高亮发光 */
.page-btn.active {
  background: var(--pagination-active-bg);
  border-color: var(--pagination-active-border);
  color: #ffffff;
  font-weight: 600;
  box-shadow: var(--pagination-active-shadow), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  cursor: default;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: var(--pagination-item-border);
  box-shadow: none;
}

/* ================= 省略号 ================= */
.page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 36px;
  color: var(--text-muted);
  font-size: 14px;
  letter-spacing: 2px;
}

/* ================= 快速跳转 ================= */
.page-jumper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.page-jumper-input {
  width: 44px;
  height: 34px;
  padding: 0;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  color: var(--text-body);
  background: var(--pagination-jumper-input-bg);
  border: 1.5px solid var(--pagination-item-border);
  border-radius: 8px;
  outline: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}

/* 擦除原生 number 箭头（上游改用 type=number 时不冲突） */
.page-jumper-input::-webkit-inner-spin-button,
.page-jumper-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.page-jumper-input:focus {
  border-color: var(--pagination-active-border);
  background: var(--pagination-jumper-input-focus-bg);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
}

.page-jumper-input:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ================= 整组禁用 ================= */
.glass-pagination.is-disabled {
  opacity: 0.6;
}

/* ================= 深色/毛玻璃主题：设计稿原始配色 ================= */
[data-theme='dark'] .glass-pagination {
  --pagination-item-bg: rgba(255, 255, 255, 0.2);
  --pagination-item-border: rgba(255, 255, 255, 0.5);
  --pagination-item-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --pagination-hover-bg: rgba(255, 255, 255, 0.35);
  --pagination-hover-border: rgba(255, 255, 255, 0.85);
  --pagination-hover-color: #ffffff;
  --pagination-hover-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 0 10px rgba(255, 255, 255, 0.3);
  --pagination-active-bg: rgba(59, 130, 246, 0.75);
  --pagination-active-border: #60a5fa;
  --pagination-active-shadow: 0 0 14px rgba(59, 130, 246, 0.8);
  --pagination-jumper-input-bg: rgba(255, 255, 255, 0.18);
  --pagination-jumper-input-focus-bg: rgba(255, 255, 255, 0.3);
}
</style>
