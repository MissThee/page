declare type CascaderSelectorData = {
  id: number,
  name: string,
  stopClick?:boolean
  children?: CascaderSelectorData[],
  _level?: number,
  _pid?: number,
  _idPath?: number[],
  _namePath?: string[]
}

declare type CascaderSelectorDataInitialed = {
  id: number,
  name: string,
  stopClick?:boolean
  children?: CascaderSelectorDataInitialed[],
  _level: number,
  _pid: number,
  _idPath: number[],
  _namePath: string[]
}