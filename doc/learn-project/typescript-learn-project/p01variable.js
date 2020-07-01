"use strict";
//变量声明
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
//对象解构
var obj = {
    a: "foo",
    b: 12,
    c: "bar",
    d: "test"
};
//解构赋值
var a = obj.a, b = obj.b;
console.log('输出a', a);
var c = obj.c, passthrough = __rest(obj, ["c"]);
console.log('输出passthrough', passthrough); //{ a: 'foo', b: 12, d: 'test' }
//属性重命名
// 以下语法相当于
// let newName1 = o.a;
// let newName2 = o.b;
var newName1 = obj.a, newName2 = obj.b;
console.log('输出newName1', newName1);
//解构赋值加类型
//前面的newA为属性重命名，后面的为类型指示
var newA = obj.a, newB = obj.b;
console.log('输出a', a);
function f1(_a) {
    var a = _a.a, b = _a.b;
    // ...
}
//指定默认值
(function f2(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.a, a = _c === void 0 ? "defaultValueA" : _c, _d = _b.b, b = _d === void 0 ? 100 : _d;
    console.log('f2', a, b);
})();
function f(_a) {
    var _b = _a === void 0 ? { a: "" } : _a, a = _b.a, _c = _b.b, b = _c === void 0 ? 0 : _c;
    // ...
}
f({ a: "yes" });
f();
// f({}); //错误，{}覆盖了默认参数，导致a没有被赋值
//展开
var first = [[100, 101], 2];
var second = [3, 4];
var bothPlus = __spreadArrays([0], first, second, [5]);
bothPlus[1][0] = 999;
console.log('输出first', first);
console.log('输出second', second);
console.log('输出bothPlus', bothPlus);
//覆盖现有属性
var oriObj = { food: "bread", drink: "juice" };
var newObj = __assign(__assign({}, oriObj), { food: "新的值" });
console.log('输出newObj', newObj);
// let newObj1 = {food: "noodles", ...oriObj};//报错，提示food属性总是被覆盖
//解构丢失对象内部的方法
var Clazz = /** @class */ (function () {
    function Clazz() {
        this.p = 12;
    }
    Clazz.prototype.m = function () { };
    return Clazz;
}());
var clazz = new Clazz();
var clone = __assign({}, clazz);
clone.p;
// clone.m(); //解构会丢失内部的方法
