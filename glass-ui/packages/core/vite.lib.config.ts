import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = `${rootDir}src`
const componentsDir = `${srcDir}/components`
const CSS_EXT = '.css'
const STYLE_EXTS = ['.scss', '.sass', '.css']

/** 把绝对路径统一成 `src/...` 形式，便于与 Vite 的 root 相对路径比较 */
function toRelPath(input: string): string {
  const normalized = input.replace(/\\/g, '/')
  const marker = normalized.lastIndexOf('/src/')
  return marker >= 0 ? normalized.slice(marker + 1) : normalized
}

/**
 * 每个含 index.ts 的组件目录就是一个公共子入口（形如 `@glass-ui/core/Button`）。
 * 新增组件只需建目录并补 index.ts，无需改本文件。
 */
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && existsSync(`${componentsDir}/${dirent.name}/index.ts`))
    .map((dirent) => [dirent.name, `${componentsDir}/${dirent.name}/index.ts`]),
)

const entries: Record<string, string> = {
  index: `${srcDir}/index.ts`,
  styles: `${srcDir}/styles/index.ts`,
  ...componentEntries,
}

interface ChunkRef {
  name: string
  fileName: string
  imports: string[]
}

interface CssAsset {
  fileName: string
  source: string
  /** Vite 在 asset.names 中带上的归属 chunk 名 */
  ownerChunk: string
}

/**
 * 把各入口样式合并为自包含的 `es/<Entry>/style.css`。
 *
 * lib 模式下 Vite 按 chunk 产出 CSS 并平铺在 assets 目录，被多个入口共用的组件
 * （如 Dialog 依赖的 MenuButton）样式挂在 shared chunk 上，只取入口自己那份会漏掉
 * 依赖样式，因此沿入口 chunk 的 import 图收集所有可达 chunk 的 CSS。
 *
 * 纯样式入口（如 styles）没有 JS 实体，其 CSS 挂在以源文件命名的独立 chunk 上、
 * import 图到不了它，这类孤儿再按源文件名反查它落在哪个入口目录下归属。
 */
function consolidateEntryCss(): Plugin {
  const entryDirs = Object.entries(entries).map(([name, file]) => ({
    name,
    dir: `${rootDir}${toRelPath(file).replace(/\/[^/]*$/, '')}`,
  }))

  return {
    name: 'glass-ui:consolidate-entry-css',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const chunksByName = new Map<string, ChunkRef>()
      const chunksByFileName = new Map<string, ChunkRef>()
      const cssByChunkName = new Map<string, string>()
      const cssAssets: CssAsset[] = []

      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type === 'chunk') {
          const ref: ChunkRef = { name: item.name, fileName, imports: item.imports ?? [] }
          chunksByName.set(ref.name, ref)
          chunksByFileName.set(ref.fileName, ref)
          continue
        }
        if (!fileName.endsWith(CSS_EXT)) continue
        const ownerChunk = (item.names?.[0] ?? item.name ?? '').slice(0, -CSS_EXT.length)
        const source = String(item.source)
        cssByChunkName.set(ownerChunk, source)
        cssAssets.push({ fileName, source, ownerChunk })
      }

      const collected = new Set<string>()
      const partsByEntry = new Map<string, string[]>()

      for (const entryName of Object.keys(entries)) {
        const entry = chunksByName.get(entryName)
        if (!entry) {
          this.warn(`entry chunk ${entryName} not found`)
          continue
        }
        const parts: string[] = []
        partsByEntry.set(entryName, parts)
        const queue: ChunkRef[] = [entry]
        const visited = new Set<string>([entry.fileName])
        while (queue.length > 0) {
          const chunk = queue.shift()!
          const css = cssByChunkName.get(chunk.name)
          if (css !== undefined) {
            parts.push(css)
            collected.add(chunk.name)
          }
          for (const imported of [...chunk.imports].sort()) {
            const next = chunksByFileName.get(imported)
            if (next && !visited.has(next.fileName)) {
              visited.add(next.fileName)
              queue.push(next)
            }
          }
        }
      }

      for (const asset of cssAssets) {
        if (collected.has(asset.ownerChunk)) continue
        const owner = entryDirs.find((entry) =>
          STYLE_EXTS.some((ext) => existsSync(`${entry.dir}/${asset.ownerChunk}${ext}`)),
        )
        const parts = owner && partsByEntry.get(owner.name)
        if (!parts) {
          this.warn(`css asset ${asset.fileName} could not be attributed to an entry, left in place`)
          continue
        }
        parts.push(asset.source)
        collected.add(asset.ownerChunk)
      }

      for (const [entryName, parts] of partsByEntry) {
        const unique = [...new Set(parts)]
        if (unique.length > 0) {
          this.emitFile({ type: 'asset', fileName: `es/${entryName}/style.css`, source: unique.join('\n') })
        }
      }
      for (const asset of cssAssets) {
        if (collected.has(asset.ownerChunk)) delete bundle[asset.fileName]
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), consolidateEntryCss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (_format, entryName) => (entryName === 'index' ? 'es/index.js' : `es/${entryName}/index.js`),
    },
    rolldownOptions: {
      /** vue 交给消费方提供，避免组件包里重复打包一份运行时 */
      external: (id) => id === 'vue' || id.startsWith('vue/') || id.startsWith('@vue/'),
      output: {
        chunkFileNames: 'es/shared/[name]-[hash].js',
        assetFileNames: 'es/assets/[name]-[hash][extname]',
      },
    },
  },
})
