# 模块化规范
## CommonJs 
+ CommonJs是服务器端模块的规范，Node.js采用了这个规范。
一个单独的文件就是一个模块。每个模块内部，module变量代表当前模块，是一个对象，它的exports属性（即module.exports）约定是对外的接口
加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的exports对象。
```
var math = require('math');
math.add(2, 3);
```
require 是同步的。(像Node.js主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以CommonJS规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD  CMD 解决方案。)

## AMD/CMD规范
+ AMD是RequireJS在推广过程中对模块定义的规范化产出。
+ CMD是SeaJS在推广过程中对模块定义的规范化产出。
对于依赖的模块，AMD是提前执行，CMD是延迟执行。不过 RequireJS从 2.0开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇as lazy as possible.
CMD推崇依赖就近，AMD推崇依赖前置。
```
//CMD
define(function(require, exports, module) {   
   let a = require('./a'); 
   a.doSomething();
   ···
   let b = require('./b'); // 依赖可以就近书写   
   b.doSomething();
   ... 
})

// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { 
  // 依赖必须一开始就写好    
  a.doSomething()   
  ...
  b.doSomething()   
  ...
}) 
```
# 模块引入与导出
+ `import`/`export`
  + ES6规范
+ `require`/`module.exports`
  + CommonJs规范，其中module.exports是一个对象{}
+ 目前所有的引擎都还没有实现import，在node中使用babel支持ES6。也仅仅是将ES6转码为ES5再执行。
  + import语法会被转码为require。这也是为什么在模块导出时使用module.exports，在引入模块时使用import仍然起效，因为本质上，import会被转码为require去执行。
  + export被转换为module.exports中的元素

#### Q&A https://segmentfault.com/a/1190000012386576
+ 为何有的地方使用 require 去引用一个模块时需要加上 default？ require('xx').default
  > 这是 babel6 的前提下，在 babel5 的不会发生(因ES5中判断使用default时，给整个导出对象赋值了default的值)
  > es6 的 export default 都会被转换成 exports.default，即使这个模块只有这一个输出。 
  > 我们经常会使用 es6 的 export default 来输出模块，而且这个输出是这个模块的唯一输出，我们会误以为这种写法输出的是模块的默认输出。
  > 
    ```
    // a.js
    export default 123;
    // b.js 
    var foo = require('./a.js')//错误
    var foo = require('./a.js').default//正确
    ```
  > 导出模块
	```
	//es6 的导出模块写法有
	export default 123;
	export const a = 123;
	const b = 3;
	const c = 4;
	export { b, c };
	//babel 会将这些统统转换成 commonjs 的 exports。
	exports.default = 123;
	exports.a = 123;
	exports.b = 3;
	exports.c = 4;
	exports.__esModule = true;
	babel 转换 es6 的模块输出逻辑非常简单，即将所有输出都赋值给 exports，并带上一个标志 __esModule 表明这是个由 es6 转换来的 commonjs 输出。
	babel将模块的导出转换为commonjs规范后，也会将引入 import 也转换为 commonjs 规范。即采用 require 去引用模块，再加以一定的处理，符合es6的使用意图。
    ```
  > 引入模块
    ```
	对于最常见的
    import a from './a.js';
    在es6中 import a from './a.js' 的本意是想去引入一个 es6 模块中的 default 输出。
    
    通过babel转换后得到 var a = require(./a.js) 得到的对象却是整个对象，肯定不是 es6 语句的本意，所以需要对 a 做些改变。
    
    我们在导出提到，default 输出会赋值给导出对象的default属性。
    
    exports.default = 123;
    所以 babel 加了个 help _interopRequireDefault 函数。
    
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule
            ? obj
            : { 'default': obj };
    }
    var _a = require('assert');
    var _a2 = _interopRequireDefault(_a);
    var a = _a2['default'];
    所以这里最后的 a 变量就是 require 的值的 default 属性。如果原先就是commonjs规范的模块，那么就是那个模块的导出对象。
    ```
+ 按需加载的原理
  + import { button } from 'xx-ui' 这样会引入所有组件内容，需要添加额外的 babel 配置，比如 babel-plugin-component
    > 我们在使用各大 UI 组件库时都会被介绍到为了避免引入全部文件，请使用 babel-plugin-component 等babel 插件。
      ```
      import { Button, Select } from 'element-ui'
      ```
    > 由前文可知 import 会先转换为 commonjs， 即
      ```
      var a = require('element-ui');
      var Button = a.Button;
      var Select = a.Select;
      var a = require('element-ui'); 这个过程就会将所有组件都引入进来了。
      ```
    > 所以 babel-plugin-component就做了一件事，将 import { Button, Select } from 'element-ui' 转换成了
      ```
      import Button from 'element-ui/lib/button'
      import Select from 'element-ui/lib/select'
      ```
    > 即使转换成了 commonjs 规范，也只是引入这个组件的js，将引入量减少到最低。
      
    > 所以我们会看到几乎所有的UI组件库的目录形式都是
      ```
      |-lib    //用于按需引用
      |   |--component1
      |   |--component2
      |   |--component3
      |-index.common.js    //给 import element from 'element-ui' 这种形式调用全部组件。  
      ```
  + tree-shaking
	+ webpack2 开始引入 tree-shaking 技术，通过静态分析 es6 的语法，可以删除没有被使用的模块。他只对 es6 的模块有效，所以一旦 babel 将 es6 的模块转换成 commonjs，webpack2 将无法使用这项优化。所以要使用这项技术，我们只能使用 webpack 的模块处理，加上 babel 的es6转换能力（需要关闭模块转换）。
    + 使在 引入模块时使用了 es6 ，但是引入的那个模块却是使用 commonjs 进行输出，这也无法使用tree-shaking。
  
  
  
  
  
  
  
  
  
  