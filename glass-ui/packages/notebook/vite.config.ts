import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-wind4'
import { presetIcons } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'
import { defineConfig, type Plugin } from 'vite'

/** core 包源码目录（绝对路径） */
const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url))
/** monorepo 根目录，用于放开 fs 访问 */
const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

/**
 * 将 core 源码目录纳入 dev-server 的文件监听。
 *
 * Vite 默认仅监听自身 root，而 core 组件位于 notebook root 之外，
 * 因此需要显式 add()，这样编辑 core 组件才能触发 notebook 的 HMR。
 */
function watchCoreSource(): Plugin {
  return {
    name: 'glass-ui:watch-core-source',
    configureServer(server) {
      server.watcher.add(coreSrc)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 复刻 core 的 UnoCSS 配置，保证组件的原子类与图标在 notebook 中正常渲染
    UnoCSS({
      presets: [
        presetIcons({
          collections: {
            mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
            // 单色图标：强制 currentColor，颜色由 CSS 控制
            mono: FileSystemIconLoader(
              fileURLToPath(new URL('../core/src/icons/monochrome', import.meta.url)),
              (svg: string) =>
                svg
                  .replace(/\s(width|height)="[^"]*"/g, '')
                  .replace(/(fill|stroke)="(?!none)[^"]*"/g, '$1="currentColor"')
                  .replace(/<svg(?![^>]*\bfill=)/, '<svg fill="currentColor"'),
            ),
            // 彩色图标：原样加载
            color: FileSystemIconLoader(
              fileURLToPath(new URL('../core/src/icons/colorful', import.meta.url)),
            ),
          },
        }),
        presetUno({ utilityResolver: createRemToPxProcessor() }),
      ],
    }),
    watchCoreSource(),
  ],
  resolve: {
    alias: {
      // 开发期直接引用 core 源码（而非打包产物），获得组件级 HMR
      '@glass-ui/core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    // 源码引用的 workspace 包不能被 esbuild 预构建，否则改动不会热更新
    exclude: ['@glass-ui/core'],
  },
  server: {
    port: 5174,
    fs: {
      allow: [repoRoot],
    },
  },
})
