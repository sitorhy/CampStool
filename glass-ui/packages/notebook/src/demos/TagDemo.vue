<script setup lang="ts">
import { ref } from 'vue'
import { Tag } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const tags = ref(['Vue.js', 'TypeScript', 'Glass UI'])
</script>

<template>
  <div class="demo-page">
    <h1>Tag 标签</h1>
    <p class="page-desc">
      毛玻璃标签：五种色彩变体、状态圆点、可关闭叉号、炫彩发光与三档尺寸。配色面向深色背景，演示置于深色舞台中。
    </p>

    <DemoBlock title="色彩状态标签" desc="type 指定变体：默认白、blue、green、orange、red。">
      <div class="tag-stage">
        <div class="tag-group">
          <Tag>默认白色</Tag>
          <Tag type="blue">处理中</Tag>
          <Tag type="green">已完成</Tag>
          <Tag type="orange">待审核</Tag>
          <Tag type="red">已拒绝</Tag>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="状态指示圆点" desc="dot 渲染发光小圆点，颜色跟随文字色，适合在线/离线/运行状态。">
      <div class="tag-stage">
        <div class="tag-group">
          <Tag type="green" dot>在线</Tag>
          <Tag type="orange" dot>离开</Tag>
          <Tag type="red" dot>异常</Tag>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="可关闭标签" desc="closable 渲染叉号，点击触发 close 事件，示例中动态移除。">
      <div class="tag-stage">
        <div class="tag-group">
          <Tag
            v-for="item in tags"
            :key="item"
            :type="item === 'Glass UI' ? 'glow' : 'blue'"
            closable
            @close="tags = tags.filter(t => t !== item)"
          >
            {{ item }}
          </Tag>
          <button v-if="!tags.length" class="reset-btn" @click="tags = ['Vue.js', 'TypeScript', 'Glass UI']">
            重新添加
          </button>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="炫彩发光" desc="type=glow 渐变发光，适合 VIP / HOT / 推荐等醒目标识。">
      <div class="tag-stage">
        <div class="tag-group">
          <Tag type="glow">🔥 HOT 热门推荐</Tag>
          <Tag type="glow">PRO 特权</Tag>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="尺寸规范" desc="size 支持 sm / md（默认）/ lg 三档。">
      <div class="tag-stage">
        <div class="tag-group">
          <Tag size="sm" type="blue">Small</Tag>
          <Tag type="blue">Medium</Tag>
          <Tag size="lg" type="blue">Large</Tag>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 模拟组件设计稿的深色发光背景 */
.tag-stage {
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
  padding: 26px 28px;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.reset-btn {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
}
</style>
