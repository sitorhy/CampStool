<script setup lang="ts">
/**
 * 演示用例容器：标题 + 描述 + 预览区，统一 notebook 内每个示例的外观。
 */
defineProps<{
  /** 示例标题 */
  title: string
  /** 示例说明 */
  desc?: string
}>()
</script>

<template>
  <section class="demo-block">
    <div class="demo-block__head">
      <h3 class="demo-block__title">{{ title }}</h3>
      <p v-if="desc" class="demo-block__desc">{{ desc }}</p>
    </div>
    <div class="demo-block__preview">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.demo-block {
  margin-bottom: 28px;
}

.demo-block__head {
  margin-bottom: 10px;
}

.demo-block__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.demo-block__desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(31, 41, 51, 0.65);
}

.demo-block__preview {
  padding: 28px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
}
</style>
