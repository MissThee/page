"use strict";
var p10Symbol;
(function (p10Symbol) {
    var _a;
    // Symbol
    // 通过Symbol构造函数创建的
    var sym1 = Symbol();
    var sym2 = Symbol("key"); // 可选的字符串key
    // Symbols是不可改变且唯一的。
    var sym3 = Symbol("key");
    var sym4 = Symbol("key");
    sym3 === sym4; // false, symbols是唯一的
    // 像字符串一样，symbols也可以被用做对象属性的键。
    var sym = Symbol();
    var obj = (_a = {},
        _a[sym] = "value",
        _a);
    console.log(obj[sym]); // "value"  //注意必须使用const声明的Symbol才能作为索引使用
    // 与计算出的属性名声明相结合来声明对象的属性和类成员
    var getClassNameSymbol = Symbol();
    var C = /** @class */ (function () {
        function C() {
        }
        C.prototype[getClassNameSymbol] = function () {
            return "C";
        };
        return C;
    }());
    var c = new C();
    var className = c[getClassNameSymbol](); // "C"
})(p10Symbol || (p10Symbol = {}));
