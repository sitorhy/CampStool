import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-wind4'
import {FileSystemIconLoader} from "@iconify/utils/lib/loader/node-loaders";
import {createRemToPxProcessor} from '@unocss/preset-wind4/utils'
import {defineConfig} from 'vite'
import {presetIcons} from "unocss";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        UnoCSS({
            presets: [
                presetIcons({
                    collections: {
                        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
                        // 单色图标库：强制填充 currentColor，可通过 CSS color / text-xxx 控制颜色
                        mono: FileSystemIconLoader(
                            'src/icons/monochrome',
                            (svg: string) => svg
                                // 去掉写死的宽高，交给 CSS 控制尺寸
                                .replace(/\s(width|height)="[^"]*"/g, '')
                                // 把已有的 fill/stroke 颜色统一为 currentColor（none 保留）
                                .replace(/(fill|stroke)="(?!none)[^"]*"/g, '$1="currentColor"')
                                // 若根 svg 没有 fill，则补一个 currentColor，让无颜色的 path 继承
                                .replace(/<svg(?![^>]*\bfill=)/, '<svg fill="currentColor"'),
                        ),
                        // 彩色图标库：原样加载，保留自身配色
                        color: FileSystemIconLoader('src/icons/colorful'),
                    }
                }),
                presetUno({
                    utilityResolver: createRemToPxProcessor()
                })
            ],
        })
    ],
    build: {
        // 本地 demo 站点与库产物分目录，避免互相覆盖（库产物见 vite.lib.config.ts）
        outDir: 'dist-playground',
    },
})
