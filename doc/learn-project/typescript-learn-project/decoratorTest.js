"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
//装饰器
//装饰器是一个可被附加到 类声明、方法、访问符、属性、参数
//表示方法为@expression。其中expression部分若为执行的方法，结果必须为一个函数。expression会在ts编译时执行，由上至下；求取的函数会在js执行前执行，有由下至上，执行结果传递作为参数使用
//被装饰的声明信息作为参数传入
function sealed(target) {
    // do something with "target" ...
}
//装饰器工厂。返回一个装饰器，使用时需加括号，@color()
function color(value) {
    return function (target) {
        // do something with "target" and "value"...
    };
}
//装饰器求值
//类中不同声明上的装饰器将按以下规定的顺序应用：
// 1.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
// 2.参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
// 3.参数装饰器应用到构造函数。
// 4.类装饰器应用到类。
var logPre = '表达式执行顺序：\n';
var logAfer = '装饰器函数执行顺序：\n';
function logClass(log) {
    logPre += log + "\n";
    return function (target) {
        logAfer += log + "\n";
        console.log(log, target);
    };
}
function logProperty(log) {
    logPre += log + "\n";
    return function (target, attr) {
        logAfer += log + "\n";
        console.log(log, target, attr);
    };
}
function logMethod(log) {
    logPre += log + "\n";
    return function (target, propertyKey, descriptor) {
        logAfer += log + "\n";
        console.log(log, target, propertyKey, descriptor);
    };
}
function logParam(log) {
    logPre += log + "\n";
    return function (target, method, paramIndex) {
        logAfer += log + "\n";
        console.log(log, target, method, paramIndex);
    };
}
var demo1 = /** @class */ (function () {
    function demo1(p1) {
        this._param1 = 1;
        this._param1 = p1;
    }
    Object.defineProperty(demo1.prototype, "param1", {
        get: function () {
            return ++this._param1;
        },
        enumerable: false,
        configurable: true
    });
    demo1.prototype.hello = function (saySomething) {
        console.log("hello!" + saySomething);
    };
    demo1._param0 = 1;
    __decorate([
        logProperty('1、实例成员 属性')
    ], demo1.prototype, "_param1", void 0);
    __decorate([
        logMethod('2、实例成员 访问符')
    ], demo1.prototype, "param1", null);
    __decorate([
        logMethod("3、实例成员 方法"),
        __param(0, logParam("4、实例成员 方法参数"))
    ], demo1.prototype, "hello", null);
    __decorate([
        logProperty('5、静态成员 属性')
    ], demo1, "_param0", void 0);
    demo1 = __decorate([
        logClass('6、类'),
        __param(0, logParam("7、构造函数 参数"))
    ], demo1);
    return demo1;
}());
console.log("");
console.log(logPre);
console.log(logAfer);
