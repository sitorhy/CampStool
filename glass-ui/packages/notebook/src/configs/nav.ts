/** 左侧导航条目 */
export interface NavItem {
  /** 显示名称 */
  label: string
  /** 对应路由 name */
  route: string
}

/** 左侧导航分组 */
export interface NavGroup {
  /** 分组标题 */
  title: string
  items: NavItem[]
}

/** 组件演示导航配置：覆盖 @glass-ui/core 下的全部组件 */
export const navGroups: NavGroup[] = [
  {
    title: 'Basic 基础',
    items: [
      { label: 'Button 按钮', route: 'button' },
      { label: 'Breadcrumb 面包屑', route: 'breadcrumb' },
      { label: 'Divider 分割线', route: 'divider' },
      { label: 'Image 图片', route: 'image' },
      { label: 'Card 卡片', route: 'card' },
      { label: 'Tag 标签', route: 'tag' },
      { label: 'Input 输入框', route: 'input' },
    ],
  },
  {
    title: 'Form 表单',
    items: [
      { label: 'Form 表单', route: 'form' },
      { label: 'Checkbox 复选框', route: 'checkbox' },
      { label: 'Radio 单选框', route: 'radio' },
      { label: 'Select 选择器', route: 'select' },
      { label: 'NumberStepper 步进器', route: 'number-stepper' },
    ],
  },
  {
    title: 'Feedback 反馈',
    items: [
      { label: 'Dialog 对话框', route: 'dialog' },
      { label: 'MessageBox 消息框', route: 'message-box' },
      { label: 'Loading 加载遮罩', route: 'loading' },
    ],
  },
  {
    title: 'Navigation 导航',
    items: [
      { label: 'Popover 弹出层', route: 'popover' },
      { label: 'Menu 菜单族', route: 'menu' },
      { label: 'NavMenu 导航菜单', route: 'nav-menu' },
      { label: 'Tabs 标签页', route: 'tabs' },
      { label: 'Pagination 分页', route: 'pagination' },
      { label: 'ScrollContainer 滚动容器', route: 'scroll-container' },
    ],
  },
]
