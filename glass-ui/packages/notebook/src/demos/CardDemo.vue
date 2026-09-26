<script setup lang="ts">
import { Button, Card } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <div class="demo-page">
    <h1>Card 卡片</h1>
    <p class="page-desc">
      通用毛玻璃卡片容器：标题头与页脚可选，圆角、内外边距可调（sm/md/lg 档位或像素值）。配色面向深色背景，演示置于深色舞台中。
    </p>

    <DemoBlock title="完整形态" desc="title/subtitle 渲染标题头，extra 插槽放右侧元素，footer 插槽渲染页脚。">
      <div class="card-stage">
        <Card title="系统偏好设置" subtitle="定制您的个性化界面主题">
          <template #extra><span class="extra-icon">⚙️</span></template>
          这里是常规卡片的内容区域。通过半透明毛玻璃基底，能够自然透出下方的模糊色彩，同时保持极高的文字可读性。
          <template #footer>
            <Button>重置</Button>
            <Button type="primary">保存修改</Button>
          </template>
        </Card>
      </div>
    </DemoBlock>

    <DemoBlock title="无页脚 + 宽松内边距" desc="不传 footer 插槽即省略页脚；padding=lg 加大内容留白。">
      <div class="card-stage">
        <Card title="公告通知" padding="lg">
          <template #extra><span class="time-text">2小时前</span></template>
          新版本的毛玻璃 UI 组件库已发布，本次更新包含了纯白水晶玻璃按钮以及高度自由调配的通用卡片容器。
        </Card>
      </div>
    </DemoBlock>

    <DemoBlock title="纯 Body 极简卡片" desc="无标题头与页脚，紧凑内边距，适合快捷统计或极简提示。">
      <div class="card-stage">
        <Card padding="sm">
          <div class="mini-body">
            <span class="mini-icon">💎</span>
            <div>
              <div class="mini-title">纯文字卡片</div>
              <div class="mini-desc">适合用于快捷统计面板或极简提示信息。</div>
            </div>
          </div>
        </Card>
      </div>
    </DemoBlock>

    <DemoBlock title="圆角与宽高自定义" desc="radius 调整圆角，width 置空后交由外部布局控制宽度。">
      <div class="card-stage">
        <div class="grid-row">
          <Card :radius="6" :width="220" title="小圆角" padding="sm">radius=6 的近直角风格。</Card>
          <Card :radius="32" :width="220" title="大圆角" padding="sm">radius=32 的圆润胶囊边框。</Card>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
/* 模拟组件设计稿的深色发光背景 */
.card-stage {
  background: linear-gradient(135deg, #1a1c2e 0%, #3a1c38 50%, #0f172a 100%);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  justify-content: center;
}

.grid-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.extra-icon {
  font-size: 18px;
}

.time-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.mini-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-icon {
  font-size: 28px;
}

.mini-title {
  font-weight: 600;
  color: #fff;
}

.mini-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
