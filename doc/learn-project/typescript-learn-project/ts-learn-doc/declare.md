声明文件一般出现于.d.ts文件中，仅是为了声明参数类型，可以让ide分析出各个参数类型

全局变量的声明文件主要有以下几种语法：
```
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明全局对象（含有子属性）
interface 和 type 声明全局类型
```
嵌套的命名空间：
```typescript
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    namespace fn {
        function extend(object: any): void;
    }
}
```
修改已存在的全局变量的声明：
```typescript
declare global {
    interface String {
        hump(input: string): string;
    }
}
```
// 注意: 修改"全局声明"必须在模块内部, 所以至少要有 export{}字样
// 不然会报错❌: 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中
export {}

简单应用
```typescript
// global.d.ts
declare var n: number;
declare let s: string;
declare const o: object;
declare function f(s: string): number;
declare enum dir {
    top,
    right,
    bottom,
    left
}
复制代码声明之后,我们就可以在任意文件中直接操作变量:
n = 321
s = '文字'
let o1 = o;
f('123').toFixed();
dir.bottom.toFixed();

// 报错
n = '312'
s = 123
```
