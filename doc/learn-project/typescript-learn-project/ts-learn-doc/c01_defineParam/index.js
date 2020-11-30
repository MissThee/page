"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = [1, 2, 3, 4], first = _a[0], rest = _a.slice(1);
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
var _b = [1, 2, 3, 4], second = _b[1], fourth = _b[3];
console.log(second); // outputs 1
console.log(fourth); // outputs 4
var o = {
    a: "foo",
    b: 12,
    c: "bar",
    d: 13,
};
var a = o.a, b = o.b;
var newName1 = o.a, newName2 = o.b; //解构赋值时重命名
var c = o.c, d = o.d; //解构赋值时指定类型
// 默认值
function keepWholeObject(wholeObject) {
    //当b为undefined时，使用缺省值
    var a = wholeObject.a, _a = wholeObject.b, b = _a === void 0 ? 1001 : _a;
}
function f(_a) {
    var a = _a.a, b = _a.b;
}
// 函数声明，参数有默认值。注意多层默认值嵌套会让代码难以理解，尽量少使用
function fd(_a) {
    var _b = _a === void 0 ? { a: "" } : _a, a = _b.a, _c = _b.b, b = _c === void 0 ? 0 : _c;
}
fd({ a: "yes" }); // ok, default b = 0
fd(); // ok, default to {a: ""}, which then defaults b = 0
// fd({}); // error, 'a' is required if you supply an argument
// 对象展开
var defaults = {
    food: "apple",
    price: 123,
    ambiance: "noisy",
    sell: function () {
        alert('买苹果咯');
    }
};
var newObj = __assign({ food: "banana" }, defaults);
console.log(newObj); // newObj中 food会被覆盖为apple，其中不可枚举的元素sell()方法会丢失
