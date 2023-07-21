export const getNameArrAndSuffixArr = (nameArr: string[]) => {
  // 拆分 名称 和 后缀，分别收集到数组
  const nameSet = new Set()
  const suffixSet = new Set()
  const getNameSuffixStr = (name?: string) => {
    // 获取括号后缀 如： 北区（123）。 获取 {name:'北区',suffix:'（123）'}
    name = name || ''
    const suffixIndex = name.replaceAll('（', '(').replaceAll('）', ')').indexOf('(')
    if (suffixIndex === -1) {
      return {name, suffix: ''}
    } else {
      return {name: name.substring(0, suffixIndex), suffix: name.substring(suffixIndex)}
    }
  }
  nameArr?.forEach(name => {
    const nameObj = getNameSuffixStr(name)
    nameSet.add(nameObj.name)
    suffixSet.add(nameObj.suffix)
  })
  return {
    name: Array.from(nameSet),
    suffix: Array.from(suffixSet)
  }
}