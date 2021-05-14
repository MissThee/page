# 模块化规范

## CommonJs

+ 一个单独的文件就是一个模块。每个模块内部，约定`module`变量代表当前模块，是一个对象，它的exports属性（即module.exports）约定是对外的接口
+ 加载模块使用`require`方法，该方法读取一个文件并执行，最后返回文件内部的exports对象。
+ require 是同步的。(像Node.js主要用于服务器的编程，加载的模块文件在本地硬盘，加载快，不用考虑异步加载的方式，CommonJS规范比较适用。

+ 使用举例

  ```js
  // NodeJS
  // 定义模块
  // math.js
  function add(a, b) {
      return a + b
  }
  
  module.exports = {add: add}
  
  // 引用模块
  var math = require('math');
  math.add(2, 3);
  ```

## AMD / CMD

+ AMD是RequireJS在推广过程中对模块定义的规范化产出。
+ AMD标准中，定义了下面两个API
    1. ```define(id, [depends], callback)``` define定义模块
    2. ```require([module], callback)``` require加载模块

  ```js
  // AMD
  //下载引入require.js，配置引入的依赖文件
  <script src="xxx/require.js" defer async="true" data-main="要加载的js依赖文件"></script>
  define(function () {
      var name = function (str) {
          alert("I am " + str);
      }
      var age = function (num) {
          alert("I am " + num + " years old");
      }
      return {
          name: name,
          age: age
      };
  });
  require(['alert'], function (alert) { // AMD推崇依赖前置。依赖必须一开始就写好  
      alert.name('JohnZhu');
      alert.age(21);
  });
  ```

+ CMD是SeaJS在推广过程中对模块定义的规范化产出。

  ```js
  //CMD
  //下载引入sea.js，配置引入的依赖文件
  <script src="xxx/sea.js"></script>
  // seajs 的简单配置
  seajs.config({
      base: "../sea-modules/",
      alias: {
          "jquery": "jquery/jquery/1.10.1/jquery.js"
      }
  })
  // 加载入口模块
  seajs.use("../static/hello/src/main")
  // 所有模块都通过 define 来定义
  define(function (require, exports, module) {
      var Spinning = require('./spinning');// 通过 require 引入依赖。依赖可即用即引
      // 通过 exports 对外提供接口
      exports.doSomething = 'test'
      // 或 通过 module.exports 提供整个接口
      // module.exports = {doSomething: 'test'}
  });
  ```

## UMD

+ 兼容AMD和commonJS规范的同时，还兼容全局引用的方式

  ```js
  (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
          //AMD
          define(['jquery'], factory);
      } else if (typeof exports === 'object') {
          //Node, CommonJS之类的
          module.exports = factory(require('jquery'));
      } else {
          //浏览器全局变量(root 即 window)
          root.returnExports = factory(root.jQuery);
      }
  }(this, function ($) {
      //方法
      function myFunc() {
      };
      //暴露公共方法
      return myFunc;
  }));
  ```

## ES6

+ `import`/`export`

   ```js
   // export 导出
   export default {a: 1} // 相当于导出一个名称为default的方法
   export const b = 1
   
   export function add() {
   }
   
   // import 导入 可被静态分析，同步执行
   import math from 'math.js' // 可使用math.a (相当于引入了math中的default)
   import {b, add} from 'math.js' // 可使用b, add
   import * as math from 'math.js' // 可使用math.default.a, b, add
   ```

   ```js
   // import命令具有提升效果，会提升到整个模块的头部，首先执行。且import不能放在if等分支语句中，会报语法错
   foo();
   import {foo} from 'my_module'; // 会先执行
   ```

+ import()

  ```js
  // import()函数导入可使用在任意位置。无法静态分析
  import('xxx/module.js').then((module => {
      module.xxx
  }))
  ```

# 模块引入与导出

+ `import`/`export`
    + ES6规范
+ `require`/`module.exports`
    + CommonJs规范，其中module.exports是一个对象{}
+ 目前所有的引擎都还没有实现import，在node中使用babel支持ES6。也仅仅是将ES6转码为ES5再执行。
    + import语法会被转码为require。这也是为什么在模块导出时使用module.exports，在引入模块时使用import仍然起效，因为本质上，import会被转码为require去执行。
    + export被转换为module.exports中的元素

# Q&A

+ 为何有的地方使用 require 去引用一个模块时需要加上 default？ 即require('xx').default（https://segmentfault.com/a/1190000012386576）
    + 这是 babel6 的前提下，在 babel5 的不会发生：因babel5中有hack方法，判断使用default时，将原导出对象的.default中内容作为了最终导出对象
      (es6的export default xxx 本意是导出一个名为default的对象，转义后应为exports.default。使用require本应增加.default)

      ```js
      // a.js
      export default 123;
      // b.js 
      var foo = require('./a.js')//babel5正确
      var foo = require('./a.js').default//babel6正确
      ```

    + babel导出模块转换过程

      ```js  
      import a from './a.js';
      // 在es6中 import a from './a.js' 的本意是想去引入一个 es6 模块中的 default 输出。
      // 通过babel5转换后得到 var a = require(./a.js) 得到的对象却是整个对象，肯定不是 es6 语句的本意，所以需要对 a 做些改变。
      // 我们在导出提到 default 输出会赋值给导出对象的default属性。
      // exports.default = 123; 所以 babel5 有一个 help _interopRequireDefault 函数。
    
      // 所以这里最后的 a 变量就是 require 的值的 default 属性。如果原先就是commonjs规范的模块，那么就是那个模块的导出对象。
      ```
    + babel5与babel6转码对比
        + 只有一个`export default xxx`时
          ```js
          // js文件
          import subModel from 'sub.js';
          export default subModel;
    
          // babel5 转义
          // 导入
          var _sub = _interopRequireDefault(require('sub.js'));
          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
          // 导出
          Object.defineProperty(exports, '__esModule', {
            value: true
          });
          exports.default = _sub.default;
          module.exports = _sub['default'];
          
          // babel6 转义
          "use strict";
          // 导入
          var _sub = _interopRequireDefault(require("sub.js"));
          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
          // 导出
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.default = _sub.default;
          // babel 转换 es6 的模块输出逻辑非常简单：将所有输出都赋值给 exports，并带上一个标志 __esModule 表明这是个由 es6 转换来的。
          // babel将模块的导出转换为commonjs规范后，也会将引入 import 也转换为 commonjs 规范。即采用 require 去引用模块。
          ```
        + 其他`export`情况5、6相同
           ```js
           // js文件
           export default 1;
           export const a = 2;
           const b = 3;
           const c = 4;
           export {b, c};
           
           // babel 转义
           // define(["exports", "module"], function (exports, module) {
               Object.defineProperty(exports, "__esModule", {
                   value: true
               });
               exports.default = 1;
               exports.a = 2;
               exports.b = 3;
               exports.c = 4;
           // });
           ```  
+ 按需加载的原理
    + `import { button } from 'xx-ui'` 这样会引入所有组件内容，需要添加额外的 babel 配置，比如 babel-plugin-component。
    + 引入全部组件的原因：
        + 由前文可知 import 会先转换为 commonjs， 即
          ```js
          import { Button, Select } from 'element-ui'
          // 转为
          var a = require('element-ui');
          var Button = a.Button;
          var Select = a.Select;
          var a = require('element-ui'); //这个过程就会将所有组件都引入进来了。
          ```
        + 所以 babel-plugin-component就做了转换
          ```js
          import { Button, Select } from 'element-ui'
          // 使用babel-plugin-component，转为
          import Button from 'element-ui/lib/button'
          import Select from 'element-ui/lib/select'
          ```
        + 即使转换成了 commonjs 规范，也只是引入这个组件的js，将引入量减少到最低。

        + 所以我们会看到几乎所有的UI组件库的目录形式都是
          ```
          |-lib    //用于按需引用
          |   |--component1
          |   |--component2
          |   |--component3
          |-index.common.js    //用于 import element from 'element-ui' 这种形式调用全部组件。  
          ```
    + tree-shaking
        + webpack2 开始引入 tree-shaking 技术，通过静态分析 es6 的语法，可以删除没有被使用的模块。他只对 es6 的模块有效，所以一旦 babel 将 es6 的模块转换成 commonjs，webpack2 将无法使用这项优化。所以要使用这项技术，我们只能使用 webpack 的模块处理，加上 babel 的es6转换能力（需要关闭模块转换）。
        + tree-shaking生效的前提条件：
            + 使用es6的import方式引入组件
            + 被引入的组件使用es6语法。使用import引用依赖，使用export输出
            + 被引入的组件使用es6语法，且没有被babel转义成commonjs，babel编译默认将模块转换为commonjs，需要配置.babelrc的{module:false} 和 package.json的{sideEffects: false}才可以进行tree-shaking

+ 直接import 'xxx'的效果 https://segmentfault.com/q/1010000010264149
    + ES6的import语法暂时不被nodejs支持，所以此处import都是由Webpack实现的
    + 直接引入import xxx.js或者import xxx.css会像添加`<script>`和`<link>`标签一样注入到全局中去，所以是全局可用的
    + import xxx和import xx from xxx为ES6的模块导入语法
      + import xxx直接导入整个模块，而import xx from xxx导入默认导出项，并给默认导出项一个具体名字
    + import 'jquery'或者import $ from 'jquery'不能直接在Vue全局使用，是因为组件模块化，import进去的模块，只能在写了import的那个文件里可用
    + 而import 'bootstrap'直接引入是可用的，这是因为jquery和bootstrap的引入的内容不同：
        + jquery引入的东西，是通过export导出的类，也就是说，其实引入的是一个叫jQuery或者简写成$的类
        + 而bootstrap，引入的东西，是CSS样式文件和JS代码文件，没有导出任何模块。在Vue项目里，直接import xxx.css和直接import xxx.js可以起到和一般网页中<link href="xxx.css">或<script src="xxx.js">标签相同的效果，而且这样导进去的CSS和JS是全局的，也就是说，对于bootstrap，导入的东西不是模块通过export（module.exports）暴露出来的数据，而是一整个CSS和JS文件，所以它是全局可用的  
  
  
  
  
  
  
  