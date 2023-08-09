import * as Assets from "./assets";

// 固定配置
export const fontSizeList = [
    {key: '', name: '默认'},
    {key: '34px', name: '34px'},
    {key: '30px', name: '30px'},
    {key: '26px', name: '26px'},
    {key: '22px', name: '22px'},
    {key: '18px', name: '18px'},
]
export const alignList = [
    {key: 'center', icon: Assets.alignCenter},
    {key: 'left', icon: Assets.alignLeft},
    {key: 'right', icon: Assets.alignRight},
    {key: 'justify', icon: Assets.alignJustify},
];
export const styleList = [
    {key: 'bold', icon: Assets.styleBold},
    {key: 'italic', icon: Assets.styleItalic},
    {key: 'underline', icon: Assets.styleUnderline},
    {key: 'through', icon: Assets.styleLineThrough},
]
export const listTypeList = [
    {key: 'ol', icon: Assets.indexOrdered},
    {key: 'ul', icon: Assets.indexUnordered},
]
export const colorPreset = [
    ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'],
    ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#1e90ff', '#00ced1', '#c71585'],
    ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff','']
]
