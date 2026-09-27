import type Tabs from './Tabs.vue'

export { default, default as Tabs } from './Tabs.vue'
export { default as TabPane } from './TabPane.vue'

/** Tabs 组件实例类型：暴露滑块重定位等方法 */
export type TabsInstance = InstanceType<typeof Tabs>
