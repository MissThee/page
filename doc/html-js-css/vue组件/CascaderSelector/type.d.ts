declare type CascaderSelectorData = {
  id: number,
  name: string,
  children?: CascaderSelectorData[],
  _level?: number,
  _pid?: number,
  _idPath?: number[],
  _namePath?: string[]
}