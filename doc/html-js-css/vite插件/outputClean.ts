import * as path from 'path'
import * as fs from 'fs'
import type {PluginOption} from 'vite'

const {resolve, join} = path
const {existsSync, readdirSync, readFileSync, statSync, unlinkSync, rmdirSync} = fs
// 在vite.config.js 的配置中加入 plugin:[outputClean()]
// 输出新打包内容前，清理打包输出目录的内容。不是直接删除output文件夹，是删除目标目录的入口文件和打包资源文件夹
interface ConfigOptions {
  targetFiles?: string[]
}

function cleanFiles(path: string) {
  if (existsSync(path)) {
    if (statSync(path).isDirectory()) {
      const files = readdirSync(path)
      files.forEach(file => {
        const subPath = join(path, file)
        if (statSync(subPath).isDirectory()) {
          cleanFiles(subPath)
          rmdirSync(subPath)
        } else {
          unlinkSync(subPath)
        }
      })
    } else {
      unlinkSync(path)
    }
  }
}

let cleanPathArr: string[] = []
export default (): PluginOption => ({
  name: 'vite-plugin-clean-out-dir',
  enforce: 'pre',
  apply: 'build',
  config: (userConfig) => {
    const targetDir = resolve(process.cwd(), userConfig?.build?.outDir || '', userConfig?.build?.assetsDir || '')
    let targetEntryHtml = []
    if (userConfig.build?.rollupOptions?.input) {
      targetEntryHtml = Object.values(userConfig.build?.rollupOptions?.input || [])
        .filter(e => !(e && e[1] === ':'))
        .map(e => resolve(process.cwd(), userConfig?.build?.outDir || '', e))
    } else {
      targetEntryHtml = [resolve(process.cwd(), userConfig?.build?.outDir || '', 'index.html')]
    }
    cleanPathArr = [targetDir, ...targetEntryHtml]
    console.log('outputClean plugin clean such paths', cleanPathArr)
    for (let i = 0, len = cleanPathArr.length; i < len; i++) {
      cleanFiles(cleanPathArr[i])
    }
  },
})
