<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const basic = ref(1)
const jumper = ref(1)
const fewButtons = ref(4)
const fixedCount = ref(7)
const disabled = ref(3)
const last = ref(1)

const log = ref<string[]>([])
function onChange(page: number, oldPage: number) {
  log.value.unshift(`第 ${oldPage} 页 → 第 ${page} 页`)
  log.value = log.value.slice(0, 4)
}
</script>

<template>
  <div class="demo-page">
    <h1>Pagination 分页</h1>
    <p class="page-desc">
      v-model 绑定当前页码，页数由 total / pageSize 推导或直接指定；超量页码折叠为省略号，可选快速跳转输入框。
    </p>

    <DemoBlock title="基础用法" desc="96 条 / 每页 10 条，上一页与下一页到达边界自动禁用。">
      <Pagination v-model="basic" :total="96" :page-size="10" />
    </DemoBlock>

    <DemoBlock title="快速跳转" desc="jumper 追加「跳至 N 页」输入框，回车或失焦提交，越界值回弹到当前页。">
      <Pagination v-model="jumper" :total="120" jumper />
    </DemoBlock>

    <DemoBlock title="省略号折叠" desc="pager-count 控制中间页码组的按钮个数（5–13 的奇数）。">
      <div class="demo-col">
        <Pagination v-model="fewButtons" :total="200" :page-size="10" :pager-count="5" />
        <Pagination v-model="fewButtons" :total="200" :page-size="10" :pager-count="11" />
      </div>
    </DemoBlock>

    <DemoBlock title="直接指定页数" desc="page-count 优先于 total / page-size 推导。">
      <Pagination v-model="fixedCount" :page-count="50" :pager-count="7" />
    </DemoBlock>

    <DemoBlock title="禁用" desc="disabled 时整组按钮与跳转输入框均不可交互。">
      <Pagination v-model="disabled" :total="60" disabled jumper />
    </DemoBlock>

    <DemoBlock title="change 事件" desc="change(newPage, oldPage) 记录翻页轨迹。">
      <div class="demo-col">
        <Pagination v-model="last" :total="30" @change="onChange" />
        <ul v-if="log.length" class="change-log">
          <li v-for="(item, index) in log" :key="index">{{ item }}</li>
        </ul>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.change-log {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: rgba(31, 41, 51, 0.7);
}
</style>
