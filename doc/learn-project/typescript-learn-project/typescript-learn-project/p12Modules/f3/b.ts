// CommonJS和AMD的环境里都有一个exports变量，这个变量包含了一个模块的所有导出内容。
// CommonJS和AMD的exports都可以被赋值为一个对象, 这种情况下其作用就类似于 es6 语法里的默认导出，即 export default语法了
// 但是 export default 语法并不能兼容CommonJS和AMD的exports
// 为了支持CommonJS和AMD的exports, TypeScript提供了export =语法
// export =语法定义一个模块的导出对象。 这里的对象一词指的是类，接口，命名空间，函数或枚举。
// 必须使用TypeScript的特定语法import module = require("module")来导入此模块。
import a0 from "./a"            //export default导出
console.log('a0',a0);// { something: 1 }
import a = require("./a");      //export default导出
console.log('a',a);//{ default: { something: 1 } }
import a1 = require("./a1");    //export =导出
console.log('a1',a1);//{ t: { something: 1 } }
